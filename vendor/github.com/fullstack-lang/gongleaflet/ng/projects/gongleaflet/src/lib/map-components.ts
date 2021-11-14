// insertion point sub template for components imports 
  import { CheckoutSchedulersTableComponent } from './checkoutschedulers-table/checkoutschedulers-table.component'
  import { CheckoutSchedulerSortingComponent } from './checkoutscheduler-sorting/checkoutscheduler-sorting.component'
  import { CirclesTableComponent } from './circles-table/circles-table.component'
  import { CircleSortingComponent } from './circle-sorting/circle-sorting.component'
  import { DivIconsTableComponent } from './divicons-table/divicons-table.component'
  import { DivIconSortingComponent } from './divicon-sorting/divicon-sorting.component'
  import { LayerGroupsTableComponent } from './layergroups-table/layergroups-table.component'
  import { LayerGroupSortingComponent } from './layergroup-sorting/layergroup-sorting.component'
  import { LayerGroupUsesTableComponent } from './layergroupuses-table/layergroupuses-table.component'
  import { LayerGroupUseSortingComponent } from './layergroupuse-sorting/layergroupuse-sorting.component'
  import { MapOptionssTableComponent } from './mapoptionss-table/mapoptionss-table.component'
  import { MapOptionsSortingComponent } from './mapoptions-sorting/mapoptions-sorting.component'
  import { MarkersTableComponent } from './markers-table/markers-table.component'
  import { MarkerSortingComponent } from './marker-sorting/marker-sorting.component'
  import { VLinesTableComponent } from './vlines-table/vlines-table.component'
  import { VLineSortingComponent } from './vline-sorting/vline-sorting.component'
  import { VisualTracksTableComponent } from './visualtracks-table/visualtracks-table.component'
  import { VisualTrackSortingComponent } from './visualtrack-sorting/visualtrack-sorting.component'

// insertion point sub template for map of components per struct 
  export const MapOfCheckoutSchedulersComponents: Map<string, any> = new Map([["CheckoutSchedulersTableComponent", CheckoutSchedulersTableComponent],])
  export const MapOfCheckoutSchedulerSortingComponents: Map<string, any> = new Map([["CheckoutSchedulerSortingComponent", CheckoutSchedulerSortingComponent],])
  export const MapOfCirclesComponents: Map<string, any> = new Map([["CirclesTableComponent", CirclesTableComponent],])
  export const MapOfCircleSortingComponents: Map<string, any> = new Map([["CircleSortingComponent", CircleSortingComponent],])
  export const MapOfDivIconsComponents: Map<string, any> = new Map([["DivIconsTableComponent", DivIconsTableComponent],])
  export const MapOfDivIconSortingComponents: Map<string, any> = new Map([["DivIconSortingComponent", DivIconSortingComponent],])
  export const MapOfLayerGroupsComponents: Map<string, any> = new Map([["LayerGroupsTableComponent", LayerGroupsTableComponent],])
  export const MapOfLayerGroupSortingComponents: Map<string, any> = new Map([["LayerGroupSortingComponent", LayerGroupSortingComponent],])
  export const MapOfLayerGroupUsesComponents: Map<string, any> = new Map([["LayerGroupUsesTableComponent", LayerGroupUsesTableComponent],])
  export const MapOfLayerGroupUseSortingComponents: Map<string, any> = new Map([["LayerGroupUseSortingComponent", LayerGroupUseSortingComponent],])
  export const MapOfMapOptionssComponents: Map<string, any> = new Map([["MapOptionssTableComponent", MapOptionssTableComponent],])
  export const MapOfMapOptionsSortingComponents: Map<string, any> = new Map([["MapOptionsSortingComponent", MapOptionsSortingComponent],])
  export const MapOfMarkersComponents: Map<string, any> = new Map([["MarkersTableComponent", MarkersTableComponent],])
  export const MapOfMarkerSortingComponents: Map<string, any> = new Map([["MarkerSortingComponent", MarkerSortingComponent],])
  export const MapOfVLinesComponents: Map<string, any> = new Map([["VLinesTableComponent", VLinesTableComponent],])
  export const MapOfVLineSortingComponents: Map<string, any> = new Map([["VLineSortingComponent", VLineSortingComponent],])
  export const MapOfVisualTracksComponents: Map<string, any> = new Map([["VisualTracksTableComponent", VisualTracksTableComponent],])
  export const MapOfVisualTrackSortingComponents: Map<string, any> = new Map([["VisualTrackSortingComponent", VisualTrackSortingComponent],])

// map of all ng components of the stacks
export const MapOfComponents: Map<string, any> =
  new Map(
    [
      // insertion point sub template for map of components 
      ["CheckoutScheduler", MapOfCheckoutSchedulersComponents],
      ["Circle", MapOfCirclesComponents],
      ["DivIcon", MapOfDivIconsComponents],
      ["LayerGroup", MapOfLayerGroupsComponents],
      ["LayerGroupUse", MapOfLayerGroupUsesComponents],
      ["MapOptions", MapOfMapOptionssComponents],
      ["Marker", MapOfMarkersComponents],
      ["VLine", MapOfVLinesComponents],
      ["VisualTrack", MapOfVisualTracksComponents],
    ]
  )

// map of all ng components of the stacks
export const MapOfSortingComponents: Map<string, any> =
  new Map(
    [
    // insertion point sub template for map of sorting components 
      ["CheckoutScheduler", MapOfCheckoutSchedulerSortingComponents],
      ["Circle", MapOfCircleSortingComponents],
      ["DivIcon", MapOfDivIconSortingComponents],
      ["LayerGroup", MapOfLayerGroupSortingComponents],
      ["LayerGroupUse", MapOfLayerGroupUseSortingComponents],
      ["MapOptions", MapOfMapOptionsSortingComponents],
      ["Marker", MapOfMarkerSortingComponents],
      ["VLine", MapOfVLineSortingComponents],
      ["VisualTrack", MapOfVisualTrackSortingComponents],
    ]
  )
