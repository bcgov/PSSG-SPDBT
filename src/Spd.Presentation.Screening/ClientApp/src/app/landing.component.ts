import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './core/services/authentication.service';
import { CrrpRoutes } from './modules/crrp-application/crrp-routing.module';

@Component({
	selector: 'app-landing',
	template: `
		<section class="step-section col-md-4 col-sm-12 mx-auto mt-4 p-4">
			<h1>Criminal Record Check Portal</h1>
			<p class="lead">Submit and manage criminal record checks for your employees or volunteers</p>

			<mat-divider class="my-4"></mat-divider>

			<p>Select your log in method:</p>

			<button mat-flat-button color="primary" class="large my-2" (click)="onRegisterWithBCeid()">
				Business BCeID Account
			</button>
			<button mat-stroked-button color="primary" class="large my-2" [routerLink]="['/psso-application/']">
				IDIR Account
			</button>
			<p class="mt-4">Need access to the Criminal Records Review Program?</p>
			<button mat-stroked-button class="large w-auto" [routerLink]="['/org-registration/']">Register now</button>
		</section>

		<section class="step-section col-md-3 col-sm-12 mx-auto mt-4 p-4">
			Temp section
			<button mat-flat-button color="primary" class="large my-2" (click)="goToScreening()">
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

	async ngOnInit(): Promise<void> {
		const postLoginRoute = CrrpRoutes.crrpPath(CrrpRoutes.HOME);
		await this.authenticationService.configureOAuthService(window.location.origin + `/${postLoginRoute}`);
	}

	goToScreening(): void {
		this.router.navigateByUrl('/crc-application', { state: { paymentBy: this.paymentBy } });
	}

	async onRegisterWithBCeid(): Promise<void> {
		const isLoggedIn = await this.authenticationService.login(null);
		console.debug('[LandingComponent.onRegisterWithBCeid] isLoggedIn', isLoggedIn);
		if (isLoggedIn) {
			const postLoginRoute = CrrpRoutes.crrpPath(CrrpRoutes.HOME);
			this.router.navigateByUrl(postLoginRoute);
		}
	}
}
