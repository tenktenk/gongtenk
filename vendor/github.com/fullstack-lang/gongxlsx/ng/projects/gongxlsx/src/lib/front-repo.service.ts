import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, combineLatest, BehaviorSubject } from 'rxjs';

// insertion point sub template for services imports 
import { XLCellDB } from './xlcell-db'
import { XLCellService } from './xlcell.service'

import { XLFileDB } from './xlfile-db'
import { XLFileService } from './xlfile.service'

import { XLRowDB } from './xlrow-db'
import { XLRowService } from './xlrow.service'

import { XLSheetDB } from './xlsheet-db'
import { XLSheetService } from './xlsheet.service'


// FrontRepo stores all instances in a front repository (design pattern repository)
export class FrontRepo { // insertion point sub template 
  XLCells_array = new Array<XLCellDB>(); // array of repo instances
  XLCells = new Map<number, XLCellDB>(); // map of repo instances
  XLCells_batch = new Map<number, XLCellDB>(); // same but only in last GET (for finding repo instances to delete)
  XLFiles_array = new Array<XLFileDB>(); // array of repo instances
  XLFiles = new Map<number, XLFileDB>(); // map of repo instances
  XLFiles_batch = new Map<number, XLFileDB>(); // same but only in last GET (for finding repo instances to delete)
  XLRows_array = new Array<XLRowDB>(); // array of repo instances
  XLRows = new Map<number, XLRowDB>(); // map of repo instances
  XLRows_batch = new Map<number, XLRowDB>(); // same but only in last GET (for finding repo instances to delete)
  XLSheets_array = new Array<XLSheetDB>(); // array of repo instances
  XLSheets = new Map<number, XLSheetDB>(); // map of repo instances
  XLSheets_batch = new Map<number, XLSheetDB>(); // same but only in last GET (for finding repo instances to delete)
}

//
// Store of all instances of the stack
//
export const FrontRepoSingloton = new (FrontRepo)

// the table component is called in different ways
//
// DISPLAY or ASSOCIATION MODE
//
// in ASSOCIATION MODE, it is invoked within a diaglo and a Dialog Data item is used to
// configure the component
// DialogData define the interface for information that is forwarded from the calling instance to 
// the select table
export class DialogData {
  ID: number = 0 // ID of the calling instance

  // the reverse pointer is the name of the generated field on the destination
  // struct of the ONE-MANY association
  ReversePointer: string = "" // field of {{Structname}} that serve as reverse pointer
  OrderingMode: boolean = false // if true, this is for ordering items

  // there are different selection mode : ONE_MANY or MANY_MANY
  SelectionMode: SelectionMode = SelectionMode.ONE_MANY_ASSOCIATION_MODE

  // used if SelectionMode is MANY_MANY_ASSOCIATION_MODE
  //
  // In Gong, a MANY-MANY association is implemented as a ONE-ZERO/ONE followed by a ONE_MANY association
  // 
  // in the MANY_MANY_ASSOCIATION_MODE case, we need also the Struct and the FieldName that are
  // at the end of the ONE-MANY association
  SourceStruct: string = ""  // The "Aclass"
  SourceField: string = "" // the "AnarrayofbUse"
  IntermediateStruct: string = "" // the "AclassBclassUse" 
  IntermediateStructField: string = "" // the "Bclass" as field
  NextAssociationStruct: string = "" // the "Bclass"
}

export enum SelectionMode {
  ONE_MANY_ASSOCIATION_MODE = "ONE_MANY_ASSOCIATION_MODE",
  MANY_MANY_ASSOCIATION_MODE = "MANY_MANY_ASSOCIATION_MODE",
}

//
// observable that fetch all elements of the stack and store them in the FrontRepo
//
@Injectable({
  providedIn: 'root'
})
export class FrontRepoService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient, // insertion point sub template 
    private xlcellService: XLCellService,
    private xlfileService: XLFileService,
    private xlrowService: XLRowService,
    private xlsheetService: XLSheetService,
  ) { }

  // postService provides a post function for each struct name
  postService(structName: string, instanceToBePosted: any) {
    let service = this[structName.toLowerCase() + "Service" + "Service" as keyof FrontRepoService]
    let servicePostFunction = service[("post" + structName) as keyof typeof service] as (instance: typeof instanceToBePosted) => Observable<typeof instanceToBePosted>

    servicePostFunction(instanceToBePosted).subscribe(
      instance => {
        let behaviorSubject = instanceToBePosted[(structName + "ServiceChanged") as keyof typeof instanceToBePosted] as unknown as BehaviorSubject<string>
        behaviorSubject.next("post")
      }
    );
  }

  // deleteService provides a delete function for each struct name
  deleteService(structName: string, instanceToBeDeleted: any) {
    let service = this[structName.toLowerCase() + "Service" as keyof FrontRepoService]
    let serviceDeleteFunction = service["delete" + structName as keyof typeof service] as (instance: typeof instanceToBeDeleted) => Observable<typeof instanceToBeDeleted>

    serviceDeleteFunction(instanceToBeDeleted).subscribe(
      instance => {
        let behaviorSubject = instanceToBeDeleted[(structName + "ServiceChanged") as keyof typeof instanceToBeDeleted] as unknown as BehaviorSubject<string>
        behaviorSubject.next("delete")
      }
    );
  }

  // typing of observable can be messy in typescript. Therefore, one force the type
  observableFrontRepo: [ // insertion point sub template 
    Observable<XLCellDB[]>,
    Observable<XLFileDB[]>,
    Observable<XLRowDB[]>,
    Observable<XLSheetDB[]>,
  ] = [ // insertion point sub template 
      this.xlcellService.getXLCells(),
      this.xlfileService.getXLFiles(),
      this.xlrowService.getXLRows(),
      this.xlsheetService.getXLSheets(),
    ];

  //
  // pull performs a GET on all struct of the stack and redeem association pointers 
  //
  // This is an observable. Therefore, the control flow forks with
  // - pull() return immediatly the observable
  // - the observable observer, if it subscribe, is called when all GET calls are performs
  pull(): Observable<FrontRepo> {
    return new Observable<FrontRepo>(
      (observer) => {
        combineLatest(
          this.observableFrontRepo
        ).subscribe(
          ([ // insertion point sub template for declarations 
            xlcells_,
            xlfiles_,
            xlrows_,
            xlsheets_,
          ]) => {
            // Typing can be messy with many items. Therefore, type casting is necessary here
            // insertion point sub template for type casting 
            var xlcells: XLCellDB[]
            xlcells = xlcells_ as XLCellDB[]
            var xlfiles: XLFileDB[]
            xlfiles = xlfiles_ as XLFileDB[]
            var xlrows: XLRowDB[]
            xlrows = xlrows_ as XLRowDB[]
            var xlsheets: XLSheetDB[]
            xlsheets = xlsheets_ as XLSheetDB[]

            // 
            // First Step: init map of instances
            // insertion point sub template for init 
            // init the array
            FrontRepoSingloton.XLCells_array = xlcells

            // clear the map that counts XLCell in the GET
            FrontRepoSingloton.XLCells_batch.clear()

            xlcells.forEach(
              xlcell => {
                FrontRepoSingloton.XLCells.set(xlcell.ID, xlcell)
                FrontRepoSingloton.XLCells_batch.set(xlcell.ID, xlcell)
              }
            )

            // clear xlcells that are absent from the batch
            FrontRepoSingloton.XLCells.forEach(
              xlcell => {
                if (FrontRepoSingloton.XLCells_batch.get(xlcell.ID) == undefined) {
                  FrontRepoSingloton.XLCells.delete(xlcell.ID)
                }
              }
            )

            // sort XLCells_array array
            FrontRepoSingloton.XLCells_array.sort((t1, t2) => {
              if (t1.Name > t2.Name) {
                return 1;
              }
              if (t1.Name < t2.Name) {
                return -1;
              }
              return 0;
            });

            // init the array
            FrontRepoSingloton.XLFiles_array = xlfiles

            // clear the map that counts XLFile in the GET
            FrontRepoSingloton.XLFiles_batch.clear()

            xlfiles.forEach(
              xlfile => {
                FrontRepoSingloton.XLFiles.set(xlfile.ID, xlfile)
                FrontRepoSingloton.XLFiles_batch.set(xlfile.ID, xlfile)
              }
            )

            // clear xlfiles that are absent from the batch
            FrontRepoSingloton.XLFiles.forEach(
              xlfile => {
                if (FrontRepoSingloton.XLFiles_batch.get(xlfile.ID) == undefined) {
                  FrontRepoSingloton.XLFiles.delete(xlfile.ID)
                }
              }
            )

            // sort XLFiles_array array
            FrontRepoSingloton.XLFiles_array.sort((t1, t2) => {
              if (t1.Name > t2.Name) {
                return 1;
              }
              if (t1.Name < t2.Name) {
                return -1;
              }
              return 0;
            });

            // init the array
            FrontRepoSingloton.XLRows_array = xlrows

            // clear the map that counts XLRow in the GET
            FrontRepoSingloton.XLRows_batch.clear()

            xlrows.forEach(
              xlrow => {
                FrontRepoSingloton.XLRows.set(xlrow.ID, xlrow)
                FrontRepoSingloton.XLRows_batch.set(xlrow.ID, xlrow)
              }
            )

            // clear xlrows that are absent from the batch
            FrontRepoSingloton.XLRows.forEach(
              xlrow => {
                if (FrontRepoSingloton.XLRows_batch.get(xlrow.ID) == undefined) {
                  FrontRepoSingloton.XLRows.delete(xlrow.ID)
                }
              }
            )

            // sort XLRows_array array
            FrontRepoSingloton.XLRows_array.sort((t1, t2) => {
              if (t1.Name > t2.Name) {
                return 1;
              }
              if (t1.Name < t2.Name) {
                return -1;
              }
              return 0;
            });

            // init the array
            FrontRepoSingloton.XLSheets_array = xlsheets

            // clear the map that counts XLSheet in the GET
            FrontRepoSingloton.XLSheets_batch.clear()

            xlsheets.forEach(
              xlsheet => {
                FrontRepoSingloton.XLSheets.set(xlsheet.ID, xlsheet)
                FrontRepoSingloton.XLSheets_batch.set(xlsheet.ID, xlsheet)
              }
            )

            // clear xlsheets that are absent from the batch
            FrontRepoSingloton.XLSheets.forEach(
              xlsheet => {
                if (FrontRepoSingloton.XLSheets_batch.get(xlsheet.ID) == undefined) {
                  FrontRepoSingloton.XLSheets.delete(xlsheet.ID)
                }
              }
            )

            // sort XLSheets_array array
            FrontRepoSingloton.XLSheets_array.sort((t1, t2) => {
              if (t1.Name > t2.Name) {
                return 1;
              }
              if (t1.Name < t2.Name) {
                return -1;
              }
              return 0;
            });


            // 
            // Second Step: redeem pointers between instances (thanks to maps in the First Step)
            // insertion point sub template for redeem 
            xlcells.forEach(
              xlcell => {
                // insertion point sub sub template for ONE-/ZERO-ONE associations pointers redeeming

                // insertion point for redeeming ONE-MANY associations
                // insertion point for slice of pointer field XLRow.Cells redeeming
                {
                  let _xlrow = FrontRepoSingloton.XLRows.get(xlcell.XLRow_CellsDBID.Int64)
                  if (_xlrow) {
                    if (_xlrow.Cells == undefined) {
                      _xlrow.Cells = new Array<XLCellDB>()
                    }
                    _xlrow.Cells.push(xlcell)
                    if (xlcell.XLRow_Cells_reverse == undefined) {
                      xlcell.XLRow_Cells_reverse = _xlrow
                    }
                  }
                }
                // insertion point for slice of pointer field XLSheet.SheetCells redeeming
                {
                  let _xlsheet = FrontRepoSingloton.XLSheets.get(xlcell.XLSheet_SheetCellsDBID.Int64)
                  if (_xlsheet) {
                    if (_xlsheet.SheetCells == undefined) {
                      _xlsheet.SheetCells = new Array<XLCellDB>()
                    }
                    _xlsheet.SheetCells.push(xlcell)
                    if (xlcell.XLSheet_SheetCells_reverse == undefined) {
                      xlcell.XLSheet_SheetCells_reverse = _xlsheet
                    }
                  }
                }
              }
            )
            xlfiles.forEach(
              xlfile => {
                // insertion point sub sub template for ONE-/ZERO-ONE associations pointers redeeming

                // insertion point for redeeming ONE-MANY associations
              }
            )
            xlrows.forEach(
              xlrow => {
                // insertion point sub sub template for ONE-/ZERO-ONE associations pointers redeeming

                // insertion point for redeeming ONE-MANY associations
                // insertion point for slice of pointer field XLSheet.Rows redeeming
                {
                  let _xlsheet = FrontRepoSingloton.XLSheets.get(xlrow.XLSheet_RowsDBID.Int64)
                  if (_xlsheet) {
                    if (_xlsheet.Rows == undefined) {
                      _xlsheet.Rows = new Array<XLRowDB>()
                    }
                    _xlsheet.Rows.push(xlrow)
                    if (xlrow.XLSheet_Rows_reverse == undefined) {
                      xlrow.XLSheet_Rows_reverse = _xlsheet
                    }
                  }
                }
              }
            )
            xlsheets.forEach(
              xlsheet => {
                // insertion point sub sub template for ONE-/ZERO-ONE associations pointers redeeming

                // insertion point for redeeming ONE-MANY associations
                // insertion point for slice of pointer field XLFile.Sheets redeeming
                {
                  let _xlfile = FrontRepoSingloton.XLFiles.get(xlsheet.XLFile_SheetsDBID.Int64)
                  if (_xlfile) {
                    if (_xlfile.Sheets == undefined) {
                      _xlfile.Sheets = new Array<XLSheetDB>()
                    }
                    _xlfile.Sheets.push(xlsheet)
                    if (xlsheet.XLFile_Sheets_reverse == undefined) {
                      xlsheet.XLFile_Sheets_reverse = _xlfile
                    }
                  }
                }
              }
            )

            // hand over control flow to observer
            observer.next(FrontRepoSingloton)
          }
        )
      }
    )
  }

  // insertion point for pull per struct 

  // XLCellPull performs a GET on XLCell of the stack and redeem association pointers 
  XLCellPull(): Observable<FrontRepo> {
    return new Observable<FrontRepo>(
      (observer) => {
        combineLatest([
          this.xlcellService.getXLCells()
        ]).subscribe(
          ([ // insertion point sub template 
            xlcells,
          ]) => {
            // init the array
            FrontRepoSingloton.XLCells_array = xlcells

            // clear the map that counts XLCell in the GET
            FrontRepoSingloton.XLCells_batch.clear()

            // 
            // First Step: init map of instances
            // insertion point sub template 
            xlcells.forEach(
              xlcell => {
                FrontRepoSingloton.XLCells.set(xlcell.ID, xlcell)
                FrontRepoSingloton.XLCells_batch.set(xlcell.ID, xlcell)

                // insertion point for redeeming ONE/ZERO-ONE associations

                // insertion point for redeeming ONE-MANY associations
                // insertion point for slice of pointer field XLRow.Cells redeeming
                {
                  let _xlrow = FrontRepoSingloton.XLRows.get(xlcell.XLRow_CellsDBID.Int64)
                  if (_xlrow) {
                    if (_xlrow.Cells == undefined) {
                      _xlrow.Cells = new Array<XLCellDB>()
                    }
                    _xlrow.Cells.push(xlcell)
                    if (xlcell.XLRow_Cells_reverse == undefined) {
                      xlcell.XLRow_Cells_reverse = _xlrow
                    }
                  }
                }
                // insertion point for slice of pointer field XLSheet.SheetCells redeeming
                {
                  let _xlsheet = FrontRepoSingloton.XLSheets.get(xlcell.XLSheet_SheetCellsDBID.Int64)
                  if (_xlsheet) {
                    if (_xlsheet.SheetCells == undefined) {
                      _xlsheet.SheetCells = new Array<XLCellDB>()
                    }
                    _xlsheet.SheetCells.push(xlcell)
                    if (xlcell.XLSheet_SheetCells_reverse == undefined) {
                      xlcell.XLSheet_SheetCells_reverse = _xlsheet
                    }
                  }
                }
              }
            )

            // clear xlcells that are absent from the GET
            FrontRepoSingloton.XLCells.forEach(
              xlcell => {
                if (FrontRepoSingloton.XLCells_batch.get(xlcell.ID) == undefined) {
                  FrontRepoSingloton.XLCells.delete(xlcell.ID)
                }
              }
            )

            // 
            // Second Step: redeem pointers between instances (thanks to maps in the First Step)
            // insertion point sub template 

            // hand over control flow to observer
            observer.next(FrontRepoSingloton)
          }
        )
      }
    )
  }

  // XLFilePull performs a GET on XLFile of the stack and redeem association pointers 
  XLFilePull(): Observable<FrontRepo> {
    return new Observable<FrontRepo>(
      (observer) => {
        combineLatest([
          this.xlfileService.getXLFiles()
        ]).subscribe(
          ([ // insertion point sub template 
            xlfiles,
          ]) => {
            // init the array
            FrontRepoSingloton.XLFiles_array = xlfiles

            // clear the map that counts XLFile in the GET
            FrontRepoSingloton.XLFiles_batch.clear()

            // 
            // First Step: init map of instances
            // insertion point sub template 
            xlfiles.forEach(
              xlfile => {
                FrontRepoSingloton.XLFiles.set(xlfile.ID, xlfile)
                FrontRepoSingloton.XLFiles_batch.set(xlfile.ID, xlfile)

                // insertion point for redeeming ONE/ZERO-ONE associations

                // insertion point for redeeming ONE-MANY associations
              }
            )

            // clear xlfiles that are absent from the GET
            FrontRepoSingloton.XLFiles.forEach(
              xlfile => {
                if (FrontRepoSingloton.XLFiles_batch.get(xlfile.ID) == undefined) {
                  FrontRepoSingloton.XLFiles.delete(xlfile.ID)
                }
              }
            )

            // 
            // Second Step: redeem pointers between instances (thanks to maps in the First Step)
            // insertion point sub template 

            // hand over control flow to observer
            observer.next(FrontRepoSingloton)
          }
        )
      }
    )
  }

  // XLRowPull performs a GET on XLRow of the stack and redeem association pointers 
  XLRowPull(): Observable<FrontRepo> {
    return new Observable<FrontRepo>(
      (observer) => {
        combineLatest([
          this.xlrowService.getXLRows()
        ]).subscribe(
          ([ // insertion point sub template 
            xlrows,
          ]) => {
            // init the array
            FrontRepoSingloton.XLRows_array = xlrows

            // clear the map that counts XLRow in the GET
            FrontRepoSingloton.XLRows_batch.clear()

            // 
            // First Step: init map of instances
            // insertion point sub template 
            xlrows.forEach(
              xlrow => {
                FrontRepoSingloton.XLRows.set(xlrow.ID, xlrow)
                FrontRepoSingloton.XLRows_batch.set(xlrow.ID, xlrow)

                // insertion point for redeeming ONE/ZERO-ONE associations

                // insertion point for redeeming ONE-MANY associations
                // insertion point for slice of pointer field XLSheet.Rows redeeming
                {
                  let _xlsheet = FrontRepoSingloton.XLSheets.get(xlrow.XLSheet_RowsDBID.Int64)
                  if (_xlsheet) {
                    if (_xlsheet.Rows == undefined) {
                      _xlsheet.Rows = new Array<XLRowDB>()
                    }
                    _xlsheet.Rows.push(xlrow)
                    if (xlrow.XLSheet_Rows_reverse == undefined) {
                      xlrow.XLSheet_Rows_reverse = _xlsheet
                    }
                  }
                }
              }
            )

            // clear xlrows that are absent from the GET
            FrontRepoSingloton.XLRows.forEach(
              xlrow => {
                if (FrontRepoSingloton.XLRows_batch.get(xlrow.ID) == undefined) {
                  FrontRepoSingloton.XLRows.delete(xlrow.ID)
                }
              }
            )

            // 
            // Second Step: redeem pointers between instances (thanks to maps in the First Step)
            // insertion point sub template 

            // hand over control flow to observer
            observer.next(FrontRepoSingloton)
          }
        )
      }
    )
  }

  // XLSheetPull performs a GET on XLSheet of the stack and redeem association pointers 
  XLSheetPull(): Observable<FrontRepo> {
    return new Observable<FrontRepo>(
      (observer) => {
        combineLatest([
          this.xlsheetService.getXLSheets()
        ]).subscribe(
          ([ // insertion point sub template 
            xlsheets,
          ]) => {
            // init the array
            FrontRepoSingloton.XLSheets_array = xlsheets

            // clear the map that counts XLSheet in the GET
            FrontRepoSingloton.XLSheets_batch.clear()

            // 
            // First Step: init map of instances
            // insertion point sub template 
            xlsheets.forEach(
              xlsheet => {
                FrontRepoSingloton.XLSheets.set(xlsheet.ID, xlsheet)
                FrontRepoSingloton.XLSheets_batch.set(xlsheet.ID, xlsheet)

                // insertion point for redeeming ONE/ZERO-ONE associations

                // insertion point for redeeming ONE-MANY associations
                // insertion point for slice of pointer field XLFile.Sheets redeeming
                {
                  let _xlfile = FrontRepoSingloton.XLFiles.get(xlsheet.XLFile_SheetsDBID.Int64)
                  if (_xlfile) {
                    if (_xlfile.Sheets == undefined) {
                      _xlfile.Sheets = new Array<XLSheetDB>()
                    }
                    _xlfile.Sheets.push(xlsheet)
                    if (xlsheet.XLFile_Sheets_reverse == undefined) {
                      xlsheet.XLFile_Sheets_reverse = _xlfile
                    }
                  }
                }
              }
            )

            // clear xlsheets that are absent from the GET
            FrontRepoSingloton.XLSheets.forEach(
              xlsheet => {
                if (FrontRepoSingloton.XLSheets_batch.get(xlsheet.ID) == undefined) {
                  FrontRepoSingloton.XLSheets.delete(xlsheet.ID)
                }
              }
            )

            // 
            // Second Step: redeem pointers between instances (thanks to maps in the First Step)
            // insertion point sub template 

            // hand over control flow to observer
            observer.next(FrontRepoSingloton)
          }
        )
      }
    )
  }
}

// insertion point for get unique ID per struct 
export function getXLCellUniqueID(id: number): number {
  return 31 * id
}
export function getXLFileUniqueID(id: number): number {
  return 37 * id
}
export function getXLRowUniqueID(id: number): number {
  return 41 * id
}
export function getXLSheetUniqueID(id: number): number {
  return 43 * id
}
