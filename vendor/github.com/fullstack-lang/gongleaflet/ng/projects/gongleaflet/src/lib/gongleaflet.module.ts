import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// for angular material
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatTableModule } from '@angular/material/table'
import { MatSortModule } from '@angular/material/sort'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatListModule } from '@angular/material/list'
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTreeModule } from '@angular/material/tree';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AngularSplitModule, SplitComponent } from 'angular-split';

import {
	NgxMatDatetimePickerModule,
	NgxMatNativeDateModule,
	NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';

import { AppRoutingModule } from './app-routing.module';

import { SplitterComponent } from './splitter/splitter.component'
import { SidebarComponent } from './sidebar/sidebar.component';

// insertion point for imports 
import { CheckoutSchedulersTableComponent } from './checkoutschedulers-table/checkoutschedulers-table.component'
import { CheckoutSchedulerSortingComponent } from './checkoutscheduler-sorting/checkoutscheduler-sorting.component'
import { CheckoutSchedulerDetailComponent } from './checkoutscheduler-detail/checkoutscheduler-detail.component'
import { CheckoutSchedulerPresentationComponent } from './checkoutscheduler-presentation/checkoutscheduler-presentation.component'

import { CirclesTableComponent } from './circles-table/circles-table.component'
import { CircleSortingComponent } from './circle-sorting/circle-sorting.component'
import { CircleDetailComponent } from './circle-detail/circle-detail.component'
import { CirclePresentationComponent } from './circle-presentation/circle-presentation.component'

import { DivIconsTableComponent } from './divicons-table/divicons-table.component'
import { DivIconSortingComponent } from './divicon-sorting/divicon-sorting.component'
import { DivIconDetailComponent } from './divicon-detail/divicon-detail.component'
import { DivIconPresentationComponent } from './divicon-presentation/divicon-presentation.component'

import { LayerGroupsTableComponent } from './layergroups-table/layergroups-table.component'
import { LayerGroupSortingComponent } from './layergroup-sorting/layergroup-sorting.component'
import { LayerGroupDetailComponent } from './layergroup-detail/layergroup-detail.component'
import { LayerGroupPresentationComponent } from './layergroup-presentation/layergroup-presentation.component'

import { LayerGroupUsesTableComponent } from './layergroupuses-table/layergroupuses-table.component'
import { LayerGroupUseSortingComponent } from './layergroupuse-sorting/layergroupuse-sorting.component'
import { LayerGroupUseDetailComponent } from './layergroupuse-detail/layergroupuse-detail.component'
import { LayerGroupUsePresentationComponent } from './layergroupuse-presentation/layergroupuse-presentation.component'

import { MapOptionssTableComponent } from './mapoptionss-table/mapoptionss-table.component'
import { MapOptionsSortingComponent } from './mapoptions-sorting/mapoptions-sorting.component'
import { MapOptionsDetailComponent } from './mapoptions-detail/mapoptions-detail.component'
import { MapOptionsPresentationComponent } from './mapoptions-presentation/mapoptions-presentation.component'

import { MarkersTableComponent } from './markers-table/markers-table.component'
import { MarkerSortingComponent } from './marker-sorting/marker-sorting.component'
import { MarkerDetailComponent } from './marker-detail/marker-detail.component'
import { MarkerPresentationComponent } from './marker-presentation/marker-presentation.component'

import { VLinesTableComponent } from './vlines-table/vlines-table.component'
import { VLineSortingComponent } from './vline-sorting/vline-sorting.component'
import { VLineDetailComponent } from './vline-detail/vline-detail.component'
import { VLinePresentationComponent } from './vline-presentation/vline-presentation.component'

import { VisualTracksTableComponent } from './visualtracks-table/visualtracks-table.component'
import { VisualTrackSortingComponent } from './visualtrack-sorting/visualtrack-sorting.component'
import { VisualTrackDetailComponent } from './visualtrack-detail/visualtrack-detail.component'
import { VisualTrackPresentationComponent } from './visualtrack-presentation/visualtrack-presentation.component'


@NgModule({
	declarations: [
		// insertion point for declarations 
		CheckoutSchedulersTableComponent,
		CheckoutSchedulerSortingComponent,
		CheckoutSchedulerDetailComponent,
		CheckoutSchedulerPresentationComponent,

		CirclesTableComponent,
		CircleSortingComponent,
		CircleDetailComponent,
		CirclePresentationComponent,

		DivIconsTableComponent,
		DivIconSortingComponent,
		DivIconDetailComponent,
		DivIconPresentationComponent,

		LayerGroupsTableComponent,
		LayerGroupSortingComponent,
		LayerGroupDetailComponent,
		LayerGroupPresentationComponent,

		LayerGroupUsesTableComponent,
		LayerGroupUseSortingComponent,
		LayerGroupUseDetailComponent,
		LayerGroupUsePresentationComponent,

		MapOptionssTableComponent,
		MapOptionsSortingComponent,
		MapOptionsDetailComponent,
		MapOptionsPresentationComponent,

		MarkersTableComponent,
		MarkerSortingComponent,
		MarkerDetailComponent,
		MarkerPresentationComponent,

		VLinesTableComponent,
		VLineSortingComponent,
		VLineDetailComponent,
		VLinePresentationComponent,

		VisualTracksTableComponent,
		VisualTrackSortingComponent,
		VisualTrackDetailComponent,
		VisualTrackPresentationComponent,


		SplitterComponent,
		SidebarComponent
	],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		RouterModule,

		AppRoutingModule,

		MatSliderModule,
		MatSelectModule,
		MatFormFieldModule,
		MatInputModule,
		MatDatepickerModule,
		MatTableModule,
		MatSortModule,
		MatPaginatorModule,
		MatCheckboxModule,
		MatButtonModule,
		MatIconModule,
		MatToolbarModule,
		MatExpansionModule,
		MatListModule,
		MatDialogModule,
		MatGridListModule,
		MatTreeModule,
		DragDropModule,

		NgxMatDatetimePickerModule,
		NgxMatNativeDateModule,
		NgxMatTimepickerModule,

		AngularSplitModule,
	],
	exports: [
		// insertion point for declarations 
		CheckoutSchedulersTableComponent,
		CheckoutSchedulerSortingComponent,
		CheckoutSchedulerDetailComponent,
		CheckoutSchedulerPresentationComponent,

		CirclesTableComponent,
		CircleSortingComponent,
		CircleDetailComponent,
		CirclePresentationComponent,

		DivIconsTableComponent,
		DivIconSortingComponent,
		DivIconDetailComponent,
		DivIconPresentationComponent,

		LayerGroupsTableComponent,
		LayerGroupSortingComponent,
		LayerGroupDetailComponent,
		LayerGroupPresentationComponent,

		LayerGroupUsesTableComponent,
		LayerGroupUseSortingComponent,
		LayerGroupUseDetailComponent,
		LayerGroupUsePresentationComponent,

		MapOptionssTableComponent,
		MapOptionsSortingComponent,
		MapOptionsDetailComponent,
		MapOptionsPresentationComponent,

		MarkersTableComponent,
		MarkerSortingComponent,
		MarkerDetailComponent,
		MarkerPresentationComponent,

		VLinesTableComponent,
		VLineSortingComponent,
		VLineDetailComponent,
		VLinePresentationComponent,

		VisualTracksTableComponent,
		VisualTrackSortingComponent,
		VisualTrackDetailComponent,
		VisualTrackPresentationComponent,


		SplitterComponent,
		SidebarComponent,

	],
	providers: [
		{
			provide: MatDialogRef,
			useValue: {}
		},
	],
})
export class GongleafletModule { }
