/* eslint-disable @angular-eslint/template/click-events-have-key-events */
/* eslint-disable @angular-eslint/template/click-events-have-key-events */
import { Component, EventEmitter, Output } from '@angular/core';
import { RegistrationTypeCode } from 'src/app/api/models';
import { RegistrationFormStepComponent } from '../org-registration.component';

export class RegistrationPathSelectionModel {
	registrationTypeCode: RegistrationTypeCode | null = null;
}

@Component({
	selector: 'app-registration-path-selection',
	template: `
		<section class="step-section p-4">
			<div class="step">
				<app-step-title title="Who are you requesting criminal record checks for?"></app-step-title>
				<div class="step-container row">
					<div class="offset-xl-3 col-xl-3 offset-lg-2 col-lg-4 offset-md-1 col-md-5 col-sm-6 mb-3">
						<div
							tabindex="0"
							class="step-container__box"
							(click)="onDataChange(registrationTypeCodes.Employee)"
							(keydown)="onKeyDown($event, registrationTypeCodes.Employee)"
							[ngClass]="{ 'active-selection-main': registrationTypeCode === registrationTypeCodes.Employee }"
						>
							<ng-container *ngIf="displayHelp; else employeesHelp">
								<div class="step-container__box__info">
									<mat-icon
										class="main-icon"
										tabindex="0"
										(click)="onViewHelp($event)"
										(keydown)="onKeyDownViewHelp($event)"
										>help_outline</mat-icon
									>
								</div>
								<div class="step-container__box__title  pt-0 pt-sm-5 pb-0 pb-sm-5 mb-5">
									<mat-icon class="step-container__box__title__icon">groups</mat-icon>
									<div class="mt-3">Employees</div>
								</div>
							</ng-container>
							<ng-template #employeesHelp>
								<div class="step-container__box__info">
									<mat-icon
										class="main-icon"
										tabindex="0"
										(click)="onViewHelp($event)"
										(keydown)="onKeyDownViewHelp($event)"
										>close</mat-icon
									>
								</div>
								<div class="step-container__box__help-wrapper pb-2 px-2  pb-sm-4 px-sm-4">
									<div class="step-container__box__help-title mb-2">Employees Include...</div>
									<ul>
										<li>Regular employees</li>
										<li>Part-time or auxilliary employees</li>
										<li>Contractors and sub contractors who have agreements with your organization</li>
										<li>Registered students completing a practicum component</li>
									</ul>
									<p>
										Learn more about
										<a
											href="https://www2.gov.bc.ca/gov/content/safety/crime-prevention/criminal-record-check"
											target="_blank"
											>who is</a
										>
										covered by the Criminal Records Review Act
									</p>
								</div>
							</ng-template>
						</div>
					</div>
					<div class="col-xl-3 col-lg-4 col-md-5 col-sm-6 mb-3">
						<div
							tabindex="0"
							class="step-container__box"
							(click)="onDataChange(registrationTypeCodes.Volunteer)"
							(keydown)="onKeyDown($event, registrationTypeCodes.Volunteer)"
							[ngClass]="{ 'active-selection-main': registrationTypeCode === registrationTypeCodes.Volunteer }"
						>
							<ng-container *ngIf="displayHelp; else volunteersHelp">
								<div class="step-container__box__info">
									<mat-icon
										class="main-icon"
										tabindex="0"
										(click)="onViewHelp($event)"
										(keydown)="onKeyDownViewHelp($event)"
										>help_outline</mat-icon
									>
								</div>
								<div class="step-container__box__title  pt-0 pt-sm-5 pb-0 pb-sm-5 mb-5">
									<mat-icon class="step-container__box__title__icon">diversity_3</mat-icon>
									<div class="mt-3">Volunteers</div>
								</div>
							</ng-container>
							<ng-template #volunteersHelp>
								<div class="step-container__box__info">
									<mat-icon
										class="main-icon"
										tabindex="0"
										(click)="onViewHelp($event)"
										(keydown)="onKeyDownViewHelp($event)"
										>close</mat-icon
									>
								</div>
								<div class="step-container__box__help-wrapper pb-2 px-2  pb-sm-4 px-sm-4">
									<div class="step-container__box__help-title mb-2">Volunteers Include...</div>
									<ul>
										<li>Volunteers provide services to registered specified organizations as defined by the CRRA</li>
									</ul>
									<p>
										Learn more about
										<a
											href="https://www2.gov.bc.ca/gov/content/safety/crime-prevention/criminal-record-check"
											target="_blank"
											>who is</a
										>
										covered by the Criminal Records Review Act
									</p>
								</div>
							</ng-template>
						</div>
					</div>
					<mat-error class="mat-option-error" style="text-align: center;" *ngIf="isDirtyAndInvalid"
						>An option must be selected</mat-error
					>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.main-icon {
				color: var(--color-grey-light);
				font-size: 30px !important;
				height: 30px !important;
				width: 30px !important;
			}
		`,
	],
})
export class RegistrationPathSelectionComponent implements RegistrationFormStepComponent {
	registrationTypeCode: RegistrationTypeCode | null = null;
	isDirtyAndInvalid = false;
	displayHelp = true;

	registrationTypeCodes = RegistrationTypeCode;

	@Output() clearData: EventEmitter<boolean> = new EventEmitter<boolean>();

	onDataChange(_val: RegistrationTypeCode) {
		if (this.registrationTypeCode) {
			this.clearData.emit(true);
		}

		this.registrationTypeCode = _val;
		const isValid = this.isFormValid();
		this.isDirtyAndInvalid = !isValid;
	}

	onKeyDown(event: KeyboardEvent, _val: RegistrationTypeCode) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onDataChange(_val);
	}

	onViewHelp(event: any): void {
		this.displayHelp = !this.displayHelp;
		event.stopPropagation();
	}

	onKeyDownViewHelp(event: KeyboardEvent) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onViewHelp(event);
	}

	getDataToSave(): RegistrationPathSelectionModel {
		return { registrationTypeCode: this.registrationTypeCode };
	}

	isFormValid(): boolean {
		const isValid = !!this.registrationTypeCode;
		this.isDirtyAndInvalid = !isValid;
		return isValid;
	}

	clearCurrentData(): void {
		// do not clear data from this component
	}
}
