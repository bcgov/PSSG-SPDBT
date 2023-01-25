import { Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'app-registration-options',
	template: `
		<div class="step">
			<div class="title mb-5">Please select your preferred log in option:</div>
			<div class="registration-option row">
				<div class="offset-xl-2 col-xl-5 col-lg-6 col-md-12 col-sm-12 mb-3">
					<div class="registration-option__box active-selection">
						<div matBadge="1" class="badge p-2">Preferred Method</div>
						<div class="registration-option__box__title pt-3 pb-0">
							<div>Register with Business BCeID</div>
							<img class="registration-option__box__title__icon mt-2" matPrefix src="/assets/BCeID_Card.svg" />
						</div>
						<div class="registration-option__box__content pt-4 px-4">
							<table class="mb-5">
								<tr>
									<td class="pr-2 pb-2">
										<img class="registration-option__box__title__checkbox" matPrefix src="/assets/checkbox.svg" />
									</td>
									<td>Full access to the portal</td>
								</tr>
								<tr>
									<td class="pr-2 pb-2">
										<img class="registration-option__box__title__checkbox" matPrefix src="/assets/checkbox.svg" />
									</td>
									<td>Record keeping of all screen checks</td>
								</tr>
								<tr>
									<td class="pr-2 pb-2">
										<img class="registration-option__box__title__checkbox" matPrefix src="/assets/checkbox.svg" />
									</td>
									<td>Grant access for other employees</td>
								</tr>
							</table>
						</div>
						<div class="registration-option__box__footer p-4">
							<button mat-raised-button>Register with BCeID</button>
						</div>
					</div>
				</div>
				<div class="col-xl-5 col-lg-6 col-md-12 col-sm-12 mb-3">
					<div class="registration-option__box">
						<div style="padding-top: 4px">&nbsp;</div>
						<div class="registration-option__box__title pt-3 pb-0">
							<div>Register with BC Services Card</div>
							<img class="registration-option__box__title__icon mt-2" matPrefix src="/assets/BCSC_Card.svg" />
						</div>
						<div class="registration-option__box__content p-4">
							You can still register your organization, but you will have limited access to the organization portal upon
							approval. We recommend registering with your Business BCeID for easier access.
						</div>
						<div class="registration-option__box__footer p-4">
							<button mat-raised-button color="primary">Register with BCSC</button>
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
				left: 10px;
			}

			.registration-option {
				&__box {
					height: 100%;
					border-radius: 4px;
					border: 1px solid grey;
					box-shadow: 0 3px 1px -2px #0003, 0 2px 2px #00000024, 0 1px 5px #0000001f;

					&__title {
						font-size: 1.1em;
						font-weight: 500;
						text-align: center;

						&__icon {
							max-width: 8em;
						}

						&__checkbox {
							max-width: 1.5em;
						}
					}
				}

				&__box:hover {
					color: var(--color-primary-light);
					box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

					mat-icon {
						color: var(--color-primary-light);
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
