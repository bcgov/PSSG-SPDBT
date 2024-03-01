import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApplicationTypeCode, WorkerCategoryTypeCode } from '@app/api/models';
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
						<div class="fs-5 mb-2">Select Licence Category</div>
						<form [formGroup]="form" novalidate>
							<div class="row mb-4">
								<ng-container *ngFor="let item of businessCategoryTypes">
									<div class="col-xxl-4 col-xl-4 col-lg-6 col-md-12 col-sm-12">
										<mat-checkbox [formControlName]="item.code" (click)="onCategoryChange(item.code)">
											{{ item.desc }}
										</mat-checkbox>
									</div>
								</ng-container>
							</div>

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
													<mat-panel-title class="title">
														{{ workerCategoryTypeCodes.ArmouredCarGuard | options : 'WorkerCategoryTypes' }}
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
													<mat-panel-title class="title">
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
													<mat-panel-title class="title">
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
export class StepBusinessLicenceCategoryComponent implements LicenceChildStepperStepComponent {
	isDirtyAndInvalid = false;

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

	title = 'What category of security business licence are you applying for?';
	// infoTitle = '';

	// readonly title_new = 'What category of security business licence are you applying for?';
	// readonly subtitle_new = 'You can add up to a total of 6 categories';

	// readonly title_renew = 'Which categories of Security Worker Licence would you like to renew?';
	// readonly subtitle_renew = 'You can change and remove existing categories as well as add new ones';

	// readonly title_update = 'Which categories of Security Worker Licence would you like to update?';
	// readonly subtitle_update = 'You can change and remove existing categories as well as add new ones';

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private businessApplicationService: BusinessApplicationService) {}

	// ngOnInit(): void {
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
	// }

	// this.validCategoryList = this.businessApplicationService.getValidCategoryList(this.categoryList);

	// this.setupInitialExpansionPanel();
	// }

	onCategoryChange(changedItem: string): void {
		const formValue = this.form.value;
		console.debug('onCategoryChange', formValue);

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
				} else {
					this.unsetAndEnable(WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller);
				}
				break;
			case WorkerCategoryTypeCode.SecurityGuard:
				this.showSecurityGuardMessage = securityGuard;
				if (securityGuard) {
					this.showSecurityAlarmResponseMessage = false;
					this.setAndDisable(WorkerCategoryTypeCode.SecurityAlarmMonitor);
					this.setAndDisable(WorkerCategoryTypeCode.SecurityAlarmResponse);
				} else {
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
				} else {
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
				} else {
					this.unsetAndEnable(WorkerCategoryTypeCode.SecurityAlarmMonitor);
				}
				break;
			case WorkerCategoryTypeCode.PrivateInvestigator:
				this.categoryPrivateInvestigatorFormGroup.patchValue({ isInclude: privateInvestigator });
				break;
		}

		// 	this.isDirtyAndInvalid = false;
	}

	// onRemove(code: string) {
	// 	const codeDesc = this.optionsPipe.transform(code, 'WorkerCategoryTypes');
	// 	const data: DialogOptions = {
	// 		icon: 'warning',
	// 		title: 'Confirmation',
	// 		message: `Are you sure you want to remove the ${codeDesc} category?`,
	// 		actionText: 'Yes',
	// 		cancelText: 'Cancel',
	// 	};

	// 	this.dialog
	// 		.open(DialogComponent, { data })
	// 		.afterClosed()
	// 		.subscribe((response: boolean) => {
	// 			if (response) {
	// 				switch (code) {
	// 					case WorkerCategoryTypeCode.ArmouredCarGuard:
	// 						this.categoryArmouredCarGuardFormGroup.reset();
	// 						this.categoryArmouredCarGuardFormGroup.patchValue({ isInclude: false });
	// 						this.blockArmouredCarGuard = false;
	// 						break;
	// 					case WorkerCategoryTypeCode.PrivateInvestigator:
	// 						this.categoryPrivateInvestigatorFormGroup.reset();
	// 						this.categoryPrivateInvestigatorFormGroup.patchValue({ isInclude: false });
	// 						this.blockPrivateInvestigator = false;
	// 						break;
	// 					case WorkerCategoryTypeCode.SecurityGuard:
	// 						this.categorySecurityGuardFormGroup.reset();
	// 						this.categorySecurityGuardFormGroup.patchValue({ isInclude: false });
	// 						this.blockSecurityGuard = false;
	// 						break;
	// 				}

	// 				this.validCategoryList = this.businessApplicationService.getValidCategoryList(this.categoryList);
	// 				this.isDirtyAndInvalid = false;
	// 			}
	// 		});
	// }

	// onPromptFireInvestigator() {
	// 	if (this.showFireInvestigator) {
	// 		return; // this has already been added
	// 	}

	// 	const data: DialogOptions = {
	// 		icon: 'warning',
	// 		title: 'Confirmation',
	// 		message: 'Would you also like to add Fire Investigator to this licence?',
	// 		actionText: 'Yes',
	// 		cancelText: 'No',
	// 	};

	// 	this.dialog
	// 		.open(DialogComponent, { data })
	// 		.afterClosed()
	// 		.subscribe((response: boolean) => {
	// 			if (response) {
	// 				this.categoryFireInvestigatorFormGroup.patchValue({ isInclude: true });

	// 				this.validCategoryList = this.businessApplicationService.getValidCategoryList(this.categoryList);
	// 			}
	// 		});
	// }

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		// return this.form.valid;
		return true;
		// this.categoryArmouredCarGuardFormGroup.markAllAsTouched();
		// this.categoryPrivateInvestigatorFormGroup.markAllAsTouched();
		// this.categorySecurityGuardFormGroup.markAllAsTouched();

		// const isValid =
		// 	this.categoryArmouredCarGuardFormGroup.valid &&
		// 	this.categoryPrivateInvestigatorFormGroup.valid &&
		// 	this.categorySecurityGuardFormGroup.valid;

		// // console.log(
		// // 	this.categoryArmouredCarGuardFormGroup.valid,
		// // 	this.categoryPrivateInvestigatorFormGroup.valid,
		// // 	this.categorySecurityGuardFormGroup.valid,
		// // );

		// this.isDirtyAndInvalid = this.categoryList.length == 0;
		// return isValid && !this.isDirtyAndInvalid;
	}

	// private setupInitialExpansionPanel(): void {
	// if (
	// 	this.applicationTypeCode === ApplicationTypeCode.Update ||
	// 	this.applicationTypeCode === ApplicationTypeCode.Renewal
	// ) {
	// 	if (this.showArmouredCarGuard) {
	// 		this.blockArmouredCarGuard = true;
	// 	}
	// 	if (this.showPrivateInvestigator) {
	// 		this.blockPrivateInvestigator = true;
	// 	}
	// 	if (this.showSecurityGuard) {
	// 		this.blockSecurityGuard = true;
	// 	}
	// }
	// }

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

	// get showArmouredCarGuard(): boolean {
	// 	return this.categoryArmouredCarGuardFormGroup.get('isInclude')?.value;
	// }
	// get showPrivateInvestigator(): boolean {
	// 	return this.categoryPrivateInvestigatorFormGroup.get('isInclude')?.value;
	// }
	// get showSecurityGuard(): boolean {
	// 	return this.categorySecurityGuardFormGroup.get('isInclude')?.value;
	// }

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
