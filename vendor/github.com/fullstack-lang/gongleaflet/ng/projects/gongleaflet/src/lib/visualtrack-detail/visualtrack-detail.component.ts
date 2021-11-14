// generated from NgDetailTemplateTS
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { VisualTrackDB } from '../visualtrack-db'
import { VisualTrackService } from '../visualtrack.service'

import { FrontRepoService, FrontRepo, SelectionMode, DialogData } from '../front-repo.service'
import { MapOfComponents } from '../map-components'
import { MapOfSortingComponents } from '../map-components'

// insertion point for imports
import { ColorEnumSelect, ColorEnumList } from '../ColorEnum'

import { Router, RouterState, ActivatedRoute } from '@angular/router';

import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';

import { NullInt64 } from '../null-int64'

// VisualTrackDetailComponent is initilizaed from different routes
// VisualTrackDetailComponentState detail different cases 
enum VisualTrackDetailComponentState {
	CREATE_INSTANCE,
	UPDATE_INSTANCE,
	// insertion point for declarations of enum values of state
}

@Component({
	selector: 'app-visualtrack-detail',
	templateUrl: './visualtrack-detail.component.html',
	styleUrls: ['./visualtrack-detail.component.css'],
})
export class VisualTrackDetailComponent implements OnInit {

	// insertion point for declarations
	ColorEnumList: ColorEnumSelect[] = []
	DisplayTrackHistoryFormControl = new FormControl(false);
	DisplayLevelAndSpeedFormControl = new FormControl(false);

	// the VisualTrackDB of interest
	visualtrack: VisualTrackDB = new VisualTrackDB

	// front repo
	frontRepo: FrontRepo = new FrontRepo

	// this stores the information related to string fields
	// if false, the field is inputed with an <input ...> form 
	// if true, it is inputed with a <textarea ...> </textarea>
	mapFields_displayAsTextArea = new Map<string, boolean>()

	// the state at initialization (CREATION, UPDATE or CREATE with one association set)
	state: VisualTrackDetailComponentState = VisualTrackDetailComponentState.CREATE_INSTANCE

	// in UDPATE state, if is the id of the instance to update
	// in CREATE state with one association set, this is the id of the associated instance
	id: number = 0

	// in CREATE state with one association set, this is the id of the associated instance
	originStruct: string = ""
	originStructFieldName: string = ""

	constructor(
		private visualtrackService: VisualTrackService,
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
			this.state = VisualTrackDetailComponentState.CREATE_INSTANCE
		} else {
			if (this.originStruct == undefined) {
				this.state = VisualTrackDetailComponentState.UPDATE_INSTANCE
			} else {
				switch (this.originStructFieldName) {
					// insertion point for state computation
					default:
						console.log(this.originStructFieldName + " is unkown association")
				}
			}
		}

		this.getVisualTrack()

		// observable for changes in structs
		this.visualtrackService.VisualTrackServiceChanged.subscribe(
			message => {
				if (message == "post" || message == "update" || message == "delete") {
					this.getVisualTrack()
				}
			}
		)

		// insertion point for initialisation of enums list
		this.ColorEnumList = ColorEnumList
	}

	getVisualTrack(): void {

		this.frontRepoService.pull().subscribe(
			frontRepo => {
				this.frontRepo = frontRepo

				switch (this.state) {
					case VisualTrackDetailComponentState.CREATE_INSTANCE:
						this.visualtrack = new (VisualTrackDB)
						break;
					case VisualTrackDetailComponentState.UPDATE_INSTANCE:
						let visualtrack = frontRepo.VisualTracks.get(this.id)
						console.assert(visualtrack != undefined, "missing visualtrack with id:" + this.id)
						this.visualtrack = visualtrack!
						break;
					// insertion point for init of association field
					default:
						console.log(this.state + " is unkown state")
				}

				// insertion point for recovery of form controls value for bool fields
				this.DisplayTrackHistoryFormControl.setValue(this.visualtrack.DisplayTrackHistory)
				this.DisplayLevelAndSpeedFormControl.setValue(this.visualtrack.DisplayLevelAndSpeed)
			}
		)


	}

	save(): void {

		// some fields needs to be translated into serializable forms
		// pointers fields, after the translation, are nulled in order to perform serialization

		// insertion point for translation/nullation of each field
		if (this.visualtrack.LayerGroupID == undefined) {
			this.visualtrack.LayerGroupID = new NullInt64
		}
		if (this.visualtrack.LayerGroup != undefined) {
			this.visualtrack.LayerGroupID.Int64 = this.visualtrack.LayerGroup.ID
			this.visualtrack.LayerGroupID.Valid = true
		} else {
			this.visualtrack.LayerGroupID.Int64 = 0
			this.visualtrack.LayerGroupID.Valid = true
		}
		if (this.visualtrack.DivIconID == undefined) {
			this.visualtrack.DivIconID = new NullInt64
		}
		if (this.visualtrack.DivIcon != undefined) {
			this.visualtrack.DivIconID.Int64 = this.visualtrack.DivIcon.ID
			this.visualtrack.DivIconID.Valid = true
		} else {
			this.visualtrack.DivIconID.Int64 = 0
			this.visualtrack.DivIconID.Valid = true
		}
		this.visualtrack.DisplayTrackHistory = this.DisplayTrackHistoryFormControl.value
		this.visualtrack.DisplayLevelAndSpeed = this.DisplayLevelAndSpeedFormControl.value

		// save from the front pointer space to the non pointer space for serialization

		// insertion point for translation/nullation of each pointers

		switch (this.state) {
			case VisualTrackDetailComponentState.UPDATE_INSTANCE:
				this.visualtrackService.updateVisualTrack(this.visualtrack)
					.subscribe(visualtrack => {
						this.visualtrackService.VisualTrackServiceChanged.next("update")
					});
				break;
			default:
				this.visualtrackService.postVisualTrack(this.visualtrack).subscribe(visualtrack => {
					this.visualtrackService.VisualTrackServiceChanged.next("post")
					this.visualtrack = new (VisualTrackDB) // reset fields
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

			dialogData.ID = this.visualtrack.ID!
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
			dialogData.ID = this.visualtrack.ID!
			dialogData.ReversePointer = reverseField
			dialogData.OrderingMode = false
			dialogData.SelectionMode = selectionMode

			// set up the source
			dialogData.SourceStruct = "VisualTrack"
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
			ID: this.visualtrack.ID,
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
		if (this.visualtrack.Name == undefined) {
			this.visualtrack.Name = event.value.Name
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
