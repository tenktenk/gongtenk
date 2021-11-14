import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { LayerGroupDB } from '../layergroup-db'
import { LayerGroupService } from '../layergroup.service'

import { FrontRepoService, FrontRepo } from '../front-repo.service'

import { Router, RouterState, ActivatedRoute } from '@angular/router';

export interface layergroupDummyElement {
}

const ELEMENT_DATA: layergroupDummyElement[] = [
];

@Component({
	selector: 'app-layergroup-presentation',
	templateUrl: './layergroup-presentation.component.html',
	styleUrls: ['./layergroup-presentation.component.css'],
})
export class LayerGroupPresentationComponent implements OnInit {

	// insertion point for declarations

	displayedColumns: string[] = []
	dataSource = ELEMENT_DATA

	layergroup: LayerGroupDB = new (LayerGroupDB)

	// front repo
	frontRepo: FrontRepo = new (FrontRepo)
 
	constructor(
		private layergroupService: LayerGroupService,
		private frontRepoService: FrontRepoService,
		private route: ActivatedRoute,
		private router: Router,
	) {
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};
	}

	ngOnInit(): void {
		this.getLayerGroup();

		// observable for changes in 
		this.layergroupService.LayerGroupServiceChanged.subscribe(
			message => {
				if (message == "update") {
					this.getLayerGroup()
				}
			}
		)
	}

	getLayerGroup(): void {
		const id = +this.route.snapshot.paramMap.get('id')!
		this.frontRepoService.pull().subscribe(
			frontRepo => {
				this.frontRepo = frontRepo

				this.layergroup = this.frontRepo.LayerGroups.get(id)!

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
				github_com_fullstack_lang_gongleaflet_go_editor: ["github_com_fullstack_lang_gongleaflet_go-" + "layergroup-detail", ID]
			}
		}]);
	}
}
