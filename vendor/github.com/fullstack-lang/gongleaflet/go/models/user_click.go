package models

import "time"

type UserClick struct {
	Name        string
	Lat, Lng    float64
	TimeOfClick time.Time
}
