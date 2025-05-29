import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '@app/app.routes';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { RetiredDogApplicationService } from '@app/core/services/retired-dog-application.service';

@Component({
	selector: 'app-gdsd-base-authenticated',
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
export class GdsdBaseAuthenticatedComponent implements OnInit {
	isAuthenticated$ = this.authProcessService.waitUntilAuthentication$;

	constructor(
		private router: Router,
		private authProcessService: AuthProcessService,
		private gdsdTeamApplicationService: GdsdTeamApplicationService,
		private retiredDogApplicationService: RetiredDogApplicationService
	) {}

	async ngOnInit(): Promise<void> {
		console.debug('[GuideDogServiceDogAuthenticatedBaseComponent]', this.gdsdTeamApplicationService.initialized);

		await this.authProcessService.initializeGuideDogServiceDogBCSC();

		if (!this.gdsdTeamApplicationService.initialized && !this.retiredDogApplicationService.initialized) {
			this.router.navigateByUrl(AppRoutes.pathGdsdAuthenticated());
			return;
		}
	}
}
