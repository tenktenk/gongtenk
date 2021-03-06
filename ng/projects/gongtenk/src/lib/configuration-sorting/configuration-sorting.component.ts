// generated by gong
import { Component, OnInit, Inject, Optional } from '@angular/core';
import { TypeofExpr } from '@angular/compiler';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog'
import { DialogData } from '../front-repo.service'
import { SelectionModel } from '@angular/cdk/collections';

import { Router, RouterState } from '@angular/router';
import { ConfigurationDB } from '../configuration-db'
import { ConfigurationService } from '../configuration.service'

import { FrontRepoService, FrontRepo } from '../front-repo.service'
import { NullInt64 } from '../null-int64'

@Component({
  selector: 'lib-configuration-sorting',
  templateUrl: './configuration-sorting.component.html',
  styleUrls: ['./configuration-sorting.component.css']
})
export class ConfigurationSortingComponent implements OnInit {

  frontRepo: FrontRepo = new (FrontRepo)

  // array of Configuration instances that are in the association
  associatedConfigurations = new Array<ConfigurationDB>();

  constructor(
    private configurationService: ConfigurationService,
    private frontRepoService: FrontRepoService,

    // not null if the component is called as a selection component of configuration instances
    public dialogRef: MatDialogRef<ConfigurationSortingComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: DialogData,

    private router: Router,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit(): void {
    this.getConfigurations()
  }

  getConfigurations(): void {
    this.frontRepoService.pull().subscribe(
      frontRepo => {
        this.frontRepo = frontRepo

        let index = 0
        for (let configuration of this.frontRepo.Configurations_array) {
          let ID = this.dialogData.ID
          let revPointerID = configuration[this.dialogData.ReversePointer as keyof ConfigurationDB] as unknown as NullInt64
          let revPointerID_Index = configuration[this.dialogData.ReversePointer + "_Index" as keyof ConfigurationDB] as unknown as NullInt64
          if (revPointerID.Int64 == ID) {
            if (revPointerID_Index == undefined) {
              revPointerID_Index = new NullInt64
              revPointerID_Index.Valid = true
              revPointerID_Index.Int64 = index++
            }
            this.associatedConfigurations.push(configuration)
          }
        }

        // sort associated configuration according to order
        this.associatedConfigurations.sort((t1, t2) => {
          let t1_revPointerID_Index = t1[this.dialogData.ReversePointer + "_Index" as keyof typeof t1] as unknown as NullInt64
          let t2_revPointerID_Index = t2[this.dialogData.ReversePointer + "_Index" as keyof typeof t2] as unknown as NullInt64
          if (t1_revPointerID_Index && t2_revPointerID_Index) {
            if (t1_revPointerID_Index.Int64 > t2_revPointerID_Index.Int64) {
              return 1;
            }
            if (t1_revPointerID_Index.Int64 < t2_revPointerID_Index.Int64) {
              return -1;
            }
          }
          return 0;
        });
      }
    )
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.associatedConfigurations, event.previousIndex, event.currentIndex);

    // set the order of Configuration instances
    let index = 0

    for (let configuration of this.associatedConfigurations) {
      let revPointerID_Index = configuration[this.dialogData.ReversePointer + "_Index" as keyof ConfigurationDB] as unknown as NullInt64
      revPointerID_Index.Valid = true
      revPointerID_Index.Int64 = index++
    }
  }

  save() {

    this.associatedConfigurations.forEach(
      configuration => {
        this.configurationService.updateConfiguration(configuration)
          .subscribe(configuration => {
            this.configurationService.ConfigurationServiceChanged.next("update")
          });
      }
    )

    this.dialogRef.close('Sorting of ' + this.dialogData.ReversePointer +' done');
  }
}
