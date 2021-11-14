// insertion point for imports

// usefull for managing pointer ID values that can be nullable
import { NullInt64 } from './null-int64'

export class UserClickDB {
	CreatedAt?: string
	DeletedAt?: string
	ID: number = 0

	// insertion point for basic fields declarations
	Name: string = ""
	Lat: number = 0
	Lng: number = 0
	TimeOfClick: Date = new Date

	// insertion point for other declarations
}
