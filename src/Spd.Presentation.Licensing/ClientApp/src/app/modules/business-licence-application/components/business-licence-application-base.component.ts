import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
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
		const queryParams: Params = await lastValueFrom(this.route.queryParams.pipe(take(1)));
		const defaultBizId: string | undefined = queryParams['bizId'];
		const swlLicAppId: string | undefined = queryParams['swlLicAppId'];
		const bizLicAppId: string | undefined = queryParams['bizLicAppId'];
		const isSoleProprietorSWLAnonymous: string | undefined = queryParams['isSoleProprietorSWLAnonymous'];

		console.debug('BusinessLicenceApplicationBaseComponent queryParams', queryParams);

		const params: URLSearchParams = new URLSearchParams();
		if (defaultBizId) params.set('bizId', defaultBizId);
		if (swlLicAppId) params.set('swlLicAppId', swlLicAppId);
		if (bizLicAppId) params.set('bizLicAppId', bizLicAppId);
		if (isSoleProprietorSWLAnonymous) params.set('isSoleProprietorSWLAnonymous', isSoleProprietorSWLAnonymous);

		const currentPath = location.pathname;
		let redirectComponentRoute: string | undefined;
		if (currentPath.includes(BusinessLicenceApplicationRoutes.BUSINESS_NEW_SOLE_PROPRIETOR)) {
			redirectComponentRoute = `${BusinessLicenceApplicationRoutes.path(
				BusinessLicenceApplicationRoutes.BUSINESS_NEW_SOLE_PROPRIETOR
			)}?${params.toString()}`;
		}

		console.debug('BusinessLicenceApplicationBaseComponent redirectComponentRoute', redirectComponentRoute);

		this.authProcessService.logoutBcsc(redirectComponentRoute);

		const loginInfo = await this.authProcessService.initializeLicencingBCeID(
			defaultBizId,
			redirectComponentRoute,
			params.toString()
		);

		console.debug('BusinessLicenceApplicationBaseComponent loginInfo', loginInfo);
		console.debug('BusinessLicenceApplicationBaseComponent swlLicAppId', swlLicAppId);
		console.debug('BusinessLicenceApplicationBaseComponent bizLicAppId', bizLicAppId);

		if (
			(swlLicAppId || bizLicAppId) &&
			loginInfo.returnRoute?.includes(BusinessLicenceApplicationRoutes.BUSINESS_NEW_SOLE_PROPRIETOR) &&
			loginInfo.state
		) {
			// handle new business licence creation from swl - for sole proprietor
			this.businessApplicationService
				.getBusinessLicenceWithSwlCombinedFlow(swlLicAppId, bizLicAppId, isSoleProprietorSWLAnonymous === 'Y')
				.pipe(
					tap((_resp: any) => {
						this.router.navigateByUrl(
							`${BusinessLicenceApplicationRoutes.pathBusinessLicence(
								BusinessLicenceApplicationRoutes.BUSINESS_NEW_SOLE_PROPRIETOR
							)}?${loginInfo.state}`
						);
					}),
					take(1)
				)
				.subscribe();
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

		// handle first time login
		if (this.authUserBceidService.bceidUserProfile?.isFirstTimeLogin) {
			this.router.navigateByUrl(
				BusinessLicenceApplicationRoutes.path(BusinessLicenceApplicationRoutes.BUSINESS_FIRST_TIME_USER_TERMS)
			);
			return;
		}

		if (!this.businessApplicationService.initialized) {
			this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessLicence());
			return;
		}
	}
}
