import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { SecurityGuardRequirementCode } from '@app/core/code-types/model-desc.models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';

@Component({
	selector: 'app-licence-category-security-guard',
	template: `
		<div class="text-minor-heading mb-2">Proof of experience or training required</div>

		<form [formGroup]="form" novalidate>
			<div class="alert alert-category d-flex" role="alert">
				<div>
					<div class="text-minor-heading mb-2">Experience:</div>
					To qualify for a security guard security worker licence, you must meet one of the following training or
					experience requirements:
					<mat-radio-group
						class="category-radio-group"
						aria-label="Select an option"
						formControlName="requirementCode"
						(change)="onChangeDocumentType($event)"
					>
						<mat-radio-button
							[value]="securityGuardRequirementCodes.CategorySecurityGuard_BasicSecurityTrainingCertificate"
						>
							Basic Security Training Certificate issued by the Justice Institute of British Columbia (JIBC)
						</mat-radio-button>
						<mat-divider class="my-2"></mat-divider>
						<mat-radio-button [value]="securityGuardRequirementCodes.CategorySecurityGuard_PoliceExperienceOrTraining">
							Proof of training or experience providing general duties as a Canadian police officer, correctional
							officer, sheriff, auxiliary, reserve, or border service officer
						</mat-radio-button>
						<mat-divider class="my-2"></mat-divider>
						<mat-radio-button
							[value]="securityGuardRequirementCodes.CategorySecurityGuard_BasicSecurityTrainingCourseEquivalent"
						>
							Certificate equivalent to the Basic Security Training course offered by JIBC
						</mat-radio-button>
					</mat-radio-group>
					@if (
						(form.get('requirementCode')?.dirty || form.get('requirementCode')?.touched) &&
						form.get('requirementCode')?.invalid &&
						form.get('requirementCode')?.hasError('required')
					) {
						<mat-error class="mat-option-error">This is required</mat-error>
					}
				</div>
			</div>

			@if (requirementCode.value) {
				<div @showHideTriggerSlideAnimation>
					@if (
						requirementCode.value === securityGuardRequirementCodes.CategorySecurityGuard_PoliceExperienceOrTraining
					) {
						<div class="text-minor-heading mb-2">
							Upload a training certificate or reference letter from your employment supervisor or human resources
							office:
						</div>
					} @else {
						<div class="text-minor-heading mb-2">Upload a copy of your certificate</div>
					}
					<div class="my-2">
						<app-file-upload
							(fileUploaded)="onFileUploaded($event)"
							(fileRemoved)="onFileRemoved()"
							[control]="attachments"
							[maxNumberOfFiles]="10"
							[files]="attachments.value"
						></app-file-upload>
						@if (
							(form.get('attachments')?.dirty || form.get('attachments')?.touched) &&
							form.get('attachments')?.invalid &&
							form.get('attachments')?.hasError('required')
						) {
							<mat-error class="mat-option-error">This is required</mat-error>
						}
					</div>
				</div>
			}
		</form>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class LicenceCategorySecurityGuardComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.workerApplicationService.categorySecurityGuardFormGroup;

	securityGuardRequirementCodes = SecurityGuardRequirementCode;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private workerApplicationService: WorkerApplicationService) {}

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

	onChangeDocumentType(_event: MatRadioChange): void {
		this.workerApplicationService.hasValueChanged = true;
		this.attachments.setValue([]);
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
