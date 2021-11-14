import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { ConfigurationDB } from '../configuration-db'
import { ConfigurationService } from '../configuration.service'

import { FrontRepoService, FrontRepo } from '../front-repo.service'

import { Router, RouterState, ActivatedRoute } from '@angular/router';

export interface configurationDummyElement {
}

const ELEMENT_DATA: configurationDummyElement[] = [
];

@Component({
	selector: 'app-configuration-presentation',
	templateUrl: './configuration-presentation.component.html',
	styleUrls: ['./configuration-presentation.component.css'],
})
export class ConfigurationPresentationComponent implements OnInit {

	// insertion point for declarations

	displayedColumns: string[] = []
	dataSource = ELEMENT_DATA

	configuration: ConfigurationDB = new (ConfigurationDB)

	// front repo
	frontRepo: FrontRepo = new (FrontRepo)
 
	constructor(
		private configurationService: ConfigurationService,
		private frontRepoService: FrontRepoService,
		private route: ActivatedRoute,
		private router: Router,
	) {
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};
	}

	ngOnInit(): void {
		this.getConfiguration();

		// observable for changes in 
		this.configurationService.ConfigurationServiceChanged.subscribe(
			message => {
				if (message == "update") {
					this.getConfiguration()
				}
			}
		)
	}

	getConfiguration(): void {
		const id = +this.route.snapshot.paramMap.get('id')!
		this.frontRepoService.pull().subscribe(
			frontRepo => {
				this.frontRepo = frontRepo

				this.configuration = this.frontRepo.Configurations.get(id)!

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
				github_com_thomaspeugeot_gongtenk_go_editor: ["github_com_thomaspeugeot_gongtenk_go-" + "configuration-detail", ID]
			}
		}]);
	}
}
