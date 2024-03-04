import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { AuthUserBcscService } from '@app/core/services/auth-user-bcsc.service';
import { LicenceApplicationRoutes } from '../../licence-application-routing.module';

@Component({
	selector: 'app-worker-licence-application-base-authenticated',
	template: `
		<ng-container *ngIf="isAuthenticated$ | async">
			<router-outlet></router-outlet>
		</ng-container>
	`,
	styles: [],
})
export class WorkerLicenceApplicationBaseAuthenticatedComponent implements OnInit {
	isAuthenticated$ = this.authProcessService.waitUntilAuthentication$;

	constructor(
		private router: Router,
		private authProcessService: AuthProcessService,
		private authUserBcscService: AuthUserBcscService
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
	}
}
