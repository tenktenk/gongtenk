import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { DivIconDB } from '../divicon-db'
import { DivIconService } from '../divicon.service'

import { FrontRepoService, FrontRepo } from '../front-repo.service'

import { Router, RouterState, ActivatedRoute } from '@angular/router';

export interface diviconDummyElement {
}

const ELEMENT_DATA: diviconDummyElement[] = [
];

@Component({
	selector: 'app-divicon-presentation',
	templateUrl: './divicon-presentation.component.html',
	styleUrls: ['./divicon-presentation.component.css'],
})
export class DivIconPresentationComponent implements OnInit {

	// insertion point for declarations

	displayedColumns: string[] = []
	dataSource = ELEMENT_DATA

	divicon: DivIconDB = new (DivIconDB)

	// front repo
	frontRepo: FrontRepo = new (FrontRepo)
 
	constructor(
		private diviconService: DivIconService,
		private frontRepoService: FrontRepoService,
		private route: ActivatedRoute,
		private router: Router,
	) {
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};
	}

	ngOnInit(): void {
		this.getDivIcon();

		// observable for changes in 
		this.diviconService.DivIconServiceChanged.subscribe(
			message => {
				if (message == "update") {
					this.getDivIcon()
				}
			}
		)
	}

	getDivIcon(): void {
		const id = +this.route.snapshot.paramMap.get('id')!
		this.frontRepoService.pull().subscribe(
			frontRepo => {
				this.frontRepo = frontRepo

				this.divicon = this.frontRepo.DivIcons.get(id)!

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
				github_com_fullstack_lang_gongleaflet_go_editor: ["github_com_fullstack_lang_gongleaflet_go-" + "divicon-detail", ID]
			}
		}]);
	}
}
