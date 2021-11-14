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
import { XLCellsTableComponent } from './xlcells-table/xlcells-table.component'
import { XLCellSortingComponent } from './xlcell-sorting/xlcell-sorting.component'
import { XLCellDetailComponent } from './xlcell-detail/xlcell-detail.component'
import { XLCellPresentationComponent } from './xlcell-presentation/xlcell-presentation.component'

import { XLFilesTableComponent } from './xlfiles-table/xlfiles-table.component'
import { XLFileSortingComponent } from './xlfile-sorting/xlfile-sorting.component'
import { XLFileDetailComponent } from './xlfile-detail/xlfile-detail.component'
import { XLFilePresentationComponent } from './xlfile-presentation/xlfile-presentation.component'

import { XLRowsTableComponent } from './xlrows-table/xlrows-table.component'
import { XLRowSortingComponent } from './xlrow-sorting/xlrow-sorting.component'
import { XLRowDetailComponent } from './xlrow-detail/xlrow-detail.component'
import { XLRowPresentationComponent } from './xlrow-presentation/xlrow-presentation.component'

import { XLSheetsTableComponent } from './xlsheets-table/xlsheets-table.component'
import { XLSheetSortingComponent } from './xlsheet-sorting/xlsheet-sorting.component'
import { XLSheetDetailComponent } from './xlsheet-detail/xlsheet-detail.component'
import { XLSheetPresentationComponent } from './xlsheet-presentation/xlsheet-presentation.component'


@NgModule({
	declarations: [
		// insertion point for declarations 
		XLCellsTableComponent,
		XLCellSortingComponent,
		XLCellDetailComponent,
		XLCellPresentationComponent,

		XLFilesTableComponent,
		XLFileSortingComponent,
		XLFileDetailComponent,
		XLFilePresentationComponent,

		XLRowsTableComponent,
		XLRowSortingComponent,
		XLRowDetailComponent,
		XLRowPresentationComponent,

		XLSheetsTableComponent,
		XLSheetSortingComponent,
		XLSheetDetailComponent,
		XLSheetPresentationComponent,


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
		XLCellsTableComponent,
		XLCellSortingComponent,
		XLCellDetailComponent,
		XLCellPresentationComponent,

		XLFilesTableComponent,
		XLFileSortingComponent,
		XLFileDetailComponent,
		XLFilePresentationComponent,

		XLRowsTableComponent,
		XLRowSortingComponent,
		XLRowDetailComponent,
		XLRowPresentationComponent,

		XLSheetsTableComponent,
		XLSheetSortingComponent,
		XLSheetDetailComponent,
		XLSheetPresentationComponent,


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
export class GongxlsxModule { }
