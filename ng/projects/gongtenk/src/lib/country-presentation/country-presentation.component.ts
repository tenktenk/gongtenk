import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { CountryDB } from '../country-db'
import { CountryService } from '../country.service'

import { FrontRepoService, FrontRepo } from '../front-repo.service'

import { Router, RouterState, ActivatedRoute } from '@angular/router';

export interface countryDummyElement {
}

const ELEMENT_DATA: countryDummyElement[] = [
];

@Component({
	selector: 'app-country-presentation',
	templateUrl: './country-presentation.component.html',
	styleUrls: ['./country-presentation.component.css'],
})
export class CountryPresentationComponent implements OnInit {

	// insertion point for declarations

	displayedColumns: string[] = []
	dataSource = ELEMENT_DATA

	country: CountryDB = new (CountryDB)

	// front repo
	frontRepo: FrontRepo = new (FrontRepo)
 
	constructor(
		private countryService: CountryService,
		private frontRepoService: FrontRepoService,
		private route: ActivatedRoute,
		private router: Router,
	) {
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};
	}

	ngOnInit(): void {
		this.getCountry();

		// observable for changes in 
		this.countryService.CountryServiceChanged.subscribe(
			message => {
				if (message == "update") {
					this.getCountry()
				}
			}
		)
	}

	getCountry(): void {
		const id = +this.route.snapshot.paramMap.get('id')!
		this.frontRepoService.pull().subscribe(
			frontRepo => {
				this.frontRepo = frontRepo

				this.country = this.frontRepo.Countrys.get(id)!

				// insertion point for recovery of durations
			}
		);
	}

	// set presentation outlet
	setPresentationRouterOutlet(structName: string, ID: number) {
		this.router.navigate([{
			outlets: {
				github_com_thomaspeugeot_gongtenk_go_presentation: ["github_com_thomaspeugeot_gongtenk_go-" + structName + "-presentation", ID]
			}
		}]);
	}

	// set editor outlet
	setEditorRouterOutlet(ID: number) {
		this.router.navigate([{
			outlets: {
				github_com_thomaspeugeot_gongtenk_go_editor: ["github_com_thomaspeugeot_gongtenk_go-" + "country-detail", ID]
			}
		}]);
	}
}
