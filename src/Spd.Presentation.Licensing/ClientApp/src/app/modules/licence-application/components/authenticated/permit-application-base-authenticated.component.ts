import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { AuthUserBcscService } from '@app/core/services/auth-user-bcsc.service';
import { LicenceApplicationRoutes } from '../../licence-application-routing.module';
import { PermitApplicationService } from '../../services/permit-application.service';

@Component({
	selector: 'app-permit-application-base-authenticated',
	template: `
		<ng-container *ngIf="isAuthenticated$ | async">
			<router-outlet></router-outlet>
		</ng-container>
	`,
	styles: [],
})
export class PermitApplicationBaseAuthenticatedComponent implements OnInit {
	isAuthenticated$ = this.authProcessService.waitUntilAuthentication$;

	constructor(
		private router: Router,
		private authProcessService: AuthProcessService,
		private authUserBcscService: AuthUserBcscService,
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

		if (!this.permitApplicationService.initialized) {
			this.router.navigateByUrl(LicenceApplicationRoutes.pathUserApplications());
			return;
		}
	}
}
