import { Component, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import {
	CompensationQuestionComponent,
	CompensationQuestionModel,
} from '../step-components/compensation-question.component';
import { FundingQuestionComponent, FundingQuestionModel } from '../step-components/funding-question.component';
import {
	OrganizationOptionsComponent,
	OrganizationOptionsModel,
} from '../step-components/organization-options.component';
import {
	RegistrationPathSelectionComponent,
	RegistrationPathSelectionModel,
} from '../step-components/registration-path-selection.component';
import {
	VulnerableSectorQuestionComponent,
	VulnerableSectorQuestionModel,
} from '../step-components/vulnerable-sector-question.component';

@Component({
	selector: 'app-step-one',
	template: `
		<mat-stepper class="child-stepper" #childstepper>
			<mat-step>
				<app-registration-path-selection
					[stepData]="registrationPathSelectionData"
					(formValidity)="onRegistrationPathValidity($event)"
				></app-registration-path-selection>

				<div class="row mt-4">
					<div class="offset-lg-4 col-lg-4 offset-md-4 col-md-4 col-sm-12">
						<button mat-raised-button color="primary" class="large mb-2" [disabled]="!isFormValid0" matStepperNext>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-organization-options
					[registrationTypeCode]="registrationPathSelectionData.registrationTypeCode"
					[stepData]="organizationOptionsData"
					(formValidity)="onOrganizationOptionsValidity($event)"
				></app-organization-options>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-raised-button color="primary" [disabled]="!isFormValid1" class="large mb-2" matStepperNext>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showStep2">
				<app-funding-question
					[stepData]="fundingQuestionData"
					(formValidity)="onFundingQuestionValidity($event)"
				></app-funding-question>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-raised-button color="primary" class="large mb-2" [disabled]="!isFormValid2" matStepperNext>
							Next
						</button>
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
				<app-compensation-question
					[stepData]="compensationQuestionData"
					(formValidity)="onCompensationQuestionValidity($event)"
				></app-compensation-question>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-raised-button color="primary" class="large mb-2" [disabled]="!isFormValid3" matStepperNext>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-vulnerable-sector-question
					[stepData]="vulnerableSectorQuestionData"
					(formValidity)="onVulnerableSectorQuestionValidity($event)"
				></app-vulnerable-sector-question>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button
							mat-raised-button
							color="primary"
							class="large mb-2"
							[disabled]="!isFormValid5"
							(click)="onStepNext()"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showStep6">
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
	showStep6 = false;

	isFormValid0: boolean = false;
	isFormValid1: boolean = false;
	isFormValid2: boolean = false;
	isFormValid3: boolean = false;
	isFormValid5: boolean = false;

	registrationPathSelectionData: RegistrationPathSelectionModel = { registrationTypeCode: '' };
	organizationOptionsData: OrganizationOptionsModel = { organizationType: '' };
	fundingQuestionData: FundingQuestionModel = { operatingBudgetFlag: '' };
	compensationQuestionData: CompensationQuestionModel = { employeeMonetaryCompensationFlag: '' };
	vulnerableSectorQuestionData: VulnerableSectorQuestionModel = { employeeInteractionFlag: '' };

	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() selectRegistrationType: EventEmitter<string> = new EventEmitter<string>();

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

	onRegistrationPathValidity(isValid: boolean): void {
		this.isFormValid0 = isValid;
		if (isValid) {
			this.registrationPathSelectionData = this.registrationPathSelectionComponent.getDataToSave();
			this.selectRegistrationType.emit(this.registrationPathSelectionData.registrationTypeCode);
			this.showStep3 = this.registrationPathSelectionData.registrationTypeCode == 'EMP' ? false : true;
		}
	}

	onOrganizationOptionsValidity(isValid: boolean) {
		this.isFormValid1 = isValid;
		if (isValid) {
			this.organizationOptionsData = this.organizationOptionsComponent.getDataToSave();

			if (this.registrationPathSelectionData.registrationTypeCode == 'EMP') {
				this.showStep2 = this.organizationOptionsData.organizationType == '4' ? true : false;
			} else {
				this.showStep2 = this.organizationOptionsData.organizationType == '6' ? true : false;
			}
		}
	}

	onFundingQuestionValidity(isValid: boolean) {
		this.isFormValid2 = isValid;
		if (isValid) {
			this.fundingQuestionData = this.fundingQuestionComponent.getDataToSave();
			this.showStep4 = this.fundingQuestionData.operatingBudgetFlag == 'NO' ? true : false;
		}
	}

	onCompensationQuestionValidity(isValid: boolean) {
		this.isFormValid3 = isValid;
		if (isValid) {
			this.compensationQuestionData = this.compensationQuestionComponent.getDataToSave();
			this.showStep6 = this.compensationQuestionData.employeeMonetaryCompensationFlag == 'NEITHER' ? true : false;
		}
	}

	onVulnerableSectorQuestionValidity(isValid: boolean) {
		this.isFormValid5 = isValid;
		if (isValid) {
			this.vulnerableSectorQuestionData = this.vulnerableSectorQuestionComponent.getDataToSave();
			this.showStep6 = this.vulnerableSectorQuestionData.employeeInteractionFlag == 'NEITHER' ? true : false;
		}
	}

	onStepNext(): void {
		if (!this.showStep6) {
			this.nextStepperStep.emit(true);
		} else {
			this.childstepper.next();
		}
	}
}
