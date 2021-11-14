import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// insertion point for imports
import { CheckoutSchedulersTableComponent } from './checkoutschedulers-table/checkoutschedulers-table.component'
import { CheckoutSchedulerDetailComponent } from './checkoutscheduler-detail/checkoutscheduler-detail.component'
import { CheckoutSchedulerPresentationComponent } from './checkoutscheduler-presentation/checkoutscheduler-presentation.component'

import { CirclesTableComponent } from './circles-table/circles-table.component'
import { CircleDetailComponent } from './circle-detail/circle-detail.component'
import { CirclePresentationComponent } from './circle-presentation/circle-presentation.component'

import { DivIconsTableComponent } from './divicons-table/divicons-table.component'
import { DivIconDetailComponent } from './divicon-detail/divicon-detail.component'
import { DivIconPresentationComponent } from './divicon-presentation/divicon-presentation.component'

import { LayerGroupsTableComponent } from './layergroups-table/layergroups-table.component'
import { LayerGroupDetailComponent } from './layergroup-detail/layergroup-detail.component'
import { LayerGroupPresentationComponent } from './layergroup-presentation/layergroup-presentation.component'

import { LayerGroupUsesTableComponent } from './layergroupuses-table/layergroupuses-table.component'
import { LayerGroupUseDetailComponent } from './layergroupuse-detail/layergroupuse-detail.component'
import { LayerGroupUsePresentationComponent } from './layergroupuse-presentation/layergroupuse-presentation.component'

import { MapOptionssTableComponent } from './mapoptionss-table/mapoptionss-table.component'
import { MapOptionsDetailComponent } from './mapoptions-detail/mapoptions-detail.component'
import { MapOptionsPresentationComponent } from './mapoptions-presentation/mapoptions-presentation.component'

import { MarkersTableComponent } from './markers-table/markers-table.component'
import { MarkerDetailComponent } from './marker-detail/marker-detail.component'
import { MarkerPresentationComponent } from './marker-presentation/marker-presentation.component'

import { VLinesTableComponent } from './vlines-table/vlines-table.component'
import { VLineDetailComponent } from './vline-detail/vline-detail.component'
import { VLinePresentationComponent } from './vline-presentation/vline-presentation.component'

import { VisualTracksTableComponent } from './visualtracks-table/visualtracks-table.component'
import { VisualTrackDetailComponent } from './visualtrack-detail/visualtrack-detail.component'
import { VisualTrackPresentationComponent } from './visualtrack-presentation/visualtrack-presentation.component'


const routes: Routes = [ // insertion point for routes declarations
	{ path: 'github_com_fullstack_lang_gongleaflet_go-checkoutschedulers', component: CheckoutSchedulersTableComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_table' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-checkoutscheduler-adder', component: CheckoutSchedulerDetailComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_editor' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-checkoutscheduler-adder/:id/:originStruct/:originStructFieldName', component: CheckoutSchedulerDetailComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_editor' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-checkoutscheduler-detail/:id', component: CheckoutSchedulerDetailComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_editor' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-checkoutscheduler-presentation/:id', component: CheckoutSchedulerPresentationComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_presentation' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-checkoutscheduler-presentation-special/:id', component: CheckoutSchedulerPresentationComponent, outlet: 'github_com_fullstack_lang_gongleaflet_gocheckoutschedulerpres' },

	{ path: 'github_com_fullstack_lang_gongleaflet_go-circles', component: CirclesTableComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_table' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-circle-adder', component: CircleDetailComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_editor' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-circle-adder/:id/:originStruct/:originStructFieldName', component: CircleDetailComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_editor' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-circle-detail/:id', component: CircleDetailComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_editor' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-circle-presentation/:id', component: CirclePresentationComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_presentation' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-circle-presentation-special/:id', component: CirclePresentationComponent, outlet: 'github_com_fullstack_lang_gongleaflet_gocirclepres' },

	{ path: 'github_com_fullstack_lang_gongleaflet_go-divicons', component: DivIconsTableComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_table' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-divicon-adder', component: DivIconDetailComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_editor' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-divicon-adder/:id/:originStruct/:originStructFieldName', component: DivIconDetailComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_editor' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-divicon-detail/:id', component: DivIconDetailComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_editor' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-divicon-presentation/:id', component: DivIconPresentationComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_presentation' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-divicon-presentation-special/:id', component: DivIconPresentationComponent, outlet: 'github_com_fullstack_lang_gongleaflet_godiviconpres' },

	{ path: 'github_com_fullstack_lang_gongleaflet_go-layergroups', component: LayerGroupsTableComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_table' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-layergroup-adder', component: LayerGroupDetailComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_editor' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-layergroup-adder/:id/:originStruct/:originStructFieldName', component: LayerGroupDetailComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_editor' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-layergroup-detail/:id', component: LayerGroupDetailComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_editor' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-layergroup-presentation/:id', component: LayerGroupPresentationComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_presentation' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-layergroup-presentation-special/:id', component: LayerGroupPresentationComponent, outlet: 'github_com_fullstack_lang_gongleaflet_golayergrouppres' },

	{ path: 'github_com_fullstack_lang_gongleaflet_go-layergroupuses', component: LayerGroupUsesTableComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_table' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-layergroupuse-adder', component: LayerGroupUseDetailComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_editor' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-layergroupuse-adder/:id/:originStruct/:originStructFieldName', component: LayerGroupUseDetailComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_editor' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-layergroupuse-detail/:id', component: LayerGroupUseDetailComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_editor' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-layergroupuse-presentation/:id', component: LayerGroupUsePresentationComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_presentation' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-layergroupuse-presentation-special/:id', component: LayerGroupUsePresentationComponent, outlet: 'github_com_fullstack_lang_gongleaflet_golayergroupusepres' },

	{ path: 'github_com_fullstack_lang_gongleaflet_go-mapoptionss', component: MapOptionssTableComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_table' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-mapoptions-adder', component: MapOptionsDetailComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_editor' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-mapoptions-adder/:id/:originStruct/:originStructFieldName', component: MapOptionsDetailComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_editor' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-mapoptions-detail/:id', component: MapOptionsDetailComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_editor' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-mapoptions-presentation/:id', component: MapOptionsPresentationComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_presentation' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-mapoptions-presentation-special/:id', component: MapOptionsPresentationComponent, outlet: 'github_com_fullstack_lang_gongleaflet_gomapoptionspres' },

	{ path: 'github_com_fullstack_lang_gongleaflet_go-markers', component: MarkersTableComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_table' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-marker-adder', component: MarkerDetailComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_editor' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-marker-adder/:id/:originStruct/:originStructFieldName', component: MarkerDetailComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_editor' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-marker-detail/:id', component: MarkerDetailComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_editor' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-marker-presentation/:id', component: MarkerPresentationComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_presentation' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-marker-presentation-special/:id', component: MarkerPresentationComponent, outlet: 'github_com_fullstack_lang_gongleaflet_gomarkerpres' },

	{ path: 'github_com_fullstack_lang_gongleaflet_go-vlines', component: VLinesTableComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_table' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-vline-adder', component: VLineDetailComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_editor' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-vline-adder/:id/:originStruct/:originStructFieldName', component: VLineDetailComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_editor' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-vline-detail/:id', component: VLineDetailComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_editor' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-vline-presentation/:id', component: VLinePresentationComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_presentation' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-vline-presentation-special/:id', component: VLinePresentationComponent, outlet: 'github_com_fullstack_lang_gongleaflet_govlinepres' },

	{ path: 'github_com_fullstack_lang_gongleaflet_go-visualtracks', component: VisualTracksTableComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_table' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-visualtrack-adder', component: VisualTrackDetailComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_editor' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-visualtrack-adder/:id/:originStruct/:originStructFieldName', component: VisualTrackDetailComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_editor' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-visualtrack-detail/:id', component: VisualTrackDetailComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_editor' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-visualtrack-presentation/:id', component: VisualTrackPresentationComponent, outlet: 'github_com_fullstack_lang_gongleaflet_go_presentation' },
	{ path: 'github_com_fullstack_lang_gongleaflet_go-visualtrack-presentation-special/:id', component: VisualTrackPresentationComponent, outlet: 'github_com_fullstack_lang_gongleaflet_govisualtrackpres' },

];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
