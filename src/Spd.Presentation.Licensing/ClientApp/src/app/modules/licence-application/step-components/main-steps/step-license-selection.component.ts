import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'app-step-license-selection',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-licence-selection></app-licence-selection>

				<div class="row mt-4">
					<div class="offset-lg-4 col-lg-4 offset-md-4 col-md-4 col-sm-12">
						<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-licence-type></app-licence-type>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-sole-proprietor></app-sole-proprietor>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-checklist></app-checklist>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-personal-information></app-personal-information>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-licence-expired></app-licence-expired>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-security-worker-licence-category></app-security-worker-licence-category>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-licence-term></app-licence-term>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext()">Next</button>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepLicenseSelectionComponent {
	readonly STEP_REGISTRATION_PATH = 0;
	readonly STEP_ORGANIZATION_OPTION = 1;
	readonly STEP_COMPENSATION_OPTION = 2;
	readonly STEP_VULNERABLE_SECTOR_OPTION = 3;

	showStepCompensationQuestion = true;
	showStepOrganizationProblem = false;
	showStepEligibilityProblem = false;

	// registrationPathSelectionData: RegistrationPathSelectionModel = { registrationTypeCode: null };

	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();
	// @Output() selectRegistrationType: EventEmitter<RegistrationTypeCode> = new EventEmitter<RegistrationTypeCode>();
	// @Output() clearRegistrationData: EventEmitter<boolean> = new EventEmitter<boolean>();
	// @Output() scrollIntoView: EventEmitter<boolean> = new EventEmitter<boolean>();

	// @ViewChild(RegistrationPathSelectionComponent)
	// registrationPathSelectionComponent!: RegistrationPathSelectionComponent;

	// @ViewChild(OrganizationOptionsComponent)
	// organizationOptionsComponent!: OrganizationOptionsComponent;

	// @ViewChild(CompensationQuestionComponent)
	// compensationQuestionComponent!: CompensationQuestionComponent;

	// @ViewChild(VulnerableSectorQuestionComponent)
	// vulnerableSectorQuestionComponent!: VulnerableSectorQuestionComponent;

	// @ViewChild('childstepper') private childstepper!: MatStepper;

	// getStepData(): any {
	// 	return {
	// 		...this.registrationPathSelectionComponent.getDataToSave(),
	// 		...this.organizationOptionsComponent.getDataToSave(),
	// 		...(this.compensationQuestionComponent ? this.compensationQuestionComponent.getDataToSave() : {}),
	// 		...this.vulnerableSectorQuestionComponent.getDataToSave(),
	// 	};
	// }

	onStepNext(): void {
		this.nextStepperStep.emit(true);
	}

	// onStepNext(formNumber: number): void {
	// 	const isValid = this.dirtyForm(formNumber);
	// 	if (!isValid) return;
	// 	this.nextStepperStep.emit(true);
	// }

	// onFormValidNextStep(formNumber: number): void {
	// 	const isValid = this.dirtyForm(formNumber);
	// 	if (!isValid) return;
	// 	this.childstepper.next();
	// }

	// onVulnerableSectorQuestionNext(): void {
	// 	const isValid = this.dirtyForm(this.STEP_VULNERABLE_SECTOR_OPTION);
	// 	if (!isValid) return;
	// 	if (this.showStepEligibilityProblem) {
	// 		this.childstepper.next();
	// 	} else {
	// 		this.nextStepperStep.emit(true);
	// 	}
	// }

	// onClearStepData(): void {
	// 	this.organizationOptionsComponent?.clearCurrentData();
	// 	this.compensationQuestionComponent?.clearCurrentData();
	// 	this.vulnerableSectorQuestionComponent?.clearCurrentData();

	// 	this.clearRegistrationData.emit(true);
	// }

	// onNoneApplyToOrganization(): void {
	// 	this.showStepOrganizationProblem = true;
	// 	this.childstepper.next();
	// }

	onStepSelectionChange(event: StepperSelectionEvent) {
		// 	if (event.selectedIndex == 1) {
		// 		const data = this.registrationPathSelectionComponent.getDataToSave();
		// 		this.selectRegistrationType.emit(data.registrationTypeCode!);
		// 	}
		// 	this.scrollIntoView.emit(true);
		// }
		// navigateToLastStep(currentStateInfo: any): void {
		// 	// setup components with data in session
		// 	this.registrationPathSelectionComponent.registrationTypeCode = currentStateInfo.registrationTypeCode;
		// 	this.registrationPathSelectionData.registrationTypeCode = currentStateInfo.registrationTypeCode;
		// 	this.organizationOptionsComponent.registrationTypeCode = currentStateInfo.registrationTypeCode;
		// 	if (currentStateInfo.employeeOrganizationTypeCode) {
		// 		this.organizationOptionsComponent.employeeOrganizationTypeCode = currentStateInfo.employeeOrganizationTypeCode;
		// 	}
		// 	if (currentStateInfo.volunteerOrganizationTypeCode) {
		// 		this.organizationOptionsComponent.volunteerOrganizationTypeCode = currentStateInfo.volunteerOrganizationTypeCode;
		// 	}
		// 	this.setShowStepCompensationQuestionFlag();
		// 	if (this.compensationQuestionComponent) {
		// 		this.compensationQuestionComponent.employeeMonetaryCompensationFlag =
		// 			currentStateInfo.employeeMonetaryCompensationFlag ? currentStateInfo.employeeMonetaryCompensationFlag : null;
		// 	}
		// 	this.vulnerableSectorQuestionComponent.employeeInteractionFlag = currentStateInfo.employeeInteractionFlag;
		// 	this.childstepper.selectedIndex = this.showStepCompensationQuestion ? 3 : 2;
	}

	// private dirtyForm(step: number): boolean {
	// 	let isValid: boolean;
	// 	switch (step) {
	// 		case this.STEP_REGISTRATION_PATH:
	// 			this.registrationPathSelectionData = this.registrationPathSelectionComponent.getDataToSave();
	// 			return this.registrationPathSelectionComponent.isFormValid();
	// 		case this.STEP_ORGANIZATION_OPTION:
	// 			this.showStepCompensationQuestion = false;
	// 			this.showStepOrganizationProblem = false;
	// 			this.showStepEligibilityProblem = false;

	// 			isValid = this.organizationOptionsComponent.isFormValid();
	// 			if (isValid) {
	// 				this.setShowStepCompensationQuestionFlag();
	// 			}
	// 			return isValid;
	// 		case this.STEP_COMPENSATION_OPTION:
	// 			return this.compensationQuestionComponent.isFormValid();
	// 		case this.STEP_VULNERABLE_SECTOR_OPTION:
	// 			isValid = this.vulnerableSectorQuestionComponent.isFormValid();
	// 			if (isValid) {
	// 				const vulnerableSectorQuestionData = this.vulnerableSectorQuestionComponent.getDataToSave();
	// 				this.showStepEligibilityProblem =
	// 					vulnerableSectorQuestionData.employeeInteractionFlag == EmployeeInteractionTypeCode.Neither;
	// 			}
	// 			return isValid;

	// 		default:
	// 			console.error('Unknown Form', step);
	// 	}
	// 	return false;
	// }

	// setShowStepCompensationQuestionFlag(): void {
	// 	this.showStepCompensationQuestion =
	// 		this.registrationPathSelectionData.registrationTypeCode != RegistrationTypeCode.Employee;
	// }
}
