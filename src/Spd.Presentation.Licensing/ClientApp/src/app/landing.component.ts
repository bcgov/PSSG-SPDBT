import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BusinessLicenceApplicationRoutes } from '@app/modules/business-licence-application/business-license-application-routes';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routes';
import { take, tap } from 'rxjs';
import { ServiceTypeCode } from './api/models';
import { SPD_CONSTANTS } from './core/constants/constants';
import { AuthProcessService } from './core/services/auth-process.service';
import { CommonApplicationService } from './core/services/common-application.service';
import { ConfigService } from './core/services/config.service';
import { PermitApplicationService } from './core/services/permit-application.service';
import { WorkerApplicationService } from './core/services/worker-application.service';
import { DialogComponent, DialogOptions } from './shared/components/dialog.component';

@Component({
	selector: 'app-landing',
	template: `
		<div class="container px-0 my-0 px-md-2 my-md-3">
			<app-step-section>
				<!-- SPDBT-4559 Temporary Notification Banner on Security Portal -->
				<div class="row mb-3">
					<div class="offset-xxl-2 offset-xl-1 col-xxl-8 col-xl-10 col-lg-12">
						<app-alert type="warning" icon="warning"
							>Security Services is impacted by a BCGEU strike, which may result in delays in the processing of your
							application. We regret any inconvenience this may cause you.</app-alert
						>
					</div>
				</div>

				<app-step-title heading="Log in to manage your security licence or permit"></app-step-title>

				<div class="row">
					<div class="offset-xxl-2 offset-xl-1 col-xxl-8 col-xl-10 col-lg-12">
						<div class="row">
							<div class="col-xl-8 col-lg-8 col-md-10 col-sm-12 mx-auto">
								<div class="fw-bold mb-3">Use your BC Services Card account:</div>
								<table>
									<tr>
										<td><mat-icon class="icon me-2">circle</mat-icon></td>
										<td class="pb-2">Manage and update your licence or permit with ease online</td>
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
								<div class="mt-4">
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

						<div class="login-selection-container my-3 my-lg-5">
							<div class="row m-3">
								<div class="col-lg-6 col-md-12 col-12">
									<div class="d-flex justify-content-start">
										<img class="image" src="./assets/security-worker-licence.png" alt="Security worker licence" />
										<div class="my-auto"><strong>Security Worker</strong> licence:</div>
									</div>

									<button
										mat-flat-button
										color="primary"
										class="xlarge mt-2"
										aria-label="Log In with BC Services Card to manage your security worker licence"
										(click)="onRegisterWithBcServicesCard()"
									>
										Log In with <span class="fw-bold">BC Services Card</span>
									</button>
								</div>

								<div class="col-lg-6 col-md-12 col-12 my-auto">
									<div class="my-3 my-lg-0">
										<a
											tabindex="0"
											class="large login-link"
											aria-label="Continue without BC Services Card to manage your security worker licence"
											(click)="onContinue(serviceTypeCodes.SecurityWorkerLicence)"
											(keydown)="onKeydownContinue($event, serviceTypeCodes.SecurityWorkerLicence)"
										>
											Continue without BC Services Card
										</a>
									</div>
								</div>
							</div>
						</div>

						<div class="login-selection-container mb-4 mb-lg-5">
							<div class="row m-3">
								<div class="col-lg-6 col-md-12 col-12">
									<div class="d-flex justify-content-start">
										<img class="image" src="./assets/security-business-licence.png" alt="Security business licence" />
										<div class="my-auto"><strong>Security Business</strong> licence:</div>
									</div>

									<button
										mat-flat-button
										color="primary"
										class="xlarge mt-2"
										aria-label="Log In with Business BCeID to manage your security business licence"
										(click)="onRegisterWithBceid()"
									>
										Log In with <span class="fw-bold">Business BCeID</span>
									</button>
								</div>

								<div class="col-lg-6 col-md-12 col-12 my-auto">
									<div class="my-3 my-lg-0">
										Don't have Business BCeID?<br />
										<a
											class="large login-link"
											aria-label="Register for Business BCeID"
											[href]="bceidGettingStartedUrl"
											target="_blank"
										>
											Register today
										</a>
									</div>
								</div>
							</div>
						</div>

						<div class="login-selection-container mb-4 mb-lg-5">
							<div class="row m-3">
								<div class="col-lg-6 col-md-12 col-12">
									<div class="d-flex justify-content-start">
										<img class="image" src="./assets/body-armour.png" alt="Body armour" />
										<div class="my-auto"><strong>Body Armour</strong> permit:</div>
									</div>

									<button
										mat-flat-button
										color="primary"
										class="xlarge mt-2"
										aria-label="Log In with BC Services Card to manage your body armour permit"
										(click)="onRegisterWithBcServicesCard()"
									>
										Log In with <span class="fw-bold">BC Services Card</span>
									</button>
								</div>

								<div class="col-lg-6 col-md-12 col-12 my-auto">
									<div class="my-3 my-lg-0">
										@if (isEnableAnonymousPermitFeatures) {
											<a
												tabindex="0"
												class="large login-link"
												aria-label="Continue without BC Services Card to manage your body armour permit"
												(click)="onContinue(serviceTypeCodes.BodyArmourPermit)"
												(keydown)="onKeydownContinue($event, serviceTypeCodes.BodyArmourPermit)"
											>
												Continue without BC Services Card
											</a>
										} @else {
											If you cannot set up a BC Services Card account, please
											<a [href]="aboutSpdUrl" target="_blank">contact us</a>
										}
									</div>
								</div>
							</div>
						</div>

						<div class="login-selection-container mt-4 mt-lg-5 mb-2">
							<div class="row m-3">
								<div class="col-lg-6 col-md-12 col-12">
									<div class="d-flex justify-content-start">
										<img class="image" src="./assets/armoured-vehicle.png" alt="Armoured vehicle" />
										<div class="my-auto"><strong>Armoured Vehicle</strong> permit:</div>
									</div>

									<button
										mat-flat-button
										color="primary"
										class="xlarge mt-2"
										aria-label="Log In with BC Services Card to manage your armoured vehicle permit"
										(click)="onRegisterWithBcServicesCard()"
									>
										Log In with <span class="fw-bold">BC Services Card</span>
									</button>
								</div>

								<div class="col-lg-6 col-md-12 col-12 my-auto">
									<div class="my-3 my-lg-0">
										@if (isEnableAnonymousPermitFeatures) {
											<a
												tabindex="0"
												class="large login-link"
												aria-label="Continue without BC Services Card to manage your armoured vehicle permit"
												(click)="onContinue(serviceTypeCodes.ArmouredVehiclePermit)"
												(keydown)="onKeydownContinue($event, serviceTypeCodes.ArmouredVehiclePermit)"
											>
												Continue without BC Services Card
											</a>
										} @else {
											If you cannot set up a BC Services Card account, please
											<a [href]="aboutSpdUrl" target="_blank">contact us</a>
										}
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
				height: 3em;
			}
		`,
	],
	standalone: false,
})
export class LandingComponent implements OnInit {
	aboutSpdUrl = SPD_CONSTANTS.urls.aboutSpdUrl;
	bceidGettingStartedUrl = SPD_CONSTANTS.urls.bceidGettingStartedUrl;
	setupAccountUrl = SPD_CONSTANTS.urls.setupAccountUrl;
	serviceTypeCodes = ServiceTypeCode;

	isEnableAnonymousPermitFeatures = false;

	constructor(
		private router: Router,
		private dialog: MatDialog,
		private configService: ConfigService,
		private authProcessService: AuthProcessService,
		private workerApplicationService: WorkerApplicationService,
		private permitApplicationService: PermitApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		this.commonApplicationService.setApplicationTitle();

		this.isEnableAnonymousPermitFeatures = this.configService.isEnableAnonymousPermitFeatures();
	}

	async onRegisterWithBceid(): Promise<void> {
		this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessApplications());
	}

	async onRegisterWithBcServicesCard(): Promise<void> {
		this.router.navigateByUrl(PersonalLicenceApplicationRoutes.pathUserApplications());
	}

	onContinue(serviceTypeCode: ServiceTypeCode): void {
		// make sure the user is not logged in.
		this.authProcessService.logoutBceid();
		this.authProcessService.logoutBcsc();

		switch (serviceTypeCode) {
			case ServiceTypeCode.SecurityWorkerLicence: {
				this.workerApplicationService
					.createNewApplAnonymous(serviceTypeCode)
					.pipe(
						tap((_resp: any) => {
							this.router.navigateByUrl(
								PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAnonymous(
									PersonalLicenceApplicationRoutes.LICENCE_APPLICATION_TYPE_ANONYMOUS
								)
							);
						}),
						take(1)
					)
					.subscribe();

				break;
			}
			case ServiceTypeCode.ArmouredVehiclePermit:
			case ServiceTypeCode.BodyArmourPermit: {
				const data: DialogOptions = {
					icon: 'video_call',
					title: 'Pending Video Call',
					message:
						'Somebody from our team will reach out to complete a video call with you to verify your identity before your application can be processed.',
					actionText: 'Continue',
					cancelText: 'Cancel',
				};

				this.dialog
					.open(DialogComponent, { data })
					.afterClosed()
					.subscribe((response: boolean) => {
						if (!response) {
							return;
						}

						this.permitApplicationService
							.createNewPermitAnonymous(serviceTypeCode)
							.pipe(
								tap((_resp: any) => {
									this.router.navigateByUrl(
										PersonalLicenceApplicationRoutes.pathPermitAnonymous(
											PersonalLicenceApplicationRoutes.PERMIT_TYPE_ANONYMOUS
										)
									);
								}),
								take(1)
							)
							.subscribe();
					});

				break;
			}
		}
	}

	onKeydownContinue(event: KeyboardEvent, serviceTypeCode: ServiceTypeCode) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onContinue(serviceTypeCode);
	}
}
