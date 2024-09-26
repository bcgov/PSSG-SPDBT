import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApplicationTypeCode, LicenceDocumentTypeCode, WorkerCategoryTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BusinessCategoryTypes, SelectOptions } from '@app/core/code-types/model-desc.models';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';

@Component({
	selector: 'app-step-business-licence-category',
	template: `
		<app-step-section [title]="title" [subtitle]="infoTitle">
			<div class="row">
				<div class="col-xxl-10 col-xl-10 col-lg-12 mx-auto">
					<form [formGroup]="form" novalidate>
						<div class="row mb-4">
							<ng-container *ngFor="let item of businessCategoryTypes; let i = index">
								<div class="col-xxl-4 col-xl-4 col-lg-6 col-md-12 col-sm-12">
									<mat-checkbox [formControlName]="item.code" (click)="onCategoryChange(item.code)">
										{{ item.desc }}
									</mat-checkbox>
								</div>
							</ng-container>
						</div>
						<mat-error
							class="mat-option-error"
							*ngIf="(form.dirty || form.touched) && form.invalid && form.hasError('atLeastOneTrue')"
							>At least one option must be selected</mat-error
						>

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

											<app-business-category-amoured-car-guard></app-business-category-amoured-car-guard>
										</mat-expansion-panel>
									</div>
								</div>
							</ng-container>

							<ng-container *ngIf="this.PrivateInvestigator.value && !isBusinessLicenceSoleProprietor">
								<div class="row">
									<div class="col-12">
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

											<app-business-category-private-investigator></app-business-category-private-investigator>
										</mat-expansion-panel>
									</div>
								</div>
							</ng-container>

							<ng-container *ngIf="this.SecurityGuard.value">
								<div class="row">
									<div class="col-12">
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
													>
													{{ workerCategoryTypeCodes.SecurityGuard | options : 'WorkerCategoryTypes' }}
												</mat-panel-title>
											</mat-expansion-panel-header>

											<app-business-category-security-guard></app-business-category-security-guard>
										</mat-expansion-panel>
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
					</form>
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

			.disabled-pointer {
				pointer-events: none;
			}
		`,
	],
	animations: [showHideTriggerSlideAnimation],
})
export class StepBusinessLicenceCategoryComponent implements OnInit, LicenceChildStepperStepComponent {
	form = this.businessApplicationService.categoryFormGroup;

	isUpdate!: boolean;

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
	expandPrivateInvestigator = false;
	expandSecurityGuard = false;

	blockArmouredCarGuard = false;
	blockPrivateInvestigator = false;
	blockSecurityGuard = false;

	originalCategoryCodes: Array<any> | null = [];

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

	constructor(private businessApplicationService: BusinessApplicationService) {}

	ngOnInit(): void {
		this.isUpdate = this.businessApplicationService.isUpdate(this.applicationTypeCode);
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

		this.initialSetupCategories();

		if (this.isBusinessLicenceSoleProprietor) {
			const businessInformationData = this.businessApplicationService.businessInformationFormGroup.value;
			this.originalCategoryCodes = businessInformationData.soleProprietorCategoryCodes;
			this.soleProprietorCategoryChange();
		} else {
			const originalLicenceData = this.businessApplicationService.originalBusinessLicenceFormGroup.value;
			this.originalCategoryCodes = originalLicenceData.originalCategoryCodes;
			this.businessCategoryTypes = BusinessCategoryTypes;
		}
	}

	onCategoryChange(changedItem: string, preventDisable: boolean = false): void {
		const formValue = this.form.value;

		type CategoryKey = keyof typeof this.businessApplicationService.categoryFormGroup;

		const armouredCarGuard = formValue[WorkerCategoryTypeCode.ArmouredCarGuard as unknown as CategoryKey];
		const privateInvestigator = formValue[WorkerCategoryTypeCode.PrivateInvestigator as unknown as CategoryKey];
		const securityGuard = formValue[WorkerCategoryTypeCode.SecurityGuard as unknown as CategoryKey];

		switch (changedItem) {
			case WorkerCategoryTypeCode.ArmouredCarGuard:
				this.categoryArmouredCarGuardFormGroup.patchValue({ isInclude: armouredCarGuard });
				break;
			case WorkerCategoryTypeCode.SecurityGuard:
				this.categorySecurityGuardFormGroup.patchValue({ isInclude: securityGuard });
				break;
			case WorkerCategoryTypeCode.PrivateInvestigator:
				this.categoryPrivateInvestigatorFormGroup.patchValue({ isInclude: privateInvestigator });
				break;
		}

		if (!this.isBusinessLicenceSoleProprietor) {
			this.setupCategory(changedItem, preventDisable);

			this.checkInsuranceRequirements();
		}
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

	isSelected(option: string): boolean {
		const item = this.form.get(option) as FormControl;
		return item.value;
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

	private initialSetupCategories(): void {
		const formValue = this.form.value;

		if (!this.isBusinessLicenceSoleProprietor) {
			if (formValue.Locksmith) {
				this.setupCategory(WorkerCategoryTypeCode.Locksmith);
			}

			if (formValue.SecurityGuard) {
				this.setupCategory(WorkerCategoryTypeCode.SecurityGuard);
			}

			if (formValue.SecurityAlarmInstaller) {
				this.setupCategory(WorkerCategoryTypeCode.SecurityAlarmInstaller);
			}

			if (formValue.SecurityAlarmResponse) {
				this.setupCategory(WorkerCategoryTypeCode.SecurityAlarmResponse);
			}
		}

		if (this.isUpdate) {
			if (this.ArmouredCarGuard.value) {
				this.blockArmouredCarGuard = true;
			}
			if (this.PrivateInvestigator.value) {
				this.blockPrivateInvestigator = true;
			}
			if (this.SecurityGuard.value) {
				this.blockSecurityGuard = true;
			}
		}
	}

	private setupCategory(changedItem: string, preventDisable: boolean = false): void {
		const formValue = this.form.value;

		type CategoryKey = keyof typeof this.businessApplicationService.categoryFormGroup;

		const locksmith = formValue[WorkerCategoryTypeCode.Locksmith as unknown as CategoryKey];
		const securityAlarmInstaller = formValue[WorkerCategoryTypeCode.SecurityAlarmInstaller as unknown as CategoryKey];
		const securityAlarmResponse = formValue[WorkerCategoryTypeCode.SecurityAlarmResponse as unknown as CategoryKey];
		const securityGuard = formValue[WorkerCategoryTypeCode.SecurityGuard as unknown as CategoryKey];

		switch (changedItem) {
			case WorkerCategoryTypeCode.Locksmith:
				this.showLocksmithMessage = locksmith;
				if (locksmith) {
					this.setAndDisable(WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller);
				} else if (!preventDisable) {
					this.unsetAndEnable(WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller);
				}
				break;
			case WorkerCategoryTypeCode.SecurityGuard:
				this.showSecurityGuardMessage = securityGuard;
				if (securityGuard) {
					this.setAndDisable(WorkerCategoryTypeCode.SecurityAlarmMonitor);
					this.setAndDisable(WorkerCategoryTypeCode.SecurityAlarmResponse);
				} else if (!preventDisable) {
					this.unsetAndEnable(WorkerCategoryTypeCode.SecurityAlarmMonitor);
					this.unsetAndEnable(WorkerCategoryTypeCode.SecurityAlarmResponse);
				}
				break;
			case WorkerCategoryTypeCode.SecurityAlarmInstaller:
				this.showSecurityAlarmInstallerMessage = securityAlarmInstaller;
				if (securityAlarmInstaller) {
					this.setAndDisable(WorkerCategoryTypeCode.SecurityAlarmSales);
					this.setAndDisable(WorkerCategoryTypeCode.SecurityAlarmMonitor);
					this.setAndDisable(WorkerCategoryTypeCode.SecurityAlarmResponse);
					this.setAndDisable(WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller);
					this.setAndDisable(WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller);
				} else if (!preventDisable) {
					this.unsetAndEnable(WorkerCategoryTypeCode.SecurityAlarmSales);
					this.unsetAndEnable(WorkerCategoryTypeCode.SecurityAlarmMonitor);
					this.unsetAndEnable(WorkerCategoryTypeCode.SecurityAlarmResponse);
					this.unsetAndEnable(WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller);
					this.unsetAndEnable(WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller);
				}
				break;
			case WorkerCategoryTypeCode.SecurityAlarmResponse:
				this.showSecurityAlarmResponseMessage = securityAlarmResponse;
				if (securityAlarmResponse) {
					this.setAndDisable(WorkerCategoryTypeCode.SecurityAlarmMonitor);
				} else if (!preventDisable) {
					this.unsetAndEnable(WorkerCategoryTypeCode.SecurityAlarmMonitor);
				}
				break;
		}

		if (securityGuard || securityAlarmInstaller) {
			this.showSecurityAlarmResponseMessage = false;
		}
	}

	private soleProprietorCategoryChange(): void {
		if (!this.isBusinessLicenceSoleProprietor) {
			return;
		}

		// Need to display all types that are selected and those in the original set of category codes.
		this.businessCategoryTypes = BusinessCategoryTypes.filter((item: SelectOptions) => {
			const itemControl = this.form.get(item.code) as FormControl;
			return itemControl.value || this.originalCategoryCodes?.includes(item.code);
		});
	}

	private checkInsuranceRequirements(): void {
		// Only check during Update flow
		if (this.applicationTypeCode != ApplicationTypeCode.Update) {
			return;
		}

		const hasAdditions = BusinessCategoryTypes.filter((item: SelectOptions) => {
			const itemControl = this.form.get(item.code) as FormControl;
			return itemControl.value && !this.originalCategoryCodes?.includes(item.code);
		});

		this.showInsurance = hasAdditions.length > 0;
	}

	private setAndDisable(itemType: WorkerCategoryTypeCode): void {
		const item = this.form.get(itemType) as FormControl;
		item.setValue(true, { emitEvent: false });
		item.disable({ emitEvent: false });
	}

	private unsetAndEnable(itemType: WorkerCategoryTypeCode): void {
		const item = this.form.get(itemType) as FormControl;
		item.setValue(false, { emitEvent: false });
		item.enable({ emitEvent: false });
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
}
