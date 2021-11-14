import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, combineLatest, BehaviorSubject } from 'rxjs';

// insertion point sub template for services imports 
import { CheckoutSchedulerDB } from './checkoutscheduler-db'
import { CheckoutSchedulerService } from './checkoutscheduler.service'

import { CircleDB } from './circle-db'
import { CircleService } from './circle.service'

import { DivIconDB } from './divicon-db'
import { DivIconService } from './divicon.service'

import { LayerGroupDB } from './layergroup-db'
import { LayerGroupService } from './layergroup.service'

import { LayerGroupUseDB } from './layergroupuse-db'
import { LayerGroupUseService } from './layergroupuse.service'

import { MapOptionsDB } from './mapoptions-db'
import { MapOptionsService } from './mapoptions.service'

import { MarkerDB } from './marker-db'
import { MarkerService } from './marker.service'

import { VLineDB } from './vline-db'
import { VLineService } from './vline.service'

import { VisualTrackDB } from './visualtrack-db'
import { VisualTrackService } from './visualtrack.service'


// FrontRepo stores all instances in a front repository (design pattern repository)
export class FrontRepo { // insertion point sub template 
  CheckoutSchedulers_array = new Array<CheckoutSchedulerDB>(); // array of repo instances
  CheckoutSchedulers = new Map<number, CheckoutSchedulerDB>(); // map of repo instances
  CheckoutSchedulers_batch = new Map<number, CheckoutSchedulerDB>(); // same but only in last GET (for finding repo instances to delete)
  Circles_array = new Array<CircleDB>(); // array of repo instances
  Circles = new Map<number, CircleDB>(); // map of repo instances
  Circles_batch = new Map<number, CircleDB>(); // same but only in last GET (for finding repo instances to delete)
  DivIcons_array = new Array<DivIconDB>(); // array of repo instances
  DivIcons = new Map<number, DivIconDB>(); // map of repo instances
  DivIcons_batch = new Map<number, DivIconDB>(); // same but only in last GET (for finding repo instances to delete)
  LayerGroups_array = new Array<LayerGroupDB>(); // array of repo instances
  LayerGroups = new Map<number, LayerGroupDB>(); // map of repo instances
  LayerGroups_batch = new Map<number, LayerGroupDB>(); // same but only in last GET (for finding repo instances to delete)
  LayerGroupUses_array = new Array<LayerGroupUseDB>(); // array of repo instances
  LayerGroupUses = new Map<number, LayerGroupUseDB>(); // map of repo instances
  LayerGroupUses_batch = new Map<number, LayerGroupUseDB>(); // same but only in last GET (for finding repo instances to delete)
  MapOptionss_array = new Array<MapOptionsDB>(); // array of repo instances
  MapOptionss = new Map<number, MapOptionsDB>(); // map of repo instances
  MapOptionss_batch = new Map<number, MapOptionsDB>(); // same but only in last GET (for finding repo instances to delete)
  Markers_array = new Array<MarkerDB>(); // array of repo instances
  Markers = new Map<number, MarkerDB>(); // map of repo instances
  Markers_batch = new Map<number, MarkerDB>(); // same but only in last GET (for finding repo instances to delete)
  VLines_array = new Array<VLineDB>(); // array of repo instances
  VLines = new Map<number, VLineDB>(); // map of repo instances
  VLines_batch = new Map<number, VLineDB>(); // same but only in last GET (for finding repo instances to delete)
  VisualTracks_array = new Array<VisualTrackDB>(); // array of repo instances
  VisualTracks = new Map<number, VisualTrackDB>(); // map of repo instances
  VisualTracks_batch = new Map<number, VisualTrackDB>(); // same but only in last GET (for finding repo instances to delete)
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
    private checkoutschedulerService: CheckoutSchedulerService,
    private circleService: CircleService,
    private diviconService: DivIconService,
    private layergroupService: LayerGroupService,
    private layergroupuseService: LayerGroupUseService,
    private mapoptionsService: MapOptionsService,
    private markerService: MarkerService,
    private vlineService: VLineService,
    private visualtrackService: VisualTrackService,
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
    Observable<CheckoutSchedulerDB[]>,
    Observable<CircleDB[]>,
    Observable<DivIconDB[]>,
    Observable<LayerGroupDB[]>,
    Observable<LayerGroupUseDB[]>,
    Observable<MapOptionsDB[]>,
    Observable<MarkerDB[]>,
    Observable<VLineDB[]>,
    Observable<VisualTrackDB[]>,
  ] = [ // insertion point sub template 
      this.checkoutschedulerService.getCheckoutSchedulers(),
      this.circleService.getCircles(),
      this.diviconService.getDivIcons(),
      this.layergroupService.getLayerGroups(),
      this.layergroupuseService.getLayerGroupUses(),
      this.mapoptionsService.getMapOptionss(),
      this.markerService.getMarkers(),
      this.vlineService.getVLines(),
      this.visualtrackService.getVisualTracks(),
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
            checkoutschedulers_,
            circles_,
            divicons_,
            layergroups_,
            layergroupuses_,
            mapoptionss_,
            markers_,
            vlines_,
            visualtracks_,
          ]) => {
            // Typing can be messy with many items. Therefore, type casting is necessary here
            // insertion point sub template for type casting 
            var checkoutschedulers: CheckoutSchedulerDB[]
            checkoutschedulers = checkoutschedulers_ as CheckoutSchedulerDB[]
            var circles: CircleDB[]
            circles = circles_ as CircleDB[]
            var divicons: DivIconDB[]
            divicons = divicons_ as DivIconDB[]
            var layergroups: LayerGroupDB[]
            layergroups = layergroups_ as LayerGroupDB[]
            var layergroupuses: LayerGroupUseDB[]
            layergroupuses = layergroupuses_ as LayerGroupUseDB[]
            var mapoptionss: MapOptionsDB[]
            mapoptionss = mapoptionss_ as MapOptionsDB[]
            var markers: MarkerDB[]
            markers = markers_ as MarkerDB[]
            var vlines: VLineDB[]
            vlines = vlines_ as VLineDB[]
            var visualtracks: VisualTrackDB[]
            visualtracks = visualtracks_ as VisualTrackDB[]

            // 
            // First Step: init map of instances
            // insertion point sub template for init 
            // init the array
            FrontRepoSingloton.CheckoutSchedulers_array = checkoutschedulers

            // clear the map that counts CheckoutScheduler in the GET
            FrontRepoSingloton.CheckoutSchedulers_batch.clear()

            checkoutschedulers.forEach(
              checkoutscheduler => {
                FrontRepoSingloton.CheckoutSchedulers.set(checkoutscheduler.ID, checkoutscheduler)
                FrontRepoSingloton.CheckoutSchedulers_batch.set(checkoutscheduler.ID, checkoutscheduler)
              }
            )

            // clear checkoutschedulers that are absent from the batch
            FrontRepoSingloton.CheckoutSchedulers.forEach(
              checkoutscheduler => {
                if (FrontRepoSingloton.CheckoutSchedulers_batch.get(checkoutscheduler.ID) == undefined) {
                  FrontRepoSingloton.CheckoutSchedulers.delete(checkoutscheduler.ID)
                }
              }
            )

            // sort CheckoutSchedulers_array array
            FrontRepoSingloton.CheckoutSchedulers_array.sort((t1, t2) => {
              if (t1.Name > t2.Name) {
                return 1;
              }
              if (t1.Name < t2.Name) {
                return -1;
              }
              return 0;
            });

            // init the array
            FrontRepoSingloton.Circles_array = circles

            // clear the map that counts Circle in the GET
            FrontRepoSingloton.Circles_batch.clear()

            circles.forEach(
              circle => {
                FrontRepoSingloton.Circles.set(circle.ID, circle)
                FrontRepoSingloton.Circles_batch.set(circle.ID, circle)
              }
            )

            // clear circles that are absent from the batch
            FrontRepoSingloton.Circles.forEach(
              circle => {
                if (FrontRepoSingloton.Circles_batch.get(circle.ID) == undefined) {
                  FrontRepoSingloton.Circles.delete(circle.ID)
                }
              }
            )

            // sort Circles_array array
            FrontRepoSingloton.Circles_array.sort((t1, t2) => {
              if (t1.Name > t2.Name) {
                return 1;
              }
              if (t1.Name < t2.Name) {
                return -1;
              }
              return 0;
            });

            // init the array
            FrontRepoSingloton.DivIcons_array = divicons

            // clear the map that counts DivIcon in the GET
            FrontRepoSingloton.DivIcons_batch.clear()

            divicons.forEach(
              divicon => {
                FrontRepoSingloton.DivIcons.set(divicon.ID, divicon)
                FrontRepoSingloton.DivIcons_batch.set(divicon.ID, divicon)
              }
            )

            // clear divicons that are absent from the batch
            FrontRepoSingloton.DivIcons.forEach(
              divicon => {
                if (FrontRepoSingloton.DivIcons_batch.get(divicon.ID) == undefined) {
                  FrontRepoSingloton.DivIcons.delete(divicon.ID)
                }
              }
            )

            // sort DivIcons_array array
            FrontRepoSingloton.DivIcons_array.sort((t1, t2) => {
              if (t1.Name > t2.Name) {
                return 1;
              }
              if (t1.Name < t2.Name) {
                return -1;
              }
              return 0;
            });

            // init the array
            FrontRepoSingloton.LayerGroups_array = layergroups

            // clear the map that counts LayerGroup in the GET
            FrontRepoSingloton.LayerGroups_batch.clear()

            layergroups.forEach(
              layergroup => {
                FrontRepoSingloton.LayerGroups.set(layergroup.ID, layergroup)
                FrontRepoSingloton.LayerGroups_batch.set(layergroup.ID, layergroup)
              }
            )

            // clear layergroups that are absent from the batch
            FrontRepoSingloton.LayerGroups.forEach(
              layergroup => {
                if (FrontRepoSingloton.LayerGroups_batch.get(layergroup.ID) == undefined) {
                  FrontRepoSingloton.LayerGroups.delete(layergroup.ID)
                }
              }
            )

            // sort LayerGroups_array array
            FrontRepoSingloton.LayerGroups_array.sort((t1, t2) => {
              if (t1.Name > t2.Name) {
                return 1;
              }
              if (t1.Name < t2.Name) {
                return -1;
              }
              return 0;
            });

            // init the array
            FrontRepoSingloton.LayerGroupUses_array = layergroupuses

            // clear the map that counts LayerGroupUse in the GET
            FrontRepoSingloton.LayerGroupUses_batch.clear()

            layergroupuses.forEach(
              layergroupuse => {
                FrontRepoSingloton.LayerGroupUses.set(layergroupuse.ID, layergroupuse)
                FrontRepoSingloton.LayerGroupUses_batch.set(layergroupuse.ID, layergroupuse)
              }
            )

            // clear layergroupuses that are absent from the batch
            FrontRepoSingloton.LayerGroupUses.forEach(
              layergroupuse => {
                if (FrontRepoSingloton.LayerGroupUses_batch.get(layergroupuse.ID) == undefined) {
                  FrontRepoSingloton.LayerGroupUses.delete(layergroupuse.ID)
                }
              }
            )

            // sort LayerGroupUses_array array
            FrontRepoSingloton.LayerGroupUses_array.sort((t1, t2) => {
              if (t1.Name > t2.Name) {
                return 1;
              }
              if (t1.Name < t2.Name) {
                return -1;
              }
              return 0;
            });

            // init the array
            FrontRepoSingloton.MapOptionss_array = mapoptionss

            // clear the map that counts MapOptions in the GET
            FrontRepoSingloton.MapOptionss_batch.clear()

            mapoptionss.forEach(
              mapoptions => {
                FrontRepoSingloton.MapOptionss.set(mapoptions.ID, mapoptions)
                FrontRepoSingloton.MapOptionss_batch.set(mapoptions.ID, mapoptions)
              }
            )

            // clear mapoptionss that are absent from the batch
            FrontRepoSingloton.MapOptionss.forEach(
              mapoptions => {
                if (FrontRepoSingloton.MapOptionss_batch.get(mapoptions.ID) == undefined) {
                  FrontRepoSingloton.MapOptionss.delete(mapoptions.ID)
                }
              }
            )

            // sort MapOptionss_array array
            FrontRepoSingloton.MapOptionss_array.sort((t1, t2) => {
              if (t1.Name > t2.Name) {
                return 1;
              }
              if (t1.Name < t2.Name) {
                return -1;
              }
              return 0;
            });

            // init the array
            FrontRepoSingloton.Markers_array = markers

            // clear the map that counts Marker in the GET
            FrontRepoSingloton.Markers_batch.clear()

            markers.forEach(
              marker => {
                FrontRepoSingloton.Markers.set(marker.ID, marker)
                FrontRepoSingloton.Markers_batch.set(marker.ID, marker)
              }
            )

            // clear markers that are absent from the batch
            FrontRepoSingloton.Markers.forEach(
              marker => {
                if (FrontRepoSingloton.Markers_batch.get(marker.ID) == undefined) {
                  FrontRepoSingloton.Markers.delete(marker.ID)
                }
              }
            )

            // sort Markers_array array
            FrontRepoSingloton.Markers_array.sort((t1, t2) => {
              if (t1.Name > t2.Name) {
                return 1;
              }
              if (t1.Name < t2.Name) {
                return -1;
              }
              return 0;
            });

            // init the array
            FrontRepoSingloton.VLines_array = vlines

            // clear the map that counts VLine in the GET
            FrontRepoSingloton.VLines_batch.clear()

            vlines.forEach(
              vline => {
                FrontRepoSingloton.VLines.set(vline.ID, vline)
                FrontRepoSingloton.VLines_batch.set(vline.ID, vline)
              }
            )

            // clear vlines that are absent from the batch
            FrontRepoSingloton.VLines.forEach(
              vline => {
                if (FrontRepoSingloton.VLines_batch.get(vline.ID) == undefined) {
                  FrontRepoSingloton.VLines.delete(vline.ID)
                }
              }
            )

            // sort VLines_array array
            FrontRepoSingloton.VLines_array.sort((t1, t2) => {
              if (t1.Name > t2.Name) {
                return 1;
              }
              if (t1.Name < t2.Name) {
                return -1;
              }
              return 0;
            });

            // init the array
            FrontRepoSingloton.VisualTracks_array = visualtracks

            // clear the map that counts VisualTrack in the GET
            FrontRepoSingloton.VisualTracks_batch.clear()

            visualtracks.forEach(
              visualtrack => {
                FrontRepoSingloton.VisualTracks.set(visualtrack.ID, visualtrack)
                FrontRepoSingloton.VisualTracks_batch.set(visualtrack.ID, visualtrack)
              }
            )

            // clear visualtracks that are absent from the batch
            FrontRepoSingloton.VisualTracks.forEach(
              visualtrack => {
                if (FrontRepoSingloton.VisualTracks_batch.get(visualtrack.ID) == undefined) {
                  FrontRepoSingloton.VisualTracks.delete(visualtrack.ID)
                }
              }
            )

            // sort VisualTracks_array array
            FrontRepoSingloton.VisualTracks_array.sort((t1, t2) => {
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
            checkoutschedulers.forEach(
              checkoutscheduler => {
                // insertion point sub sub template for ONE-/ZERO-ONE associations pointers redeeming

                // insertion point for redeeming ONE-MANY associations
              }
            )
            circles.forEach(
              circle => {
                // insertion point sub sub template for ONE-/ZERO-ONE associations pointers redeeming
                // insertion point for pointer field LayerGroup redeeming
                {
                  let _layergroup = FrontRepoSingloton.LayerGroups.get(circle.LayerGroupID.Int64)
                  if (_layergroup) {
                    circle.LayerGroup = _layergroup
                  }
                }

                // insertion point for redeeming ONE-MANY associations
              }
            )
            divicons.forEach(
              divicon => {
                // insertion point sub sub template for ONE-/ZERO-ONE associations pointers redeeming

                // insertion point for redeeming ONE-MANY associations
              }
            )
            layergroups.forEach(
              layergroup => {
                // insertion point sub sub template for ONE-/ZERO-ONE associations pointers redeeming

                // insertion point for redeeming ONE-MANY associations
              }
            )
            layergroupuses.forEach(
              layergroupuse => {
                // insertion point sub sub template for ONE-/ZERO-ONE associations pointers redeeming
                // insertion point for pointer field LayerGroup redeeming
                {
                  let _layergroup = FrontRepoSingloton.LayerGroups.get(layergroupuse.LayerGroupID.Int64)
                  if (_layergroup) {
                    layergroupuse.LayerGroup = _layergroup
                  }
                }

                // insertion point for redeeming ONE-MANY associations
                // insertion point for slice of pointer field MapOptions.LayerGroupUses redeeming
                {
                  let _mapoptions = FrontRepoSingloton.MapOptionss.get(layergroupuse.MapOptions_LayerGroupUsesDBID.Int64)
                  if (_mapoptions) {
                    if (_mapoptions.LayerGroupUses == undefined) {
                      _mapoptions.LayerGroupUses = new Array<LayerGroupUseDB>()
                    }
                    _mapoptions.LayerGroupUses.push(layergroupuse)
                    if (layergroupuse.MapOptions_LayerGroupUses_reverse == undefined) {
                      layergroupuse.MapOptions_LayerGroupUses_reverse = _mapoptions
                    }
                  }
                }
              }
            )
            mapoptionss.forEach(
              mapoptions => {
                // insertion point sub sub template for ONE-/ZERO-ONE associations pointers redeeming

                // insertion point for redeeming ONE-MANY associations
              }
            )
            markers.forEach(
              marker => {
                // insertion point sub sub template for ONE-/ZERO-ONE associations pointers redeeming
                // insertion point for pointer field LayerGroup redeeming
                {
                  let _layergroup = FrontRepoSingloton.LayerGroups.get(marker.LayerGroupID.Int64)
                  if (_layergroup) {
                    marker.LayerGroup = _layergroup
                  }
                }
                // insertion point for pointer field DivIcon redeeming
                {
                  let _divicon = FrontRepoSingloton.DivIcons.get(marker.DivIconID.Int64)
                  if (_divicon) {
                    marker.DivIcon = _divicon
                  }
                }

                // insertion point for redeeming ONE-MANY associations
              }
            )
            vlines.forEach(
              vline => {
                // insertion point sub sub template for ONE-/ZERO-ONE associations pointers redeeming
                // insertion point for pointer field LayerGroup redeeming
                {
                  let _layergroup = FrontRepoSingloton.LayerGroups.get(vline.LayerGroupID.Int64)
                  if (_layergroup) {
                    vline.LayerGroup = _layergroup
                  }
                }

                // insertion point for redeeming ONE-MANY associations
              }
            )
            visualtracks.forEach(
              visualtrack => {
                // insertion point sub sub template for ONE-/ZERO-ONE associations pointers redeeming
                // insertion point for pointer field LayerGroup redeeming
                {
                  let _layergroup = FrontRepoSingloton.LayerGroups.get(visualtrack.LayerGroupID.Int64)
                  if (_layergroup) {
                    visualtrack.LayerGroup = _layergroup
                  }
                }
                // insertion point for pointer field DivIcon redeeming
                {
                  let _divicon = FrontRepoSingloton.DivIcons.get(visualtrack.DivIconID.Int64)
                  if (_divicon) {
                    visualtrack.DivIcon = _divicon
                  }
                }

                // insertion point for redeeming ONE-MANY associations
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

  // CheckoutSchedulerPull performs a GET on CheckoutScheduler of the stack and redeem association pointers 
  CheckoutSchedulerPull(): Observable<FrontRepo> {
    return new Observable<FrontRepo>(
      (observer) => {
        combineLatest([
          this.checkoutschedulerService.getCheckoutSchedulers()
        ]).subscribe(
          ([ // insertion point sub template 
            checkoutschedulers,
          ]) => {
            // init the array
            FrontRepoSingloton.CheckoutSchedulers_array = checkoutschedulers

            // clear the map that counts CheckoutScheduler in the GET
            FrontRepoSingloton.CheckoutSchedulers_batch.clear()

            // 
            // First Step: init map of instances
            // insertion point sub template 
            checkoutschedulers.forEach(
              checkoutscheduler => {
                FrontRepoSingloton.CheckoutSchedulers.set(checkoutscheduler.ID, checkoutscheduler)
                FrontRepoSingloton.CheckoutSchedulers_batch.set(checkoutscheduler.ID, checkoutscheduler)

                // insertion point for redeeming ONE/ZERO-ONE associations

                // insertion point for redeeming ONE-MANY associations
              }
            )

            // clear checkoutschedulers that are absent from the GET
            FrontRepoSingloton.CheckoutSchedulers.forEach(
              checkoutscheduler => {
                if (FrontRepoSingloton.CheckoutSchedulers_batch.get(checkoutscheduler.ID) == undefined) {
                  FrontRepoSingloton.CheckoutSchedulers.delete(checkoutscheduler.ID)
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

  // CirclePull performs a GET on Circle of the stack and redeem association pointers 
  CirclePull(): Observable<FrontRepo> {
    return new Observable<FrontRepo>(
      (observer) => {
        combineLatest([
          this.circleService.getCircles()
        ]).subscribe(
          ([ // insertion point sub template 
            circles,
          ]) => {
            // init the array
            FrontRepoSingloton.Circles_array = circles

            // clear the map that counts Circle in the GET
            FrontRepoSingloton.Circles_batch.clear()

            // 
            // First Step: init map of instances
            // insertion point sub template 
            circles.forEach(
              circle => {
                FrontRepoSingloton.Circles.set(circle.ID, circle)
                FrontRepoSingloton.Circles_batch.set(circle.ID, circle)

                // insertion point for redeeming ONE/ZERO-ONE associations
                // insertion point for pointer field LayerGroup redeeming
                {
                  let _layergroup = FrontRepoSingloton.LayerGroups.get(circle.LayerGroupID.Int64)
                  if (_layergroup) {
                    circle.LayerGroup = _layergroup
                  }
                }

                // insertion point for redeeming ONE-MANY associations
              }
            )

            // clear circles that are absent from the GET
            FrontRepoSingloton.Circles.forEach(
              circle => {
                if (FrontRepoSingloton.Circles_batch.get(circle.ID) == undefined) {
                  FrontRepoSingloton.Circles.delete(circle.ID)
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

  // DivIconPull performs a GET on DivIcon of the stack and redeem association pointers 
  DivIconPull(): Observable<FrontRepo> {
    return new Observable<FrontRepo>(
      (observer) => {
        combineLatest([
          this.diviconService.getDivIcons()
        ]).subscribe(
          ([ // insertion point sub template 
            divicons,
          ]) => {
            // init the array
            FrontRepoSingloton.DivIcons_array = divicons

            // clear the map that counts DivIcon in the GET
            FrontRepoSingloton.DivIcons_batch.clear()

            // 
            // First Step: init map of instances
            // insertion point sub template 
            divicons.forEach(
              divicon => {
                FrontRepoSingloton.DivIcons.set(divicon.ID, divicon)
                FrontRepoSingloton.DivIcons_batch.set(divicon.ID, divicon)

                // insertion point for redeeming ONE/ZERO-ONE associations

                // insertion point for redeeming ONE-MANY associations
              }
            )

            // clear divicons that are absent from the GET
            FrontRepoSingloton.DivIcons.forEach(
              divicon => {
                if (FrontRepoSingloton.DivIcons_batch.get(divicon.ID) == undefined) {
                  FrontRepoSingloton.DivIcons.delete(divicon.ID)
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

  // LayerGroupPull performs a GET on LayerGroup of the stack and redeem association pointers 
  LayerGroupPull(): Observable<FrontRepo> {
    return new Observable<FrontRepo>(
      (observer) => {
        combineLatest([
          this.layergroupService.getLayerGroups()
        ]).subscribe(
          ([ // insertion point sub template 
            layergroups,
          ]) => {
            // init the array
            FrontRepoSingloton.LayerGroups_array = layergroups

            // clear the map that counts LayerGroup in the GET
            FrontRepoSingloton.LayerGroups_batch.clear()

            // 
            // First Step: init map of instances
            // insertion point sub template 
            layergroups.forEach(
              layergroup => {
                FrontRepoSingloton.LayerGroups.set(layergroup.ID, layergroup)
                FrontRepoSingloton.LayerGroups_batch.set(layergroup.ID, layergroup)

                // insertion point for redeeming ONE/ZERO-ONE associations

                // insertion point for redeeming ONE-MANY associations
              }
            )

            // clear layergroups that are absent from the GET
            FrontRepoSingloton.LayerGroups.forEach(
              layergroup => {
                if (FrontRepoSingloton.LayerGroups_batch.get(layergroup.ID) == undefined) {
                  FrontRepoSingloton.LayerGroups.delete(layergroup.ID)
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

  // LayerGroupUsePull performs a GET on LayerGroupUse of the stack and redeem association pointers 
  LayerGroupUsePull(): Observable<FrontRepo> {
    return new Observable<FrontRepo>(
      (observer) => {
        combineLatest([
          this.layergroupuseService.getLayerGroupUses()
        ]).subscribe(
          ([ // insertion point sub template 
            layergroupuses,
          ]) => {
            // init the array
            FrontRepoSingloton.LayerGroupUses_array = layergroupuses

            // clear the map that counts LayerGroupUse in the GET
            FrontRepoSingloton.LayerGroupUses_batch.clear()

            // 
            // First Step: init map of instances
            // insertion point sub template 
            layergroupuses.forEach(
              layergroupuse => {
                FrontRepoSingloton.LayerGroupUses.set(layergroupuse.ID, layergroupuse)
                FrontRepoSingloton.LayerGroupUses_batch.set(layergroupuse.ID, layergroupuse)

                // insertion point for redeeming ONE/ZERO-ONE associations
                // insertion point for pointer field LayerGroup redeeming
                {
                  let _layergroup = FrontRepoSingloton.LayerGroups.get(layergroupuse.LayerGroupID.Int64)
                  if (_layergroup) {
                    layergroupuse.LayerGroup = _layergroup
                  }
                }

                // insertion point for redeeming ONE-MANY associations
                // insertion point for slice of pointer field MapOptions.LayerGroupUses redeeming
                {
                  let _mapoptions = FrontRepoSingloton.MapOptionss.get(layergroupuse.MapOptions_LayerGroupUsesDBID.Int64)
                  if (_mapoptions) {
                    if (_mapoptions.LayerGroupUses == undefined) {
                      _mapoptions.LayerGroupUses = new Array<LayerGroupUseDB>()
                    }
                    _mapoptions.LayerGroupUses.push(layergroupuse)
                    if (layergroupuse.MapOptions_LayerGroupUses_reverse == undefined) {
                      layergroupuse.MapOptions_LayerGroupUses_reverse = _mapoptions
                    }
                  }
                }
              }
            )

            // clear layergroupuses that are absent from the GET
            FrontRepoSingloton.LayerGroupUses.forEach(
              layergroupuse => {
                if (FrontRepoSingloton.LayerGroupUses_batch.get(layergroupuse.ID) == undefined) {
                  FrontRepoSingloton.LayerGroupUses.delete(layergroupuse.ID)
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

  // MapOptionsPull performs a GET on MapOptions of the stack and redeem association pointers 
  MapOptionsPull(): Observable<FrontRepo> {
    return new Observable<FrontRepo>(
      (observer) => {
        combineLatest([
          this.mapoptionsService.getMapOptionss()
        ]).subscribe(
          ([ // insertion point sub template 
            mapoptionss,
          ]) => {
            // init the array
            FrontRepoSingloton.MapOptionss_array = mapoptionss

            // clear the map that counts MapOptions in the GET
            FrontRepoSingloton.MapOptionss_batch.clear()

            // 
            // First Step: init map of instances
            // insertion point sub template 
            mapoptionss.forEach(
              mapoptions => {
                FrontRepoSingloton.MapOptionss.set(mapoptions.ID, mapoptions)
                FrontRepoSingloton.MapOptionss_batch.set(mapoptions.ID, mapoptions)

                // insertion point for redeeming ONE/ZERO-ONE associations

                // insertion point for redeeming ONE-MANY associations
              }
            )

            // clear mapoptionss that are absent from the GET
            FrontRepoSingloton.MapOptionss.forEach(
              mapoptions => {
                if (FrontRepoSingloton.MapOptionss_batch.get(mapoptions.ID) == undefined) {
                  FrontRepoSingloton.MapOptionss.delete(mapoptions.ID)
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

  // MarkerPull performs a GET on Marker of the stack and redeem association pointers 
  MarkerPull(): Observable<FrontRepo> {
    return new Observable<FrontRepo>(
      (observer) => {
        combineLatest([
          this.markerService.getMarkers()
        ]).subscribe(
          ([ // insertion point sub template 
            markers,
          ]) => {
            // init the array
            FrontRepoSingloton.Markers_array = markers

            // clear the map that counts Marker in the GET
            FrontRepoSingloton.Markers_batch.clear()

            // 
            // First Step: init map of instances
            // insertion point sub template 
            markers.forEach(
              marker => {
                FrontRepoSingloton.Markers.set(marker.ID, marker)
                FrontRepoSingloton.Markers_batch.set(marker.ID, marker)

                // insertion point for redeeming ONE/ZERO-ONE associations
                // insertion point for pointer field LayerGroup redeeming
                {
                  let _layergroup = FrontRepoSingloton.LayerGroups.get(marker.LayerGroupID.Int64)
                  if (_layergroup) {
                    marker.LayerGroup = _layergroup
                  }
                }
                // insertion point for pointer field DivIcon redeeming
                {
                  let _divicon = FrontRepoSingloton.DivIcons.get(marker.DivIconID.Int64)
                  if (_divicon) {
                    marker.DivIcon = _divicon
                  }
                }

                // insertion point for redeeming ONE-MANY associations
              }
            )

            // clear markers that are absent from the GET
            FrontRepoSingloton.Markers.forEach(
              marker => {
                if (FrontRepoSingloton.Markers_batch.get(marker.ID) == undefined) {
                  FrontRepoSingloton.Markers.delete(marker.ID)
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

  // VLinePull performs a GET on VLine of the stack and redeem association pointers 
  VLinePull(): Observable<FrontRepo> {
    return new Observable<FrontRepo>(
      (observer) => {
        combineLatest([
          this.vlineService.getVLines()
        ]).subscribe(
          ([ // insertion point sub template 
            vlines,
          ]) => {
            // init the array
            FrontRepoSingloton.VLines_array = vlines

            // clear the map that counts VLine in the GET
            FrontRepoSingloton.VLines_batch.clear()

            // 
            // First Step: init map of instances
            // insertion point sub template 
            vlines.forEach(
              vline => {
                FrontRepoSingloton.VLines.set(vline.ID, vline)
                FrontRepoSingloton.VLines_batch.set(vline.ID, vline)

                // insertion point for redeeming ONE/ZERO-ONE associations
                // insertion point for pointer field LayerGroup redeeming
                {
                  let _layergroup = FrontRepoSingloton.LayerGroups.get(vline.LayerGroupID.Int64)
                  if (_layergroup) {
                    vline.LayerGroup = _layergroup
                  }
                }

                // insertion point for redeeming ONE-MANY associations
              }
            )

            // clear vlines that are absent from the GET
            FrontRepoSingloton.VLines.forEach(
              vline => {
                if (FrontRepoSingloton.VLines_batch.get(vline.ID) == undefined) {
                  FrontRepoSingloton.VLines.delete(vline.ID)
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

  // VisualTrackPull performs a GET on VisualTrack of the stack and redeem association pointers 
  VisualTrackPull(): Observable<FrontRepo> {
    return new Observable<FrontRepo>(
      (observer) => {
        combineLatest([
          this.visualtrackService.getVisualTracks()
        ]).subscribe(
          ([ // insertion point sub template 
            visualtracks,
          ]) => {
            // init the array
            FrontRepoSingloton.VisualTracks_array = visualtracks

            // clear the map that counts VisualTrack in the GET
            FrontRepoSingloton.VisualTracks_batch.clear()

            // 
            // First Step: init map of instances
            // insertion point sub template 
            visualtracks.forEach(
              visualtrack => {
                FrontRepoSingloton.VisualTracks.set(visualtrack.ID, visualtrack)
                FrontRepoSingloton.VisualTracks_batch.set(visualtrack.ID, visualtrack)

                // insertion point for redeeming ONE/ZERO-ONE associations
                // insertion point for pointer field LayerGroup redeeming
                {
                  let _layergroup = FrontRepoSingloton.LayerGroups.get(visualtrack.LayerGroupID.Int64)
                  if (_layergroup) {
                    visualtrack.LayerGroup = _layergroup
                  }
                }
                // insertion point for pointer field DivIcon redeeming
                {
                  let _divicon = FrontRepoSingloton.DivIcons.get(visualtrack.DivIconID.Int64)
                  if (_divicon) {
                    visualtrack.DivIcon = _divicon
                  }
                }

                // insertion point for redeeming ONE-MANY associations
              }
            )

            // clear visualtracks that are absent from the GET
            FrontRepoSingloton.VisualTracks.forEach(
              visualtrack => {
                if (FrontRepoSingloton.VisualTracks_batch.get(visualtrack.ID) == undefined) {
                  FrontRepoSingloton.VisualTracks.delete(visualtrack.ID)
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
export function getCheckoutSchedulerUniqueID(id: number): number {
  return 31 * id
}
export function getCircleUniqueID(id: number): number {
  return 37 * id
}
export function getDivIconUniqueID(id: number): number {
  return 41 * id
}
export function getLayerGroupUniqueID(id: number): number {
  return 43 * id
}
export function getLayerGroupUseUniqueID(id: number): number {
  return 47 * id
}
export function getMapOptionsUniqueID(id: number): number {
  return 53 * id
}
export function getMarkerUniqueID(id: number): number {
  return 59 * id
}
export function getVLineUniqueID(id: number): number {
  return 61 * id
}
export function getVisualTrackUniqueID(id: number): number {
  return 67 * id
}
