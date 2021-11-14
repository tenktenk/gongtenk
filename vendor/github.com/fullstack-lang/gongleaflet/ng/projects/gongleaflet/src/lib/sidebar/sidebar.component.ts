import { Component, OnInit } from '@angular/core';
import { Router, RouterState } from '@angular/router';

import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

import { FrontRepoService, FrontRepo } from '../front-repo.service'
import { CommitNbService } from '../commitnb.service'

// insertion point for per struct import code
import { CheckoutSchedulerService } from '../checkoutscheduler.service'
import { getCheckoutSchedulerUniqueID } from '../front-repo.service'
import { CircleService } from '../circle.service'
import { getCircleUniqueID } from '../front-repo.service'
import { DivIconService } from '../divicon.service'
import { getDivIconUniqueID } from '../front-repo.service'
import { LayerGroupService } from '../layergroup.service'
import { getLayerGroupUniqueID } from '../front-repo.service'
import { LayerGroupUseService } from '../layergroupuse.service'
import { getLayerGroupUseUniqueID } from '../front-repo.service'
import { MapOptionsService } from '../mapoptions.service'
import { getMapOptionsUniqueID } from '../front-repo.service'
import { MarkerService } from '../marker.service'
import { getMarkerUniqueID } from '../front-repo.service'
import { VLineService } from '../vline.service'
import { getVLineUniqueID } from '../front-repo.service'
import { VisualTrackService } from '../visualtrack.service'
import { getVisualTrackUniqueID } from '../front-repo.service'

/**
 * Types of a GongNode / GongFlatNode
 */
export enum GongNodeType {
  STRUCT = "STRUCT",
  INSTANCE = "INSTANCE",
  ONE__ZERO_ONE_ASSOCIATION = 'ONE__ZERO_ONE_ASSOCIATION',
  ONE__ZERO_MANY_ASSOCIATION = 'ONE__ZERO_MANY_ASSOCIATION',
}

/**
 * GongNode is the "data" node
 */
interface GongNode {
  name: string; // if STRUCT, the name of the struct, if INSTANCE the name of the instance
  children: GongNode[];
  type: GongNodeType;
  structName: string;
  associationField: string;
  associatedStructName: string;
  id: number;
  uniqueIdPerStack: number;
}


/** 
 * GongFlatNode is the dynamic visual node with expandable and level information
 * */
interface GongFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  type: GongNodeType;
  structName: string;
  associationField: string;
  associatedStructName: string;
  id: number;
  uniqueIdPerStack: number;
}


@Component({
  selector: 'app-gongleaflet-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {

  /**
  * _transformer generated a displayed node from a data node
  *
  * @param node input data noe
  * @param level input level
  *
  * @returns an ExampleFlatNode
  */
  private _transformer = (node: GongNode, level: number) => {
    return {

      /**
      * in javascript, The !! ensures the resulting type is a boolean (true or false).
      *
      * !!node.children will evaluate to true is the variable is defined
      */
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      type: node.type,
      structName: node.structName,
      associationField: node.associationField,
      associatedStructName: node.associatedStructName,
      id: node.id,
      uniqueIdPerStack: node.uniqueIdPerStack,
    }
  }

  /**
   * treeControl is passed as the paramter treeControl in the "mat-tree" selector
   *
   * Flat tree control. Able to expand/collapse a subtree recursively for flattened tree.
   *
   * Construct with flat tree data node functions getLevel and isExpandable.
  constructor(
    getLevel: (dataNode: T) => number,
    isExpandable: (dataNode: T) => boolean, 
    options?: FlatTreeControlOptions<T, K> | undefined);
   */
  treeControl = new FlatTreeControl<GongFlatNode>(
    node => node.level,
    node => node.expandable
  );

  /**
   * from mat-tree documentation
   *
   * Tree flattener to convert a normal type of node to node with children & level information.
   */
  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  /**
   * data is the other paramter to the "mat-tree" selector
   * 
   * strangely, the dataSource declaration has to follow the treeFlattener declaration
   */
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  /**
   * hasChild is used by the selector for expandable nodes
   * 
   *  <mat-tree-node *matTreeNodeDef="let node;when: hasChild" matTreeNodePadding>
   * 
   * @param _ 
   * @param node 
   */
  hasChild = (_: number, node: GongFlatNode) => node.expandable;

  // front repo
  frontRepo: FrontRepo = new (FrontRepo)
  commitNb: number = 0

  // "data" tree that is constructed during NgInit and is passed to the mat-tree component
  gongNodeTree = new Array<GongNode>();

  constructor(
    private router: Router,
    private frontRepoService: FrontRepoService,
    private commitNbService: CommitNbService,

    // insertion point for per struct service declaration
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

  ngOnInit(): void {
    this.refresh()

    // insertion point for per struct observable for refresh trigger
    // observable for changes in structs
    this.checkoutschedulerService.CheckoutSchedulerServiceChanged.subscribe(
      message => {
        if (message == "post" || message == "update" || message == "delete") {
          this.refresh()
        }
      }
    )
    // observable for changes in structs
    this.circleService.CircleServiceChanged.subscribe(
      message => {
        if (message == "post" || message == "update" || message == "delete") {
          this.refresh()
        }
      }
    )
    // observable for changes in structs
    this.diviconService.DivIconServiceChanged.subscribe(
      message => {
        if (message == "post" || message == "update" || message == "delete") {
          this.refresh()
        }
      }
    )
    // observable for changes in structs
    this.layergroupService.LayerGroupServiceChanged.subscribe(
      message => {
        if (message == "post" || message == "update" || message == "delete") {
          this.refresh()
        }
      }
    )
    // observable for changes in structs
    this.layergroupuseService.LayerGroupUseServiceChanged.subscribe(
      message => {
        if (message == "post" || message == "update" || message == "delete") {
          this.refresh()
        }
      }
    )
    // observable for changes in structs
    this.mapoptionsService.MapOptionsServiceChanged.subscribe(
      message => {
        if (message == "post" || message == "update" || message == "delete") {
          this.refresh()
        }
      }
    )
    // observable for changes in structs
    this.markerService.MarkerServiceChanged.subscribe(
      message => {
        if (message == "post" || message == "update" || message == "delete") {
          this.refresh()
        }
      }
    )
    // observable for changes in structs
    this.vlineService.VLineServiceChanged.subscribe(
      message => {
        if (message == "post" || message == "update" || message == "delete") {
          this.refresh()
        }
      }
    )
    // observable for changes in structs
    this.visualtrackService.VisualTrackServiceChanged.subscribe(
      message => {
        if (message == "post" || message == "update" || message == "delete") {
          this.refresh()
        }
      }
    )
  }

  refresh(): void {
    this.frontRepoService.pull().subscribe(frontRepo => {
      this.frontRepo = frontRepo

      // use of a Gödel number to uniquely identfy nodes : 2 * node.id + 3 * node.level
      let memoryOfExpandedNodes = new Map<number, boolean>()
      let nonInstanceNodeId = 1

      this.treeControl.dataNodes?.forEach(
        node => {
          if (this.treeControl.isExpanded(node)) {
            memoryOfExpandedNodes.set(node.uniqueIdPerStack, true)
          } else {
            memoryOfExpandedNodes.set(node.uniqueIdPerStack, false)
          }
        }
      )

      // reset the gong node tree
      this.gongNodeTree = new Array<GongNode>();
      
      // insertion point for per struct tree construction
      /**
      * fill up the CheckoutScheduler part of the mat tree
      */
      let checkoutschedulerGongNodeStruct: GongNode = {
        name: "CheckoutScheduler",
        type: GongNodeType.STRUCT,
        id: 0,
        uniqueIdPerStack: 13 * nonInstanceNodeId,
        structName: "CheckoutScheduler",
        associationField: "",
        associatedStructName: "",
        children: new Array<GongNode>()
      }
      nonInstanceNodeId = nonInstanceNodeId + 1
      this.gongNodeTree.push(checkoutschedulerGongNodeStruct)

      this.frontRepo.CheckoutSchedulers_array.sort((t1, t2) => {
        if (t1.Name > t2.Name) {
          return 1;
        }
        if (t1.Name < t2.Name) {
          return -1;
        }
        return 0;
      });

      this.frontRepo.CheckoutSchedulers_array.forEach(
        checkoutschedulerDB => {
          let checkoutschedulerGongNodeInstance: GongNode = {
            name: checkoutschedulerDB.Name,
            type: GongNodeType.INSTANCE,
            id: checkoutschedulerDB.ID,
            uniqueIdPerStack: getCheckoutSchedulerUniqueID(checkoutschedulerDB.ID),
            structName: "CheckoutScheduler",
            associationField: "",
            associatedStructName: "",
            children: new Array<GongNode>()
          }
          checkoutschedulerGongNodeStruct.children!.push(checkoutschedulerGongNodeInstance)

          // insertion point for per field code
        }
      )

      /**
      * fill up the Circle part of the mat tree
      */
      let circleGongNodeStruct: GongNode = {
        name: "Circle",
        type: GongNodeType.STRUCT,
        id: 0,
        uniqueIdPerStack: 13 * nonInstanceNodeId,
        structName: "Circle",
        associationField: "",
        associatedStructName: "",
        children: new Array<GongNode>()
      }
      nonInstanceNodeId = nonInstanceNodeId + 1
      this.gongNodeTree.push(circleGongNodeStruct)

      this.frontRepo.Circles_array.sort((t1, t2) => {
        if (t1.Name > t2.Name) {
          return 1;
        }
        if (t1.Name < t2.Name) {
          return -1;
        }
        return 0;
      });

      this.frontRepo.Circles_array.forEach(
        circleDB => {
          let circleGongNodeInstance: GongNode = {
            name: circleDB.Name,
            type: GongNodeType.INSTANCE,
            id: circleDB.ID,
            uniqueIdPerStack: getCircleUniqueID(circleDB.ID),
            structName: "Circle",
            associationField: "",
            associatedStructName: "",
            children: new Array<GongNode>()
          }
          circleGongNodeStruct.children!.push(circleGongNodeInstance)

          // insertion point for per field code
          /**
          * let append a node for the association LayerGroup
          */
          let LayerGroupGongNodeAssociation: GongNode = {
            name: "(LayerGroup) LayerGroup",
            type: GongNodeType.ONE__ZERO_ONE_ASSOCIATION,
            id: circleDB.ID,
            uniqueIdPerStack: 17 * nonInstanceNodeId,
            structName: "Circle",
            associationField: "LayerGroup",
            associatedStructName: "LayerGroup",
            children: new Array<GongNode>()
          }
          nonInstanceNodeId = nonInstanceNodeId + 1
          circleGongNodeInstance.children!.push(LayerGroupGongNodeAssociation)

          /**
            * let append a node for the instance behind the asssociation LayerGroup
            */
          if (circleDB.LayerGroup != undefined) {
            let circleGongNodeInstance_LayerGroup: GongNode = {
              name: circleDB.LayerGroup.Name,
              type: GongNodeType.INSTANCE,
              id: circleDB.LayerGroup.ID,
              uniqueIdPerStack: // godel numbering (thank you kurt)
                3 * getCircleUniqueID(circleDB.ID)
                + 5 * getLayerGroupUniqueID(circleDB.LayerGroup.ID),
              structName: "LayerGroup",
              associationField: "",
              associatedStructName: "",
              children: new Array<GongNode>()
            }
            LayerGroupGongNodeAssociation.children.push(circleGongNodeInstance_LayerGroup)
          }

        }
      )

      /**
      * fill up the DivIcon part of the mat tree
      */
      let diviconGongNodeStruct: GongNode = {
        name: "DivIcon",
        type: GongNodeType.STRUCT,
        id: 0,
        uniqueIdPerStack: 13 * nonInstanceNodeId,
        structName: "DivIcon",
        associationField: "",
        associatedStructName: "",
        children: new Array<GongNode>()
      }
      nonInstanceNodeId = nonInstanceNodeId + 1
      this.gongNodeTree.push(diviconGongNodeStruct)

      this.frontRepo.DivIcons_array.sort((t1, t2) => {
        if (t1.Name > t2.Name) {
          return 1;
        }
        if (t1.Name < t2.Name) {
          return -1;
        }
        return 0;
      });

      this.frontRepo.DivIcons_array.forEach(
        diviconDB => {
          let diviconGongNodeInstance: GongNode = {
            name: diviconDB.Name,
            type: GongNodeType.INSTANCE,
            id: diviconDB.ID,
            uniqueIdPerStack: getDivIconUniqueID(diviconDB.ID),
            structName: "DivIcon",
            associationField: "",
            associatedStructName: "",
            children: new Array<GongNode>()
          }
          diviconGongNodeStruct.children!.push(diviconGongNodeInstance)

          // insertion point for per field code
        }
      )

      /**
      * fill up the LayerGroup part of the mat tree
      */
      let layergroupGongNodeStruct: GongNode = {
        name: "LayerGroup",
        type: GongNodeType.STRUCT,
        id: 0,
        uniqueIdPerStack: 13 * nonInstanceNodeId,
        structName: "LayerGroup",
        associationField: "",
        associatedStructName: "",
        children: new Array<GongNode>()
      }
      nonInstanceNodeId = nonInstanceNodeId + 1
      this.gongNodeTree.push(layergroupGongNodeStruct)

      this.frontRepo.LayerGroups_array.sort((t1, t2) => {
        if (t1.Name > t2.Name) {
          return 1;
        }
        if (t1.Name < t2.Name) {
          return -1;
        }
        return 0;
      });

      this.frontRepo.LayerGroups_array.forEach(
        layergroupDB => {
          let layergroupGongNodeInstance: GongNode = {
            name: layergroupDB.Name,
            type: GongNodeType.INSTANCE,
            id: layergroupDB.ID,
            uniqueIdPerStack: getLayerGroupUniqueID(layergroupDB.ID),
            structName: "LayerGroup",
            associationField: "",
            associatedStructName: "",
            children: new Array<GongNode>()
          }
          layergroupGongNodeStruct.children!.push(layergroupGongNodeInstance)

          // insertion point for per field code
        }
      )

      /**
      * fill up the LayerGroupUse part of the mat tree
      */
      let layergroupuseGongNodeStruct: GongNode = {
        name: "LayerGroupUse",
        type: GongNodeType.STRUCT,
        id: 0,
        uniqueIdPerStack: 13 * nonInstanceNodeId,
        structName: "LayerGroupUse",
        associationField: "",
        associatedStructName: "",
        children: new Array<GongNode>()
      }
      nonInstanceNodeId = nonInstanceNodeId + 1
      this.gongNodeTree.push(layergroupuseGongNodeStruct)

      this.frontRepo.LayerGroupUses_array.sort((t1, t2) => {
        if (t1.Name > t2.Name) {
          return 1;
        }
        if (t1.Name < t2.Name) {
          return -1;
        }
        return 0;
      });

      this.frontRepo.LayerGroupUses_array.forEach(
        layergroupuseDB => {
          let layergroupuseGongNodeInstance: GongNode = {
            name: layergroupuseDB.Name,
            type: GongNodeType.INSTANCE,
            id: layergroupuseDB.ID,
            uniqueIdPerStack: getLayerGroupUseUniqueID(layergroupuseDB.ID),
            structName: "LayerGroupUse",
            associationField: "",
            associatedStructName: "",
            children: new Array<GongNode>()
          }
          layergroupuseGongNodeStruct.children!.push(layergroupuseGongNodeInstance)

          // insertion point for per field code
          /**
          * let append a node for the association LayerGroup
          */
          let LayerGroupGongNodeAssociation: GongNode = {
            name: "(LayerGroup) LayerGroup",
            type: GongNodeType.ONE__ZERO_ONE_ASSOCIATION,
            id: layergroupuseDB.ID,
            uniqueIdPerStack: 17 * nonInstanceNodeId,
            structName: "LayerGroupUse",
            associationField: "LayerGroup",
            associatedStructName: "LayerGroup",
            children: new Array<GongNode>()
          }
          nonInstanceNodeId = nonInstanceNodeId + 1
          layergroupuseGongNodeInstance.children!.push(LayerGroupGongNodeAssociation)

          /**
            * let append a node for the instance behind the asssociation LayerGroup
            */
          if (layergroupuseDB.LayerGroup != undefined) {
            let layergroupuseGongNodeInstance_LayerGroup: GongNode = {
              name: layergroupuseDB.LayerGroup.Name,
              type: GongNodeType.INSTANCE,
              id: layergroupuseDB.LayerGroup.ID,
              uniqueIdPerStack: // godel numbering (thank you kurt)
                3 * getLayerGroupUseUniqueID(layergroupuseDB.ID)
                + 5 * getLayerGroupUniqueID(layergroupuseDB.LayerGroup.ID),
              structName: "LayerGroup",
              associationField: "",
              associatedStructName: "",
              children: new Array<GongNode>()
            }
            LayerGroupGongNodeAssociation.children.push(layergroupuseGongNodeInstance_LayerGroup)
          }

        }
      )

      /**
      * fill up the MapOptions part of the mat tree
      */
      let mapoptionsGongNodeStruct: GongNode = {
        name: "MapOptions",
        type: GongNodeType.STRUCT,
        id: 0,
        uniqueIdPerStack: 13 * nonInstanceNodeId,
        structName: "MapOptions",
        associationField: "",
        associatedStructName: "",
        children: new Array<GongNode>()
      }
      nonInstanceNodeId = nonInstanceNodeId + 1
      this.gongNodeTree.push(mapoptionsGongNodeStruct)

      this.frontRepo.MapOptionss_array.sort((t1, t2) => {
        if (t1.Name > t2.Name) {
          return 1;
        }
        if (t1.Name < t2.Name) {
          return -1;
        }
        return 0;
      });

      this.frontRepo.MapOptionss_array.forEach(
        mapoptionsDB => {
          let mapoptionsGongNodeInstance: GongNode = {
            name: mapoptionsDB.Name,
            type: GongNodeType.INSTANCE,
            id: mapoptionsDB.ID,
            uniqueIdPerStack: getMapOptionsUniqueID(mapoptionsDB.ID),
            structName: "MapOptions",
            associationField: "",
            associatedStructName: "",
            children: new Array<GongNode>()
          }
          mapoptionsGongNodeStruct.children!.push(mapoptionsGongNodeInstance)

          // insertion point for per field code
          /**
          * let append a node for the slide of pointer LayerGroupUses
          */
          let LayerGroupUsesGongNodeAssociation: GongNode = {
            name: "(LayerGroupUse) LayerGroupUses",
            type: GongNodeType.ONE__ZERO_MANY_ASSOCIATION,
            id: mapoptionsDB.ID,
            uniqueIdPerStack: 19 * nonInstanceNodeId,
            structName: "MapOptions",
            associationField: "LayerGroupUses",
            associatedStructName: "LayerGroupUse",
            children: new Array<GongNode>()
          }
          nonInstanceNodeId = nonInstanceNodeId + 1
          mapoptionsGongNodeInstance.children.push(LayerGroupUsesGongNodeAssociation)

          mapoptionsDB.LayerGroupUses?.forEach(layergroupuseDB => {
            let layergroupuseNode: GongNode = {
              name: layergroupuseDB.Name,
              type: GongNodeType.INSTANCE,
              id: layergroupuseDB.ID,
              uniqueIdPerStack: // godel numbering (thank you kurt)
                7 * getMapOptionsUniqueID(mapoptionsDB.ID)
                + 11 * getLayerGroupUseUniqueID(layergroupuseDB.ID),
              structName: "LayerGroupUse",
              associationField: "",
              associatedStructName: "",
              children: new Array<GongNode>()
            }
            LayerGroupUsesGongNodeAssociation.children.push(layergroupuseNode)
          })

        }
      )

      /**
      * fill up the Marker part of the mat tree
      */
      let markerGongNodeStruct: GongNode = {
        name: "Marker",
        type: GongNodeType.STRUCT,
        id: 0,
        uniqueIdPerStack: 13 * nonInstanceNodeId,
        structName: "Marker",
        associationField: "",
        associatedStructName: "",
        children: new Array<GongNode>()
      }
      nonInstanceNodeId = nonInstanceNodeId + 1
      this.gongNodeTree.push(markerGongNodeStruct)

      this.frontRepo.Markers_array.sort((t1, t2) => {
        if (t1.Name > t2.Name) {
          return 1;
        }
        if (t1.Name < t2.Name) {
          return -1;
        }
        return 0;
      });

      this.frontRepo.Markers_array.forEach(
        markerDB => {
          let markerGongNodeInstance: GongNode = {
            name: markerDB.Name,
            type: GongNodeType.INSTANCE,
            id: markerDB.ID,
            uniqueIdPerStack: getMarkerUniqueID(markerDB.ID),
            structName: "Marker",
            associationField: "",
            associatedStructName: "",
            children: new Array<GongNode>()
          }
          markerGongNodeStruct.children!.push(markerGongNodeInstance)

          // insertion point for per field code
          /**
          * let append a node for the association LayerGroup
          */
          let LayerGroupGongNodeAssociation: GongNode = {
            name: "(LayerGroup) LayerGroup",
            type: GongNodeType.ONE__ZERO_ONE_ASSOCIATION,
            id: markerDB.ID,
            uniqueIdPerStack: 17 * nonInstanceNodeId,
            structName: "Marker",
            associationField: "LayerGroup",
            associatedStructName: "LayerGroup",
            children: new Array<GongNode>()
          }
          nonInstanceNodeId = nonInstanceNodeId + 1
          markerGongNodeInstance.children!.push(LayerGroupGongNodeAssociation)

          /**
            * let append a node for the instance behind the asssociation LayerGroup
            */
          if (markerDB.LayerGroup != undefined) {
            let markerGongNodeInstance_LayerGroup: GongNode = {
              name: markerDB.LayerGroup.Name,
              type: GongNodeType.INSTANCE,
              id: markerDB.LayerGroup.ID,
              uniqueIdPerStack: // godel numbering (thank you kurt)
                3 * getMarkerUniqueID(markerDB.ID)
                + 5 * getLayerGroupUniqueID(markerDB.LayerGroup.ID),
              structName: "LayerGroup",
              associationField: "",
              associatedStructName: "",
              children: new Array<GongNode>()
            }
            LayerGroupGongNodeAssociation.children.push(markerGongNodeInstance_LayerGroup)
          }

          /**
          * let append a node for the association DivIcon
          */
          let DivIconGongNodeAssociation: GongNode = {
            name: "(DivIcon) DivIcon",
            type: GongNodeType.ONE__ZERO_ONE_ASSOCIATION,
            id: markerDB.ID,
            uniqueIdPerStack: 17 * nonInstanceNodeId,
            structName: "Marker",
            associationField: "DivIcon",
            associatedStructName: "DivIcon",
            children: new Array<GongNode>()
          }
          nonInstanceNodeId = nonInstanceNodeId + 1
          markerGongNodeInstance.children!.push(DivIconGongNodeAssociation)

          /**
            * let append a node for the instance behind the asssociation DivIcon
            */
          if (markerDB.DivIcon != undefined) {
            let markerGongNodeInstance_DivIcon: GongNode = {
              name: markerDB.DivIcon.Name,
              type: GongNodeType.INSTANCE,
              id: markerDB.DivIcon.ID,
              uniqueIdPerStack: // godel numbering (thank you kurt)
                3 * getMarkerUniqueID(markerDB.ID)
                + 5 * getDivIconUniqueID(markerDB.DivIcon.ID),
              structName: "DivIcon",
              associationField: "",
              associatedStructName: "",
              children: new Array<GongNode>()
            }
            DivIconGongNodeAssociation.children.push(markerGongNodeInstance_DivIcon)
          }

        }
      )

      /**
      * fill up the VLine part of the mat tree
      */
      let vlineGongNodeStruct: GongNode = {
        name: "VLine",
        type: GongNodeType.STRUCT,
        id: 0,
        uniqueIdPerStack: 13 * nonInstanceNodeId,
        structName: "VLine",
        associationField: "",
        associatedStructName: "",
        children: new Array<GongNode>()
      }
      nonInstanceNodeId = nonInstanceNodeId + 1
      this.gongNodeTree.push(vlineGongNodeStruct)

      this.frontRepo.VLines_array.sort((t1, t2) => {
        if (t1.Name > t2.Name) {
          return 1;
        }
        if (t1.Name < t2.Name) {
          return -1;
        }
        return 0;
      });

      this.frontRepo.VLines_array.forEach(
        vlineDB => {
          let vlineGongNodeInstance: GongNode = {
            name: vlineDB.Name,
            type: GongNodeType.INSTANCE,
            id: vlineDB.ID,
            uniqueIdPerStack: getVLineUniqueID(vlineDB.ID),
            structName: "VLine",
            associationField: "",
            associatedStructName: "",
            children: new Array<GongNode>()
          }
          vlineGongNodeStruct.children!.push(vlineGongNodeInstance)

          // insertion point for per field code
          /**
          * let append a node for the association LayerGroup
          */
          let LayerGroupGongNodeAssociation: GongNode = {
            name: "(LayerGroup) LayerGroup",
            type: GongNodeType.ONE__ZERO_ONE_ASSOCIATION,
            id: vlineDB.ID,
            uniqueIdPerStack: 17 * nonInstanceNodeId,
            structName: "VLine",
            associationField: "LayerGroup",
            associatedStructName: "LayerGroup",
            children: new Array<GongNode>()
          }
          nonInstanceNodeId = nonInstanceNodeId + 1
          vlineGongNodeInstance.children!.push(LayerGroupGongNodeAssociation)

          /**
            * let append a node for the instance behind the asssociation LayerGroup
            */
          if (vlineDB.LayerGroup != undefined) {
            let vlineGongNodeInstance_LayerGroup: GongNode = {
              name: vlineDB.LayerGroup.Name,
              type: GongNodeType.INSTANCE,
              id: vlineDB.LayerGroup.ID,
              uniqueIdPerStack: // godel numbering (thank you kurt)
                3 * getVLineUniqueID(vlineDB.ID)
                + 5 * getLayerGroupUniqueID(vlineDB.LayerGroup.ID),
              structName: "LayerGroup",
              associationField: "",
              associatedStructName: "",
              children: new Array<GongNode>()
            }
            LayerGroupGongNodeAssociation.children.push(vlineGongNodeInstance_LayerGroup)
          }

        }
      )

      /**
      * fill up the VisualTrack part of the mat tree
      */
      let visualtrackGongNodeStruct: GongNode = {
        name: "VisualTrack",
        type: GongNodeType.STRUCT,
        id: 0,
        uniqueIdPerStack: 13 * nonInstanceNodeId,
        structName: "VisualTrack",
        associationField: "",
        associatedStructName: "",
        children: new Array<GongNode>()
      }
      nonInstanceNodeId = nonInstanceNodeId + 1
      this.gongNodeTree.push(visualtrackGongNodeStruct)

      this.frontRepo.VisualTracks_array.sort((t1, t2) => {
        if (t1.Name > t2.Name) {
          return 1;
        }
        if (t1.Name < t2.Name) {
          return -1;
        }
        return 0;
      });

      this.frontRepo.VisualTracks_array.forEach(
        visualtrackDB => {
          let visualtrackGongNodeInstance: GongNode = {
            name: visualtrackDB.Name,
            type: GongNodeType.INSTANCE,
            id: visualtrackDB.ID,
            uniqueIdPerStack: getVisualTrackUniqueID(visualtrackDB.ID),
            structName: "VisualTrack",
            associationField: "",
            associatedStructName: "",
            children: new Array<GongNode>()
          }
          visualtrackGongNodeStruct.children!.push(visualtrackGongNodeInstance)

          // insertion point for per field code
          /**
          * let append a node for the association LayerGroup
          */
          let LayerGroupGongNodeAssociation: GongNode = {
            name: "(LayerGroup) LayerGroup",
            type: GongNodeType.ONE__ZERO_ONE_ASSOCIATION,
            id: visualtrackDB.ID,
            uniqueIdPerStack: 17 * nonInstanceNodeId,
            structName: "VisualTrack",
            associationField: "LayerGroup",
            associatedStructName: "LayerGroup",
            children: new Array<GongNode>()
          }
          nonInstanceNodeId = nonInstanceNodeId + 1
          visualtrackGongNodeInstance.children!.push(LayerGroupGongNodeAssociation)

          /**
            * let append a node for the instance behind the asssociation LayerGroup
            */
          if (visualtrackDB.LayerGroup != undefined) {
            let visualtrackGongNodeInstance_LayerGroup: GongNode = {
              name: visualtrackDB.LayerGroup.Name,
              type: GongNodeType.INSTANCE,
              id: visualtrackDB.LayerGroup.ID,
              uniqueIdPerStack: // godel numbering (thank you kurt)
                3 * getVisualTrackUniqueID(visualtrackDB.ID)
                + 5 * getLayerGroupUniqueID(visualtrackDB.LayerGroup.ID),
              structName: "LayerGroup",
              associationField: "",
              associatedStructName: "",
              children: new Array<GongNode>()
            }
            LayerGroupGongNodeAssociation.children.push(visualtrackGongNodeInstance_LayerGroup)
          }

          /**
          * let append a node for the association DivIcon
          */
          let DivIconGongNodeAssociation: GongNode = {
            name: "(DivIcon) DivIcon",
            type: GongNodeType.ONE__ZERO_ONE_ASSOCIATION,
            id: visualtrackDB.ID,
            uniqueIdPerStack: 17 * nonInstanceNodeId,
            structName: "VisualTrack",
            associationField: "DivIcon",
            associatedStructName: "DivIcon",
            children: new Array<GongNode>()
          }
          nonInstanceNodeId = nonInstanceNodeId + 1
          visualtrackGongNodeInstance.children!.push(DivIconGongNodeAssociation)

          /**
            * let append a node for the instance behind the asssociation DivIcon
            */
          if (visualtrackDB.DivIcon != undefined) {
            let visualtrackGongNodeInstance_DivIcon: GongNode = {
              name: visualtrackDB.DivIcon.Name,
              type: GongNodeType.INSTANCE,
              id: visualtrackDB.DivIcon.ID,
              uniqueIdPerStack: // godel numbering (thank you kurt)
                3 * getVisualTrackUniqueID(visualtrackDB.ID)
                + 5 * getDivIconUniqueID(visualtrackDB.DivIcon.ID),
              structName: "DivIcon",
              associationField: "",
              associatedStructName: "",
              children: new Array<GongNode>()
            }
            DivIconGongNodeAssociation.children.push(visualtrackGongNodeInstance_DivIcon)
          }

        }
      )


      this.dataSource.data = this.gongNodeTree

      // expand nodes that were exapanded before
      this.treeControl.dataNodes?.forEach(
        node => {
          if (memoryOfExpandedNodes.get(node.uniqueIdPerStack)) {
            this.treeControl.expand(node)
          }
        }
      )
    });

    // fetch the number of commits
    this.commitNbService.getCommitNb().subscribe(
      commitNb => {
        this.commitNb = commitNb
      }
    )
  }

  /**
   * 
   * @param path for the outlet selection
   */
  setTableRouterOutlet(path: string) {
    this.router.navigate([{
      outlets: {
        github_com_fullstack_lang_gongleaflet_go_table: ["github_com_fullstack_lang_gongleaflet_go-" + path]
      }
    }]);
  }

  /**
   * 
   * @param path for the outlet selection
   */
  setTableRouterOutletFromTree(path: string, type: GongNodeType, structName: string, id: number) {

    if (type == GongNodeType.STRUCT) {
      this.router.navigate([{
        outlets: {
          github_com_fullstack_lang_gongleaflet_go_table: ["github_com_fullstack_lang_gongleaflet_go-" + path.toLowerCase()]
        }
      }]);
    }

    if (type == GongNodeType.INSTANCE) {
      this.router.navigate([{
        outlets: {
          github_com_fullstack_lang_gongleaflet_go_presentation: ["github_com_fullstack_lang_gongleaflet_go-" + structName.toLowerCase() + "-presentation", id]
        }
      }]);
    }
  }

  setEditorRouterOutlet(path: string) {
    this.router.navigate([{
      outlets: {
        github_com_fullstack_lang_gongleaflet_go_editor: ["github_com_fullstack_lang_gongleaflet_go-" + path.toLowerCase()]
      }
    }]);
  }

  setEditorSpecialRouterOutlet(node: GongFlatNode) {
    this.router.navigate([{
      outlets: {
        github_com_fullstack_lang_gongleaflet_go_editor: ["github_com_fullstack_lang_gongleaflet_go-" + node.associatedStructName.toLowerCase() + "-adder", node.id, node.structName, node.associationField]
      }
    }]);
  }
}
