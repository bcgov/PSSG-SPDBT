import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationTypeCode, WorkerCategoryTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { SelectOptions, WorkerCategoryTypes } from 'src/app/core/code-types/model-desc.models';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';

@Component({
	selector: 'app-step-licence-category',
	template: `
		<section class="step-section">
			<div class="step">
				<ng-container
					*ngIf="
						applicationTypeCode === applicationTypeCodes.Renewal || applicationTypeCode === applicationTypeCodes.Update
					"
				>
					<app-renewal-alert [applicationTypeCode]="applicationTypeCode"></app-renewal-alert>
					<!-- <app-renewal-alert title="" subtitle="">
						<div class="row mt-0 mx-3 mb-4">
							<div class="col-lg-4 col-md-12 mt-lg-2">
								<div class="text-label text-center d-block text-muted mt-2 mt-lg-0">Licence Number</div>
								<div class="summary-text-data text-center">{{ licenceNumber }}</div>
							</div>
							<div class="col-lg-4 col-md-12 mt-lg-2">
								<div class="text-label text-center d-block text-muted mt-2 mt-lg-0">Current Licence Expiry Date</div>
								<div class="summary-text-data text-center">{{ expiryDate | formatDate : constants.date.formalDateFormat }}</div>
							</div>
							<div class="col-lg-4 col-md-12 mt-lg-2">
								<div class="text-label text-center d-block text-muted mt-2 mt-lg-0">Term</div>
								<div class="summary-text-data text-center">{{ licenceTermCode | options : 'LicenceTermTypes' }}</div>
							</div>
						</div>

						<div class="mx-3 text-center">
							If any of this information is not correct, please call the Security Program's Licensing Unit during
							regular office hours: 1-855-587-0185
						</div>
					</app-renewal-alert> -->
				</ng-container>

				<app-step-title [title]="title" [subtitle]="infoTitle"> </app-step-title>
				<div class="step-container">
					<div class="row">
						<div class="offset-xxl-2 col-xxl-8 offset-xl-2 col-xl-8 col-lg-12 mx-auto">
							<div class="row">
								<div class="col-md-8 col-sm-12">
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
									<mat-expansion-panel class="my-3" [expanded]="true">
										<mat-expansion-panel-header>
											<mat-panel-title class="title text-nowrap"
												>{{ workerCategoryTypeCodes.ArmouredCarGuard | options : 'WorkerCategoryTypes' }}
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
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.ArmouredCarGuard)"
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
												>{{ workerCategoryTypeCodes.BodyArmourSales | options : 'WorkerCategoryTypes' }}
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
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.BodyArmourSales)"
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
												>{{
													workerCategoryTypeCodes.ClosedCircuitTelevisionInstaller | options : 'WorkerCategoryTypes'
												}}
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
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.ClosedCircuitTelevisionInstaller)"
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
												>{{
													workerCategoryTypeCodes.ElectronicLockingDeviceInstaller | options : 'WorkerCategoryTypes'
												}}
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
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.ElectronicLockingDeviceInstaller)"
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
												>{{ workerCategoryTypeCodes.FireInvestigator | options : 'WorkerCategoryTypes' }}
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
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.FireInvestigator)"
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
												>{{ workerCategoryTypeCodes.Locksmith | options : 'WorkerCategoryTypes' }}
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
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.Locksmith)"
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
												>{{ workerCategoryTypeCodes.LocksmithUnderSupervision | options : 'WorkerCategoryTypes' }}
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
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.LocksmithUnderSupervision)"
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
												>{{ workerCategoryTypeCodes.PrivateInvestigator | options : 'WorkerCategoryTypes' }}
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
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.PrivateInvestigator)"
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
												>{{
													workerCategoryTypeCodes.PrivateInvestigatorUnderSupervision | options : 'WorkerCategoryTypes'
												}}
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
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.PrivateInvestigatorUnderSupervision)"
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
												>{{ workerCategoryTypeCodes.SecurityAlarmInstaller | options : 'WorkerCategoryTypes' }}
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
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.SecurityAlarmInstaller)"
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
													workerCategoryTypeCodes.SecurityAlarmInstallerUnderSupervision
														| options : 'WorkerCategoryTypes'
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
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.SecurityAlarmInstallerUnderSupervision)"
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
												>{{ workerCategoryTypeCodes.SecurityAlarmMonitor | options : 'WorkerCategoryTypes' }}
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
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.SecurityAlarmMonitor)"
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
												>{{ workerCategoryTypeCodes.SecurityAlarmResponse | options : 'WorkerCategoryTypes' }}
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
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.SecurityAlarmResponse)"
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
												>{{ workerCategoryTypeCodes.SecurityAlarmSales | options : 'WorkerCategoryTypes' }}
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
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.SecurityAlarmSales)"
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
												>{{ workerCategoryTypeCodes.SecurityConsultant | options : 'WorkerCategoryTypes' }}
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
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.SecurityConsultant)"
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
												>{{ workerCategoryTypeCodes.SecurityGuard | options : 'WorkerCategoryTypes' }}
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
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.SecurityGuard)"
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
												>{{ workerCategoryTypeCodes.SecurityGuardUnderSupervision | options : 'WorkerCategoryTypes' }}
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
													aria-label="Remove category"
													(click)="onRemove(workerCategoryTypeCodes.SecurityGuardUnderSupervision)"
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
			.title {
				padding-bottom: 2px;
			}
		`,
	],
})
export class StepLicenceCategoryComponent implements OnInit, LicenceChildStepperStepComponent {
	category = '';
	isDirtyAndInvalid = false;

	validCategoryList: SelectOptions[] = WorkerCategoryTypes;

	workerCategoryTypes = WorkerCategoryTypes;
	workerCategoryTypeCodes = WorkerCategoryTypeCode;
	applicationTypeCodes = ApplicationTypeCode;

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

	title = 'Which categories of Security Worker Licence would you like?';
	infoTitle = '';

	readonly title_new = 'Which categories of Security Worker Licence are you applying for?';
	readonly subtitle_new = 'You can add up to a total of 6 categories';

	readonly title_renew = 'Which categories of Security Worker Licence would you like to renew?';
	readonly subtitle_renew = 'You can remove existing categories and add new ones';

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private dialog: MatDialog, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		switch (this.applicationTypeCode) {
			case ApplicationTypeCode.New: {
				this.title = this.title_new;
				this.infoTitle = this.subtitle_new;
				break;
			}
			case ApplicationTypeCode.Renewal: {
				this.title = this.title_renew;
				this.infoTitle = this.subtitle_renew;
				break;
			}
		}

		this.validCategoryList = this.licenceApplicationService.getValidCategoryList(this.categoryList);
	}

	onAddCategory(): void {
		if (this.category) {
			switch (this.category) {
				case WorkerCategoryTypeCode.ArmouredCarGuard:
					this.categoryArmouredCarGuardFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.BodyArmourSales:
					this.categoryBodyArmourSalesFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller:
					this.categoryClosedCircuitTelevisionInstallerFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller:
					this.categoryElectronicLockingDeviceInstallerFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.FireInvestigator:
					this.categoryFireInvestigatorFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.Locksmith:
					this.categoryLocksmithFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.LocksmithUnderSupervision:
					this.categoryLocksmithSupFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.PrivateInvestigator:
					this.categoryPrivateInvestigatorFormGroup.patchValue({ isInclude: true });
					this.onPromptFireInvestigator();
					break;
				case WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision:
					this.categoryPrivateInvestigatorSupFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.SecurityGuard:
					this.categorySecurityGuardFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.SecurityGuardUnderSupervision:
					this.categorySecurityGuardSupFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.SecurityAlarmInstaller:
					this.categorySecurityAlarmInstallerFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision:
					this.categorySecurityAlarmInstallerSupFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.SecurityAlarmMonitor:
					this.categorySecurityAlarmMonitorFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.SecurityAlarmResponse:
					this.categorySecurityAlarmResponseFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.SecurityAlarmSales:
					this.categorySecurityAlarmSalesFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.SecurityConsultant:
					this.categorySecurityConsultantFormGroup.patchValue({ isInclude: true });
					break;
			}

			this.validCategoryList = this.licenceApplicationService.getValidCategoryList(this.categoryList);

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
						case WorkerCategoryTypeCode.ArmouredCarGuard:
							this.categoryArmouredCarGuardFormGroup.reset();
							this.categoryArmouredCarGuardFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.BodyArmourSales:
							this.categoryBodyArmourSalesFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller:
							this.categoryClosedCircuitTelevisionInstallerFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller:
							this.categoryElectronicLockingDeviceInstallerFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.FireInvestigator:
							this.categoryFireInvestigatorFormGroup.reset();
							this.categoryFireInvestigatorFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.Locksmith:
							this.categoryLocksmithFormGroup.reset();
							this.categoryLocksmithFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.LocksmithUnderSupervision:
							this.categoryLocksmithSupFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.PrivateInvestigator:
							this.categoryPrivateInvestigatorFormGroup.reset();
							this.categoryPrivateInvestigatorFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision:
							this.categoryPrivateInvestigatorSupFormGroup.reset();
							this.categoryPrivateInvestigatorSupFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.SecurityGuard:
							this.categorySecurityGuardFormGroup.reset();
							this.categorySecurityGuardFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.SecurityGuardUnderSupervision:
							this.categorySecurityGuardSupFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.SecurityAlarmInstaller:
							this.categorySecurityAlarmInstallerFormGroup.reset();
							this.categorySecurityAlarmInstallerFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision:
							this.categorySecurityAlarmInstallerSupFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.SecurityAlarmMonitor:
							this.categorySecurityAlarmMonitorFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.SecurityAlarmResponse:
							this.categorySecurityAlarmResponseFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.SecurityAlarmSales:
							this.categorySecurityAlarmSalesFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.SecurityConsultant:
							this.categorySecurityConsultantFormGroup.reset();
							this.categorySecurityConsultantFormGroup.patchValue({ isInclude: false });
							break;
					}

					this.validCategoryList = this.licenceApplicationService.getValidCategoryList(this.categoryList);
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

					this.validCategoryList = this.licenceApplicationService.getValidCategoryList(this.categoryList);
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

	// get licenceNumber(): string {
	// 	return this.licenceModelData.caseNumber ?? '';
	// }
	// get expiryDate(): string {
	// 	return this.licenceModelData.expiryDate ?? '';
	// }
	// get licenceTermCode(): string {
	// 	return this.licenceModelData.licenceTermData.licenceTermCode ?? '';
	// }

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
}
