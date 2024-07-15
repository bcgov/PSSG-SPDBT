import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { WorkerLicenceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { take, tap } from 'rxjs';
import { CommonApplicationService } from '../../services/common-application.service';
import { LicenceApplicationService } from '../../services/licence-application.service';
import { PermitApplicationService } from '../../services/permit-application.service';

@Component({
	selector: 'app-login-selection',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="Log in to manage your security licence or permit"></app-step-title>

				<div class="row">
					<div class="offset-xxl-2 offset-xl-1 col-xxl-8 col-xl-10 col-lg-12">
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
									<a class="large login-link" [href]="setupAccountUrl" target="_blank"> Set up your account today </a>
								</div>
							</div>
						</div>

						<div class="login-selection-container my-4 my-lg-5">
							<div class="row m-3">
								<div class="col-lg-6 col-md-12 col-12">
									<div class="d-flex justify-content-start">
										<img class="image" src="./assets/security-worker-licence.png" alt="Security worker licence" />
										<div class="my-auto"><strong>Security Worker</strong> licence:</div>
									</div>

									<button mat-flat-button color="primary" class="xlarge mt-2" (click)="onRegisterWithBcServicesCard()">
										Log In with <span class="fw-bold">BC Services Card</span>
									</button>
								</div>

								<div class="col-lg-6 col-md-12 col-12 my-auto">
									<div class="my-3 my-lg-0">
										<a
											tabindex="0"
											class="large login-link"
											(click)="onContinue(workerLicenceTypeCodes.SecurityWorkerLicence)"
											(keydown)="onKeydownContinue($event, workerLicenceTypeCodes.SecurityWorkerLicence)"
										>
											Continue without a BC Services Card
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

									<button mat-flat-button color="primary" class="xlarge mt-2" (click)="onRegisterWithBceid()">
										Log In with <span class="fw-bold">Business BCeID</span>
									</button>
								</div>

								<div class="col-lg-6 col-md-12 col-12 my-auto">
									<div class="my-3 my-lg-0">
										Don't have Business BCeID?<br />
										<a
											class="large login-link"
											href="https://www.bceid.ca/register/business/getting_started/getting_started.aspx"
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

									<button mat-flat-button color="primary" class="xlarge mt-2" (click)="onRegisterWithBcServicesCard()">
										Log In with <span class="fw-bold">BC Services Card</span>
									</button>
								</div>

								<div class="col-lg-6 col-md-12 col-12 my-auto">
									<div class="my-3 my-lg-0">
										<a
											tabindex="0"
											class="large login-link"
											(click)="onContinue(workerLicenceTypeCodes.BodyArmourPermit)"
											(keydown)="onKeydownContinue($event, workerLicenceTypeCodes.BodyArmourPermit)"
										>
											Continue without a BC Services Card
										</a>
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

									<button mat-flat-button color="primary" class="xlarge mt-2" (click)="onRegisterWithBcServicesCard()">
										Log In with <span class="fw-bold">BC Services Card</span>
									</button>
								</div>

								<div class="col-lg-6 col-md-12 col-12 my-auto">
									<div class="my-3 my-lg-0">
										<a
											tabindex="0"
											class="large login-link"
											(click)="onContinue(workerLicenceTypeCodes.ArmouredVehiclePermit)"
											(keydown)="onKeydownContinue($event, workerLicenceTypeCodes.ArmouredVehiclePermit)"
										>
											Continue without a BC Services Card
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
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
})
export class LoginSelectionComponent implements OnInit {
	setupAccountUrl = SPD_CONSTANTS.urls.setupAccountUrl;
	workerLicenceTypeCodes = WorkerLicenceTypeCode;

	constructor(
		private router: Router,
		private dialog: MatDialog,
		private authProcessService: AuthProcessService,
		private licenceApplicationService: LicenceApplicationService,
		private permitApplicationService: PermitApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		this.commonApplicationService.setApplicationTitle();
	}

	async onRegisterWithBceid(): Promise<void> {
		this.router.navigateByUrl(LicenceApplicationRoutes.pathBusinessApplications());
	}

	async onRegisterWithBcServicesCard(): Promise<void> {
		this.router.navigateByUrl(LicenceApplicationRoutes.pathUserApplications());
	}

	onContinue(workerLicenceTypeCode: WorkerLicenceTypeCode): void {
		// make sure the user is not logged in.
		this.authProcessService.logoutBceid();
		this.authProcessService.logoutBcsc();

		switch (workerLicenceTypeCode) {
			case WorkerLicenceTypeCode.SecurityWorkerLicence: {
				this.licenceApplicationService
					.createNewLicenceAnonymous(workerLicenceTypeCode)
					.pipe(
						tap((_resp: any) => {
							this.router.navigateByUrl(
								LicenceApplicationRoutes.pathSecurityWorkerLicenceAnonymous(
									LicenceApplicationRoutes.LICENCE_APPLICATION_TYPE_ANONYMOUS
								)
							);
						}),
						take(1)
					)
					.subscribe();

				break;
			}
			case WorkerLicenceTypeCode.ArmouredVehiclePermit:
			case WorkerLicenceTypeCode.BodyArmourPermit: {
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
					.subscribe((_response: boolean) => {
						this.permitApplicationService
							.createNewPermitAnonymous(workerLicenceTypeCode)
							.pipe(
								tap((_resp: any) => {
									this.router.navigateByUrl(
										LicenceApplicationRoutes.pathPermitAnonymous(LicenceApplicationRoutes.PERMIT_TYPE_ANONYMOUS)
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

	onKeydownContinue(event: KeyboardEvent, workerLicenceTypeCode: WorkerLicenceTypeCode) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onContinue(workerLicenceTypeCode);
	}
}
