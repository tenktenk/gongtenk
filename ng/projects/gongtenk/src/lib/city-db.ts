// insertion point for imports
import { CountryDB } from './country-db'

// usefull for managing pointer ID values that can be nullable
import { NullInt64 } from './null-int64'

export class CityDB {
	CreatedAt?: string
	DeletedAt?: string
	ID: number = 0

	// insertion point for basic fields declarations
	Name: string = ""
	Lat: number = 0
	Lng: number = 0
	TwinLat: number = 0
	TwinLng: number = 0
	Population: number = 0
	Twin: boolean = false

	// insertion point for other declarations
	Country?: CountryDB
	CountryID: NullInt64 = new NullInt64 // if pointer is null, Country.ID = 0

}
