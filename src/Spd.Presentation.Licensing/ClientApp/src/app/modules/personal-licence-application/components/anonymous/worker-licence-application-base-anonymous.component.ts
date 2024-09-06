import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
		private router: Router,
		private authProcessService: AuthProcessService,
		private licenceApplicationService: LicenceApplicationService
	) {}

	async ngOnInit(): Promise<void> {
		const currentPath = location.pathname;
		let redirectComponentRoute: string | undefined;
		if (currentPath.includes(PersonalLicenceApplicationRoutes.LICENCE_RETURN_FROM_BL_SOLE_PROPRIETOR_ANONYMOUS)) {
			redirectComponentRoute = `${PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAnonymous(
				PersonalLicenceApplicationRoutes.LICENCE_RETURN_FROM_BL_SOLE_PROPRIETOR_ANONYMOUS
			)}`;
		}

		// make sure the user is not logged in.
		this.authProcessService.logoutBceid(redirectComponentRoute);
		this.authProcessService.logoutBcsc(redirectComponentRoute);

		if (currentPath.includes(PersonalLicenceApplicationRoutes.LICENCE_RETURN_FROM_BL_SOLE_PROPRIETOR_ANONYMOUS)) {
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
