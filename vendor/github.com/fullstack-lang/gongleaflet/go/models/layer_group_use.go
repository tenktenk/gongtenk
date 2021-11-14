package models

// LayerGroupUse allows a MANY-MANY asociation to LayerGroup
//
// swagger:model layerGroupUse
type LayerGroupUse struct {
	Name string

	// indicate wether to display the layer
	Display bool

	LayerGroup *LayerGroup
}
