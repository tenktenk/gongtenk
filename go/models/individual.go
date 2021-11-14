package models

type Individual struct {
	Name string
	Lat  float64
	Lng  float64
	Twin bool // false if this is the original individual, true if it has been translated
}
