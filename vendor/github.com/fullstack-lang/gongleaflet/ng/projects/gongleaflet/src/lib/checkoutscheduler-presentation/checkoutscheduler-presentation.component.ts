import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { CheckoutSchedulerDB } from '../checkoutscheduler-db'
import { CheckoutSchedulerService } from '../checkoutscheduler.service'

import { FrontRepoService, FrontRepo } from '../front-repo.service'

import { Router, RouterState, ActivatedRoute } from '@angular/router';

export interface checkoutschedulerDummyElement {
}

const ELEMENT_DATA: checkoutschedulerDummyElement[] = [
];

@Component({
	selector: 'app-checkoutscheduler-presentation',
	templateUrl: './checkoutscheduler-presentation.component.html',
	styleUrls: ['./checkoutscheduler-presentation.component.css'],
})
export class CheckoutSchedulerPresentationComponent implements OnInit {

	// insertion point for declarations

	displayedColumns: string[] = []
	dataSource = ELEMENT_DATA

	checkoutscheduler: CheckoutSchedulerDB = new (CheckoutSchedulerDB)

	// front repo
	frontRepo: FrontRepo = new (FrontRepo)
 
	constructor(
		private checkoutschedulerService: CheckoutSchedulerService,
		private frontRepoService: FrontRepoService,
		private route: ActivatedRoute,
		private router: Router,
	) {
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		};
	}

	ngOnInit(): void {
		this.getCheckoutScheduler();

		// observable for changes in 
		this.checkoutschedulerService.CheckoutSchedulerServiceChanged.subscribe(
			message => {
				if (message == "update") {
					this.getCheckoutScheduler()
				}
			}
		)
	}

	getCheckoutScheduler(): void {
		const id = +this.route.snapshot.paramMap.get('id')!
		this.frontRepoService.pull().subscribe(
			frontRepo => {
				this.frontRepo = frontRepo

				this.checkoutscheduler = this.frontRepo.CheckoutSchedulers.get(id)!

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
				github_com_fullstack_lang_gongleaflet_go_editor: ["github_com_fullstack_lang_gongleaflet_go-" + "checkoutscheduler-detail", ID]
			}
		}]);
	}
}
