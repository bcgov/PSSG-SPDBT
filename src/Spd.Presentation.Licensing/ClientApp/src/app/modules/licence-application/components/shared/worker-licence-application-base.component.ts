import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { AuthenticationService } from '@app/core/services/authentication.service';

@Component({
	selector: 'app-worker-licence-application-base',
	template: ` <router-outlet></router-outlet> `,
	styles: [],
})
export class WorkerLicenceApplicationBaseComponent implements OnInit {
	constructor(
		private router: Router,
		private licenceApplicationService: LicenceApplicationService,
		private authenticationService: AuthenticationService
	) {}

	ngOnInit(): void {
		if (!this.licenceApplicationService.initialized) {
			if (this.authenticationService.isLoggedIn()) {
				this.router.navigateByUrl(LicenceApplicationRoutes.pathUserApplications());
			} else {
				this.router.navigateByUrl(LicenceApplicationRoutes.pathSecurityWorkerLicenceAnonymous());
			}
		}
	}
}
