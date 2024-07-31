import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { AuthUserBceidService } from '@app/core/services/auth-user-bceid.service';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { lastValueFrom, take, tap } from 'rxjs';
import { BusinessLicenceApplicationRoutes } from '../business-licence-application-routing.module';

@Component({
	selector: 'app-business-licence-application-base',
	template: `
		<ng-container *ngIf="isAuthenticated$ | async">
			<div class="container px-0 my-0 px-md-2 my-md-3">
				<!-- hide padding/margin on smaller screens -->
				<div class="row">
					<div class="col-12">
						<router-outlet></router-outlet>
					</div>
				</div>
			</div>
		</ng-container>
	`,
	styles: [],
})
export class BusinessLicenceApplicationBaseComponent implements OnInit {
	isAuthenticated$ = this.authProcessService.waitUntilAuthentication$;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private authUserBceidService: AuthUserBceidService,
		private authProcessService: AuthProcessService,
		private businessApplicationService: BusinessApplicationService
	) {}

	async ngOnInit(): Promise<void> {
		const queryParams = await lastValueFrom(this.route.queryParams.pipe(take(1)));
		const defaultBizId: string | undefined = queryParams['bizId'];

		console.debug('BusinessLicenceApplicationBaseComponent ngOnInit', location.pathname);

		console.debug('logoutBcsc');
		this.authProcessService.logoutBcsc();
		console.debug('initializeLicencingBCeID');
		const nextRoute = await this.authProcessService.initializeLicencingBCeID(defaultBizId);

		console.debug('this.authUserBceidService.bceidUserProfile', this.authUserBceidService.bceidUserProfile);
		// handle first time login
		if (this.authUserBceidService.bceidUserProfile?.isFirstTimeLogin) {
			this.router.navigateByUrl(
				BusinessLicenceApplicationRoutes.path(BusinessLicenceApplicationRoutes.BUSINESS_FIRST_TIME_USER_TERMS)
			);
			return;
		}

		// If the user is navigating to a payment page, the service does not have to be initialized
		const path = this.router.url;
		if (
			path.includes(BusinessLicenceApplicationRoutes.PAYMENT_SUCCESS) ||
			path.includes(BusinessLicenceApplicationRoutes.PAYMENT_FAIL) ||
			path.includes(BusinessLicenceApplicationRoutes.PAYMENT_CANCEL) ||
			path.includes(BusinessLicenceApplicationRoutes.PAYMENT_ERROR)
		) {
			return;
		}

		if (nextRoute?.includes(BusinessLicenceApplicationRoutes.BUSINESS_NEW_SWL_SP)) {
			// handle new business licence creation from swl - for sole proprietor
			this.businessApplicationService
				.createNewBusinessLicenceWithSwl()
				.pipe(
					tap((_resp: any) => {
						this.router.navigateByUrl(
							BusinessLicenceApplicationRoutes.pathBusinessLicence(BusinessLicenceApplicationRoutes.BUSINESS_NEW_SWL_SP)
						);
					}),
					take(1)
				)
				.subscribe();
			return;
		}

		if (!this.businessApplicationService.initialized) {
			this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessLicence());
			return;
		}
	}
}
