import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { LocksmithRequirementCode } from '@app/core/code-types/model-desc.models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';

@Component({
	selector: 'app-licence-category-locksmith',
	template: `
		<div class="text-minor-heading mb-2">Proof of experience or training required</div>

		<form [formGroup]="form" novalidate>
			<div class="alert alert-category d-flex" role="alert">
				<div>
					To qualify for a locksmith security worker licence, you must meet one of the following experience and training
					requirements. The registrar will review the content and training hours of any apprenticeship program or
					locksmithing course to determine if it is approved.

					<mat-radio-group
						class="category-radio-group"
						aria-label="Select an option"
						formControlName="requirementCode"
						(change)="onChangeDocumentType($event)"
					>
						<mat-radio-button [value]="locksmithRequirementCodes.CategoryLocksmith_ApprovedLocksmithCourse">
							A Locksmith Certificate of Qualification
							<mat-icon
								class="info-icon"
								matTooltip="Issued under the 'Industry Training Authority Act' or the 'Industry Training and Apprenticeship Act'"
							>
								info
							</mat-icon>
						</mat-radio-button>
						<mat-divider class="my-2"></mat-divider>
						<mat-radio-button [value]="locksmithRequirementCodes.CategoryLocksmith_ExperienceAndApprenticeship">
							Two years experience of full-time employment as a locksmith under the supervision of a locksmith security
							worker licensee, and proof of successful completion of an approved apprenticeship program
							<mat-icon
								class="info-icon"
								matTooltip="You must provide a letter of recommendation and certification from your employer stating that you are qualified to work as a locksmith without supervision. Your work experience must be from the past five years."
							>
								info
							</mat-icon>
						</mat-radio-button>
						<mat-divider class="my-2"></mat-divider>
						<mat-radio-button [value]="locksmithRequirementCodes.CategoryLocksmith_CertificateOfQualification">
							Proof of successful completion of an approved locksmithing course, proof of experience in full-time
							employment as a locksmith under the supervision of a locksmith security worker licensee, and a letter of
							recommendation and certification from your employer indicating that you are qualified to perform the
							services of a locksmith unsupervised.
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
					<div class="text-minor-heading mb-2">
						@if (requirementCode.value === locksmithRequirementCodes.CategoryLocksmith_CertificateOfQualification) {
							<span> Upload a copy of your certificate </span>
						}
						@if (requirementCode.value === locksmithRequirementCodes.CategoryLocksmith_ExperienceAndApprenticeship) {
							<span>
								Upload a letter of recommendation
								<div class="fs-6 my-2">
									This letter must be on company letterhead and include proof of successful completion of an approved
									apprenticeship program, other than the one provided by the <i>Industry Training Authority</i>.
								</div>
							</span>
						}
						@if (requirementCode.value === locksmithRequirementCodes.CategoryLocksmith_ApprovedLocksmithCourse) {
							<span>
								Upload a letter of recommendation
								<div class="fs-6 my-2">
									This letter must be on company letterhead, proof of experience, and proof of successful completion of
									an approved course.
								</div>
							</span>
						}
					</div>
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
	standalone: false,
})
export class LicenceCategoryLocksmithComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.workerApplicationService.categoryLocksmithFormGroup;

	locksmithRequirementCodes = LocksmithRequirementCode;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(
		private optionsPipe: OptionsPipe,
		private workerApplicationService: WorkerApplicationService
	) {}

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
