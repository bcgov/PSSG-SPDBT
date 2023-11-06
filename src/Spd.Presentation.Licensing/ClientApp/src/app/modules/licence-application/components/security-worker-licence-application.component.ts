import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LicenceApplicationRoutes } from '../licence-application-routing.module';
import { LicenceApplicationService } from '../licence-application.service';

@Component({
	selector: 'app-security-worker-licence-application',
	template: ` <router-outlet></router-outlet> `,
	styles: [],
})
export class SecurityWorkerLicenceApplicationComponent {
	constructor(private router: Router, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		if (!this.licenceApplicationService.initialized) {
			this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.USER_APPLICATIONS_BCSC));
			return;
		}
	}
}
