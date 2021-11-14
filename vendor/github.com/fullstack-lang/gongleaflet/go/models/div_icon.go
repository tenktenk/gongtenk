package models

// DivIcon is the go implementation of the leaflet DivIcon object
//
// swagger:model DivIcon
type DivIcon struct {
	Name string

	SVG string // the SVG description

	// swagger:ignore
	// access to the models instance that contains the original information
	DivIconInterface DivIconInterface `gorm:"-"`
}

type DivIconInterface interface {
	GetIconName() (name string)
	GetSVG() (name string)
}

func (divIcon *DivIcon) UpdateVisualIcon() {
	if divIcon.DivIconInterface != nil {
		divIcon.Name = divIcon.DivIconInterface.GetIconName()
	}
}
