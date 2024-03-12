import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WorkerCategoryTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { SelectOptions, WorkerCategoryTypes } from '@app/core/code-types/model-desc.models';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';

export interface LicenceCategoryDialogData {
	category: WorkerCategoryTypeCode | null;
}

@Component({
	selector: 'app-worker-licence-name-change-update-authenticated-modal',
	template: `
		<div mat-dialog-title>
			Add Licence Category

			<mat-divider class="mat-divider-main mt-2 mb-3"></mat-divider>
		</div>
		<div mat-dialog-content>
			<section class="step-section-modal">
				<div class="step mt-3">
					<div class="row" *ngIf="!category">
						<div class="col-md-6 col-sm-12 mx-auto">
							<mat-form-field>
								<mat-label>Category</mat-label>
								<mat-select (selectionChange)="onAddCategory($event)">
									<mat-option *ngFor="let item of validCategoryList" [value]="item.code">
										{{ item.desc }}
									</mat-option>
								</mat-select>
							</mat-form-field>
							<mat-error class="mat-option-error" *ngIf="isDirtyAndInvalid">
								At least one category must be added
							</mat-error>
						</div>
						<!-- <div class="col-md-6 col-sm-12" *ngIf="categoryList.length < 6">
								<button mat-stroked-button color="primary" class="large my-2" (click)="onAddCategory()">
									Add Category
								</button>
							</div> -->
					</div>

					<div class="row" *ngIf="category" @showHideTriggerSlideAnimation>
						<div class="col-12">
							<mat-accordion multi="false">
								<ng-container *ngIf="category === workerCategoryTypeCodes.ArmouredCarGuard">
									<app-licence-category-armoured-car-guard></app-licence-category-armoured-car-guard>
								</ng-container>

								<ng-container *ngIf="category === workerCategoryTypeCodes.BodyArmourSales">
									<app-licence-category-body-armour-sales></app-licence-category-body-armour-sales>
								</ng-container>

								<ng-container *ngIf="category === workerCategoryTypeCodes.ClosedCircuitTelevisionInstaller">
									<app-licence-category-closed-circuit-television-installer></app-licence-category-closed-circuit-television-installer>
								</ng-container>

								<ng-container *ngIf="category === workerCategoryTypeCodes.ElectronicLockingDeviceInstaller">
									<app-licence-category-electronic-locking-device-installer></app-licence-category-electronic-locking-device-installer>
								</ng-container>

								<ng-container *ngIf="category === workerCategoryTypeCodes.FireInvestigator">
									<app-licence-category-fire-investigator></app-licence-category-fire-investigator>
								</ng-container>

								<ng-container *ngIf="category === workerCategoryTypeCodes.Locksmith">
									<app-licence-category-locksmith></app-licence-category-locksmith>
								</ng-container>

								<ng-container *ngIf="category === workerCategoryTypeCodes.LocksmithUnderSupervision">
									<app-licence-category-locksmith-sup></app-licence-category-locksmith-sup>
								</ng-container>

								<ng-container *ngIf="category === workerCategoryTypeCodes.PrivateInvestigator">
									<app-licence-category-private-investigator></app-licence-category-private-investigator>
								</ng-container>

								<ng-container *ngIf="category === workerCategoryTypeCodes.PrivateInvestigatorUnderSupervision">
									<app-licence-category-private-investigator-sup></app-licence-category-private-investigator-sup>
								</ng-container>

								<ng-container *ngIf="category === workerCategoryTypeCodes.SecurityAlarmInstaller">
									<app-licence-category-security-alarm-installer></app-licence-category-security-alarm-installer>
								</ng-container>

								<ng-container *ngIf="category === workerCategoryTypeCodes.SecurityAlarmInstallerUnderSupervision">
									<app-licence-category-security-alarm-installer-sup></app-licence-category-security-alarm-installer-sup>
								</ng-container>

								<ng-container *ngIf="category === workerCategoryTypeCodes.SecurityAlarmMonitor">
									<app-licence-category-security-alarm-monitor></app-licence-category-security-alarm-monitor>
								</ng-container>

								<ng-container *ngIf="category === workerCategoryTypeCodes.SecurityAlarmResponse">
									<app-licence-category-security-alarm-response></app-licence-category-security-alarm-response>
								</ng-container>

								<ng-container *ngIf="category === workerCategoryTypeCodes.SecurityAlarmSales">
									<app-licence-category-security-alarm-sales></app-licence-category-security-alarm-sales>
								</ng-container>

								<ng-container *ngIf="category === workerCategoryTypeCodes.SecurityConsultant">
									<app-licence-category-security-consultant></app-licence-category-security-consultant>
								</ng-container>

								<ng-container *ngIf="category === workerCategoryTypeCodes.SecurityGuard">
									<app-licence-category-security-guard></app-licence-category-security-guard>
								</ng-container>

								<ng-container *ngIf="category === workerCategoryTypeCodes.SecurityGuardUnderSupervision">
									<app-licence-category-security-guard-sup></app-licence-category-security-guard-sup>
								</ng-container>
							</mat-accordion>
						</div>
					</div>
				</div>
			</section>
		</div>
		<div mat-dialog-actions>
			<div class="row m-0 w-100">
				<div class="col-lg-3 col-md-4 col-sm-12 mb-2">
					<button mat-stroked-button mat-dialog-close class="large" color="primary" (click)="onCancel()">Cancel</button>
				</div>
				<div class="offset-lg-6 col-lg-3 offset-md-4 col-md-4 col-sm-12 mb-2">
					<button mat-flat-button color="primary" class="large" (click)="onSave()">Save</button>
				</div>
			</div>
		</div>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class WorkerLicenceCategoryUpdateAuthenticatedModalComponent implements OnInit {
	category: WorkerCategoryTypeCode | null = null;
	isDirtyAndInvalid = false;

	validCategoryList: SelectOptions[] = WorkerCategoryTypes;

	workerCategoryTypeCodes = WorkerCategoryTypeCode;

	categoryArmouredCarGuardFormGroup: FormGroup = this.licenceApplicationService.categoryArmouredCarGuardFormGroup;
	categoryBodyArmourSalesFormGroup: FormGroup = this.licenceApplicationService.categoryBodyArmourSalesFormGroup;
	categoryClosedCircuitTelevisionInstallerFormGroup: FormGroup =
		this.licenceApplicationService.categoryClosedCircuitTelevisionInstallerFormGroup;
	categoryElectronicLockingDeviceInstallerFormGroup: FormGroup =
		this.licenceApplicationService.categoryElectronicLockingDeviceInstallerFormGroup;
	categoryFireInvestigatorFormGroup: FormGroup = this.licenceApplicationService.categoryFireInvestigatorFormGroup;
	categoryLocksmithFormGroup: FormGroup = this.licenceApplicationService.categoryLocksmithFormGroup;
	categoryPrivateInvestigatorSupFormGroup: FormGroup =
		this.licenceApplicationService.categoryPrivateInvestigatorSupFormGroup;
	categoryPrivateInvestigatorFormGroup: FormGroup = this.licenceApplicationService.categoryPrivateInvestigatorFormGroup;
	categorySecurityAlarmInstallerFormGroup: FormGroup =
		this.licenceApplicationService.categorySecurityAlarmInstallerFormGroup;
	categorySecurityConsultantFormGroup: FormGroup = this.licenceApplicationService.categorySecurityConsultantFormGroup;
	categoryLocksmithSupFormGroup: FormGroup = this.licenceApplicationService.categoryLocksmithSupFormGroup;
	categorySecurityAlarmInstallerSupFormGroup: FormGroup =
		this.licenceApplicationService.categorySecurityAlarmInstallerSupFormGroup;
	categorySecurityAlarmMonitorFormGroup: FormGroup =
		this.licenceApplicationService.categorySecurityAlarmMonitorFormGroup;
	categorySecurityAlarmResponseFormGroup: FormGroup =
		this.licenceApplicationService.categorySecurityAlarmResponseFormGroup;
	categorySecurityAlarmSalesFormGroup: FormGroup = this.licenceApplicationService.categorySecurityAlarmSalesFormGroup;
	categorySecurityGuardFormGroup: FormGroup = this.licenceApplicationService.categorySecurityGuardFormGroup;
	categorySecurityGuardSupFormGroup: FormGroup = this.licenceApplicationService.categorySecurityGuardSupFormGroup;

	constructor(
		private dialogRef: MatDialogRef<WorkerLicenceCategoryUpdateAuthenticatedModalComponent>,
		private licenceApplicationService: LicenceApplicationService,
		@Inject(MAT_DIALOG_DATA) public dialogData: LicenceCategoryDialogData
	) {}

	ngOnInit(): void {
		this.category = this.dialogData.category;
		this.validCategoryList = this.licenceApplicationService.getValidCategoryList(this.categoryList);
	}

	onSave() {
		const data: LicenceCategoryDialogData = { category: this.category };
		this.dialogRef.close({ data });
	}

	onCancel() {
		this.updateCategoryInclude(this.category, false);
		this.dialogRef.close({});
	}

	onAddCategory(event: any): void {
		this.category = event.value;
		this.updateCategoryInclude(this.category, true);
	}

	onPromptFireInvestigator() {
		// if (this.showFireInvestigator) {
		// 	return; // this has already been added
		// }
		// const data: DialogOptions = {
		// 	icon: 'warning',
		// 	title: 'Confirmation',
		// 	message: 'Would you also like to add Fire Investigator to this licence?',
		// 	actionText: 'Yes',
		// 	cancelText: 'No',
		// };
		// this.dialog
		// 	.open(DialogComponent, { data })
		// 	.afterClosed()
		// 	.subscribe((response: boolean) => {
		// 		if (response) {
		// 			this.categoryFireInvestigatorFormGroup.patchValue({ isInclude: true });
		// 			this.setValidCategoryList();
		// 		}
		// 	});
	}

	isFormValid(): boolean {
		this.categoryArmouredCarGuardFormGroup.markAllAsTouched();
		this.categoryBodyArmourSalesFormGroup.markAllAsTouched();
		this.categoryClosedCircuitTelevisionInstallerFormGroup.markAllAsTouched();
		this.categoryElectronicLockingDeviceInstallerFormGroup.markAllAsTouched();
		this.categoryFireInvestigatorFormGroup.markAllAsTouched();
		this.categoryLocksmithFormGroup.markAllAsTouched();
		this.categoryPrivateInvestigatorSupFormGroup.markAllAsTouched();
		this.categoryPrivateInvestigatorFormGroup.markAllAsTouched();
		this.categorySecurityConsultantFormGroup.markAllAsTouched();
		this.categoryLocksmithSupFormGroup.markAllAsTouched();
		this.categorySecurityAlarmInstallerFormGroup.markAllAsTouched();
		this.categorySecurityAlarmInstallerSupFormGroup.markAllAsTouched();
		this.categorySecurityAlarmMonitorFormGroup.markAllAsTouched();
		this.categorySecurityAlarmResponseFormGroup.markAllAsTouched();
		this.categorySecurityAlarmSalesFormGroup.markAllAsTouched();
		this.categorySecurityGuardFormGroup.markAllAsTouched();
		this.categorySecurityGuardSupFormGroup.markAllAsTouched();

		const isValid =
			this.categoryArmouredCarGuardFormGroup.valid &&
			this.categoryBodyArmourSalesFormGroup.valid &&
			this.categoryClosedCircuitTelevisionInstallerFormGroup.valid &&
			this.categoryElectronicLockingDeviceInstallerFormGroup.valid &&
			this.categoryFireInvestigatorFormGroup.valid &&
			this.categoryLocksmithFormGroup.valid &&
			this.categoryPrivateInvestigatorSupFormGroup.valid &&
			this.categoryPrivateInvestigatorFormGroup.valid &&
			this.categorySecurityConsultantFormGroup.valid &&
			this.categoryLocksmithSupFormGroup.valid &&
			this.categorySecurityAlarmInstallerFormGroup.valid &&
			this.categorySecurityAlarmInstallerSupFormGroup.valid &&
			this.categorySecurityAlarmMonitorFormGroup.valid &&
			this.categorySecurityAlarmResponseFormGroup.valid &&
			this.categorySecurityAlarmSalesFormGroup.valid &&
			this.categorySecurityGuardFormGroup.valid &&
			this.categorySecurityGuardSupFormGroup.valid;

		// console.debug(
		// 	this.categoryArmouredCarGuardFormGroup.valid,
		// 	this.categoryBodyArmourSalesFormGroup.valid,
		// 	this.categoryClosedCircuitTelevisionInstallerFormGroup.valid,
		// 	this.categoryElectronicLockingDeviceInstallerFormGroup.valid,
		// 	this.categoryFireInvestigatorFormGroup.valid,
		// 	this.categoryLocksmithFormGroup.valid,
		// 	this.categoryPrivateInvestigatorSupFormGroup.valid,
		// 	this.categoryPrivateInvestigatorFormGroup.valid,
		// 	this.categorySecurityConsultantFormGroup.valid,
		// 	this.categoryLocksmithSupFormGroup.valid,
		// 	this.categorySecurityAlarmInstallerFormGroup.valid,
		// 	this.categorySecurityAlarmInstallerSupFormGroup.valid,
		// 	this.categorySecurityAlarmMonitorFormGroup.valid,
		// 	this.categorySecurityAlarmResponseFormGroup.valid,
		// 	this.categorySecurityAlarmSalesFormGroup.valid,
		// 	this.categorySecurityGuardFormGroup.valid,
		// 	this.categorySecurityGuardSupFormGroup.valid
		// );

		this.isDirtyAndInvalid = this.categoryList.length == 0;
		return isValid && !this.isDirtyAndInvalid;
	}

	get categoryList(): Array<string> {
		const list: Array<string> = [];
		if (this.categoryArmouredCarGuardFormGroup.get('isInclude')?.value) {
			list.push(WorkerCategoryTypeCode.ArmouredCarGuard);
		}
		if (this.categoryBodyArmourSalesFormGroup.get('isInclude')?.value) {
			list.push(WorkerCategoryTypeCode.BodyArmourSales);
		}
		if (this.categoryClosedCircuitTelevisionInstallerFormGroup.get('isInclude')?.value) {
			list.push(WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller);
		}
		if (this.categoryElectronicLockingDeviceInstallerFormGroup.get('isInclude')?.value) {
			list.push(WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller);
		}
		if (this.categoryFireInvestigatorFormGroup.get('isInclude')?.value) {
			list.push(WorkerCategoryTypeCode.FireInvestigator);
		}
		if (this.categoryLocksmithFormGroup.get('isInclude')?.value) {
			list.push(WorkerCategoryTypeCode.Locksmith);
		}
		if (this.categoryLocksmithSupFormGroup.get('isInclude')?.value) {
			list.push(WorkerCategoryTypeCode.LocksmithUnderSupervision);
		}
		if (this.categoryPrivateInvestigatorFormGroup.get('isInclude')?.value) {
			list.push(WorkerCategoryTypeCode.PrivateInvestigator);
		}
		if (this.categoryPrivateInvestigatorSupFormGroup.get('isInclude')?.value) {
			list.push(WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision);
		}
		if (this.categorySecurityAlarmInstallerFormGroup.get('isInclude')?.value) {
			list.push(WorkerCategoryTypeCode.SecurityAlarmInstaller);
		}
		if (this.categorySecurityAlarmInstallerSupFormGroup.get('isInclude')?.value) {
			list.push(WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision);
		}
		if (this.categorySecurityAlarmMonitorFormGroup.get('isInclude')?.value) {
			list.push(WorkerCategoryTypeCode.SecurityAlarmMonitor);
		}
		if (this.categorySecurityAlarmResponseFormGroup.get('isInclude')?.value) {
			list.push(WorkerCategoryTypeCode.SecurityAlarmResponse);
		}
		if (this.categorySecurityAlarmSalesFormGroup.get('isInclude')?.value) {
			list.push(WorkerCategoryTypeCode.SecurityAlarmSales);
		}
		if (this.categorySecurityConsultantFormGroup.get('isInclude')?.value) {
			list.push(WorkerCategoryTypeCode.SecurityConsultant);
		}
		if (this.categorySecurityGuardFormGroup.get('isInclude')?.value) {
			list.push(WorkerCategoryTypeCode.SecurityGuard);
		}
		if (this.categorySecurityGuardSupFormGroup.get('isInclude')?.value) {
			list.push(WorkerCategoryTypeCode.SecurityGuardUnderSupervision);
		}

		return list;
	}

	// private setValidCategoryList(): void {
	// 	const currentList = this.categoryList;
	// 	let updatedList = this.swlCategoryTypes;
	// 	updatedList = updatedList.filter((cat) => !currentList.find((item) => item == cat.code));

	// 	this.validCategoryList = [...updatedList];
	// }

	updateCategoryInclude(category: WorkerCategoryTypeCode | null, isInclude: boolean): void {
		if (category) {
			switch (category) {
				case WorkerCategoryTypeCode.ArmouredCarGuard:
					this.categoryArmouredCarGuardFormGroup.patchValue({ isInclude });
					break;
				case WorkerCategoryTypeCode.BodyArmourSales:
					this.categoryBodyArmourSalesFormGroup.patchValue({ isInclude });
					break;
				case WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller:
					this.categoryClosedCircuitTelevisionInstallerFormGroup.patchValue({ isInclude });
					break;
				case WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller:
					this.categoryElectronicLockingDeviceInstallerFormGroup.patchValue({ isInclude });
					break;
				case WorkerCategoryTypeCode.FireInvestigator:
					this.categoryFireInvestigatorFormGroup.patchValue({ isInclude });
					break;
				case WorkerCategoryTypeCode.Locksmith:
					this.categoryLocksmithFormGroup.patchValue({ isInclude });
					break;
				case WorkerCategoryTypeCode.LocksmithUnderSupervision:
					this.categoryLocksmithSupFormGroup.patchValue({ isInclude });
					break;
				case WorkerCategoryTypeCode.PrivateInvestigator:
					this.categoryPrivateInvestigatorFormGroup.patchValue({ isInclude });
					this.onPromptFireInvestigator();
					break;
				case WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision:
					this.categoryPrivateInvestigatorSupFormGroup.patchValue({ isInclude });
					break;
				case WorkerCategoryTypeCode.SecurityGuard:
					this.categorySecurityGuardFormGroup.patchValue({ isInclude });
					break;
				case WorkerCategoryTypeCode.SecurityGuardUnderSupervision:
					this.categorySecurityGuardSupFormGroup.patchValue({ isInclude });
					break;
				case WorkerCategoryTypeCode.SecurityAlarmInstaller:
					this.categorySecurityAlarmInstallerFormGroup.patchValue({ isInclude });
					break;
				case WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision:
					this.categorySecurityAlarmInstallerSupFormGroup.patchValue({ isInclude });
					break;
				case WorkerCategoryTypeCode.SecurityAlarmMonitor:
					this.categorySecurityAlarmMonitorFormGroup.patchValue({ isInclude });
					break;
				case WorkerCategoryTypeCode.SecurityAlarmResponse:
					this.categorySecurityAlarmResponseFormGroup.patchValue({ isInclude });
					break;
				case WorkerCategoryTypeCode.SecurityAlarmSales:
					this.categorySecurityAlarmSalesFormGroup.patchValue({ isInclude });
					break;
				case WorkerCategoryTypeCode.SecurityConsultant:
					this.categorySecurityConsultantFormGroup.patchValue({ isInclude });
					break;
			}

			this.validCategoryList = this.licenceApplicationService.getValidCategoryList(this.categoryList);
			this.isDirtyAndInvalid = false;
		}
	}
}
