import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { IndividualDB } from '../individual-db'
import { IndividualService } from '../individual.service'

import { FrontRepoService, FrontRepo } from '../front-repo.service'

import { Router, RouterState, ActivatedRoute } from '@angular/router';

export interface individualDummyElement {
}

const ELEMENT_DATA: individualDummyElement[] = [
];

@Component({
	selector: 'app-individual-presentation',
	templateUrl: './individual-presentation.component.html',
	styleUrls: ['./individual-presentation.component.css'],
})
export class IndividualPresentationComponent implements OnInit {

	// insertion point for declarations

	displayedColumns: string[] = []
	dataSource = ELEMENT_DATA

	individual: IndividualDB = new (IndividualDB)

	// front repo
	frontRepo: FrontRepo = new (FrontRepo)
 
	constructor(
		private individualService: IndividualService,
		private frontRepoService: FrontRepoService,
		private route: ActivatedRoute,
		private router: Router,
	) {
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};
	}

	ngOnInit(): void {
		this.getIndividual();

		// observable for changes in 
		this.individualService.IndividualServiceChanged.subscribe(
			message => {
				if (message == "update") {
					this.getIndividual()
				}
			}
		)
	}

	getIndividual(): void {
		const id = +this.route.snapshot.paramMap.get('id')!
		this.frontRepoService.pull().subscribe(
			frontRepo => {
				this.frontRepo = frontRepo

				this.individual = this.frontRepo.Individuals.get(id)!

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
				github_com_thomaspeugeot_gongtenk_go_editor: ["github_com_thomaspeugeot_gongtenk_go-" + "individual-detail", ID]
			}
		}]);
	}
}
