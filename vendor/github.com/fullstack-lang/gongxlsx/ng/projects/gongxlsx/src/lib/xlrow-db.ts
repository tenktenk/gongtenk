// insertion point for imports
import { XLCellDB } from './xlcell-db'
import { XLSheetDB } from './xlsheet-db'

// usefull for managing pointer ID values that can be nullable
import { NullInt64 } from './null-int64'

export class XLRowDB {
	CreatedAt?: string
	DeletedAt?: string
	ID: number = 0

	// insertion point for basic fields declarations
	Name: string = ""
	RowIndex: number = 0

	// insertion point for other declarations
	Cells?: Array<XLCellDB>
	XLSheet_RowsDBID: NullInt64 = new NullInt64
	XLSheet_RowsDBID_Index: NullInt64  = new NullInt64 // store the index of the xlrow instance in XLSheet.Rows
	XLSheet_Rows_reverse?: XLSheetDB 

}
