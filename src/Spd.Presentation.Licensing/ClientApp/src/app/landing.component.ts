import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LicenceRoutes } from './modules/licence-portal/licence-routing.module';

@Component({
	selector: 'app-landing',
	template: `
		<!-- <section class="step-section col-xxl-4 col-xl-4 col-lg-5 col-md-6 col-sm-12 mx-auto mt-4 p-4">
			<h1>Criminal Record Check Portal</h1>
			<p class="lead">Submit and manage your organization's criminal record checks</p>

			<mat-divider class="my-4"></mat-divider>

			<div>Log in with:</div>
			<button mat-flat-button color="primary" class="large my-2" (click)="goToCrrp()">Business BCeID Account</button>
			<button mat-stroked-button color="primary" class="large my-2" (click)="goToPsso()">IDIR Account</button>
			<p class="mt-4 mb-0">Need access to the Criminal Records Review Program?</p>
			<a (click)="goToOrgRegistration()"> Register now </a>
		</section> -->

		<section class="step-section col-xxl-4 col-xl-4 col-lg-5 col-md-6 col-sm-12 mx-auto my-4 p-4">
		<button mat-stroked-button color="primary" class="large my-2" (click)="goToLicence()">Licence Portal</button>
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

	// goToSecurityScreening(): void {
	// 	this.router.navigateByUrl(SecurityScreeningRoutes.path(SecurityScreeningRoutes.CRC_LIST));
	// }

	// goToPsso(): void {
	// 	this.router.navigateByUrl(PssoRoutes.path(PssoRoutes.SCREENING_STATUSES));
	// }

	// goToCrrp(): void {
	// 	this.router.navigateByUrl(CrrpRoutes.path(CrrpRoutes.HOME));
	// }

	// goToOrgRegistration(): void {
	// 	this.router.navigateByUrl(OrgRegistrationRoutes.path());
	// }

	goToLicence(): void {
		this.router.navigateByUrl(LicenceRoutes.path(LicenceRoutes.IN_PROGRESS_APPLICATIONS));
	}
}
