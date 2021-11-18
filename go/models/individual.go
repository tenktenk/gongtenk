package models

type Individual struct {
	Name    string
	Lat     float64
	Lng     float64
	TwinLat float64
	TwinLng float64
	Twin    bool // false if this is the original individual, true if it has been translated
}

// functions to satisty the visual interface for track
func (individual *Individual) GetLat() float64 { return individual.Lat }
func (individual *Individual) GetLng() float64 { return individual.Lng }

func (individual *Individual) GetName() (name string) { return individual.Name }

func (individual *Individual) GetLayerGroupName() (layerName string) {

	if !individual.Twin {
		layerName = "Cities"
	} else {
		layerName = "TwinCities"
	}
	return
}

func (individual *Individual) GetDisplay() bool { return true }
