import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/app-routing.module';
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
			this.router.navigate([AppRoutes.LANDING]);
			return;
		}
	}
}
