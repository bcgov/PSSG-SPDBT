import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './core/services/authentication.service';
import { DashboardRoutes } from './modules/dashboard/dashboard-routing.module';

@Component({
	selector: 'app-landing',
	template: `
		<section class="step-section col-3 mx-auto p-4" style="margin-top: 8em;">
			<button mat-raised-button color="primary" class="large mb-2" [routerLink]="['/org-registration/']">
				Organization Registration
			</button>
		</section>

		<section class="step-section col-3 mx-auto mt-4 p-4">
			<button mat-raised-button color="primary" class="large mb-2" (click)="goToScreening()">
				Screening Application
			</button>

			<mat-radio-group [(ngModel)]="paymentBy">
				<mat-radio-button value="APP">
					<strong>Applicant Paying</strong>
				</mat-radio-button>
				<mat-divider class="my-3"></mat-divider>
				<mat-radio-button value="ORG">
					<strong>Organization Paying</strong>
				</mat-radio-button>
			</mat-radio-group>
		</section>

		<section class="step-section col-3 mx-auto mt-4 p-4">
			<button mat-raised-button color="primary" class="large mb-2" (click)="onRegisterWithBCeid()">
				Dashboard BCeid Log In
			</button>
		</section>

		<section class="step-section col-3 mx-auto mt-4 p-4">
			<button mat-raised-button color="primary" class="large mb-2" [routerLink]="['/dashboard/home/']">
				Dashboard - No Log In
			</button>
		</section>
	`,
	styles: [],
})
export class LandingComponent {
	paymentBy: string = 'APP';

	constructor(private router: Router, private authenticationService: AuthenticationService) {}

	async ngOnInit(): Promise<void> {
		const postLoginRoute = DashboardRoutes.dashboardPath(DashboardRoutes.HOME);
		await this.authenticationService.configureOAuthService(window.location.origin + `/${postLoginRoute}`);
	}

	goToScreening(): void {
		this.router.navigateByUrl('/scr-application', { state: { paymentBy: this.paymentBy } });
	}

	async onRegisterWithBCeid(): Promise<void> {
		const isLoggedIn = await this.authenticationService.login(null);
		console.debug('[onRegisterWithBCeid] isLoggedIn', isLoggedIn);
		if (isLoggedIn) {
			const postLoginRoute = DashboardRoutes.dashboardPath(DashboardRoutes.HOME);
			this.router.navigateByUrl(postLoginRoute);
		}
	}
}
