import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SelectOptions, SwlCategoryTypeCode, SwlCategoryTypes } from 'src/app/core/code-types/model-desc.models';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import {
	LicenceApplicationService,
	LicenceFormStepComponent,
	LicenceModelSubject,
} from '../licence-application.service';

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
						</div>
						<div class="col-xxl-3 col-xl-4 col-lg-6 col-md-6 col-sm-12">
							<button
								mat-stroked-button
								color="primary"
								class="large my-2"
								*ngIf="swlCategoryList.length < 6"
								(click)="onAddCategory()"
							>
								Add Category
							</button>
						</div>

						<mat-error class="mat-option-error" style="text-align: center;" *ngIf="isDirtyAndInvalid">
							At least one category must be selected
						</mat-error>
					</div>

					<div class="row">
						<div class="offset-xxl-2 col-xxl-8 offset-xl-1 col-xl-10 col-lg-12">
							<div class="row" *ngFor="let item of swlCategoryList; let i = index; let first = first">
								<mat-divider class="mt-4 mb-3" *ngIf="first"></mat-divider>

								<div class="col-xxl-3 col-xl-3 col-lg-3 col-md-12">
									<mat-chip-option [selectable]="false" class="mat-chip-green"> Category #{{ i + 1 }} </mat-chip-option>
								</div>
								<div class="col-xxl-6 col-xl-6 col-lg-6 col-md-12">
									<span class="category-title">{{ item.desc }}</span>
								</div>
								<div class="col-xxl-3 col-xl-3 col-lg-3 col-md-12">
									<button
										mat-stroked-button
										class="w-auto float-end"
										style="color: var(--color-red);"
										aria-label="Remove category"
										(click)="onRemove(item.code, i)"
									>
										<mat-icon>delete_outline</mat-icon>Remove
									</button>
								</div>

								<mat-divider class="my-3"></mat-divider>
							</div>
						</div>
					</div>
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
export class LicenceCategoryComponent implements OnInit, OnDestroy, LicenceFormStepComponent {
	private licenceModelLoadedSubscription!: Subscription;

	category = '';
	swlCategoryList: SelectOptions[] = [];
	isDirtyAndInvalid = false;

	validCategoryList: SelectOptions[] = SwlCategoryTypes;

	swlCategoryTypes = SwlCategoryTypes;
	swlCategoryTypeCodes = SwlCategoryTypeCode;

	constructor(private dialog: MatDialog, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.licenceModelLoadedSubscription = this.licenceApplicationService.licenceModelLoaded$.subscribe({
			next: (loaded: LicenceModelSubject) => {
				if (loaded.isLoaded) {
					this.swlCategoryList = this.licenceApplicationService.licenceModel.swlCategoryList;
					this.setValidCategoryList();
				}
			},
		});
	}

	ngOnDestroy() {
		this.licenceModelLoadedSubscription.unsubscribe();
	}

	onAddCategory(): void {
		if (this.category) {
			this.isDirtyAndInvalid = false;

			const option = this.swlCategoryTypes.find((item) => item.code == this.category)!;
			this.swlCategoryList.push({ code: option?.code, desc: option.desc });
			this.setValidCategoryList();

			this.category = '';
		}
	}

	onRemove(code: string, i: any) {
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
					const item = this.swlCategoryList.at(i);
					this.swlCategoryList.splice(i, 1);
					this.licenceApplicationService.clearLicenceCategoryData(code as SwlCategoryTypeCode);
					this.setValidCategoryList();
				}
			});
	}

	isFormValid(): boolean {
		const isValid = this.swlCategoryList.length > 0;
		this.isDirtyAndInvalid = !isValid;
		return isValid;
	}

	getDataToSave(): any {
		return { swlCategoryList: this.swlCategoryList }; // this.form.value;
	}

	private setValidCategoryList(): void {
		// TODO update to use matrix in the db.
		let updatedList = this.swlCategoryTypes;

		// if user has selected 'ArmouredCarGuard', then update the list of valid values
		if (this.swlCategoryList.find((cat) => cat.code == SwlCategoryTypeCode.ArmouredCarGuard)) {
			updatedList = updatedList.filter(
				(cat) =>
					cat.code != SwlCategoryTypeCode.ArmouredCarGuard &&
					cat.code != SwlCategoryTypeCode.SecurityGuardUnderSupervision
			);
		}

		// if user has selected 'BodyArmourSales', then update the list of valid values
		if (this.swlCategoryList.find((cat) => cat.code == SwlCategoryTypeCode.BodyArmourSales)) {
			updatedList = updatedList.filter(
				(cat) =>
					cat.code != SwlCategoryTypeCode.BodyArmourSales &&
					cat.code != SwlCategoryTypeCode.SecurityGuardUnderSupervision
			);
		}

		// if user has selected 'ClosedCircuitTelevisionInstaller', then update the list of valid values
		if (this.swlCategoryList.find((cat) => cat.code == SwlCategoryTypeCode.ClosedCircuitTelevisionInstaller)) {
			updatedList = updatedList.filter(
				(cat) =>
					cat.code != SwlCategoryTypeCode.ClosedCircuitTelevisionInstaller &&
					cat.code != SwlCategoryTypeCode.SecurityAlarmInstaller &&
					cat.code != SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision &&
					cat.code != SwlCategoryTypeCode.SecurityGuardUnderSupervision
			);
		}

		// if user has selected 'ElectronicLockingDeviceInstaller', then update the list of valid values
		if (this.swlCategoryList.find((cat) => cat.code == SwlCategoryTypeCode.ElectronicLockingDeviceInstaller)) {
			updatedList = updatedList.filter(
				(cat) =>
					cat.code != SwlCategoryTypeCode.ElectronicLockingDeviceInstaller &&
					cat.code != SwlCategoryTypeCode.Locksmith &&
					cat.code != SwlCategoryTypeCode.LocksmithUnderSupervision &&
					cat.code != SwlCategoryTypeCode.SecurityAlarmInstaller &&
					cat.code != SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision &&
					cat.code != SwlCategoryTypeCode.SecurityGuardUnderSupervision
			);
		}

		// if user has selected 'FireInvestigator', then update the list of valid values
		if (this.swlCategoryList.find((cat) => cat.code == SwlCategoryTypeCode.FireInvestigator)) {
			updatedList = updatedList.filter(
				(cat) =>
					cat.code != SwlCategoryTypeCode.PrivateInvestigator &&
					cat.code != SwlCategoryTypeCode.PrivateInvestigatorUnderSupervision &&
					cat.code != SwlCategoryTypeCode.FireInvestigator
			);
		}

		// if user has selected 'Locksmith' or 'LocksmithUnderSupervision', then update the list of valid values
		if (
			this.swlCategoryList.find(
				(cat) => cat.code == SwlCategoryTypeCode.Locksmith || cat.code == SwlCategoryTypeCode.LocksmithUnderSupervision
			)
		) {
			updatedList = updatedList.filter(
				(cat) =>
					cat.code != SwlCategoryTypeCode.ElectronicLockingDeviceInstaller &&
					cat.code != SwlCategoryTypeCode.Locksmith &&
					cat.code != SwlCategoryTypeCode.LocksmithUnderSupervision &&
					cat.code != SwlCategoryTypeCode.SecurityGuardUnderSupervision
			);
		}

		// if user has selected 'PrivateInvestigator' or 'PrivateInvestigatorUnderSupervision', then update the list of valid values
		if (
			this.swlCategoryList.find(
				(cat) =>
					cat.code == SwlCategoryTypeCode.PrivateInvestigator ||
					cat.code == SwlCategoryTypeCode.PrivateInvestigatorUnderSupervision
			)
		) {
			updatedList = updatedList.filter(
				(cat) =>
					cat.code != SwlCategoryTypeCode.FireInvestigator &&
					cat.code != SwlCategoryTypeCode.PrivateInvestigator &&
					cat.code != SwlCategoryTypeCode.PrivateInvestigatorUnderSupervision &&
					cat.code != SwlCategoryTypeCode.SecurityGuardUnderSupervision
			);
		}

		// if user has selected 'SecurityGuard', then update the list of valid values
		if (this.swlCategoryList.find((cat) => cat.code == SwlCategoryTypeCode.SecurityGuard)) {
			updatedList = updatedList.filter(
				(cat) =>
					cat.code != SwlCategoryTypeCode.SecurityAlarmMonitor &&
					cat.code != SwlCategoryTypeCode.SecurityAlarmResponse &&
					cat.code != SwlCategoryTypeCode.SecurityGuard &&
					cat.code != SwlCategoryTypeCode.SecurityGuardUnderSupervision
			);
		}

		// if user has selected 'SecurityGuardUnderSupervision', then update the list of valid values
		if (this.swlCategoryList.find((cat) => cat.code == SwlCategoryTypeCode.SecurityGuardUnderSupervision)) {
			updatedList = [];
		}

		// if user has selected 'SecurityAlarmInstaller' or 'SecurityAlarmInstallerUnderSupervision', then update the list of valid values
		if (
			this.swlCategoryList.find(
				(cat) =>
					cat.code == SwlCategoryTypeCode.SecurityAlarmInstaller ||
					cat.code == SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision
			)
		) {
			updatedList = updatedList.filter(
				(cat) =>
					cat.code != SwlCategoryTypeCode.ElectronicLockingDeviceInstaller &&
					cat.code != SwlCategoryTypeCode.SecurityAlarmInstaller &&
					cat.code != SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision &&
					cat.code != SwlCategoryTypeCode.SecurityAlarmMonitor &&
					cat.code != SwlCategoryTypeCode.SecurityAlarmResponse &&
					cat.code != SwlCategoryTypeCode.SecurityAlarmSales &&
					cat.code != SwlCategoryTypeCode.ClosedCircuitTelevisionInstaller &&
					cat.code != SwlCategoryTypeCode.SecurityGuardUnderSupervision
			);
		}

		// if user has selected 'SecurityAlarmMonitor' or 'SecurityAlarmResponse, then update the list of valid values
		if (
			this.swlCategoryList.find(
				(cat) =>
					cat.code == SwlCategoryTypeCode.SecurityAlarmMonitor || cat.code == SwlCategoryTypeCode.SecurityAlarmResponse
			)
		) {
			updatedList = updatedList.filter(
				(cat) =>
					cat.code != SwlCategoryTypeCode.SecurityAlarmMonitor &&
					cat.code != SwlCategoryTypeCode.SecurityAlarmResponse &&
					cat.code != SwlCategoryTypeCode.SecurityAlarmInstaller &&
					cat.code != SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision &&
					cat.code != SwlCategoryTypeCode.SecurityGuard &&
					cat.code != SwlCategoryTypeCode.SecurityGuardUnderSupervision
			);
		}

		// if user has selected 'SecurityAlarmSales', then update the list of valid values
		if (this.swlCategoryList.find((cat) => cat.code == SwlCategoryTypeCode.SecurityAlarmSales)) {
			updatedList = updatedList.filter(
				(cat) =>
					cat.code != SwlCategoryTypeCode.SecurityAlarmInstaller &&
					cat.code != SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision &&
					cat.code != SwlCategoryTypeCode.SecurityAlarmMonitor &&
					cat.code != SwlCategoryTypeCode.SecurityAlarmSales &&
					cat.code != SwlCategoryTypeCode.SecurityGuard &&
					cat.code != SwlCategoryTypeCode.SecurityGuardUnderSupervision
			);
		}

		// if user has selected 'SecurityConsultant', then update the list of valid values
		if (this.swlCategoryList.find((cat) => cat.code == SwlCategoryTypeCode.SecurityConsultant)) {
			updatedList = updatedList.filter(
				(cat) =>
					cat.code != SwlCategoryTypeCode.SecurityConsultant &&
					cat.code != SwlCategoryTypeCode.SecurityGuardUnderSupervision
			);
		}

		this.validCategoryList = [...updatedList];
		// console.log('updatedList', this.validCategoryList);
	}
}
