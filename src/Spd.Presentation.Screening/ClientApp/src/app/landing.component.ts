import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './core/services/authentication.service';
import { CrcApplicationRoutes } from './modules/crc-application/crc-application-routing.module';
import { CrrpRoutes } from './modules/crrp-application/crrp-routing.module';

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

		<section class="step-section col-xxl-4 col-xl-4 col-lg-5 col-md-6 col-sm-12 mx-auto mt-4 p-4">
			Temporary section
			<button mat-stroked-button color="primary" class="large my-2" (click)="goToScreening()">
				Criminal Record Check Application
			</button>

			<mat-radio-group [(ngModel)]="paymentBy">
				<mat-radio-button value="APP">
					<strong>Applicant Paying</strong>
				</mat-radio-button>
				<mat-radio-button value="ORG">
					<strong>Organization Paying</strong>
				</mat-radio-button>
			</mat-radio-group>
		</section>
	`,
	styles: [],
})
export class LandingComponent {
	paymentBy: string = 'APP';

	constructor(private router: Router, private authenticationService: AuthenticationService) {}

	goToScreening(): void {
		this.router.navigateByUrl(`/${CrcApplicationRoutes.MODULE_PATH}`, { state: { paymentBy: this.paymentBy } });
	}

	onRegisterWithBCeid(): void {
		this.router.navigateByUrl(CrrpRoutes.crrpPath(CrrpRoutes.HOME));
	}
}
