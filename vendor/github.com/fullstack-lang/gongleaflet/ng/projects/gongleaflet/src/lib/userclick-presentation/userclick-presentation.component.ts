import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { UserClickDB } from '../userclick-db'
import { UserClickService } from '../userclick.service'

import { FrontRepoService, FrontRepo } from '../front-repo.service'

import { Router, RouterState, ActivatedRoute } from '@angular/router';

export interface userclickDummyElement {
}

const ELEMENT_DATA: userclickDummyElement[] = [
];

@Component({
	selector: 'app-userclick-presentation',
	templateUrl: './userclick-presentation.component.html',
	styleUrls: ['./userclick-presentation.component.css'],
})
export class UserClickPresentationComponent implements OnInit {

	// insertion point for declarations

	displayedColumns: string[] = []
	dataSource = ELEMENT_DATA

	userclick: UserClickDB = new (UserClickDB)

	// front repo
	frontRepo: FrontRepo = new (FrontRepo)
 
	constructor(
		private userclickService: UserClickService,
		private frontRepoService: FrontRepoService,
		private route: ActivatedRoute,
		private router: Router,
	) {
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};
	}

	ngOnInit(): void {
		this.getUserClick();

		// observable for changes in 
		this.userclickService.UserClickServiceChanged.subscribe(
			message => {
				if (message == "update") {
					this.getUserClick()
				}
			}
		)
	}

	getUserClick(): void {
		const id = +this.route.snapshot.paramMap.get('id')!
		this.frontRepoService.pull().subscribe(
			frontRepo => {
				this.frontRepo = frontRepo

				this.userclick = this.frontRepo.UserClicks.get(id)!

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
				github_com_fullstack_lang_gongleaflet_go_editor: ["github_com_fullstack_lang_gongleaflet_go-" + "userclick-detail", ID]
			}
		}]);
	}
}
