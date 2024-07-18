import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrrpRoutes } from './modules/crrp-portal/crrp-routing.module';
import { OrgRegistrationRoutes } from './modules/org-registration-portal/org-registration-routing.module';
import { PssoRoutes } from './modules/psso-portal/psso-routing.module';

@Component({
	selector: 'app-landing',
	template: `
		<section class="step-section col-xxl-4 col-xl-4 col-lg-5 col-md-6 col-sm-12 mx-auto mt-4 p-4">
			<h1>Organization Online Access</h1>
			<p class="mt-4 lead">TESTING Submit and manage criminal record checks for your employees or volunteers</p>

			<mat-divider class="my-4"></mat-divider>

			<div>Select your login method:</div>
			<button mat-flat-button color="primary" class="large my-2" (click)="goToCrrp()">Business BCeID Account</button>
			<button mat-stroked-button color="primary" class="large my-2" (click)="goToPsso()">IDIR Account</button>
			<p class="mt-4 mb-0">Need to register an account with the Criminal Records Review Program?</p>
			<a tabindex="0" (click)="goToOrgRegistration()" (keydown)="onKeyDownOrgRegistration($event)"> Register now </a>
		</section>
	`,
	styles: [
		`
			a {
				color: var(--bs-link-color) !important;
			}
		`,
	],
})
export class LandingComponent {
	constructor(private router: Router) {}

	goToPsso(): void {
		this.router.navigateByUrl(PssoRoutes.path(PssoRoutes.SCREENING_STATUSES));
	}

	goToCrrp(): void {
		this.router.navigateByUrl(CrrpRoutes.path(CrrpRoutes.HOME));
	}

	goToOrgRegistration(): void {
		this.router.navigateByUrl(OrgRegistrationRoutes.path());
	}

	onKeyDownOrgRegistration(event: KeyboardEvent) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.goToOrgRegistration();
	}
}
