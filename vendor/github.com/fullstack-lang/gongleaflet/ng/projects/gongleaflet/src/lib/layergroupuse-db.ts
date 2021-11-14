// insertion point for imports
import { LayerGroupDB } from './layergroup-db'
import { MapOptionsDB } from './mapoptions-db'

// usefull for managing pointer ID values that can be nullable
import { NullInt64 } from './null-int64'

export class LayerGroupUseDB {
	CreatedAt?: string
	DeletedAt?: string
	ID: number = 0

	// insertion point for basic fields declarations
	Name: string = ""
	Display: boolean = false

	// insertion point for other declarations
	LayerGroup?: LayerGroupDB
	LayerGroupID: NullInt64 = new NullInt64 // if pointer is null, LayerGroup.ID = 0

	MapOptions_LayerGroupUsesDBID: NullInt64 = new NullInt64
	MapOptions_LayerGroupUsesDBID_Index: NullInt64  = new NullInt64 // store the index of the layergroupuse instance in MapOptions.LayerGroupUses
	MapOptions_LayerGroupUses_reverse?: MapOptionsDB 

}
