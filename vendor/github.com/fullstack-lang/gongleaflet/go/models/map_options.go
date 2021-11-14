package models

// MapOptions provides all necessary elements to the front to display a track
//
// swagger:model MapOptions
type MapOptions struct {
	Lat, Lng  float64 // map center
	Name      string
	ZoomLevel float64 // zoom level at the initialisation

	UrlTemplate        string
	Attribution        string
	MaxZoom            int
	ZoomControl        bool
	AttributionControl bool
	ZoomSnap           int

	// swagger:ignore
	// access to the models instance that contains the original information
	MapOptionsInterface MapOptionsInterface `gorm:"-"`

	// List of LayerGroups that can be displayed for this map
	LayerGroupUses []*LayerGroupUse
}

type MapOptionsInterface interface {
	GetLat() (lat float64)
	GetLng() (lng float64)
	GetName() (name string)

	GetZoomLevel() (lng float64)
}
