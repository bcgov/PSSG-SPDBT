import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WorkerCategoryTypeCode } from '@app/api/models';
import { BusinessCategoryTypes } from '@app/core/code-types/model-desc.models';
import { BusinessApplicationService } from '../../services/business-application.service';
import { LicenceChildStepperStepComponent } from '../../services/licence-application.helper';

@Component({
	selector: 'app-step-business-licence-category',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title [title]="title"></app-step-title>

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

							<div class="mt-2" *ngIf="showLocksmithMessage">
								<app-alert type="info" icon="">
									The <strong>Locksmith</strong> business licence automatically includes Electronic Locking Device
									Installer.
								</app-alert>
							</div>

							<div class="mt-2" *ngIf="showSecurityAlarmInstallerMessage">
								<app-alert type="info" icon="">
									The <strong>Security Alarm Installer</strong> business licence automatically includes Security Alarm
									Sales, Security Alarm Monitor, Security Alarm Response, Closed Circuit Television Installer, and
									Electronic Locking Device Installer.
								</app-alert>
							</div>

							<div class="mt-2" *ngIf="showSecurityAlarmResponseMessage">
								<app-alert type="info" icon="">
									The <strong>Security Alarm Response</strong> business licence automatically includes Security Alarm
									Monitor.
								</app-alert>
							</div>

							<div class="mt-2" *ngIf="showSecurityGuardMessage">
								<app-alert type="info" icon="">
									The <strong>Security Guard</strong> business licence automatically includes Security Alarm Monitor and
									Security Alarm Response.
								</app-alert>
							</div>

							<mat-accordion multi="false">
								<ng-container *ngIf="this.ArmouredCarGuard.value">
									<div class="row">
										<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
											<mat-expansion-panel class="my-3 w-100" [expanded]="true">
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

								<ng-container *ngIf="this.PrivateInvestigator.value">
									<div class="row">
										<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
											<mat-expansion-panel class="my-3 w-100" [expanded]="true">
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
										<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12">
											<mat-expansion-panel class="my-3 w-100" [expanded]="true">
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
						</form>
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

			.error-icon {
				margin-right: 0.5rem !important;
				overflow: visible !important;
			}
		`,
	],
})
export class StepBusinessLicenceCategoryComponent implements OnInit, LicenceChildStepperStepComponent {
	form = this.businessApplicationService.categoryFormGroup;

	businessCategoryTypes = BusinessCategoryTypes;
	workerCategoryTypeCodes = WorkerCategoryTypeCode;

	categoryArmouredCarGuardFormGroup = this.businessApplicationService.categoryArmouredCarGuardFormGroup;
	categoryPrivateInvestigatorFormGroup = this.businessApplicationService.categoryPrivateInvestigatorFormGroup;
	categorySecurityGuardFormGroup = this.businessApplicationService.categorySecurityGuardFormGroup;

	showLocksmithMessage = false;
	showSecurityAlarmInstallerMessage = false;
	showSecurityAlarmResponseMessage = false;
	showSecurityGuardMessage = false;

	title = 'Which categories of security business licence are you applying for?';
	// infoTitle = '';

	// readonly title_new = 'What category of security business licence are you applying for?';
	// readonly subtitle_new = 'You can add up to a total of 6 categories';

	// readonly title_renew = 'Which categories of Security Worker Licence would you like to renew?';
	// readonly subtitle_renew = 'You can change and remove existing categories as well as add new ones';

	// readonly title_update = 'Which categories of Security Worker Licence would you like to update?';
	// readonly subtitle_update = 'You can change and remove existing categories as well as add new ones';

	// @Input() applicationTypeCode: ApplicationTypeCode | null = null;
	@Input() isBusinessLicenceSoleProprietor!: boolean;

	constructor(private businessApplicationService: BusinessApplicationService) {}

	ngOnInit(): void {
		// switch (this.applicationTypeCode) {
		// 	case ApplicationTypeCode.New: {
		// 		this.title = this.title_new;
		// 		this.infoTitle = this.subtitle_new;
		// 		break;
		// 	}
		// 	case ApplicationTypeCode.Renewal: {
		// 		this.title = this.title_renew;
		// 		this.infoTitle = this.subtitle_renew;
		// 		break;
		// 	}
		// 	case ApplicationTypeCode.Update: {
		// 		this.title = this.title_update;
		// 		this.infoTitle = this.subtitle_update;
		// 		break;
		// 	}

		this.setupCategories();
	}

	setupCategories(): void {
		const formValue = this.form.value;

		// pass 'true' as 'preventDisable'
		// checkboxes can be deselected that shouldn't be
		if (formValue.SecurityAlarmInstaller) {
			this.onCategoryChange(WorkerCategoryTypeCode.SecurityAlarmInstaller, true);
		}

		if (formValue.SecurityGuard) {
			this.onCategoryChange(WorkerCategoryTypeCode.SecurityGuard, true);
		}

		if (formValue.SecurityAlarmResponse) {
			this.onCategoryChange(WorkerCategoryTypeCode.SecurityAlarmResponse, true);
		}

		if (formValue.Locksmith) {
			this.onCategoryChange(WorkerCategoryTypeCode.Locksmith, true);
		}
	}

	onCategoryChange(changedItem: string, preventDisable: boolean = false): void {
		const formValue = this.form.value;

		type CategoryKey = keyof typeof this.businessApplicationService.categoryFormGroup;

		const armouredCarGuard = formValue[WorkerCategoryTypeCode.ArmouredCarGuard as unknown as CategoryKey];
		const locksmith = formValue[WorkerCategoryTypeCode.Locksmith as unknown as CategoryKey];
		const privateInvestigator = formValue[WorkerCategoryTypeCode.PrivateInvestigator as unknown as CategoryKey];
		const securityAlarmInstaller = formValue[WorkerCategoryTypeCode.SecurityAlarmInstaller as unknown as CategoryKey];
		const securityAlarmResponse = formValue[WorkerCategoryTypeCode.SecurityAlarmResponse as unknown as CategoryKey];
		const securityGuard = formValue[WorkerCategoryTypeCode.SecurityGuard as unknown as CategoryKey];

		switch (changedItem) {
			case WorkerCategoryTypeCode.ArmouredCarGuard:
				this.categoryArmouredCarGuardFormGroup.patchValue({ isInclude: armouredCarGuard });
				break;
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
					this.showSecurityAlarmResponseMessage = false;
					this.setAndDisable(WorkerCategoryTypeCode.SecurityAlarmMonitor);
					this.setAndDisable(WorkerCategoryTypeCode.SecurityAlarmResponse);
				} else if (!preventDisable) {
					this.unsetAndEnable(WorkerCategoryTypeCode.SecurityAlarmMonitor);
					this.unsetAndEnable(WorkerCategoryTypeCode.SecurityAlarmResponse);
				}

				this.categorySecurityGuardFormGroup.patchValue({ isInclude: securityGuard });
				break;
			case WorkerCategoryTypeCode.SecurityAlarmInstaller:
				this.showSecurityAlarmInstallerMessage = securityAlarmInstaller;
				if (securityAlarmInstaller) {
					this.showSecurityAlarmResponseMessage = false;
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
			case WorkerCategoryTypeCode.PrivateInvestigator:
				this.categoryPrivateInvestigatorFormGroup.patchValue({ isInclude: privateInvestigator });
				break;
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

		console.debug('[StepBusinessLicenceCategoryComponent] isFormValid', valid1, valid2, valid3, valid4);

		return valid1 && valid2 && valid3 && valid4;
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

	// get isRenewalOrUpdate(): boolean {
	// 	return (
	// 		this.applicationTypeCode === ApplicationTypeCode.Renewal ||
	// 		this.applicationTypeCode === ApplicationTypeCode.Update
	// 	);
	// }

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
}
