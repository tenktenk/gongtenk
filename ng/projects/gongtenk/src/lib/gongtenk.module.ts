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
import { CitysTableComponent } from './citys-table/citys-table.component'
import { CitySortingComponent } from './city-sorting/city-sorting.component'
import { CityDetailComponent } from './city-detail/city-detail.component'
import { CityPresentationComponent } from './city-presentation/city-presentation.component'

import { ConfigurationsTableComponent } from './configurations-table/configurations-table.component'
import { ConfigurationSortingComponent } from './configuration-sorting/configuration-sorting.component'
import { ConfigurationDetailComponent } from './configuration-detail/configuration-detail.component'
import { ConfigurationPresentationComponent } from './configuration-presentation/configuration-presentation.component'

import { CountrysTableComponent } from './countrys-table/countrys-table.component'
import { CountrySortingComponent } from './country-sorting/country-sorting.component'
import { CountryDetailComponent } from './country-detail/country-detail.component'
import { CountryPresentationComponent } from './country-presentation/country-presentation.component'

import { IndividualsTableComponent } from './individuals-table/individuals-table.component'
import { IndividualSortingComponent } from './individual-sorting/individual-sorting.component'
import { IndividualDetailComponent } from './individual-detail/individual-detail.component'
import { IndividualPresentationComponent } from './individual-presentation/individual-presentation.component'


@NgModule({
	declarations: [
		// insertion point for declarations 
		CitysTableComponent,
		CitySortingComponent,
		CityDetailComponent,
		CityPresentationComponent,

		ConfigurationsTableComponent,
		ConfigurationSortingComponent,
		ConfigurationDetailComponent,
		ConfigurationPresentationComponent,

		CountrysTableComponent,
		CountrySortingComponent,
		CountryDetailComponent,
		CountryPresentationComponent,

		IndividualsTableComponent,
		IndividualSortingComponent,
		IndividualDetailComponent,
		IndividualPresentationComponent,


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
		CitysTableComponent,
		CitySortingComponent,
		CityDetailComponent,
		CityPresentationComponent,

		ConfigurationsTableComponent,
		ConfigurationSortingComponent,
		ConfigurationDetailComponent,
		ConfigurationPresentationComponent,

		CountrysTableComponent,
		CountrySortingComponent,
		CountryDetailComponent,
		CountryPresentationComponent,

		IndividualsTableComponent,
		IndividualSortingComponent,
		IndividualDetailComponent,
		IndividualPresentationComponent,


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
export class GongtenkModule { }
