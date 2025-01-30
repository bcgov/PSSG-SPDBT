import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';
import { GuideDogServiceDogRoutes } from '../guide-dog-service-dog-routes';

@Component({
	selector: 'app-guide-dog-service-dog-base-anonymous',
	template: `
		<div class="container px-0 my-0 px-md-2 my-md-3">
			<!-- hide padding/margin on smaller screens -->
			<div class="row">
				<div class="col-12">
					<router-outlet></router-outlet>
				</div>
			</div>
		</div>
	`,
	styles: ``,
	standalone: false,
})
export class GuideDogServiceDogBaseAnonymousComponent implements OnInit {
	constructor(
		private router: Router,
		private authProcessService: AuthProcessService,
		private gdsdApplicationService: GdsdApplicationService
	) {}

	ngOnInit(): void {
		// make sure the user is not logged in.
		this.authProcessService.logoutBceid();
		this.authProcessService.logoutBcsc();

		if (!this.gdsdApplicationService.initialized) {
			this.router.navigateByUrl(GuideDogServiceDogRoutes.path());
			return;
		}
	}
}
