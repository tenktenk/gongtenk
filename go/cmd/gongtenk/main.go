package main

import (
	"embed"
	"flag"
	"fmt"
	"io/fs"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"

	// for carto display
	gongleaflet_controllers "github.com/fullstack-lang/gongleaflet/go/controllers"
	gongleaflet_models "github.com/fullstack-lang/gongleaflet/go/models"
	gongleaflet_orm "github.com/fullstack-lang/gongleaflet/go/orm"
	_ "github.com/fullstack-lang/gongleaflet/ng"

	gongtenk "github.com/thomaspeugeot/gongtenk"

	_ "github.com/thomaspeugeot/gongtenk/go/icons"

	gongtenk_controllers "github.com/thomaspeugeot/gongtenk/go/controllers"
	gongtenk_models "github.com/thomaspeugeot/gongtenk/go/models"
	gongtenk_orm "github.com/thomaspeugeot/gongtenk/go/orm"
	gongtenk_visuals "github.com/thomaspeugeot/gongtenk/go/visuals"

	gongxlsx_controllers "github.com/fullstack-lang/gongxlsx/go/controllers"
	gongxlsx_models "github.com/fullstack-lang/gongxlsx/go/models"
	gongxlsx_orm "github.com/fullstack-lang/gongxlsx/go/orm"
	_ "github.com/fullstack-lang/gongxlsx/ng"

	"github.com/thomaspeugeot/tkv/translation"
	// load visuals package
)

var (
	logDBFlag  = flag.Bool("logDB", false, "log mode for db")
	logGINFlag = flag.Bool("logGIN", false, "log mode for gin")
	apiFlag    = flag.Bool("api", false, "it true, use api controllers instead of default controllers")
)

func main() {

	log.SetPrefix("gongtenk: ")
	log.SetFlags(0)

	// parse program arguments
	flag.Parse()

	// setup controlers
	if !*logGINFlag {
		myfile, _ := os.Create("/tmp/server.log")
		gin.DefaultWriter = myfile
	}
	r := gin.Default()
	r.Use(cors.Default())

	// setup GORM
	db := gongtenk_orm.SetupModels(*logDBFlag, ":memory:")
	dbDB, err := db.DB()

	// since the stack can be a multi threaded application. It is important to set up
	// only one open connexion at a time
	if err != nil {
		panic("cannot access DB of db" + err.Error())
	}
	dbDB.SetMaxOpenConns(1)

	// add gongleaflet database
	gongleaflet_orm.AutoMigrate(db)
	gongxlsx_orm.AutoMigrate(db)

	gongtenk_controllers.RegisterControllers(r)
	gongleaflet_controllers.RegisterControllers(r)
	gongxlsx_controllers.RegisterControllers(r)

	// provide the static route for the angular pages
	r.Use(static.Serve("/", EmbedFolder(gongtenk.NgDistNg, "ng/dist/ng")))
	r.NoRoute(func(c *gin.Context) {
		fmt.Println(c.Request.URL.Path, "doesn't exists, redirect on /")
		c.Redirect(http.StatusMovedPermanently, "/")
		c.Abort()
	})

	// load cities
	file := new(gongxlsx_models.XLFile).Stage()
	file.Open("worldcities_fra_hti.xlsx")

	// load tenk translation
	currentTranslation := translation.GetTranslateCurrent()

	// setup translation
	translation.Info.SetOutput(ioutil.Discard)

	log.Printf("Created translation")

	citiesSheet := file.Sheets[0]
	for idx, row := range citiesSheet.Rows {
		if idx == 0 {
			continue
		}
		fmt.Printf(".")
		city := new(gongtenk_models.City).Stage()
		city.Name = row.Cells[0].Name
		if lat, err := strconv.ParseFloat(row.Cells[2].Name, 64); err == nil {
			city.Lat = lat
		}
		if lng, err := strconv.ParseFloat(row.Cells[3].Name, 64); err == nil {
			city.Lng = lng
		}
		if population, err := strconv.ParseInt(row.Cells[9].Name, 10, 64); err == nil {
			city.Population = int(population)
		}

		countryString := row.Cells[4].Name
		country := gongtenk_models.Stage.Countrys_mapString[countryString]
		if country == nil {
			country = (&gongtenk_models.Country{
				Name: countryString,
			}).Stage()
		}
		city.Country = country

		if countryString == "France" {
			currentTranslation.SetSourceCountry("fra")
			currentTranslation.SetTargetCountry("hti")
		} else {
			currentTranslation.SetSourceCountry("hti")
			currentTranslation.SetTargetCountry("fra")
		}
		_, _, _, xSpread, ySpread, _ :=
			currentTranslation.BodyCoordsInSourceCountry(city.Lat, city.Lng)

		latTarget, lngTarget := currentTranslation.LatLngToXYInTargetCountry(xSpread, ySpread)
		city.TwinLat = latTarget
		city.TwinLng = lngTarget

		twinCity := new(gongtenk_models.City).Stage()
		*twinCity = *city
		twinCity.Lat = city.TwinLat
		twinCity.Lng = city.TwinLng
		twinCity.Twin = true
	}

	log.Printf("Created cities")
	log.Printf("Attached cities to visual counterparts")

	gongtenk_models.Stage.Commit()
	gongleaflet_models.Stage.Commit()
	gongxlsx_models.Stage.Commit()

	gongtenk_visuals.StartVisualObjectRefresherThread()

	log.Printf("Server ready serve on localhost:8080")
	r.Run()
}

type embedFileSystem struct {
	http.FileSystem
}

func (e embedFileSystem) Exists(prefix string, path string) bool {
	_, err := e.Open(path)
	return err == nil
}

func EmbedFolder(fsEmbed embed.FS, targetPath string) static.ServeFileSystem {
	fsys, err := fs.Sub(fsEmbed, targetPath)
	if err != nil {
		panic(err)
	}
	return embedFileSystem{
		FileSystem: http.FS(fsys),
	}
}
