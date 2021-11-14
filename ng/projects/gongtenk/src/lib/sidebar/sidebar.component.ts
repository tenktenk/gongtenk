import { Component, OnInit } from '@angular/core';
import { Router, RouterState } from '@angular/router';

import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

import { FrontRepoService, FrontRepo } from '../front-repo.service'
import { CommitNbService } from '../commitnb.service'

// insertion point for per struct import code
import { CityService } from '../city.service'
import { getCityUniqueID } from '../front-repo.service'
import { ConfigurationService } from '../configuration.service'
import { getConfigurationUniqueID } from '../front-repo.service'
import { CountryService } from '../country.service'
import { getCountryUniqueID } from '../front-repo.service'
import { IndividualService } from '../individual.service'
import { getIndividualUniqueID } from '../front-repo.service'

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
  selector: 'app-gongtenk-sidebar',
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
    private cityService: CityService,
    private configurationService: ConfigurationService,
    private countryService: CountryService,
    private individualService: IndividualService,
  ) { }

  ngOnInit(): void {
    this.refresh()

    // insertion point for per struct observable for refresh trigger
    // observable for changes in structs
    this.cityService.CityServiceChanged.subscribe(
      message => {
        if (message == "post" || message == "update" || message == "delete") {
          this.refresh()
        }
      }
    )
    // observable for changes in structs
    this.configurationService.ConfigurationServiceChanged.subscribe(
      message => {
        if (message == "post" || message == "update" || message == "delete") {
          this.refresh()
        }
      }
    )
    // observable for changes in structs
    this.countryService.CountryServiceChanged.subscribe(
      message => {
        if (message == "post" || message == "update" || message == "delete") {
          this.refresh()
        }
      }
    )
    // observable for changes in structs
    this.individualService.IndividualServiceChanged.subscribe(
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
      * fill up the City part of the mat tree
      */
      let cityGongNodeStruct: GongNode = {
        name: "City",
        type: GongNodeType.STRUCT,
        id: 0,
        uniqueIdPerStack: 13 * nonInstanceNodeId,
        structName: "City",
        associationField: "",
        associatedStructName: "",
        children: new Array<GongNode>()
      }
      nonInstanceNodeId = nonInstanceNodeId + 1
      this.gongNodeTree.push(cityGongNodeStruct)

      this.frontRepo.Citys_array.sort((t1, t2) => {
        if (t1.Name > t2.Name) {
          return 1;
        }
        if (t1.Name < t2.Name) {
          return -1;
        }
        return 0;
      });

      this.frontRepo.Citys_array.forEach(
        cityDB => {
          let cityGongNodeInstance: GongNode = {
            name: cityDB.Name,
            type: GongNodeType.INSTANCE,
            id: cityDB.ID,
            uniqueIdPerStack: getCityUniqueID(cityDB.ID),
            structName: "City",
            associationField: "",
            associatedStructName: "",
            children: new Array<GongNode>()
          }
          cityGongNodeStruct.children!.push(cityGongNodeInstance)

          // insertion point for per field code
          /**
          * let append a node for the association Country
          */
          let CountryGongNodeAssociation: GongNode = {
            name: "(Country) Country",
            type: GongNodeType.ONE__ZERO_ONE_ASSOCIATION,
            id: cityDB.ID,
            uniqueIdPerStack: 17 * nonInstanceNodeId,
            structName: "City",
            associationField: "Country",
            associatedStructName: "Country",
            children: new Array<GongNode>()
          }
          nonInstanceNodeId = nonInstanceNodeId + 1
          cityGongNodeInstance.children!.push(CountryGongNodeAssociation)

          /**
            * let append a node for the instance behind the asssociation Country
            */
          if (cityDB.Country != undefined) {
            let cityGongNodeInstance_Country: GongNode = {
              name: cityDB.Country.Name,
              type: GongNodeType.INSTANCE,
              id: cityDB.Country.ID,
              uniqueIdPerStack: // godel numbering (thank you kurt)
                3 * getCityUniqueID(cityDB.ID)
                + 5 * getCountryUniqueID(cityDB.Country.ID),
              structName: "Country",
              associationField: "",
              associatedStructName: "",
              children: new Array<GongNode>()
            }
            CountryGongNodeAssociation.children.push(cityGongNodeInstance_Country)
          }

        }
      )

      /**
      * fill up the Configuration part of the mat tree
      */
      let configurationGongNodeStruct: GongNode = {
        name: "Configuration",
        type: GongNodeType.STRUCT,
        id: 0,
        uniqueIdPerStack: 13 * nonInstanceNodeId,
        structName: "Configuration",
        associationField: "",
        associatedStructName: "",
        children: new Array<GongNode>()
      }
      nonInstanceNodeId = nonInstanceNodeId + 1
      this.gongNodeTree.push(configurationGongNodeStruct)

      this.frontRepo.Configurations_array.sort((t1, t2) => {
        if (t1.Name > t2.Name) {
          return 1;
        }
        if (t1.Name < t2.Name) {
          return -1;
        }
        return 0;
      });

      this.frontRepo.Configurations_array.forEach(
        configurationDB => {
          let configurationGongNodeInstance: GongNode = {
            name: configurationDB.Name,
            type: GongNodeType.INSTANCE,
            id: configurationDB.ID,
            uniqueIdPerStack: getConfigurationUniqueID(configurationDB.ID),
            structName: "Configuration",
            associationField: "",
            associatedStructName: "",
            children: new Array<GongNode>()
          }
          configurationGongNodeStruct.children!.push(configurationGongNodeInstance)

          // insertion point for per field code
        }
      )

      /**
      * fill up the Country part of the mat tree
      */
      let countryGongNodeStruct: GongNode = {
        name: "Country",
        type: GongNodeType.STRUCT,
        id: 0,
        uniqueIdPerStack: 13 * nonInstanceNodeId,
        structName: "Country",
        associationField: "",
        associatedStructName: "",
        children: new Array<GongNode>()
      }
      nonInstanceNodeId = nonInstanceNodeId + 1
      this.gongNodeTree.push(countryGongNodeStruct)

      this.frontRepo.Countrys_array.sort((t1, t2) => {
        if (t1.Name > t2.Name) {
          return 1;
        }
        if (t1.Name < t2.Name) {
          return -1;
        }
        return 0;
      });

      this.frontRepo.Countrys_array.forEach(
        countryDB => {
          let countryGongNodeInstance: GongNode = {
            name: countryDB.Name,
            type: GongNodeType.INSTANCE,
            id: countryDB.ID,
            uniqueIdPerStack: getCountryUniqueID(countryDB.ID),
            structName: "Country",
            associationField: "",
            associatedStructName: "",
            children: new Array<GongNode>()
          }
          countryGongNodeStruct.children!.push(countryGongNodeInstance)

          // insertion point for per field code
        }
      )

      /**
      * fill up the Individual part of the mat tree
      */
      let individualGongNodeStruct: GongNode = {
        name: "Individual",
        type: GongNodeType.STRUCT,
        id: 0,
        uniqueIdPerStack: 13 * nonInstanceNodeId,
        structName: "Individual",
        associationField: "",
        associatedStructName: "",
        children: new Array<GongNode>()
      }
      nonInstanceNodeId = nonInstanceNodeId + 1
      this.gongNodeTree.push(individualGongNodeStruct)

      this.frontRepo.Individuals_array.sort((t1, t2) => {
        if (t1.Name > t2.Name) {
          return 1;
        }
        if (t1.Name < t2.Name) {
          return -1;
        }
        return 0;
      });

      this.frontRepo.Individuals_array.forEach(
        individualDB => {
          let individualGongNodeInstance: GongNode = {
            name: individualDB.Name,
            type: GongNodeType.INSTANCE,
            id: individualDB.ID,
            uniqueIdPerStack: getIndividualUniqueID(individualDB.ID),
            structName: "Individual",
            associationField: "",
            associatedStructName: "",
            children: new Array<GongNode>()
          }
          individualGongNodeStruct.children!.push(individualGongNodeInstance)

          // insertion point for per field code
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
        github_com_thomaspeugeot_gongtenk_go_table: ["github_com_thomaspeugeot_gongtenk_go-" + path]
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
          github_com_thomaspeugeot_gongtenk_go_table: ["github_com_thomaspeugeot_gongtenk_go-" + path.toLowerCase()]
        }
      }]);
    }

    if (type == GongNodeType.INSTANCE) {
      this.router.navigate([{
        outlets: {
          github_com_thomaspeugeot_gongtenk_go_presentation: ["github_com_thomaspeugeot_gongtenk_go-" + structName.toLowerCase() + "-presentation", id]
        }
      }]);
    }
  }

  setEditorRouterOutlet(path: string) {
    this.router.navigate([{
      outlets: {
        github_com_thomaspeugeot_gongtenk_go_editor: ["github_com_thomaspeugeot_gongtenk_go-" + path.toLowerCase()]
      }
    }]);
  }

  setEditorSpecialRouterOutlet(node: GongFlatNode) {
    this.router.navigate([{
      outlets: {
        github_com_thomaspeugeot_gongtenk_go_editor: ["github_com_thomaspeugeot_gongtenk_go-" + node.associatedStructName.toLowerCase() + "-adder", node.id, node.structName, node.associationField]
      }
    }]);
  }
}
