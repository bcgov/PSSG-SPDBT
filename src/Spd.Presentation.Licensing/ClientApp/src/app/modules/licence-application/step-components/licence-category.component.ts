import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SelectOptions, SwlCategoryTypeCode, SwlCategoryTypes } from 'src/app/core/code-types/model-desc.models';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import { LicenceApplicationService, LicenceFormStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-licence-category',
	template: `
		<section [ngClass]="isCalledFromModal ? 'step-section-modal' : 'step-section p-3'">
			<div class="step">
				<app-step-title
					title="Which categories of Security Worker Licence are you applying for?"
					subtitle="You can add up to a total of 6 categories"
					[ngClass]="isCalledFromModal ? 'fs-7' : ''"
				></app-step-title>
				<div class="step-container">
					<div class="row">
						<div
							[ngClass]="
								isCalledFromModal
									? 'col-md-6 col-sm-12'
									: 'offset-xxl-2 col-xxl-5 offset-xl-1 col-xl-6 col-lg-6 col-md-6 col-sm-12'
							"
						>
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
						<div
							[ngClass]="isCalledFromModal ? 'col-md-6 col-sm-12' : 'col-xxl-3 col-xl-4 col-lg-6 col-md-6 col-sm-12'"
							*ngIf="categoryList.length < 6"
						>
							<button mat-stroked-button color="primary" class="large my-2" (click)="onAddCategory()">
								Add Category
							</button>
						</div>
					</div>

					<div class="row">
						<div
							[ngClass]="isCalledFromModal ? 'col-12' : 'col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto'"
						>
							<mat-accordion multi="false">
								<ng-container *ngIf="showArmouredCarGuard">
									<mat-expansion-panel class="my-3" [expanded]="true">
										<mat-expansion-panel-header>
											<mat-panel-title class="title text-nowrap"
												>{{ swlCategoryTypeCodes.ArmouredCarGuard | options : 'SwlCategoryTypes' }}
											</mat-panel-title>
											<mat-panel-description>
												<mat-icon
													class="w-100 text-end"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="
														categoryArmouredCarGuardFormGroup?.touched && categoryArmouredCarGuardFormGroup?.invalid
													"
													>error</mat-icon
												>
											</mat-panel-description>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="w-auto float-end"
													style="color: var(--color-red);"
													aria-label="Remove category"
													(click)="onRemove(swlCategoryTypeCodes.ArmouredCarGuard)"
												>
													<mat-icon>delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>
										<app-licence-category-armoured-car-guard></app-licence-category-armoured-car-guard>
									</mat-expansion-panel>
								</ng-container>

								<ng-container *ngIf="showBodyArmourSales">
									<mat-expansion-panel class="my-3" [expanded]="true">
										<mat-expansion-panel-header>
											<mat-panel-title class="title text-nowrap"
												>{{ swlCategoryTypeCodes.BodyArmourSales | options : 'SwlCategoryTypes' }}
											</mat-panel-title>
											<mat-panel-description>
												<mat-icon
													class="w-100 text-end"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="categoryBodyArmourSalesFormGroup?.touched && categoryBodyArmourSalesFormGroup?.invalid"
													>error</mat-icon
												>
											</mat-panel-description>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="w-auto float-end"
													style="color: var(--color-red);"
													aria-label="Remove category"
													(click)="onRemove(swlCategoryTypeCodes.BodyArmourSales)"
												>
													<mat-icon>delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>
										<app-licence-category-body-armour-sales></app-licence-category-body-armour-sales>
									</mat-expansion-panel>
								</ng-container>

								<ng-container *ngIf="showClosedCircuitTelevisionInstaller">
									<mat-expansion-panel class="my-3" [expanded]="true">
										<mat-expansion-panel-header>
											<mat-panel-title class="title text-nowrap"
												>{{ swlCategoryTypeCodes.ClosedCircuitTelevisionInstaller | options : 'SwlCategoryTypes' }}
											</mat-panel-title>
											<mat-panel-description>
												<mat-icon
													class="w-100 text-end"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="
														categoryClosedCircuitTelevisionInstallerFormGroup?.touched &&
														categoryClosedCircuitTelevisionInstallerFormGroup?.invalid
													"
													>error</mat-icon
												>
											</mat-panel-description>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="w-auto float-end"
													style="color: var(--color-red);"
													aria-label="Remove category"
													(click)="onRemove(swlCategoryTypeCodes.ClosedCircuitTelevisionInstaller)"
												>
													<mat-icon>delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>

										<app-licence-category-closed-circuit-television-installer></app-licence-category-closed-circuit-television-installer>
									</mat-expansion-panel>
								</ng-container>

								<ng-container *ngIf="showElectronicLockingDeviceInstaller">
									<mat-expansion-panel class="my-3" [expanded]="true">
										<mat-expansion-panel-header>
											<mat-panel-title class="title text-nowrap"
												>{{ swlCategoryTypeCodes.ElectronicLockingDeviceInstaller | options : 'SwlCategoryTypes' }}
											</mat-panel-title>
											<mat-panel-description>
												<mat-icon
													class="w-100 text-end"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="
														categoryElectronicLockingDeviceInstallerFormGroup?.touched &&
														categoryElectronicLockingDeviceInstallerFormGroup?.invalid
													"
													>error</mat-icon
												>
											</mat-panel-description>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="w-auto float-end"
													style="color: var(--color-red);"
													aria-label="Remove category"
													(click)="onRemove(swlCategoryTypeCodes.ElectronicLockingDeviceInstaller)"
												>
													<mat-icon>delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>

										<app-licence-category-electronic-locking-device-installer></app-licence-category-electronic-locking-device-installer>
									</mat-expansion-panel>
								</ng-container>

								<ng-container *ngIf="showFireInvestigator">
									<mat-expansion-panel class="my-3" [expanded]="true">
										<mat-expansion-panel-header>
											<mat-panel-title class="title text-nowrap"
												>{{ swlCategoryTypeCodes.FireInvestigator | options : 'SwlCategoryTypes' }}
											</mat-panel-title>
											<mat-panel-description>
												<mat-icon
													class="w-100 text-end"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="
														categoryFireInvestigatorFormGroup?.touched && categoryFireInvestigatorFormGroup?.invalid
													"
													>error</mat-icon
												>
											</mat-panel-description>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="w-auto float-end"
													style="color: var(--color-red);"
													aria-label="Remove category"
													(click)="onRemove(swlCategoryTypeCodes.FireInvestigator)"
												>
													<mat-icon>delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>

										<app-licence-category-fire-investigator></app-licence-category-fire-investigator>
									</mat-expansion-panel>
								</ng-container>

								<ng-container *ngIf="showLocksmith">
									<mat-expansion-panel class="my-3" [expanded]="true">
										<mat-expansion-panel-header>
											<mat-panel-title class="title text-nowrap"
												>{{ swlCategoryTypeCodes.Locksmith | options : 'SwlCategoryTypes' }}
											</mat-panel-title>
											<mat-panel-description>
												<mat-icon
													class="w-100 text-end"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="categoryLocksmithFormGroup?.touched && categoryLocksmithFormGroup?.invalid"
													>error</mat-icon
												>
											</mat-panel-description>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="w-auto float-end"
													style="color: var(--color-red);"
													aria-label="Remove category"
													(click)="onRemove(swlCategoryTypeCodes.Locksmith)"
												>
													<mat-icon>delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>

										<app-licence-category-locksmith></app-licence-category-locksmith>
									</mat-expansion-panel>
								</ng-container>

								<ng-container *ngIf="showLocksmithUnderSupervision">
									<mat-expansion-panel class="my-3" [expanded]="true">
										<mat-expansion-panel-header>
											<mat-panel-title class="title text-nowrap"
												>{{ swlCategoryTypeCodes.LocksmithUnderSupervision | options : 'SwlCategoryTypes' }}
											</mat-panel-title>
											<mat-panel-description>
												<mat-icon
													class="w-100 text-end"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="categoryLocksmithSupFormGroup?.touched && categoryLocksmithSupFormGroup?.invalid"
													>error</mat-icon
												>
											</mat-panel-description>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="w-auto float-end"
													style="color: var(--color-red);"
													aria-label="Remove category"
													(click)="onRemove(swlCategoryTypeCodes.LocksmithUnderSupervision)"
												>
													<mat-icon>delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>

										<app-licence-category-locksmith-sup></app-licence-category-locksmith-sup>
									</mat-expansion-panel>
								</ng-container>

								<ng-container *ngIf="showPrivateInvestigator">
									<mat-expansion-panel class="my-3" [expanded]="true">
										<mat-expansion-panel-header>
											<mat-panel-title class="title text-nowrap"
												>{{ swlCategoryTypeCodes.PrivateInvestigator | options : 'SwlCategoryTypes' }}
											</mat-panel-title>
											<mat-panel-description>
												<mat-icon
													class="w-100 text-end"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="
														categoryPrivateInvestigatorFormGroup?.touched &&
														categoryPrivateInvestigatorFormGroup?.invalid
													"
													>error</mat-icon
												>
											</mat-panel-description>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="w-auto float-end"
													style="color: var(--color-red);"
													aria-label="Remove category"
													(click)="onRemove(swlCategoryTypeCodes.PrivateInvestigator)"
												>
													<mat-icon>delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>

										<app-licence-category-private-investigator></app-licence-category-private-investigator>
									</mat-expansion-panel>
								</ng-container>

								<ng-container *ngIf="showPrivateInvestigatorUnderSupervision">
									<mat-expansion-panel class="my-3" [expanded]="true">
										<mat-expansion-panel-header>
											<mat-panel-title class="title text-nowrap"
												>{{ swlCategoryTypeCodes.PrivateInvestigatorUnderSupervision | options : 'SwlCategoryTypes' }}
											</mat-panel-title>
											<mat-panel-description>
												<mat-icon
													class="w-100 text-end"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="
														categoryPrivateInvestigatorSupFormGroup?.touched &&
														categoryPrivateInvestigatorSupFormGroup?.invalid
													"
													>error</mat-icon
												>
											</mat-panel-description>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="w-auto float-end"
													style="color: var(--color-red);"
													aria-label="Remove category"
													(click)="onRemove(swlCategoryTypeCodes.PrivateInvestigatorUnderSupervision)"
												>
													<mat-icon>delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>

										<app-licence-category-private-investigator-sup></app-licence-category-private-investigator-sup>
									</mat-expansion-panel>
								</ng-container>

								<ng-container *ngIf="showSecurityAlarmInstaller">
									<mat-expansion-panel class="my-3" [expanded]="true">
										<mat-expansion-panel-header>
											<mat-panel-title class="title text-nowrap"
												>{{ swlCategoryTypeCodes.SecurityAlarmInstaller | options : 'SwlCategoryTypes' }}
											</mat-panel-title>
											<mat-panel-description>
												<mat-icon
													class="w-100 text-end"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="
														categorySecurityAlarmInstallerFormGroup?.touched &&
														categorySecurityAlarmInstallerFormGroup?.invalid
													"
													>error</mat-icon
												>
											</mat-panel-description>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="w-auto float-end"
													style="color: var(--color-red);"
													aria-label="Remove category"
													(click)="onRemove(swlCategoryTypeCodes.SecurityAlarmInstaller)"
												>
													<mat-icon>delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>

										<app-licence-category-security-alarm-installer></app-licence-category-security-alarm-installer>
									</mat-expansion-panel>
								</ng-container>

								<ng-container *ngIf="showSecurityAlarmInstallerUnderSupervision">
									<mat-expansion-panel class="my-3" [expanded]="true">
										<mat-expansion-panel-header>
											<mat-panel-title class="title text-nowrap"
												>{{
													swlCategoryTypeCodes.SecurityAlarmInstallerUnderSupervision | options : 'SwlCategoryTypes'
												}}
											</mat-panel-title>
											<mat-panel-description>
												<mat-icon
													class="w-100 text-end"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="
														categorySecurityAlarmInstallerSupFormGroup?.touched &&
														categorySecurityAlarmInstallerSupFormGroup?.invalid
													"
													>error</mat-icon
												>
											</mat-panel-description>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="w-auto float-end"
													style="color: var(--color-red);"
													aria-label="Remove category"
													(click)="onRemove(swlCategoryTypeCodes.SecurityAlarmInstallerUnderSupervision)"
												>
													<mat-icon>delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>

										<app-licence-category-security-alarm-installer-sup></app-licence-category-security-alarm-installer-sup>
									</mat-expansion-panel>
								</ng-container>

								<ng-container *ngIf="showSecurityAlarmMonitor">
									<mat-expansion-panel class="my-3" [expanded]="true">
										<mat-expansion-panel-header>
											<mat-panel-title class="title text-nowrap"
												>{{ swlCategoryTypeCodes.SecurityAlarmMonitor | options : 'SwlCategoryTypes' }}
											</mat-panel-title>
											<mat-panel-description>
												<mat-icon
													class="w-100 text-end"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="
														categorySecurityAlarmMonitorFormGroup?.touched &&
														categorySecurityAlarmMonitorFormGroup?.invalid
													"
													>error</mat-icon
												>
											</mat-panel-description>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="w-auto float-end"
													style="color: var(--color-red);"
													aria-label="Remove category"
													(click)="onRemove(swlCategoryTypeCodes.SecurityAlarmMonitor)"
												>
													<mat-icon>delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>

										<app-licence-category-security-alarm-monitor></app-licence-category-security-alarm-monitor>
									</mat-expansion-panel>
								</ng-container>

								<ng-container *ngIf="showSecurityAlarmResponse">
									<mat-expansion-panel class="my-3" [expanded]="true">
										<mat-expansion-panel-header>
											<mat-panel-title class="title text-nowrap"
												>{{ swlCategoryTypeCodes.SecurityAlarmResponse | options : 'SwlCategoryTypes' }}
											</mat-panel-title>
											<mat-panel-description>
												<mat-icon
													class="w-100 text-end"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="
														categorySecurityAlarmResponseFormGroup?.touched &&
														categorySecurityAlarmResponseFormGroup?.invalid
													"
													>error</mat-icon
												>
											</mat-panel-description>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="w-auto float-end"
													style="color: var(--color-red);"
													aria-label="Remove category"
													(click)="onRemove(swlCategoryTypeCodes.SecurityAlarmResponse)"
												>
													<mat-icon>delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>

										<app-licence-category-security-alarm-response></app-licence-category-security-alarm-response>
									</mat-expansion-panel>
								</ng-container>

								<ng-container *ngIf="showSecurityAlarmSales">
									<mat-expansion-panel class="my-3" [expanded]="true">
										<mat-expansion-panel-header>
											<mat-panel-title class="title text-nowrap"
												>{{ swlCategoryTypeCodes.SecurityAlarmSales | options : 'SwlCategoryTypes' }}
											</mat-panel-title>
											<mat-panel-description>
												<mat-icon
													class="w-100 text-end"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="
														categorySecurityAlarmSalesFormGroup?.touched && categorySecurityAlarmSalesFormGroup?.invalid
													"
													>error</mat-icon
												>
											</mat-panel-description>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="w-auto float-end"
													style="color: var(--color-red);"
													aria-label="Remove category"
													(click)="onRemove(swlCategoryTypeCodes.SecurityAlarmSales)"
												>
													<mat-icon>delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>

										<app-licence-category-security-alarm-sales></app-licence-category-security-alarm-sales>
									</mat-expansion-panel>
								</ng-container>

								<ng-container *ngIf="showSecurityConsultant">
									<mat-expansion-panel class="my-3" [expanded]="true">
										<mat-expansion-panel-header>
											<mat-panel-title class="title text-nowrap"
												>{{ swlCategoryTypeCodes.SecurityConsultant | options : 'SwlCategoryTypes' }}
											</mat-panel-title>
											<mat-panel-description>
												<mat-icon
													class="w-100 text-end"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="
														categorySecurityConsultantFormGroup?.touched && categorySecurityConsultantFormGroup?.invalid
													"
													>error</mat-icon
												>
											</mat-panel-description>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="w-auto float-end"
													style="color: var(--color-red);"
													aria-label="Remove category"
													(click)="onRemove(swlCategoryTypeCodes.SecurityConsultant)"
												>
													<mat-icon>delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>

										<app-licence-category-security-consultant></app-licence-category-security-consultant>
									</mat-expansion-panel>
								</ng-container>

								<ng-container *ngIf="showSecurityGuard">
									<mat-expansion-panel class="my-3" [expanded]="true">
										<mat-expansion-panel-header>
											<mat-panel-title class="title text-nowrap"
												>{{ swlCategoryTypeCodes.SecurityGuard | options : 'SwlCategoryTypes' }}
											</mat-panel-title>
											<mat-panel-description>
												<mat-icon
													class="w-100 text-end"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="categorySecurityGuardFormGroup?.touched && categorySecurityGuardFormGroup?.invalid"
													>error</mat-icon
												>
											</mat-panel-description>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="w-auto float-end"
													style="color: var(--color-red);"
													aria-label="Remove category"
													(click)="onRemove(swlCategoryTypeCodes.SecurityGuard)"
												>
													<mat-icon>delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>
										<app-licence-category-security-guard></app-licence-category-security-guard>
									</mat-expansion-panel>
								</ng-container>

								<ng-container *ngIf="showSecurityGuardUnderSupervision">
									<mat-expansion-panel class="my-3" [expanded]="true">
										<mat-expansion-panel-header>
											<mat-panel-title class="title text-nowrap"
												>{{ swlCategoryTypeCodes.SecurityGuardUnderSupervision | options : 'SwlCategoryTypes' }}
											</mat-panel-title>
											<mat-panel-description>
												<mat-icon
													class="w-100 text-end"
													color="warn"
													matTooltip="One or more errors exist in this category"
													*ngIf="
														categorySecurityGuardSupFormGroup?.touched && categorySecurityGuardSupFormGroup?.invalid
													"
													>error</mat-icon
												>
											</mat-panel-description>
										</mat-expansion-panel-header>
										<div class="row my-3">
											<div class="col-12 mx-auto">
												<button
													mat-stroked-button
													class="w-auto float-end"
													style="color: var(--color-red);"
													aria-label="Remove category"
													(click)="onRemove(swlCategoryTypeCodes.SecurityGuardUnderSupervision)"
												>
													<mat-icon>delete_outline</mat-icon>Remove this Category
												</button>
											</div>
										</div>

										<app-licence-category-security-guard-sup></app-licence-category-security-guard-sup>
									</mat-expansion-panel>
								</ng-container>
							</mat-accordion>
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
export class LicenceCategoryComponent implements OnInit, LicenceFormStepComponent {
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

	@Input() isCalledFromModal: boolean = false;

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
					this.onPromptFireInvestigator();
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

	onPromptFireInvestigator() {
		if (this.showFireInvestigator) {
			return; // this has already been added
		}

		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: 'Would you also like to add Fire Investigator to this licence?',
			actionText: 'Yes',
			cancelText: 'No',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.categoryFireInvestigatorFormGroup.patchValue({ isInclude: true });

					this.setValidCategoryList();
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

		// console.log(
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
			list.push(SwlCategoryTypeCode.ArmouredCarGuard);
		}
		if (this.categoryBodyArmourSalesFormGroup.get('isInclude')?.value) {
			list.push(SwlCategoryTypeCode.BodyArmourSales);
		}
		if (this.categoryClosedCircuitTelevisionInstallerFormGroup.get('isInclude')?.value) {
			list.push(SwlCategoryTypeCode.ClosedCircuitTelevisionInstaller);
		}
		if (this.categoryElectronicLockingDeviceInstallerFormGroup.get('isInclude')?.value) {
			list.push(SwlCategoryTypeCode.ElectronicLockingDeviceInstaller);
		}
		if (this.categoryFireInvestigatorFormGroup.get('isInclude')?.value) {
			list.push(SwlCategoryTypeCode.FireInvestigator);
		}
		if (this.categoryLocksmithFormGroup.get('isInclude')?.value) {
			list.push(SwlCategoryTypeCode.Locksmith);
		}
		if (this.categoryLocksmithSupFormGroup.get('isInclude')?.value) {
			list.push(SwlCategoryTypeCode.LocksmithUnderSupervision);
		}
		if (this.categoryPrivateInvestigatorFormGroup.get('isInclude')?.value) {
			list.push(SwlCategoryTypeCode.PrivateInvestigator);
		}
		if (this.categoryPrivateInvestigatorSupFormGroup.get('isInclude')?.value) {
			list.push(SwlCategoryTypeCode.PrivateInvestigatorUnderSupervision);
		}
		if (this.categorySecurityAlarmInstallerFormGroup.get('isInclude')?.value) {
			list.push(SwlCategoryTypeCode.SecurityAlarmInstaller);
		}
		if (this.categorySecurityAlarmInstallerSupFormGroup.get('isInclude')?.value) {
			list.push(SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision);
		}
		if (this.categorySecurityAlarmMonitorFormGroup.get('isInclude')?.value) {
			list.push(SwlCategoryTypeCode.SecurityAlarmMonitor);
		}
		if (this.categorySecurityAlarmResponseFormGroup.get('isInclude')?.value) {
			list.push(SwlCategoryTypeCode.SecurityAlarmResponse);
		}
		if (this.categorySecurityAlarmSalesFormGroup.get('isInclude')?.value) {
			list.push(SwlCategoryTypeCode.SecurityAlarmSales);
		}
		if (this.categorySecurityConsultantFormGroup.get('isInclude')?.value) {
			list.push(SwlCategoryTypeCode.SecurityConsultant);
		}
		if (this.categorySecurityGuardFormGroup.get('isInclude')?.value) {
			list.push(SwlCategoryTypeCode.SecurityGuard);
		}
		if (this.categorySecurityGuardSupFormGroup.get('isInclude')?.value) {
			list.push(SwlCategoryTypeCode.SecurityGuardUnderSupervision);
		}

		return list;
	}

	private setValidCategoryList(): void {
		const currentList = this.categoryList;
		let updatedList = this.swlCategoryTypes;
		updatedList = updatedList.filter((cat) => !currentList.find((xxx) => xxx == cat.code));
		this.validCategoryList = [...updatedList];

		// TODO update to use matrix in the db.
		// let updatedList = this.swlCategoryTypes;
		// // if user has selected 'ArmouredCarGuard', then update the list of valid values
		// if (currentList.find((cat) => cat == SwlCategoryTypeCode.ArmouredCarGuard)) {
		// 	updatedList = updatedList.filter(
		// 		(cat) =>
		// 			cat != SwlCategoryTypeCode.ArmouredCarGuard &&
		// 			cat != SwlCategoryTypeCode.SecurityGuardUnderSupervision
		// 	);
		// }
		// // if user has selected 'BodyArmourSales', then update the list of valid values
		// if (currentList.find((cat) => cat == SwlCategoryTypeCode.BodyArmourSales)) {
		// 	updatedList = updatedList.filter(
		// 		(cat) =>
		// 			cat != SwlCategoryTypeCode.BodyArmourSales &&
		// 			cat != SwlCategoryTypeCode.SecurityGuardUnderSupervision
		// 	);
		// }
		// // if user has selected 'ClosedCircuitTelevisionInstaller', then update the list of valid values
		// if (currentList.find((cat) => cat == SwlCategoryTypeCode.ClosedCircuitTelevisionInstaller)) {
		// 	updatedList = updatedList.filter(
		// 		(cat) =>
		// 			cat != SwlCategoryTypeCode.ClosedCircuitTelevisionInstaller &&
		// 			cat != SwlCategoryTypeCode.SecurityAlarmInstaller &&
		// 			cat != SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision &&
		// 			cat != SwlCategoryTypeCode.SecurityGuardUnderSupervision
		// 	);
		// }
		// // if user has selected 'ElectronicLockingDeviceInstaller', then update the list of valid values
		// if (currentList.find((cat) => cat == SwlCategoryTypeCode.ElectronicLockingDeviceInstaller)) {
		// 	updatedList = updatedList.filter(
		// 		(cat) =>
		// 			cat != SwlCategoryTypeCode.ElectronicLockingDeviceInstaller &&
		// 			cat != SwlCategoryTypeCode.Locksmith &&
		// 			cat != SwlCategoryTypeCode.LocksmithUnderSupervision &&
		// 			cat != SwlCategoryTypeCode.SecurityAlarmInstaller &&
		// 			cat != SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision &&
		// 			cat != SwlCategoryTypeCode.SecurityGuardUnderSupervision
		// 	);
		// }
		// // if user has selected 'FireInvestigator', then update the list of valid values
		// if (currentList.find((cat) => cat == SwlCategoryTypeCode.FireInvestigator)) {
		// 	updatedList = updatedList.filter(
		// 		(cat) =>
		// 			cat != SwlCategoryTypeCode.PrivateInvestigator &&
		// 			cat != SwlCategoryTypeCode.PrivateInvestigatorUnderSupervision &&
		// 			cat != SwlCategoryTypeCode.FireInvestigator
		// 	);
		// }
		// // if user has selected 'Locksmith' or 'LocksmithUnderSupervision', then update the list of valid values
		// if (
		// 	currentList.find(
		// 		(cat) => cat == SwlCategoryTypeCode.Locksmith || cat == SwlCategoryTypeCode.LocksmithUnderSupervision
		// 	)
		// ) {
		// 	updatedList = updatedList.filter(
		// 		(cat) =>
		// 			cat != SwlCategoryTypeCode.ElectronicLockingDeviceInstaller &&
		// 			cat != SwlCategoryTypeCode.Locksmith &&
		// 			cat != SwlCategoryTypeCode.LocksmithUnderSupervision &&
		// 			cat != SwlCategoryTypeCode.SecurityGuardUnderSupervision
		// 	);
		// }
		// // if user has selected 'PrivateInvestigator' or 'PrivateInvestigatorUnderSupervision', then update the list of valid values
		// if (
		// 	currentList.find(
		// 		(cat) =>
		// 			cat == SwlCategoryTypeCode.PrivateInvestigator ||
		// 			cat == SwlCategoryTypeCode.PrivateInvestigatorUnderSupervision
		// 	)
		// ) {
		// 	updatedList = updatedList.filter(
		// 		(cat) =>
		// 			cat != SwlCategoryTypeCode.FireInvestigator &&
		// 			cat != SwlCategoryTypeCode.PrivateInvestigator &&
		// 			cat != SwlCategoryTypeCode.PrivateInvestigatorUnderSupervision &&
		// 			cat != SwlCategoryTypeCode.SecurityGuardUnderSupervision
		// 	);
		// }
		// // if user has selected 'SecurityGuard', then update the list of valid values
		// if (currentList.find((cat) => cat == SwlCategoryTypeCode.SecurityGuard)) {
		// 	updatedList = updatedList.filter(
		// 		(cat) =>
		// 			cat != SwlCategoryTypeCode.SecurityAlarmMonitor &&
		// 			cat != SwlCategoryTypeCode.SecurityAlarmResponse &&
		// 			cat != SwlCategoryTypeCode.SecurityGuard &&
		// 			cat != SwlCategoryTypeCode.SecurityGuardUnderSupervision
		// 	);
		// }
		// // if user has selected 'SecurityGuardUnderSupervision', then update the list of valid values
		// if (currentList.find((cat) => cat == SwlCategoryTypeCode.SecurityGuardUnderSupervision)) {
		// 	updatedList = [];
		// }
		// // if user has selected 'SecurityAlarmInstaller' or 'SecurityAlarmInstallerUnderSupervision', then update the list of valid values
		// if (
		// 	currentList.find(
		// 		(cat) =>
		// 			cat == SwlCategoryTypeCode.SecurityAlarmInstaller ||
		// 			cat == SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision
		// 	)
		// ) {
		// 	updatedList = updatedList.filter(
		// 		(cat) =>
		// 			cat != SwlCategoryTypeCode.ElectronicLockingDeviceInstaller &&
		// 			cat != SwlCategoryTypeCode.SecurityAlarmInstaller &&
		// 			cat != SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision &&
		// 			cat != SwlCategoryTypeCode.SecurityAlarmMonitor &&
		// 			cat != SwlCategoryTypeCode.SecurityAlarmResponse &&
		// 			cat != SwlCategoryTypeCode.SecurityAlarmSales &&
		// 			cat != SwlCategoryTypeCode.ClosedCircuitTelevisionInstaller &&
		// 			cat != SwlCategoryTypeCode.SecurityGuardUnderSupervision
		// 	);
		// }
		// // if user has selected 'SecurityAlarmMonitor' or 'SecurityAlarmResponse, then update the list of valid values
		// if (
		// 	currentList.find(
		// 		(cat) =>
		// 			cat == SwlCategoryTypeCode.SecurityAlarmMonitor || cat == SwlCategoryTypeCode.SecurityAlarmResponse
		// 	)
		// ) {
		// 	updatedList = updatedList.filter(
		// 		(cat) =>
		// 			cat != SwlCategoryTypeCode.SecurityAlarmMonitor &&
		// 			cat != SwlCategoryTypeCode.SecurityAlarmResponse &&
		// 			cat != SwlCategoryTypeCode.SecurityAlarmInstaller &&
		// 			cat != SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision &&
		// 			cat != SwlCategoryTypeCode.SecurityGuard &&
		// 			cat != SwlCategoryTypeCode.SecurityGuardUnderSupervision
		// 	);
		// }
		// // if user has selected 'SecurityAlarmSales', then update the list of valid values
		// if (currentList.find((cat) => cat == SwlCategoryTypeCode.SecurityAlarmSales)) {
		// 	updatedList = updatedList.filter(
		// 		(cat) =>
		// 			cat != SwlCategoryTypeCode.SecurityAlarmInstaller &&
		// 			cat != SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision &&
		// 			cat != SwlCategoryTypeCode.SecurityAlarmMonitor &&
		// 			cat != SwlCategoryTypeCode.SecurityAlarmSales &&
		// 			cat != SwlCategoryTypeCode.SecurityGuard &&
		// 			cat != SwlCategoryTypeCode.SecurityGuardUnderSupervision
		// 	);
		// }
		// // if user has selected 'SecurityConsultant', then update the list of valid values
		// if (currentList.find((cat) => cat == SwlCategoryTypeCode.SecurityConsultant)) {
		// 	updatedList = updatedList.filter(
		// 		(cat) =>
		// 			cat != SwlCategoryTypeCode.SecurityConsultant &&
		// 			cat != SwlCategoryTypeCode.SecurityGuardUnderSupervision
		// 	);
		// }
		// this.validCategoryList = [...updatedList];
		// console.log('updatedList', this.validCategoryList);
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
}
