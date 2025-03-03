import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { DogTrainerApplicationService } from '@app/core/services/dog-trainer-application.service';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { RetiredDogApplicationService } from '@app/core/services/retired-dog-application.service';
import { GuideDogServiceDogRoutes } from '@app/modules/guide-dog-service-dog/guide-dog-service-dog-routes';
import { take, tap } from 'rxjs';

@Component({
	selector: 'app-gdsd-landing',
	template: `
		<div class="container px-0 my-0 px-md-2 my-md-3">
			<app-step-section title="Log in to manage your guide dog and service dog certifications">
				<div class="row">
					<div class="col-xxl-10 col-xl-12 col-lg-12 mx-auto">
						<div class="row">
							<div class="col-lg-8 col-md-10 col-sm-12 mx-auto">
								<div class="fw-bold mb-3">Use your BC Services Card account:</div>
								<table>
									<tr>
										<td><mat-icon class="icon me-2">circle</mat-icon></td>
										<td class="pb-2">Manage your licence with ease online</td>
									</tr>
									<tr>
										<td><mat-icon class="icon me-2">circle</mat-icon></td>
										<td class="pb-2">Verify your identity securely online</td>
									</tr>
									<tr>
										<td><mat-icon class="icon me-2">circle</mat-icon></td>
										<td class="pb-2">Save your application and return to finish it at your convenience</td>
									</tr>
									<tr>
										<td><mat-icon class="icon me-2">circle</mat-icon></td>
										<td class="pb-2">Track the progress of your application</td>
									</tr>
								</table>
								<div class="mt-3">
									<a
										class="large login-link"
										aria-label="Register for a BC Services Card"
										[href]="setupAccountUrl"
										target="_blank"
									>
										Learn how to set up a BC Services Card account
									</a>
								</div>
							</div>
						</div>

						<div class="login-selection-container my-4 my-lg-5">
							<div class="row m-3">
								<div class="col-xl-3 col-lg-4 col-md-12 col-12">
									<img class="image" src="./assets/guide-dog.svg" alt="Guide Dog and Service Dog Team Certification" />
								</div>

								<div class="col-xl-6 col-lg-4 col-md-12 col-12">
									<div class="d-flex justify-content-start py-2">
										<div class="text-start"><strong>Guide Dog and Service Dog Team</strong> Certification:</div>
									</div>

									<button
										mat-flat-button
										color="primary"
										class="xlarge mt-3"
										aria-label="Log in with your BC Services Card and manage certifications"
										(click)="onRegisterGuideDog()"
									>
										Log In with <span class="fw-bold">BC Services Card</span>
									</button>
								</div>

								<div class="col-xl-3 col-lg-4 col-md-12 col-12">
									<div class="pb-0 pb-lg-3">&nbsp;</div>
									<div class="mt-0 mt-lg-4">
										<a
											tabindex="0"
											class="large login-link"
											aria-label="Continue without a BC Services Card and manage certifications"
											(click)="onContinue(serviceTypes.GdsdTeamCertification)"
											(keydown)="onKeydownContinue($event, serviceTypes.GdsdTeamCertification)"
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
									<img class="image" src="./assets/retired-service-dog.svg" alt="Retired Dog Certification" />
								</div>

								<div class="col-xl-6 col-lg-4 col-md-12 col-12">
									<div class="d-flex justify-content-start py-2">
										<div class="text-start"><strong>Retired Dog</strong> Certification:</div>
									</div>

									<button
										mat-flat-button
										color="primary"
										class="xlarge mt-3"
										aria-label="Log in with your BC Services Card and manage certifications"
										(click)="onRegisterRetiredServiceDog()"
									>
										Log In with <span class="fw-bold">BC Services Card</span>
									</button>
								</div>

								<div class="col-xl-3 col-lg-4 col-md-12 col-12">
									<div class="pb-0 pb-lg-3">&nbsp;</div>
									<div class="mt-0 mt-lg-4">
										<a
											tabindex="0"
											class="large login-link"
											aria-label="Continue without a BC Services Card and manage certifications"
											(click)="onContinue(serviceTypes.RetiredServiceDogCertification)"
											(keydown)="onKeydownContinue($event, serviceTypes.RetiredServiceDogCertification)"
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
									<div class="d-flex justify-content-start py-2 mb-3">
										<div class="text-start"><strong>Dog Trainer</strong> Certification:</div>
									</div>

									<a
										tabindex="0"
										class="large login-link"
										aria-label="Continue without a BC Services Card and manage certifications"
										(click)="onContinue(serviceTypes.DogTrainerCertification)"
										(keydown)="onKeydownContinue($event, serviceTypes.DogTrainerCertification)"
									>
										Continue without a BC Services Card
									</a>
								</div>

								<div class="col-xl-3 col-lg-4 col-md-12 col-12">&nbsp;</div>
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
export class GdsdLandingComponent implements OnInit {
	bceidGettingStartedUrl = SPD_CONSTANTS.urls.bceidGettingStartedUrl;
	setupAccountUrl = SPD_CONSTANTS.urls.setupAccountUrl;
	serviceTypes = ServiceTypeCode;

	constructor(
		private router: Router,
		private authProcessService: AuthProcessService,
		private gdsdTeamApplicationService: GdsdTeamApplicationService,
		private dogTrainerApplicationService: DogTrainerApplicationService,
		private retiredDogApplicationService: RetiredDogApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		this.commonApplicationService.setGdsdApplicationTitle();
	}

	onRegisterGuideDog(): void {
		this.router.navigateByUrl(GuideDogServiceDogRoutes.pathGdsdMainApplications());
	}

	onRegisterRetiredServiceDog(): void {
		this.router.navigateByUrl(GuideDogServiceDogRoutes.pathGdsdMainApplications());
	}

	onContinue(serviceTypeCode: ServiceTypeCode): void {
		// make sure the user is not logged in.
		this.authProcessService.logoutBceid(GuideDogServiceDogRoutes.path());
		this.authProcessService.logoutBcsc(GuideDogServiceDogRoutes.path());

		switch (serviceTypeCode) {
			case ServiceTypeCode.GdsdTeamCertification: {
				this.gdsdTeamApplicationService
					.createNewGdsdAnonymous(serviceTypeCode)
					.pipe(
						tap((_resp: any) => {
							this.router.navigateByUrl(
								GuideDogServiceDogRoutes.pathGdsdAnonymous(
									GuideDogServiceDogRoutes.GDSD_TEAM_APPLICATION_TYPE_ANONYMOUS
								)
							);
						}),
						take(1)
					)
					.subscribe();
				break;
			}
			case ServiceTypeCode.RetiredServiceDogCertification: {
				this.retiredDogApplicationService
					.createNewAnonymous(serviceTypeCode)
					.pipe(
						tap((_resp: any) => {
							this.router.navigateByUrl(
								GuideDogServiceDogRoutes.pathGdsdAnonymous(
									GuideDogServiceDogRoutes.RETIRED_DOG_APPLICATION_TYPE_ANONYMOUS
								)
							);
						}),
						take(1)
					)
					.subscribe();
				break;
			}
			case ServiceTypeCode.DogTrainerCertification: {
				this.dogTrainerApplicationService
					.createNewAnonymous(serviceTypeCode)
					.pipe(
						tap((_resp: any) => {
							this.router.navigateByUrl(
								GuideDogServiceDogRoutes.pathGdsdAnonymous(
									GuideDogServiceDogRoutes.DOG_TRAINER_APPLICATION_TYPE_ANONYMOUS
								)
							);
						}),
						take(1)
					)
					.subscribe();
				break;
			}
		}
	}

	onKeydownContinue(event: KeyboardEvent, serviceTypeCode: ServiceTypeCode) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onContinue(serviceTypeCode);
	}
}
