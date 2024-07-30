import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { AuthUserBcscService } from '@app/core/services/auth-user-bcsc.service';
import { LicenceApplicationService } from '@app/modules/personal-licence-application/licence-application.service';
import { PermitApplicationService } from '@app/modules/personal-licence-application/permit-application.service';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routing.module';

@Component({
	selector: 'app-licence-application-base-authenticated',
	template: `
		<ng-container *ngIf="isAuthenticated$ | async">
			<router-outlet></router-outlet>
		</ng-container>
	`,
	styles: [],
})
export class LicenceApplicationBaseAuthenticatedComponent implements OnInit {
	isAuthenticated$ = this.authProcessService.waitUntilAuthentication$;

	constructor(
		private router: Router,
		private authProcessService: AuthProcessService,
		private authUserBcscService: AuthUserBcscService,
		private licenceApplicationService: LicenceApplicationService,
		private permitApplicationService: PermitApplicationService
	) {}

	async ngOnInit(): Promise<void> {
		this.authProcessService.logoutBceid();
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
			return;
		}

		console.debug(
			'WorkerLicenceApplicationBaseAuthenticatedComponent',
			this.licenceApplicationService.initialized,
			this.permitApplicationService.initialized
		);

		if (!this.licenceApplicationService.initialized && !this.permitApplicationService.initialized) {
			this.router.navigateByUrl(PersonalLicenceApplicationRoutes.pathUserApplications());
			return;
		}
	}
}
