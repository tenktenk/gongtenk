// generated from NgDetailTemplateTS
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { XLCellDB } from '../xlcell-db'
import { XLCellService } from '../xlcell.service'

import { FrontRepoService, FrontRepo, SelectionMode, DialogData } from '../front-repo.service'
import { MapOfComponents } from '../map-components'
import { MapOfSortingComponents } from '../map-components'

// insertion point for imports
import { XLRowDB } from '../xlrow-db'
import { XLSheetDB } from '../xlsheet-db'

import { Router, RouterState, ActivatedRoute } from '@angular/router';

import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';

import { NullInt64 } from '../null-int64'

// XLCellDetailComponent is initilizaed from different routes
// XLCellDetailComponentState detail different cases 
enum XLCellDetailComponentState {
	CREATE_INSTANCE,
	UPDATE_INSTANCE,
	// insertion point for declarations of enum values of state
	CREATE_INSTANCE_WITH_ASSOCIATION_XLRow_Cells_SET,
	CREATE_INSTANCE_WITH_ASSOCIATION_XLSheet_SheetCells_SET,
}

@Component({
	selector: 'app-xlcell-detail',
	templateUrl: './xlcell-detail.component.html',
	styleUrls: ['./xlcell-detail.component.css'],
})
export class XLCellDetailComponent implements OnInit {

	// insertion point for declarations

	// the XLCellDB of interest
	xlcell: XLCellDB = new XLCellDB

	// front repo
	frontRepo: FrontRepo = new FrontRepo

	// this stores the information related to string fields
	// if false, the field is inputed with an <input ...> form 
	// if true, it is inputed with a <textarea ...> </textarea>
	mapFields_displayAsTextArea = new Map<string, boolean>()

	// the state at initialization (CREATION, UPDATE or CREATE with one association set)
	state: XLCellDetailComponentState = XLCellDetailComponentState.CREATE_INSTANCE

	// in UDPATE state, if is the id of the instance to update
	// in CREATE state with one association set, this is the id of the associated instance
	id: number = 0

	// in CREATE state with one association set, this is the id of the associated instance
	originStruct: string = ""
	originStructFieldName: string = ""

	constructor(
		private xlcellService: XLCellService,
		private frontRepoService: FrontRepoService,
		public dialog: MatDialog,
		private route: ActivatedRoute,
		private router: Router,
	) {
	}

	ngOnInit(): void {

		// compute state
		this.id = +this.route.snapshot.paramMap.get('id')!;
		this.originStruct = this.route.snapshot.paramMap.get('originStruct')!;
		this.originStructFieldName = this.route.snapshot.paramMap.get('originStructFieldName')!;

		const association = this.route.snapshot.paramMap.get('association');
		if (this.id == 0) {
			this.state = XLCellDetailComponentState.CREATE_INSTANCE
		} else {
			if (this.originStruct == undefined) {
				this.state = XLCellDetailComponentState.UPDATE_INSTANCE
			} else {
				switch (this.originStructFieldName) {
					// insertion point for state computation
					case "Cells":
						// console.log("XLCell" + " is instanciated with back pointer to instance " + this.id + " XLRow association Cells")
						this.state = XLCellDetailComponentState.CREATE_INSTANCE_WITH_ASSOCIATION_XLRow_Cells_SET
						break;
					case "SheetCells":
						// console.log("XLCell" + " is instanciated with back pointer to instance " + this.id + " XLSheet association SheetCells")
						this.state = XLCellDetailComponentState.CREATE_INSTANCE_WITH_ASSOCIATION_XLSheet_SheetCells_SET
						break;
					default:
						console.log(this.originStructFieldName + " is unkown association")
				}
			}
		}

		this.getXLCell()

		// observable for changes in structs
		this.xlcellService.XLCellServiceChanged.subscribe(
			message => {
				if (message == "post" || message == "update" || message == "delete") {
					this.getXLCell()
				}
			}
		)

		// insertion point for initialisation of enums list
	}

	getXLCell(): void {

		this.frontRepoService.pull().subscribe(
			frontRepo => {
				this.frontRepo = frontRepo

				switch (this.state) {
					case XLCellDetailComponentState.CREATE_INSTANCE:
						this.xlcell = new (XLCellDB)
						break;
					case XLCellDetailComponentState.UPDATE_INSTANCE:
						let xlcell = frontRepo.XLCells.get(this.id)
						console.assert(xlcell != undefined, "missing xlcell with id:" + this.id)
						this.xlcell = xlcell!
						break;
					// insertion point for init of association field
					case XLCellDetailComponentState.CREATE_INSTANCE_WITH_ASSOCIATION_XLRow_Cells_SET:
						this.xlcell = new (XLCellDB)
						this.xlcell.XLRow_Cells_reverse = frontRepo.XLRows.get(this.id)!
						break;
					case XLCellDetailComponentState.CREATE_INSTANCE_WITH_ASSOCIATION_XLSheet_SheetCells_SET:
						this.xlcell = new (XLCellDB)
						this.xlcell.XLSheet_SheetCells_reverse = frontRepo.XLSheets.get(this.id)!
						break;
					default:
						console.log(this.state + " is unkown state")
				}

				// insertion point for recovery of form controls value for bool fields
			}
		)


	}

	save(): void {

		// some fields needs to be translated into serializable forms
		// pointers fields, after the translation, are nulled in order to perform serialization

		// insertion point for translation/nullation of each field

		// save from the front pointer space to the non pointer space for serialization

		// insertion point for translation/nullation of each pointers
		if (this.xlcell.XLRow_Cells_reverse != undefined) {
			if (this.xlcell.XLRow_CellsDBID == undefined) {
				this.xlcell.XLRow_CellsDBID = new NullInt64
			}
			this.xlcell.XLRow_CellsDBID.Int64 = this.xlcell.XLRow_Cells_reverse.ID
			this.xlcell.XLRow_CellsDBID.Valid = true
			if (this.xlcell.XLRow_CellsDBID_Index == undefined) {
				this.xlcell.XLRow_CellsDBID_Index = new NullInt64
			}
			this.xlcell.XLRow_CellsDBID_Index.Valid = true
			this.xlcell.XLRow_Cells_reverse = new XLRowDB // very important, otherwise, circular JSON
		}
		if (this.xlcell.XLSheet_SheetCells_reverse != undefined) {
			if (this.xlcell.XLSheet_SheetCellsDBID == undefined) {
				this.xlcell.XLSheet_SheetCellsDBID = new NullInt64
			}
			this.xlcell.XLSheet_SheetCellsDBID.Int64 = this.xlcell.XLSheet_SheetCells_reverse.ID
			this.xlcell.XLSheet_SheetCellsDBID.Valid = true
			if (this.xlcell.XLSheet_SheetCellsDBID_Index == undefined) {
				this.xlcell.XLSheet_SheetCellsDBID_Index = new NullInt64
			}
			this.xlcell.XLSheet_SheetCellsDBID_Index.Valid = true
			this.xlcell.XLSheet_SheetCells_reverse = new XLSheetDB // very important, otherwise, circular JSON
		}

		switch (this.state) {
			case XLCellDetailComponentState.UPDATE_INSTANCE:
				this.xlcellService.updateXLCell(this.xlcell)
					.subscribe(xlcell => {
						this.xlcellService.XLCellServiceChanged.next("update")
					});
				break;
			default:
				this.xlcellService.postXLCell(this.xlcell).subscribe(xlcell => {
					this.xlcellService.XLCellServiceChanged.next("post")
					this.xlcell = new (XLCellDB) // reset fields
				});
		}
	}

	// openReverseSelection is a generic function that calls dialog for the edition of 
	// ONE-MANY association
	// It uses the MapOfComponent provided by the front repo
	openReverseSelection(AssociatedStruct: string, reverseField: string, selectionMode: string,
		sourceField: string, intermediateStructField: string, nextAssociatedStruct: string) {

		console.log("mode " + selectionMode)

		const dialogConfig = new MatDialogConfig();

		let dialogData = new DialogData();

		// dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.width = "50%"
		dialogConfig.height = "50%"
		if (selectionMode == SelectionMode.ONE_MANY_ASSOCIATION_MODE) {

			dialogData.ID = this.xlcell.ID!
			dialogData.ReversePointer = reverseField
			dialogData.OrderingMode = false
			dialogData.SelectionMode = selectionMode

			dialogConfig.data = dialogData
			const dialogRef: MatDialogRef<string, any> = this.dialog.open(
				MapOfComponents.get(AssociatedStruct).get(
					AssociatedStruct + 'sTableComponent'
				),
				dialogConfig
			);
			dialogRef.afterClosed().subscribe(result => {
			});
		}
		if (selectionMode == SelectionMode.MANY_MANY_ASSOCIATION_MODE) {
			dialogData.ID = this.xlcell.ID!
			dialogData.ReversePointer = reverseField
			dialogData.OrderingMode = false
			dialogData.SelectionMode = selectionMode

			// set up the source
			dialogData.SourceStruct = "XLCell"
			dialogData.SourceField = sourceField

			// set up the intermediate struct
			dialogData.IntermediateStruct = AssociatedStruct
			dialogData.IntermediateStructField = intermediateStructField

			// set up the end struct
			dialogData.NextAssociationStruct = nextAssociatedStruct

			dialogConfig.data = dialogData
			const dialogRef: MatDialogRef<string, any> = this.dialog.open(
				MapOfComponents.get(nextAssociatedStruct).get(
					nextAssociatedStruct + 'sTableComponent'
				),
				dialogConfig
			);
			dialogRef.afterClosed().subscribe(result => {
			});
		}

	}

	openDragAndDropOrdering(AssociatedStruct: string, reverseField: string) {

		const dialogConfig = new MatDialogConfig();

		// dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.data = {
			ID: this.xlcell.ID,
			ReversePointer: reverseField,
			OrderingMode: true,
		};
		const dialogRef: MatDialogRef<string, any> = this.dialog.open(
			MapOfSortingComponents.get(AssociatedStruct).get(
				AssociatedStruct + 'SortingComponent'
			),
			dialogConfig
		);

		dialogRef.afterClosed().subscribe(result => {
		});
	}

	fillUpNameIfEmpty(event: { value: { Name: string; }; }) {
		if (this.xlcell.Name == undefined) {
			this.xlcell.Name = event.value.Name
		}
	}

	toggleTextArea(fieldName: string) {
		if (this.mapFields_displayAsTextArea.has(fieldName)) {
			let displayAsTextArea = this.mapFields_displayAsTextArea.get(fieldName)
			this.mapFields_displayAsTextArea.set(fieldName, !displayAsTextArea)
		} else {
			this.mapFields_displayAsTextArea.set(fieldName, true)
		}
	}

	isATextArea(fieldName: string): boolean {
		if (this.mapFields_displayAsTextArea.has(fieldName)) {
			return this.mapFields_displayAsTextArea.get(fieldName)!
		} else {
			return false
		}
	}

	compareObjects(o1: any, o2: any) {
		if (o1?.ID == o2?.ID) {
			return true;
		}
		else {
			return false
		}
	}
}
