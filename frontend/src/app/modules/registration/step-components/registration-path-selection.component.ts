import { Component, EventEmitter, Output } from '@angular/core';
import { RegistrationFormStepComponent } from '../registration.component';

export class RegistrationPathSelectionModel {
	registrationTypeCode: string = '';
}

@Component({
	selector: 'app-registration-path-selection',
	template: `
		<div class="step">
			<div class="title mb-5">Who are you requesting security screenings for?</div>
			<div class="step-container row">
				<div class="offset-lg-2 col-lg-4 offset-md-1 col-md-5 col-sm-6 mb-3">
					<div
						class="step-container__box"
						(click)="onDataChange('EMP')"
						[ngClass]="{ 'active-selection': registrationTypeCode == 'EMP' }"
					>
						<ng-container *ngIf="displayHelp; else employeesHelp">
							<div class="step-container__box__info">
								<mat-icon class="info-icon" (click)="onViewHelp($event)">help_outline</mat-icon>
							</div>
							<div class="step-container__box__title  pt-0 pt-sm-5 pb-0 pb-sm-5 mb-5">
								<mat-icon class="step-container__box__title__icon">groups</mat-icon>
								<div class="mt-3">Employees</div>
							</div>
						</ng-container>
						<ng-template #employeesHelp>
							<div class="step-container__box__info">
								<mat-icon class="info-icon" (click)="onViewHelp($event)">close</mat-icon>
							</div>
							<div class="step-container__box__help-wrapper pb-2 px-2  pb-sm-4 px-sm-4">
								<div class="step-container__box__help-title">Employees Include...</div>
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
						class="step-container__box"
						(click)="onDataChange('VOL')"
						[ngClass]="{ 'active-selection': registrationTypeCode == 'VOL' }"
					>
						<ng-container *ngIf="displayHelp; else volunteersHelp">
							<div class="step-container__box__info">
								<mat-icon class="info-icon" (click)="onViewHelp($event)">help_outline</mat-icon>
							</div>
							<div class="step-container__box__title  pt-0 pt-sm-5 pb-0 pb-sm-5 mb-5">
								<mat-icon class="step-container__box__title__icon">diversity_3</mat-icon>
								<div class="mt-3">Volunteers</div>
							</div>
						</ng-container>
						<ng-template #volunteersHelp>
							<div class="step-container__box__info">
								<mat-icon class="info-icon" (click)="onViewHelp($event)">close</mat-icon>
							</div>
							<div class="step-container__box__help-wrapper pb-2 px-2  pb-sm-4 px-sm-4">
								<div class="step-container__box__help-title mb-2">Volunteers Include...</div>
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
				<mat-error style="text-align: center;" *ngIf="isDirtyAndInvalid">An option must be selected</mat-error>
			</div>
		</div>
	`,
	styles: [],
})
export class RegistrationPathSelectionComponent implements RegistrationFormStepComponent {
	registrationTypeCode = '';
	isDirtyAndInvalid = false;
	displayHelp = true;

	@Output() clearData: EventEmitter<boolean> = new EventEmitter<boolean>();

	onDataChange(_val: string) {
		if (this.registrationTypeCode) {
			this.clearData.emit(true);
		}

		this.registrationTypeCode = _val;
		const isValid = this.isFormValid();
		this.isDirtyAndInvalid = !isValid;
	}

	onViewHelp(event: any): void {
		this.displayHelp = !this.displayHelp;
		event.stopPropagation();
	}

	getDataToSave(): RegistrationPathSelectionModel {
		return { registrationTypeCode: this.registrationTypeCode };
	}

	isFormValid(): boolean {
		const isValid = this.registrationTypeCode ? true : false;
		this.isDirtyAndInvalid = !isValid;
		return isValid;
	}

	clearCurrentData(): void {
		// do not clear data from this component
	}
}
