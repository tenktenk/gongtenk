// insertion point for imports
import { LayerGroupDB } from './layergroup-db'

// usefull for managing pointer ID values that can be nullable
import { NullInt64 } from './null-int64'

export class CircleDB {
	CreatedAt?: string
	DeletedAt?: string
	ID: number = 0

	// insertion point for basic fields declarations
	Lat: number = 0
	Lng: number = 0
	Name: string = ""
	Radius: number = 0
	ColorEnum: string = ""
	DashStyleEnum: string = ""

	// insertion point for other declarations
	LayerGroup?: LayerGroupDB
	LayerGroupID: NullInt64 = new NullInt64 // if pointer is null, LayerGroup.ID = 0

}
