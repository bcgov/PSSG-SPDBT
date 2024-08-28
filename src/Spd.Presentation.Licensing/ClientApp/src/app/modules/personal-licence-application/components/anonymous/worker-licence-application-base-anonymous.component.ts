import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutes } from '@app/app-routing.module';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { LicenceApplicationService } from '@app/core/services/licence-application.service';
import { take, tap } from 'rxjs';
import { PersonalLicenceApplicationRoutes } from '../../personal-licence-application-routing.module';

@Component({
	selector: 'app-worker-licence-application-base-anonymous',
	template: `
		<div class="container px-0 my-0 px-md-2 my-md-3">
			<!-- hide padding/margin on smaller screens -->
			<div class="row">
				<div class="col-12">
					<router-outlet></router-outlet>
				</div>
			</div>
		</div>
	`,
	styles: [],
})
export class WorkerLicenceApplicationBaseAnonymousComponent implements OnInit {
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private authProcessService: AuthProcessService,
		private licenceApplicationService: LicenceApplicationService
	) {}

	async ngOnInit(): Promise<void> {
		// const queryParams: Params = await lastValueFrom(this.route.queryParams.pipe(take(1)));
		// const licenceAppId: string | undefined = queryParams['licenceAppId'];

		// const params: URLSearchParams = new URLSearchParams();
		console.log('************* location', location.pathname);
		// console.log('************* queryParams', queryParams);

		// const params: URLSearchParams = new URLSearchParams();
		// if (licenceAppId) params.set('licenceAppId', licenceAppId);

		const currentPath = location.pathname;
		let redirectComponentRoute: string | undefined;
		if (currentPath.includes(PersonalLicenceApplicationRoutes.WORKER_LICENCE_NEW_ANONYMOUS)) {
			redirectComponentRoute = `${PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAnonymous(
				PersonalLicenceApplicationRoutes.WORKER_LICENCE_NEW_ANONYMOUS
			)}`;
		}

		console.log('************* redirectComponentRoute', redirectComponentRoute);

		// make sure the user is not logged in.
		this.authProcessService.logoutBceid(redirectComponentRoute); // TODO needed?
		this.authProcessService.logoutBcsc(redirectComponentRoute);

		// console.log('************* licenceAppId', licenceAppId);

		if (currentPath.includes(PersonalLicenceApplicationRoutes.WORKER_LICENCE_NEW_ANONYMOUS)) {
			// handle new business licence creation from swl - for sole proprietor

			console.debug('BusinessLicenceApplicationBaseComponent populateSoleProprietorComboFlowAnonymous');

			this.licenceApplicationService
				.populateSoleProprietorComboFlowAnonymous()
				.pipe(
					tap((_resp: any) => {
						this.router.navigateByUrl(
							`${PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAnonymous(
								PersonalLicenceApplicationRoutes.WORKER_LICENCE_NEW_ANONYMOUS
							)}`
						);
					}),
					take(1)
				)
				.subscribe();
			return;
		}

		if (!this.licenceApplicationService.initialized) {
			this.router.navigateByUrl(AppRoutes.path(AppRoutes.LANDING));
			return;
		}
	}
}
