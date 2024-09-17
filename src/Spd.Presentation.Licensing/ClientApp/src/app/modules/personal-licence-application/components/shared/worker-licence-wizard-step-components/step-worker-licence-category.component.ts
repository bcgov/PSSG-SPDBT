import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationTypeCode, WorkerCategoryTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
import { SelectOptions, WorkerCategoryTypes } from '@app/core/code-types/model-desc.models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';

@Component({
	selector: 'app-step-worker-licence-category',
	template: `
		<app-step-section
			[title]="title"
			[subtitle]="infoTitle"
			[isRenewalOrUpdate]="isRenewalOrUpdate"
			[workerLicenceTypeCode]="workerLicenceTypes.SecurityWorkerLicence"
			[applicationTypeCode]="applicationTypeCode"
		>
			<div class="row">
				<div class="offset-xxl-2 col-xxl-8 offset-xl-2 col-xl-8 col-lg-12 mx-auto">
					<div class="row">
						<div class="col-md-8 col-sm-12">
							<mat-form-field>
								<mat-label>Category</mat-label>
								<mat-select [(ngModel)]="category">
									<mat-option *ngFor="let item of validCategoryList; let i = index" [value]="item.code">
										{{ item.desc }}
									</mat-option>
								</mat-select>
							</mat-form-field>
							<mat-error class="mat-option-error" *ngIf="isDirtyAndInvalid">
								At least one category must be added. Click 'Add Category' after selection.
							</mat-error>
						</div>
						<div class="col-md-4 col-sm-12" *ngIf="categoryList.length < 6">
							<button mat-stroked-button color="primary" class="large my-2" (click)="onAddCategory()">
								Add Category
							</button>
						</div>
					</div>
				</div>
			</div>

			<div class="row">
				<div class="col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<mat-accordion multi="false">
						<ng-container *ngIf="showArmouredCarGuard">
							<div class="row">
								<div
									class="col-md-12 col-sm-12"
									[ngClass]="blockArmouredCarGuard ? 'col-xl-10 col-lg-9' : 'col-xl-12 col-lg-12'"
								>
									<mat-expansion-panel
										[hideToggle]="blockArmouredCarGuard"
										class="my-3 w-100"
										[ngClass]="{ 'disabled-pointer': blockArmouredCarGuard }"
										[expanded]="expandArmouredCarGuard"
									>
										<mat-expansion-panel-header>
											<mat-panel-title>
												<mat-icon
													class="error-icon"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="
														categoryArmouredCarGuardFormGroup?.touched && categoryArmouredCarGuardFormGroup?.invalid
													"
													>error</mat-icon
												>
												{{ workerCategoryTypeCodes.ArmouredCarGuard | options : 'WorkerCategoryTypes' }}
											</mat-panel-title>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="xlarge w-auto float-end"
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.ArmouredCarGuard)"
												>
													<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>
										<app-licence-category-armoured-car-guard></app-licence-category-armoured-car-guard>
									</mat-expansion-panel>
								</div>

								<div class="col-xl-2 col-lg-3 col-md-12 col-sm-12" *ngIf="blockArmouredCarGuard">
									<button
										mat-stroked-button
										class="large delete-button my-lg-3"
										aria-label="Remove category"
										(click)="onDeselect(workerCategoryTypeCodes.ArmouredCarGuard)"
									>
										<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove
									</button>
								</div>
							</div>
						</ng-container>

						<ng-container *ngIf="showBodyArmourSales">
							<div class="row">
								<div
									class="col-md-12 col-sm-12"
									[ngClass]="blockBodyArmourSales ? 'col-xl-10 col-lg-9' : 'col-xl-12 col-lg-12'"
								>
									<mat-expansion-panel
										[hideToggle]="blockBodyArmourSales"
										class="my-3 w-100"
										[ngClass]="{ 'disabled-pointer': blockBodyArmourSales }"
										[expanded]="expandBodyArmourSales"
									>
										<mat-expansion-panel-header>
											<mat-panel-title>
												<mat-icon
													class="error-icon"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="categoryBodyArmourSalesFormGroup?.touched && categoryBodyArmourSalesFormGroup?.invalid"
													>error</mat-icon
												>
												{{ workerCategoryTypeCodes.BodyArmourSales | options : 'WorkerCategoryTypes' }}
											</mat-panel-title>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="xlarge w-auto float-end"
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.BodyArmourSales)"
												>
													<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>
										<app-licence-category-body-armour-sales></app-licence-category-body-armour-sales>
									</mat-expansion-panel>
								</div>

								<div class="col-xl-2 col-lg-3 col-md-12 col-sm-12" *ngIf="blockBodyArmourSales">
									<button
										mat-stroked-button
										class="large delete-button my-lg-3"
										aria-label="Remove category"
										(click)="onDeselect(workerCategoryTypeCodes.BodyArmourSales)"
									>
										<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove
									</button>
								</div>
							</div>
						</ng-container>

						<ng-container *ngIf="showClosedCircuitTelevisionInstaller">
							<div class="row">
								<div
									class="col-md-12 col-sm-12"
									[ngClass]="blockClosedCircuitTelevisionInstaller ? 'col-xl-10 col-lg-9' : 'col-xl-12 col-lg-12'"
								>
									<mat-expansion-panel
										[hideToggle]="blockClosedCircuitTelevisionInstaller"
										class="my-3 w-100"
										[ngClass]="{ 'disabled-pointer': blockClosedCircuitTelevisionInstaller }"
										[expanded]="expandClosedCircuitTelevisionInstaller"
									>
										<mat-expansion-panel-header>
											<mat-panel-title>
												<mat-icon
													class="error-icon"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="
														categoryClosedCircuitTelevisionInstallerFormGroup?.touched &&
														categoryClosedCircuitTelevisionInstallerFormGroup?.invalid
													"
													>error</mat-icon
												>
												{{ workerCategoryTypeCodes.ClosedCircuitTelevisionInstaller | options : 'WorkerCategoryTypes' }}
											</mat-panel-title>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="xlarge w-auto float-end"
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.ClosedCircuitTelevisionInstaller)"
												>
													<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>

										<app-licence-category-closed-circuit-television-installer></app-licence-category-closed-circuit-television-installer>
									</mat-expansion-panel>
								</div>

								<div class="col-xl-2 col-lg-3 col-md-12 col-sm-12" *ngIf="blockClosedCircuitTelevisionInstaller">
									<button
										mat-stroked-button
										class="large delete-button my-lg-3"
										aria-label="Remove category"
										(click)="onDeselect(workerCategoryTypeCodes.ClosedCircuitTelevisionInstaller)"
									>
										<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove
									</button>
								</div>
							</div>
						</ng-container>

						<ng-container *ngIf="showElectronicLockingDeviceInstaller">
							<div class="row">
								<div
									class="col-md-12 col-sm-12"
									[ngClass]="blockElectronicLockingDeviceInstaller ? 'col-xl-10 col-lg-9' : 'col-xl-12 col-lg-12'"
								>
									<mat-expansion-panel
										[hideToggle]="blockElectronicLockingDeviceInstaller"
										class="my-3 w-100"
										[ngClass]="{ 'disabled-pointer': blockElectronicLockingDeviceInstaller }"
										[expanded]="expandElectronicLockingDeviceInstaller"
									>
										<mat-expansion-panel-header>
											<mat-panel-title>
												<mat-icon
													class="error-icon"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="
														categoryElectronicLockingDeviceInstallerFormGroup?.touched &&
														categoryElectronicLockingDeviceInstallerFormGroup?.invalid
													"
													>error</mat-icon
												>
												{{ workerCategoryTypeCodes.ElectronicLockingDeviceInstaller | options : 'WorkerCategoryTypes' }}
											</mat-panel-title>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="xlarge w-auto float-end"
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.ElectronicLockingDeviceInstaller)"
												>
													<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>

										<app-licence-category-electronic-locking-device-installer></app-licence-category-electronic-locking-device-installer>
									</mat-expansion-panel>
								</div>

								<div class="col-xl-2 col-lg-3 col-md-12 col-sm-12" *ngIf="blockElectronicLockingDeviceInstaller">
									<button
										mat-stroked-button
										class="large delete-button my-lg-3"
										aria-label="Remove category"
										(click)="onDeselect(workerCategoryTypeCodes.ElectronicLockingDeviceInstaller)"
									>
										<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove
									</button>
								</div>
							</div>
						</ng-container>

						<ng-container *ngIf="showFireInvestigator">
							<div class="row">
								<div
									class="col-md-12 col-sm-12"
									[ngClass]="blockFireInvestigator ? 'col-xl-10 col-lg-9' : 'col-xl-12 col-lg-12'"
								>
									<mat-expansion-panel
										[hideToggle]="blockFireInvestigator"
										class="my-3 w-100"
										[ngClass]="{ 'disabled-pointer': blockFireInvestigator }"
										[expanded]="expandFireInvestigator"
									>
										<mat-expansion-panel-header>
											<mat-panel-title>
												<mat-icon
													class="error-icon"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="
														categoryFireInvestigatorFormGroup?.touched && categoryFireInvestigatorFormGroup?.invalid
													"
													>error</mat-icon
												>
												{{ workerCategoryTypeCodes.FireInvestigator | options : 'WorkerCategoryTypes' }}
											</mat-panel-title>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="xlarge w-auto float-end"
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.FireInvestigator)"
												>
													<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>

										<app-licence-category-fire-investigator></app-licence-category-fire-investigator>
									</mat-expansion-panel>
								</div>

								<div class="col-xl-2 col-lg-3 col-md-12 col-sm-12" *ngIf="blockFireInvestigator">
									<button
										mat-stroked-button
										class="large delete-button my-lg-3"
										aria-label="Remove category"
										(click)="onDeselect(workerCategoryTypeCodes.FireInvestigator)"
									>
										<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove
									</button>
								</div>
							</div>
						</ng-container>

						<ng-container *ngIf="showLocksmith">
							<div class="row">
								<div
									class="col-md-12 col-sm-12"
									[ngClass]="blockLocksmith ? 'col-xl-10 col-lg-9' : 'col-xl-12 col-lg-12'"
								>
									<mat-expansion-panel
										[hideToggle]="blockLocksmith"
										class="my-3 w-100"
										[ngClass]="{ 'disabled-pointer': blockLocksmith }"
										[expanded]="expandLocksmith"
									>
										<mat-expansion-panel-header>
											<mat-panel-title>
												<mat-icon
													class="error-icon"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="categoryLocksmithFormGroup?.touched && categoryLocksmithFormGroup?.invalid"
													>error</mat-icon
												>

												{{ workerCategoryTypeCodes.Locksmith | options : 'WorkerCategoryTypes' }}
											</mat-panel-title>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="xlarge w-auto float-end"
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.Locksmith)"
												>
													<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>

										<app-licence-category-locksmith></app-licence-category-locksmith>
									</mat-expansion-panel>
								</div>

								<div class="col-xl-2 col-lg-3 col-md-12 col-sm-12" *ngIf="blockLocksmith">
									<button
										mat-stroked-button
										class="large delete-button my-lg-3"
										aria-label="Remove category"
										(click)="onDeselect(workerCategoryTypeCodes.Locksmith)"
									>
										<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove
									</button>
								</div>
							</div>
						</ng-container>

						<ng-container *ngIf="showLocksmithUnderSupervision">
							<div class="row">
								<div
									class="col-md-12 col-sm-12"
									[ngClass]="blockLocksmithUnderSupervision ? 'col-xl-10 col-lg-9' : 'col-xl-12 col-lg-12'"
								>
									<mat-expansion-panel
										[hideToggle]="blockLocksmithUnderSupervision"
										class="my-3 w-100"
										[ngClass]="{ 'disabled-pointer': blockLocksmithUnderSupervision }"
										[expanded]="expandLocksmithUnderSupervision"
									>
										<mat-expansion-panel-header>
											<mat-panel-title>
												<mat-icon
													class="error-icon"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="categoryLocksmithSupFormGroup?.touched && categoryLocksmithSupFormGroup?.invalid"
													>error</mat-icon
												>{{ workerCategoryTypeCodes.LocksmithUnderSupervision | options : 'WorkerCategoryTypes' }}
											</mat-panel-title>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="xlarge w-auto float-end"
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.LocksmithUnderSupervision)"
												>
													<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>

										<app-licence-category-locksmith-sup></app-licence-category-locksmith-sup>
									</mat-expansion-panel>
								</div>

								<div class="col-xl-2 col-lg-3 col-md-12 col-sm-12" *ngIf="blockLocksmithUnderSupervision">
									<button
										mat-stroked-button
										class="large delete-button my-lg-3"
										aria-label="Remove category"
										(click)="onDeselect(workerCategoryTypeCodes.LocksmithUnderSupervision)"
									>
										<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove
									</button>
								</div>
							</div>
						</ng-container>

						<ng-container *ngIf="showPrivateInvestigator">
							<div class="row">
								<div
									class="col-md-12 col-sm-12"
									[ngClass]="blockPrivateInvestigator ? 'col-xl-10 col-lg-9' : 'col-xl-12 col-lg-12'"
								>
									<mat-expansion-panel
										[hideToggle]="blockPrivateInvestigator"
										class="my-3 w-100"
										[ngClass]="{ 'disabled-pointer': blockPrivateInvestigator }"
										[expanded]="expandPrivateInvestigator"
									>
										<mat-expansion-panel-header>
											<mat-panel-title>
												<mat-icon
													class="error-icon"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="
														categoryPrivateInvestigatorFormGroup?.touched &&
														categoryPrivateInvestigatorFormGroup?.invalid
													"
													>error</mat-icon
												>{{ workerCategoryTypeCodes.PrivateInvestigator | options : 'WorkerCategoryTypes' }}
											</mat-panel-title>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="xlarge w-auto float-end"
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.PrivateInvestigator)"
												>
													<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>

										<app-licence-category-private-investigator></app-licence-category-private-investigator>
									</mat-expansion-panel>
								</div>

								<div class="col-xl-2 col-lg-3 col-md-12 col-sm-12" *ngIf="blockPrivateInvestigator">
									<button
										mat-stroked-button
										class="large delete-button my-lg-3"
										aria-label="Remove category"
										(click)="onDeselect(workerCategoryTypeCodes.PrivateInvestigator)"
									>
										<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove
									</button>
								</div>
							</div>
						</ng-container>

						<ng-container *ngIf="showPrivateInvestigatorUnderSupervision">
							<div class="row">
								<div
									class="col-md-12 col-sm-12"
									[ngClass]="blockPrivateInvestigatorUnderSupervision ? 'col-xl-10 col-lg-9' : 'col-xl-12 col-lg-12'"
								>
									<mat-expansion-panel
										[hideToggle]="blockPrivateInvestigatorUnderSupervision"
										class="my-3 w-100"
										[ngClass]="{ 'disabled-pointer': blockPrivateInvestigatorUnderSupervision }"
										[expanded]="expandPrivateInvestigatorUnderSupervision"
									>
										<mat-expansion-panel-header>
											<mat-panel-title>
												<mat-icon
													class="error-icon"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="
														categoryPrivateInvestigatorSupFormGroup?.touched &&
														categoryPrivateInvestigatorSupFormGroup?.invalid
													"
													>error</mat-icon
												>
												{{
													workerCategoryTypeCodes.PrivateInvestigatorUnderSupervision | options : 'WorkerCategoryTypes'
												}}
											</mat-panel-title>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="xlarge w-auto float-end"
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.PrivateInvestigatorUnderSupervision)"
												>
													<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>

										<app-licence-category-private-investigator-sup></app-licence-category-private-investigator-sup>
									</mat-expansion-panel>
								</div>

								<div class="col-xl-2 col-lg-3 col-md-12 col-sm-12" *ngIf="blockPrivateInvestigatorUnderSupervision">
									<button
										mat-stroked-button
										class="large delete-button my-lg-3"
										aria-label="Remove category"
										(click)="onDeselect(workerCategoryTypeCodes.PrivateInvestigatorUnderSupervision)"
									>
										<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove
									</button>
								</div>
							</div>
						</ng-container>

						<ng-container *ngIf="showSecurityAlarmInstaller">
							<div class="row">
								<div
									class="col-md-12 col-sm-12"
									[ngClass]="blockSecurityAlarmInstaller ? 'col-xl-10 col-lg-9' : 'col-xl-12 col-lg-12'"
								>
									<mat-expansion-panel
										[hideToggle]="blockSecurityAlarmInstaller"
										class="my-3 w-100"
										[ngClass]="{ 'disabled-pointer': blockSecurityAlarmInstaller }"
										[expanded]="expandSecurityAlarmInstaller"
									>
										<mat-expansion-panel-header>
											<mat-panel-title>
												<mat-icon
													class="error-icon"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="
														categorySecurityAlarmInstallerFormGroup?.touched &&
														categorySecurityAlarmInstallerFormGroup?.invalid
													"
													>error</mat-icon
												>

												{{ workerCategoryTypeCodes.SecurityAlarmInstaller | options : 'WorkerCategoryTypes' }}
											</mat-panel-title>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="xlarge w-auto float-end"
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.SecurityAlarmInstaller)"
												>
													<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>

										<app-licence-category-security-alarm-installer></app-licence-category-security-alarm-installer>
									</mat-expansion-panel>
								</div>

								<div class="col-xl-2 col-lg-3 col-md-12 col-sm-12" *ngIf="blockSecurityAlarmInstaller">
									<button
										mat-stroked-button
										class="large delete-button my-lg-3"
										aria-label="Remove category"
										(click)="onDeselect(workerCategoryTypeCodes.SecurityAlarmInstaller)"
									>
										<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove
									</button>
								</div>
							</div>
						</ng-container>

						<ng-container *ngIf="showSecurityAlarmInstallerUnderSupervision">
							<div class="row">
								<div
									class="col-md-12 col-sm-12"
									[ngClass]="blockSecurityAlarmInstallerUnderSupervision ? 'col-xl-10 col-lg-9' : 'col-xl-12 col-lg-12'"
								>
									<mat-expansion-panel
										[hideToggle]="blockSecurityAlarmInstallerUnderSupervision"
										class="my-3 w-100"
										[ngClass]="{ 'disabled-pointer': blockSecurityAlarmInstallerUnderSupervision }"
										[expanded]="expandSecurityAlarmInstallerUnderSupervision"
									>
										<mat-expansion-panel-header>
											<mat-panel-title>
												<mat-icon
													class="error-icon"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="
														categorySecurityAlarmInstallerSupFormGroup?.touched &&
														categorySecurityAlarmInstallerSupFormGroup?.invalid
													"
													>error</mat-icon
												>{{
													workerCategoryTypeCodes.SecurityAlarmInstallerUnderSupervision
														| options : 'WorkerCategoryTypes'
												}}
											</mat-panel-title>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="xlarge w-auto float-end"
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.SecurityAlarmInstallerUnderSupervision)"
												>
													<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>

										<app-licence-category-security-alarm-installer-sup></app-licence-category-security-alarm-installer-sup>
									</mat-expansion-panel>
								</div>

								<div class="col-xl-2 col-lg-3 col-md-12 col-sm-12" *ngIf="blockSecurityAlarmInstallerUnderSupervision">
									<button
										mat-stroked-button
										class="large delete-button my-lg-3"
										aria-label="Remove category"
										(click)="onDeselect(workerCategoryTypeCodes.SecurityAlarmInstallerUnderSupervision)"
									>
										<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove
									</button>
								</div>
							</div>
						</ng-container>

						<ng-container *ngIf="showSecurityAlarmMonitor">
							<div class="row">
								<div
									class="col-md-12 col-sm-12"
									[ngClass]="blockSecurityAlarmMonitor ? 'col-xl-10 col-lg-9' : 'col-xl-12 col-lg-12'"
								>
									<mat-expansion-panel
										[hideToggle]="blockSecurityAlarmMonitor"
										class="my-3 w-100"
										[ngClass]="{ 'disabled-pointer': blockSecurityAlarmMonitor }"
										[expanded]="expandSecurityAlarmMonitor"
									>
										<mat-expansion-panel-header>
											<mat-panel-title>
												<mat-icon
													class="error-icon"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="
														categorySecurityAlarmMonitorFormGroup?.touched &&
														categorySecurityAlarmMonitorFormGroup?.invalid
													"
													>error</mat-icon
												>

												{{ workerCategoryTypeCodes.SecurityAlarmMonitor | options : 'WorkerCategoryTypes' }}
											</mat-panel-title>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="xlarge w-auto float-end"
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.SecurityAlarmMonitor)"
												>
													<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>

										<app-licence-category-security-alarm-monitor></app-licence-category-security-alarm-monitor>
									</mat-expansion-panel>
								</div>

								<div class="col-xl-2 col-lg-3 col-md-12 col-sm-12" *ngIf="blockSecurityAlarmMonitor">
									<button
										mat-stroked-button
										class="large delete-button my-lg-3"
										aria-label="Remove category"
										(click)="onDeselect(workerCategoryTypeCodes.SecurityAlarmMonitor)"
									>
										<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove
									</button>
								</div>
							</div>
						</ng-container>

						<ng-container *ngIf="showSecurityAlarmResponse">
							<div class="row">
								<div
									class="col-md-12 col-sm-12"
									[ngClass]="blockSecurityAlarmResponse ? 'col-xl-10 col-lg-9' : 'col-xl-12 col-lg-12'"
								>
									<mat-expansion-panel
										[hideToggle]="blockSecurityAlarmResponse"
										class="my-3 w-100"
										[ngClass]="{ 'disabled-pointer': blockSecurityAlarmResponse }"
										[expanded]="expandSecurityAlarmResponse"
									>
										<mat-expansion-panel-header>
											<mat-panel-title>
												<mat-icon
													class="error-icon"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="
														categorySecurityAlarmResponseFormGroup?.touched &&
														categorySecurityAlarmResponseFormGroup?.invalid
													"
													>error</mat-icon
												>

												{{ workerCategoryTypeCodes.SecurityAlarmResponse | options : 'WorkerCategoryTypes' }}
											</mat-panel-title>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="xlarge w-auto float-end"
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.SecurityAlarmResponse)"
												>
													<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>

										<app-licence-category-security-alarm-response></app-licence-category-security-alarm-response>
									</mat-expansion-panel>
								</div>

								<div class="col-xl-2 col-lg-3 col-md-12 col-sm-12" *ngIf="blockSecurityAlarmResponse">
									<button
										mat-stroked-button
										class="large delete-button my-lg-3"
										aria-label="Remove category"
										(click)="onDeselect(workerCategoryTypeCodes.SecurityAlarmResponse)"
									>
										<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove
									</button>
								</div>
							</div>
						</ng-container>

						<ng-container *ngIf="showSecurityAlarmSales">
							<div class="row">
								<div
									class="col-md-12 col-sm-12"
									[ngClass]="blockSecurityAlarmSales ? 'col-xl-10 col-lg-9' : 'col-xl-12 col-lg-12'"
								>
									<mat-expansion-panel
										[hideToggle]="blockSecurityAlarmSales"
										class="my-3 w-100"
										[ngClass]="{ 'disabled-pointer': blockSecurityAlarmSales }"
										[expanded]="expandSecurityAlarmSales"
									>
										<mat-expansion-panel-header>
											<mat-panel-title>
												<mat-icon
													class="error-icon"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="
														categorySecurityAlarmSalesFormGroup?.touched && categorySecurityAlarmSalesFormGroup?.invalid
													"
													>error</mat-icon
												>{{ workerCategoryTypeCodes.SecurityAlarmSales | options : 'WorkerCategoryTypes' }}
											</mat-panel-title>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="xlarge w-auto float-end"
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.SecurityAlarmSales)"
												>
													<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>

										<app-licence-category-security-alarm-sales></app-licence-category-security-alarm-sales>
									</mat-expansion-panel>
								</div>

								<div class="col-xl-2 col-lg-3 col-md-12 col-sm-12" *ngIf="blockSecurityAlarmSales">
									<button
										mat-stroked-button
										class="large delete-button my-lg-3"
										aria-label="Remove category"
										(click)="onDeselect(workerCategoryTypeCodes.SecurityAlarmSales)"
									>
										<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove
									</button>
								</div>
							</div>
						</ng-container>

						<ng-container *ngIf="showSecurityConsultant">
							<div class="row">
								<div
									class="col-md-12 col-sm-12"
									[ngClass]="blockSecurityConsultant ? 'col-xl-10 col-lg-9' : 'col-xl-12 col-lg-12'"
								>
									<mat-expansion-panel
										[hideToggle]="blockSecurityConsultant"
										class="my-3 w-100"
										[ngClass]="{ 'disabled-pointer': blockSecurityConsultant }"
										[expanded]="expandSecurityConsultant"
									>
										<mat-expansion-panel-header>
											<mat-panel-title>
												<mat-icon
													class="error-icon"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="
														categorySecurityConsultantFormGroup?.touched && categorySecurityConsultantFormGroup?.invalid
													"
													>error</mat-icon
												>{{ workerCategoryTypeCodes.SecurityConsultant | options : 'WorkerCategoryTypes' }}
											</mat-panel-title>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="xlarge w-auto float-end"
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.SecurityConsultant)"
												>
													<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>

										<app-licence-category-security-consultant></app-licence-category-security-consultant>
									</mat-expansion-panel>
								</div>

								<div class="col-xl-2 col-lg-3 col-md-12 col-sm-12" *ngIf="blockSecurityConsultant">
									<button
										mat-stroked-button
										class="large delete-button my-lg-3"
										aria-label="Remove category"
										(click)="onDeselect(workerCategoryTypeCodes.SecurityConsultant)"
									>
										<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove
									</button>
								</div>
							</div>
						</ng-container>

						<ng-container *ngIf="showSecurityGuard">
							<div class="row">
								<div
									class="col-md-12 col-sm-12"
									[ngClass]="blockSecurityGuard ? 'col-xl-10 col-lg-9' : 'col-xl-12 col-lg-12'"
								>
									<mat-expansion-panel
										[hideToggle]="blockSecurityGuard"
										class="my-3 w-100"
										[ngClass]="{ 'disabled-pointer': blockSecurityGuard }"
										[expanded]="expandSecurityGuard"
									>
										<mat-expansion-panel-header>
											<mat-panel-title>
												<mat-icon
													class="error-icon"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="categorySecurityGuardFormGroup?.touched && categorySecurityGuardFormGroup?.invalid"
													>error</mat-icon
												>{{ workerCategoryTypeCodes.SecurityGuard | options : 'WorkerCategoryTypes' }}
											</mat-panel-title>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="xlarge w-auto float-end"
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.SecurityGuard)"
												>
													<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>
										<app-licence-category-security-guard></app-licence-category-security-guard>
									</mat-expansion-panel>
								</div>

								<div class="col-xl-2 col-lg-3 col-md-12 col-sm-12" *ngIf="blockSecurityGuard">
									<button
										mat-stroked-button
										class="large delete-button my-lg-3"
										aria-label="Remove category"
										(click)="onDeselect(workerCategoryTypeCodes.SecurityGuard)"
									>
										<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove
									</button>
								</div>
							</div>
						</ng-container>

						<ng-container *ngIf="showSecurityGuardUnderSupervision">
							<div class="row">
								<div
									class="col-md-12 col-sm-12"
									[ngClass]="blockSecurityGuardUnderSupervision ? 'col-xl-10 col-lg-9' : 'col-xl-12 col-lg-12'"
								>
									<mat-expansion-panel
										[hideToggle]="blockSecurityGuardUnderSupervision"
										class="my-3 w-100"
										[ngClass]="{ 'disabled-pointer': blockSecurityGuardUnderSupervision }"
										[expanded]="expandSecurityGuardUnderSupervision"
									>
										<mat-expansion-panel-header>
											<mat-panel-title>
												<mat-icon
													class="error-icon"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="
														categorySecurityGuardSupFormGroup?.touched && categorySecurityGuardSupFormGroup?.invalid
													"
													>error</mat-icon
												>{{ workerCategoryTypeCodes.SecurityGuardUnderSupervision | options : 'WorkerCategoryTypes' }}
											</mat-panel-title>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="xlarge w-auto float-end"
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.SecurityGuardUnderSupervision)"
												>
													<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>

										<app-licence-category-security-guard-sup></app-licence-category-security-guard-sup>
									</mat-expansion-panel>
								</div>

								<div class="col-xl-2 col-lg-3 col-md-12 col-sm-12" *ngIf="blockSecurityGuardUnderSupervision">
									<button
										mat-stroked-button
										class="large delete-button my-lg-3"
										aria-label="Remove category"
										(click)="onDeselect(workerCategoryTypeCodes.SecurityGuardUnderSupervision)"
									>
										<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove
									</button>
								</div>
							</div>
						</ng-container>
					</mat-accordion>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [
		`
			.title {
				padding-bottom: 2px;
			}

			.error-icon {
				margin-right: 0.5rem !important;
				overflow: visible !important;
			}

			.delete-button {
				min-width: 150px;
			}

			.disabled-pointer {
				pointer-events: none;
			}
		`,
	],
})
export class StepWorkerLicenceCategoryComponent implements OnInit, LicenceChildStepperStepComponent {
	category = '';
	isDirtyAndInvalid = false;

	validCategoryList: SelectOptions[] = WorkerCategoryTypes;

	workerLicenceTypes = WorkerLicenceTypeCode;
	workerCategoryTypes = WorkerCategoryTypes;
	workerCategoryTypeCodes = WorkerCategoryTypeCode;

	categoryArmouredCarGuardFormGroup: FormGroup = this.workerApplicationService.categoryArmouredCarGuardFormGroup;
	categoryBodyArmourSalesFormGroup: FormGroup = this.workerApplicationService.categoryBodyArmourSalesFormGroup;
	categoryClosedCircuitTelevisionInstallerFormGroup: FormGroup =
		this.workerApplicationService.categoryClosedCircuitTelevisionInstallerFormGroup;
	categoryElectronicLockingDeviceInstallerFormGroup: FormGroup =
		this.workerApplicationService.categoryElectronicLockingDeviceInstallerFormGroup;
	categoryFireInvestigatorFormGroup: FormGroup = this.workerApplicationService.categoryFireInvestigatorFormGroup;
	categoryLocksmithFormGroup: FormGroup = this.workerApplicationService.categoryLocksmithFormGroup;
	categoryPrivateInvestigatorSupFormGroup: FormGroup =
		this.workerApplicationService.categoryPrivateInvestigatorSupFormGroup;
	categoryPrivateInvestigatorFormGroup: FormGroup = this.workerApplicationService.categoryPrivateInvestigatorFormGroup;
	categorySecurityAlarmInstallerFormGroup: FormGroup =
		this.workerApplicationService.categorySecurityAlarmInstallerFormGroup;
	categorySecurityConsultantFormGroup: FormGroup = this.workerApplicationService.categorySecurityConsultantFormGroup;
	categoryLocksmithSupFormGroup: FormGroup = this.workerApplicationService.categoryLocksmithSupFormGroup;
	categorySecurityAlarmInstallerSupFormGroup: FormGroup =
		this.workerApplicationService.categorySecurityAlarmInstallerSupFormGroup;
	categorySecurityAlarmMonitorFormGroup: FormGroup =
		this.workerApplicationService.categorySecurityAlarmMonitorFormGroup;
	categorySecurityAlarmResponseFormGroup: FormGroup =
		this.workerApplicationService.categorySecurityAlarmResponseFormGroup;
	categorySecurityAlarmSalesFormGroup: FormGroup = this.workerApplicationService.categorySecurityAlarmSalesFormGroup;
	categorySecurityGuardFormGroup: FormGroup = this.workerApplicationService.categorySecurityGuardFormGroup;
	categorySecurityGuardSupFormGroup: FormGroup = this.workerApplicationService.categorySecurityGuardSupFormGroup;

	title = 'Which categories of the Security Worker Licence would you like?';
	infoTitle = '';

	readonly title_new = 'Which categories of the Security Worker Licence are you applying for?';
	readonly subtitle_new = 'You can add up to a total of 6 categories';

	readonly title_renew = 'Which categories of the Security Worker Licence would you like to renew?';
	readonly subtitle_renew_update = 'You can remove existing categories as well as add new ones';

	readonly title_update = 'Which categories of the Security Worker Licence would you like to update?';

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	expandArmouredCarGuard = false;
	expandBodyArmourSales = false;
	expandClosedCircuitTelevisionInstaller = false;
	expandElectronicLockingDeviceInstaller = false;
	expandFireInvestigator = false;
	expandLocksmith = false;
	expandLocksmithUnderSupervision = false;
	expandPrivateInvestigator = false;
	expandPrivateInvestigatorUnderSupervision = false;
	expandSecurityGuard = false;
	expandSecurityGuardUnderSupervision = false;
	expandSecurityAlarmInstallerUnderSupervision = false;
	expandSecurityAlarmInstaller = false;
	expandSecurityAlarmMonitor = false;
	expandSecurityAlarmResponse = false;
	expandSecurityAlarmSales = false;
	expandSecurityConsultant = false;

	blockArmouredCarGuard = false;
	blockBodyArmourSales = false;
	blockClosedCircuitTelevisionInstaller = false;
	blockElectronicLockingDeviceInstaller = false;
	blockFireInvestigator = false;
	blockLocksmith = false;
	blockLocksmithUnderSupervision = false;
	blockPrivateInvestigator = false;
	blockPrivateInvestigatorUnderSupervision = false;
	blockSecurityGuard = false;
	blockSecurityGuardUnderSupervision = false;
	blockSecurityAlarmInstallerUnderSupervision = false;
	blockSecurityAlarmInstaller = false;
	blockSecurityAlarmMonitor = false;
	blockSecurityAlarmResponse = false;
	blockSecurityAlarmSales = false;
	blockSecurityConsultant = false;

	constructor(
		private dialog: MatDialog,
		private optionsPipe: OptionsPipe,
		private workerApplicationService: WorkerApplicationService
	) {}

	ngOnInit(): void {
		switch (this.applicationTypeCode) {
			case ApplicationTypeCode.New: {
				this.title = this.title_new;
				this.infoTitle = this.subtitle_new;
				break;
			}
			case ApplicationTypeCode.Renewal: {
				this.title = this.title_renew;
				this.infoTitle = this.subtitle_renew_update;
				break;
			}
			case ApplicationTypeCode.Update: {
				this.title = this.title_update;
				this.infoTitle = this.subtitle_renew_update;
				break;
			}
		}

		this.validCategoryList = this.workerApplicationService.getValidCategoryList(this.categoryList);

		this.setupInitialExpansionPanel();
	}

	onAddCategory(): void {
		if (this.category) {
			switch (this.category) {
				case WorkerCategoryTypeCode.ArmouredCarGuard:
					if (!this.blockArmouredCarGuard) this.expandArmouredCarGuard = true;
					this.categoryArmouredCarGuardFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.BodyArmourSales:
					if (!this.blockBodyArmourSales) this.expandBodyArmourSales = true;
					this.categoryBodyArmourSalesFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller:
					if (!this.blockClosedCircuitTelevisionInstaller) this.expandClosedCircuitTelevisionInstaller = true;
					this.categoryClosedCircuitTelevisionInstallerFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller:
					if (!this.blockElectronicLockingDeviceInstaller) this.expandElectronicLockingDeviceInstaller = true;
					this.categoryElectronicLockingDeviceInstallerFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.FireInvestigator:
					if (!this.blockFireInvestigator) this.expandFireInvestigator = true;
					this.categoryFireInvestigatorFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.Locksmith:
					if (!this.blockLocksmith) this.expandLocksmith = true;
					this.categoryLocksmithFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.LocksmithUnderSupervision:
					if (!this.blockLocksmithUnderSupervision) this.expandLocksmithUnderSupervision = true;
					this.categoryLocksmithSupFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.PrivateInvestigator:
					if (!this.blockPrivateInvestigator) this.expandPrivateInvestigator = true;
					this.categoryPrivateInvestigatorFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision:
					if (!this.blockPrivateInvestigatorUnderSupervision) this.expandPrivateInvestigatorUnderSupervision = true;
					this.categoryPrivateInvestigatorSupFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.SecurityGuard:
					if (!this.blockSecurityGuard) this.expandSecurityGuard = true;
					this.categorySecurityGuardFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.SecurityGuardUnderSupervision:
					if (!this.blockSecurityGuardUnderSupervision) this.expandSecurityGuardUnderSupervision = true;
					this.categorySecurityGuardSupFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.SecurityAlarmInstaller:
					if (!this.blockSecurityAlarmInstaller) this.expandSecurityAlarmInstaller = true;
					this.categorySecurityAlarmInstallerFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision:
					if (!this.blockSecurityAlarmInstallerUnderSupervision)
						this.expandSecurityAlarmInstallerUnderSupervision = true;
					this.categorySecurityAlarmInstallerSupFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.SecurityAlarmMonitor:
					if (!this.blockSecurityAlarmMonitor) this.expandSecurityAlarmMonitor = true;
					this.categorySecurityAlarmMonitorFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.SecurityAlarmResponse:
					if (!this.blockSecurityAlarmResponse) this.expandSecurityAlarmResponse = true;
					this.categorySecurityAlarmResponseFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.SecurityAlarmSales:
					if (!this.blockSecurityAlarmSales) this.expandSecurityAlarmSales = true;
					this.categorySecurityAlarmSalesFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.SecurityConsultant:
					if (!this.blockSecurityConsultant) this.expandSecurityConsultant = true;
					this.categorySecurityConsultantFormGroup.patchValue({ isInclude: true });
					break;
			}

			this.validCategoryList = this.workerApplicationService.getValidCategoryList(this.categoryList);

			this.category = '';
			this.isDirtyAndInvalid = false;
		}
	}

	onDeselect(code: string) {
		this.onRemove(code, true);
	}

	onRemove(code: string, justDeselect = false) {
		const codeDesc = this.optionsPipe.transform(code, 'WorkerCategoryTypes');
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: `Are you sure you want to remove the ${codeDesc} category?`,
			actionText: 'Yes',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					switch (code) {
						case WorkerCategoryTypeCode.ArmouredCarGuard:
							if (!justDeselect) {
								this.categoryArmouredCarGuardFormGroup.reset();
								this.blockArmouredCarGuard = false;
							}
							this.categoryArmouredCarGuardFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.BodyArmourSales:
							if (!justDeselect) {
								this.blockBodyArmourSales = false;
							}
							this.categoryBodyArmourSalesFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller:
							if (!justDeselect) {
								this.blockClosedCircuitTelevisionInstaller = false;
							}
							this.categoryClosedCircuitTelevisionInstallerFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller:
							if (!justDeselect) {
								this.blockElectronicLockingDeviceInstaller = false;
							}
							this.categoryElectronicLockingDeviceInstallerFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.FireInvestigator:
							if (!justDeselect) {
								this.categoryFireInvestigatorFormGroup.reset();
								this.blockFireInvestigator = false;
							}
							this.categoryFireInvestigatorFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.Locksmith:
							if (!justDeselect) {
								this.categoryLocksmithFormGroup.reset();
								this.blockLocksmith = false;
							}
							this.categoryLocksmithFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.LocksmithUnderSupervision:
							if (!justDeselect) {
								this.blockLocksmithUnderSupervision = false;
							}
							this.categoryLocksmithSupFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.PrivateInvestigator:
							if (!justDeselect) {
								this.categoryPrivateInvestigatorFormGroup.reset();
								this.blockPrivateInvestigator = false;
							}
							this.categoryPrivateInvestigatorFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision:
							if (!justDeselect) {
								this.categoryPrivateInvestigatorSupFormGroup.reset();
								this.blockPrivateInvestigatorUnderSupervision = false;
							}
							this.categoryPrivateInvestigatorSupFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.SecurityGuard:
							if (!justDeselect) {
								this.categorySecurityGuardFormGroup.reset();
								this.blockSecurityGuard = false;
							}
							this.categorySecurityGuardFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.SecurityGuardUnderSupervision:
							if (!justDeselect) {
								this.blockSecurityGuardUnderSupervision = false;
							}
							this.categorySecurityGuardSupFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.SecurityAlarmInstaller:
							if (!justDeselect) {
								this.categorySecurityAlarmInstallerFormGroup.reset();
								this.blockSecurityAlarmInstaller = false;
							}
							this.categorySecurityAlarmInstallerFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision:
							if (!justDeselect) {
								this.blockSecurityAlarmInstallerUnderSupervision = false;
							}
							this.categorySecurityAlarmInstallerSupFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.SecurityAlarmMonitor:
							if (!justDeselect) {
								this.blockSecurityAlarmMonitor = false;
							}
							this.categorySecurityAlarmMonitorFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.SecurityAlarmResponse:
							if (!justDeselect) {
								this.blockSecurityAlarmResponse = false;
							}
							this.categorySecurityAlarmResponseFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.SecurityAlarmSales:
							if (!justDeselect) {
								this.blockSecurityAlarmSales = false;
							}
							this.categorySecurityAlarmSalesFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.SecurityConsultant:
							if (!justDeselect) {
								this.categorySecurityConsultantFormGroup.reset();
								this.blockSecurityConsultant = false;
							}
							this.categorySecurityConsultantFormGroup.patchValue({ isInclude: false });
							break;
					}

					this.validCategoryList = this.workerApplicationService.getValidCategoryList(this.categoryList);
					this.isDirtyAndInvalid = false;
				}
			});
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

	private setupInitialExpansionPanel(): void {
		if (this.isUpdate) {
			if (this.showArmouredCarGuard) {
				this.blockArmouredCarGuard = true;
			}
			if (this.showBodyArmourSales) {
				this.blockBodyArmourSales = true;
			}
			if (this.showClosedCircuitTelevisionInstaller) {
				this.blockClosedCircuitTelevisionInstaller = true;
			}
			if (this.showElectronicLockingDeviceInstaller) {
				this.blockElectronicLockingDeviceInstaller = true;
			}
			if (this.showFireInvestigator) {
				this.blockFireInvestigator = true;
			}
			if (this.showLocksmith) {
				this.blockLocksmith = true;
			}
			if (this.showLocksmithUnderSupervision) {
				this.blockLocksmithUnderSupervision = true;
			}
			if (this.showPrivateInvestigatorUnderSupervision) {
				this.blockPrivateInvestigatorUnderSupervision = true;
			}
			if (this.showPrivateInvestigator) {
				this.blockPrivateInvestigator = true;
			}
			if (this.showSecurityAlarmInstaller) {
				this.blockSecurityAlarmInstaller = true;
			}
			if (this.showSecurityAlarmInstallerUnderSupervision) {
				this.blockSecurityAlarmInstallerUnderSupervision = true;
			}
			if (this.showSecurityConsultant) {
				this.blockSecurityConsultant = true;
			}
			if (this.showSecurityGuard) {
				this.blockSecurityGuard = true;
			}
			if (this.showSecurityAlarmMonitor) {
				this.blockSecurityAlarmMonitor = true;
			}
			if (this.showSecurityAlarmResponse) {
				this.blockSecurityAlarmResponse = true;
			}
			if (this.showSecurityAlarmSales) {
				this.blockSecurityAlarmSales = true;
			}
			if (this.showSecurityGuardUnderSupervision) {
				this.blockSecurityGuardUnderSupervision = true;
			}
		}
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

	get showArmouredCarGuard(): boolean {
		return this.categoryArmouredCarGuardFormGroup.get('isInclude')?.value;
	}
	get showBodyArmourSales(): boolean {
		return this.categoryBodyArmourSalesFormGroup.get('isInclude')?.value;
	}
	get showClosedCircuitTelevisionInstaller(): boolean {
		return this.categoryClosedCircuitTelevisionInstallerFormGroup.get('isInclude')?.value;
	}
	get showElectronicLockingDeviceInstaller(): boolean {
		return this.categoryElectronicLockingDeviceInstallerFormGroup.get('isInclude')?.value;
	}
	get showFireInvestigator(): boolean {
		return this.categoryFireInvestigatorFormGroup.get('isInclude')?.value;
	}
	get showLocksmith(): boolean {
		return this.categoryLocksmithFormGroup.get('isInclude')?.value;
	}
	get showLocksmithUnderSupervision(): boolean {
		return this.categoryLocksmithSupFormGroup.get('isInclude')?.value;
	}
	get showPrivateInvestigatorUnderSupervision(): boolean {
		return this.categoryPrivateInvestigatorSupFormGroup.get('isInclude')?.value;
	}
	get showPrivateInvestigator(): boolean {
		return this.categoryPrivateInvestigatorFormGroup.get('isInclude')?.value;
	}
	get showSecurityAlarmInstaller(): boolean {
		return this.categorySecurityAlarmInstallerFormGroup.get('isInclude')?.value;
	}
	get showSecurityAlarmInstallerUnderSupervision(): boolean {
		return this.categorySecurityAlarmInstallerSupFormGroup.get('isInclude')?.value;
	}
	get showSecurityConsultant(): boolean {
		return this.categorySecurityConsultantFormGroup.get('isInclude')?.value;
	}
	get showSecurityGuard(): boolean {
		return this.categorySecurityGuardFormGroup.get('isInclude')?.value;
	}
	get showSecurityAlarmMonitor(): boolean {
		return this.categorySecurityAlarmMonitorFormGroup.get('isInclude')?.value;
	}
	get showSecurityAlarmResponse(): boolean {
		return this.categorySecurityAlarmResponseFormGroup.get('isInclude')?.value;
	}
	get showSecurityAlarmSales(): boolean {
		return this.categorySecurityAlarmSalesFormGroup.get('isInclude')?.value;
	}
	get showSecurityGuardUnderSupervision(): boolean {
		return this.categorySecurityGuardSupFormGroup.get('isInclude')?.value;
	}

	get isRenewalOrUpdate(): boolean {
		return (
			this.applicationTypeCode === ApplicationTypeCode.Renewal ||
			this.applicationTypeCode === ApplicationTypeCode.Update
		);
	}

	get isUpdate(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Update;
	}
}
