import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// insertion point for imports
import { CitysTableComponent } from './citys-table/citys-table.component'
import { CityDetailComponent } from './city-detail/city-detail.component'
import { CityPresentationComponent } from './city-presentation/city-presentation.component'

import { ConfigurationsTableComponent } from './configurations-table/configurations-table.component'
import { ConfigurationDetailComponent } from './configuration-detail/configuration-detail.component'
import { ConfigurationPresentationComponent } from './configuration-presentation/configuration-presentation.component'

import { CountrysTableComponent } from './countrys-table/countrys-table.component'
import { CountryDetailComponent } from './country-detail/country-detail.component'
import { CountryPresentationComponent } from './country-presentation/country-presentation.component'

import { IndividualsTableComponent } from './individuals-table/individuals-table.component'
import { IndividualDetailComponent } from './individual-detail/individual-detail.component'
import { IndividualPresentationComponent } from './individual-presentation/individual-presentation.component'


const routes: Routes = [ // insertion point for routes declarations
	{ path: 'github_com_thomaspeugeot_gongtenk_go-citys', component: CitysTableComponent, outlet: 'github_com_thomaspeugeot_gongtenk_go_table' },
	{ path: 'github_com_thomaspeugeot_gongtenk_go-city-adder', component: CityDetailComponent, outlet: 'github_com_thomaspeugeot_gongtenk_go_editor' },
	{ path: 'github_com_thomaspeugeot_gongtenk_go-city-adder/:id/:originStruct/:originStructFieldName', component: CityDetailComponent, outlet: 'github_com_thomaspeugeot_gongtenk_go_editor' },
	{ path: 'github_com_thomaspeugeot_gongtenk_go-city-detail/:id', component: CityDetailComponent, outlet: 'github_com_thomaspeugeot_gongtenk_go_editor' },
	{ path: 'github_com_thomaspeugeot_gongtenk_go-city-presentation/:id', component: CityPresentationComponent, outlet: 'github_com_thomaspeugeot_gongtenk_go_presentation' },
	{ path: 'github_com_thomaspeugeot_gongtenk_go-city-presentation-special/:id', component: CityPresentationComponent, outlet: 'github_com_thomaspeugeot_gongtenk_gocitypres' },

	{ path: 'github_com_thomaspeugeot_gongtenk_go-configurations', component: ConfigurationsTableComponent, outlet: 'github_com_thomaspeugeot_gongtenk_go_table' },
	{ path: 'github_com_thomaspeugeot_gongtenk_go-configuration-adder', component: ConfigurationDetailComponent, outlet: 'github_com_thomaspeugeot_gongtenk_go_editor' },
	{ path: 'github_com_thomaspeugeot_gongtenk_go-configuration-adder/:id/:originStruct/:originStructFieldName', component: ConfigurationDetailComponent, outlet: 'github_com_thomaspeugeot_gongtenk_go_editor' },
	{ path: 'github_com_thomaspeugeot_gongtenk_go-configuration-detail/:id', component: ConfigurationDetailComponent, outlet: 'github_com_thomaspeugeot_gongtenk_go_editor' },
	{ path: 'github_com_thomaspeugeot_gongtenk_go-configuration-presentation/:id', component: ConfigurationPresentationComponent, outlet: 'github_com_thomaspeugeot_gongtenk_go_presentation' },
	{ path: 'github_com_thomaspeugeot_gongtenk_go-configuration-presentation-special/:id', component: ConfigurationPresentationComponent, outlet: 'github_com_thomaspeugeot_gongtenk_goconfigurationpres' },

	{ path: 'github_com_thomaspeugeot_gongtenk_go-countrys', component: CountrysTableComponent, outlet: 'github_com_thomaspeugeot_gongtenk_go_table' },
	{ path: 'github_com_thomaspeugeot_gongtenk_go-country-adder', component: CountryDetailComponent, outlet: 'github_com_thomaspeugeot_gongtenk_go_editor' },
	{ path: 'github_com_thomaspeugeot_gongtenk_go-country-adder/:id/:originStruct/:originStructFieldName', component: CountryDetailComponent, outlet: 'github_com_thomaspeugeot_gongtenk_go_editor' },
	{ path: 'github_com_thomaspeugeot_gongtenk_go-country-detail/:id', component: CountryDetailComponent, outlet: 'github_com_thomaspeugeot_gongtenk_go_editor' },
	{ path: 'github_com_thomaspeugeot_gongtenk_go-country-presentation/:id', component: CountryPresentationComponent, outlet: 'github_com_thomaspeugeot_gongtenk_go_presentation' },
	{ path: 'github_com_thomaspeugeot_gongtenk_go-country-presentation-special/:id', component: CountryPresentationComponent, outlet: 'github_com_thomaspeugeot_gongtenk_gocountrypres' },

	{ path: 'github_com_thomaspeugeot_gongtenk_go-individuals', component: IndividualsTableComponent, outlet: 'github_com_thomaspeugeot_gongtenk_go_table' },
	{ path: 'github_com_thomaspeugeot_gongtenk_go-individual-adder', component: IndividualDetailComponent, outlet: 'github_com_thomaspeugeot_gongtenk_go_editor' },
	{ path: 'github_com_thomaspeugeot_gongtenk_go-individual-adder/:id/:originStruct/:originStructFieldName', component: IndividualDetailComponent, outlet: 'github_com_thomaspeugeot_gongtenk_go_editor' },
	{ path: 'github_com_thomaspeugeot_gongtenk_go-individual-detail/:id', component: IndividualDetailComponent, outlet: 'github_com_thomaspeugeot_gongtenk_go_editor' },
	{ path: 'github_com_thomaspeugeot_gongtenk_go-individual-presentation/:id', component: IndividualPresentationComponent, outlet: 'github_com_thomaspeugeot_gongtenk_go_presentation' },
	{ path: 'github_com_thomaspeugeot_gongtenk_go-individual-presentation-special/:id', component: IndividualPresentationComponent, outlet: 'github_com_thomaspeugeot_gongtenk_goindividualpres' },

];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
