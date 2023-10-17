import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SelectOptions, SwlCategoryTypeCode, SwlCategoryTypes } from 'src/app/core/code-types/model-desc.models';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import { LicenceApplicationService, LicenceFormStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-licence-category',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title
					title="Which categories of Security Worker Licence are you applying for?"
					subtitle="You can add up to a total of 6 categories"
				></app-step-title>
				<div class="step-container">
					<div class="row">
						<div class="offset-xxl-2 col-xxl-5 offset-xl-1 col-xl-6 col-lg-6 col-md-6 col-sm-12">
							<mat-form-field>
								<mat-label>Category</mat-label>
								<mat-select [(ngModel)]="category">
									<mat-option *ngFor="let item of validCategoryList" [value]="item.code">
										{{ item.desc }}
									</mat-option>
								</mat-select>
							</mat-form-field>
							<mat-error class="mat-option-error" *ngIf="isDirtyAndInvalid">
								At least one category must be added
							</mat-error>
						</div>
						<div class="col-xxl-3 col-xl-4 col-lg-6 col-md-6 col-sm-12" *ngIf="categoryList.length < 6">
							<button mat-stroked-button color="primary" class="large my-2" (click)="onAddCategory()">
								Add Category
							</button>
						</div>
					</div>

					<!-- <form [formGroup]="form" novalidate> -->
					<div class="row">
						<div class="offset-xxl-2 col-xxl-8 offset-xl-1 col-xl-10 col-lg-12">
							<ng-container *ngFor="let category of categoryList; let i = index; let first = first">
								<div class="row">
									<mat-divider class="mt-4 mb-2" *ngIf="first"></mat-divider>
									<div class="col-lg-9 col-md-12">
										<span class="category-title">{{ category.desc }}</span>
									</div>
									<div class="col-lg-3 col-md-12">
										<button
											mat-stroked-button
											class="w-auto float-end"
											style="color: var(--color-red);"
											aria-label="Remove category"
											(click)="onRemove(category.code)"
										>
											<mat-icon>delete_outline</mat-icon>Remove
										</button>
									</div>

									<mat-divider class="my-2"></mat-divider>
								</div>
							</ng-container>
						</div>
					</div>
					<!-- </form> -->
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.category-title {
				font-size: 1.3em;
				font-weight: 400;
				color: var(--color-primary);
			}
		`,
	],
})
export class LicenceCategoryComponent implements OnInit, LicenceFormStepComponent {
	// form: FormGroup = this.licenceApplicationService.categoriesFormGroup;

	category = '';
	isDirtyAndInvalid = false;

	validCategoryList: SelectOptions[] = SwlCategoryTypes;

	swlCategoryTypes = SwlCategoryTypes;
	swlCategoryTypeCodes = SwlCategoryTypeCode;

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

	constructor(private dialog: MatDialog, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.setValidCategoryList();
	}

	onAddCategory(): void {
		if (this.category) {
			switch (this.category) {
				case SwlCategoryTypeCode.ArmouredCarGuard:
					this.categoryArmouredCarGuardFormGroup.patchValue({ isInclude: true });
					break;
				case SwlCategoryTypeCode.BodyArmourSales:
					this.categoryBodyArmourSalesFormGroup.patchValue({ isInclude: true });
					break;
				case SwlCategoryTypeCode.ClosedCircuitTelevisionInstaller:
					this.categoryClosedCircuitTelevisionInstallerFormGroup.patchValue({ isInclude: true });
					break;
				case SwlCategoryTypeCode.ElectronicLockingDeviceInstaller:
					this.categoryElectronicLockingDeviceInstallerFormGroup.patchValue({ isInclude: true });
					break;
				case SwlCategoryTypeCode.FireInvestigator:
					this.categoryFireInvestigatorFormGroup.patchValue({ isInclude: true });
					break;
				case SwlCategoryTypeCode.Locksmith:
					this.categoryLocksmithFormGroup.patchValue({ isInclude: true });
					break;
				case SwlCategoryTypeCode.LocksmithUnderSupervision:
					this.categoryLocksmithSupFormGroup.patchValue({ isInclude: true });
					break;
				case SwlCategoryTypeCode.PrivateInvestigator:
					this.categoryPrivateInvestigatorFormGroup.patchValue({ isInclude: true });
					break;
				case SwlCategoryTypeCode.PrivateInvestigatorUnderSupervision:
					this.categoryPrivateInvestigatorSupFormGroup.patchValue({ isInclude: true });
					break;
				case SwlCategoryTypeCode.SecurityGuard:
					this.categorySecurityGuardFormGroup.patchValue({ isInclude: true });
					break;
				case SwlCategoryTypeCode.SecurityGuardUnderSupervision:
					this.categorySecurityGuardSupFormGroup.patchValue({ isInclude: true });
					break;
				case SwlCategoryTypeCode.SecurityAlarmInstaller:
					this.categorySecurityAlarmInstallerFormGroup.patchValue({ isInclude: true });
					break;
				case SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision:
					this.categorySecurityAlarmInstallerSupFormGroup.patchValue({ isInclude: true });
					break;
				case SwlCategoryTypeCode.SecurityAlarmMonitor:
					this.categorySecurityAlarmMonitorFormGroup.patchValue({ isInclude: true });
					break;
				case SwlCategoryTypeCode.SecurityAlarmResponse:
					this.categorySecurityAlarmResponseFormGroup.patchValue({ isInclude: true });
					break;
				case SwlCategoryTypeCode.SecurityAlarmSales:
					this.categorySecurityAlarmSalesFormGroup.patchValue({ isInclude: true });
					break;
				case SwlCategoryTypeCode.SecurityConsultant:
					this.categorySecurityConsultantFormGroup.patchValue({ isInclude: true });
					break;
			}

			this.setValidCategoryList();

			this.category = '';
			this.isDirtyAndInvalid = false;
		}
	}

	onRemove(code: string) {
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: 'Are you sure you want to remove this category?',
			actionText: 'Yes',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					switch (code) {
						case SwlCategoryTypeCode.ArmouredCarGuard:
							this.categoryArmouredCarGuardFormGroup.patchValue({ isInclude: false });
							break;
						case SwlCategoryTypeCode.BodyArmourSales:
							this.categoryBodyArmourSalesFormGroup.patchValue({ isInclude: false });
							break;
						case SwlCategoryTypeCode.ClosedCircuitTelevisionInstaller:
							this.categoryClosedCircuitTelevisionInstallerFormGroup.patchValue({ isInclude: false });
							break;
						case SwlCategoryTypeCode.ElectronicLockingDeviceInstaller:
							this.categoryElectronicLockingDeviceInstallerFormGroup.patchValue({ isInclude: false });
							break;
						case SwlCategoryTypeCode.FireInvestigator:
							this.categoryFireInvestigatorFormGroup.patchValue({ isInclude: false });
							break;
						case SwlCategoryTypeCode.Locksmith:
							this.categoryLocksmithFormGroup.patchValue({ isInclude: false });
							break;
						case SwlCategoryTypeCode.LocksmithUnderSupervision:
							this.categoryLocksmithSupFormGroup.patchValue({ isInclude: false });
							break;
						case SwlCategoryTypeCode.PrivateInvestigator:
							this.categoryPrivateInvestigatorFormGroup.patchValue({ isInclude: false });
							break;
						case SwlCategoryTypeCode.PrivateInvestigatorUnderSupervision:
							this.categoryPrivateInvestigatorSupFormGroup.patchValue({ isInclude: false });
							break;
						case SwlCategoryTypeCode.SecurityGuard:
							this.categorySecurityGuardFormGroup.patchValue({ isInclude: false });
							break;
						case SwlCategoryTypeCode.SecurityGuardUnderSupervision:
							this.categorySecurityGuardSupFormGroup.patchValue({ isInclude: false });
							break;
						case SwlCategoryTypeCode.SecurityAlarmInstaller:
							this.categorySecurityAlarmInstallerFormGroup.patchValue({ isInclude: false });
							break;
						case SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision:
							this.categorySecurityAlarmInstallerSupFormGroup.patchValue({ isInclude: false });
							break;
						case SwlCategoryTypeCode.SecurityAlarmMonitor:
							this.categorySecurityAlarmMonitorFormGroup.patchValue({ isInclude: false });
							break;
						case SwlCategoryTypeCode.SecurityAlarmResponse:
							this.categorySecurityAlarmResponseFormGroup.patchValue({ isInclude: false });
							break;
						case SwlCategoryTypeCode.SecurityAlarmSales:
							this.categorySecurityAlarmSalesFormGroup.patchValue({ isInclude: false });
							break;
						case SwlCategoryTypeCode.SecurityConsultant:
							this.categorySecurityConsultantFormGroup.patchValue({ isInclude: false });
							break;
					}

					this.setValidCategoryList();
					this.isDirtyAndInvalid = false;
				}
			});
	}

	isFormValid(): boolean {
		const isValid = this.categoryList.length > 0;
		this.isDirtyAndInvalid = !isValid;
		// this.form.markAllAsTouched();
		return isValid;
	}

	get categoryList(): Array<SelectOptions> {
		const list: Array<SelectOptions> = [];
		if (this.categoryArmouredCarGuardFormGroup.get('isInclude')?.value) {
			const element = this.swlCategoryTypes.find((item) => item.code == SwlCategoryTypeCode.ArmouredCarGuard);
			if (element) list.push(element);
		}

		if (this.categoryBodyArmourSalesFormGroup.get('isInclude')?.value) {
			const element = this.swlCategoryTypes.find((item) => item.code == SwlCategoryTypeCode.BodyArmourSales);
			if (element) list.push(element);
		}
		if (this.categoryClosedCircuitTelevisionInstallerFormGroup.get('isInclude')?.value) {
			const element = this.swlCategoryTypes.find(
				(item) => item.code == SwlCategoryTypeCode.ClosedCircuitTelevisionInstaller
			);
			if (element) list.push(element);
		}
		if (this.categoryElectronicLockingDeviceInstallerFormGroup.get('isInclude')?.value) {
			const element = this.swlCategoryTypes.find(
				(item) => item.code == SwlCategoryTypeCode.ElectronicLockingDeviceInstaller
			);
			if (element) list.push(element);
		}
		if (this.categoryFireInvestigatorFormGroup.get('isInclude')?.value) {
			const element = this.swlCategoryTypes.find((item) => item.code == SwlCategoryTypeCode.FireInvestigator);
			if (element) list.push(element);
		}
		if (this.categoryLocksmithFormGroup.get('isInclude')?.value) {
			const element = this.swlCategoryTypes.find((item) => item.code == SwlCategoryTypeCode.Locksmith);
			if (element) list.push(element);
		}
		if (this.categoryLocksmithSupFormGroup.get('isInclude')?.value) {
			const element = this.swlCategoryTypes.find((item) => item.code == SwlCategoryTypeCode.LocksmithUnderSupervision);
			if (element) list.push(element);
		}
		if (this.categoryPrivateInvestigatorFormGroup.get('isInclude')?.value) {
			const element = this.swlCategoryTypes.find((item) => item.code == SwlCategoryTypeCode.PrivateInvestigator);
			if (element) list.push(element);
		}
		if (this.categoryPrivateInvestigatorSupFormGroup.get('isInclude')?.value) {
			const element = this.swlCategoryTypes.find(
				(item) => item.code == SwlCategoryTypeCode.PrivateInvestigatorUnderSupervision
			);
			if (element) list.push(element);
		}
		if (this.categorySecurityAlarmInstallerFormGroup.get('isInclude')?.value) {
			const element = this.swlCategoryTypes.find((item) => item.code == SwlCategoryTypeCode.SecurityAlarmInstaller);
			if (element) list.push(element);
		}
		if (this.categorySecurityAlarmInstallerSupFormGroup.get('isInclude')?.value) {
			const element = this.swlCategoryTypes.find(
				(item) => item.code == SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision
			);
			if (element) list.push(element);
		}
		if (this.categorySecurityAlarmMonitorFormGroup.get('isInclude')?.value) {
			const element = this.swlCategoryTypes.find((item) => item.code == SwlCategoryTypeCode.SecurityAlarmMonitor);
			if (element) list.push(element);
		}
		if (this.categorySecurityAlarmResponseFormGroup.get('isInclude')?.value) {
			const element = this.swlCategoryTypes.find((item) => item.code == SwlCategoryTypeCode.SecurityAlarmResponse);
			if (element) list.push(element);
		}
		if (this.categorySecurityAlarmSalesFormGroup.get('isInclude')?.value) {
			const element = this.swlCategoryTypes.find((item) => item.code == SwlCategoryTypeCode.SecurityAlarmSales);
			if (element) list.push(element);
		}
		if (this.categorySecurityConsultantFormGroup.get('isInclude')?.value) {
			const element = this.swlCategoryTypes.find((item) => item.code == SwlCategoryTypeCode.SecurityConsultant);
			if (element) list.push(element);
		}
		if (this.categorySecurityGuardFormGroup.get('isInclude')?.value) {
			const element = this.swlCategoryTypes.find((item) => item.code == SwlCategoryTypeCode.SecurityGuard);
			if (element) list.push(element);
		}
		if (this.categorySecurityGuardSupFormGroup.get('isInclude')?.value) {
			const element = this.swlCategoryTypes.find(
				(item) => item.code == SwlCategoryTypeCode.SecurityGuardUnderSupervision
			);
			if (element) list.push(element);
		}

		return list;
	}

	private setValidCategoryList(): void {
		const currentList = this.categoryList;
		let updatedList = this.swlCategoryTypes;
		updatedList = updatedList.filter((cat) => !currentList.find((xxx) => xxx.code == cat.code));
		this.validCategoryList = [...updatedList];

		// TODO update to use matrix in the db.
		// let updatedList = this.swlCategoryTypes;
		// // if user has selected 'ArmouredCarGuard', then update the list of valid values
		// if (this.swlCategoryList.find((cat) => cat.code == SwlCategoryTypeCode.ArmouredCarGuard)) {
		// 	updatedList = updatedList.filter(
		// 		(cat) =>
		// 			cat.code != SwlCategoryTypeCode.ArmouredCarGuard &&
		// 			cat.code != SwlCategoryTypeCode.SecurityGuardUnderSupervision
		// 	);
		// }
		// // if user has selected 'BodyArmourSales', then update the list of valid values
		// if (this.swlCategoryList.find((cat) => cat.code == SwlCategoryTypeCode.BodyArmourSales)) {
		// 	updatedList = updatedList.filter(
		// 		(cat) =>
		// 			cat.code != SwlCategoryTypeCode.BodyArmourSales &&
		// 			cat.code != SwlCategoryTypeCode.SecurityGuardUnderSupervision
		// 	);
		// }
		// // if user has selected 'ClosedCircuitTelevisionInstaller', then update the list of valid values
		// if (this.swlCategoryList.find((cat) => cat.code == SwlCategoryTypeCode.ClosedCircuitTelevisionInstaller)) {
		// 	updatedList = updatedList.filter(
		// 		(cat) =>
		// 			cat.code != SwlCategoryTypeCode.ClosedCircuitTelevisionInstaller &&
		// 			cat.code != SwlCategoryTypeCode.SecurityAlarmInstaller &&
		// 			cat.code != SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision &&
		// 			cat.code != SwlCategoryTypeCode.SecurityGuardUnderSupervision
		// 	);
		// }
		// // if user has selected 'ElectronicLockingDeviceInstaller', then update the list of valid values
		// if (this.swlCategoryList.find((cat) => cat.code == SwlCategoryTypeCode.ElectronicLockingDeviceInstaller)) {
		// 	updatedList = updatedList.filter(
		// 		(cat) =>
		// 			cat.code != SwlCategoryTypeCode.ElectronicLockingDeviceInstaller &&
		// 			cat.code != SwlCategoryTypeCode.Locksmith &&
		// 			cat.code != SwlCategoryTypeCode.LocksmithUnderSupervision &&
		// 			cat.code != SwlCategoryTypeCode.SecurityAlarmInstaller &&
		// 			cat.code != SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision &&
		// 			cat.code != SwlCategoryTypeCode.SecurityGuardUnderSupervision
		// 	);
		// }
		// // if user has selected 'FireInvestigator', then update the list of valid values
		// if (this.swlCategoryList.find((cat) => cat.code == SwlCategoryTypeCode.FireInvestigator)) {
		// 	updatedList = updatedList.filter(
		// 		(cat) =>
		// 			cat.code != SwlCategoryTypeCode.PrivateInvestigator &&
		// 			cat.code != SwlCategoryTypeCode.PrivateInvestigatorUnderSupervision &&
		// 			cat.code != SwlCategoryTypeCode.FireInvestigator
		// 	);
		// }
		// // if user has selected 'Locksmith' or 'LocksmithUnderSupervision', then update the list of valid values
		// if (
		// 	this.swlCategoryList.find(
		// 		(cat) => cat.code == SwlCategoryTypeCode.Locksmith || cat.code == SwlCategoryTypeCode.LocksmithUnderSupervision
		// 	)
		// ) {
		// 	updatedList = updatedList.filter(
		// 		(cat) =>
		// 			cat.code != SwlCategoryTypeCode.ElectronicLockingDeviceInstaller &&
		// 			cat.code != SwlCategoryTypeCode.Locksmith &&
		// 			cat.code != SwlCategoryTypeCode.LocksmithUnderSupervision &&
		// 			cat.code != SwlCategoryTypeCode.SecurityGuardUnderSupervision
		// 	);
		// }
		// // if user has selected 'PrivateInvestigator' or 'PrivateInvestigatorUnderSupervision', then update the list of valid values
		// if (
		// 	this.swlCategoryList.find(
		// 		(cat) =>
		// 			cat.code == SwlCategoryTypeCode.PrivateInvestigator ||
		// 			cat.code == SwlCategoryTypeCode.PrivateInvestigatorUnderSupervision
		// 	)
		// ) {
		// 	updatedList = updatedList.filter(
		// 		(cat) =>
		// 			cat.code != SwlCategoryTypeCode.FireInvestigator &&
		// 			cat.code != SwlCategoryTypeCode.PrivateInvestigator &&
		// 			cat.code != SwlCategoryTypeCode.PrivateInvestigatorUnderSupervision &&
		// 			cat.code != SwlCategoryTypeCode.SecurityGuardUnderSupervision
		// 	);
		// }
		// // if user has selected 'SecurityGuard', then update the list of valid values
		// if (this.swlCategoryList.find((cat) => cat.code == SwlCategoryTypeCode.SecurityGuard)) {
		// 	updatedList = updatedList.filter(
		// 		(cat) =>
		// 			cat.code != SwlCategoryTypeCode.SecurityAlarmMonitor &&
		// 			cat.code != SwlCategoryTypeCode.SecurityAlarmResponse &&
		// 			cat.code != SwlCategoryTypeCode.SecurityGuard &&
		// 			cat.code != SwlCategoryTypeCode.SecurityGuardUnderSupervision
		// 	);
		// }
		// // if user has selected 'SecurityGuardUnderSupervision', then update the list of valid values
		// if (this.swlCategoryList.find((cat) => cat.code == SwlCategoryTypeCode.SecurityGuardUnderSupervision)) {
		// 	updatedList = [];
		// }
		// // if user has selected 'SecurityAlarmInstaller' or 'SecurityAlarmInstallerUnderSupervision', then update the list of valid values
		// if (
		// 	this.swlCategoryList.find(
		// 		(cat) =>
		// 			cat.code == SwlCategoryTypeCode.SecurityAlarmInstaller ||
		// 			cat.code == SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision
		// 	)
		// ) {
		// 	updatedList = updatedList.filter(
		// 		(cat) =>
		// 			cat.code != SwlCategoryTypeCode.ElectronicLockingDeviceInstaller &&
		// 			cat.code != SwlCategoryTypeCode.SecurityAlarmInstaller &&
		// 			cat.code != SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision &&
		// 			cat.code != SwlCategoryTypeCode.SecurityAlarmMonitor &&
		// 			cat.code != SwlCategoryTypeCode.SecurityAlarmResponse &&
		// 			cat.code != SwlCategoryTypeCode.SecurityAlarmSales &&
		// 			cat.code != SwlCategoryTypeCode.ClosedCircuitTelevisionInstaller &&
		// 			cat.code != SwlCategoryTypeCode.SecurityGuardUnderSupervision
		// 	);
		// }
		// // if user has selected 'SecurityAlarmMonitor' or 'SecurityAlarmResponse, then update the list of valid values
		// if (
		// 	this.swlCategoryList.find(
		// 		(cat) =>
		// 			cat.code == SwlCategoryTypeCode.SecurityAlarmMonitor || cat.code == SwlCategoryTypeCode.SecurityAlarmResponse
		// 	)
		// ) {
		// 	updatedList = updatedList.filter(
		// 		(cat) =>
		// 			cat.code != SwlCategoryTypeCode.SecurityAlarmMonitor &&
		// 			cat.code != SwlCategoryTypeCode.SecurityAlarmResponse &&
		// 			cat.code != SwlCategoryTypeCode.SecurityAlarmInstaller &&
		// 			cat.code != SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision &&
		// 			cat.code != SwlCategoryTypeCode.SecurityGuard &&
		// 			cat.code != SwlCategoryTypeCode.SecurityGuardUnderSupervision
		// 	);
		// }
		// // if user has selected 'SecurityAlarmSales', then update the list of valid values
		// if (this.swlCategoryList.find((cat) => cat.code == SwlCategoryTypeCode.SecurityAlarmSales)) {
		// 	updatedList = updatedList.filter(
		// 		(cat) =>
		// 			cat.code != SwlCategoryTypeCode.SecurityAlarmInstaller &&
		// 			cat.code != SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision &&
		// 			cat.code != SwlCategoryTypeCode.SecurityAlarmMonitor &&
		// 			cat.code != SwlCategoryTypeCode.SecurityAlarmSales &&
		// 			cat.code != SwlCategoryTypeCode.SecurityGuard &&
		// 			cat.code != SwlCategoryTypeCode.SecurityGuardUnderSupervision
		// 	);
		// }
		// // if user has selected 'SecurityConsultant', then update the list of valid values
		// if (this.swlCategoryList.find((cat) => cat.code == SwlCategoryTypeCode.SecurityConsultant)) {
		// 	updatedList = updatedList.filter(
		// 		(cat) =>
		// 			cat.code != SwlCategoryTypeCode.SecurityConsultant &&
		// 			cat.code != SwlCategoryTypeCode.SecurityGuardUnderSupervision
		// 	);
		// }
		// this.validCategoryList = [...updatedList];
		// console.log('updatedList', this.validCategoryList);
	}
}
