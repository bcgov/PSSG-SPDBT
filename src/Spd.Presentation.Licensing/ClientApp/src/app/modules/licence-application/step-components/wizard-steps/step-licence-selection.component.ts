import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { SwlApplicationTypeCode, SwlCategoryTypeCode } from 'src/app/core/code-types/model-desc.models';
import { LicenceApplicationService } from '../../licence-application.service';
import { DogsOrRestraintsComponent } from '../dogs-or-restraints.component';
import { LicenceAccessCodeComponent } from '../licence-access-code.component';
import { LicenceCategoryComponent } from '../licence-category.component';
import { LicenceExpiredComponent } from '../licence-expired.component';
import { LicenceTermComponent } from '../licence-term.component';
import { PersonalInformationComponent } from '../personal-information.component';
import { SoleProprietorComponent } from '../sole-proprietor.component';

@Component({
	selector: 'app-step-licence-selection',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<!-- <ng-container *ngIf="isReplacement">
				<mat-step completed="true" *ngIf="isReplacement">
					<ng-template matStepLabel>Licence Confirmation</ng-template>
					<app-step-review></app-step-review>
				</mat-step>
			</ng-container> -->

			<!-- <ng-container *ngIf="isNotReplacement"> -->
			<!-- <mat-step *ngIf="showStepAccessCode">
					<app-licence-access-code></app-licence-access-code>

					<div class="row mt-4">
						<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
							<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
						</div>
						<div class="col-lg-3 col-md-4 col-sm-6">
							<button
								mat-flat-button
								color="primary"
								class="large mb-2"
								(click)="onFormValidNextStep(STEP_ACCESS_CODE)"
							>
								Next
							</button>
						</div>
					
					</div>
				</mat-step> -->
			<!-- <div class="col-lg-3 col-md-4 col-sm-6 text-end">
							<button mat-stroked-button class="large w-auto" style=" color: var(--color-green-dark);">
								Save & Exit
							</button>
						</div> -->

			<!-- *ngIf="showStepSoleProprietor"-->
			<mat-step>
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

			<mat-step>
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

			<!-- <form [formGroup]="form" novalidate> -->
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
			<!-- 
			<mat-step *ngIf="showArmouredCarGuard">
				<app-licence-category-armoured-car-guard></app-licence-category-armoured-car-guard>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(swlCategoryTypeCodes.ArmouredCarGuard)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showBodyArmourSales">
				<app-licence-category-body-armour-sales></app-licence-category-body-armour-sales>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(swlCategoryTypeCodes.BodyArmourSales)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showClosedCircuitTelevisionInstaller">
				<app-licence-category-closed-circuit-television-installer></app-licence-category-closed-circuit-television-installer>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(swlCategoryTypeCodes.ClosedCircuitTelevisionInstaller)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showElectronicLockingDeviceInstaller">
				<app-licence-category-electronic-locking-device-installer></app-licence-category-electronic-locking-device-installer>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(swlCategoryTypeCodes.ElectronicLockingDeviceInstaller)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showFireInvestigator">
				<app-licence-category-fire-investigator></app-licence-category-fire-investigator>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(swlCategoryTypeCodes.FireInvestigator)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showLocksmith">
				<app-licence-category-locksmith></app-licence-category-locksmith>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(swlCategoryTypeCodes.Locksmith)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showLocksmithUnderSupervision">
				<app-licence-category-locksmith-sup></app-licence-category-locksmith-sup>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(swlCategoryTypeCodes.LocksmithUnderSupervision)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showPrivateInvestigator">
				<app-licence-category-private-investigator></app-licence-category-private-investigator>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(swlCategoryTypeCodes.PrivateInvestigator)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showPrivateInvestigatorUnderSupervision">
				<app-licence-category-private-investigator-sup></app-licence-category-private-investigator-sup>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(swlCategoryTypeCodes.PrivateInvestigatorUnderSupervision)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showSecurityAlarmInstaller">
				<app-licence-category-security-alarm-installer></app-licence-category-security-alarm-installer>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(swlCategoryTypeCodes.SecurityAlarmInstaller)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showSecurityAlarmInstallerUnderSupervision">
				<app-licence-category-security-alarm-installer-sup></app-licence-category-security-alarm-installer-sup>
				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(swlCategoryTypeCodes.SecurityAlarmInstallerUnderSupervision)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showSecurityAlarmMonitor">
				<app-licence-category-security-alarm-monitor></app-licence-category-security-alarm-monitor>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(swlCategoryTypeCodes.SecurityAlarmMonitor)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showSecurityAlarmResponse">
				<app-licence-category-security-alarm-response></app-licence-category-security-alarm-response>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(swlCategoryTypeCodes.SecurityAlarmResponse)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showSecurityAlarmSales">
				<app-licence-category-security-alarm-sales></app-licence-category-security-alarm-sales>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(swlCategoryTypeCodes.SecurityAlarmSales)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showSecurityConsultant">
				<app-licence-category-security-consultant></app-licence-category-security-consultant>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(swlCategoryTypeCodes.SecurityConsultant)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showSecurityGuard">
				<app-licence-category-security-guard></app-licence-category-security-guard>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(swlCategoryTypeCodes.SecurityGuard)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showSecurityGuardUnderSupervision">
				<app-licence-category-security-guard-sup></app-licence-category-security-guard-sup>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(swlCategoryTypeCodes.SecurityGuardUnderSupervision)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step> -->

			<mat-step *ngIf="showStepDogsAndRestraints">
				<app-dogs-or-restraints></app-dogs-or-restraints>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_DOGS_OR_RESTRAINT)"
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
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext(STEP_LICENCE_TERM)">
							Next
						</button>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepLicenceSelectionComponent {
	readonly STEP_ACCESS_CODE = '2';
	readonly STEP_SOLE_PROPRIETOR = '3';
	readonly STEP_PERSONAL_INFORMATION = '4';
	readonly STEP_LICENCE_EXPIRED = '5';
	readonly STEP_LICENCE_CATEGORY = '6';
	readonly STEP_DOGS_OR_RESTRAINT = '8';
	readonly STEP_LICENCE_TERM = '7';

	swlCategoryTypeCodes = SwlCategoryTypeCode;
	swlStatusTypeCodes = SwlApplicationTypeCode;

	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() scrollIntoView: EventEmitter<boolean> = new EventEmitter<boolean>();

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

	// @ViewChild(LicenceCategoryArmouredCarGuardComponent)
	// armouredCarGuardComponent!: LicenceCategoryArmouredCarGuardComponent;
	// @ViewChild(LicenceCategoryBodyArmourSalesComponent)
	// bodyArmourSalesComponent!: LicenceCategoryBodyArmourSalesComponent;
	// @ViewChild(LicenceCategoryClosedCircuitTelevisionInstallerComponent)
	// ccTelevisionInstallerComponent!: LicenceCategoryClosedCircuitTelevisionInstallerComponent;
	// @ViewChild(LicenceCategoryElectronicLockingDeviceInstallerComponent)
	// elDeviceInstallerComponent!: LicenceCategoryElectronicLockingDeviceInstallerComponent;
	// @ViewChild(LicenceCategoryFireInvestigatorComponent)
	// fireInvestigatorComponent!: LicenceCategoryFireInvestigatorComponent;
	// @ViewChild(LicenceCategoryLocksmithComponent)
	// locksmithComponent!: LicenceCategoryLocksmithComponent;
	// @ViewChild(LicenceCategoryLocksmithSupComponent)
	// locksmithSupComponent!: LicenceCategoryLocksmithSupComponent;
	// @ViewChild(LicenceCategoryPrivateInvestigatorComponent)
	// privateInvestigatorComponent!: LicenceCategoryPrivateInvestigatorComponent;
	// @ViewChild(LicenceCategoryPrivateInvestigatorSupComponent)
	// privateInvestigatorSupComponent!: LicenceCategoryPrivateInvestigatorSupComponent;
	// @ViewChild(LicenceCategorySecurityGuardComponent)
	// securityGuardComponent!: LicenceCategorySecurityGuardComponent;
	// @ViewChild(LicenceCategorySecurityGuardSupComponent)
	// securityGuardSupComponent!: LicenceCategorySecurityGuardSupComponent;
	// @ViewChild(LicenceCategorySecurityAlarmInstallerSupComponent)
	// securityAlarmInstallerSupComponent!: LicenceCategorySecurityAlarmInstallerSupComponent;
	// @ViewChild(LicenceCategorySecurityAlarmInstallerComponent)
	// securityAlarmInstallerComponent!: LicenceCategorySecurityAlarmInstallerComponent;
	// @ViewChild(LicenceCategorySecurityAlarmMonitorComponent)
	// securityAlarmMonitorComponent!: LicenceCategorySecurityAlarmMonitorComponent;
	// @ViewChild(LicenceCategorySecurityAlarmResponseComponent)
	// securityAlarmResponseComponent!: LicenceCategorySecurityAlarmResponseComponent;
	// @ViewChild(LicenceCategorySecurityAlarmSalesComponent)
	// securityAlarmSalesComponent!: LicenceCategorySecurityAlarmSalesComponent;
	// @ViewChild(LicenceCategorySecurityConsultantComponent)
	// securityConsultantComponent!: LicenceCategorySecurityConsultantComponent;

	@ViewChild(DogsOrRestraintsComponent)
	dogsOrRestraintsComponent!: DogsOrRestraintsComponent;

	@ViewChild(LicenceTermComponent)
	licenceTermComponent!: LicenceTermComponent;

	@ViewChild('childstepper') private childstepper!: MatStepper;

	// categoryArmouredCarGuardFormGroup: FormGroup = this.licenceApplicationService.categoryArmouredCarGuardFormGroup;
	// categoryFireInvestigatorFormGroup: FormGroup = this.licenceApplicationService.categoryFireInvestigatorFormGroup;
	// categoryLocksmithFormGroup: FormGroup = this.licenceApplicationService.categoryLocksmithFormGroup;
	// categoryPrivateInvestigatorSupFormGroup: FormGroup =
	// 	this.licenceApplicationService.categoryPrivateInvestigatorSupFormGroup;
	// categoryPrivateInvestigatorFormGroup: FormGroup = this.licenceApplicationService.categoryPrivateInvestigatorFormGroup;
	// categorySecurityAlarmInstallerFormGroup: FormGroup =
	// 	this.licenceApplicationService.categorySecurityAlarmInstallerFormGroup;
	// categorySecurityConsultantFormGroup: FormGroup = this.licenceApplicationService.categorySecurityConsultantFormGroup;
	// categoryBodyArmourSalesFormGroup: FormGroup = this.licenceApplicationService.categoryBodyArmourSalesFormGroup;
	// categoryClosedCircuitTelevisionInstallerFormGroup: FormGroup =
	// 	this.licenceApplicationService.categoryClosedCircuitTelevisionInstallerFormGroup;
	// categoryElectronicLockingDeviceInstallerFormGroup: FormGroup =
	// 	this.licenceApplicationService.categoryElectronicLockingDeviceInstallerFormGroup;
	// categoryLocksmithSupFormGroup: FormGroup = this.licenceApplicationService.categoryLocksmithSupFormGroup;
	// categorySecurityAlarmInstallerSupFormGroup: FormGroup =
	// 	this.licenceApplicationService.categorySecurityAlarmInstallerSupFormGroup;
	// categorySecurityAlarmMonitorFormGroup: FormGroup =
	// 	this.licenceApplicationService.categorySecurityAlarmMonitorFormGroup;
	// categorySecurityAlarmResponseFormGroup: FormGroup =
	// 	this.licenceApplicationService.categorySecurityAlarmResponseFormGroup;
	// categorySecurityAlarmSalesFormGroup: FormGroup = this.licenceApplicationService.categorySecurityAlarmSalesFormGroup;
	categorySecurityGuardFormGroup: FormGroup = this.licenceApplicationService.categorySecurityGuardFormGroup;
	// categorySecurityGuardSupFormGroup: FormGroup = this.licenceApplicationService.categorySecurityGuardSupFormGroup;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	onStepNext(formNumber: string): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;

		this.nextStepperStep.emit(true);
	}

	onFormValidNextStep(formNumber: string): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;

		this.childstepper.next();
	}

	onStepSelectionChange(event: StepperSelectionEvent) {
		this.scrollIntoView.emit(true);
	}

	private dirtyForm(step: string): boolean {
		switch (step) {
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
			case this.STEP_DOGS_OR_RESTRAINT:
				return this.dogsOrRestraintsComponent.isFormValid();
			case this.STEP_LICENCE_TERM:
				return this.licenceTermComponent.isFormValid();
			// case SwlCategoryTypeCode.ArmouredCarGuard:
			// 	return this.armouredCarGuardComponent.isFormValid();
			// case SwlCategoryTypeCode.BodyArmourSales:
			// 	return this.bodyArmourSalesComponent.isFormValid();
			// case SwlCategoryTypeCode.ClosedCircuitTelevisionInstaller:
			// 	return this.ccTelevisionInstallerComponent.isFormValid();
			// case SwlCategoryTypeCode.ElectronicLockingDeviceInstaller:
			// 	return this.elDeviceInstallerComponent.isFormValid();
			// case SwlCategoryTypeCode.FireInvestigator:
			// 	return this.fireInvestigatorComponent.isFormValid();
			// case SwlCategoryTypeCode.Locksmith:
			// 	return this.locksmithComponent.isFormValid();
			// case SwlCategoryTypeCode.LocksmithUnderSupervision:
			// 	return this.locksmithSupComponent.isFormValid();
			// case SwlCategoryTypeCode.PrivateInvestigator:
			// 	return this.privateInvestigatorComponent.isFormValid();
			// case SwlCategoryTypeCode.PrivateInvestigatorUnderSupervision:
			// 	return this.privateInvestigatorSupComponent.isFormValid();
			// case SwlCategoryTypeCode.SecurityGuard:
			// 	return this.securityGuardComponent.isFormValid();
			// case SwlCategoryTypeCode.SecurityGuardUnderSupervision:
			// 	return this.securityGuardSupComponent.isFormValid();
			// case SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision:
			// 	return this.securityAlarmInstallerSupComponent.isFormValid();
			// case SwlCategoryTypeCode.SecurityAlarmInstaller:
			// 	return this.securityAlarmInstallerComponent.isFormValid();
			// case SwlCategoryTypeCode.SecurityAlarmMonitor:
			// 	return this.securityAlarmMonitorComponent.isFormValid();
			// case SwlCategoryTypeCode.SecurityAlarmResponse:
			// 	return this.securityAlarmResponseComponent.isFormValid();
			// case SwlCategoryTypeCode.SecurityAlarmSales:
			// 	return this.securityAlarmSalesComponent.isFormValid();
			// case SwlCategoryTypeCode.SecurityConsultant:
			// 	return this.securityConsultantComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	get showStepDogsAndRestraints(): boolean {
		return this.categorySecurityGuardFormGroup.get('isInclude')?.value;
	}

	// get showArmouredCarGuard(): boolean {
	// 	return this.categoryArmouredCarGuardFormGroup.get('isInclude')?.value;
	// }
	// get showBodyArmourSales(): boolean {
	// 	return this.categoryBodyArmourSalesFormGroup.get('isInclude')?.value;
	// }
	// get showClosedCircuitTelevisionInstaller(): boolean {
	// 	return this.categoryClosedCircuitTelevisionInstallerFormGroup.get('isInclude')?.value;
	// }
	// get showElectronicLockingDeviceInstaller(): boolean {
	// 	return this.categoryElectronicLockingDeviceInstallerFormGroup.get('isInclude')?.value;
	// }
	// get showFireInvestigator(): boolean {
	// 	return this.categoryFireInvestigatorFormGroup.get('isInclude')?.value;
	// }
	// get showLocksmith(): boolean {
	// 	return this.categoryLocksmithFormGroup.get('isInclude')?.value;
	// }
	// get showLocksmithUnderSupervision(): boolean {
	// 	return this.categoryLocksmithSupFormGroup.get('isInclude')?.value;
	// }
	// get showPrivateInvestigatorUnderSupervision(): boolean {
	// 	return this.categoryPrivateInvestigatorSupFormGroup.get('isInclude')?.value;
	// }
	// get showPrivateInvestigator(): boolean {
	// 	return this.categoryPrivateInvestigatorFormGroup.get('isInclude')?.value;
	// }
	// get showSecurityAlarmInstaller(): boolean {
	// 	return this.categorySecurityAlarmInstallerFormGroup.get('isInclude')?.value;
	// }
	// get showSecurityAlarmInstallerUnderSupervision(): boolean {
	// 	return this.categorySecurityAlarmInstallerSupFormGroup.get('isInclude')?.value;
	// }
	// get showSecurityConsultant(): boolean {
	// 	return this.categorySecurityConsultantFormGroup.get('isInclude')?.value;
	// }
	// get showSecurityGuard(): boolean {
	// 	return this.categorySecurityGuardFormGroup.get('isInclude')?.value;
	// }
	// get showSecurityAlarmMonitor(): boolean {
	// 	return this.categorySecurityAlarmMonitorFormGroup.get('isInclude')?.value;
	// }
	// get showSecurityAlarmResponse(): boolean {
	// 	return this.categorySecurityAlarmResponseFormGroup.get('isInclude')?.value;
	// }
	// get showSecurityAlarmSales(): boolean {
	// 	return this.categorySecurityAlarmSalesFormGroup.get('isInclude')?.value;
	// }
	// get showSecurityGuardUnderSupervision(): boolean {
	// 	return this.categorySecurityGuardSupFormGroup.get('isInclude')?.value;
	// }
}
