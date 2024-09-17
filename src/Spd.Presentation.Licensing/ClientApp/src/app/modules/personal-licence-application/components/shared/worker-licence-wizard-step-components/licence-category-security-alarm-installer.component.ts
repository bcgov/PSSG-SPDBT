import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { WorkerCategoryTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { SecurityAlarmInstallerRequirementCode } from '@app/core/code-types/model-desc.models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';

@Component({
	selector: 'app-licence-category-security-alarm-installer',
	template: `
		<div class="text-minor-heading mb-2">Proof of experience or training required</div>

		<form [formGroup]="form" novalidate>
			<div class="alert alert-category d-flex" role="alert">
				<div>
					To qualify for a security alarm installer security worker licence, you must meet one of the following
					experience requirements:

					<mat-radio-group class="category-radio-group" aria-label="Select an option" formControlName="requirementCode">
						<mat-radio-button
							[value]="
								securityAlarmInstallerRequirementCodes.CategorySecurityAlarmInstaller_TradesQualificationCertificate
							"
						>
							Trades Qualification Certificate
						</mat-radio-button>
						<mat-divider class="my-2"></mat-divider>
						<mat-radio-button
							[value]="
								securityAlarmInstallerRequirementCodes.CategorySecurityAlarmInstaller_ExperienceOrTrainingEquivalent
							"
						>
							Experience or training equivalent to the Trades Qualification Certificate
						</mat-radio-button>
					</mat-radio-group>
					<mat-error
						class="mat-option-error"
						*ngIf="
							(form.get('requirementCode')?.dirty || form.get('requirementCode')?.touched) &&
							form.get('requirementCode')?.invalid &&
							form.get('requirementCode')?.hasError('required')
						"
						>This is required</mat-error
					>
				</div>
			</div>

			<div *ngIf="requirementCode.value" @showHideTriggerSlideAnimation>
				<div class="fs-5 mb-2">
					<span
						*ngIf="
							requirementCode.value ===
							securityAlarmInstallerRequirementCodes.CategorySecurityAlarmInstaller_TradesQualificationCertificate
						"
					>
						Upload a copy of your certificate
					</span>
					<span
						*ngIf="
							requirementCode.value ===
							securityAlarmInstallerRequirementCodes.CategorySecurityAlarmInstaller_ExperienceOrTrainingEquivalent
						"
					>
						Upload document(s) providing proof of equivalent training
					</span>
				</div>

				<div class="my-2">
					<app-file-upload
						(fileUploaded)="onFileUploaded($event)"
						(fileRemoved)="onFileRemoved()"
						[control]="attachments"
						[maxNumberOfFiles]="10"
						[files]="attachments.value"
					></app-file-upload>
					<mat-error
						class="mat-option-error"
						*ngIf="
							(form.get('attachments')?.dirty || form.get('attachments')?.touched) &&
							form.get('attachments')?.invalid &&
							form.get('attachments')?.hasError('required')
						"
						>This is required</mat-error
					>
				</div>
			</div>
		</form>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class LicenceCategorySecurityAlarmInstallerComponent implements OnInit, LicenceChildStepperStepComponent {
	form: FormGroup = this.workerApplicationService.categorySecurityAlarmInstallerFormGroup;
	title = '';

	securityAlarmInstallerRequirementCodes = SecurityAlarmInstallerRequirementCode;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private optionsPipe: OptionsPipe, private workerApplicationService: WorkerApplicationService) {}

	ngOnInit(): void {
		this.title = this.optionsPipe.transform(WorkerCategoryTypeCode.SecurityAlarmInstaller, 'WorkerCategoryTypes');
	}

	onFileUploaded(file: File): void {
		this.workerApplicationService.hasValueChanged = true;

		if (!this.workerApplicationService.isAutoSave()) {
			return;
		}

		this.workerApplicationService.addUploadDocument(this.requirementCode.value, file).subscribe({
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
		this.workerApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	public get requirementCode(): FormControl {
		return this.form.get('requirementCode') as FormControl;
	}

	public get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
