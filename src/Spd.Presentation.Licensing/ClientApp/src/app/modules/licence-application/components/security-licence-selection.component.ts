import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LicenceApplicationRoutes } from '../licence-application-routing.module';

@Component({
	selector: 'app-security-licence-selection',
	template: `
		<div class="container my-4">
			<div class="row">
				<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 mb-3 mx-auto">
					<app-step-title title="Log in to apply for a new Security Licence"></app-step-title>
					<mat-divider class="mb-4"></mat-divider>

					<div class="step-container">
						<div class="step-container__box step-container__border">
							<div class="step-container__box__title pb-2">
								<div class="mx-2 mt-4">Log in <span class="fw-bold">with</span> Business BCeID or BC Service Card</div>
							</div>
							<div class="step-container__box__content pt-4 pe-4" style="padding-left: 5em!important;">
								<table class="ml-5 mb-5" style="text-align: left;">
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
										Security Business Licence - Log In with Business BCeID
									</span>
								</button>
							</div>
							<div class="step-container__box__footer m-4 mb-2">
								<button mat-flat-button class="large" color="primary" (click)="onRegisterWithBcServicesCard()">
									<span style="vertical-align: text-bottom;">
										Security Worker Licence - Log In with BC Services Card
									</span>
								</button>
							</div>
							<div class="step-container__box__footer m-4">
								<a class="large" (click)="onContinue()"> Don't have Business BCeID? Set up your account today </a>
							</div>
						</div>
						<p class="mt-4">If you don't have a Business BCeID account, you must apply before you can continue.</p>
					</div>
				</div>
			</div>
		</div>
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
					border: 5px solid var(--color-yellow);
					border-top: 50px solid var(--color-yellow);
				}
			}
		`,
	],
})
export class SecurityLicenceSelectionComponent {
	constructor(private router: Router) {}

	onRegisterWithBceid(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.APPLICATIONS));
	}

	onRegisterWithBcServicesCard(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.APPLICATIONS));
	}

	onContinue(): void {}
}
