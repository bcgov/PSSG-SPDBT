import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { DogTrainerApplicationService } from '@app/core/services/dog-trainer-application.service';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { GuideDogServiceDogRoutes } from '@app/modules/guide-dog-service-dog/guide-dog-service-dog-routes';

@Component({
	selector: 'app-gdsd-base-anonymous',
	template: `
		<div class="container px-0 my-0 px-md-2 my-md-3">
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
export class GdsdBaseAnonymousComponent implements OnInit {
	constructor(
		private router: Router,
		private authProcessService: AuthProcessService,
		private gdsdTeamApplicationService: GdsdTeamApplicationService,
		private dogTrainerApplicationService: DogTrainerApplicationService
	) {}

	ngOnInit(): void {
		// make sure the user is not logged in.
		this.authProcessService.logoutBceid();
		this.authProcessService.logoutBcsc();

		if (!this.gdsdTeamApplicationService.initialized && !this.dogTrainerApplicationService.initialized) {
			this.router.navigateByUrl(GuideDogServiceDogRoutes.path());
			return;
		}
	}
}
