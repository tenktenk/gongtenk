package models

// Marker provides all necessary elements to the front to display a track
//
// L.Marker is used to display clickable/draggable icons on the map. Extends Layer.
//
// swagger:model Marker
type Marker struct {
	Lat, Lng float64
	Name     string

	ColorEnum ColorEnum

	// LayerGroup the object belongs to
	LayerGroup *LayerGroup

	// DivIcon
	DivIcon *DivIcon

	// swagger:ignore
	// access to the models instance that contains the original information
	MarkerInteface MarkerInterface `gorm:"-"`
}

type MarkerInterface interface {
	GetLat() (lat float64)
	GetLng() (lng float64)
	GetName() (name string)
	GetLayerGroupName() string
}

func (marker *Marker) UpdateMarker() {
	if marker.MarkerInteface != nil {
		marker.Name = marker.MarkerInteface.GetName()

		marker.Lat = marker.MarkerInteface.GetLat()
		marker.Lng = marker.MarkerInteface.GetLng()

		marker.LayerGroup =
			computeLayerGroupFromLayerGroupName(marker.MarkerInteface.GetLayerGroupName())
	}
}
