import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { MapOptionsDB } from '../mapoptions-db'
import { MapOptionsService } from '../mapoptions.service'

import { FrontRepoService, FrontRepo } from '../front-repo.service'

import { Router, RouterState, ActivatedRoute } from '@angular/router';

export interface mapoptionsDummyElement {
}

const ELEMENT_DATA: mapoptionsDummyElement[] = [
];

@Component({
	selector: 'app-mapoptions-presentation',
	templateUrl: './mapoptions-presentation.component.html',
	styleUrls: ['./mapoptions-presentation.component.css'],
})
export class MapOptionsPresentationComponent implements OnInit {

	// insertion point for declarations

	displayedColumns: string[] = []
	dataSource = ELEMENT_DATA

	mapoptions: MapOptionsDB = new (MapOptionsDB)

	// front repo
	frontRepo: FrontRepo = new (FrontRepo)
 
	constructor(
		private mapoptionsService: MapOptionsService,
		private frontRepoService: FrontRepoService,
		private route: ActivatedRoute,
		private router: Router,
	) {
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};
	}

	ngOnInit(): void {
		this.getMapOptions();

		// observable for changes in 
		this.mapoptionsService.MapOptionsServiceChanged.subscribe(
			message => {
				if (message == "update") {
					this.getMapOptions()
				}
			}
		)
	}

	getMapOptions(): void {
		const id = +this.route.snapshot.paramMap.get('id')!
		this.frontRepoService.pull().subscribe(
			frontRepo => {
				this.frontRepo = frontRepo

				this.mapoptions = this.frontRepo.MapOptionss.get(id)!

				// insertion point for recovery of durations
			}
		);
	}

	// set presentation outlet
	setPresentationRouterOutlet(structName: string, ID: number) {
		this.router.navigate([{
			outlets: {
				github_com_fullstack_lang_gongleaflet_go_presentation: ["github_com_fullstack_lang_gongleaflet_go-" + structName + "-presentation", ID]
			}
		}]);
	}

	// set editor outlet
	setEditorRouterOutlet(ID: number) {
		this.router.navigate([{
			outlets: {
				github_com_fullstack_lang_gongleaflet_go_editor: ["github_com_fullstack_lang_gongleaflet_go-" + "mapoptions-detail", ID]
			}
		}]);
	}
}
