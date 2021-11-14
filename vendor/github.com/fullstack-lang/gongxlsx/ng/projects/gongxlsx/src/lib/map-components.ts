// insertion point sub template for components imports 
  import { XLCellsTableComponent } from './xlcells-table/xlcells-table.component'
  import { XLCellSortingComponent } from './xlcell-sorting/xlcell-sorting.component'
  import { XLFilesTableComponent } from './xlfiles-table/xlfiles-table.component'
  import { XLFileSortingComponent } from './xlfile-sorting/xlfile-sorting.component'
  import { XLRowsTableComponent } from './xlrows-table/xlrows-table.component'
  import { XLRowSortingComponent } from './xlrow-sorting/xlrow-sorting.component'
  import { XLSheetsTableComponent } from './xlsheets-table/xlsheets-table.component'
  import { XLSheetSortingComponent } from './xlsheet-sorting/xlsheet-sorting.component'

// insertion point sub template for map of components per struct 
  export const MapOfXLCellsComponents: Map<string, any> = new Map([["XLCellsTableComponent", XLCellsTableComponent],])
  export const MapOfXLCellSortingComponents: Map<string, any> = new Map([["XLCellSortingComponent", XLCellSortingComponent],])
  export const MapOfXLFilesComponents: Map<string, any> = new Map([["XLFilesTableComponent", XLFilesTableComponent],])
  export const MapOfXLFileSortingComponents: Map<string, any> = new Map([["XLFileSortingComponent", XLFileSortingComponent],])
  export const MapOfXLRowsComponents: Map<string, any> = new Map([["XLRowsTableComponent", XLRowsTableComponent],])
  export const MapOfXLRowSortingComponents: Map<string, any> = new Map([["XLRowSortingComponent", XLRowSortingComponent],])
  export const MapOfXLSheetsComponents: Map<string, any> = new Map([["XLSheetsTableComponent", XLSheetsTableComponent],])
  export const MapOfXLSheetSortingComponents: Map<string, any> = new Map([["XLSheetSortingComponent", XLSheetSortingComponent],])

// map of all ng components of the stacks
export const MapOfComponents: Map<string, any> =
  new Map(
    [
      // insertion point sub template for map of components 
      ["XLCell", MapOfXLCellsComponents],
      ["XLFile", MapOfXLFilesComponents],
      ["XLRow", MapOfXLRowsComponents],
      ["XLSheet", MapOfXLSheetsComponents],
    ]
  )

// map of all ng components of the stacks
export const MapOfSortingComponents: Map<string, any> =
  new Map(
    [
    // insertion point sub template for map of sorting components 
      ["XLCell", MapOfXLCellSortingComponents],
      ["XLFile", MapOfXLFileSortingComponents],
      ["XLRow", MapOfXLRowSortingComponents],
      ["XLSheet", MapOfXLSheetSortingComponents],
    ]
  )
