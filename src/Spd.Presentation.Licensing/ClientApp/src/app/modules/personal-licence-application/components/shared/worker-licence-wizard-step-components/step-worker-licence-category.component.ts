import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationTypeCode, ServiceTypeCode, WorkerCategoryTypeCode } from '@app/api/models';
import { SelectOptions, WorkerCategoryTypes } from '@app/core/code-types/model-desc.models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';

@Component({
	selector: 'app-step-worker-licence-category',
	template: `
		<app-step-section
		  [heading]="title"
		  [subheading]="infoTitle"
		  [isRenewalOrUpdate]="isRenewalOrUpdate"
		  [serviceTypeCode]="securityWorkerLicenceCode"
		  [applicationTypeCode]="applicationTypeCode"
		  >
		  <form [formGroup]="form" novalidate>
		    <div class="row">
		      <div class="col-xxl-8 col-xl-8 col-lg-12 mx-auto">
		        <div class="row">
		          <div class="col-12 mb-3">
		            <app-alert type="info" icon="info">
		              Select a category from the dropdown and then click 'Add Category'. Repeat this process for multiple
		              categories.
		            </app-alert>
		          </div>
		
		          <div class="col-md-8 col-sm-12">
		            <mat-form-field>
		              <mat-label>Category</mat-label>
		              <mat-select formControlName="categoryCode">
		                @for (item of validCategoryList; track item; let i = $index) {
		                  <mat-option [value]="item.code">
		                    {{ item.desc }}
		                  </mat-option>
		                }
		              </mat-select>
		            </mat-form-field>
		            @if (isCategoryListEmpty) {
		              <mat-error class="mat-option-error">
		                At least one category must be added. Click 'Add Category' after selecting a category.
		              </mat-error>
		            }
		          </div>
		          @if (categoryList.length < 6) {
		            <div class="col-md-4 col-sm-12">
		              <button mat-stroked-button color="primary" class="large my-2" (click)="onAddCategory()">
		                Add Category
		              </button>
		            </div>
		          }
		          @if (categoryList.length >= 6) {
		            <div class="col-md-4 col-sm-12">
		              <app-alert type="warning" icon="warning"> The limit of 6 categories has been reached. </app-alert>
		            </div>
		          }
		        </div>
		      </div>
		    </div>
		
		    <div class="row">
		      <div class="col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
		        <mat-accordion multi="false">
		          @if (showArmouredCarGuard) {
		            <div class="row">
		              <div class="col-12">
		                <mat-expansion-panel class="my-3 w-100" [expanded]="expandArmouredCarGuard">
		                  <mat-expansion-panel-header>
		                    <mat-panel-title>
		                      @if (
		                        categoryArmouredCarGuardFormGroup?.touched && categoryArmouredCarGuardFormGroup?.invalid
		                        ) {
		                        <mat-icon
		                          class="error-icon"
		                          color="warn"
		                          matTooltip="One or more errors exist in this category"
		                          >error</mat-icon
		                          >
		                        }
		                        {{ workerCategoryTypeCodes.ArmouredCarGuard | options: 'WorkerCategoryTypes' }}
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
		              </div>
		            }
		
		            @if (showBodyArmourSales) {
		              <app-form-licence-category-panel-simple
		                [categoryTypeCode]="workerCategoryTypeCodes.BodyArmourSales"
		                [expandCategory]="expandBodyArmourSales"
		                (removeCategory)="onRemove($event)"
		              ></app-form-licence-category-panel-simple>
		            }
		
		            @if (showClosedCircuitTelevisionInstaller) {
		              <app-form-licence-category-panel-simple
		                [categoryTypeCode]="workerCategoryTypeCodes.ClosedCircuitTelevisionInstaller"
		                [expandCategory]="expandClosedCircuitTelevisionInstaller"
		                (removeCategory)="onRemove($event)"
		              ></app-form-licence-category-panel-simple>
		            }
		
		            @if (showElectronicLockingDeviceInstaller) {
		              <app-form-licence-category-panel-simple
		                [categoryTypeCode]="workerCategoryTypeCodes.ElectronicLockingDeviceInstaller"
		                [expandCategory]="expandElectronicLockingDeviceInstaller"
		                (removeCategory)="onRemove($event)"
		              ></app-form-licence-category-panel-simple>
		            }
		
		            @if (showFireInvestigator) {
		              <div class="row">
		                <div class="col-12">
		                  <mat-expansion-panel class="my-3 w-100" [expanded]="expandFireInvestigator">
		                    <mat-expansion-panel-header>
		                      <mat-panel-title>
		                        @if (
		                          categoryFireInvestigatorFormGroup?.touched && categoryFireInvestigatorFormGroup?.invalid
		                          ) {
		                          <mat-icon
		                            class="error-icon"
		                            color="warn"
		                            matTooltip="One or more errors exist in this category"
		                            >error</mat-icon
		                            >
		                          }
		                          {{ workerCategoryTypeCodes.FireInvestigator | options: 'WorkerCategoryTypes' }}
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
		                </div>
		              }
		
		              @if (showLocksmith) {
		                <div class="row">
		                  <div class="col-12">
		                    <mat-expansion-panel class="my-3 w-100" [expanded]="expandLocksmith">
		                      <mat-expansion-panel-header>
		                        <mat-panel-title>
		                          @if (categoryLocksmithFormGroup?.touched && categoryLocksmithFormGroup?.invalid) {
		                            <mat-icon
		                              class="error-icon"
		                              color="warn"
		                              matTooltip="One or more errors exist in this category"
		                              >error</mat-icon
		                              >
		                            }
		                            {{ workerCategoryTypeCodes.Locksmith | options: 'WorkerCategoryTypes' }}
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
		                  </div>
		                }
		
		                @if (showLocksmithUnderSupervision) {
		                  <app-form-licence-category-panel-simple
		                    [categoryTypeCode]="workerCategoryTypeCodes.LocksmithUnderSupervision"
		                    [expandCategory]="expandLocksmithUnderSupervision"
		                    (removeCategory)="onRemove($event)"
		                  ></app-form-licence-category-panel-simple>
		                }
		
		                @if (showPrivateInvestigator) {
		                  <div class="row">
		                    <div class="col-12">
		                      <mat-expansion-panel class="my-3 w-100" [expanded]="expandPrivateInvestigator">
		                        <mat-expansion-panel-header>
		                          <mat-panel-title>
		                            @if (
		                              categoryPrivateInvestigatorFormGroup?.touched &&
		                              categoryPrivateInvestigatorFormGroup?.invalid
		                              ) {
		                              <mat-icon
		                                class="error-icon"
		                                color="warn"
		                                matTooltip="One or more errors exist in this category"
		                                >error</mat-icon
		                                >
		                                }{{ workerCategoryTypeCodes.PrivateInvestigator | options: 'WorkerCategoryTypes' }}
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
		                      </div>
		                    }
		
		                    @if (showPrivateInvestigatorUnderSupervision) {
		                      <div class="row">
		                        <div class="col-12">
		                          <mat-expansion-panel class="my-3 w-100" [expanded]="expandPrivateInvestigatorUnderSupervision">
		                            <mat-expansion-panel-header>
		                              <mat-panel-title>
		                                @if (
		                                  categoryPrivateInvestigatorSupFormGroup?.touched &&
		                                  categoryPrivateInvestigatorSupFormGroup?.invalid
		                                  ) {
		                                  <mat-icon
		                                    class="error-icon"
		                                    color="warn"
		                                    matTooltip="One or more errors exist in this category"
		                                    >error</mat-icon
		                                    >
		                                  }
		                                  {{
		                                  workerCategoryTypeCodes.PrivateInvestigatorUnderSupervision | options: 'WorkerCategoryTypes'
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
		                        </div>
		                      }
		
		                      @if (showSecurityAlarmInstaller) {
		                        <div class="row">
		                          <div class="col-12">
		                            <mat-expansion-panel class="my-3 w-100" [expanded]="expandSecurityAlarmInstaller">
		                              <mat-expansion-panel-header>
		                                <mat-panel-title>
		                                  @if (
		                                    categorySecurityAlarmInstallerFormGroup?.touched &&
		                                    categorySecurityAlarmInstallerFormGroup?.invalid
		                                    ) {
		                                    <mat-icon
		                                      class="error-icon"
		                                      color="warn"
		                                      matTooltip="One or more errors exist in this category"
		                                      >error</mat-icon
		                                      >
		                                    }
		                                    {{ workerCategoryTypeCodes.SecurityAlarmInstaller | options: 'WorkerCategoryTypes' }}
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
		                          </div>
		                        }
		
		                        @if (showSecurityAlarmInstallerUnderSupervision) {
		                          <app-form-licence-category-panel-simple
		                            [categoryTypeCode]="workerCategoryTypeCodes.SecurityAlarmInstallerUnderSupervision"
		                            [expandCategory]="expandSecurityAlarmInstallerUnderSupervision"
		                            (removeCategory)="onRemove($event)"
		                          ></app-form-licence-category-panel-simple>
		                        }
		
		                        @if (showSecurityAlarmMonitor) {
		                          <app-form-licence-category-panel-simple
		                            [categoryTypeCode]="workerCategoryTypeCodes.SecurityAlarmMonitor"
		                            [expandCategory]="expandSecurityAlarmMonitor"
		                            (removeCategory)="onRemove($event)"
		                          ></app-form-licence-category-panel-simple>
		                        }
		
		                        @if (showSecurityAlarmResponse) {
		                          <app-form-licence-category-panel-simple
		                            [categoryTypeCode]="workerCategoryTypeCodes.SecurityAlarmResponse"
		                            [expandCategory]="expandSecurityAlarmResponse"
		                            (removeCategory)="onRemove($event)"
		                          ></app-form-licence-category-panel-simple>
		                        }
		
		                        @if (showSecurityAlarmSales) {
		                          <app-form-licence-category-panel-simple
		                            [categoryTypeCode]="workerCategoryTypeCodes.SecurityAlarmSales"
		                            [expandCategory]="expandSecurityAlarmSales"
		                            (removeCategory)="onRemove($event)"
		                          ></app-form-licence-category-panel-simple>
		                        }
		
		                        @if (showSecurityConsultant) {
		                          <div class="row">
		                            <div class="col-12">
		                              <mat-expansion-panel class="my-3 w-100" [expanded]="expandSecurityConsultant">
		                                <mat-expansion-panel-header>
		                                  <mat-panel-title>
		                                    @if (
		                                      categorySecurityConsultantFormGroup?.touched &&
		                                      categorySecurityConsultantFormGroup?.invalid
		                                      ) {
		                                      <mat-icon
		                                        class="error-icon"
		                                        color="warn"
		                                        matTooltip="One or more errors exist in this category"
		                                        >error</mat-icon
		                                        >
		                                        }{{ workerCategoryTypeCodes.SecurityConsultant | options: 'WorkerCategoryTypes' }}
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
		                              </div>
		                            }
		
		                            @if (showSecurityGuard) {
		                              <div class="row">
		                                <div class="col-12">
		                                  <mat-expansion-panel class="my-3 w-100" [expanded]="expandSecurityGuard">
		                                    <mat-expansion-panel-header>
		                                      <mat-panel-title>
		                                        @if (categorySecurityGuardFormGroup?.touched && categorySecurityGuardFormGroup?.invalid) {
		                                          <mat-icon
		                                            class="error-icon"
		                                            color="warn"
		                                            matTooltip="One or more errors exist in this category"
		                                            >error</mat-icon
		                                            >
		                                            }{{ workerCategoryTypeCodes.SecurityGuard | options: 'WorkerCategoryTypes' }}
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
		                                  </div>
		                                }
		
		                                @if (showSecurityGuardUnderSupervision) {
		                                  <app-form-licence-category-panel-simple
		                                    [categoryTypeCode]="workerCategoryTypeCodes.SecurityGuardUnderSupervision"
		                                    [expandCategory]="expandSecurityGuardUnderSupervision"
		                                    (removeCategory)="onRemove($event)"
		                                  ></app-form-licence-category-panel-simple>
		                                }
		                              </mat-accordion>
		                            </div>
		                          </div>
		                        </form>
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
	standalone: false,
})
export class StepWorkerLicenceCategoryComponent implements OnInit, LicenceChildStepperStepComponent {
	isCategoryListEmpty = false;

	form = this.workerApplicationService.categorySelectionFormGroup;

	validCategoryList: SelectOptions[] = WorkerCategoryTypes;

	securityWorkerLicenceCode = ServiceTypeCode.SecurityWorkerLicence;
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
	@Input() isSoleProprietorSimultaneousFlow = false;

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

		this.validCategoryList = this.workerApplicationService.getValidSwlCategoryList(this.categoryList);
	}

	onAddCategory(): void {
		const categoryCode = this.form.get('categoryCode')?.value;

		if (categoryCode) {
			switch (categoryCode) {
				case WorkerCategoryTypeCode.ArmouredCarGuard:
					this.expandArmouredCarGuard = true;
					this.categoryArmouredCarGuardFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.BodyArmourSales:
					this.expandBodyArmourSales = true;
					this.categoryBodyArmourSalesFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller:
					this.expandClosedCircuitTelevisionInstaller = true;
					this.categoryClosedCircuitTelevisionInstallerFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller:
					this.expandElectronicLockingDeviceInstaller = true;
					this.categoryElectronicLockingDeviceInstallerFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.FireInvestigator:
					this.expandFireInvestigator = true;
					this.categoryFireInvestigatorFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.Locksmith:
					this.expandLocksmith = true;
					this.categoryLocksmithFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.LocksmithUnderSupervision:
					this.expandLocksmithUnderSupervision = true;
					this.categoryLocksmithSupFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.PrivateInvestigator:
					this.expandPrivateInvestigator = true;
					this.categoryPrivateInvestigatorFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision:
					this.expandPrivateInvestigatorUnderSupervision = true;
					this.categoryPrivateInvestigatorSupFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.SecurityGuard:
					this.expandSecurityGuard = true;
					this.categorySecurityGuardFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.SecurityGuardUnderSupervision:
					this.expandSecurityGuardUnderSupervision = true;
					this.categorySecurityGuardSupFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.SecurityAlarmInstaller:
					this.expandSecurityAlarmInstaller = true;
					this.categorySecurityAlarmInstallerFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision:
					this.expandSecurityAlarmInstallerUnderSupervision = true;
					this.categorySecurityAlarmInstallerSupFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.SecurityAlarmMonitor:
					this.expandSecurityAlarmMonitor = true;
					this.categorySecurityAlarmMonitorFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.SecurityAlarmResponse:
					this.expandSecurityAlarmResponse = true;
					this.categorySecurityAlarmResponseFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.SecurityAlarmSales:
					this.expandSecurityAlarmSales = true;
					this.categorySecurityAlarmSalesFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.SecurityConsultant:
					this.expandSecurityConsultant = true;
					this.categorySecurityConsultantFormGroup.patchValue({ isInclude: true });
					break;
			}

			this.validCategoryList = this.workerApplicationService.getValidSwlCategoryList(this.categoryList);

			this.form.reset();
			this.isCategoryListEmpty = false;
		}
	}

	onRemove(code: string) {
		const codeDesc = this.optionsPipe.transform(code, 'WorkerCategoryTypes');
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: `Are you sure you want to remove the ${codeDesc} category?`,
			actionText: 'Remove',
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

					this.validCategoryList = this.workerApplicationService.getValidSwlCategoryList(this.categoryList);
					this.isCategoryListEmpty = false;
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

		this.isCategoryListEmpty = this.categoryList.length === 0;

		const isValid =
			!this.isCategoryListEmpty &&
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

		return isValid;
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
}
