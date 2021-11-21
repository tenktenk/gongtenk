package xlread

import (
	"fmt"
	"io/ioutil"
	"log"
	"strconv"

	gongxlsx_models "github.com/fullstack-lang/gongxlsx/go/models"
	gongtenk_models "github.com/tenktenk/gongtenk/go/models"

	translate_models "github.com/tenktenk/translate/go/models"
)

func ReadCitiesFromExcel() {

	// load cities
	file := new(gongxlsx_models.XLFile).Stage()
	file.Open("worldcities_fra_hti.xlsx")

	// setup translation
	translate_models.Info.SetOutput(ioutil.Discard)

	// load tenk translation
	currentTranslation := translate_models.GetTranslateCurrent()

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
		city.DisplayName = fmt.Sprintf("%s %.0f!%.0f", city.Name, xSpread*100.0, ySpread*100.0)

		latTarget, lngTarget := currentTranslation.LatLngToXYInTargetCountry(xSpread, ySpread)
		city.TwinLat = latTarget
		city.TwinLng = lngTarget

		twinCity := new(gongtenk_models.City).Stage()
		*twinCity = *city
		twinCity.Lat = city.TwinLat
		twinCity.Lng = city.TwinLng
		twinCity.Twin = true
	}
}
