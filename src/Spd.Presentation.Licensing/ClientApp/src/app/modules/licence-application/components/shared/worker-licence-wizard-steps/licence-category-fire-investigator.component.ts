import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LicenceDocumentTypeCode, WorkerCategoryTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';
import { OptionsPipe } from 'src/app/shared/pipes/options.pipe';
@Component({
	selector: 'app-licence-category-fire-investigator',
	template: `
		<div class="text-minor-heading mb-2">Proof of experience or training required</div>

		<form [formGroup]="form" novalidate>
			<div class="alert alert-category d-flex" role="alert">
				<div>
					<div class="fs-5 mb-2">Experience:</div>
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
				<div class="fs-5 mb-2">Upload a copy of your course certificate</div>
				<app-file-upload
					(fileUploaded)="onFileCertificateAdded($event)"
					(fileRemoved)="onFileRemoved()"
					[control]="fireCourseCertificateAttachments"
					[maxNumberOfFiles]="10"
					#fireCourseCertificateAttachmentsRef
					[files]="fireCourseCertificateAttachments.value"
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
				<div class="fs-5 mb-2">Upload a verification letter</div>
				<app-file-upload
					(fileUploaded)="onFileVerificationAdded($event)"
					(fileRemoved)="onFileRemoved()"
					[control]="fireVerificationLetterAttachments"
					[maxNumberOfFiles]="10"
					#fireVerificationLetterAttachmentsRef
					[files]="fireVerificationLetterAttachments.value"
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
export class LicenceCategoryFireInvestigatorComponent implements OnInit, LicenceChildStepperStepComponent {
	form: FormGroup = this.licenceApplicationService.categoryFireInvestigatorFormGroup;
	title = '';

	@ViewChild('fireCourseCertificateAttachmentsRef') fileUploadCertificateComponent!: FileUploadComponent;
	@ViewChild('fireVerificationLetterAttachmentsRef') fileUploadVerificationComponent!: FileUploadComponent;

	constructor(
		private optionsPipe: OptionsPipe,
		private authenticationService: AuthenticationService,
		private licenceApplicationService: LicenceApplicationService
	) {}

	ngOnInit(): void {
		this.title = this.optionsPipe.transform(WorkerCategoryTypeCode.FireInvestigator, 'WorkerCategoryTypes');
	}

	onFileCertificateAdded(file: File): void {
		if (this.authenticationService.isLoggedIn()) {
			this.licenceApplicationService
				.addUploadDocument(LicenceDocumentTypeCode.CategoryFireInvestigatorCourseCertificate, file)
				.subscribe({
					next: (resp: any) => {
						const matchingFile = this.fireCourseCertificateAttachments.value.find(
							(item: File) => item.name == file.name
						);
						matchingFile.documentUrlId = resp.body[0].documentUrlId;
					},
					error: (error: any) => {
						console.log('An error occurred during file upload', error);

						this.fileUploadCertificateComponent.removeFailedFile(file);
					},
				});
		}
	}

	onFileVerificationAdded(file: File): void {
		if (this.authenticationService.isLoggedIn()) {
			this.licenceApplicationService
				.addUploadDocument(LicenceDocumentTypeCode.CategoryFireInvestigatorVerificationLetter, file)
				.subscribe({
					next: (resp: any) => {
						const matchingFile = this.fireVerificationLetterAttachments.value.find(
							(item: File) => item.name == file.name
						);
						matchingFile.documentUrlId = resp.body[0].documentUrlId;
					},
					error: (error: any) => {
						console.log('An error occurred during file upload', error);

						this.fileUploadVerificationComponent.removeFailedFile(file);
					},
				});
		}
	}

	onFileRemoved(): void {
		this.licenceApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	public get fireCourseCertificateAttachments(): FormControl {
		return this.form.get('fireCourseCertificateAttachments') as FormControl;
	}

	public get fireVerificationLetterAttachments(): FormControl {
		return this.form.get('fireVerificationLetterAttachments') as FormControl;
	}
}
