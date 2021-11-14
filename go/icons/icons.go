package icons

import (
	_ "embed"

	gongleaflet_models "github.com/fullstack-lang/gongleaflet/go/models"
)

//go:embed airplane.svg
var airplane string
var Airplane *gongleaflet_models.DivIcon = (&gongleaflet_models.DivIcon{
	Name: "Airplane",
	SVG:  airplane,
}).StageCopy()

//go:embed Airport.svg
var airport string
var Airport *gongleaflet_models.DivIcon = (&gongleaflet_models.DivIcon{
	Name: "Airport",
	SVG:  airport,
}).StageCopy()

//go:embed antena.svg
var antena string
var Antena *gongleaflet_models.DivIcon = (&gongleaflet_models.DivIcon{
	Name: "Antena",
	SVG:  antena,
}).StageCopy()

//go:embed message.svg
var message string
var Message *gongleaflet_models.DivIcon = (&gongleaflet_models.DivIcon{
	Name: "Message",
	SVG:  message,
}).StageCopy()

//go:embed air_traffic_controler.svg
var air_traffic_controler string
var AirTrafficControler *gongleaflet_models.DivIcon = (&gongleaflet_models.DivIcon{
	Name: "AirTrafficControler",
	SVG:  air_traffic_controler,
}).StageCopy()

//go:embed dot_blur.svg
var dot_blur string
var DotBlur *gongleaflet_models.DivIcon = (&gongleaflet_models.DivIcon{
	Name: "DotBlur",
	SVG:  dot_blur,
}).StageCopy()

//go:embed dot_10.svg
var dot_10 string
var Dot_10 *gongleaflet_models.DivIcon = (&gongleaflet_models.DivIcon{
	Name: "Dot_10",
	SVG:  dot_10,
}).StageCopy()

//go:embed dot_25.svg
var dot_25 string
var Dot_25 *gongleaflet_models.DivIcon = (&gongleaflet_models.DivIcon{
	Name: "Dot_25",
	SVG:  dot_25,
}).StageCopy()

//go:embed radar.svg
var radar string
var Radar *gongleaflet_models.DivIcon = (&gongleaflet_models.DivIcon{
	Name: "Radar",
	SVG:  radar,
}).StageCopy()

//go:embed arrow_simple.svg
var arrow_simple string
var Arrow *gongleaflet_models.DivIcon = (&gongleaflet_models.DivIcon{
	Name: "Arrow",
	SVG:  arrow_simple,
}).StageCopy()

//go:embed cross_rot45.svg
var cross_rot45 string
var Cross *gongleaflet_models.DivIcon = (&gongleaflet_models.DivIcon{
	Name: "Cross",
	SVG:  cross_rot45,
}).StageCopy()
