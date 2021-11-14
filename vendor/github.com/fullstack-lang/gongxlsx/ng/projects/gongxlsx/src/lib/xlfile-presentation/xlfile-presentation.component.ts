import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { XLFileDB } from '../xlfile-db'
import { XLFileService } from '../xlfile.service'

import { FrontRepoService, FrontRepo } from '../front-repo.service'

import { Router, RouterState, ActivatedRoute } from '@angular/router';

export interface xlfileDummyElement {
}

const ELEMENT_DATA: xlfileDummyElement[] = [
];

@Component({
	selector: 'app-xlfile-presentation',
	templateUrl: './xlfile-presentation.component.html',
	styleUrls: ['./xlfile-presentation.component.css'],
})
export class XLFilePresentationComponent implements OnInit {

	// insertion point for declarations

	displayedColumns: string[] = []
	dataSource = ELEMENT_DATA

	xlfile: XLFileDB = new (XLFileDB)

	// front repo
	frontRepo: FrontRepo = new (FrontRepo)
 
	constructor(
		private xlfileService: XLFileService,
		private frontRepoService: FrontRepoService,
		private route: ActivatedRoute,
		private router: Router,
	) {
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};
	}

	ngOnInit(): void {
		this.getXLFile();

		// observable for changes in 
		this.xlfileService.XLFileServiceChanged.subscribe(
			message => {
				if (message == "update") {
					this.getXLFile()
				}
			}
		)
	}

	getXLFile(): void {
		const id = +this.route.snapshot.paramMap.get('id')!
		this.frontRepoService.pull().subscribe(
			frontRepo => {
				this.frontRepo = frontRepo

				this.xlfile = this.frontRepo.XLFiles.get(id)!

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
				github_com_fullstack_lang_gongxlsx_go_editor: ["github_com_fullstack_lang_gongxlsx_go-" + "xlfile-detail", ID]
			}
		}]);
	}
}
