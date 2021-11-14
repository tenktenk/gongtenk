import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { XLSheetDB } from '../xlsheet-db'
import { XLSheetService } from '../xlsheet.service'

import { FrontRepoService, FrontRepo } from '../front-repo.service'

import { Router, RouterState, ActivatedRoute } from '@angular/router';

export interface xlsheetDummyElement {
}

const ELEMENT_DATA: xlsheetDummyElement[] = [
];

@Component({
	selector: 'app-xlsheet-presentation',
	templateUrl: './xlsheet-presentation.component.html',
	styleUrls: ['./xlsheet-presentation.component.css'],
})
export class XLSheetPresentationComponent implements OnInit {

	// insertion point for declarations

	displayedColumns: string[] = []
	dataSource = ELEMENT_DATA

	xlsheet: XLSheetDB = new (XLSheetDB)

	// front repo
	frontRepo: FrontRepo = new (FrontRepo)
 
	constructor(
		private xlsheetService: XLSheetService,
		private frontRepoService: FrontRepoService,
		private route: ActivatedRoute,
		private router: Router,
	) {
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};
	}

	ngOnInit(): void {
		this.getXLSheet();

		// observable for changes in 
		this.xlsheetService.XLSheetServiceChanged.subscribe(
			message => {
				if (message == "update") {
					this.getXLSheet()
				}
			}
		)
	}

	getXLSheet(): void {
		const id = +this.route.snapshot.paramMap.get('id')!
		this.frontRepoService.pull().subscribe(
			frontRepo => {
				this.frontRepo = frontRepo

				this.xlsheet = this.frontRepo.XLSheets.get(id)!

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
				github_com_fullstack_lang_gongxlsx_go_editor: ["github_com_fullstack_lang_gongxlsx_go-" + "xlsheet-detail", ID]
			}
		}]);
	}
}
