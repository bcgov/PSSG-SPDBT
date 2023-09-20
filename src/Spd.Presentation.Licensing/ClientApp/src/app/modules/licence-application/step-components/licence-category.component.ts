import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectOptions } from 'src/app/core/code-types/model-desc.models';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import {
	LicenceApplicationService,
	LicenceFormStepComponent,
	SwlCategoryTypeCode,
	SwlCategoryTypes,
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

					<div class="row mt-4">
						<div class="offset-xxl-2 col-xxl-8 offset-xl-1 col-xl-10 col-lg-12">
							<div class="row" *ngFor="let item of swlCategoryList; let i = index">
								<div class="col-9">
									<mat-chip-option [selectable]="false" class="mat-chip-green me-4"> {{ i + 1 }} </mat-chip-option>
									<span class="title">{{ item.desc }}</span>
								</div>
								<div class="col-3">
									<button
										mat-stroked-button
										class="w-auto float-end"
										style="color: var(--color-red);"
										aria-label="Remove category"
										(click)="onRemove(i)"
									>
										<mat-icon>delete_outline</mat-icon>Remove
									</button>
								</div>
								<mat-divider class="my-2"></mat-divider>
							</div>
							<!-- <br /><br /><br /><br />

							<mat-accordion multi="false">
								<mat-expansion-panel class="my-3" [expanded]="true" *ngFor="let item of swlCategoryList; let i = index">
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
											<div [ngSwitch]="item.code">
												<div *ngSwitchCase="swlCategoryTypeCodes.ArmouredCarGuard">
													<ng-container *ngTemplateOutlet="ArmouredCarGuard"></ng-container>
												</div>
												<div *ngSwitchCase="swlCategoryTypeCodes.BodyArmourSales">
													<ng-container *ngTemplateOutlet="BodyArmourSales"></ng-container>
												</div>
												<div *ngSwitchCase="swlCategoryTypeCodes.ClosedCircuitTelevisionInstaller">
													<ng-container *ngTemplateOutlet="ClosedCircuitTelevisionInstaller"></ng-container>
												</div>
												<div *ngSwitchCase="swlCategoryTypeCodes.ElectronicLockingDeviceInstaller">
													<ng-container *ngTemplateOutlet="ElectronicLockingDeviceInstaller"></ng-container>
												</div>
												<div *ngSwitchCase="swlCategoryTypeCodes.FireInvestigator">
													<ng-container *ngTemplateOutlet="FireInvestigator"></ng-container>
												</div>
												<div *ngSwitchCase="swlCategoryTypeCodes.Locksmith">
													<ng-container *ngTemplateOutlet="Locksmith"></ng-container>
												</div>
												<div *ngSwitchCase="swlCategoryTypeCodes.LocksmithUnderSupervision">
													<ng-container *ngTemplateOutlet="LocksmithUnderSupervision"></ng-container>
												</div>
												<div *ngSwitchCase="swlCategoryTypeCodes.PrivateInvestigator">
													<ng-container *ngTemplateOutlet="PrivateInvestigator"></ng-container>
												</div>
												<div *ngSwitchCase="swlCategoryTypeCodes.PrivateInvestigatorUnderSupervision">
													<ng-container *ngTemplateOutlet="PrivateInvestigatorUnderSupervision"></ng-container>
												</div>
												<div *ngSwitchCase="swlCategoryTypeCodes.SecurityAlarmInstallerUnderSupervision">
													<ng-container *ngTemplateOutlet="SecurityAlarmInstallerUnderSupervision"></ng-container>
												</div>
												<div *ngSwitchCase="swlCategoryTypeCodes.SecurityAlarmInstaller">
													<ng-container *ngTemplateOutlet="SecurityAlarmInstaller"></ng-container>
												</div>
												<div *ngSwitchCase="swlCategoryTypeCodes.SecurityAlarmMonitor">
													<ng-container *ngTemplateOutlet="SecurityAlarmMonitor"></ng-container>
												</div>
												<div *ngSwitchCase="swlCategoryTypeCodes.SecurityAlarmResponse">
													<ng-container *ngTemplateOutlet="SecurityAlarmResponse"></ng-container>
												</div>
												<div *ngSwitchCase="swlCategoryTypeCodes.SecurityAlarmSales">
													<ng-container *ngTemplateOutlet="SecurityAlarmSales"></ng-container>
												</div>
												<div *ngSwitchCase="swlCategoryTypeCodes.SecurityConsultant">
													<ng-container *ngTemplateOutlet="SecurityConsultant"></ng-container>
												</div>
												<div *ngSwitchCase="swlCategoryTypeCodes.SecurityGuard">
													<ng-container *ngTemplateOutlet="SecurityGuard"></ng-container>
												</div>
												<div *ngSwitchCase="swlCategoryTypeCodes.SecurityGuardUnderSupervision">
													<ng-container *ngTemplateOutlet="SecurityGuardUnderSupervision"></ng-container>
												</div>
											</div>
										</div>
									</div>
								</mat-expansion-panel>
							</mat-accordion> -->
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- <ng-template #ArmouredCarGuard>
			<mat-checkbox checked="true"> ARMOURED_CAR_GUARD </mat-checkbox>
		</ng-template>

		<ng-template #BodyArmourSales> BODY_ARMOUR_SALES </ng-template>

		<ng-template #ClosedCircuitTelevisionInstaller> CLOSED_CIRCUIT </ng-template>

		<ng-template #ElectronicLockingDeviceInstaller> ELECTRONIC_LOCKING </ng-template>

		<ng-template #FireInvestigator> FIRE_INVESTIGATOR </ng-template>

		<ng-template #Locksmith> LOCKSMITH </ng-template>

		<ng-template #LocksmithUnderSupervision> LOCKSMITH_UNDER_SUP </ng-template>

		<ng-template #PrivateInvestigator> PI </ng-template>

		<ng-template #PrivateInvestigatorUnderSupervision> PI_UNDER_SUP </ng-template>

		<ng-template #SecurityAlarmInstallerUnderSupervision> SA_INSTALLER_UNDER_SUP </ng-template>

		<ng-template #SecurityAlarmInstaller> SA_INSTALLER </ng-template>

		<ng-template #SecurityAlarmMonitor> SA_MONITOR </ng-template>

		<ng-template #SecurityAlarmResponse> SA_RESPONSE </ng-template>

		<ng-template #SecurityAlarmSales> SA_SALES </ng-template>

		<ng-template #SecurityConsultant> SECURITY_CONSULTANT </ng-template>

		<ng-template #SecurityGuard> SECURITY_GUARD </ng-template>

		<ng-template #SecurityGuardUnderSupervision> SECURITY_GUARD_UNDER_SUP </ng-template> -->
	`,
	styles: [],
})
export class LicenceCategoryComponent implements OnInit, LicenceFormStepComponent {
	category = '';
	swlCategoryList: SelectOptions[] = [];
	isDirtyAndInvalid = false;

	validCategoryList: SelectOptions[] = SwlCategoryTypes;

	swlCategoryTypes = SwlCategoryTypes;
	swlCategoryTypeCodes = SwlCategoryTypeCode;

	constructor(private dialog: MatDialog, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.licenceApplicationService.licenceModelLoaded$.subscribe({
			next: (loaded: boolean) => {
				if (loaded) {
					this.swlCategoryList = this.licenceApplicationService.licenceModel.swlCategoryList;
					this.setValidCategoryList();
				}
			},
		});
	}

	onAddCategory(): void {
		if (this.category) {
			this.isDirtyAndInvalid = false;

			const option = this.swlCategoryTypes.find((item) => item.code == this.category)!;
			this.swlCategoryList.push({ code: option?.code, desc: option.desc });
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
					this.swlCategoryList.splice(i, 1);
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
					cat.code != SwlCategoryTypeCode.SecurityGuard && cat.code != SwlCategoryTypeCode.SecurityGuardUnderSupervision
			);
		}

		this.validCategoryList = [...updatedList];
		console.log('updatedList', this.validCategoryList);
	}
}
