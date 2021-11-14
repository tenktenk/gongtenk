// insertion point for imports
import { XLSheetDB } from './xlsheet-db'

// usefull for managing pointer ID values that can be nullable
import { NullInt64 } from './null-int64'

export class XLFileDB {
	CreatedAt?: string
	DeletedAt?: string
	ID: number = 0

	// insertion point for basic fields declarations
	Name: string = ""
	NbSheets: number = 0

	// insertion point for other declarations
	Sheets?: Array<XLSheetDB>
}
