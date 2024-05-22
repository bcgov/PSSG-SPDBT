import { Component } from '@angular/core';
import { EmployeeInteractionTypeCode } from 'src/app/api/models';
import { RegistrationFormStepComponent } from '../org-registration.component';

export class VulnerableSectorQuestionModel {
	employeeInteractionFlag: EmployeeInteractionTypeCode | null = null;
}

@Component({
	selector: 'app-vulnerable-sector-question',
	template: `
		<section class="step-section p-4">
			<div class="step">
				<app-step-title
					title="Tell us a bit more about your employees"
					subtitle="To “Works With” means to have direct or unsupervised access to children and/or vulnerable adults."
				></app-step-title>
				<div class="step-container row">
					<div class="col-md-3 col-sm-6 mb-3">
						<div
							tabindex="0"
							class="step-container__box"
							(click)="onDataChange(employeeInteractionTypeCodes.Children)"
							(keydown)="onKeyDown($event, employeeInteractionTypeCodes.Children)"
							[ngClass]="{
								'active-selection-whole': employeeInteractionFlag === employeeInteractionTypeCodes.Children
							}"
						>
							<ng-container *ngIf="displayHelp1; else noHelp1">
								<div class="step-container__box__info">
									<mat-icon
										class="larger-icon"
										tabindex="0"
										(click)="onViewHelp1($event)"
										(keydown)="onKeyDownViewHelp1($event)"
										>close</mat-icon
									>
								</div>
								<div class="px-2 pb-3">
									<div class="step-container__box__help-title mb-2">What does child mean?</div>
									<p>A child is a person who is under the age of 19.</p>
								</div>
							</ng-container>
							<ng-template #noHelp1>
								<div class="step-container__box__info">
									<mat-icon
										class="larger-icon"
										tabindex="0"
										(click)="onViewHelp1($event)"
										(keydown)="onKeyDownViewHelp1($event)"
										>help_outline</mat-icon
									>
								</div>
								<div class="px-2 pb-3">
									<div class="icon-container d-none d-md-block"><mat-icon>family_restroom</mat-icon></div>
									My employees work with <strong>children</strong>
								</div>
							</ng-template>
						</div>
					</div>
					<div class="col-md-3 col-sm-6 mb-3">
						<div
							tabindex="0"
							class="step-container__box"
							(click)="onDataChange(employeeInteractionTypeCodes.Adults)"
							(keydown)="onKeyDown($event, employeeInteractionTypeCodes.Adults)"
							[ngClass]="{ 'active-selection-whole': employeeInteractionFlag === employeeInteractionTypeCodes.Adults }"
						>
							<ng-container *ngIf="displayHelp2; else noHelp2">
								<div class="step-container__box__info">
									<mat-icon
										class="larger-icon"
										tabindex="0"
										(click)="onViewHelp2($event)"
										(keydown)="onKeyDownViewHelp2($event)"
										>close</mat-icon
									>
								</div>
								<div class="px-2 pb-3">
									<div class="step-container__box__help-title mb-2">What does vulnerable adult mean?</div>
									<p>A vulnerable adult is a person 19 and over who receives healthcare services that are not acute.</p>
									<p>Acute means short-term treatment for a severe injury or illness.</p>
								</div>
							</ng-container>
							<ng-template #noHelp2>
								<div class="step-container__box__info">
									<mat-icon
										class="larger-icon"
										tabindex="0"
										(click)="onViewHelp2($event)"
										(keydown)="onKeyDownViewHelp2($event)"
										>help_outline</mat-icon
									>
								</div>
								<div class="px-2 pb-3">
									<div class="icon-container d-none d-md-block"><mat-icon>elderly</mat-icon></div>
									My employees work with <strong>vulnerable adults</strong>
								</div>
							</ng-template>
						</div>
					</div>
					<div class="col-md-3 col-sm-6 mb-3">
						<div
							tabindex="0"
							class="step-container__box px-2 pb-3"
							style="padding-top: 32px;"
							(click)="onDataChange(employeeInteractionTypeCodes.ChildrenAndAdults)"
							(keydown)="onKeyDown($event, employeeInteractionTypeCodes.ChildrenAndAdults)"
							[ngClass]="{
								'active-selection-whole': employeeInteractionFlag === employeeInteractionTypeCodes.ChildrenAndAdults
							}"
						>
							<div class="icon-container d-none d-md-block"><mat-icon>diversity_3</mat-icon></div>
							My employees work with <strong>children and vulnerable adults</strong>
						</div>
					</div>
					<div class="col-md-3 col-sm-6 mb-3">
						<div
							tabindex="0"
							class="step-container__box px-2 pb-3"
							style="padding-top: 32px;"
							(click)="onDataChange(employeeInteractionTypeCodes.Neither)"
							(keydown)="onKeyDown($event, employeeInteractionTypeCodes.Neither)"
							[ngClass]="{ 'active-selection-whole': employeeInteractionFlag === employeeInteractionTypeCodes.Neither }"
						>
							<div class="icon-container d-none d-md-block"><mat-icon>person_off</mat-icon></div>
							My employees <strong>do not work</strong> with children or vulnerable adults
						</div>
					</div>
				</div>
				<mat-error class="mat-option-error" style="text-align: center;" *ngIf="isDirtyAndInvalid"
					>An option must be selected</mat-error
				>
			</div>
		</section>
	`,
	styles: [
		`
			.icon-container {
				display: block;
				text-align: center;

				.mat-icon {
					color: var(--color-black);
					font-size: 50px !important;
					height: 50px !important;
					width: 50px !important;
				}
			}
		`,
	],
})
export class VulnerableSectorQuestionComponent implements RegistrationFormStepComponent {
	employeeInteractionFlag: EmployeeInteractionTypeCode | null = null;
	isDirtyAndInvalid = false;
	displayHelp1 = false;
	displayHelp2 = false;

	employeeInteractionTypeCodes = EmployeeInteractionTypeCode;

	onDataChange(_val: EmployeeInteractionTypeCode) {
		this.employeeInteractionFlag = _val;
		const isValid = this.isFormValid();
		this.isDirtyAndInvalid = !isValid;
	}

	onKeyDown(event: KeyboardEvent, _val: EmployeeInteractionTypeCode) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onDataChange(_val);
	}

	getDataToSave(): VulnerableSectorQuestionModel {
		return { employeeInteractionFlag: this.employeeInteractionFlag };
	}

	isFormValid(): boolean {
		const isValid = !!this.employeeInteractionFlag;
		this.isDirtyAndInvalid = !isValid;
		return isValid;
	}

	clearCurrentData(): void {
		this.employeeInteractionFlag = null;
	}

	onViewHelp1(event: any): void {
		this.displayHelp1 = !this.displayHelp1;
		event.stopPropagation();
	}

	onKeyDownViewHelp1(event: KeyboardEvent) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onViewHelp1(event);
	}

	onViewHelp2(event: any): void {
		this.displayHelp2 = !this.displayHelp2;
		event.stopPropagation();
	}

	onKeyDownViewHelp2(event: KeyboardEvent) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onViewHelp2(event);
	}
}
