import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { XLCellDB } from '../xlcell-db'
import { XLCellService } from '../xlcell.service'

import { FrontRepoService, FrontRepo } from '../front-repo.service'

import { Router, RouterState, ActivatedRoute } from '@angular/router';

export interface xlcellDummyElement {
}

const ELEMENT_DATA: xlcellDummyElement[] = [
];

@Component({
	selector: 'app-xlcell-presentation',
	templateUrl: './xlcell-presentation.component.html',
	styleUrls: ['./xlcell-presentation.component.css'],
})
export class XLCellPresentationComponent implements OnInit {

	// insertion point for declarations

	displayedColumns: string[] = []
	dataSource = ELEMENT_DATA

	xlcell: XLCellDB = new (XLCellDB)

	// front repo
	frontRepo: FrontRepo = new (FrontRepo)
 
	constructor(
		private xlcellService: XLCellService,
		private frontRepoService: FrontRepoService,
		private route: ActivatedRoute,
		private router: Router,
	) {
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};
	}

	ngOnInit(): void {
		this.getXLCell();

		// observable for changes in 
		this.xlcellService.XLCellServiceChanged.subscribe(
			message => {
				if (message == "update") {
					this.getXLCell()
				}
			}
		)
	}

	getXLCell(): void {
		const id = +this.route.snapshot.paramMap.get('id')!
		this.frontRepoService.pull().subscribe(
			frontRepo => {
				this.frontRepo = frontRepo

				this.xlcell = this.frontRepo.XLCells.get(id)!

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
				github_com_fullstack_lang_gongxlsx_go_editor: ["github_com_fullstack_lang_gongxlsx_go-" + "xlcell-detail", ID]
			}
		}]);
	}
}
