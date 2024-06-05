import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { BusinessApplicationService } from '@app/modules/licence-application/services/business-application.service';

@Component({
	selector: 'app-business-licence-application-base',
	template: `
		<ng-container *ngIf="isAuthenticated$ | async">
			<router-outlet></router-outlet>
		</ng-container>
	`,
	styles: [],
})
export class BusinessLicenceApplicationBaseComponent implements OnInit {
	isAuthenticated$ = this.authProcessService.waitUntilAuthentication$;

	constructor(
		private router: Router,
		private authProcessService: AuthProcessService,
		private businessApplicationService: BusinessApplicationService
	) {}

	async ngOnInit(): Promise<void> {
		this.authProcessService.logoutBcsc();
		await this.authProcessService.initializeLicencingBCeID();

		// TODO handle first time login
		// if (this.authUserBceidService.bceidUserProfile?.isFirstTimeLogin) {
		// 	this.router.navigateByUrl(
		// 		LicenceApplicationRoutes.pathBusinessLicence(LicenceApplicationRoutes.BUSINESS_FIRST_TIME_USER_TERMS)
		// 	);
		// 	return;
		// }

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

		if (!this.businessApplicationService.initialized) {
			this.router.navigateByUrl(LicenceApplicationRoutes.pathBusinessLicence());
			return;
		}
	}
}
