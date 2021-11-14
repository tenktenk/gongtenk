import { Component, OnInit } from '@angular/core';
import { Router, RouterState } from '@angular/router';

import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

import { FrontRepoService, FrontRepo } from '../front-repo.service'
import { CommitNbService } from '../commitnb.service'

// insertion point for per struct import code
import { XLCellService } from '../xlcell.service'
import { getXLCellUniqueID } from '../front-repo.service'
import { XLFileService } from '../xlfile.service'
import { getXLFileUniqueID } from '../front-repo.service'
import { XLRowService } from '../xlrow.service'
import { getXLRowUniqueID } from '../front-repo.service'
import { XLSheetService } from '../xlsheet.service'
import { getXLSheetUniqueID } from '../front-repo.service'

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
  selector: 'app-gongxlsx-sidebar',
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
    private xlcellService: XLCellService,
    private xlfileService: XLFileService,
    private xlrowService: XLRowService,
    private xlsheetService: XLSheetService,
  ) { }

  ngOnInit(): void {
    this.refresh()

    // insertion point for per struct observable for refresh trigger
    // observable for changes in structs
    this.xlcellService.XLCellServiceChanged.subscribe(
      message => {
        if (message == "post" || message == "update" || message == "delete") {
          this.refresh()
        }
      }
    )
    // observable for changes in structs
    this.xlfileService.XLFileServiceChanged.subscribe(
      message => {
        if (message == "post" || message == "update" || message == "delete") {
          this.refresh()
        }
      }
    )
    // observable for changes in structs
    this.xlrowService.XLRowServiceChanged.subscribe(
      message => {
        if (message == "post" || message == "update" || message == "delete") {
          this.refresh()
        }
      }
    )
    // observable for changes in structs
    this.xlsheetService.XLSheetServiceChanged.subscribe(
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
      * fill up the XLCell part of the mat tree
      */
      let xlcellGongNodeStruct: GongNode = {
        name: "XLCell",
        type: GongNodeType.STRUCT,
        id: 0,
        uniqueIdPerStack: 13 * nonInstanceNodeId,
        structName: "XLCell",
        associationField: "",
        associatedStructName: "",
        children: new Array<GongNode>()
      }
      nonInstanceNodeId = nonInstanceNodeId + 1
      this.gongNodeTree.push(xlcellGongNodeStruct)

      this.frontRepo.XLCells_array.sort((t1, t2) => {
        if (t1.Name > t2.Name) {
          return 1;
        }
        if (t1.Name < t2.Name) {
          return -1;
        }
        return 0;
      });

      this.frontRepo.XLCells_array.forEach(
        xlcellDB => {
          let xlcellGongNodeInstance: GongNode = {
            name: xlcellDB.Name,
            type: GongNodeType.INSTANCE,
            id: xlcellDB.ID,
            uniqueIdPerStack: getXLCellUniqueID(xlcellDB.ID),
            structName: "XLCell",
            associationField: "",
            associatedStructName: "",
            children: new Array<GongNode>()
          }
          xlcellGongNodeStruct.children!.push(xlcellGongNodeInstance)

          // insertion point for per field code
        }
      )

      /**
      * fill up the XLFile part of the mat tree
      */
      let xlfileGongNodeStruct: GongNode = {
        name: "XLFile",
        type: GongNodeType.STRUCT,
        id: 0,
        uniqueIdPerStack: 13 * nonInstanceNodeId,
        structName: "XLFile",
        associationField: "",
        associatedStructName: "",
        children: new Array<GongNode>()
      }
      nonInstanceNodeId = nonInstanceNodeId + 1
      this.gongNodeTree.push(xlfileGongNodeStruct)

      this.frontRepo.XLFiles_array.sort((t1, t2) => {
        if (t1.Name > t2.Name) {
          return 1;
        }
        if (t1.Name < t2.Name) {
          return -1;
        }
        return 0;
      });

      this.frontRepo.XLFiles_array.forEach(
        xlfileDB => {
          let xlfileGongNodeInstance: GongNode = {
            name: xlfileDB.Name,
            type: GongNodeType.INSTANCE,
            id: xlfileDB.ID,
            uniqueIdPerStack: getXLFileUniqueID(xlfileDB.ID),
            structName: "XLFile",
            associationField: "",
            associatedStructName: "",
            children: new Array<GongNode>()
          }
          xlfileGongNodeStruct.children!.push(xlfileGongNodeInstance)

          // insertion point for per field code
          /**
          * let append a node for the slide of pointer Sheets
          */
          let SheetsGongNodeAssociation: GongNode = {
            name: "(XLSheet) Sheets",
            type: GongNodeType.ONE__ZERO_MANY_ASSOCIATION,
            id: xlfileDB.ID,
            uniqueIdPerStack: 19 * nonInstanceNodeId,
            structName: "XLFile",
            associationField: "Sheets",
            associatedStructName: "XLSheet",
            children: new Array<GongNode>()
          }
          nonInstanceNodeId = nonInstanceNodeId + 1
          xlfileGongNodeInstance.children.push(SheetsGongNodeAssociation)

          xlfileDB.Sheets?.forEach(xlsheetDB => {
            let xlsheetNode: GongNode = {
              name: xlsheetDB.Name,
              type: GongNodeType.INSTANCE,
              id: xlsheetDB.ID,
              uniqueIdPerStack: // godel numbering (thank you kurt)
                7 * getXLFileUniqueID(xlfileDB.ID)
                + 11 * getXLSheetUniqueID(xlsheetDB.ID),
              structName: "XLSheet",
              associationField: "",
              associatedStructName: "",
              children: new Array<GongNode>()
            }
            SheetsGongNodeAssociation.children.push(xlsheetNode)
          })

        }
      )

      /**
      * fill up the XLRow part of the mat tree
      */
      let xlrowGongNodeStruct: GongNode = {
        name: "XLRow",
        type: GongNodeType.STRUCT,
        id: 0,
        uniqueIdPerStack: 13 * nonInstanceNodeId,
        structName: "XLRow",
        associationField: "",
        associatedStructName: "",
        children: new Array<GongNode>()
      }
      nonInstanceNodeId = nonInstanceNodeId + 1
      this.gongNodeTree.push(xlrowGongNodeStruct)

      this.frontRepo.XLRows_array.sort((t1, t2) => {
        if (t1.Name > t2.Name) {
          return 1;
        }
        if (t1.Name < t2.Name) {
          return -1;
        }
        return 0;
      });

      this.frontRepo.XLRows_array.forEach(
        xlrowDB => {
          let xlrowGongNodeInstance: GongNode = {
            name: xlrowDB.Name,
            type: GongNodeType.INSTANCE,
            id: xlrowDB.ID,
            uniqueIdPerStack: getXLRowUniqueID(xlrowDB.ID),
            structName: "XLRow",
            associationField: "",
            associatedStructName: "",
            children: new Array<GongNode>()
          }
          xlrowGongNodeStruct.children!.push(xlrowGongNodeInstance)

          // insertion point for per field code
          /**
          * let append a node for the slide of pointer Cells
          */
          let CellsGongNodeAssociation: GongNode = {
            name: "(XLCell) Cells",
            type: GongNodeType.ONE__ZERO_MANY_ASSOCIATION,
            id: xlrowDB.ID,
            uniqueIdPerStack: 19 * nonInstanceNodeId,
            structName: "XLRow",
            associationField: "Cells",
            associatedStructName: "XLCell",
            children: new Array<GongNode>()
          }
          nonInstanceNodeId = nonInstanceNodeId + 1
          xlrowGongNodeInstance.children.push(CellsGongNodeAssociation)

          xlrowDB.Cells?.forEach(xlcellDB => {
            let xlcellNode: GongNode = {
              name: xlcellDB.Name,
              type: GongNodeType.INSTANCE,
              id: xlcellDB.ID,
              uniqueIdPerStack: // godel numbering (thank you kurt)
                7 * getXLRowUniqueID(xlrowDB.ID)
                + 11 * getXLCellUniqueID(xlcellDB.ID),
              structName: "XLCell",
              associationField: "",
              associatedStructName: "",
              children: new Array<GongNode>()
            }
            CellsGongNodeAssociation.children.push(xlcellNode)
          })

        }
      )

      /**
      * fill up the XLSheet part of the mat tree
      */
      let xlsheetGongNodeStruct: GongNode = {
        name: "XLSheet",
        type: GongNodeType.STRUCT,
        id: 0,
        uniqueIdPerStack: 13 * nonInstanceNodeId,
        structName: "XLSheet",
        associationField: "",
        associatedStructName: "",
        children: new Array<GongNode>()
      }
      nonInstanceNodeId = nonInstanceNodeId + 1
      this.gongNodeTree.push(xlsheetGongNodeStruct)

      this.frontRepo.XLSheets_array.sort((t1, t2) => {
        if (t1.Name > t2.Name) {
          return 1;
        }
        if (t1.Name < t2.Name) {
          return -1;
        }
        return 0;
      });

      this.frontRepo.XLSheets_array.forEach(
        xlsheetDB => {
          let xlsheetGongNodeInstance: GongNode = {
            name: xlsheetDB.Name,
            type: GongNodeType.INSTANCE,
            id: xlsheetDB.ID,
            uniqueIdPerStack: getXLSheetUniqueID(xlsheetDB.ID),
            structName: "XLSheet",
            associationField: "",
            associatedStructName: "",
            children: new Array<GongNode>()
          }
          xlsheetGongNodeStruct.children!.push(xlsheetGongNodeInstance)

          // insertion point for per field code
          /**
          * let append a node for the slide of pointer Rows
          */
          let RowsGongNodeAssociation: GongNode = {
            name: "(XLRow) Rows",
            type: GongNodeType.ONE__ZERO_MANY_ASSOCIATION,
            id: xlsheetDB.ID,
            uniqueIdPerStack: 19 * nonInstanceNodeId,
            structName: "XLSheet",
            associationField: "Rows",
            associatedStructName: "XLRow",
            children: new Array<GongNode>()
          }
          nonInstanceNodeId = nonInstanceNodeId + 1
          xlsheetGongNodeInstance.children.push(RowsGongNodeAssociation)

          xlsheetDB.Rows?.forEach(xlrowDB => {
            let xlrowNode: GongNode = {
              name: xlrowDB.Name,
              type: GongNodeType.INSTANCE,
              id: xlrowDB.ID,
              uniqueIdPerStack: // godel numbering (thank you kurt)
                7 * getXLSheetUniqueID(xlsheetDB.ID)
                + 11 * getXLRowUniqueID(xlrowDB.ID),
              structName: "XLRow",
              associationField: "",
              associatedStructName: "",
              children: new Array<GongNode>()
            }
            RowsGongNodeAssociation.children.push(xlrowNode)
          })

          /**
          * let append a node for the slide of pointer SheetCells
          */
          let SheetCellsGongNodeAssociation: GongNode = {
            name: "(XLCell) SheetCells",
            type: GongNodeType.ONE__ZERO_MANY_ASSOCIATION,
            id: xlsheetDB.ID,
            uniqueIdPerStack: 19 * nonInstanceNodeId,
            structName: "XLSheet",
            associationField: "SheetCells",
            associatedStructName: "XLCell",
            children: new Array<GongNode>()
          }
          nonInstanceNodeId = nonInstanceNodeId + 1
          xlsheetGongNodeInstance.children.push(SheetCellsGongNodeAssociation)

          xlsheetDB.SheetCells?.forEach(xlcellDB => {
            let xlcellNode: GongNode = {
              name: xlcellDB.Name,
              type: GongNodeType.INSTANCE,
              id: xlcellDB.ID,
              uniqueIdPerStack: // godel numbering (thank you kurt)
                7 * getXLSheetUniqueID(xlsheetDB.ID)
                + 11 * getXLCellUniqueID(xlcellDB.ID),
              structName: "XLCell",
              associationField: "",
              associatedStructName: "",
              children: new Array<GongNode>()
            }
            SheetCellsGongNodeAssociation.children.push(xlcellNode)
          })

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
        github_com_fullstack_lang_gongxlsx_go_table: ["github_com_fullstack_lang_gongxlsx_go-" + path]
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
          github_com_fullstack_lang_gongxlsx_go_table: ["github_com_fullstack_lang_gongxlsx_go-" + path.toLowerCase()]
        }
      }]);
    }

    if (type == GongNodeType.INSTANCE) {
      this.router.navigate([{
        outlets: {
          github_com_fullstack_lang_gongxlsx_go_presentation: ["github_com_fullstack_lang_gongxlsx_go-" + structName.toLowerCase() + "-presentation", id]
        }
      }]);
    }
  }

  setEditorRouterOutlet(path: string) {
    this.router.navigate([{
      outlets: {
        github_com_fullstack_lang_gongxlsx_go_editor: ["github_com_fullstack_lang_gongxlsx_go-" + path.toLowerCase()]
      }
    }]);
  }

  setEditorSpecialRouterOutlet(node: GongFlatNode) {
    this.router.navigate([{
      outlets: {
        github_com_fullstack_lang_gongxlsx_go_editor: ["github_com_fullstack_lang_gongxlsx_go-" + node.associatedStructName.toLowerCase() + "-adder", node.id, node.structName, node.associationField]
      }
    }]);
  }
}
