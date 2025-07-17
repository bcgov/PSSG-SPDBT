import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { AuthUserBcscService } from '@app/core/services/auth-user-bcsc.service';
import { PermitApplicationService } from '@app/core/services/permit-application.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routes';

@Component({
	selector: 'app-licence-application-base-authenticated',
	template: `
		@if (isAuthenticated$ | async) {
			<div class="container px-0 my-0 px-md-2 my-md-3">
				<!-- hide padding/margin on smaller screens -->
				<div class="row">
					<div class="col-12">
						<router-outlet></router-outlet>
					</div>
				</div>
			</div>
		}
	`,
	styles: [],
	standalone: false,
})
export class LicenceApplicationBaseAuthenticatedComponent implements OnInit {
	isAuthenticated$ = this.authProcessService.waitUntilAuthentication$;

	constructor(
		private router: Router,
		private authProcessService: AuthProcessService,
		private authUserBcscService: AuthUserBcscService,
		private workerApplicationService: WorkerApplicationService,
		private permitApplicationService: PermitApplicationService
	) {}

	async ngOnInit(): Promise<void> {
		const currentPath = location.pathname;

		// to handle relative urls, look for '/personal-licence/' to get the default route
		const startOfRoute = currentPath.indexOf('/' + PersonalLicenceApplicationRoutes.MODULE_PATH + '/');
		let redirectComponentRoute = currentPath.substring(startOfRoute);

		if (currentPath.includes(PersonalLicenceApplicationRoutes.LICENCE_RETURN_FROM_BL_SOLE_PROPRIETOR)) {
			redirectComponentRoute = PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated();
		}

		this.authProcessService.logoutBceid(redirectComponentRoute);

		await this.authProcessService.initializeLicencingBCSC();

		if (this.authUserBcscService.applicantLoginProfile?.isFirstTimeLogin) {
			this.router.navigateByUrl(
				PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
					PersonalLicenceApplicationRoutes.LICENCE_FIRST_TIME_USER_TERMS
				)
			);
			return;
		}

		// If the user is navigating to a payment page, the service does not have to be initialized
		const path = this.router.url;
		if (
			path.includes(PersonalLicenceApplicationRoutes.PAYMENT_SUCCESS) ||
			path.includes(PersonalLicenceApplicationRoutes.PAYMENT_FAIL) ||
			path.includes(PersonalLicenceApplicationRoutes.PAYMENT_CANCEL) ||
			path.includes(PersonalLicenceApplicationRoutes.PAYMENT_ERROR)
		) {
			this.workerApplicationService.reset(); // prevent back button into wizard
			this.permitApplicationService.reset(); // prevent back button into wizard

			return;
		}

		console.debug(
			'[LicenceApplicationBaseAuthenticatedComponent]',
			this.workerApplicationService.initialized,
			this.permitApplicationService.initialized
		);

		if (!this.workerApplicationService.initialized && !this.permitApplicationService.initialized) {
			this.router.navigateByUrl(PersonalLicenceApplicationRoutes.pathUserApplications());
			return;
		}
	}
}
