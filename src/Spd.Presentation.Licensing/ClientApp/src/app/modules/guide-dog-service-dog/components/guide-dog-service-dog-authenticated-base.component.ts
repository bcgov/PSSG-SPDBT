import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';
import { GuideDogServiceDogRoutes } from '../guide-dog-service-dog-routes';

@Component({
	selector: 'app-guide-dog-service-dog-authenticated-base',
	template: `
		<div class="container px-0 my-0 px-md-2 my-md-3" *ngIf="isAuthenticated$ | async">
			<!-- hide padding/margin on smaller screens -->
			<div class="row">
				<div class="col-12">
					<router-outlet></router-outlet>
				</div>
			</div>
		</div>
	`,
	styles: ``,
	standalone: false,
})
export class GuideDogServiceDogAuthenticatedBaseComponent implements OnInit {
	isAuthenticated$ = this.authProcessService.waitUntilAuthentication$;

	constructor(
		private router: Router,
		private authProcessService: AuthProcessService,
		private gdsdApplicationService: GdsdApplicationService
	) {}

	async ngOnInit(): Promise<void> {
		console.debug('[GuideDogServiceDogAuthenticatedBaseComponent]', this.gdsdApplicationService.initialized);

		const currentPath = location.pathname;

		// to handle relative urls, look for '/personal-licence/' to get the default route
		const startOfRoute = currentPath.indexOf('/' + GuideDogServiceDogRoutes.MODULE_PATH + '/');
		const redirectComponentRoute = currentPath.substring(startOfRoute);

		this.authProcessService.logoutBceid(redirectComponentRoute);

		await this.authProcessService.initializeGuideDogServiceDogBCSC();

		if (!this.gdsdApplicationService.initialized) {
			this.router.navigateByUrl(GuideDogServiceDogRoutes.pathGdsdAuthenticated());
			return;
		}
	}
}
