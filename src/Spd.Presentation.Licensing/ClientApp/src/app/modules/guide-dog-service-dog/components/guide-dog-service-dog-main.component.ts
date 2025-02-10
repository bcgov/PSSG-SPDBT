import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';
import { take, tap } from 'rxjs';
import { GuideDogServiceDogRoutes } from '../guide-dog-service-dog-routes';

@Component({
	selector: 'app-guide-dog-service-dog-main',
	template: `
		<section class="step-section">
			<div class="row">
				<div class="col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-12">
							<h2 class="fs-3">Guide Dog & Service Dog Certifications</h2>
						</div>
					</div>

					<mat-divider class="mat-divider-main mb-3"></mat-divider>
					<!-- <app-gdsd-active-certifications></app-gdsd-active-certifications> -->

					<div class="summary-card-section mt-4 mb-3 px-4 py-3">
						<div class="row">
							<div class="col-xl-6 col-lg-6">
								<div class="text-data">You don't have an active guide dogs/service dogs team certification.</div>
							</div>
							<div class="col-xl-6 col-lg-6 text-end">
								<button
									mat-flat-button
									color="primary"
									class="large mt-2 mt-lg-0"
									(click)="onNewGuideDogServiceDogTeam()"
								>
									<mat-icon>add</mat-icon>Apply for a New GDSD Team Certification
								</button>
							</div>
						</div>
					</div>

					<div class="summary-card-section mt-4 mb-3 px-4 py-3">
						<div class="row">
							<div class="col-xl-6 col-lg-6">
								<div class="text-data">You don't have an active retired service dog certification.</div>
							</div>
							<div class="col-xl-6 col-lg-6 text-end">
								<button mat-flat-button color="primary" class="large mt-2 mt-lg-0" (click)="onNewRetiredServiceDog()">
									<mat-icon>add</mat-icon>Apply for a New Retired Service Dog Certification
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
	standalone: false,
})
export class GuideDogServiceDogMainComponent {
	constructor(
		private router: Router,
		private gdsdApplicationService: GdsdApplicationService
	) {}

	onNewGuideDogServiceDogTeam(): void {
		this.gdsdApplicationService
			.createNewLicenceAuthenticated()
			.pipe(
				tap((_resp: any) => {
					// this.router.navigateByUrl(
					// 	GuideDogServiceDogRoutes.pathGdsdAuthenticated(GuideDogServiceDogRoutes.GUIDE_DOG_SERVICE_DOG),
					// 	{ state: { applicationTypeCode: ApplicationTypeCode.New } }
					// );
					this.router.navigateByUrl(
						GuideDogServiceDogRoutes.pathGdsdAuthenticated(GuideDogServiceDogRoutes.GDSD_APPLICATION_NEW_AUTHENTICATED)
					);
				}),
				take(1)
			)
			.subscribe();
	}

	onNewRetiredServiceDog(): void {
		this.router.navigateByUrl(
			GuideDogServiceDogRoutes.pathGdsdAnonymous(GuideDogServiceDogRoutes.GDSD_APPLICATION_TYPE_ANONYMOUS)
		);
	}
}
