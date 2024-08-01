import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '@app/app-routing.module';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { PermitApplicationService } from '@core/services/permit-application.service';

@Component({
	selector: 'app-permit-application-base-anonymous',
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
	styles: [],
})
export class PermitApplicationBaseAnonymousComponent implements OnInit {
	constructor(
		private router: Router,
		private authProcessService: AuthProcessService,
		private permitApplicationService: PermitApplicationService
	) {}

	ngOnInit(): void {
		// make sure the user is not logged in.
		// this.authProcessService.logoutBceid(); // TODO needed?
		// this.authProcessService.logoutBcsc();

		if (!this.permitApplicationService.initialized) {
			this.router.navigateByUrl(AppRoutes.path(AppRoutes.LANDING));
			return;
		}
	}
}
