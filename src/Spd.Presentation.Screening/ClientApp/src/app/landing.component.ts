import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './core/services/authentication.service';
import { DashboardRoutes } from './modules/dashboard/dashboard-routing.module';

@Component({
	selector: 'app-landing',
	template: `
		<section class="step-section col-md-3 col-sm-12 mx-auto mt-4 p-4">
			<button mat-raised-button color="primary" class="large my-2" [routerLink]="['/org-registration/']">
				Organization Registration
			</button>

			<mat-divider class="my-3"></mat-divider>

			<button mat-raised-button color="primary" class="large my-2" (click)="goToScreening()">
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

			<mat-divider class="my-3"></mat-divider>

			<button mat-raised-button color="primary" class="large my-2" (click)="onRegisterWithBCeid()">CRRP Portal</button>
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
		console.debug('[LandingComponent.onRegisterWithBCeid] isLoggedIn', isLoggedIn);
		if (isLoggedIn) {
			const postLoginRoute = DashboardRoutes.dashboardPath(DashboardRoutes.HOME);
			this.router.navigateByUrl(postLoginRoute);
		}
	}
}
