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
										<mat-option *ngFor="let item of validCategoryList; let i = index" [value]="item.code">
											{{ item.desc }}
										</mat-option>
									</mat-select>
								</mat-form-field>
								<mat-error class="mat-option-error" *ngIf="isDirtyAndInvalid">
									At least one category must be added. Click 'Add Category' after selecting a category.
								</mat-error>
							</div>
							<div class="col-md-4 col-sm-12">
								<button
									mat-stroked-button
									color="primary"
									class="large my-2"
									aria-label="Add a category"
									(click)="onAddCategory()"
								>
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
								The <strong>Locksmith</strong> business licence includes the licence category
								<strong>Electronic Locking Device Installer</strong>.
							</app-alert>
						</div>

						<div class="mt-2" *ngIf="showSecurityAlarmInstallerMessage">
							<app-alert type="success" icon="">
								The <strong>Security Alarm Installer</strong> business licence includes the following licence
								categories:
								<strong
									>Security Alarm Sales, Security Alarm Monitor, Security Alarm Response, Closed Circuit Television
									Installer, and Electronic Locking Device Installer</strong
								>.
							</app-alert>
						</div>

						<div class="mt-2" *ngIf="showSecurityAlarmResponseMessage">
							<app-alert type="success" icon="">
								The <strong>Security Alarm Response</strong> business licence includes the licence category
								<strong>Security Alarm Monitor</strong>.
							</app-alert>
						</div>

						<div class="mt-2" *ngIf="showSecurityGuardMessage">
							<app-alert type="success" icon="">
								The <strong>Security Guard</strong> business licence includes the following licence categories:
								<strong>Security Alarm Monitor and Security Alarm Response</strong>.
							</app-alert>
						</div>

						<mat-accordion multi="false">
							<ng-container *ngIf="this.ArmouredCarGuard.value">
								<div class="row">
									<div class="col-12">
										<mat-expansion-panel class="my-3 w-100" [expanded]="expandArmouredCarGuard">
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
													>{{ armouredCarGuardCode | options: 'WorkerCategoryTypes' }}
												</mat-panel-title>
											</mat-expansion-panel-header>
											<div class="row my-3">
												<div class="col-12 mx-auto">
													<button
														mat-stroked-button
														class="xlarge w-auto float-end"
														aria-label="Remove category"
														(click)="onRemove(armouredCarGuardCode)"
													>
														<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove this Category
													</button>
												</div>
											</div>

											<app-business-category-armoured-car-guard></app-business-category-armoured-car-guard>
										</mat-expansion-panel>
									</div>
								</div>
							</ng-container>

							<ng-container *ngIf="showBodyArmourSales">
								<app-form-licence-category-panel-simple
									[categoryTypeCode]="workerCategoryTypeCodes.BodyArmourSales"
									[expandCategory]="expandBodyArmourSales"
									(removeCategory)="onRemove($event)"
								></app-form-licence-category-panel-simple>
							</ng-container>

							<ng-container *ngIf="showClosedCircuitTelevisionInstaller">
								<app-form-licence-category-panel-simple
									[categoryTypeCode]="workerCategoryTypeCodes.ClosedCircuitTelevisionInstaller"
									[expandCategory]="expandClosedCircuitTelevisionInstaller"
									(removeCategory)="onRemove($event)"
								></app-form-licence-category-panel-simple>
							</ng-container>

							<ng-container *ngIf="showElectronicLockingDeviceInstaller">
								<app-form-licence-category-panel-simple
									[categoryTypeCode]="workerCategoryTypeCodes.ElectronicLockingDeviceInstaller"
									[expandCategory]="expandElectronicLockingDeviceInstaller"
									(removeCategory)="onRemove($event)"
								></app-form-licence-category-panel-simple>
							</ng-container>

							<ng-container *ngIf="showLocksmith">
								<app-form-licence-category-panel-simple
									[categoryTypeCode]="workerCategoryTypeCodes.Locksmith"
									[expandCategory]="expandLocksmith"
									(removeCategory)="onRemove($event)"
								></app-form-licence-category-panel-simple>
							</ng-container>

							<ng-container *ngIf="showPrivateInvestigator">
								<div class="row">
									<div class="col-12">
										<mat-expansion-panel class="my-3 w-100" [expanded]="expandPrivateInvestigator">
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
													>{{ privateInvestigatorCode | options: 'WorkerCategoryTypes' }}
												</mat-panel-title>
											</mat-expansion-panel-header>
											<div class="row my-3">
												<div class="col-12 mx-auto">
													<button
														mat-stroked-button
														class="xlarge w-auto float-end"
														aria-label="Remove category"
														(click)="onRemove(privateInvestigatorCode)"
													>
														<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove this Category
													</button>
												</div>
											</div>

											<app-business-category-private-investigator></app-business-category-private-investigator>
										</mat-expansion-panel>
									</div>
								</div>
							</ng-container>

							<ng-container *ngIf="showSecurityAlarmInstaller">
								<app-form-licence-category-panel-simple
									[categoryTypeCode]="workerCategoryTypeCodes.SecurityAlarmInstaller"
									[expandCategory]="expandSecurityAlarmInstaller"
									(removeCategory)="onRemove($event)"
								></app-form-licence-category-panel-simple>
							</ng-container>

							<ng-container *ngIf="showSecurityAlarmMonitor">
								<app-form-licence-category-panel-simple
									[categoryTypeCode]="workerCategoryTypeCodes.SecurityAlarmMonitor"
									[expandCategory]="expandSecurityAlarmMonitor"
									(removeCategory)="onRemove($event)"
								></app-form-licence-category-panel-simple>
							</ng-container>

							<ng-container *ngIf="showSecurityAlarmResponse">
								<app-form-licence-category-panel-simple
									[categoryTypeCode]="workerCategoryTypeCodes.SecurityAlarmResponse"
									[expandCategory]="expandSecurityAlarmResponse"
									(removeCategory)="onRemove($event)"
								></app-form-licence-category-panel-simple>
							</ng-container>

							<ng-container *ngIf="showSecurityAlarmSales">
								<app-form-licence-category-panel-simple
									[categoryTypeCode]="workerCategoryTypeCodes.SecurityAlarmSales"
									[expandCategory]="expandSecurityAlarmSales"
									(removeCategory)="onRemove($event)"
								></app-form-licence-category-panel-simple>
							</ng-container>

							<ng-container *ngIf="showSecurityConsultant">
								<app-form-licence-category-panel-simple
									[categoryTypeCode]="workerCategoryTypeCodes.SecurityConsultant"
									[expandCategory]="expandSecurityConsultant"
									(removeCategory)="onRemove($event)"
								></app-form-licence-category-panel-simple>
							</ng-container>

							<ng-container *ngIf="showSecurityGuard">
								<div class="row">
									<div class="col-12">
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
													{{ securityGuardCode | options: 'WorkerCategoryTypes' }}
												</mat-panel-title>
											</mat-expansion-panel-header>

											<div class="row my-3">
												<div class="col-12 mx-auto">
													<button
														mat-stroked-button
														class="xlarge w-auto float-end"
														aria-label="Remove category"
														(click)="onRemove(securityGuardCode)"
													>
														<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove this Category
													</button>
												</div>
											</div>

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
								<li>The business location(s)</li>
								<li>The expiry date of the insurance</li>
								<li>Proof that the insurance is valid in B.C.</li>
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
	standalone: false,
})
export class StepBusinessLicenceCategoryComponent implements OnInit, LicenceChildStepperStepComponent {
	isDirtyAndInvalid = false;

	form = this.businessApplicationService.categoryFormGroup;

	validCategoryList: SelectOptions[] = WorkerCategoryTypes;

	armouredCarGuardCode = WorkerCategoryTypeCode.ArmouredCarGuard;
	securityGuardCode = WorkerCategoryTypeCode.SecurityGuard;
	privateInvestigatorCode = WorkerCategoryTypeCode.PrivateInvestigator;

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

	originalCategoryCodes: Array<WorkerCategoryTypeCode> | null = [];
	availableCategoryCodes: Array<WorkerCategoryTypeCode> = [];

	title = 'Which categories of business licence are you applying for?';
	infoTitle = '';

	readonly title_new = 'What category of business licence are you applying for?';
	readonly subtitle_new = '';

	readonly title_renew = 'Which business licence categories would you like to renew?';
	readonly subtitle_renew_update = 'You can add, edit, or remove categories as needed.';

	readonly title_update = 'Which business licence categories would you like to update?';

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

		const originalLicenceData = this.businessApplicationService.originalLicenceFormGroup.value;
		this.originalCategoryCodes = originalLicenceData.originalCategoryCodes;

		this.availableCategoryCodes = BusinessLicenceCategoryTypes.map(
			(item: SelectOptions) => item.code as WorkerCategoryTypeCode
		);

		this.validCategoryList = this.businessApplicationService.getValidBlCategoryList(
			this.categoryList,
			this.availableCategoryCodes
		);

		this.setupCategoryMessages();
	}

	onAddCategory(): void {
		const categoryCode = this.form.get('categoryCode')?.value;

		if (categoryCode) {
			switch (categoryCode) {
				case WorkerCategoryTypeCode.ArmouredCarGuard:
					this.expandArmouredCarGuard = true;
					this.categoryArmouredCarGuardFormGroup.patchValue({ isInclude: true });
					break;
				case WorkerCategoryTypeCode.PrivateInvestigator:
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

	onRemove(code: WorkerCategoryTypeCode) {
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
						case WorkerCategoryTypeCode.PrivateInvestigator:
							this.categoryPrivateInvestigatorFormGroup.reset();
							this.categoryPrivateInvestigatorFormGroup.patchValue({ isInclude: false });
							break;
						case WorkerCategoryTypeCode.SecurityGuard:
							this.categorySecurityGuardFormGroup.patchValue({ isInclude: false });
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

		const isValid = valid1 && valid2 && valid3 && valid4;

		this.isDirtyAndInvalid = this.categoryList.length == 0;
		return isValid && !this.showInsuranceError && !this.isDirtyAndInvalid;
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
}
