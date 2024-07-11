import { Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'app-registration-options',
	template: `
		<section class="step-section p-4">
			<div class="step">
				<app-step-title title="What is your preferred log in option?"></app-step-title>
				<div class="step-container row">
					<div class="offset-xl-2 col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-3">
						<div class="step-container__box dark">
							<div class="badge p-2">Preferred Method</div>
							<div class="step-container__box__title pt-3 pb-4">
								<div class="mx-2">Register <span class="fw-bold">with</span> Business BCeID</div>
								<div class="mx-2">and get full access to online services</div>
							</div>
							<div class="step-container__box__content pt-4 pe-4" style="padding-left: 4em!important;">
								<table class="ml-5 mb-5" style="text-align: left;">
									<tr>
										<td class="pr-2 pb-2">
											<img
												class="step-container__box__title__checkbox"
												src="./assets/checkbox.svg"
												alt="Send out new criminal record check requests"
											/>
										</td>
										<td>Send out new criminal record check requests</td>
									</tr>
									<tr>
										<td class="pr-2 pb-2">
											<img
												class="step-container__box__title__checkbox"
												src="./assets/checkbox.svg"
												alt="See application statuses"
											/>
										</td>
										<td>See application statuses</td>
									</tr>
									<tr>
										<td class="pr-2 pb-2">
											<img
												class="step-container__box__title__checkbox"
												src="./assets/checkbox.svg"
												alt="Grant access to other users in your organization"
											/>
										</td>
										<td>Grant access to other users in your organization</td>
									</tr>
									<tr>
										<td class="pr-2 pb-2">
											<img
												class="step-container__box__title__checkbox"
												src="./assets/checkbox.svg"
												alt="Easily manage expiring criminal record checks"
											/>
										</td>
										<td>Easily manage expiring criminal record checks</td>
									</tr>
								</table>
							</div>
							<div class="step-container__box__footer p-4 pt-0">
								<button mat-flat-button class="large" (click)="onRegisterWithBCeid()">
									<span style="vertical-align: text-bottom;">
										Register with
										<span
											style="font-family:'TimesNewRomanPSMT', 'Times New Roman', sans-serif;font-style:normal;font-size:27px;color:#003366;"
											>BC</span
										><span
											style="font-family:'TimesNewRomanPS-ItalicMT', 'Times New Roman Italic', 'Times New Roman', sans-serif;font-style:italic;font-size:27px;color:#FDB90F;"
											>e</span
										><span
											style="font-family:'TimesNewRomanPSMT', 'Times New Roman', sans-serif;font-style:normal;font-size:27px;color:#003366;"
											>ID</span
										>
									</span>
								</button>
							</div>
						</div>
					</div>
					<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-3">
						<div class="step-container__box">
							<div style="padding-top: 4px">&nbsp;</div>
							<div class="step-container__box__title pt-3 pb-4">
								<div class="mx-2">Register <span class="fw-bold">without</span> Business BCeID</div>
								<div class="mx-2">&nbsp;</div>
							</div>
							<div class="step-container__box__content p-4">
								<p>If you don't have a Business BCeID you can still register without one.</p>
								<p>
									<strong>Important:</strong> By selecting this option, you will not have access to features available
									to registered users.
								</p>
							</div>
							<div class="step-container__box__footer p-4" style="padding-top: 5.7rem!important;">
								<button mat-flat-button color="primary" class="large" (click)="onClickNext()">
									Continue without Business BCeID
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.badge {
				background-color: var(--color-yellow);
				border: 1px solid var(--color-primary);
				font-weight: 500;
				color: black;
				position: relative;
				top: -10px;
			}

			.step-container {
				cursor: initial;

				.dark {
					border: 2px solid #4d7094;
					color: var(--color-white) !important;
					background-color: var(--color-primary) !important;
				}

				&__box {
					&__title {
						&__image {
							max-width: 8em;
						}

						&__checkbox {
							max-width: 1.5em;
							margin-right: 0.5em;
						}
					}
				}
			}
		`,
	],
})
export class RegistrationOptionsComponent {
	@Output() clickNext: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() registerWithBCeid: EventEmitter<boolean> = new EventEmitter<boolean>();

	onClickNext(): void {
		this.clickNext.emit(true);
	}

	onRegisterWithBCeid(): void {
		this.registerWithBCeid.emit(true);
	}
}
