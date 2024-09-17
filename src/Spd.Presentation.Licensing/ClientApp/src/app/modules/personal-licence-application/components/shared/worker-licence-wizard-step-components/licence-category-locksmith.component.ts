import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { WorkerCategoryTypeCode } from '@app/api/models';
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
					requirements. Whether a particular apprenticeship program or locksmithing course is approved by the registrar
					will be based on a review of program or course content, and training time for each component of the
					apprenticeship or course:

					<mat-radio-group class="category-radio-group" aria-label="Select an option" formControlName="requirementCode">
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
								matTooltip="You must provide a letter of recommendation and certification from your employer indicating that you are qualified to perform the services of a locksmith unsupervised. Your work experience must be from within the past five years."
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
						*ngIf="requirementCode.value === locksmithRequirementCodes.CategoryLocksmith_CertificateOfQualification"
					>
						Upload a copy of your certificate
					</span>
					<span
						*ngIf="requirementCode.value === locksmithRequirementCodes.CategoryLocksmith_ExperienceAndApprenticeship"
					>
						Upload a letter of recommendation
						<div class="fs-6 my-2">
							This letter must be on company letterhead, and proof of successful completion of an approved
							apprenticeship program, other than that provided by the <i>Industry Training Authority</i>.
						</div>
					</span>
					<span *ngIf="requirementCode.value === locksmithRequirementCodes.CategoryLocksmith_ApprovedLocksmithCourse">
						Upload a letter of recommendation
						<div class="fs-6 my-2">
							This letter must be on company letterhead, proof of experience, and proof of successful completion of an
							approved course.
						</div>
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
export class LicenceCategoryLocksmithComponent implements OnInit, LicenceChildStepperStepComponent {
	form: FormGroup = this.workerApplicationService.categoryLocksmithFormGroup;
	title = '';

	locksmithRequirementCodes = LocksmithRequirementCode;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private optionsPipe: OptionsPipe, private workerApplicationService: WorkerApplicationService) {}

	ngOnInit(): void {
		this.title = this.optionsPipe.transform(WorkerCategoryTypeCode.Locksmith, 'WorkerCategoryTypes');
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
