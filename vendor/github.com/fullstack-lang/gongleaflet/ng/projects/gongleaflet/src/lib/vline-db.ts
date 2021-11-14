// insertion point for imports
import { LayerGroupDB } from './layergroup-db'

// usefull for managing pointer ID values that can be nullable
import { NullInt64 } from './null-int64'

export class VLineDB {
	CreatedAt?: string
	DeletedAt?: string
	ID: number = 0

	// insertion point for basic fields declarations
	StartLat: number = 0
	StartLng: number = 0
	EndLat: number = 0
	EndLng: number = 0
	Name: string = ""
	ColorEnum: string = ""
	DashStyleEnum: string = ""
	IsTransmitting: string = ""
	Message: string = ""
	IsTransmittingBackward: string = ""
	MessageBackward: string = ""

	// insertion point for other declarations
	LayerGroup?: LayerGroupDB
	LayerGroupID: NullInt64 = new NullInt64 // if pointer is null, LayerGroup.ID = 0

}
