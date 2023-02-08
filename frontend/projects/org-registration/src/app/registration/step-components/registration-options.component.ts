import { Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'app-registration-options',
	template: `
		<div class="step">
			<div class="title mb-5">Select your preferred log in option:</div>
			<div class="step-container row">
				<div class="offset-xl-2 col-xl-5 col-lg-6 col-md-12 col-sm-12 mb-3">
					<div class="step-container__box dark">
						<div matBadge="1" class="badge p-2">Preferred Method</div>
						<div class="step-container__box__title pt-3 pb-0">
							<div>Register with Business BCeID</div>
							<img class="step-container__box__title__image mt-2" src="/assets/BCeID_Card.svg" />
						</div>
						<div class="step-container__box__content pt-4 px-4" style="padding-left: 6em!important;">
							<table class="ml-5 mb-5" style="text-align: left;">
								<tr>
									<td class="pr-2 pb-2">
										<img class="step-container__box__title__checkbox" src="/assets/checkbox.svg" />
									</td>
									<td>Full access to the portal</td>
								</tr>
								<tr>
									<td class="pr-2 pb-2">
										<img class="step-container__box__title__checkbox" src="/assets/checkbox.svg" />
									</td>
									<td>Record keeping of all screen checks</td>
								</tr>
								<tr>
									<td class="pr-2 pb-2">
										<img class="step-container__box__title__checkbox" src="/assets/checkbox.svg" />
									</td>
									<td>Grant access for other employees</td>
								</tr>
							</table>
						</div>
						<div class="step-container__box__footer p-4">
							<button mat-raised-button (click)="onClickNext()">Register with BCeID</button>
						</div>
					</div>
				</div>
				<div class="col-xl-5 col-lg-6 col-md-12 col-sm-12 mb-3">
					<div class="step-container__box">
						<div style="padding-top: 4px">&nbsp;</div>
						<div class="step-container__box__title pt-3 pb-0">
							<div>Register with BC Services Card</div>
							<img class="step-container__box__title__image mt-2" src="/assets/BCSC_Card.svg" />
						</div>
						<div class="step-container__box__content p-4">
							You can still register your organization, but you will have limited access to the organization portal upon
							approval. We recommend registering with your Business BCeID for easier access.
						</div>
						<div class="step-container__box__footer p-4">
							<button mat-raised-button color="primary" (click)="onClickNext()">Register with BCSC</button>
							<div class="mt-2">
								<a (click)="onClickNext()" style="font-size: small;">Register without authenticating for now</a>
							</div>
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
					background-color: #003366 !important;
				}

				&__box {
					&__title {
						&__image {
							max-width: 8em;
						}

						&__checkbox {
							max-width: 1.5em;
						}
					}
				}
			}
		`,
	],
})
export class RegistrationOptionsComponent {
	@Output() clickNext: EventEmitter<boolean> = new EventEmitter<boolean>();

	onClickNext(): void {
		this.clickNext.emit(true);
	}
}
