import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { VisualTrackDB } from '../visualtrack-db'
import { VisualTrackService } from '../visualtrack.service'

import { FrontRepoService, FrontRepo } from '../front-repo.service'

import { Router, RouterState, ActivatedRoute } from '@angular/router';

export interface visualtrackDummyElement {
}

const ELEMENT_DATA: visualtrackDummyElement[] = [
];

@Component({
	selector: 'app-visualtrack-presentation',
	templateUrl: './visualtrack-presentation.component.html',
	styleUrls: ['./visualtrack-presentation.component.css'],
})
export class VisualTrackPresentationComponent implements OnInit {

	// insertion point for declarations

	displayedColumns: string[] = []
	dataSource = ELEMENT_DATA

	visualtrack: VisualTrackDB = new (VisualTrackDB)

	// front repo
	frontRepo: FrontRepo = new (FrontRepo)
 
	constructor(
		private visualtrackService: VisualTrackService,
		private frontRepoService: FrontRepoService,
		private route: ActivatedRoute,
		private router: Router,
	) {
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};
	}

	ngOnInit(): void {
		this.getVisualTrack();

		// observable for changes in 
		this.visualtrackService.VisualTrackServiceChanged.subscribe(
			message => {
				if (message == "update") {
					this.getVisualTrack()
				}
			}
		)
	}

	getVisualTrack(): void {
		const id = +this.route.snapshot.paramMap.get('id')!
		this.frontRepoService.pull().subscribe(
			frontRepo => {
				this.frontRepo = frontRepo

				this.visualtrack = this.frontRepo.VisualTracks.get(id)!

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
				github_com_fullstack_lang_gongleaflet_go_editor: ["github_com_fullstack_lang_gongleaflet_go-" + "visualtrack-detail", ID]
			}
		}]);
	}
}
