import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { EmployeeInteractionTypeCode, RegistrationTypeCode } from 'src/app/api/models';
import { CompensationQuestionComponent } from '../step-components/compensation-question.component';
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
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_REGISTRATION_PATH)"
						>
							Next
						</button>
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
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_ORGANIZATION_OPTION)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showStepOrganizationProblem">
				<app-organization-problem></app-organization-problem>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" [routerLink]="'/'">Close</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showStepCompensationQuestion">
				<app-compensation-question></app-compensation-question>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_COMPENSATION_OPTION)"
						>
							Next
						</button>
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
						<button mat-flat-button color="primary" class="large mb-2" (click)="onVulnerableSectorQuestionNext()">
							Next
						</button>
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
						<button mat-flat-button color="primary" class="large mb-2" [routerLink]="'/'">Close</button>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepOneComponent {
	readonly STEP_REGISTRATION_PATH = 0;
	readonly STEP_ORGANIZATION_OPTION = 1;
	readonly STEP_COMPENSATION_OPTION = 2;
	readonly STEP_VULNERABLE_SECTOR_OPTION = 3;

	showStepCompensationQuestion = true;
	showStepOrganizationProblem = false;
	showStepEligibilityProblem = false;

	registrationPathSelectionData: RegistrationPathSelectionModel = { registrationTypeCode: null };

	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() selectRegistrationType: EventEmitter<RegistrationTypeCode> = new EventEmitter<RegistrationTypeCode>();
	@Output() clearRegistrationData: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() scrollIntoView: EventEmitter<boolean> = new EventEmitter<boolean>();

	@ViewChild(RegistrationPathSelectionComponent)
	registrationPathSelectionComponent!: RegistrationPathSelectionComponent;

	@ViewChild(OrganizationOptionsComponent)
	organizationOptionsComponent!: OrganizationOptionsComponent;

	@ViewChild(CompensationQuestionComponent)
	compensationQuestionComponent!: CompensationQuestionComponent;

	@ViewChild(VulnerableSectorQuestionComponent)
	vulnerableSectorQuestionComponent!: VulnerableSectorQuestionComponent;

	@ViewChild('childstepper') private childstepper!: MatStepper;

	getStepData(): any {
		return {
			...this.registrationPathSelectionComponent.getDataToSave(),
			...this.organizationOptionsComponent.getDataToSave(),
			...(this.compensationQuestionComponent ? this.compensationQuestionComponent.getDataToSave() : {}),
			...this.vulnerableSectorQuestionComponent.getDataToSave(),
		};
	}

	onStepNext(formNumber: number): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;
		this.nextStepperStep.emit(true);
	}

	onFormValidNextStep(formNumber: number): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;
		this.childstepper.next();
	}

	onVulnerableSectorQuestionNext(): void {
		const isValid = this.dirtyForm(this.STEP_VULNERABLE_SECTOR_OPTION);
		if (!isValid) return;
		if (this.showStepEligibilityProblem) {
			this.childstepper.next();
		} else {
			this.nextStepperStep.emit(true);
		}
	}

	onClearStepData(): void {
		this.organizationOptionsComponent?.clearCurrentData();
		this.compensationQuestionComponent?.clearCurrentData();
		this.vulnerableSectorQuestionComponent?.clearCurrentData();

		this.clearRegistrationData.emit(true);
	}

	onNoneApplyToOrganization(): void {
		this.showStepOrganizationProblem = true;
		this.childstepper.next();
	}

	onStepSelectionChange(event: StepperSelectionEvent) {
		if (event.selectedIndex == 1) {
			const data = this.registrationPathSelectionComponent.getDataToSave();
			this.selectRegistrationType.emit(data.registrationTypeCode!);
		}
		this.scrollIntoView.emit(true);
	}

	onGoToFirstStep() {
		this.childstepper.selectedIndex = 0;
	}

	onGoToLastStep() {
		if (this.showStepEligibilityProblem) {
			this.childstepper.selectedIndex = this.childstepper.steps.length - 1;
		} else {
			this.childstepper.selectedIndex = this.childstepper.steps.length - 2;
		}
	}

	navigateToLastStep(currentStateInfo: any): void {
		// setup components with data in session
		this.registrationPathSelectionComponent.registrationTypeCode = currentStateInfo.registrationTypeCode;
		this.registrationPathSelectionData.registrationTypeCode = currentStateInfo.registrationTypeCode;
		this.organizationOptionsComponent.registrationTypeCode = currentStateInfo.registrationTypeCode;

		if (currentStateInfo.employeeOrganizationTypeCode) {
			this.organizationOptionsComponent.employeeOrganizationTypeCode = currentStateInfo.employeeOrganizationTypeCode;
		}
		if (currentStateInfo.volunteerOrganizationTypeCode) {
			this.organizationOptionsComponent.volunteerOrganizationTypeCode = currentStateInfo.volunteerOrganizationTypeCode;
		}

		this.setShowStepCompensationQuestionFlag();
		if (this.compensationQuestionComponent) {
			this.compensationQuestionComponent.employeeMonetaryCompensationFlag =
				currentStateInfo.employeeMonetaryCompensationFlag ? currentStateInfo.employeeMonetaryCompensationFlag : null;
		}
		this.vulnerableSectorQuestionComponent.employeeInteractionFlag = currentStateInfo.employeeInteractionFlag;

		this.childstepper.selectedIndex = this.showStepCompensationQuestion ? 3 : 2;
	}

	private dirtyForm(step: number): boolean {
		let isValid: boolean;
		switch (step) {
			case this.STEP_REGISTRATION_PATH:
				this.registrationPathSelectionData = this.registrationPathSelectionComponent.getDataToSave();
				return this.registrationPathSelectionComponent.isFormValid();
			case this.STEP_ORGANIZATION_OPTION:
				this.showStepCompensationQuestion = false;
				this.showStepOrganizationProblem = false;
				this.showStepEligibilityProblem = false;

				isValid = this.organizationOptionsComponent.isFormValid();
				if (isValid) {
					this.setShowStepCompensationQuestionFlag();
				}
				return isValid;
			case this.STEP_COMPENSATION_OPTION:
				return this.compensationQuestionComponent.isFormValid();
			case this.STEP_VULNERABLE_SECTOR_OPTION:
				isValid = this.vulnerableSectorQuestionComponent.isFormValid();
				if (isValid) {
					const vulnerableSectorQuestionData = this.vulnerableSectorQuestionComponent.getDataToSave();
					this.showStepEligibilityProblem =
						vulnerableSectorQuestionData.employeeInteractionFlag == EmployeeInteractionTypeCode.Neither;
				}
				return isValid;

			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	setShowStepCompensationQuestionFlag(): void {
		this.showStepCompensationQuestion =
			this.registrationPathSelectionData.registrationTypeCode != RegistrationTypeCode.Employee;
	}
}
