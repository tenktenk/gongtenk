package icons

import (
	_ "embed"

	gongleaflet_models "github.com/fullstack-lang/gongleaflet/go/models"
)

//go:embed air_traffic_controler.svg
var air_traffic_controler string
var AirTrafficControler *gongleaflet_models.DivIcon = (&gongleaflet_models.DivIcon{
	Name: "Airport",
	SVG:  air_traffic_controler,
}).Stage()

//go:embed airport.svg
var airport string
var Airport *gongleaflet_models.DivIcon = (&gongleaflet_models.DivIcon{
	Name: "Airport",
	SVG:  airport,
}).Stage()

//go:embed airplane.svg
var airplane string
var Airplane *gongleaflet_models.DivIcon = (&gongleaflet_models.DivIcon{
	Name: "Airplane",
	SVG:  airplane,
}).Stage()

//go:embed radar.svg
var radar string
var Radar *gongleaflet_models.DivIcon = (&gongleaflet_models.DivIcon{
	Name: "Radar",
	SVG:  radar,
}).Stage()

//go:embed antena.svg
var antena string
var Antena *gongleaflet_models.DivIcon = (&gongleaflet_models.DivIcon{
	Name: "Antena",
	SVG:  antena,
}).Stage()

//go:embed message.svg
var message string
var Message *gongleaflet_models.DivIcon = (&gongleaflet_models.DivIcon{
	Name: "Message",
	SVG:  message,
}).Stage()

//go:embed dot_blur.svg
var dot_blur string
var DotBlur *gongleaflet_models.DivIcon = (&gongleaflet_models.DivIcon{
	Name: "DotBlur",
	SVG:  dot_blur,
}).Stage()

//go:embed arrow_simple.svg
var arrow_simple string
var Arrow *gongleaflet_models.DivIcon = (&gongleaflet_models.DivIcon{
	Name: "Arrow",
	SVG:  arrow_simple,
}).Stage()

//go:embed cross_rot45.svg
var cross_rot45 string
var Cross *gongleaflet_models.DivIcon = (&gongleaflet_models.DivIcon{
	Name: "Cross",
	SVG:  cross_rot45,
}).Stage()

//go:embed dot_10.svg
var dot_10 string
var Dot_10Icon *gongleaflet_models.DivIcon = (&gongleaflet_models.DivIcon{
	Name: "Dot10",
	SVG:  dot_10,
}).Stage()
