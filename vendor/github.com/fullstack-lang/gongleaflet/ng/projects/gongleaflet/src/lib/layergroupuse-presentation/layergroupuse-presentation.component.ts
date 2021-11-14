import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { LayerGroupUseDB } from '../layergroupuse-db'
import { LayerGroupUseService } from '../layergroupuse.service'

import { FrontRepoService, FrontRepo } from '../front-repo.service'

import { Router, RouterState, ActivatedRoute } from '@angular/router';

export interface layergroupuseDummyElement {
}

const ELEMENT_DATA: layergroupuseDummyElement[] = [
];

@Component({
	selector: 'app-layergroupuse-presentation',
	templateUrl: './layergroupuse-presentation.component.html',
	styleUrls: ['./layergroupuse-presentation.component.css'],
})
export class LayerGroupUsePresentationComponent implements OnInit {

	// insertion point for declarations

	displayedColumns: string[] = []
	dataSource = ELEMENT_DATA

	layergroupuse: LayerGroupUseDB = new (LayerGroupUseDB)

	// front repo
	frontRepo: FrontRepo = new (FrontRepo)
 
	constructor(
		private layergroupuseService: LayerGroupUseService,
		private frontRepoService: FrontRepoService,
		private route: ActivatedRoute,
		private router: Router,
	) {
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};
	}

	ngOnInit(): void {
		this.getLayerGroupUse();

		// observable for changes in 
		this.layergroupuseService.LayerGroupUseServiceChanged.subscribe(
			message => {
				if (message == "update") {
					this.getLayerGroupUse()
				}
			}
		)
	}

	getLayerGroupUse(): void {
		const id = +this.route.snapshot.paramMap.get('id')!
		this.frontRepoService.pull().subscribe(
			frontRepo => {
				this.frontRepo = frontRepo

				this.layergroupuse = this.frontRepo.LayerGroupUses.get(id)!

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
				github_com_fullstack_lang_gongleaflet_go_editor: ["github_com_fullstack_lang_gongleaflet_go-" + "layergroupuse-detail", ID]
			}
		}]);
	}
}
