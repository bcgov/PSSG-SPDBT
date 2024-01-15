import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';

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
								<div class="fw-bold my-3">Benefits of logging in with your BC Service Card:</div>
								<table>
									<tr>
										<td>
											<mat-icon class="icon me-2">radio_button_checked</mat-icon>
										</td>
										<td class="py-2">Save your application</td>
									</tr>
									<tr>
										<td>
											<mat-icon class="icon me-2">radio_button_checked</mat-icon>
										</td>
										<td class="py-2">See the progress of your application</td>
									</tr>
									<tr>
										<td>
											<mat-icon class="icon me-2">radio_button_checked</mat-icon>
										</td>
										<td class="py-2">Manage your licence renewal and updates</td>
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
										<img class="image" src="/assets/security-worker-licence.png" alt="Security worker licence" />
										<div class="my-auto"><strong>Security Worker</strong> licence:</div>
									</div>

									<button mat-flat-button color="primary" class="large mt-2" (click)="onRegisterWithBcServicesCard()">
										Log In with <span class="fw-bold">BC Services Card</span>
									</button>
								</div>

								<div class="col-lg-6 col-md-12 col-12 my-auto">
									<div class="my-3 my-lg-0">
										<a
											tabindex="0"
											class="large login-link"
											(click)="onContinue()"
											(keydown)="onKeydownContinue($event)"
										>
											Continue without a BC Services Card
										</a>
									</div>
								</div>
							</div>
						</div>

						<div class="login-selection-container my-4 my-lg-5">
							<div class="row m-3">
								<div class="col-lg-6 col-md-12 col-12">
									<div class="d-flex justify-content-start">
										<img class="image" src="/assets/security-business-licence.png" alt="Security business licence" />
										<div class="my-auto"><strong>Security Business</strong> licence:</div>
									</div>

									<button mat-flat-button color="primary" class="large mt-2" (click)="onRegisterWithBceid()">
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

						<div class="login-selection-container my-4 my-lg-5">
							<div class="row m-3">
								<div class="col-lg-6 col-md-12 col-12">
									<div class="d-flex justify-content-start">
										<img class="image" src="/assets/body-armour.png" alt="Body armour" />
										<div class="my-auto"><strong>Body Armour</strong> permit:</div>
									</div>

									<button mat-flat-button color="primary" class="large mt-2" (click)="onRegisterWithBcServicesCard()">
										Log In with <span class="fw-bold">BC Services Card</span>
									</button>
								</div>

								<div class="col-lg-6 col-md-12 col-12 my-auto">
									<div class="my-3 my-lg-0">
										<a
											tabindex="0"
											class="large login-link"
											(click)="onContinue()"
											(keydown)="onKeydownContinue($event)"
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
										<img class="image" src="/assets/armoured-vehicle.png" alt="Armoured vehicle" />
										<div class="my-auto"><strong>Armoured Vehicle</strong> permit:</div>
									</div>

									<button mat-flat-button color="primary" class="large mt-2" (click)="onRegisterWithBcServicesCard()">
										Log In with <span class="fw-bold">BC Services Card</span>
									</button>
								</div>

								<div class="col-lg-6 col-md-12 col-12 my-auto">
									<div class="my-3 my-lg-0">
										<a
											tabindex="0"
											class="large login-link"
											(click)="onContinue()"
											(keydown)="onKeydownContinue($event)"
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

			.image {
				margin-right: 1rem;
				height: 3em;
			}
		`,
	],
})
export class LoginSelectionComponent {
	setupAccountUrl = SPD_CONSTANTS.urls.setupAccountUrl;

	constructor(private router: Router) {}

	async onRegisterWithBceid(): Promise<void> {
		// this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.USER_APPLICATIONS_BCEID));
	}

	async onRegisterWithBcServicesCard(): Promise<void> {
		this.router.navigateByUrl(LicenceApplicationRoutes.pathUserApplications());
	}

	onContinue(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.pathSecurityWorkerLicenceAnonymous());
	}

	onKeydownContinue(event: KeyboardEvent) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onContinue();
	}
}
