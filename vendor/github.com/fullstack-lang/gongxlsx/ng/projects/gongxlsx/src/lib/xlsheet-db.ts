// insertion point for imports
import { XLRowDB } from './xlrow-db'
import { XLCellDB } from './xlcell-db'
import { XLFileDB } from './xlfile-db'

// usefull for managing pointer ID values that can be nullable
import { NullInt64 } from './null-int64'

export class XLSheetDB {
	CreatedAt?: string
	DeletedAt?: string
	ID: number = 0

	// insertion point for basic fields declarations
	Name: string = ""
	MaxRow: number = 0
	MaxCol: number = 0
	NbRows: number = 0

	// insertion point for other declarations
	Rows?: Array<XLRowDB>
	SheetCells?: Array<XLCellDB>
	XLFile_SheetsDBID: NullInt64 = new NullInt64
	XLFile_SheetsDBID_Index: NullInt64  = new NullInt64 // store the index of the xlsheet instance in XLFile.Sheets
	XLFile_Sheets_reverse?: XLFileDB 

}
