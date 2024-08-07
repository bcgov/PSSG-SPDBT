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
		const licenceAppId: string | undefined = queryParams['licenceAppId'];
		const isSwlAnonymous: string | undefined = queryParams['isSwlAnonymous'];

		console.debug('BusinessLicenceApplicationBaseComponent queryParams', queryParams);

		const params: URLSearchParams = new URLSearchParams();
		if (defaultBizId) params.set('bizId', defaultBizId);
		if (licenceAppId) params.set('licenceAppId', licenceAppId);
		if (isSwlAnonymous) params.set('isSwlAnonymous', isSwlAnonymous);

		console.debug('BusinessLicenceApplicationBaseComponent params', params.toString());

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

		// TODO for BUSINESS_NEW_SWL_SP, ignore first time login ??

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

		if (
			loginInfo.returnRoute?.includes(BusinessLicenceApplicationRoutes.BUSINESS_NEW_SOLE_PROPRIETOR) &&
			loginInfo.state
		) {
			// handle new business licence creation from swl - for sole proprietor

			console.debug('BusinessLicenceApplicationBaseComponent soleProprietor defaultBizId', defaultBizId);
			console.debug('BusinessLicenceApplicationBaseComponent soleProprietor licenceAppId', licenceAppId);
			console.debug('BusinessLicenceApplicationBaseComponent soleProprietor isSwlAnonymous', isSwlAnonymous);

			this.businessApplicationService
				.createNewBusinessLicenceWithSwl(licenceAppId!, isSwlAnonymous === 'Y')
				.pipe(
					tap((_resp: any) => {
						this.router.navigateByUrl(
							`${BusinessLicenceApplicationRoutes.pathBusinessLicence(
								BusinessLicenceApplicationRoutes.BUSINESS_NEW_SWL_SP
							)}?${loginInfo.state}`
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
