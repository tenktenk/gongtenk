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
import { LayerGroupUseDB } from '../layergroupuse-db'
import { LayerGroupUseService } from '../layergroupuse.service'

// TableComponent is initilizaed from different routes
// TableComponentMode detail different cases 
enum TableComponentMode {
  DISPLAY_MODE,
  ONE_MANY_ASSOCIATION_MODE,
  MANY_MANY_ASSOCIATION_MODE,
}

// generated table component
@Component({
  selector: 'app-layergroupusestable',
  templateUrl: './layergroupuses-table.component.html',
  styleUrls: ['./layergroupuses-table.component.css'],
})
export class LayerGroupUsesTableComponent implements OnInit {

  // mode at invocation
  mode: TableComponentMode = TableComponentMode.DISPLAY_MODE

  // used if the component is called as a selection component of LayerGroupUse instances
  selection: SelectionModel<LayerGroupUseDB> = new (SelectionModel)
  initialSelection = new Array<LayerGroupUseDB>()

  // the data source for the table
  layergroupuses: LayerGroupUseDB[] = []
  matTableDataSource: MatTableDataSource<LayerGroupUseDB> = new (MatTableDataSource)

  // front repo, that will be referenced by this.layergroupuses
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
    this.matTableDataSource.sortingDataAccessor = (layergroupuseDB: LayerGroupUseDB, property: string) => {
      switch (property) {
        case 'ID':
          return layergroupuseDB.ID

        // insertion point for specific sorting accessor
        case 'Name':
          return layergroupuseDB.Name;

        case 'Display':
          return layergroupuseDB.Display?"true":"false";

        case 'LayerGroup':
          return (layergroupuseDB.LayerGroup ? layergroupuseDB.LayerGroup.Name : '');

        case 'MapOptions_LayerGroupUses':
          return this.frontRepo.MapOptionss.get(layergroupuseDB.MapOptions_LayerGroupUsesDBID.Int64)!.Name;

        default:
          console.assert(false, "Unknown field")
          return "";
      }
    };

    // enable filtering on all fields (including pointers and reverse pointer, which is not done by default)
    this.matTableDataSource.filterPredicate = (layergroupuseDB: LayerGroupUseDB, filter: string) => {

      // filtering is based on finding a lower case filter into a concatenated string
      // the layergroupuseDB properties
      let mergedContent = ""

      // insertion point for merging of fields
      mergedContent += layergroupuseDB.Name.toLowerCase()
      if (layergroupuseDB.LayerGroup) {
        mergedContent += layergroupuseDB.LayerGroup.Name.toLowerCase()
      }
      if (layergroupuseDB.MapOptions_LayerGroupUsesDBID.Int64 != 0) {
        mergedContent += this.frontRepo.MapOptionss.get(layergroupuseDB.MapOptions_LayerGroupUsesDBID.Int64)!.Name.toLowerCase()
      }


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
    private layergroupuseService: LayerGroupUseService,
    private frontRepoService: FrontRepoService,

    // not null if the component is called as a selection component of layergroupuse instances
    public dialogRef: MatDialogRef<LayerGroupUsesTableComponent>,
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
    this.layergroupuseService.LayerGroupUseServiceChanged.subscribe(
      message => {
        if (message == "post" || message == "update" || message == "delete") {
          this.getLayerGroupUses()
        }
      }
    )
    if (this.mode == TableComponentMode.DISPLAY_MODE) {
      this.displayedColumns = ['ID', 'Edit', 'Delete', // insertion point for columns to display
        "Name",
        "Display",
        "LayerGroup",
        "MapOptions_LayerGroupUses",
      ]
    } else {
      this.displayedColumns = ['select', 'ID', // insertion point for columns to display
        "Name",
        "Display",
        "LayerGroup",
        "MapOptions_LayerGroupUses",
      ]
      this.selection = new SelectionModel<LayerGroupUseDB>(allowMultiSelect, this.initialSelection);
    }

  }

  ngOnInit(): void {
    this.getLayerGroupUses()
    this.matTableDataSource = new MatTableDataSource(this.layergroupuses)
  }

  getLayerGroupUses(): void {
    this.frontRepoService.pull().subscribe(
      frontRepo => {
        this.frontRepo = frontRepo

        this.layergroupuses = this.frontRepo.LayerGroupUses_array;

        // insertion point for variables Recoveries

        // in case the component is called as a selection component
        if (this.mode == TableComponentMode.ONE_MANY_ASSOCIATION_MODE) {
          for (let layergroupuse of this.layergroupuses) {
            let ID = this.dialogData.ID
            let revPointer = layergroupuse[this.dialogData.ReversePointer as keyof LayerGroupUseDB] as unknown as NullInt64
            if (revPointer.Int64 == ID) {
              this.initialSelection.push(layergroupuse)
            }
            this.selection = new SelectionModel<LayerGroupUseDB>(allowMultiSelect, this.initialSelection);
          }
        }

        if (this.mode == TableComponentMode.MANY_MANY_ASSOCIATION_MODE) {

          let mapOfSourceInstances = this.frontRepo[this.dialogData.SourceStruct + "s" as keyof FrontRepo] as Map<number, LayerGroupUseDB>
          let sourceInstance = mapOfSourceInstances.get(this.dialogData.ID)!

          let sourceField = sourceInstance[this.dialogData.SourceField as keyof typeof sourceInstance]! as unknown as LayerGroupUseDB[]
          for (let associationInstance of sourceField) {
            let layergroupuse = associationInstance[this.dialogData.IntermediateStructField as keyof typeof associationInstance] as unknown as LayerGroupUseDB
            this.initialSelection.push(layergroupuse)
          }

          this.selection = new SelectionModel<LayerGroupUseDB>(allowMultiSelect, this.initialSelection);
        }

        // update the mat table data source
        this.matTableDataSource.data = this.layergroupuses
      }
    )
  }

  // newLayerGroupUse initiate a new layergroupuse
  // create a new LayerGroupUse objet
  newLayerGroupUse() {
  }

  deleteLayerGroupUse(layergroupuseID: number, layergroupuse: LayerGroupUseDB) {
    // list of layergroupuses is truncated of layergroupuse before the delete
    this.layergroupuses = this.layergroupuses.filter(h => h !== layergroupuse);

    this.layergroupuseService.deleteLayerGroupUse(layergroupuseID).subscribe(
      layergroupuse => {
        this.layergroupuseService.LayerGroupUseServiceChanged.next("delete")
      }
    );
  }

  editLayerGroupUse(layergroupuseID: number, layergroupuse: LayerGroupUseDB) {

  }

  // display layergroupuse in router
  displayLayerGroupUseInRouter(layergroupuseID: number) {
    this.router.navigate(["github_com_fullstack_lang_gongleaflet_go-" + "layergroupuse-display", layergroupuseID])
  }

  // set editor outlet
  setEditorRouterOutlet(layergroupuseID: number) {
    this.router.navigate([{
      outlets: {
        github_com_fullstack_lang_gongleaflet_go_editor: ["github_com_fullstack_lang_gongleaflet_go-" + "layergroupuse-detail", layergroupuseID]
      }
    }]);
  }

  // set presentation outlet
  setPresentationRouterOutlet(layergroupuseID: number) {
    this.router.navigate([{
      outlets: {
        github_com_fullstack_lang_gongleaflet_go_presentation: ["github_com_fullstack_lang_gongleaflet_go-" + "layergroupuse-presentation", layergroupuseID]
      }
    }]);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.layergroupuses.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.layergroupuses.forEach(row => this.selection.select(row));
  }

  save() {

    if (this.mode == TableComponentMode.ONE_MANY_ASSOCIATION_MODE) {

      let toUpdate = new Set<LayerGroupUseDB>()

      // reset all initial selection of layergroupuse that belong to layergroupuse
      for (let layergroupuse of this.initialSelection) {
        let index = layergroupuse[this.dialogData.ReversePointer as keyof LayerGroupUseDB] as unknown as NullInt64
        index.Int64 = 0
        index.Valid = true
        toUpdate.add(layergroupuse)

      }

      // from selection, set layergroupuse that belong to layergroupuse
      for (let layergroupuse of this.selection.selected) {
        let ID = this.dialogData.ID as number
        let reversePointer = layergroupuse[this.dialogData.ReversePointer as keyof LayerGroupUseDB] as unknown as NullInt64
        reversePointer.Int64 = ID
        reversePointer.Valid = true
        toUpdate.add(layergroupuse)
      }


      // update all layergroupuse (only update selection & initial selection)
      for (let layergroupuse of toUpdate) {
        this.layergroupuseService.updateLayerGroupUse(layergroupuse)
          .subscribe(layergroupuse => {
            this.layergroupuseService.LayerGroupUseServiceChanged.next("update")
          });
      }
    }

    if (this.mode == TableComponentMode.MANY_MANY_ASSOCIATION_MODE) {

      // get the source instance via the map of instances in the front repo
      let mapOfSourceInstances = this.frontRepo[this.dialogData.SourceStruct + "s" as keyof FrontRepo] as Map<number, LayerGroupUseDB>
      let sourceInstance = mapOfSourceInstances.get(this.dialogData.ID)!

      // First, parse all instance of the association struct and remove the instance
      // that have unselect
      let unselectedLayerGroupUse = new Set<number>()
      for (let layergroupuse of this.initialSelection) {
        if (this.selection.selected.includes(layergroupuse)) {
          // console.log("layergroupuse " + layergroupuse.Name + " is still selected")
        } else {
          console.log("layergroupuse " + layergroupuse.Name + " has been unselected")
          unselectedLayerGroupUse.add(layergroupuse.ID)
          console.log("is unselected " + unselectedLayerGroupUse.has(layergroupuse.ID))
        }
      }

      // delete the association instance
      let associationInstance = sourceInstance[this.dialogData.SourceField as keyof typeof sourceInstance]
      let layergroupuse = associationInstance![this.dialogData.IntermediateStructField as keyof typeof associationInstance] as unknown as LayerGroupUseDB
      if (unselectedLayerGroupUse.has(layergroupuse.ID)) {
        this.frontRepoService.deleteService(this.dialogData.IntermediateStruct, associationInstance)


      }

      // is the source array is empty create it
      if (sourceInstance[this.dialogData.SourceField as keyof typeof sourceInstance] == undefined) {
        (sourceInstance[this.dialogData.SourceField as keyof typeof sourceInstance] as unknown as Array<LayerGroupUseDB>) = new Array<LayerGroupUseDB>()
      }

      // second, parse all instance of the selected
      if (sourceInstance[this.dialogData.SourceField as keyof typeof sourceInstance]) {
        this.selection.selected.forEach(
          layergroupuse => {
            if (!this.initialSelection.includes(layergroupuse)) {
              // console.log("layergroupuse " + layergroupuse.Name + " has been added to the selection")

              let associationInstance = {
                Name: sourceInstance["Name"] + "-" + layergroupuse.Name,
              }

              let index = associationInstance[this.dialogData.IntermediateStructField + "ID" as keyof typeof associationInstance] as unknown as NullInt64
              index.Int64 = layergroupuse.ID
              index.Valid = true

              let indexDB = associationInstance[this.dialogData.IntermediateStructField + "DBID" as keyof typeof associationInstance] as unknown as NullInt64
              indexDB.Int64 = layergroupuse.ID
              index.Valid = true

              this.frontRepoService.postService(this.dialogData.IntermediateStruct, associationInstance)

            } else {
              // console.log("layergroupuse " + layergroupuse.Name + " is still selected")
            }
          }
        )
      }

      // this.selection = new SelectionModel<LayerGroupUseDB>(allowMultiSelect, this.initialSelection);
    }

    // why pizza ?
    this.dialogRef.close('Pizza!');
  }
}
