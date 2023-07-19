import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { SecurityScreeningRoutes } from './security-screening-routing.module';

@Component({
	selector: 'app-security-screening',
	template: `
		<div class="container mt-4" *ngIf="isAuthenticated$ | async">
			<section class="step-section p-0 p-lg-4 m-0 m-lg-4">
				<router-outlet></router-outlet>
			</section>
		</div>
	`,
	styles: [],
})
export class SecurityScreeningComponent implements OnInit {
	isAuthenticated$ = this.authProcessService.waitUntilAuthentication$;

	constructor(private authProcessService: AuthProcessService, private router: Router) {}

	async ngOnInit(): Promise<void> {
		const nextRoute = await this.authProcessService.initializeSecurityScreening();

		if (nextRoute) {
			await this.router.navigate([nextRoute]);
		} else {
			this.router.navigate([SecurityScreeningRoutes.path(SecurityScreeningRoutes.LOGIN_FAIL)]);
		}
	}
}
