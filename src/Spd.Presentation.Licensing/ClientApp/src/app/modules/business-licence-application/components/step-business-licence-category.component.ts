import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationTypeCode, LicenceDocumentTypeCode, WorkerCategoryTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import {
	BusinessLicenceCategoryTypes,
	SelectOptions,
	WorkerCategoryTypes,
} from '@app/core/code-types/model-desc.models';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';

@Component({
	selector: 'app-step-business-licence-category',
	template: `
		<app-step-section [title]="title" [subtitle]="infoTitle">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="offset-xxl-2 col-xxl-8 offset-xl-2 col-xl-8 col-lg-12 mx-auto">
						<div class="row">
							<div class="col-md-8 col-sm-12">
								<mat-form-field>
									<mat-label>Category</mat-label>
									<mat-select formControlName="categoryCode">
										<mat-option *ngFor="let item of validCategoryList; let i = index" [value]="item.code">
											{{ item.desc }}
										</mat-option>
									</mat-select>
								</mat-form-field>
								<mat-error class="mat-option-error" *ngIf="isDirtyAndInvalid">
									At least one category must be added. Click 'Add Category' after selection.
								</mat-error>
							</div>
							<div class="col-md-4 col-sm-12">
								<button mat-stroked-button color="primary" class="large my-2" (click)="onAddCategory()">
									Add Category
								</button>
							</div>
						</div>
					</div>
				</div>

				<div class="row">
					<div class="col-xxl-10 col-xl-10 col-lg-12 mx-auto">
						<div class="mt-2" *ngIf="showInsurance">
							<app-alert type="warning" icon="warning">
								Security businesses are required to carry and maintain general liability insurance in an amount not less
								than $1,000,000. Please ensure you have the appropriate insurance. You may be asked to provide proof of
								insurance by Security Services at any time while licensed.
							</app-alert>
						</div>

						<div class="mt-2" *ngIf="showLocksmithMessage">
							<app-alert type="success" icon="">
								The <strong>Locksmith</strong> business licence automatically includes Electronic Locking Device
								Installer.
							</app-alert>
						</div>

						<div class="mt-2" *ngIf="showSecurityAlarmInstallerMessage">
							<app-alert type="success" icon="">
								The <strong>Security Alarm Installer</strong> business licence automatically includes Security Alarm
								Sales, Security Alarm Monitor, Security Alarm Response, Closed Circuit Television Installer, and
								Electronic Locking Device Installer.
							</app-alert>
						</div>

						<div class="mt-2" *ngIf="showSecurityAlarmResponseMessage">
							<app-alert type="success" icon="">
								The <strong>Security Alarm Response</strong> business licence automatically includes Security Alarm
								Monitor.
							</app-alert>
						</div>

						<div class="mt-2" *ngIf="showSecurityGuardMessage">
							<app-alert type="success" icon="">
								The <strong>Security Guard</strong> business licence automatically includes Security Alarm Monitor and
								Security Alarm Response.
							</app-alert>
						</div>

						<mat-accordion multi="false">
							<ng-container *ngIf="this.ArmouredCarGuard.value">
								<div class="row">
									<div class="col-12">
										<mat-expansion-panel
											[hideToggle]="blockArmouredCarGuard"
											class="my-3 w-100"
											[ngClass]="{ 'disabled-pointer': blockArmouredCarGuard }"
											[disabled]="blockArmouredCarGuard"
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
													>{{ workerCategoryTypeCodes.ArmouredCarGuard | options : 'WorkerCategoryTypes' }}
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

											<app-business-category-amoured-car-guard></app-business-category-amoured-car-guard>
										</mat-expansion-panel>
									</div>
								</div>
							</ng-container>

							<ng-container *ngIf="showBodyArmourSales">
								<app-licence-category-panel-simple
									[categoryTypeCode]="workerCategoryTypeCodes.BodyArmourSales"
									[blockCategory]="blockBodyArmourSales"
									[expandCategory]="expandBodyArmourSales"
									(removeCategory)="onRemove($event)"
									(deselectCategory)="onDeselect($event)"
								></app-licence-category-panel-simple>
							</ng-container>

							<ng-container *ngIf="showClosedCircuitTelevisionInstaller">
								<app-licence-category-panel-simple
									[categoryTypeCode]="workerCategoryTypeCodes.ClosedCircuitTelevisionInstaller"
									[blockCategory]="blockClosedCircuitTelevisionInstaller"
									[expandCategory]="expandClosedCircuitTelevisionInstaller"
									(removeCategory)="onRemove($event)"
									(deselectCategory)="onDeselect($event)"
								></app-licence-category-panel-simple>
							</ng-container>

							<ng-container *ngIf="showElectronicLockingDeviceInstaller">
								<app-licence-category-panel-simple
									[categoryTypeCode]="workerCategoryTypeCodes.ElectronicLockingDeviceInstaller"
									[blockCategory]="blockElectronicLockingDeviceInstaller"
									[expandCategory]="expandElectronicLockingDeviceInstaller"
									(removeCategory)="onRemove($event)"
									(deselectCategory)="onDeselect($event)"
								></app-licence-category-panel-simple>
							</ng-container>

							<ng-container *ngIf="showLocksmith">
								<app-licence-category-panel-simple
									[categoryTypeCode]="workerCategoryTypeCodes.Locksmith"
									[blockCategory]="blockLocksmith"
									[expandCategory]="expandLocksmith"
									(removeCategory)="onRemove($event)"
									(deselectCategory)="onDeselect($event)"
								></app-licence-category-panel-simple>
							</ng-container>

							<ng-container *ngIf="showPrivateInvestigator">
								<ng-container *ngIf="isBusinessLicenceSoleProprietor; else notBusinessLicenceSoleProprietor">
									<app-licence-category-panel-simple
										[categoryTypeCode]="workerCategoryTypeCodes.PrivateInvestigator"
										[blockCategory]="blockPrivateInvestigator"
										[expandCategory]="expandPrivateInvestigator"
										(removeCategory)="onRemove($event)"
										(deselectCategory)="onDeselect($event)"
									></app-licence-category-panel-simple>
								</ng-container>
								<ng-template #notBusinessLicenceSoleProprietor>
									<div class="row">
										<div class="col-12">
											<mat-expansion-panel
												[hideToggle]="blockPrivateInvestigator"
												class="my-3 w-100"
												[ngClass]="{ 'disabled-pointer': blockPrivateInvestigator }"
												[disabled]="blockPrivateInvestigator"
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

												<app-business-category-private-investigator></app-business-category-private-investigator>
											</mat-expansion-panel>
										</div>
									</div>
								</ng-template>
							</ng-container>

							<ng-container *ngIf="showSecurityAlarmInstaller">
								<app-licence-category-panel-simple
									[categoryTypeCode]="workerCategoryTypeCodes.SecurityAlarmInstaller"
									[blockCategory]="blockSecurityAlarmInstaller"
									[expandCategory]="expandSecurityAlarmInstaller"
									(removeCategory)="onRemove($event)"
									(deselectCategory)="onDeselect($event)"
								></app-licence-category-panel-simple>
							</ng-container>

							<ng-container *ngIf="showSecurityAlarmMonitor">
								<app-licence-category-panel-simple
									[categoryTypeCode]="workerCategoryTypeCodes.SecurityAlarmMonitor"
									[blockCategory]="blockSecurityAlarmMonitor"
									[expandCategory]="expandSecurityAlarmMonitor"
									(removeCategory)="onRemove($event)"
									(deselectCategory)="onDeselect($event)"
								></app-licence-category-panel-simple>
							</ng-container>

							<ng-container *ngIf="showSecurityAlarmResponse">
								<app-licence-category-panel-simple
									[categoryTypeCode]="workerCategoryTypeCodes.SecurityAlarmResponse"
									[blockCategory]="blockSecurityAlarmResponse"
									[expandCategory]="expandSecurityAlarmResponse"
									(removeCategory)="onRemove($event)"
									(deselectCategory)="onDeselect($event)"
								></app-licence-category-panel-simple>
							</ng-container>

							<ng-container *ngIf="showSecurityAlarmSales">
								<app-licence-category-panel-simple
									[categoryTypeCode]="workerCategoryTypeCodes.SecurityAlarmSales"
									[blockCategory]="blockSecurityAlarmSales"
									[expandCategory]="expandSecurityAlarmSales"
									(removeCategory)="onRemove($event)"
									(deselectCategory)="onDeselect($event)"
								></app-licence-category-panel-simple>
							</ng-container>

							<ng-container *ngIf="showSecurityConsultant">
								<app-licence-category-panel-simple
									[categoryTypeCode]="workerCategoryTypeCodes.SecurityConsultant"
									[blockCategory]="blockSecurityConsultant"
									[expandCategory]="expandSecurityConsultant"
									(removeCategory)="onRemove($event)"
									(deselectCategory)="onDeselect($event)"
								></app-licence-category-panel-simple>
							</ng-container>

							<ng-container *ngIf="showSecurityGuard">
								<div class="row">
									<div
										class="col-md-12 col-sm-12"
										[ngClass]="blockSecurityGuard ? 'col-xl-10 col-lg-9' : 'col-xl-12 col-lg-12'"
									>
										<mat-expansion-panel class="my-3 w-100" [expanded]="expandSecurityGuard">
											<mat-expansion-panel-header>
												<mat-panel-title>
													<mat-icon
														class="error-icon"
														color="warn"
														matTooltip="One or more errors exist in this category"
														*ngIf="categorySecurityGuardFormGroup?.touched && categorySecurityGuardFormGroup?.invalid"
														>error</mat-icon
													>
													{{ workerCategoryTypeCodes.SecurityGuard | options : 'WorkerCategoryTypes' }}
												</mat-panel-title>
											</mat-expansion-panel-header>

											<div class="row my-3" *ngIf="!blockSecurityGuard">
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

											<app-business-category-security-guard></app-business-category-security-guard>
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
						</mat-accordion>

						<div class="my-2" *ngIf="showInsurance" @showHideTriggerSlideAnimation>
							<mat-divider class="mb-3 mat-divider-primary"></mat-divider>

							<div class="text-minor-heading mb-2">Upload proof of insurance</div>
							<div>The insurance document must also include:</div>
							<ul>
								<li>The business name</li>
								<li>The business locations</li>
								<li>The expiry date of the insurance</li>
								<li>Proof that insurance is valid in B.C.</li>
							</ul>

							<app-file-upload
								(fileUploaded)="onFileUploaded($event)"
								(fileRemoved)="onFileRemoved()"
								[control]="attachments"
								[maxNumberOfFiles]="10"
								[files]="attachments.value"
							></app-file-upload>
							<mat-error class="mat-option-error" *ngIf="showInsuranceError">This is required</mat-error>
						</div>
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

			.disabled-pointer {
				pointer-events: none;
			}
		`,
	],
	animations: [showHideTriggerSlideAnimation],
})
export class StepBusinessLicenceCategoryComponent implements OnInit, LicenceChildStepperStepComponent {
	isDirtyAndInvalid = false;

	form = this.businessApplicationService.categoryFormGroup;

	validCategoryList: SelectOptions[] = WorkerCategoryTypes;

	businessCategoryTypes: SelectOptions[] = [];
	workerCategoryTypeCodes = WorkerCategoryTypeCode;

	categoryArmouredCarGuardFormGroup = this.businessApplicationService.categoryArmouredCarGuardFormGroup;
	categoryPrivateInvestigatorFormGroup = this.businessApplicationService.categoryPrivateInvestigatorFormGroup;
	categorySecurityGuardFormGroup = this.businessApplicationService.categorySecurityGuardFormGroup;

	showInsurance = false;
	showInsuranceError = false;
	showLocksmithMessage = false;
	showSecurityAlarmInstallerMessage = false;
	showSecurityAlarmResponseMessage = false;
	showSecurityGuardMessage = false;

	expandArmouredCarGuard = false;
	expandBodyArmourSales = false;
	expandClosedCircuitTelevisionInstaller = false;
	expandElectronicLockingDeviceInstaller = false;
	expandLocksmith = false;
	expandPrivateInvestigator = false;
	expandSecurityGuard = false;
	expandSecurityAlarmInstaller = false;
	expandSecurityAlarmMonitor = false;
	expandSecurityAlarmResponse = false;
	expandSecurityAlarmSales = false;
	expandSecurityConsultant = false;

	blockArmouredCarGuard = false;
	blockBodyArmourSales = false;
	blockClosedCircuitTelevisionInstaller = false;
	blockElectronicLockingDeviceInstaller = false;
	blockLocksmith = false;
	blockPrivateInvestigator = false;
	blockSecurityAlarmInstaller = false;
	blockSecurityAlarmMonitor = false;
	blockSecurityAlarmResponse = false;
	blockSecurityAlarmSales = false;
	blockSecurityConsultant = false;
	blockSecurityGuard = false;

	originalCategoryCodes: Array<WorkerCategoryTypeCode> | null = [];
	availableCategoryCodes: Array<WorkerCategoryTypeCode> = [];

	title = 'Which categories of business licence are you applying for?';
	infoTitle = '';

	readonly title_new = 'What category of business licence are you applying for?';
	readonly subtitle_new = '';

	readonly title_renew = 'Which categories of the Business Licence would you like to renew?';
	readonly subtitle_renew_update = 'You can change and remove existing categories as well as add new ones';

	readonly title_update = 'Which categories of the Business Licence would you like to update?';

	@Input() isBusinessLicenceSoleProprietor!: boolean;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(
		private dialog: MatDialog,
		private optionsPipe: OptionsPipe,
		private businessApplicationService: BusinessApplicationService
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

		if (this.isBusinessLicenceSoleProprietor) {
			const businessInformationData = this.businessApplicationService.businessInformationFormGroup.value;
			this.originalCategoryCodes = businessInformationData.soleProprietorCategoryCodes;
			this.availableCategoryCodes = businessInformationData.soleProprietorCategoryCodes ?? [];
		} else {
			const originalLicenceData = this.businessApplicationService.originalLicenceFormGroup.value;
			this.originalCategoryCodes = originalLicenceData.originalCategoryCodes;
			this.businessCategoryTypes = BusinessLicenceCategoryTypes;
			this.availableCategoryCodes = BusinessLicenceCategoryTypes.map(
				(item: SelectOptions) => item.code as WorkerCategoryTypeCode
			);
		}

		this.validCategoryList = this.businessApplicationService.getValidBlCategoryList(
			this.categoryList,
			this.availableCategoryCodes
		);

		this.setupCategoryMessages();

		this.setupInitialExpansionPanel();
	}

	onAddCategory(): void {
		const categoryCode = this.form.get('categoryCode')?.value;

		if (categoryCode) {
			switch (categoryCode) {
				case WorkerCategoryTypeCode.ArmouredCarGuard:
					// if (!this.blockArmouredCarGuard)
					this.expandArmouredCarGuard = true;
					this.categoryArmouredCarGuardFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.PrivateInvestigator:
					// if (!this.blockPrivateInvestigator)
					this.expandPrivateInvestigator = true;
					this.categoryPrivateInvestigatorFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.SecurityGuard:
					this.expandSecurityGuard = true;
					this.categorySecurityGuardFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.BodyArmourSales:
					this.expandBodyArmourSales = true;
					break;
				case WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller:
					this.expandClosedCircuitTelevisionInstaller = true;
					break;
				case WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller:
					this.expandElectronicLockingDeviceInstaller = true;
					break;
				case WorkerCategoryTypeCode.Locksmith:
					this.expandLocksmith = true;
					break;
				case WorkerCategoryTypeCode.SecurityAlarmInstaller:
					this.expandSecurityAlarmInstaller = true;
					break;
				case WorkerCategoryTypeCode.SecurityAlarmMonitor:
					this.expandSecurityAlarmMonitor = true;
					break;
				case WorkerCategoryTypeCode.SecurityAlarmResponse:
					this.expandSecurityAlarmResponse = true;
					break;
				case WorkerCategoryTypeCode.SecurityAlarmSales:
					this.expandSecurityAlarmSales = true;
					break;
				case WorkerCategoryTypeCode.SecurityConsultant:
					this.expandSecurityConsultant = true;
					break;
			}

			this.form.patchValue({ [categoryCode]: true });

			this.validCategoryList = this.businessApplicationService.getValidBlCategoryList(
				this.categoryList,
				this.availableCategoryCodes
			);

			this.setupCategoryMessage(categoryCode);

			this.form.patchValue({ categoryCode: null });
			this.isDirtyAndInvalid = false;

			if (!this.isBusinessLicenceSoleProprietor) {
				this.checkInsuranceRequirements();
			}
		}
	}

	onDeselect(code: WorkerCategoryTypeCode) {
		this.onRemove(code, true);
	}

	onRemove(code: WorkerCategoryTypeCode, justDeselect = false) {
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
							break;
						case WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller:
							if (!justDeselect) {
								this.blockClosedCircuitTelevisionInstaller = false;
							}
							break;
						case WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller:
							if (!justDeselect) {
								this.blockElectronicLockingDeviceInstaller = false;
							}
							break;
						case WorkerCategoryTypeCode.Locksmith:
							if (!justDeselect) {
								this.blockLocksmith = false;
							}
							break;
						case WorkerCategoryTypeCode.PrivateInvestigator:
							if (!justDeselect) {
								this.categoryPrivateInvestigatorFormGroup.reset();
								this.blockPrivateInvestigator = false;
							}
							this.categoryPrivateInvestigatorFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.SecurityGuard:
							if (!justDeselect) {
								this.categorySecurityGuardFormGroup.reset();
								this.blockSecurityGuard = false;
							}
							this.categorySecurityGuardFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.SecurityAlarmInstaller:
							if (!justDeselect) {
								this.blockSecurityAlarmInstaller = false;
							}
							break;
						case WorkerCategoryTypeCode.SecurityAlarmMonitor:
							if (!justDeselect) {
								this.blockSecurityAlarmMonitor = false;
							}
							break;
						case WorkerCategoryTypeCode.SecurityAlarmResponse:
							if (!justDeselect) {
								this.blockSecurityAlarmResponse = false;
							}
							break;
						case WorkerCategoryTypeCode.SecurityAlarmSales:
							if (!justDeselect) {
								this.blockSecurityAlarmSales = false;
							}
							break;
						case WorkerCategoryTypeCode.SecurityConsultant:
							if (!justDeselect) {
								this.blockSecurityConsultant = false;
							}
							break;
					}

					this.form.patchValue({ [code]: false });

					this.validCategoryList = this.businessApplicationService.getValidBlCategoryList(
						this.categoryList,
						this.availableCategoryCodes
					);
					this.setupCategoryMessage(code);
					this.isDirtyAndInvalid = false;
				}
			});
	}

	get categoryList(): Array<string> {
		const formValue = this.form.getRawValue();

		type CategoryKey = keyof typeof this.businessApplicationService.categoryFormGroup;

		const businessLicenceCategoryTypes = Object.values(BusinessLicenceCategoryTypes);
		return businessLicenceCategoryTypes
			.filter((item: SelectOptions) => {
				const catItem = formValue[item.code as unknown as CategoryKey];
				return !!catItem;
			})
			.map((option: SelectOptions) => option.code);
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
			if (this.showLocksmith) {
				this.blockLocksmith = true;
			}
			if (this.showPrivateInvestigator) {
				this.blockPrivateInvestigator = true;
			}
			if (this.showSecurityAlarmInstaller) {
				this.blockSecurityAlarmInstaller = true;
			}
			if (this.showSecurityConsultant) {
				this.blockSecurityConsultant = true;
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
			if (this.showSecurityGuard) {
				this.blockSecurityGuard = true;
			}
		}
	}

	get showArmouredCarGuard(): boolean {
		return !!this.form.get('ArmouredCarGuard')?.value;
	}
	get showBodyArmourSales(): boolean {
		return !!this.form.get('BodyArmourSales')?.value;
	}
	get showClosedCircuitTelevisionInstaller(): boolean {
		return !!this.form.get('ClosedCircuitTelevisionInstaller')?.value;
	}
	get showElectronicLockingDeviceInstaller(): boolean {
		return !!this.form.get('ElectronicLockingDeviceInstaller')?.value;
	}
	get showLocksmith(): boolean {
		return !!this.form.get('Locksmith')?.value;
	}
	get showPrivateInvestigator(): boolean {
		return !!this.form.get('PrivateInvestigator')?.value;
	}
	get showSecurityAlarmInstaller(): boolean {
		return !!this.form.get('SecurityAlarmInstaller')?.value;
	}
	get showSecurityConsultant(): boolean {
		return !!this.form.get('SecurityConsultant')?.value;
	}
	get showSecurityGuard(): boolean {
		return !!this.form.get('SecurityGuard')?.value;
	}
	get showSecurityAlarmMonitor(): boolean {
		return !!this.form.get('SecurityAlarmMonitor')?.value;
	}
	get showSecurityAlarmResponse(): boolean {
		return !!this.form.get('SecurityAlarmResponse')?.value;
	}
	get showSecurityAlarmSales(): boolean {
		return !!this.form.get('SecurityAlarmSales')?.value;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();

		const valid1 = this.form.valid;

		let valid2 = true;
		if (this.ArmouredCarGuard.value) {
			this.categoryArmouredCarGuardFormGroup.markAllAsTouched();
			valid2 = this.categoryArmouredCarGuardFormGroup.valid;
		}
		let valid3 = true;
		if (this.PrivateInvestigator.value) {
			this.categoryPrivateInvestigatorFormGroup.markAllAsTouched();
			valid3 = this.categoryPrivateInvestigatorFormGroup.valid;
		}
		let valid4 = true;
		if (this.SecurityGuard.value) {
			this.categorySecurityGuardFormGroup.markAllAsTouched();
			valid4 = this.categorySecurityGuardFormGroup.valid;
		}

		this.showInsuranceError = false;
		if (this.showInsurance) {
			const attachments = this.attachments.value ?? [];
			this.showInsuranceError = attachments.length === 0;
		}

		console.debug(
			'[StepBusinessLicenceCategoryComponent] isFormValid',
			valid1,
			valid2,
			valid3,
			valid4,
			!this.showInsuranceError
		);

		return valid1 && valid2 && valid3 && valid4 && !this.showInsuranceError;
	}

	onFileUploaded(file: File): void {
		this.businessApplicationService.hasValueChanged = true;

		if (!this.businessApplicationService.isAutoSave()) {
			return;
		}

		this.businessApplicationService.addUploadDocument(LicenceDocumentTypeCode.BizInsurance, file).subscribe({
			next: (resp: any) => {
				const matchingFile = this.attachments.value.find((item: File) => item.name == file.name);
				matchingFile.documentUrlId = resp.body[0].documentUrlId;
			},
			error: (error: any) => {
				console.log('An error occurred during file upload', error);
				this.fileUploadComponent.removeFailedFile(file);
			},
		});
	}

	onFileRemoved(): void {
		this.businessApplicationService.hasValueChanged = true;
	}

	private setupCategoryMessages(): void {
		this.setupCategoryMessage(WorkerCategoryTypeCode.Locksmith);
		this.setupCategoryMessage(WorkerCategoryTypeCode.SecurityGuard);
		this.setupCategoryMessage(WorkerCategoryTypeCode.SecurityAlarmInstaller);
		this.setupCategoryMessage(WorkerCategoryTypeCode.SecurityAlarmResponse);
	}

	private setupCategoryMessage(categoryCode: WorkerCategoryTypeCode): void {
		const formValue = this.form.value;
		type CategoryKey = keyof typeof this.businessApplicationService.categoryFormGroup;

		const securityGuard = formValue[WorkerCategoryTypeCode.SecurityGuard as unknown as CategoryKey];
		const securityAlarmInstaller = formValue[WorkerCategoryTypeCode.SecurityAlarmInstaller as unknown as CategoryKey];

		switch (categoryCode) {
			case WorkerCategoryTypeCode.Locksmith: {
				const locksmith = formValue[WorkerCategoryTypeCode.Locksmith as unknown as CategoryKey];
				this.showLocksmithMessage = locksmith;
				break;
			}
			case WorkerCategoryTypeCode.SecurityGuard: {
				const securityGuard = formValue[WorkerCategoryTypeCode.SecurityGuard as unknown as CategoryKey];
				this.showSecurityGuardMessage = securityGuard;
				break;
			}
			case WorkerCategoryTypeCode.SecurityAlarmInstaller: {
				this.showSecurityAlarmInstallerMessage = securityAlarmInstaller;
				break;
			}
			case WorkerCategoryTypeCode.SecurityAlarmResponse: {
				const securityAlarmResponse = formValue[WorkerCategoryTypeCode.SecurityAlarmResponse as unknown as CategoryKey];
				this.showSecurityAlarmResponseMessage = securityAlarmResponse;
				break;
			}
		}

		if (securityGuard || securityAlarmInstaller) {
			this.showSecurityAlarmResponseMessage = false;
		}
	}

	private checkInsuranceRequirements(): void {
		// Only check during Update flow
		if (this.applicationTypeCode != ApplicationTypeCode.Update) {
			return;
		}

		const hasAdditions = BusinessLicenceCategoryTypes.filter((item: SelectOptions) => {
			const itemControl = this.form.get(item.code) as FormControl;
			return itemControl.value && !this.originalCategoryCodes?.includes(item.code as WorkerCategoryTypeCode);
		});

		this.showInsurance = hasAdditions.length > 0;
	}

	get ArmouredCarGuard(): FormControl {
		return this.form.get(WorkerCategoryTypeCode.ArmouredCarGuard) as FormControl;
	}
	get BodyArmourSales(): FormControl {
		return this.form.get(WorkerCategoryTypeCode.BodyArmourSales) as FormControl;
	}
	get ClosedCircuitTelevisionInstaller(): FormControl {
		return this.form.get(WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller) as FormControl;
	}
	get ElectronicLockingDeviceInstaller(): FormControl {
		return this.form.get(WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller) as FormControl;
	}
	get Locksmith(): FormControl {
		return this.form.get(WorkerCategoryTypeCode.Locksmith) as FormControl;
	}
	get PrivateInvestigator(): FormControl {
		return this.form.get(WorkerCategoryTypeCode.PrivateInvestigator) as FormControl;
	}
	get SecurityGuard(): FormControl {
		return this.form.get(WorkerCategoryTypeCode.SecurityGuard) as FormControl;
	}
	get SecurityAlarmInstaller(): FormControl {
		return this.form.get(WorkerCategoryTypeCode.SecurityAlarmInstaller) as FormControl;
	}
	get SecurityAlarmMonitor(): FormControl {
		return this.form.get(WorkerCategoryTypeCode.SecurityAlarmMonitor) as FormControl;
	}
	get SecurityAlarmResponse(): FormControl {
		return this.form.get(WorkerCategoryTypeCode.SecurityAlarmResponse) as FormControl;
	}
	get SecurityAlarmSales(): FormControl {
		return this.form.get(WorkerCategoryTypeCode.SecurityAlarmSales) as FormControl;
	}
	get SecurityConsultant(): FormControl {
		return this.form.get(WorkerCategoryTypeCode.SecurityConsultant) as FormControl;
	}
	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
	get isUpdate(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Update;
	}
}
