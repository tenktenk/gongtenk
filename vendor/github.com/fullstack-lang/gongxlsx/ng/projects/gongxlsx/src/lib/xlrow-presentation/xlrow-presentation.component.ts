import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { XLRowDB } from '../xlrow-db'
import { XLRowService } from '../xlrow.service'

import { FrontRepoService, FrontRepo } from '../front-repo.service'

import { Router, RouterState, ActivatedRoute } from '@angular/router';

export interface xlrowDummyElement {
}

const ELEMENT_DATA: xlrowDummyElement[] = [
];

@Component({
	selector: 'app-xlrow-presentation',
	templateUrl: './xlrow-presentation.component.html',
	styleUrls: ['./xlrow-presentation.component.css'],
})
export class XLRowPresentationComponent implements OnInit {

	// insertion point for declarations

	displayedColumns: string[] = []
	dataSource = ELEMENT_DATA

	xlrow: XLRowDB = new (XLRowDB)

	// front repo
	frontRepo: FrontRepo = new (FrontRepo)
 
	constructor(
		private xlrowService: XLRowService,
		private frontRepoService: FrontRepoService,
		private route: ActivatedRoute,
		private router: Router,
	) {
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};
	}

	ngOnInit(): void {
		this.getXLRow();

		// observable for changes in 
		this.xlrowService.XLRowServiceChanged.subscribe(
			message => {
				if (message == "update") {
					this.getXLRow()
				}
			}
		)
	}

	getXLRow(): void {
		const id = +this.route.snapshot.paramMap.get('id')!
		this.frontRepoService.pull().subscribe(
			frontRepo => {
				this.frontRepo = frontRepo

				this.xlrow = this.frontRepo.XLRows.get(id)!

				// insertion point for recovery of durations
			}
		);
	}

	// set presentation outlet
	setPresentationRouterOutlet(structName: string, ID: number) {
		this.router.navigate([{
			outlets: {
				github_com_fullstack_lang_gongxlsx_go_presentation: ["github_com_fullstack_lang_gongxlsx_go-" + structName + "-presentation", ID]
			}
		}]);
	}

	// set editor outlet
	setEditorRouterOutlet(ID: number) {
		this.router.navigate([{
			outlets: {
				github_com_fullstack_lang_gongxlsx_go_editor: ["github_com_fullstack_lang_gongxlsx_go-" + "xlrow-detail", ID]
			}
		}]);
	}
}
