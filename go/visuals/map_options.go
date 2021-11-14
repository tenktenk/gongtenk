package visuals

import (
	gongleaflet_models "github.com/fullstack-lang/gongleaflet/go/models"
)

var MapOptionsFrance = (&gongleaflet_models.MapOptions{

	Name:               "Whole France",
	Lat:                45,
	Lng:                4,
	ZoomLevel:          6,
	ZoomControl:        false,
	AttributionControl: true,
	ZoomSnap:           1,
	UrlTemplate:        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
	Attribution:        "osm",
	MaxZoom:            18,
	LayerGroupUses: []*gongleaflet_models.LayerGroupUse{
		FranceMapOptionsIndividualLayerGroupUse,
		FranceMapOptionsCitiesLayerGroupUse,
		FranceMapOptionsCitiesTwinLayerGroupUse,
	},
}).Stage()

var FranceMapOptionsIndividualLayerGroupUse = (&gongleaflet_models.LayerGroupUse{
	Name:       "Individual",
	LayerGroup: IndividualLayerGroup,
	Display:    true,
}).StageCopy()

var FranceMapOptionsCitiesLayerGroupUse = (&gongleaflet_models.LayerGroupUse{
	Name:       "Cities",
	LayerGroup: CitiesLayerGroup,
	Display:    true,
}).StageCopy()

var FranceMapOptionsCitiesTwinLayerGroupUse = (&gongleaflet_models.LayerGroupUse{
	Name:       "TwinCities",
	LayerGroup: TwinCitiesLayerGroup,
	Display:    true,
}).StageCopy()

var MapOptionsHaiti = (&gongleaflet_models.MapOptions{

	Name:               "Whole Haiti",
	Lat:                18.5,
	Lng:                -72.3,
	ZoomLevel:          6,
	ZoomControl:        false,
	AttributionControl: true,
	ZoomSnap:           1,
	UrlTemplate:        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
	Attribution:        "osm",
	MaxZoom:            18,
	LayerGroupUses: []*gongleaflet_models.LayerGroupUse{
		HaitiMapOptionsIndividualLayerGroupUse,
		HaitiMapOptionsCitiesLayerGroupUse,
		HaitiMapOptionsCitiesTwinLayerGroupUse,
	},
}).Stage()

var HaitiMapOptionsIndividualLayerGroupUse = (&gongleaflet_models.LayerGroupUse{
	Name:       "Individual",
	LayerGroup: IndividualLayerGroup,
	Display:    true,
}).StageCopy()

var HaitiMapOptionsCitiesLayerGroupUse = (&gongleaflet_models.LayerGroupUse{
	Name:       "Cities",
	LayerGroup: CitiesLayerGroup,
	Display:    true,
}).StageCopy()

var HaitiMapOptionsCitiesTwinLayerGroupUse = (&gongleaflet_models.LayerGroupUse{
	Name:       "TwinCities",
	LayerGroup: TwinCitiesLayerGroup,
	Display:    true,
}).StageCopy()
