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
import { UserClickDB } from '../userclick-db'
import { UserClickService } from '../userclick.service'

// TableComponent is initilizaed from different routes
// TableComponentMode detail different cases 
enum TableComponentMode {
  DISPLAY_MODE,
  ONE_MANY_ASSOCIATION_MODE,
  MANY_MANY_ASSOCIATION_MODE,
}

// generated table component
@Component({
  selector: 'app-userclickstable',
  templateUrl: './userclicks-table.component.html',
  styleUrls: ['./userclicks-table.component.css'],
})
export class UserClicksTableComponent implements OnInit {

  // mode at invocation
  mode: TableComponentMode = TableComponentMode.DISPLAY_MODE

  // used if the component is called as a selection component of UserClick instances
  selection: SelectionModel<UserClickDB> = new (SelectionModel)
  initialSelection = new Array<UserClickDB>()

  // the data source for the table
  userclicks: UserClickDB[] = []
  matTableDataSource: MatTableDataSource<UserClickDB> = new (MatTableDataSource)

  // front repo, that will be referenced by this.userclicks
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
    this.matTableDataSource.sortingDataAccessor = (userclickDB: UserClickDB, property: string) => {
      switch (property) {
        case 'ID':
          return userclickDB.ID

        // insertion point for specific sorting accessor
        case 'Name':
          return userclickDB.Name;

        case 'Lat':
          return userclickDB.Lat;

        case 'Lng':
          return userclickDB.Lng;

        case 'TimeOfClick':
          return userclickDB.TimeOfClick.getDate();

        default:
          console.assert(false, "Unknown field")
          return "";
      }
    };

    // enable filtering on all fields (including pointers and reverse pointer, which is not done by default)
    this.matTableDataSource.filterPredicate = (userclickDB: UserClickDB, filter: string) => {

      // filtering is based on finding a lower case filter into a concatenated string
      // the userclickDB properties
      let mergedContent = ""

      // insertion point for merging of fields
      mergedContent += userclickDB.Name.toLowerCase()
      mergedContent += userclickDB.Lat.toString()
      mergedContent += userclickDB.Lng.toString()

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
    private userclickService: UserClickService,
    private frontRepoService: FrontRepoService,

    // not null if the component is called as a selection component of userclick instances
    public dialogRef: MatDialogRef<UserClicksTableComponent>,
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
    this.userclickService.UserClickServiceChanged.subscribe(
      message => {
        if (message == "post" || message == "update" || message == "delete") {
          this.getUserClicks()
        }
      }
    )
    if (this.mode == TableComponentMode.DISPLAY_MODE) {
      this.displayedColumns = ['ID', 'Edit', 'Delete', // insertion point for columns to display
        "Name",
        "Lat",
        "Lng",
        "TimeOfClick",
      ]
    } else {
      this.displayedColumns = ['select', 'ID', // insertion point for columns to display
        "Name",
        "Lat",
        "Lng",
        "TimeOfClick",
      ]
      this.selection = new SelectionModel<UserClickDB>(allowMultiSelect, this.initialSelection);
    }

  }

  ngOnInit(): void {
    this.getUserClicks()
    this.matTableDataSource = new MatTableDataSource(this.userclicks)
  }

  getUserClicks(): void {
    this.frontRepoService.pull().subscribe(
      frontRepo => {
        this.frontRepo = frontRepo

        this.userclicks = this.frontRepo.UserClicks_array;

        // insertion point for variables Recoveries

        // in case the component is called as a selection component
        if (this.mode == TableComponentMode.ONE_MANY_ASSOCIATION_MODE) {
          for (let userclick of this.userclicks) {
            let ID = this.dialogData.ID
            let revPointer = userclick[this.dialogData.ReversePointer as keyof UserClickDB] as unknown as NullInt64
            if (revPointer.Int64 == ID) {
              this.initialSelection.push(userclick)
            }
            this.selection = new SelectionModel<UserClickDB>(allowMultiSelect, this.initialSelection);
          }
        }

        if (this.mode == TableComponentMode.MANY_MANY_ASSOCIATION_MODE) {

          let mapOfSourceInstances = this.frontRepo[this.dialogData.SourceStruct + "s" as keyof FrontRepo] as Map<number, UserClickDB>
          let sourceInstance = mapOfSourceInstances.get(this.dialogData.ID)!

          let sourceField = sourceInstance[this.dialogData.SourceField as keyof typeof sourceInstance]! as unknown as UserClickDB[]
          for (let associationInstance of sourceField) {
            let userclick = associationInstance[this.dialogData.IntermediateStructField as keyof typeof associationInstance] as unknown as UserClickDB
            this.initialSelection.push(userclick)
          }

          this.selection = new SelectionModel<UserClickDB>(allowMultiSelect, this.initialSelection);
        }

        // update the mat table data source
        this.matTableDataSource.data = this.userclicks
      }
    )
  }

  // newUserClick initiate a new userclick
  // create a new UserClick objet
  newUserClick() {
  }

  deleteUserClick(userclickID: number, userclick: UserClickDB) {
    // list of userclicks is truncated of userclick before the delete
    this.userclicks = this.userclicks.filter(h => h !== userclick);

    this.userclickService.deleteUserClick(userclickID).subscribe(
      userclick => {
        this.userclickService.UserClickServiceChanged.next("delete")
      }
    );
  }

  editUserClick(userclickID: number, userclick: UserClickDB) {

  }

  // display userclick in router
  displayUserClickInRouter(userclickID: number) {
    this.router.navigate(["github_com_fullstack_lang_gongleaflet_go-" + "userclick-display", userclickID])
  }

  // set editor outlet
  setEditorRouterOutlet(userclickID: number) {
    this.router.navigate([{
      outlets: {
        github_com_fullstack_lang_gongleaflet_go_editor: ["github_com_fullstack_lang_gongleaflet_go-" + "userclick-detail", userclickID]
      }
    }]);
  }

  // set presentation outlet
  setPresentationRouterOutlet(userclickID: number) {
    this.router.navigate([{
      outlets: {
        github_com_fullstack_lang_gongleaflet_go_presentation: ["github_com_fullstack_lang_gongleaflet_go-" + "userclick-presentation", userclickID]
      }
    }]);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.userclicks.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.userclicks.forEach(row => this.selection.select(row));
  }

  save() {

    if (this.mode == TableComponentMode.ONE_MANY_ASSOCIATION_MODE) {

      let toUpdate = new Set<UserClickDB>()

      // reset all initial selection of userclick that belong to userclick
      for (let userclick of this.initialSelection) {
        let index = userclick[this.dialogData.ReversePointer as keyof UserClickDB] as unknown as NullInt64
        index.Int64 = 0
        index.Valid = true
        toUpdate.add(userclick)

      }

      // from selection, set userclick that belong to userclick
      for (let userclick of this.selection.selected) {
        let ID = this.dialogData.ID as number
        let reversePointer = userclick[this.dialogData.ReversePointer as keyof UserClickDB] as unknown as NullInt64
        reversePointer.Int64 = ID
        reversePointer.Valid = true
        toUpdate.add(userclick)
      }


      // update all userclick (only update selection & initial selection)
      for (let userclick of toUpdate) {
        this.userclickService.updateUserClick(userclick)
          .subscribe(userclick => {
            this.userclickService.UserClickServiceChanged.next("update")
          });
      }
    }

    if (this.mode == TableComponentMode.MANY_MANY_ASSOCIATION_MODE) {

      // get the source instance via the map of instances in the front repo
      let mapOfSourceInstances = this.frontRepo[this.dialogData.SourceStruct + "s" as keyof FrontRepo] as Map<number, UserClickDB>
      let sourceInstance = mapOfSourceInstances.get(this.dialogData.ID)!

      // First, parse all instance of the association struct and remove the instance
      // that have unselect
      let unselectedUserClick = new Set<number>()
      for (let userclick of this.initialSelection) {
        if (this.selection.selected.includes(userclick)) {
          // console.log("userclick " + userclick.Name + " is still selected")
        } else {
          console.log("userclick " + userclick.Name + " has been unselected")
          unselectedUserClick.add(userclick.ID)
          console.log("is unselected " + unselectedUserClick.has(userclick.ID))
        }
      }

      // delete the association instance
      let associationInstance = sourceInstance[this.dialogData.SourceField as keyof typeof sourceInstance]
      let userclick = associationInstance![this.dialogData.IntermediateStructField as keyof typeof associationInstance] as unknown as UserClickDB
      if (unselectedUserClick.has(userclick.ID)) {
        this.frontRepoService.deleteService(this.dialogData.IntermediateStruct, associationInstance)


      }

      // is the source array is empty create it
      if (sourceInstance[this.dialogData.SourceField as keyof typeof sourceInstance] == undefined) {
        (sourceInstance[this.dialogData.SourceField as keyof typeof sourceInstance] as unknown as Array<UserClickDB>) = new Array<UserClickDB>()
      }

      // second, parse all instance of the selected
      if (sourceInstance[this.dialogData.SourceField as keyof typeof sourceInstance]) {
        this.selection.selected.forEach(
          userclick => {
            if (!this.initialSelection.includes(userclick)) {
              // console.log("userclick " + userclick.Name + " has been added to the selection")

              let associationInstance = {
                Name: sourceInstance["Name"] + "-" + userclick.Name,
              }

              let index = associationInstance[this.dialogData.IntermediateStructField + "ID" as keyof typeof associationInstance] as unknown as NullInt64
              index.Int64 = userclick.ID
              index.Valid = true

              let indexDB = associationInstance[this.dialogData.IntermediateStructField + "DBID" as keyof typeof associationInstance] as unknown as NullInt64
              indexDB.Int64 = userclick.ID
              index.Valid = true

              this.frontRepoService.postService(this.dialogData.IntermediateStruct, associationInstance)

            } else {
              // console.log("userclick " + userclick.Name + " is still selected")
            }
          }
        )
      }

      // this.selection = new SelectionModel<UserClickDB>(allowMultiSelect, this.initialSelection);
    }

    // why pizza ?
    this.dialogRef.close('Pizza!');
  }
}
