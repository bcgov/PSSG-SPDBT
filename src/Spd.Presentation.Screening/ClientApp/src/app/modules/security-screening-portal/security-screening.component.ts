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
		const currentPath = location.pathname;
		// to handle relative urls, look for '/security-screening/' to get the default route
		const startOfRoute = currentPath.indexOf('/' + SecurityScreeningRoutes.MODULE_PATH + '/');
		const defaultRoute = currentPath.substring(startOfRoute);

		console.debug('currentPath', currentPath, 'defaultRoute', defaultRoute);

		const nextRoute = await this.authProcessService.initializeSecurityScreening(defaultRoute);

		if (nextRoute) {
			await this.router.navigate([nextRoute]);
		}
	}
}
