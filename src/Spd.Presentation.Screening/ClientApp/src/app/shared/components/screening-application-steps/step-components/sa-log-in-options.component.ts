import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PortalTypeCode } from 'src/app/core/code-types/portal-type.model';

@Component({
	selector: 'app-sa-log-in-options',
	template: `
		<div class="step">
			<app-step-title title="What is your preferred log in option?"></app-step-title>
			<div class="step-container row">
				<div class="offset-xl-2 col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-3">
					<div class="step-container__box dark">
						<div class="badge p-2">Preferred Method</div>
						<div class="step-container__box__title pt-3 pb-4">
							<div class="mx-2">Use your <span class="fw-bold">BC Services Card Login</span></div>
						</div>
						<div class="step-container__box__content pt-4 pe-4" style="padding-left: 4em!important;">
							<table class="ml-5 mb-5" style="text-align: left;">
								<tr class="mb-2">
									<td class="pr-2 pb-2">
										<img
											class="step-container__box__title__checkbox"
											src="/assets/checkbox.svg"
											alt="SkSkip the identity confirmation step with your employerip"
										/>
									</td>
									<td>Skip the identity confirmation step with your employer</td>
								</tr>
								<tr>
									<td class="pr-2 pb-2">
										<img class="step-container__box__title__checkbox" src="/assets/checkbox.svg" alt="Apply faster" />
									</td>
									<td>Apply faster</td>
								</tr>
								<tr>
									<td class="pr-2 pb-2">
										<img
											class="step-container__box__title__checkbox"
											src="/assets/checkbox.svg"
											alt="See your application progress in real time"
										/>
									</td>
									<td>See your application progress in real time</td>
								</tr>
							</table>
						</div>
						<div class="step-container__box__footer p-4">
							<button mat-flat-button class="large" (click)="onRegisterWithBcServicesCard()">
								<span style="vertical-align: text-bottom;"> Log In with BC Services Card </span>
							</button>
						</div>
					</div>
				</div>
				<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-3">
					<div class="step-container__box">
						<div style="padding-top: 4px">&nbsp;</div>
						<div class="step-container__box__title pt-3 pb-4">
							<div class="mx-2"><span class="fw-bold">Continue without</span> your BC Services Card Login</div>
						</div>
						<div class="step-container__box__content p-4">
							<p>
								If you don't have a
								<a href="https://id.gov.bc.ca/account/" target="_blank">BC Services Card account</a> you can still
								complete the application.
							</p>
						</div>
						<div class="p-4 step-container__box__footer-no-bcsc">
							<button mat-flat-button color="primary" class="large" (click)="onClickNext()">
								Continue without BC Services Card
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
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

					&__footer-no-bcsc {
						padding-top: 5.7rem !important;
					}
				}
			}
		`,
	],
})
export class SaLogInOptionsComponent {
	portalTypeCodes = PortalTypeCode;
	@Input() portal!: PortalTypeCode;

	@Output() clickNext: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() registerWithBcServicesCard: EventEmitter<boolean> = new EventEmitter<boolean>();

	onClickNext(): void {
		this.clickNext.emit(true);
	}

	onRegisterWithBcServicesCard(): void {
		this.registerWithBcServicesCard.emit(true);
	}
}
