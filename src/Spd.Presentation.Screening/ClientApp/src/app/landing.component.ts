import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicantRoutes } from './modules/applicant-portal/applicant-routing.module';
import { CrcRoutes } from './modules/crc-portal/crc-routing.module';
import { CrrpRoutes } from './modules/crrp-portal/crrp-routing.module';

@Component({
	selector: 'app-landing',
	template: `
		<section class="step-section col-xxl-4 col-xl-4 col-lg-5 col-md-6 col-sm-12 mx-auto mt-4 p-4">
			<h1>Criminal Record Check Portal</h1>
			<p class="lead">Submit and manage criminal record checks for your employees or volunteers</p>

			<mat-divider class="my-4"></mat-divider>

			<div>Select your log in method:</div>
			<button mat-flat-button color="primary" class="large my-2" (click)="onRegisterWithBCeid()">
				Business BCeID Account
			</button>
			<button mat-stroked-button color="primary" class="large my-2" [routerLink]="['/psso/screening-statuses/']">
				IDIR Account
			</button>
			<p class="mt-4 mb-0">Need access to the Criminal Records Review Program?</p>
			<a [routerLink]="['/org-registration/']"> Register now </a>
		</section>

		<section class="step-section col-xxl-4 col-xl-4 col-lg-5 col-md-6 col-sm-12 mx-auto my-4 p-4">
			Temporary section
			<button mat-stroked-button color="primary" class="large my-2" (click)="goToApplicant()">Applicant Portal</button>

			<button mat-stroked-button color="primary" class="large my-2" (click)="goToScreening()">
				Criminal Record Check Portal
			</button>
		</section>
	`,
	styles: [],
})
export class LandingComponent {
	constructor(private router: Router) {}

	goToScreening(): void {
		this.router.navigateByUrl(CrcRoutes.path(CrcRoutes.MODULE_PATH));
	}

	goToApplicant(): void {
		this.router.navigateByUrl(ApplicantRoutes.path(ApplicantRoutes.CRC_LIST));
	}

	onRegisterWithBCeid(): void {
		this.router.navigateByUrl(CrrpRoutes.crrpPath(CrrpRoutes.HOME));
	}
}
