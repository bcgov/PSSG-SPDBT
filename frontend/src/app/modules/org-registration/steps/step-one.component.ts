import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { EmployerOrganizationTypeCode, RegistrationTypeCode, VolunteerOrganizationTypeCode } from 'src/app/api/models';
import { CompensationQuestionComponent } from '../step-components/compensation-question.component';
import { FundingQuestionComponent } from '../step-components/funding-question.component';
import { OrganizationOptionsComponent } from '../step-components/organization-options.component';
import {
	RegistrationPathSelectionComponent,
	RegistrationPathSelectionModel,
} from '../step-components/registration-path-selection.component';
import { VulnerableSectorQuestionComponent } from '../step-components/vulnerable-sector-question.component';

@Component({
	selector: 'app-step-one',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-registration-path-selection (clearData)="onClearStepData()"></app-registration-path-selection>

				<div class="row mt-4">
					<div class="offset-lg-4 col-lg-4 offset-md-4 col-md-4 col-sm-12">
						<button mat-raised-button color="primary" class="large mb-2" (click)="onFormValidNextStep(0)">Next</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-organization-options
					[registrationTypeCode]="registrationPathSelectionData.registrationTypeCode"
					(noneApply)="onNoneApplyToOrganization()"
				></app-organization-options>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-raised-button color="primary" class="large mb-2" (click)="onFormValidNextStep(1)">Next</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showStep5">
				<app-organization-problem></app-organization-problem>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-raised-button color="primary" class="large mb-2" [routerLink]="'/'">Close</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showStep2">
				<app-funding-question></app-funding-question>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-raised-button color="primary" class="large mb-2" (click)="onFormValidNextStep(2)">Next</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showStep4">
				<app-funding-problem></app-funding-problem>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-raised-button color="primary" class="large mb-2" [routerLink]="'/'">Close</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showStep3">
				<app-compensation-question></app-compensation-question>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-raised-button color="primary" class="large mb-2" (click)="onFormValidNextStep(3)">Next</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-vulnerable-sector-question></app-vulnerable-sector-question>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-raised-button color="primary" class="large mb-2" (click)="onStepNext(5)">Next</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-eligibility-problem></app-eligibility-problem>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-raised-button color="primary" class="large mb-2" [routerLink]="'/'">Close</button>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepOneComponent {
	showStep2 = false;
	showStep3 = false;
	showStep4 = false;
	showStep5 = false;
	showStep6 = false;

	registrationPathSelectionData: RegistrationPathSelectionModel = { registrationTypeCode: null };

	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() selectRegistrationType: EventEmitter<string> = new EventEmitter<string>();
	@Output() clearRegistrationData: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() scrollIntoView: EventEmitter<boolean> = new EventEmitter<boolean>();

	@ViewChild(RegistrationPathSelectionComponent)
	registrationPathSelectionComponent!: RegistrationPathSelectionComponent;

	@ViewChild(OrganizationOptionsComponent)
	organizationOptionsComponent!: OrganizationOptionsComponent;

	@ViewChild(FundingQuestionComponent)
	fundingQuestionComponent!: FundingQuestionComponent;

	@ViewChild(CompensationQuestionComponent)
	compensationQuestionComponent!: CompensationQuestionComponent;

	@ViewChild(VulnerableSectorQuestionComponent)
	vulnerableSectorQuestionComponent!: VulnerableSectorQuestionComponent;

	@ViewChild('childstepper') private childstepper!: MatStepper;

	getStepData(): any {
		return {
			...this.registrationPathSelectionComponent.getDataToSave(),
			...this.organizationOptionsComponent.getDataToSave(),
			...(this.fundingQuestionComponent ? this.fundingQuestionComponent.getDataToSave() : {}),
			...(this.compensationQuestionComponent ? this.compensationQuestionComponent.getDataToSave() : {}),
			...this.vulnerableSectorQuestionComponent.getDataToSave(),
		};
	}

	onStepNext(formNumber: number): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;

		if (!this.showStep6) {
			this.nextStepperStep.emit(true);
		} else {
			this.childstepper.next();
		}
	}

	onFormValidNextStep(formNumber: number): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;
		this.childstepper.next();
	}

	onClearStepData(): void {
		this.organizationOptionsComponent?.clearCurrentData();
		this.fundingQuestionComponent?.clearCurrentData();
		this.compensationQuestionComponent?.clearCurrentData();
		this.vulnerableSectorQuestionComponent?.clearCurrentData();

		this.clearRegistrationData.emit(true);
	}

	onNoneApplyToOrganization(): void {
		this.showStep5 = true;
		this.childstepper.next();
	}

	onStepSelectionChange(event: StepperSelectionEvent) {
		this.scrollIntoView.emit(true);
	}

	private dirtyForm(step: number): boolean {
		let isValid: boolean;
		switch (step) {
			case 0:
				this.registrationPathSelectionData = this.registrationPathSelectionComponent.getDataToSave();
				return this.registrationPathSelectionComponent.isFormValid();
			case 1:
				this.showStep5 = false;
				isValid = this.organizationOptionsComponent.isFormValid();

				if (isValid) {
					const organizationOptionsData = this.organizationOptionsComponent.getDataToSave();
					if (this.registrationPathSelectionData.registrationTypeCode == RegistrationTypeCode.Employee) {
						this.showStep2 =
							organizationOptionsData.employeeOrganizationType == EmployerOrganizationTypeCode.Funding ? true : false;
						this.showStep3 = false;
					} else {
						this.showStep2 =
							organizationOptionsData.volunteerOrganizationType == VolunteerOrganizationTypeCode.Funding ? true : false;
						this.showStep3 = !this.showStep2;
					}
				}
				return isValid;
			case 2:
				this.fundingQuestionComponent.form.markAllAsTouched();
				isValid = this.fundingQuestionComponent.isFormValid();
				if (isValid) {
					const fundingQuestionData = this.fundingQuestionComponent.getDataToSave();
					this.showStep4 = fundingQuestionData.operatingBudgetFlag == 'NO' ? true : false;
				}
				return isValid;
			case 3:
				this.compensationQuestionComponent.form.markAllAsTouched();
				isValid = this.compensationQuestionComponent.isFormValid();
				if (isValid) {
					const compensationQuestionData = this.compensationQuestionComponent.getDataToSave();
					this.showStep6 = compensationQuestionData.employeeMonetaryCompensationFlag == 'NEITHER' ? true : false;
				}
				return isValid;
			case 5:
				isValid = this.vulnerableSectorQuestionComponent.isFormValid();
				if (isValid) {
					const vulnerableSectorQuestionData = this.vulnerableSectorQuestionComponent.getDataToSave();
					this.showStep6 = vulnerableSectorQuestionData.employeeInteractionFlag == 'NEITHER' ? true : false;
				}
				return isValid;

			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
