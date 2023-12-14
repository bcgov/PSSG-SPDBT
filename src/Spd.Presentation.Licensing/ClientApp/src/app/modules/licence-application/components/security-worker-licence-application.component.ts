import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { LicenceApplicationRoutes } from '../licence-application-routing.module';
import { LicenceApplicationService } from '../services/licence-application.service';

@Component({
	selector: 'app-security-worker-licence-application',
	template: ` <router-outlet></router-outlet> `,
	styles: [],
})
export class SecurityWorkerLicenceApplicationComponent implements OnInit {
	constructor(
		private router: Router,
		private licenceApplicationService: LicenceApplicationService,
		private authenticationService: AuthenticationService
	) {}

	ngOnInit(): void {
		console.log('this.licenceApplicationService.initialized', this.licenceApplicationService.initialized);
		if (!this.licenceApplicationService.initialized) {
			if (this.authenticationService.isLoggedIn()) {
				this.router.navigateByUrl(
					LicenceApplicationRoutes.path(LicenceApplicationRoutes.USER_APPLICATIONS_AUTHENTICATED)
				);
			} else {
				this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.USER_APPLICATIONS_ANONYMOUS));
			}
		}
	}
}
