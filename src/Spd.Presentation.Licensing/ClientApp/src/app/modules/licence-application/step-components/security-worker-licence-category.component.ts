import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { SelectOptions } from 'src/app/core/code-types/model-desc.models';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';

export enum SwlLicenceCategoryTypeCode {
	ArmouredCarGuard = 'ARMOURED_CAR_GUARD',
	BodyArmourSales = 'BODY_AMOUR_SALES',
	ClosedCircuitTelevisionInstaller = 'CLOSED_CIRCUIT',
	ElectronicLockingDeviceInstaller = 'ELECTRONIC_LOCKING',
	FireInvestigator = 'FIRE_INVESTIGATOR',
	Locksmith = 'LOCKSMITH',
	LocksmithUnderSupervision = 'LOCKSMITH_UNDER_SUP',
	PrivateInvestigator = 'PI',
	PrivateInvestigatorUnderSupervision = 'PI_UNDER_SUP',
	SecurityGuard = 'SECURITY_GUARD',
	SecurityGuardUnderSupervision = 'SECURITY_GUARD_UNDER_SUP',
	SecurityAlarmInstallerUnderSupervision = 'SA_INSTALLER_UNDER_SUP',
	SecurityAlarmInstaller = 'SA_INSTALLER',
	SecurityAlarmMonitor = 'SA_MONITOR',
	SecurityAlarmResponse = 'SA_RESPONSE',
	SecurityAlarmSales = 'SA_SALES',
	SecurityConsultant = 'SECURITY_CONSULTANT',
}

export const SwlLicenceCategoryTypes: SelectOptions[] = [
	{ desc: 'Armoured Car Guard', code: SwlLicenceCategoryTypeCode.ArmouredCarGuard },
	{ desc: 'Body Armour Sales', code: SwlLicenceCategoryTypeCode.BodyArmourSales },
	{ desc: 'Closed Circuit Television Installer', code: SwlLicenceCategoryTypeCode.ClosedCircuitTelevisionInstaller },
	{ desc: 'Electronic Locking Device Installer', code: SwlLicenceCategoryTypeCode.ElectronicLockingDeviceInstaller },
	{ desc: 'Fire Investigator', code: SwlLicenceCategoryTypeCode.FireInvestigator },
	{ desc: 'Locksmith', code: SwlLicenceCategoryTypeCode.Locksmith },
	{ desc: 'Locksmith - Under Supervision', code: SwlLicenceCategoryTypeCode.LocksmithUnderSupervision },
	{ desc: 'Private Investigator', code: SwlLicenceCategoryTypeCode.PrivateInvestigator },
	{
		desc: 'Private Investigator - Under Supervision',
		code: SwlLicenceCategoryTypeCode.PrivateInvestigatorUnderSupervision,
	},
	{ desc: 'Security Guard', code: SwlLicenceCategoryTypeCode.SecurityGuard },
	{ desc: 'Security Guard - Under Supervision', code: SwlLicenceCategoryTypeCode.SecurityGuardUnderSupervision },
	{ desc: 'Security Alarm Installer', code: SwlLicenceCategoryTypeCode.SecurityAlarmInstaller },
	{
		desc: 'Security Alarm Installer - Under Supervision',
		code: SwlLicenceCategoryTypeCode.SecurityAlarmInstallerUnderSupervision,
	},
	{ desc: 'Security Alarm Monitor', code: SwlLicenceCategoryTypeCode.SecurityAlarmMonitor },
	{ desc: 'Security Alarm Response', code: SwlLicenceCategoryTypeCode.SecurityAlarmResponse },
	{ desc: 'Security Alarm Sales', code: SwlLicenceCategoryTypeCode.SecurityAlarmSales },
	{ desc: 'Security Consultant', code: SwlLicenceCategoryTypeCode.SecurityConsultant },
];

@Component({
	selector: 'app-security-worker-licence-category',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title
					title="What category of Security Worker Licence are you applying for?"
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
						</div>
						<div class="col-xxl-3 col-xl-4 col-lg-6 col-md-6 col-sm-12">
							<button
								mat-stroked-button
								color="primary"
								class="large my-2"
								*ngIf="categoryList.length < 6"
								(click)="onAddCategory()"
							>
								Add Category
							</button>
						</div>
					</div>

					<div class="row">
						<div class="offset-xxl-2 col-xxl-8 offset-xl-1 col-xl-10 col-lg-12">
							<mat-accordion multi="false">
								<mat-expansion-panel class="my-3" [expanded]="true" *ngFor="let item of categoryList; let i = index">
									<mat-expansion-panel-header>
										<mat-panel-title>
											<mat-chip-listbox class="me-4">
												<mat-chip-option [selectable]="false" class="mat-chip-green"> {{ i + 1 }} </mat-chip-option>
											</mat-chip-listbox>
											<span class="title" style="white-space:nowrap">{{ item.desc }}</span>
										</mat-panel-title>
									</mat-expansion-panel-header>
									<div class="row my-3">
										<div class="col-12 mx-auto">
											<button
												mat-stroked-button
												class="w-auto float-end"
												style="color: var(--color-red);"
												aria-label="Remove category"
												(click)="onRemove(i)"
											>
												<mat-icon>delete_outline</mat-icon>Remove this Category
											</button>
										</div>
									</div>
									<div class="row">
										<div class="col-12">
											<mat-checkbox checked="true">
												{{ item.desc }}
											</mat-checkbox>
										</div>
									</div>
								</mat-expansion-panel>
							</mat-accordion>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class SecurityWorkerLicenceCategoryComponent {
	category = '';
	categoryList: any[] = [];

	validCategoryList: SelectOptions[] = SwlLicenceCategoryTypes;

	swlLicenceCategoryTypes = SwlLicenceCategoryTypes;

	constructor(private dialog: MatDialog, private hotToast: HotToastService) {}

	onAddCategory(): void {
		if (this.category) {
			// const isFound = this.categoryList.find((item) => item.code == this.category);
			// if (isFound) {
			// 	this.hotToast.error(`'${isFound.desc}' has already been added`);
			// 	return;
			// }

			const option = this.swlLicenceCategoryTypes.find((item) => item.code == this.category)!;
			this.categoryList.push({ code: option?.code, desc: option.desc });

			this.setValidCategoryList();
		}
	}

	onRemove(i: any) {
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
					this.categoryList.splice(i, 1);

					this.setValidCategoryList();
				}
			});
	}

	setValidCategoryList(): void {
		let updatedList = this.swlLicenceCategoryTypes;

		// if user has selected 'ArmouredCarGuard', then update the list of valid values
		if (this.categoryList.find((cat) => cat.code == SwlLicenceCategoryTypeCode.ArmouredCarGuard)) {
			updatedList = updatedList.filter(
				(cat) =>
					cat.code != SwlLicenceCategoryTypeCode.ArmouredCarGuard &&
					cat.code != SwlLicenceCategoryTypeCode.SecurityGuardUnderSupervision
			);
		}

		// if user has selected 'BodyArmourSales', then update the list of valid values
		if (this.categoryList.find((cat) => cat.code == SwlLicenceCategoryTypeCode.BodyArmourSales)) {
			updatedList = updatedList.filter(
				(cat) =>
					cat.code != SwlLicenceCategoryTypeCode.BodyArmourSales &&
					cat.code != SwlLicenceCategoryTypeCode.SecurityGuardUnderSupervision
			);
		}

		// if user has selected 'ClosedCircuitTelevisionInstaller', then update the list of valid values
		if (this.categoryList.find((cat) => cat.code == SwlLicenceCategoryTypeCode.ClosedCircuitTelevisionInstaller)) {
			updatedList = updatedList.filter(
				(cat) =>
					cat.code != SwlLicenceCategoryTypeCode.ClosedCircuitTelevisionInstaller &&
					cat.code != SwlLicenceCategoryTypeCode.SecurityAlarmInstaller &&
					cat.code != SwlLicenceCategoryTypeCode.SecurityAlarmInstallerUnderSupervision &&
					cat.code != SwlLicenceCategoryTypeCode.SecurityGuardUnderSupervision
			);
		}

		// if user has selected 'ElectronicLockingDeviceInstaller', then update the list of valid values
		if (this.categoryList.find((cat) => cat.code == SwlLicenceCategoryTypeCode.ElectronicLockingDeviceInstaller)) {
			updatedList = updatedList.filter(
				(cat) =>
					cat.code != SwlLicenceCategoryTypeCode.ElectronicLockingDeviceInstaller &&
					cat.code != SwlLicenceCategoryTypeCode.Locksmith &&
					cat.code != SwlLicenceCategoryTypeCode.LocksmithUnderSupervision &&
					cat.code != SwlLicenceCategoryTypeCode.SecurityAlarmInstaller &&
					cat.code != SwlLicenceCategoryTypeCode.SecurityAlarmInstallerUnderSupervision &&
					cat.code != SwlLicenceCategoryTypeCode.SecurityGuardUnderSupervision
			);
		}

		// if user has selected 'FireInvestigator', then update the list of valid values
		if (this.categoryList.find((cat) => cat.code == SwlLicenceCategoryTypeCode.FireInvestigator)) {
			updatedList = updatedList.filter(
				(cat) =>
					cat.code != SwlLicenceCategoryTypeCode.PrivateInvestigator &&
					cat.code != SwlLicenceCategoryTypeCode.PrivateInvestigatorUnderSupervision &&
					cat.code != SwlLicenceCategoryTypeCode.FireInvestigator
			);
		}

		// if user has selected 'Locksmith' or 'LocksmithUnderSupervision', then update the list of valid values
		if (
			this.categoryList.find(
				(cat) =>
					cat.code == SwlLicenceCategoryTypeCode.Locksmith ||
					cat.code == SwlLicenceCategoryTypeCode.LocksmithUnderSupervision
			)
		) {
			updatedList = updatedList.filter(
				(cat) =>
					cat.code != SwlLicenceCategoryTypeCode.ElectronicLockingDeviceInstaller &&
					cat.code != SwlLicenceCategoryTypeCode.Locksmith &&
					cat.code != SwlLicenceCategoryTypeCode.LocksmithUnderSupervision &&
					cat.code != SwlLicenceCategoryTypeCode.SecurityGuardUnderSupervision
			);
		}

		// if user has selected 'PrivateInvestigator' or 'PrivateInvestigatorUnderSupervision', then update the list of valid values
		if (
			this.categoryList.find(
				(cat) =>
					cat.code == SwlLicenceCategoryTypeCode.PrivateInvestigator ||
					cat.code == SwlLicenceCategoryTypeCode.PrivateInvestigatorUnderSupervision
			)
		) {
			updatedList = updatedList.filter(
				(cat) =>
					cat.code != SwlLicenceCategoryTypeCode.FireInvestigator &&
					cat.code != SwlLicenceCategoryTypeCode.PrivateInvestigator &&
					cat.code != SwlLicenceCategoryTypeCode.PrivateInvestigatorUnderSupervision &&
					cat.code != SwlLicenceCategoryTypeCode.SecurityGuardUnderSupervision
			);
		}

		// if user has selected 'SecurityGuard', then update the list of valid values
		if (this.categoryList.find((cat) => cat.code == SwlLicenceCategoryTypeCode.SecurityGuard)) {
			updatedList = updatedList.filter(
				(cat) =>
					cat.code != SwlLicenceCategoryTypeCode.SecurityAlarmMonitor &&
					cat.code != SwlLicenceCategoryTypeCode.SecurityAlarmResponse &&
					cat.code != SwlLicenceCategoryTypeCode.SecurityGuard &&
					cat.code != SwlLicenceCategoryTypeCode.SecurityGuardUnderSupervision
			);
		}

		// if user has selected 'SecurityGuardUnderSupervision', then update the list of valid values
		if (this.categoryList.find((cat) => cat.code == SwlLicenceCategoryTypeCode.SecurityGuardUnderSupervision)) {
			updatedList = [];
		}

		// if user has selected 'SecurityAlarmInstaller' or 'SecurityAlarmInstallerUnderSupervision', then update the list of valid values
		if (
			this.categoryList.find(
				(cat) =>
					cat.code == SwlLicenceCategoryTypeCode.SecurityAlarmInstaller ||
					cat.code == SwlLicenceCategoryTypeCode.SecurityAlarmInstallerUnderSupervision
			)
		) {
			updatedList = updatedList.filter(
				(cat) =>
					cat.code != SwlLicenceCategoryTypeCode.ElectronicLockingDeviceInstaller &&
					cat.code != SwlLicenceCategoryTypeCode.SecurityAlarmInstaller &&
					cat.code != SwlLicenceCategoryTypeCode.SecurityAlarmInstallerUnderSupervision &&
					cat.code != SwlLicenceCategoryTypeCode.SecurityAlarmMonitor &&
					cat.code != SwlLicenceCategoryTypeCode.SecurityAlarmResponse &&
					cat.code != SwlLicenceCategoryTypeCode.SecurityAlarmSales &&
					cat.code != SwlLicenceCategoryTypeCode.ClosedCircuitTelevisionInstaller &&
					cat.code != SwlLicenceCategoryTypeCode.SecurityGuardUnderSupervision
			);
		}

		// if user has selected 'SecurityAlarmMonitor' or 'SecurityAlarmResponse, then update the list of valid values
		if (
			this.categoryList.find(
				(cat) =>
					cat.code == SwlLicenceCategoryTypeCode.SecurityAlarmMonitor ||
					cat.code == SwlLicenceCategoryTypeCode.SecurityAlarmResponse
			)
		) {
			updatedList = updatedList.filter(
				(cat) =>
					cat.code != SwlLicenceCategoryTypeCode.SecurityAlarmMonitor &&
					cat.code != SwlLicenceCategoryTypeCode.SecurityAlarmResponse &&
					cat.code != SwlLicenceCategoryTypeCode.SecurityAlarmInstaller &&
					cat.code != SwlLicenceCategoryTypeCode.SecurityAlarmInstallerUnderSupervision &&
					cat.code != SwlLicenceCategoryTypeCode.SecurityGuard &&
					cat.code != SwlLicenceCategoryTypeCode.SecurityGuardUnderSupervision
			);
		}

		// if user has selected 'SecurityAlarmSales', then update the list of valid values
		if (this.categoryList.find((cat) => cat.code == SwlLicenceCategoryTypeCode.SecurityAlarmSales)) {
			updatedList = updatedList.filter(
				(cat) =>
					cat.code != SwlLicenceCategoryTypeCode.SecurityAlarmInstaller &&
					cat.code != SwlLicenceCategoryTypeCode.SecurityAlarmInstallerUnderSupervision &&
					cat.code != SwlLicenceCategoryTypeCode.SecurityAlarmMonitor &&
					cat.code != SwlLicenceCategoryTypeCode.SecurityAlarmSales &&
					cat.code != SwlLicenceCategoryTypeCode.SecurityGuard &&
					cat.code != SwlLicenceCategoryTypeCode.SecurityGuardUnderSupervision
			);
		}

		// if user has selected 'SecurityConsultant', then update the list of valid values
		if (this.categoryList.find((cat) => cat.code == SwlLicenceCategoryTypeCode.SecurityConsultant)) {
			updatedList = updatedList.filter(
				(cat) =>
					cat.code != SwlLicenceCategoryTypeCode.SecurityGuard &&
					cat.code != SwlLicenceCategoryTypeCode.SecurityGuardUnderSupervision
			);
		}

		console.log('updatedList', this.validCategoryList);

		this.validCategoryList = [...updatedList];
	}
}
