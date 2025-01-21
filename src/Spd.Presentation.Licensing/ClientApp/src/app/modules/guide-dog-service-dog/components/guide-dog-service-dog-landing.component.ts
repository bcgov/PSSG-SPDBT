import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { GuideDogServiceDogRoutes } from '../guide-dog-service-dog-routes';

export enum GuideDogTypeCode {
	GuideDog = 'GuideDog',
	DogTrainer = 'DogTrainer',
	RetiredServiceDog = 'RetiredServiceDog',
}

@Component({
	selector: 'app-guide-dog-service-dog-landing',
	template: `
		<div class="container px-0 my-0 px-md-2 my-md-3">
			<app-step-section title="Log in to manage your guide dog and service dog certifications">
				<div class="row">
					<div class="col-xxl-10 col-xl-12 col-lg-12 mx-auto">
						<div class="row">
							<div class="col-lg-8 col-md-10 col-sm-12 mx-auto">
								<div class="fw-bold mb-3">Benefits of logging in with your BC Service Card:</div>
								<table>
									<tr>
										<td>
											<mat-icon class="icon me-2">circle</mat-icon>
										</td>
										<td class="pb-2">Save your application</td>
									</tr>
									<tr>
										<td>
											<mat-icon class="icon me-2">circle</mat-icon>
										</td>
										<td class="pb-2">See the progress of your application</td>
									</tr>
									<tr>
										<td>
											<mat-icon class="icon me-2">circle</mat-icon>
										</td>
										<td class="pb-2">Manage your licence renewal and updates</td>
									</tr>
								</table>
								<div class="mt-3">
									Don't have BC Services Card?
									<a
										class="large login-link"
										aria-label="Navigate to BC Service Card site"
										[href]="setupAccountUrl"
										target="_blank"
									>
										Set up your account today
									</a>
								</div>
							</div>
						</div>

						<div class="login-selection-container my-4 my-lg-5">
							<div class="row m-3">
								<div class="col-xl-3 col-lg-4 col-md-12 col-12">
									<img class="image" src="./assets/guide-dog.svg" alt="Guide Dogs/Service Dogs Team Certification" />
								</div>

								<div class="col-xl-6 col-lg-4 col-md-12 col-12">
									<div class="d-flex justify-content-start py-2">
										<div class="text-start"><strong>Guide Dogs/Service Dogs Team</strong> Certification:</div>
									</div>

									<button mat-flat-button color="primary" class="xlarge mt-3" (click)="onRegisterGuideDog()">
										Log In with <span class="fw-bold">BC Services Card</span>
									</button>
								</div>

								<div class="col-xl-3 col-lg-4 col-md-12 col-12">
									<div class="pb-0 pb-lg-3">&nbsp;</div>
									<div class="mt-0 mt-lg-4">
										<a
											tabindex="0"
											class="large login-link"
											aria-label="Continue without a BC Services Card"
											(click)="onContinue(guideDogTypes.GuideDog)"
											(keydown)="onKeydownContinue($event, guideDogTypes.GuideDog)"
										>
											Continue without a BC Services Card
										</a>
									</div>
								</div>
							</div>
						</div>

						<div class="login-selection-container my-4 my-lg-5">
							<div class="row m-3">
								<div class="col-xl-3 col-lg-4 col-md-12 col-12">
									<img class="image" src="./assets/dog-trainer.svg" alt="Dog Trainer Certification" />
								</div>

								<div class="col-xl-6 col-lg-4 col-md-12 col-12">
									<div class="d-flex justify-content-start py-2">
										<div class="text-start"><strong>Dog Trainer</strong> Certification:</div>
									</div>

									<button mat-flat-button color="primary" class="xlarge mt-3" (click)="onRegisterDogTrainer()">
										Log In with <span class="fw-bold">BC Services Card</span>
									</button>
								</div>

								<div class="col-xl-3 col-lg-4 col-md-12 col-12">
									<div class="pb-0 pb-lg-3">&nbsp;</div>
									<div class="mt-0 mt-lg-4">
										<a
											tabindex="0"
											class="large login-link"
											aria-label="Continue without a BC Services Card"
											(click)="onContinue(guideDogTypes.DogTrainer)"
											(keydown)="onKeydownContinue($event, guideDogTypes.DogTrainer)"
										>
											Continue without a BC Services Card
										</a>
									</div>
								</div>
							</div>
						</div>

						<div class="login-selection-container my-4 my-lg-5">
							<div class="row m-3">
								<div class="col-xl-3 col-lg-4 col-md-12 col-12">
									<img class="image" src="./assets/retired-service-dog.svg" alt="Retired Service Dog Certification" />
								</div>

								<div class="col-xl-6 col-lg-4 col-md-12 col-12">
									<div class="d-flex justify-content-start py-2">
										<div class="text-start"><strong>Retired Service Dog</strong> Certification:</div>
									</div>

									<button mat-flat-button color="primary" class="xlarge mt-3" (click)="onRegisterRetiredServiceDog()">
										Log In with <span class="fw-bold">BC Services Card</span>
									</button>
								</div>

								<div class="col-xl-3 col-lg-4 col-md-12 col-12">
									<div class="pb-0 pb-lg-3">&nbsp;</div>
									<div class="mt-0 mt-lg-4">
										<a
											tabindex="0"
											class="large login-link"
											aria-label="Continue without a BC Services Card"
											(click)="onContinue(guideDogTypes.RetiredServiceDog)"
											(keydown)="onKeydownContinue($event, guideDogTypes.RetiredServiceDog)"
										>
											Continue without a BC Services Card
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</app-step-section>
		</div>
	`,
	styles: [
		`
			.login-link {
				font-weight: bold;
				color: var(--color-primary) !important;
			}

			.icon {
				color: var(--color-yellow) !important;
			}

			.image {
				margin-right: 1rem;
				height: 8em;
			}
		`,
	],
	standalone: false,
})
export class GuideDogServiceDogLandingComponent {
	//implements OnInit
	bceidGettingStartedUrl = SPD_CONSTANTS.urls.bceidGettingStartedUrl;
	setupAccountUrl = SPD_CONSTANTS.urls.setupAccountUrl;
	guideDogTypes = GuideDogTypeCode;

	constructor(
		private router: Router,
		private authProcessService: AuthProcessService,
		// private gdsdApplicationService: GdsdApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	// ngOnInit(): void {
	// this.commonApplicationService.setApplicationTitle();
	// }

	onRegisterGuideDog(): void {
		this.router.navigateByUrl(GuideDogServiceDogRoutes.pathGdsdUserApplications());
	}

	onRegisterDogTrainer(): void {
		this.router.navigateByUrl(GuideDogServiceDogRoutes.pathGdsdUserApplications());
	}

	onRegisterRetiredServiceDog(): void {
		this.router.navigateByUrl(GuideDogServiceDogRoutes.pathGdsdUserApplications());
	}

	onContinue(_guideDogTypeCode: GuideDogTypeCode): void {
		// make sure the user is not logged in.
		this.authProcessService.logoutBceid(GuideDogServiceDogRoutes.path());
		this.authProcessService.logoutBcsc(GuideDogServiceDogRoutes.path());

		this.router.navigateByUrl(
			GuideDogServiceDogRoutes.pathGdsdAnonymous(GuideDogServiceDogRoutes.GDSD_APPLICATION_TYPE_ANONYMOUS)
		);
		// this.gdsdApplicationService
		// 	.createNewLicenceAnonymous(guideDogTypeCode)
		// 	.pipe(
		// 		tap((_resp: any) => {
		// 			this.router.navigateByUrl(
		// 				GuideDogServiceDogRoutes.pathSecurityWorkerLicenceAnonymous(
		// 					GuideDogServiceDogRoutes.LICENCE_APPLICATION_TYPE_ANONYMOUS
		// 				)
		// 			);
		// 		}),
		// 		take(1)
		// 	)
		// 	.subscribe();
	}

	onKeydownContinue(event: KeyboardEvent, guideDogTypeCode: GuideDogTypeCode) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onContinue(guideDogTypeCode);
	}
}
