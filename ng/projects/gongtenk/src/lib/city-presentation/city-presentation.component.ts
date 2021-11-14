import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { CityDB } from '../city-db'
import { CityService } from '../city.service'

import { FrontRepoService, FrontRepo } from '../front-repo.service'

import { Router, RouterState, ActivatedRoute } from '@angular/router';

export interface cityDummyElement {
}

const ELEMENT_DATA: cityDummyElement[] = [
];

@Component({
	selector: 'app-city-presentation',
	templateUrl: './city-presentation.component.html',
	styleUrls: ['./city-presentation.component.css'],
})
export class CityPresentationComponent implements OnInit {

	// insertion point for declarations

	displayedColumns: string[] = []
	dataSource = ELEMENT_DATA

	city: CityDB = new (CityDB)

	// front repo
	frontRepo: FrontRepo = new (FrontRepo)
 
	constructor(
		private cityService: CityService,
		private frontRepoService: FrontRepoService,
		private route: ActivatedRoute,
		private router: Router,
	) {
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};
	}

	ngOnInit(): void {
		this.getCity();

		// observable for changes in 
		this.cityService.CityServiceChanged.subscribe(
			message => {
				if (message == "update") {
					this.getCity()
				}
			}
		)
	}

	getCity(): void {
		const id = +this.route.snapshot.paramMap.get('id')!
		this.frontRepoService.pull().subscribe(
			frontRepo => {
				this.frontRepo = frontRepo

				this.city = this.frontRepo.Citys.get(id)!

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
				github_com_thomaspeugeot_gongtenk_go_editor: ["github_com_thomaspeugeot_gongtenk_go-" + "city-detail", ID]
			}
		}]);
	}
}
