import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { LicenceApplicationService, SwlStatusTypeCode } from '../../licence-application.service';
import { LicenceAccessCodeComponent } from '../licence-access-code.component';
import { LicenceCategoryComponent } from '../licence-category.component';
import { LicenceExpiredComponent } from '../licence-expired.component';
import { LicenceSelectionComponent } from '../licence-selection.component';
import { LicenceTermComponent } from '../licence-term.component';
import { LicenceTypeComponent } from '../licence-type.component';
import { PersonalInformationComponent } from '../personal-information.component';
import { SoleProprietorComponent } from '../sole-proprietor.component';

@Component({
	selector: 'app-step-license-selection',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-licence-selection></app-licence-selection>

				<div class="row mt-4">
					<div class="offset-lg-4 col-lg-4 offset-md-4 col-md-4 col-sm-12">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_LICENCE_SELECTION)"
						>
							Next
						</button>
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
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_LICENCE_TYPE)">
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showStepAccessCode">
				<app-licence-access-code></app-licence-access-code>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_ACCESS_CODE)">
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showStepSoleProprietor">
				<app-sole-proprietor></app-sole-proprietor>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_SOLE_PROPRIETOR)"
						>
							Next
						</button>
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
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_PERSONAL_INFORMATION)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showStepLicenceExpired">
				<app-licence-expired></app-licence-expired>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_LICENCE_EXPIRED)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-licence-category></app-licence-category>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_LICENCE_CATEGORY)"
						>
							Next
						</button>
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
	readonly STEP_LICENCE_SELECTION = 0;
	readonly STEP_LICENCE_TYPE = 1;
	readonly STEP_ACCESS_CODE = 2;
	readonly STEP_SOLE_PROPRIETOR = 3;
	readonly STEP_PERSONAL_INFORMATION = 4;
	readonly STEP_LICENCE_EXPIRED = 5;
	readonly STEP_LICENCE_CATEGORY = 6;
	readonly STEP_LICENCE_TERM = 7;

	showStepAccessCode = true;
	showStepSoleProprietor = true;
	showStepLicenceExpired = true;

	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();
	// @Output() clearRegistrationData: EventEmitter<boolean> = new EventEmitter<boolean>();
	// @Output() scrollIntoView: EventEmitter<boolean> = new EventEmitter<boolean>();

	@ViewChild(LicenceSelectionComponent)
	licenceSelectionComponent!: LicenceSelectionComponent;

	@ViewChild(LicenceTypeComponent)
	licenceTypeComponent!: LicenceTypeComponent;

	@ViewChild(SoleProprietorComponent)
	soleProprietorComponent!: SoleProprietorComponent;

	@ViewChild(LicenceAccessCodeComponent)
	licenceAccessCodeComponent!: LicenceAccessCodeComponent;

	@ViewChild(PersonalInformationComponent)
	personalInformationComponent!: PersonalInformationComponent;

	@ViewChild(LicenceExpiredComponent)
	licenceExpiredComponent!: LicenceExpiredComponent;

	@ViewChild(LicenceCategoryComponent)
	licenceCategoryComponent!: LicenceCategoryComponent;

	@ViewChild(LicenceTermComponent)
	licenceTermComponent!: LicenceTermComponent;

	@ViewChild('childstepper') private childstepper!: MatStepper;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	getStepData(): any {
		return {
			...this.licenceSelectionComponent.getDataToSave(),
			...this.licenceTypeComponent.getDataToSave(),
			...(this.licenceAccessCodeComponent ? this.licenceAccessCodeComponent.getDataToSave() : {}),
			...(this.soleProprietorComponent ? this.soleProprietorComponent.getDataToSave() : {}),
			...this.personalInformationComponent.getDataToSave(),
			...(this.licenceExpiredComponent ? this.licenceExpiredComponent.getDataToSave() : {}),
			...this.licenceCategoryComponent.getDataToSave(),
			...this.licenceTermComponent.getDataToSave(),
		};
	}

	onStepNext(): void {
		const licenceModel = this.licenceApplicationService.licenceModel;
		const stepData = this.getStepData();
		this.licenceApplicationService.licenceModel = { ...licenceModel, ...stepData };

		console.log('licenceModel', this.licenceApplicationService.licenceModel);

		// const isValid = this.dirtyForm(formNumber);
		// if (!isValid) return;
		// this.nextStepperStep.emit(true);

		this.nextStepperStep.emit(true);
	}

	// onStepNext(formNumber: number): void {
	// 	const isValid = this.dirtyForm(formNumber);
	// 	if (!isValid) return;
	// 	this.nextStepperStep.emit(true);
	// }

	onFormValidNextStep(formNumber: number): void {
		const licenceModel = this.licenceApplicationService.licenceModel;
		const stepData = this.getStepData();
		this.licenceApplicationService.licenceModel = { ...licenceModel, ...stepData };

		console.log('stepData', stepData);
		console.log('licenceModel', this.licenceApplicationService.licenceModel);

		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;
		this.childstepper.next();
	}

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
		// const licenceModel = this.licenceApplicationService.licenceModel;
		// const stepData = this.getStepData();
		// this.licenceApplicationService.licenceModel = { ...licenceModel, ...stepData };
		// console.log('licenceModel', this.licenceApplicationService.licenceModel);
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

	private dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_LICENCE_SELECTION:
				return this.licenceSelectionComponent.isFormValid();
			case this.STEP_LICENCE_TYPE:
				const isValid = this.licenceTypeComponent.isFormValid();
				if (isValid) {
					this.showStepAccessCode =
						this.licenceApplicationService.licenceModel.statusTypeCode == SwlStatusTypeCode.Renewal ||
						this.licenceApplicationService.licenceModel.statusTypeCode == SwlStatusTypeCode.Update;
					this.showStepSoleProprietor =
						this.licenceApplicationService.licenceModel.statusTypeCode == SwlStatusTypeCode.NewOrExpired ||
						this.licenceApplicationService.licenceModel.statusTypeCode == SwlStatusTypeCode.Renewal;
					this.showStepLicenceExpired =
						this.licenceApplicationService.licenceModel.statusTypeCode == SwlStatusTypeCode.NewOrExpired;
				}
				console.log(
					'yyy',
					this.licenceApplicationService.licenceModel.statusTypeCode,
					isValid,
					this.showStepAccessCode
				);
				return isValid;
			case this.STEP_ACCESS_CODE:
				return this.licenceAccessCodeComponent.isFormValid();
			case this.STEP_SOLE_PROPRIETOR:
				return this.soleProprietorComponent.isFormValid();
			case this.STEP_PERSONAL_INFORMATION:
				return this.personalInformationComponent.isFormValid();
			case this.STEP_LICENCE_EXPIRED:
				return this.licenceExpiredComponent.isFormValid();
			case this.STEP_LICENCE_CATEGORY:
				return this.licenceCategoryComponent.isFormValid();
			case this.STEP_LICENCE_TERM:
				return this.licenceTermComponent.isFormValid();
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
		}
		return false;
	}

	// setShowStepAccessCode(): void {
	// 	this.showStepAccessCode = this.licenceApplicationService.licenceModel.statusTypeCode != SwlStatusTypeCode.New;
	// }
}
