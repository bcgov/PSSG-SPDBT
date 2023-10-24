import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { WorkerCategoryTypeCode } from 'src/app/api/models';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';
import { OptionsPipe } from 'src/app/shared/pipes/options.pipe';
import { LicenceApplicationService, LicenceFormStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-licence-category-fire-investigator',
	template: `
		<div class="text-minor-heading mb-2">Proof of experience or training required</div>

		<form [formGroup]="form" novalidate>
			<div class="alert alert-category d-flex" role="alert">
				<div>
					<div class="fs-6 fw-bold mb-2">Experience:</div>
					To qualify for a Fire Investigator security worker licence, you must meet both of the following experience
					requirements:
					<ul>
						<li>
							JIBC Course in Fire Investigation from <i>Fire Cause & Origins</i> (or similar course offered by another
							organization)
						</li>
						<li>Verification Letter that you were investigating fires</li>
					</ul>
				</div>
			</div>

			<div class="my-2">
				<div class="fs-6 fw-bold mb-2">Upload a copy of your course certificate:</div>
				<app-file-upload
					[maxNumberOfFiles]="10"
					#fireCourseCertificateAttachmentsRef
					[files]="fireCourseCertificateAttachments.value"
					(filesChanged)="onCertificationFilesChanged()"
				></app-file-upload>
				<mat-error
					class="mat-option-error"
					*ngIf="
						(form.get('fireCourseCertificateAttachments')?.dirty ||
							form.get('fireCourseCertificateAttachments')?.touched) &&
						form.get('fireCourseCertificateAttachments')?.invalid &&
						form.get('fireCourseCertificateAttachments')?.hasError('required')
					"
					>This is required</mat-error
				>
			</div>

			<div class="mt-3 mb-2">
				<div class="fs-6 fw-bold mb-2">Upload a verification letter:</div>
				<app-file-upload
					[maxNumberOfFiles]="10"
					#fireVerificationLetterAttachmentsRef
					[files]="fireVerificationLetterAttachments.value"
					(filesChanged)="onLetterFilesChanged()"
				></app-file-upload>
				<mat-error
					class="mat-option-error"
					*ngIf="
						(form.get('fireVerificationLetterAttachments')?.dirty ||
							form.get('fireVerificationLetterAttachments')?.touched) &&
						form.get('fireVerificationLetterAttachments')?.invalid &&
						form.get('fireVerificationLetterAttachments')?.hasError('required')
					"
					>This is required</mat-error
				>
			</div>
		</form>
	`,
	styles: [],
})
export class LicenceCategoryFireInvestigatorComponent implements OnInit, LicenceFormStepComponent {
	form: FormGroup = this.licenceApplicationService.categoryFireInvestigatorFormGroup;
	title = '';

	@ViewChild('fireCourseCertificateAttachmentsRef') fileUploadComponent3!: FileUploadComponent;
	@ViewChild('fireVerificationLetterAttachmentsRef') fileUploadComponent4!: FileUploadComponent;

	constructor(private optionsPipe: OptionsPipe, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.title = this.optionsPipe.transform(WorkerCategoryTypeCode.FireInvestigator, 'WorkerCategoryTypes');
	}

	isFormValid(): boolean {
		this.onCertificationFilesChanged();
		this.onLetterFilesChanged();

		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onCertificationFilesChanged(): void {
		const attachments =
			this.fileUploadComponent3?.files && this.fileUploadComponent3?.files.length > 0
				? this.fileUploadComponent3.files
				: [];
		this.form.controls['fireCourseCertificateAttachments'].setValue(attachments);
	}

	onLetterFilesChanged(): void {
		const attachments =
			this.fileUploadComponent4?.files && this.fileUploadComponent4?.files.length > 0
				? this.fileUploadComponent4.files
				: [];
		this.form.controls['fireVerificationLetterAttachments'].setValue(attachments);
	}

	public get fireCourseCertificateAttachments(): FormControl {
		return this.form.get('fireCourseCertificateAttachments') as FormControl;
	}

	public get fireVerificationLetterAttachments(): FormControl {
		return this.form.get('fireVerificationLetterAttachments') as FormControl;
	}
}
