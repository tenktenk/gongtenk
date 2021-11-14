package visuals

import (
	gongleaflet_models "github.com/fullstack-lang/gongleaflet/go/models"
)

var IndividualLayerGroup = (&gongleaflet_models.LayerGroup{
	Name: "Individual",
}).StageCopy()

var CitiesLayerGroup = (&gongleaflet_models.LayerGroup{
	Name: "Cities",
}).StageCopy()

var TwinCitiesLayerGroup = (&gongleaflet_models.LayerGroup{
	Name: "TwinCities",
}).StageCopy()
