import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { AuthUserBcscService } from '@app/core/services/auth-user-bcsc.service';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';

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
				LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
					LicenceApplicationRoutes.LICENCE_FIRST_TIME_USER_TERMS
				)
			);
		}

		// If the user is navigating to a payment page, the service does not have to be initialized
		const path = this.router.url;
		if (
			path.includes(LicenceApplicationRoutes.PAYMENT_SUCCESS) ||
			path.includes(LicenceApplicationRoutes.PAYMENT_FAIL) ||
			path.includes(LicenceApplicationRoutes.PAYMENT_CANCEL) ||
			path.includes(LicenceApplicationRoutes.PAYMENT_ERROR)
		) {
			return;
		}

		console.debug(
			'WorkerLicenceApplicationBaseAuthenticatedComponent',
			this.licenceApplicationService.initialized,
			this.permitApplicationService.initialized
		);

		if (!this.licenceApplicationService.initialized && !this.permitApplicationService.initialized) {
			this.router.navigateByUrl(LicenceApplicationRoutes.pathUserApplications());
			return;
		}
	}
}
