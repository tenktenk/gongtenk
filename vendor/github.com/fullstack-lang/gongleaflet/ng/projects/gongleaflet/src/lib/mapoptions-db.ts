// insertion point for imports
import { LayerGroupUseDB } from './layergroupuse-db'

// usefull for managing pointer ID values that can be nullable
import { NullInt64 } from './null-int64'

export class MapOptionsDB {
	CreatedAt?: string
	DeletedAt?: string
	ID: number = 0

	// insertion point for basic fields declarations
	Lat: number = 0
	Lng: number = 0
	Name: string = ""
	ZoomLevel: number = 0
	UrlTemplate: string = ""
	Attribution: string = ""
	MaxZoom: number = 0
	ZoomControl: boolean = false
	AttributionControl: boolean = false
	ZoomSnap: number = 0

	// insertion point for other declarations
	LayerGroupUses?: Array<LayerGroupUseDB>
}
