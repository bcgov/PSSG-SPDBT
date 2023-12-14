import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LicenceApplicationRoutes } from './modules/licence-application/licence-application-routing.module';
import { LicenceRoutes } from './modules/licence-portal/licence-routing.module';

@Component({
	selector: 'app-landing',
	template: `
		<section class="step-section col-xxl-4 col-xl-4 col-lg-5 col-md-6 col-sm-12 mx-auto my-4 p-4">
			<button mat-stroked-button color="primary" class="large my-2" (click)="goToLicence()">Licence Portal</button>
		</section>

		<section class="step-section m-4 col-xxl-4 col-xl-4 col-lg-5 col-md-6 col-sm-12 mx-auto">
			<button mat-stroked-button color="primary" class="large my-2" (click)="goToLicenceApplication()">
				Licence Application
			</button>
		</section>
	`,
	styles: [],
})
export class LandingComponent {
	constructor(private router: Router) {}

	goToLicence(): void {
		this.router.navigateByUrl(LicenceRoutes.path(LicenceRoutes.IN_PROGRESS_APPLICATIONS));
	}

	goToLicenceApplication(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.LOGIN_SELECTION));
	}
}
