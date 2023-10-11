import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { SelectOptions, SwlApplicationTypeCode, SwlCategoryTypeCode } from 'src/app/core/code-types/model-desc.models';
import { LicenceApplicationService, LicenceModelSubject } from '../../licence-application.service';
import { DogsOrRestraintsComponent } from '../dogs-or-restraints.component';
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
import { LicenceTermComponent } from '../licence-term.component';
import { PersonalInformationComponent } from '../personal-information.component';
import { SoleProprietorComponent } from '../sole-proprietor.component';

@Component({
	selector: 'app-step-licence-selection',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<ng-container *ngIf="isReplacement">
				<mat-step completed="true" *ngIf="isReplacement">
					<ng-template matStepLabel>Licence Confirmation</ng-template>
					<app-step-review></app-step-review>
				</mat-step>
			</ng-container>

			<ng-container *ngIf="isNotReplacement">
				<mat-step *ngIf="showStepAccessCode">
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
						<!-- <div class="col-lg-3 col-md-4 col-sm-6 text-end">
							<button mat-stroked-button class="large w-auto" style=" color: var(--color-green-dark);">
								Save & Exit
							</button>
						</div> -->
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
							<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(category.code)">
								Next
							</button>
						</div>
					</div>
				</mat-step>

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
			</ng-container>

			<!-- <ng-container [ngSwitch]="applicationTypeCode">
				<ng-container *ngSwitchCase="swlStatusTypeCodes.NewOrExpired"></ng-container>
				<ng-container *ngSwitchCase="swlStatusTypeCodes.Renewal"></ng-container>
				<ng-container *ngSwitchCase="swlStatusTypeCodes.Replacement"></ng-container>
				<ng-container *ngSwitchCase="swlStatusTypeCodes.Update"></ng-container> 
			</ng-container> -->
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepLicenceSelectionComponent implements OnInit, OnDestroy {
	private licenceModelLoadedSubscription!: Subscription;

	readonly STEP_ACCESS_CODE = '2';
	readonly STEP_SOLE_PROPRIETOR = '3';
	readonly STEP_PERSONAL_INFORMATION = '4';
	readonly STEP_LICENCE_EXPIRED = '5';
	readonly STEP_LICENCE_CATEGORY = '6';
	readonly STEP_DOGS_OR_RESTRAINT = '8';
	readonly STEP_LICENCE_TERM = '7';

	isReplacement = false;
	isNotReplacement = false;
	showStepAccessCode = false;
	showStepSoleProprietor = false;
	showStepLicenceExpired = false;
	showStepDogsAndRestraints = false;

	swlCategoryList: SelectOptions[] = [];
	swlCategoryTypeCodes = SwlCategoryTypeCode;
	swlStatusTypeCodes = SwlApplicationTypeCode;

	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();

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

	@ViewChild(DogsOrRestraintsComponent)
	dogsOrRestraintsComponent!: DogsOrRestraintsComponent;

	@ViewChild(LicenceTermComponent)
	licenceTermComponent!: LicenceTermComponent;

	@ViewChild('childstepper') private childstepper!: MatStepper;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.licenceModelLoadedSubscription = this.licenceModelLoadedSubscription =
			this.licenceApplicationService.licenceModelLoaded$.subscribe({
				next: (loaded: LicenceModelSubject) => {
					if (loaded.isLoaded || loaded.isSetFlags) {
						console.log(
							'onInit StepLicenceSelectionComponent',
							this.licenceApplicationService.licenceModel.applicationTypeCode
						);

						this.isReplacement = this.licenceApplicationService.licenceModel.isReplacement ?? false;
						this.isNotReplacement = this.licenceApplicationService.licenceModel.isNotReplacement ?? false;
						this.showStepAccessCode = this.licenceApplicationService.licenceModel.showStepAccessCode ?? false;
						this.showStepSoleProprietor = this.licenceApplicationService.licenceModel.showStepSoleProprietor ?? false;
						this.showStepLicenceExpired = this.licenceApplicationService.licenceModel.showStepLicenceExpired ?? false;
						this.showStepDogsAndRestraints =
							this.licenceApplicationService.licenceModel.showStepDogsAndRestraints ?? false;
					}
				},
			});
	}

	ngOnDestroy() {
		this.licenceModelLoadedSubscription.unsubscribe();
	}

	onStepNext(formNumber: string): void {
		console.log('onStepNext formNumber:', formNumber);

		this.setStepData();

		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;
		this.nextStepperStep.emit(true);
	}

	onFormValidNextStep(formNumber: string): void {
		console.log('onFormValidNextStep formNumber:', formNumber);

		this.setStepData();

		this.swlCategoryList = this.licenceApplicationService.licenceModel.swlCategoryList;

		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;
		this.childstepper.next();
	}

	onStepSelectionChange(event: StepperSelectionEvent) {
		// TODO is needed?
	}

	private setStepData(): void {
		let stepData = {
			licenceTypeCode: this.licenceApplicationService.licenceModel.licenceTypeCode,
			applicationTypeCode: this.licenceApplicationService.licenceModel.applicationTypeCode,
			...(this.licenceAccessCodeComponent ? this.licenceAccessCodeComponent.getDataToSave() : {}),
			...(this.soleProprietorComponent ? this.soleProprietorComponent.getDataToSave() : {}),
			...(this.personalInformationComponent ? this.personalInformationComponent.getDataToSave() : {}),
			...(this.licenceExpiredComponent ? this.licenceExpiredComponent.getDataToSave() : {}),
			...(this.licenceCategoryComponent ? this.licenceCategoryComponent.getDataToSave() : {}),
			...(this.dogsOrRestraintsComponent ? this.dogsOrRestraintsComponent.getDataToSave() : {}),
			...(this.licenceTermComponent ? this.licenceTermComponent.getDataToSave() : {}),
		};

		const categories = this.licenceApplicationService.licenceModel.swlCategoryList;
		console.log('categories', categories);

		// call function to delete all licence category data
		// this.licenceApplicationService.clearAllLicenceCategoryData(); // TODO do this at the end ? what if save mid-way?

		// add back the appropriate licence category data
		categories.forEach((item: any) => {
			switch (item.code) {
				case SwlCategoryTypeCode.ArmouredCarGuard: {
					if (this.armouredCarGuardComponent) {
						stepData = { ...stepData, ...this.armouredCarGuardComponent.getDataToSave() };
					}
					break;
				}
				case SwlCategoryTypeCode.BodyArmourSales: {
					if (this.bodyArmourSalesComponent) {
						stepData = { ...stepData, ...this.bodyArmourSalesComponent.getDataToSave() };
					}
					break;
				}
				case SwlCategoryTypeCode.ClosedCircuitTelevisionInstaller: {
					if (this.ccTelevisionInstallerComponent) {
						stepData = { ...stepData, ...this.ccTelevisionInstallerComponent.getDataToSave() };
					}
					break;
				}
				case SwlCategoryTypeCode.ElectronicLockingDeviceInstaller: {
					if (this.elDeviceInstallerComponent) {
						stepData = { ...stepData, ...this.elDeviceInstallerComponent.getDataToSave() };
					}
					break;
				}
				case SwlCategoryTypeCode.FireInvestigator: {
					if (this.fireInvestigatorComponent) {
						stepData = { ...stepData, ...this.fireInvestigatorComponent.getDataToSave() };
					}
					break;
				}
				case SwlCategoryTypeCode.Locksmith: {
					if (this.locksmithComponent) {
						stepData = { ...stepData, ...this.locksmithComponent.getDataToSave() };
					}
					break;
				}
				case SwlCategoryTypeCode.LocksmithUnderSupervision: {
					if (this.locksmithSupComponent) {
						stepData = { ...stepData, ...this.locksmithSupComponent.getDataToSave() };
					}
					break;
				}
				case SwlCategoryTypeCode.PrivateInvestigator: {
					if (this.privateInvestigatorComponent) {
						stepData = { ...stepData, ...this.privateInvestigatorComponent.getDataToSave() };
					}
					break;
				}
				case SwlCategoryTypeCode.PrivateInvestigatorUnderSupervision: {
					if (this.privateInvestigatorSupComponent) {
						stepData = { ...stepData, ...this.privateInvestigatorSupComponent.getDataToSave() };
					}
					break;
				}
				case SwlCategoryTypeCode.SecurityGuard: {
					if (this.securityGuardComponent) {
						console.log(
							'this.securityGuardComponent.getDataToSave()',
							this.securityGuardComponent ? this.securityGuardComponent.getDataToSave() : {}
						);
						stepData = { ...stepData, ...this.securityGuardComponent.getDataToSave() };
						console.log('this.securityGuardComponent.stepData', stepData);
					}
					break;
				}
				case SwlCategoryTypeCode.SecurityGuardUnderSupervision: {
					if (this.securityGuardSupComponent) {
						stepData = { ...stepData, ...this.securityGuardSupComponent.getDataToSave() };
					}
					break;
				}
				case SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision: {
					if (this.securityAlarmInstallerSupComponent) {
						stepData = { ...stepData, ...this.securityAlarmInstallerSupComponent.getDataToSave() };
					}
					break;
				}
				case SwlCategoryTypeCode.SecurityAlarmInstaller: {
					if (this.securityAlarmInstallerComponent) {
						stepData = { ...stepData, ...this.securityAlarmInstallerComponent.getDataToSave() };
					}
					break;
				}
				case SwlCategoryTypeCode.SecurityAlarmMonitor: {
					if (this.securityAlarmMonitorComponent) {
						stepData = { ...stepData, ...this.securityAlarmMonitorComponent.getDataToSave() };
					}
					break;
				}
				case SwlCategoryTypeCode.SecurityAlarmResponse: {
					if (this.securityAlarmResponseComponent) {
						stepData = { ...stepData, ...this.securityAlarmResponseComponent.getDataToSave() };
					}
					break;
				}
				case SwlCategoryTypeCode.SecurityAlarmSales: {
					if (this.securityAlarmSalesComponent) {
						stepData = { ...stepData, ...this.securityAlarmSalesComponent.getDataToSave() };
					}
					break;
				}
				case SwlCategoryTypeCode.SecurityConsultant: {
					if (this.securityConsultantComponent) {
						stepData = { ...stepData, ...this.securityConsultantComponent.getDataToSave() };
					}
					break;
				}
			}
		});

		const licenceModel = this.licenceApplicationService.licenceModel;
		this.licenceApplicationService.licenceModel = { ...licenceModel, ...stepData };

		this.licenceApplicationService.notifyUpdateFlags();
		this.licenceApplicationService.notifyCategoryData();

		console.log('LICENCE SELECTION stepData', stepData);
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
			case SwlCategoryTypeCode.ArmouredCarGuard:
				return this.armouredCarGuardComponent.isFormValid();
			case SwlCategoryTypeCode.BodyArmourSales:
				return this.bodyArmourSalesComponent.isFormValid();
			case SwlCategoryTypeCode.ClosedCircuitTelevisionInstaller:
				return this.ccTelevisionInstallerComponent.isFormValid();
			case SwlCategoryTypeCode.ElectronicLockingDeviceInstaller:
				return this.elDeviceInstallerComponent.isFormValid();
			case SwlCategoryTypeCode.FireInvestigator:
				return this.fireInvestigatorComponent.isFormValid();
			case SwlCategoryTypeCode.Locksmith:
				return this.locksmithComponent.isFormValid();
			case SwlCategoryTypeCode.LocksmithUnderSupervision:
				return this.locksmithSupComponent.isFormValid();
			case SwlCategoryTypeCode.PrivateInvestigator:
				return this.privateInvestigatorComponent.isFormValid();
			case SwlCategoryTypeCode.PrivateInvestigatorUnderSupervision:
				return this.privateInvestigatorSupComponent.isFormValid();
			case SwlCategoryTypeCode.SecurityGuard:
				return this.securityGuardComponent.isFormValid();
			case SwlCategoryTypeCode.SecurityGuardUnderSupervision:
				return this.securityGuardSupComponent.isFormValid();
			case SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision:
				return this.securityAlarmInstallerSupComponent.isFormValid();
			case SwlCategoryTypeCode.SecurityAlarmInstaller:
				return this.securityAlarmInstallerComponent.isFormValid();
			case SwlCategoryTypeCode.SecurityAlarmMonitor:
				return this.securityAlarmMonitorComponent.isFormValid();
			case SwlCategoryTypeCode.SecurityAlarmResponse:
				return this.securityAlarmResponseComponent.isFormValid();
			case SwlCategoryTypeCode.SecurityAlarmSales:
				return this.securityAlarmSalesComponent.isFormValid();
			case SwlCategoryTypeCode.SecurityConsultant:
				return this.securityConsultantComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
