import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RegistrationFormStepComponent } from '../registration.component';

export class RegistrationPathSelectionModel {
	registrationTypeCode: string = '';
}

@Component({
	selector: 'app-registration-path-selection',
	template: `
		<div class="step">
			<div class="title mb-5">Who are you requesting security screenings for?</div>
			<div class="registration-path-selection row">
				<div class="offset-lg-2 col-lg-4 offset-md-1 col-md-5 col-sm-6 mb-3">
					<div
						class="registration-path-selection__box"
						(click)="onDataChange('EMP')"
						[ngClass]="{ 'active-selection': stepData.registrationTypeCode == 'EMP' }"
					>
						<ng-container *ngIf="displayHelp; else employeesHelp">
							<div class="registration-path-selection__box__info">
								<mat-icon class="info-icon" (click)="onViewHelp($event)">help_outline</mat-icon>
							</div>
							<div class="registration-path-selection__box__title  pt-0 pt-sm-5 pb-0 pb-sm-5 mb-5">
								<mat-icon class="registration-path-selection__box__title__icon">groups</mat-icon>
								<div class="mt-3">Employees</div>
							</div>
						</ng-container>
						<ng-template #employeesHelp>
							<div class="registration-path-selection__box__info">
								<mat-icon class="info-icon" (click)="onViewHelp($event)">close</mat-icon>
							</div>
							<div class="registration-path-selection__box__help-wrapper pb-2 px-2  pb-sm-4 px-sm-4">
								<div class="registration-path-selection__box__help-title">Employees Include...</div>
								<ul>
									<li>Regular employees</li>
									<li>Part-time or auxilliary employees</li>
									<li>Contractors and sub contractors who have agreements with employers</li>
									<li>Registered students completing a practicum component</li>
									<li>Learn more <a target="_blank" href="http://www.google.ca">here</a></li>
								</ul>
							</div>
						</ng-template>
					</div>
				</div>
				<div class="col-lg-4 col-md-5 col-sm-6 mb-3">
					<div
						class="registration-path-selection__box"
						(click)="onDataChange('VOL')"
						[ngClass]="{ 'active-selection': stepData.registrationTypeCode == 'VOL' }"
					>
						<ng-container *ngIf="displayHelp; else volunteersHelp">
							<div class="registration-path-selection__box__info">
								<mat-icon class="info-icon" (click)="onViewHelp($event)">help_outline</mat-icon>
							</div>
							<div class="registration-path-selection__box__title  pt-0 pt-sm-5 pb-0 pb-sm-5 mb-5">
								<mat-icon class="registration-path-selection__box__title__icon">diversity_3</mat-icon>
								<div class="mt-3">Volunteers</div>
							</div>
						</ng-container>
						<ng-template #volunteersHelp>
							<div class="registration-path-selection__box__info">
								<mat-icon class="info-icon" (click)="onViewHelp($event)">close</mat-icon>
							</div>
							<div class="registration-path-selection__box__help-wrapper pb-2 px-2  pb-sm-4 px-sm-4">
								<div class="registration-path-selection__box__help-title mb-2">Volunteers Include...</div>
								<ul>
									<li>Volunteers provide services to registered specified organizations as defined by the CRRA</li>
									<li>Must work with or have potential access to children and/or vulnerable adults</li>
									<li>Cannot receive money for their time</li>
									<li>Learn more <a target="_blank" href="http://www.google.ca">here</a></li>
								</ul>
							</div>
						</ng-template>
					</div>
				</div>
			</div>
		</div>
	`,
	styles: [
		`
			mat-icon {
				color: gray;
			}

			.registration-path-selection {
				cursor: pointer;

				&__box {
					height: 100%;
					border-radius: 4px;
					border: 1px solid grey;
					box-shadow: 0 3px 1px -2px #0003, 0 2px 2px #00000024, 0 1px 5px #0000001f;

					&__info {
						padding: 4px;
						display: grid;
						justify-content: end;
					}

					&__title {
						font-size: 1.3em;
						font-weight: 500;
						text-align: center;

						&__icon {
							color: var(--color-primary);
							font-size: 100px;
							height: 100px;
							width: 100px;
						}
					}

					&__help-wrapper {
						text-align: left;
					}

					&__help-title {
						font-size: 1.3em;
					}
				}

				&__box:hover {
					color: var(--color-primary-light);
					box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px;

					mat-icon {
						color: var(--color-primary-light);
					}
				}
			}
		`,
	],
})
export class RegistrationPathSelectionComponent implements RegistrationFormStepComponent {
	displayHelp = true;

	@Input() stepData!: RegistrationPathSelectionModel;
	@Output() formValidity: EventEmitter<boolean> = new EventEmitter<boolean>();

	onDataChange(_val: string) {
		this.stepData.registrationTypeCode = _val;
		this.formValidity.emit(this.isFormValid());
	}

	onViewHelp(event: any): void {
		this.displayHelp = !this.displayHelp;
		event.stopPropagation();
	}

	getDataToSave(): RegistrationPathSelectionModel {
		return this.stepData;
	}

	isFormValid(): boolean {
		return this.stepData.registrationTypeCode ? true : false;
	}
}
