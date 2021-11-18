// generated by gong
import { Component, OnInit, AfterViewInit, ViewChild, Inject, Optional } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatButton } from '@angular/material/button'

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog'
import { DialogData, FrontRepoService, FrontRepo, SelectionMode } from '../front-repo.service'
import { NullInt64 } from '../null-int64'
import { SelectionModel } from '@angular/cdk/collections';

const allowMultiSelect = true;

import { Router, RouterState } from '@angular/router';
import { IndividualDB } from '../individual-db'
import { IndividualService } from '../individual.service'

// TableComponent is initilizaed from different routes
// TableComponentMode detail different cases 
enum TableComponentMode {
  DISPLAY_MODE,
  ONE_MANY_ASSOCIATION_MODE,
  MANY_MANY_ASSOCIATION_MODE,
}

// generated table component
@Component({
  selector: 'app-individualstable',
  templateUrl: './individuals-table.component.html',
  styleUrls: ['./individuals-table.component.css'],
})
export class IndividualsTableComponent implements OnInit {

  // mode at invocation
  mode: TableComponentMode = TableComponentMode.DISPLAY_MODE

  // used if the component is called as a selection component of Individual instances
  selection: SelectionModel<IndividualDB> = new (SelectionModel)
  initialSelection = new Array<IndividualDB>()

  // the data source for the table
  individuals: IndividualDB[] = []
  matTableDataSource: MatTableDataSource<IndividualDB> = new (MatTableDataSource)

  // front repo, that will be referenced by this.individuals
  frontRepo: FrontRepo = new (FrontRepo)

  // displayedColumns is referenced by the MatTable component for specify what columns
  // have to be displayed and in what order
  displayedColumns: string[];

  // for sorting & pagination
  @ViewChild(MatSort)
  sort: MatSort | undefined
  @ViewChild(MatPaginator)
  paginator: MatPaginator | undefined;

  ngAfterViewInit() {

    // enable sorting on all fields (including pointers and reverse pointer)
    this.matTableDataSource.sortingDataAccessor = (individualDB: IndividualDB, property: string) => {
      switch (property) {
        case 'ID':
          return individualDB.ID

        // insertion point for specific sorting accessor
        case 'Name':
          return individualDB.Name;

        case 'Lat':
          return individualDB.Lat;

        case 'Lng':
          return individualDB.Lng;

        case 'TwinLat':
          return individualDB.TwinLat;

        case 'TwinLng':
          return individualDB.TwinLng;

        case 'Twin':
          return individualDB.Twin?"true":"false";

        default:
          console.assert(false, "Unknown field")
          return "";
      }
    };

    // enable filtering on all fields (including pointers and reverse pointer, which is not done by default)
    this.matTableDataSource.filterPredicate = (individualDB: IndividualDB, filter: string) => {

      // filtering is based on finding a lower case filter into a concatenated string
      // the individualDB properties
      let mergedContent = ""

      // insertion point for merging of fields
      mergedContent += individualDB.Name.toLowerCase()
      mergedContent += individualDB.Lat.toString()
      mergedContent += individualDB.Lng.toString()
      mergedContent += individualDB.TwinLat.toString()
      mergedContent += individualDB.TwinLng.toString()

      let isSelected = mergedContent.includes(filter.toLowerCase())
      return isSelected
    };

    this.matTableDataSource.sort = this.sort!
    this.matTableDataSource.paginator = this.paginator!
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.matTableDataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(
    private individualService: IndividualService,
    private frontRepoService: FrontRepoService,

    // not null if the component is called as a selection component of individual instances
    public dialogRef: MatDialogRef<IndividualsTableComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: DialogData,

    private router: Router,
  ) {

    // compute mode
    if (dialogData == undefined) {
      this.mode = TableComponentMode.DISPLAY_MODE
    } else {
      switch (dialogData.SelectionMode) {
        case SelectionMode.ONE_MANY_ASSOCIATION_MODE:
          this.mode = TableComponentMode.ONE_MANY_ASSOCIATION_MODE
          break
        case SelectionMode.MANY_MANY_ASSOCIATION_MODE:
          this.mode = TableComponentMode.MANY_MANY_ASSOCIATION_MODE
          break
        default:
      }
    }

    // observable for changes in structs
    this.individualService.IndividualServiceChanged.subscribe(
      message => {
        if (message == "post" || message == "update" || message == "delete") {
          this.getIndividuals()
        }
      }
    )
    if (this.mode == TableComponentMode.DISPLAY_MODE) {
      this.displayedColumns = ['ID', 'Edit', 'Delete', // insertion point for columns to display
        "Name",
        "Lat",
        "Lng",
        "TwinLat",
        "TwinLng",
        "Twin",
      ]
    } else {
      this.displayedColumns = ['select', 'ID', // insertion point for columns to display
        "Name",
        "Lat",
        "Lng",
        "TwinLat",
        "TwinLng",
        "Twin",
      ]
      this.selection = new SelectionModel<IndividualDB>(allowMultiSelect, this.initialSelection);
    }

  }

  ngOnInit(): void {
    this.getIndividuals()
    this.matTableDataSource = new MatTableDataSource(this.individuals)
  }

  getIndividuals(): void {
    this.frontRepoService.pull().subscribe(
      frontRepo => {
        this.frontRepo = frontRepo

        this.individuals = this.frontRepo.Individuals_array;

        // insertion point for variables Recoveries

        // in case the component is called as a selection component
        if (this.mode == TableComponentMode.ONE_MANY_ASSOCIATION_MODE) {
          for (let individual of this.individuals) {
            let ID = this.dialogData.ID
            let revPointer = individual[this.dialogData.ReversePointer as keyof IndividualDB] as unknown as NullInt64
            if (revPointer.Int64 == ID) {
              this.initialSelection.push(individual)
            }
            this.selection = new SelectionModel<IndividualDB>(allowMultiSelect, this.initialSelection);
          }
        }

        if (this.mode == TableComponentMode.MANY_MANY_ASSOCIATION_MODE) {

          let mapOfSourceInstances = this.frontRepo[this.dialogData.SourceStruct + "s" as keyof FrontRepo] as Map<number, IndividualDB>
          let sourceInstance = mapOfSourceInstances.get(this.dialogData.ID)!

          let sourceField = sourceInstance[this.dialogData.SourceField as keyof typeof sourceInstance]! as unknown as IndividualDB[]
          for (let associationInstance of sourceField) {
            let individual = associationInstance[this.dialogData.IntermediateStructField as keyof typeof associationInstance] as unknown as IndividualDB
            this.initialSelection.push(individual)
          }

          this.selection = new SelectionModel<IndividualDB>(allowMultiSelect, this.initialSelection);
        }

        // update the mat table data source
        this.matTableDataSource.data = this.individuals
      }
    )
  }

  // newIndividual initiate a new individual
  // create a new Individual objet
  newIndividual() {
  }

  deleteIndividual(individualID: number, individual: IndividualDB) {
    // list of individuals is truncated of individual before the delete
    this.individuals = this.individuals.filter(h => h !== individual);

    this.individualService.deleteIndividual(individualID).subscribe(
      individual => {
        this.individualService.IndividualServiceChanged.next("delete")
      }
    );
  }

  editIndividual(individualID: number, individual: IndividualDB) {

  }

  // display individual in router
  displayIndividualInRouter(individualID: number) {
    this.router.navigate(["github_com_tenktenk_gongtenk_go-" + "individual-display", individualID])
  }

  // set editor outlet
  setEditorRouterOutlet(individualID: number) {
    this.router.navigate([{
      outlets: {
        github_com_tenktenk_gongtenk_go_editor: ["github_com_tenktenk_gongtenk_go-" + "individual-detail", individualID]
      }
    }]);
  }

  // set presentation outlet
  setPresentationRouterOutlet(individualID: number) {
    this.router.navigate([{
      outlets: {
        github_com_tenktenk_gongtenk_go_presentation: ["github_com_tenktenk_gongtenk_go-" + "individual-presentation", individualID]
      }
    }]);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.individuals.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.individuals.forEach(row => this.selection.select(row));
  }

  save() {

    if (this.mode == TableComponentMode.ONE_MANY_ASSOCIATION_MODE) {

      let toUpdate = new Set<IndividualDB>()

      // reset all initial selection of individual that belong to individual
      for (let individual of this.initialSelection) {
        let index = individual[this.dialogData.ReversePointer as keyof IndividualDB] as unknown as NullInt64
        index.Int64 = 0
        index.Valid = true
        toUpdate.add(individual)

      }

      // from selection, set individual that belong to individual
      for (let individual of this.selection.selected) {
        let ID = this.dialogData.ID as number
        let reversePointer = individual[this.dialogData.ReversePointer as keyof IndividualDB] as unknown as NullInt64
        reversePointer.Int64 = ID
        reversePointer.Valid = true
        toUpdate.add(individual)
      }


      // update all individual (only update selection & initial selection)
      for (let individual of toUpdate) {
        this.individualService.updateIndividual(individual)
          .subscribe(individual => {
            this.individualService.IndividualServiceChanged.next("update")
          });
      }
    }

    if (this.mode == TableComponentMode.MANY_MANY_ASSOCIATION_MODE) {

      // get the source instance via the map of instances in the front repo
      let mapOfSourceInstances = this.frontRepo[this.dialogData.SourceStruct + "s" as keyof FrontRepo] as Map<number, IndividualDB>
      let sourceInstance = mapOfSourceInstances.get(this.dialogData.ID)!

      // First, parse all instance of the association struct and remove the instance
      // that have unselect
      let unselectedIndividual = new Set<number>()
      for (let individual of this.initialSelection) {
        if (this.selection.selected.includes(individual)) {
          // console.log("individual " + individual.Name + " is still selected")
        } else {
          console.log("individual " + individual.Name + " has been unselected")
          unselectedIndividual.add(individual.ID)
          console.log("is unselected " + unselectedIndividual.has(individual.ID))
        }
      }

      // delete the association instance
      let associationInstance = sourceInstance[this.dialogData.SourceField as keyof typeof sourceInstance]
      let individual = associationInstance![this.dialogData.IntermediateStructField as keyof typeof associationInstance] as unknown as IndividualDB
      if (unselectedIndividual.has(individual.ID)) {
        this.frontRepoService.deleteService(this.dialogData.IntermediateStruct, associationInstance)


      }

      // is the source array is empty create it
      if (sourceInstance[this.dialogData.SourceField as keyof typeof sourceInstance] == undefined) {
        (sourceInstance[this.dialogData.SourceField as keyof typeof sourceInstance] as unknown as Array<IndividualDB>) = new Array<IndividualDB>()
      }

      // second, parse all instance of the selected
      if (sourceInstance[this.dialogData.SourceField as keyof typeof sourceInstance]) {
        this.selection.selected.forEach(
          individual => {
            if (!this.initialSelection.includes(individual)) {
              // console.log("individual " + individual.Name + " has been added to the selection")

              let associationInstance = {
                Name: sourceInstance["Name"] + "-" + individual.Name,
              }

              let index = associationInstance[this.dialogData.IntermediateStructField + "ID" as keyof typeof associationInstance] as unknown as NullInt64
              index.Int64 = individual.ID
              index.Valid = true

              let indexDB = associationInstance[this.dialogData.IntermediateStructField + "DBID" as keyof typeof associationInstance] as unknown as NullInt64
              indexDB.Int64 = individual.ID
              index.Valid = true

              this.frontRepoService.postService(this.dialogData.IntermediateStruct, associationInstance)

            } else {
              // console.log("individual " + individual.Name + " is still selected")
            }
          }
        )
      }

      // this.selection = new SelectionModel<IndividualDB>(allowMultiSelect, this.initialSelection);
    }

    // why pizza ?
    this.dialogRef.close('Pizza!');
  }
}
