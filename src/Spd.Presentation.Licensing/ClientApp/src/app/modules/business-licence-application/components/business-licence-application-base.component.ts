import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { AuthUserBceidService } from '@app/core/services/auth-user-bceid.service';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { BusinessLicenceApplicationRoutes } from '@app/modules/business-licence-application/business-license-application-routes';
import { lastValueFrom, take, tap } from 'rxjs';

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
		const linkedSoleProprietorBizLicId: string | undefined = queryParams['linkedSoleProprietorBizLicId'];

		const params: URLSearchParams = new URLSearchParams();
		if (defaultBizId) params.set('bizId', defaultBizId);
		if (swlLicAppId) params.set('swlLicAppId', swlLicAppId);
		if (bizLicAppId) params.set('bizLicAppId', bizLicAppId);
		if (linkedSoleProprietorBizLicId) params.set('linkedSoleProprietorBizLicId', linkedSoleProprietorBizLicId);

		// to handle relative urls, look for '/business-licence/' to get the default route
		const currentPath = location.pathname;
		const startOfRoute = currentPath.indexOf('/' + BusinessLicenceApplicationRoutes.MODULE_PATH + '/');
		const defaultRoute = currentPath.substring(startOfRoute);

		let redirectComponentRoute: string | undefined;
		if (defaultRoute.includes(BusinessLicenceApplicationRoutes.BUSINESS_NEW_SOLE_PROPRIETOR)) {
			redirectComponentRoute = `${BusinessLicenceApplicationRoutes.path(
				BusinessLicenceApplicationRoutes.BUSINESS_NEW_SOLE_PROPRIETOR
			)}?${params.toString()}`;
		} else if (defaultRoute.includes(BusinessLicenceApplicationRoutes.BUSINESS_RENEWAL_SOLE_PROPRIETOR)) {
			redirectComponentRoute = `${BusinessLicenceApplicationRoutes.path(
				BusinessLicenceApplicationRoutes.BUSINESS_RENEWAL_SOLE_PROPRIETOR
			)}?${params.toString()}`;
		} else if (
			defaultRoute.includes(BusinessLicenceApplicationRoutes.PAYMENT_SUCCESS) ||
			defaultRoute.includes(BusinessLicenceApplicationRoutes.PAYMENT_FAIL) ||
			defaultRoute.includes(BusinessLicenceApplicationRoutes.PAYMENT_CANCEL) ||
			defaultRoute.includes(BusinessLicenceApplicationRoutes.PAYMENT_ERROR)
		) {
			redirectComponentRoute = `${defaultRoute}?${params.toString()}`;
		} else {
			redirectComponentRoute = BusinessLicenceApplicationRoutes.pathBusinessLicence();
		}

		console.debug('**** BaseComponent **** redirectComponentRoute', redirectComponentRoute);

		this.authProcessService.logoutBcsc(redirectComponentRoute);

		const loginInfo = await this.authProcessService.initializeLicencingBCeID(
			defaultBizId,
			redirectComponentRoute,
			params.toString()
		);

		console.debug('**** BaseComponent **** loginInfo', loginInfo);
		console.debug('**** BaseComponent **** defaultBizId', defaultBizId);
		console.debug('**** BaseComponent **** swlLicAppId', swlLicAppId);
		console.debug('**** BaseComponent **** bizLicAppId', bizLicAppId);
		console.debug('**** BaseComponent **** linkedSoleProprietorBizLicId', linkedSoleProprietorBizLicId);

		if (loginInfo.returnRoute?.includes(BusinessLicenceApplicationRoutes.BUSINESS_NEW_SOLE_PROPRIETOR)) {
			if ((swlLicAppId || bizLicAppId) && loginInfo.state) {
				// handle new business licence creation from swl - for sole proprietor
				this.businessApplicationService
					.getNewBusinessLicenceWithSwlCombinedFlow(swlLicAppId, bizLicAppId)
					.pipe(
						tap((_resp: any) => {
							this.router.navigateByUrl(`${redirectComponentRoute}`);
						}),
						take(1)
					)
					.subscribe();
				return;
			}

			// data is missing - return to home page
			this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessLicence());
			return;
		}

		if (loginInfo.returnRoute?.includes(BusinessLicenceApplicationRoutes.BUSINESS_RENEWAL_SOLE_PROPRIETOR)) {
			if (swlLicAppId && linkedSoleProprietorBizLicId && loginInfo.state) {
				// handle renew business licence creation from swl - for sole proprietor
				this.businessApplicationService
					.getRenewalBusinessLicenceWithSwlCombinedFlow(swlLicAppId, linkedSoleProprietorBizLicId)
					.pipe(
						tap((_resp: any) => {
							this.router.navigateByUrl(`${redirectComponentRoute}`);
						}),
						take(1)
					)
					.subscribe();
				return;
			}

			// data is missing - return to home page
			this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessLicence());
			return;
		}

		// If the user is navigating to a payment page, the service does not have to be initialized
		if (
			loginInfo.returnRoute?.includes(BusinessLicenceApplicationRoutes.PAYMENT_SUCCESS) ||
			loginInfo.returnRoute?.includes(BusinessLicenceApplicationRoutes.PAYMENT_FAIL) ||
			loginInfo.returnRoute?.includes(BusinessLicenceApplicationRoutes.PAYMENT_CANCEL) ||
			loginInfo.returnRoute?.includes(BusinessLicenceApplicationRoutes.PAYMENT_ERROR)
		) {
			this.router.navigateByUrl(`${redirectComponentRoute}`);
			return;
		}

		console.debug(
			'**** BaseComponent **** isFirstTimeLogin',
			!!this.authUserBceidService.bceidUserProfile?.isFirstTimeLogin
		);
		console.debug('**** BaseComponent **** initialized', this.businessApplicationService.initialized);

		// handle first time login
		if (!!this.authUserBceidService.bceidUserProfile?.isFirstTimeLogin) {
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
