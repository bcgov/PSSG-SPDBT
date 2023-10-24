import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LicenceApplicationRoutes } from '../licence-application-routing.module';

@Component({
	selector: 'app-login-selection',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<div class="row">
					<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row">
							<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12">
								<div class="login-title fs-4 mt-2 mb-3">
									Log in to manage your<br /><strong>security business licence:</strong>
								</div>

								<div class="step-container">
									<div class="step-container__box step-container__border">
										<div class="step-container__box__title pb-2">
											<div class="mx-2 mt-3">Log in with <span class="fw-bold">Business BCeID</span></div>
										</div>
										<div class="step-container__box__content pe-4" style="padding-left: 5em!important;">
											<table class="me-5 mb-4" style="text-align: left;">
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
										</div>
										<div class="step-container__box__footer m-4 mb-2">
											<button mat-flat-button class="large" color="primary" (click)="onRegisterWithBceid()">
												<span style="vertical-align: text-bottom;">
													Log In with <span class="fw-bold">Business BCeID</span>
												</span>
											</button>
										</div>
										<div class="step-container__box__footer mx-4 my-3">
											Don't have Business BCeID?<br />
											<a
												class="large"
												href="https://www.bceid.ca/register/business/getting_started/getting_started.aspx"
												target="_blank"
											>
												Register today
											</a>
										</div>
									</div>
								</div>
							</div>
							<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12">
								<div class="login-title fs-4  mt-2 mb-3">
									Log in to manage your<br /><strong>security worker licence:</strong>
								</div>

								<div class="step-container">
									<div class="step-container__box step-container__border">
										<div class="step-container__box__title pb-2">
											<div class="mx-2 mt-3">Log in with <span class="fw-bold">BC Service Card</span></div>
										</div>
										<div class="step-container__box__content pe-4" style="padding-left: 5em!important;">
											<table class="me-5 mb-4" style="text-align: left;">
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
										</div>

										<div class="step-container__box__footer m-4 mb-2">
											<button mat-flat-button class="large" color="primary" (click)="onRegisterWithBcServicesCard()">
												<span style="vertical-align: text-bottom;">
													Log In with <span class="fw-bold">BC Services Card</span>
												</span>
											</button>
										</div>
										<div class="step-container__box__footer mx-4 my-3">
											Don't have BC Services Card?<br />
											<a class="large" href="https://id.gov.bc.ca/account/" target="_blank">
												Set up your account today
											</a>
										</div>
									</div>
									<p class="mx-3 mt-3">
										If you don't have a BC Services Card app you can still apply, but you will not have access to
										features available to registered users.
									</p>
									<p class="mx-3 mt-2">
										<a class="fw-bold" (click)="onContinue()"> Continue without a BC Services Card </a>
									</p>
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
			.icon {
				position: relative;
				top: 5px;
			}

			.step-container {
				cursor: initial;

				&__border {
					border: 4px solid var(--color-yellow);
				}
			}

			.login-title {
				line-height: normal;
			}
		`,
	],
})
export class LoginSelectionComponent {
	constructor(private router: Router) {}

	onRegisterWithBceid(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.APPLICATIONS_IN_PROGRESS));
	}

	onRegisterWithBcServicesCard(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.APPLICATIONS_IN_PROGRESS));
	}

	onContinue(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.APPLICATIONS_IN_PROGRESS));
	}
}
