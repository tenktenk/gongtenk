package models

// Configuration is the singloton
type Configuration struct {
	Name string

	// user request
	NumberOfCitiesToDisplay int
}

var ConfigurationSingloton = (&Configuration{
	Name:                    "Gong Tenk Configuration",
	NumberOfCitiesToDisplay: 2,
}).Stage()
