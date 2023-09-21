import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { SelectOptions } from 'src/app/core/code-types/model-desc.models';
import { LicenceApplicationService, SwlCategoryTypeCode, SwlStatusTypeCode } from '../../licence-application.service';
import { LicenceAccessCodeComponent } from '../licence-access-code.component';
import { LicenceCategoryArmouredCarGuardComponent } from '../licence-category-armoured-car-guard.component';
import { LicenceCategoryBodyArmourSalesComponent } from '../licence-category-body-armour-sales.component';
import { LicenceCategoryClosedCircuitTelevisionInstallerComponent } from '../licence-category-closed-circuit-television-installer.component';
import { LicenceCategoryElectronicLockingDeviceInstallerComponent } from '../licence-category-electronic-locking-device-installer.component';
import { LicenceCategoryFireInvestigatorComponent } from '../licence-category-fire-investigator.component';
import { LicenceCategoryLocksmithSupComponent } from '../licence-category-locksmith-sup.component';
import { LicenceCategoryLocksmithComponent } from '../licence-category-locksmith.component';
import { LicenceCategoryPrivateInvestigatorSupComponent } from '../licence-category-private-investigator-sup.component';
import { LicenceCategoryPrivateInvestigatorComponent } from '../licence-category-private-investigator.component';
import { LicenceCategorySecurityAlarmInstallerSupComponent } from '../licence-category-security-alarm-installer-sup.component';
import { LicenceCategorySecurityAlarmInstallerComponent } from '../licence-category-security-alarm-installer.component';
import { LicenceCategorySecurityAlarmMonitorComponent } from '../licence-category-security-alarm-monitor.component';
import { LicenceCategorySecurityAlarmResponseComponent } from '../licence-category-security-alarm-response.component';
import { LicenceCategorySecurityAlarmSalesComponent } from '../licence-category-security-alarm-sales.component';
import { LicenceCategorySecurityConsultantComponent } from '../licence-category-security-consultant.component';
import { LicenceCategorySecurityGuardSupComponent } from '../licence-category-security-guard-sup.component';
import { LicenceCategorySecurityGuardComponent } from '../licence-category-security-guard.component';
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
			<!-- <mat-step>
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
			</mat-step> -->

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

			<mat-step *ngFor="let category of swlCategoryList; let i = index">
				<div [ngSwitch]="category.code">
					<div *ngSwitchCase="swlCategoryTypeCodes.ArmouredCarGuard">
						<app-licence-category-armoured-car-guard
							[option]="category"
							[index]="i + 1"
						></app-licence-category-armoured-car-guard>
					</div>
					<div *ngSwitchCase="swlCategoryTypeCodes.BodyArmourSales">
						<app-licence-category-body-armour-sales
							[option]="category"
							[index]="i + 1"
						></app-licence-category-body-armour-sales>
					</div>
					<div *ngSwitchCase="swlCategoryTypeCodes.ClosedCircuitTelevisionInstaller">
						<app-licence-category-closed-circuit-television-installer
							[option]="category"
							[index]="i + 1"
						></app-licence-category-closed-circuit-television-installer>
					</div>
					<div *ngSwitchCase="swlCategoryTypeCodes.ElectronicLockingDeviceInstaller">
						<app-licence-category-electronic-locking-device-installer
							[option]="category"
							[index]="i + 1"
						></app-licence-category-electronic-locking-device-installer>
					</div>
					<div *ngSwitchCase="swlCategoryTypeCodes.FireInvestigator">
						<app-licence-category-fire-investigator
							[option]="category"
							[index]="i + 1"
						></app-licence-category-fire-investigator>
					</div>
					<div *ngSwitchCase="swlCategoryTypeCodes.Locksmith">
						<app-licence-category-locksmith [option]="category" [index]="i + 1"></app-licence-category-locksmith>
					</div>
					<div *ngSwitchCase="swlCategoryTypeCodes.LocksmithUnderSupervision">
						<app-licence-category-locksmith-sup
							[option]="category"
							[index]="i + 1"
						></app-licence-category-locksmith-sup>
					</div>
					<div *ngSwitchCase="swlCategoryTypeCodes.PrivateInvestigator">
						<app-licence-category-private-investigator
							[option]="category"
							[index]="i + 1"
						></app-licence-category-private-investigator>
					</div>
					<div *ngSwitchCase="swlCategoryTypeCodes.PrivateInvestigatorUnderSupervision">
						<app-licence-category-private-investigator-sup
							[option]="category"
							[index]="i + 1"
						></app-licence-category-private-investigator-sup>
					</div>
					<div *ngSwitchCase="swlCategoryTypeCodes.SecurityAlarmInstallerUnderSupervision">
						<app-licence-category-security-alarm-installer-sup
							[option]="category"
							[index]="i + 1"
						></app-licence-category-security-alarm-installer-sup>
					</div>
					<div *ngSwitchCase="swlCategoryTypeCodes.SecurityAlarmInstaller">
						<app-licence-category-security-alarm-installer
							[option]="category"
							[index]="i + 1"
						></app-licence-category-security-alarm-installer>
					</div>
					<div *ngSwitchCase="swlCategoryTypeCodes.SecurityAlarmMonitor">
						<app-licence-category-security-alarm-monitor
							[option]="category"
							[index]="i + 1"
						></app-licence-category-security-alarm-monitor>
					</div>
					<div *ngSwitchCase="swlCategoryTypeCodes.SecurityAlarmResponse">
						<app-licence-category-security-alarm-response
							[option]="category"
							[index]="i + 1"
						></app-licence-category-security-alarm-response>
					</div>
					<div *ngSwitchCase="swlCategoryTypeCodes.SecurityAlarmSales">
						<app-licence-category-security-alarm-sales
							[option]="category"
							[index]="i + 1"
						></app-licence-category-security-alarm-sales>
					</div>
					<div *ngSwitchCase="swlCategoryTypeCodes.SecurityConsultant">
						<app-licence-category-security-consultant
							[option]="category"
							[index]="i + 1"
						></app-licence-category-security-consultant>
					</div>
					<div *ngSwitchCase="swlCategoryTypeCodes.SecurityGuard">
						<app-licence-category-security-guard
							[option]="category"
							[index]="i + 1"
						></app-licence-category-security-guard>
					</div>
					<div *ngSwitchCase="swlCategoryTypeCodes.SecurityGuardUnderSupervision">
						<app-licence-category-security-guard-sup
							[option]="category"
							[index]="i + 1"
						></app-licence-category-security-guard-sup>
					</div>
				</div>

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

	swlCategoryList: SelectOptions[] = [];
	swlCategoryTypeCodes = SwlCategoryTypeCode;

	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();

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

	@ViewChild(LicenceCategoryArmouredCarGuardComponent)
	armouredCarGuardComponent!: LicenceCategoryArmouredCarGuardComponent;
	@ViewChild(LicenceCategoryBodyArmourSalesComponent)
	bodyArmourSalesComponent!: LicenceCategoryBodyArmourSalesComponent;
	@ViewChild(LicenceCategoryClosedCircuitTelevisionInstallerComponent)
	ccTelevisionInstallerComponent!: LicenceCategoryClosedCircuitTelevisionInstallerComponent;
	@ViewChild(LicenceCategoryElectronicLockingDeviceInstallerComponent)
	elDeviceInstallerComponent!: LicenceCategoryElectronicLockingDeviceInstallerComponent;
	@ViewChild(LicenceCategoryFireInvestigatorComponent)
	fireInvestigatorComponent!: LicenceCategoryFireInvestigatorComponent;
	@ViewChild(LicenceCategoryLocksmithComponent)
	locksmithComponent!: LicenceCategoryLocksmithComponent;
	@ViewChild(LicenceCategoryLocksmithSupComponent)
	locksmithSupComponent!: LicenceCategoryLocksmithSupComponent;
	@ViewChild(LicenceCategoryPrivateInvestigatorComponent)
	privateInvestigatorComponent!: LicenceCategoryPrivateInvestigatorComponent;
	@ViewChild(LicenceCategoryPrivateInvestigatorSupComponent)
	privateInvestigatorSupComponent!: LicenceCategoryPrivateInvestigatorSupComponent;
	@ViewChild(LicenceCategorySecurityGuardComponent)
	securityGuardComponent!: LicenceCategorySecurityGuardComponent;
	@ViewChild(LicenceCategorySecurityGuardSupComponent)
	securityGuardSupComponent!: LicenceCategorySecurityGuardSupComponent;
	@ViewChild(LicenceCategorySecurityAlarmInstallerSupComponent)
	securityAlarmInstallerSupComponent!: LicenceCategorySecurityAlarmInstallerSupComponent;
	@ViewChild(LicenceCategorySecurityAlarmInstallerComponent)
	securityAlarmInstallerComponent!: LicenceCategorySecurityAlarmInstallerComponent;
	@ViewChild(LicenceCategorySecurityAlarmMonitorComponent)
	securityAlarmMonitorComponent!: LicenceCategorySecurityAlarmMonitorComponent;
	@ViewChild(LicenceCategorySecurityAlarmResponseComponent)
	securityAlarmResponseComponent!: LicenceCategorySecurityAlarmResponseComponent;
	@ViewChild(LicenceCategorySecurityAlarmSalesComponent)
	securityAlarmSalesComponent!: LicenceCategorySecurityAlarmSalesComponent;
	@ViewChild(LicenceCategorySecurityConsultantComponent)
	securityConsultantComponent!: LicenceCategorySecurityConsultantComponent;

	@ViewChild(LicenceTermComponent)
	licenceTermComponent!: LicenceTermComponent;

	@ViewChild('childstepper') private childstepper!: MatStepper;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	getStepData(): any {
		return {
			// ...this.licenceSelectionComponent.getDataToSave(),
			// ...this.licenceTypeComponent.getDataToSave(),
			...(this.licenceSelectionComponent ? this.licenceSelectionComponent.getDataToSave() : {}),
			...(this.licenceTypeComponent ? this.licenceTypeComponent.getDataToSave() : {}),
			...(this.licenceAccessCodeComponent ? this.licenceAccessCodeComponent.getDataToSave() : {}),
			...(this.soleProprietorComponent ? this.soleProprietorComponent.getDataToSave() : {}),
			// ...this.personalInformationComponent.getDataToSave(),
			...(this.personalInformationComponent ? this.personalInformationComponent.getDataToSave() : {}),
			...(this.licenceExpiredComponent ? this.licenceExpiredComponent.getDataToSave() : {}),
			// ...this.licenceCategoryComponent.getDataToSave(),
			// ...this.licenceTermComponent.getDataToSave(),
			...(this.licenceCategoryComponent ? this.licenceCategoryComponent.getDataToSave() : {}),
			...(this.armouredCarGuardComponent ? this.armouredCarGuardComponent.getDataToSave() : {}),
			...(this.bodyArmourSalesComponent ? this.bodyArmourSalesComponent.getDataToSave() : {}),
			...(this.ccTelevisionInstallerComponent ? this.ccTelevisionInstallerComponent.getDataToSave() : {}),
			...(this.elDeviceInstallerComponent ? this.elDeviceInstallerComponent.getDataToSave() : {}),
			...(this.fireInvestigatorComponent ? this.fireInvestigatorComponent.getDataToSave() : {}),
			...(this.locksmithComponent ? this.locksmithComponent.getDataToSave() : {}),
			...(this.locksmithSupComponent ? this.locksmithSupComponent.getDataToSave() : {}),
			...(this.privateInvestigatorComponent ? this.privateInvestigatorComponent.getDataToSave() : {}),
			...(this.privateInvestigatorSupComponent ? this.privateInvestigatorSupComponent.getDataToSave() : {}),
			...(this.securityGuardComponent ? this.securityGuardComponent.getDataToSave() : {}),
			...(this.securityGuardSupComponent ? this.securityGuardSupComponent.getDataToSave() : {}),
			...(this.securityAlarmInstallerSupComponent ? this.securityAlarmInstallerSupComponent.getDataToSave() : {}),
			...(this.securityAlarmInstallerComponent ? this.securityAlarmInstallerComponent.getDataToSave() : {}),
			...(this.securityAlarmMonitorComponent ? this.securityAlarmMonitorComponent.getDataToSave() : {}),
			...(this.securityAlarmResponseComponent ? this.securityAlarmResponseComponent.getDataToSave() : {}),
			...(this.securityAlarmSalesComponent ? this.securityAlarmSalesComponent.getDataToSave() : {}),
			...(this.securityConsultantComponent ? this.securityConsultantComponent.getDataToSave() : {}),
			...(this.licenceTermComponent ? this.licenceTermComponent.getDataToSave() : {}),
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

		// this.licenceApplicationService.saveLicence();

		console.log('stepData', stepData);
		console.log('licenceModel', this.licenceApplicationService.licenceModel);

		this.swlCategoryList = this.licenceApplicationService.licenceModel.swlCategoryList;

		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;
		this.childstepper.next();
	}

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
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
