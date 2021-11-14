package models

type City struct {
	Name       string
	Lat        float64
	Lng        float64
	TwinLat    float64
	TwinLng    float64
	Population int
	Twin       bool // false if this is the original city, true if it has been translated
	Country    *Country
}

// functions to satisty the visual interface for track
func (city *City) GetLat() float64     { return city.Lat }
func (city *City) GetLng() float64     { return city.Lng }
func (city *City) GetHeading() float64 { return 0.0 }

// speed is displayed in tens of nautical miles
func (city *City) GetSpeed() float64 {
	return 0.0 / 18.52
}
func (city *City) GetVerticalSpeed() float64 { return 0.0 }
func (city *City) GetLevel() float64         { return 0.0 }
func (city *City) GetName() (name string)    { return city.Name }

func (city *City) GetLayerGroupName() (layerName string) {

	if !city.Twin {
		layerName = "Cities"
	} else {
		layerName = "TwinCities"
	}
	return
}

func (city *City) GetDisplay() bool { return true }
