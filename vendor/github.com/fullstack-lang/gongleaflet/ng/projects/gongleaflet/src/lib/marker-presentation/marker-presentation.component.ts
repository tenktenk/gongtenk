import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { MarkerDB } from '../marker-db'
import { MarkerService } from '../marker.service'

import { FrontRepoService, FrontRepo } from '../front-repo.service'

import { Router, RouterState, ActivatedRoute } from '@angular/router';

export interface markerDummyElement {
}

const ELEMENT_DATA: markerDummyElement[] = [
];

@Component({
	selector: 'app-marker-presentation',
	templateUrl: './marker-presentation.component.html',
	styleUrls: ['./marker-presentation.component.css'],
})
export class MarkerPresentationComponent implements OnInit {

	// insertion point for declarations

	displayedColumns: string[] = []
	dataSource = ELEMENT_DATA

	marker: MarkerDB = new (MarkerDB)

	// front repo
	frontRepo: FrontRepo = new (FrontRepo)
 
	constructor(
		private markerService: MarkerService,
		private frontRepoService: FrontRepoService,
		private route: ActivatedRoute,
		private router: Router,
	) {
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};
	}

	ngOnInit(): void {
		this.getMarker();

		// observable for changes in 
		this.markerService.MarkerServiceChanged.subscribe(
			message => {
				if (message == "update") {
					this.getMarker()
				}
			}
		)
	}

	getMarker(): void {
		const id = +this.route.snapshot.paramMap.get('id')!
		this.frontRepoService.pull().subscribe(
			frontRepo => {
				this.frontRepo = frontRepo

				this.marker = this.frontRepo.Markers.get(id)!

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
				github_com_fullstack_lang_gongleaflet_go_editor: ["github_com_fullstack_lang_gongleaflet_go-" + "marker-detail", ID]
			}
		}]);
	}
}
