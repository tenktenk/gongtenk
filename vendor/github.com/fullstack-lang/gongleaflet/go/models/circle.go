package models

// Circle provides all necessary elements to the front to display a track
//
// swagger:model Circle
type Circle struct {
	Lat, Lng float64
	Name     string

	Radius float64

	ColorEnum     ColorEnum
	DashStyleEnum DashStyleEnum

	// LayerGroup the object belongs to
	LayerGroup *LayerGroup

	// swagger:ignore
	// access to the models instance that contains the original information
	Circle CircleInterface `gorm:"-"`
}

type CircleInterface interface {
	GetLat() (lat float64)
	GetLng() (lng float64)
	GetRadius() (lng float64)

	GetName() (name string)
}

func (VisualCircle *Circle) UpdateCircle() {
	if VisualCircle.Circle != nil {
		VisualCircle.Name = VisualCircle.Circle.GetName()

		VisualCircle.Lat = VisualCircle.Circle.GetLat()
		VisualCircle.Lng = VisualCircle.Circle.GetLng()

		VisualCircle.Radius = VisualCircle.Circle.GetRadius()

		VisualCircle.LayerGroup = DefaultLayerGroup
	}
}
