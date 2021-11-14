// insertion point for imports
import { XLRowDB } from './xlrow-db'
import { XLSheetDB } from './xlsheet-db'

// usefull for managing pointer ID values that can be nullable
import { NullInt64 } from './null-int64'

export class XLCellDB {
	CreatedAt?: string
	DeletedAt?: string
	ID: number = 0

	// insertion point for basic fields declarations
	Name: string = ""
	X: number = 0
	Y: number = 0

	// insertion point for other declarations
	XLRow_CellsDBID: NullInt64 = new NullInt64
	XLRow_CellsDBID_Index: NullInt64  = new NullInt64 // store the index of the xlcell instance in XLRow.Cells
	XLRow_Cells_reverse?: XLRowDB 

	XLSheet_SheetCellsDBID: NullInt64 = new NullInt64
	XLSheet_SheetCellsDBID_Index: NullInt64  = new NullInt64 // store the index of the xlcell instance in XLSheet.SheetCells
	XLSheet_SheetCells_reverse?: XLSheetDB 

}
