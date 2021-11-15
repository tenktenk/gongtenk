package main

import (
	"embed"
	"flag"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"

	// for carto display
	gongleaflet_controllers "github.com/fullstack-lang/gongleaflet/go/controllers"
	gongleaflet_models "github.com/fullstack-lang/gongleaflet/go/models"
	gongleaflet_orm "github.com/fullstack-lang/gongleaflet/go/orm"
	_ "github.com/fullstack-lang/gongleaflet/ng"

	gongtenk "github.com/tenktenk/gongtenk"

	_ "github.com/tenktenk/gongtenk/go/icons"

	gongtenk_controllers "github.com/tenktenk/gongtenk/go/controllers"
	gongtenk_models "github.com/tenktenk/gongtenk/go/models"
	gongtenk_orm "github.com/tenktenk/gongtenk/go/orm"
	gongtenk_visuals "github.com/tenktenk/gongtenk/go/visuals"

	gongxlsx_controllers "github.com/fullstack-lang/gongxlsx/go/controllers"
	gongxlsx_models "github.com/fullstack-lang/gongxlsx/go/models"
	gongxlsx_orm "github.com/fullstack-lang/gongxlsx/go/orm"
	_ "github.com/fullstack-lang/gongxlsx/ng"
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

	ReadCitiesFromExcel()

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
