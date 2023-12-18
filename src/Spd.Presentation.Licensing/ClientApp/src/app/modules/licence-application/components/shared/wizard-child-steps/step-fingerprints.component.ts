import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { ApplicationTypeCode, LicenceDocumentTypeCode } from 'src/app/api/models';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';
import { LicenceChildStepperStepComponent } from '../../../services/licence-application.helper';
import { LicenceApplicationService } from '../../../services/licence-application.service';
import { FingerprintTearOffModalComponent } from '../step-components/fingerprint-tear-off-modal.component';

@Component({
	selector: 'app-step-fingerprints',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Upload proof of fingerprinting request"
					subtitle="Provide confirmation of fingerprinting request from a law enforcement agency."
				></app-step-title>
				<div class="step-container">
					<div class="row">
						<div class="offset-md-2 col-md-8 col-sm-12">
							<app-alert type="info" icon="">
								<div class="d-flex">
									<div>
										Scan or take a photo of the tear-off section on page 2 of the
										<a
											href="https://www2.gov.bc.ca/assets/gov/employment-business-and-economic-development/business-management/security-services/industry/legislation/licensingpolicy.pdf"
											target="_blank"
											>Request for Fingerprinting</a
										>
										form.
									</div>
									<div class="ms-auto">
										<button
											mat-icon-button
											color="primary"
											(click)="onShowSampleTearOffModal()"
											aria-label="View sample fingerprint tear-off section"
										>
											<mat-icon>info</mat-icon>
										</button>
									</div>
								</div>
							</app-alert>
						</div>
					</div>
					<div class="row mt-2">
						<div class="offset-md-2 col-md-8 col-sm-12">
							<form [formGroup]="form" novalidate>
								<div class="text-minor-heading fw-normal mb-2">Upload your document:</div>
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
									>Your fingerprints must be taken to continue to verify your identity.<br /><br />
									Download the
									<a
										href="https://www2.gov.bc.ca/assets/gov/employment-business-and-economic-development/business-management/security-services/industry/legislation/licensingpolicy.pdf"
										target="_blank"
										>Request for Fingerprinting</a
									>
									form, take it to a fingerprinting agency (such as your local police department), and complete this
									application when you have documentation.
								</mat-error>
							</form>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class StepFingerprintsComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.licenceApplicationService.fingerprintProofFormGroup;
	applicationTypeCodes = ApplicationTypeCode;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(
		private dialog: MatDialog,
		private authenticationService: AuthenticationService,
		private licenceApplicationService: LicenceApplicationService,
		private hotToastService: HotToastService
	) {}

	onFileUploaded(file: File): void {
		if (this.authenticationService.isLoggedIn()) {
			this.licenceApplicationService.addUploadDocument(LicenceDocumentTypeCode.ProofOfFingerprint, file).subscribe({
				next: (resp: any) => {
					const matchingFile = this.attachments.value.find((item: File) => item.name == file.name);
					matchingFile.documentUrlId = resp.body[0].documentUrlId;
				},
				error: (error: any) => {
					console.log('An error occurred during file upload', error);
					this.hotToastService.error('An error occurred during the file upload. Please try again.');
					this.fileUploadComponent.removeFailedFile(file);
				},
			});
		}
	}

	onFileRemoved(): void {
		this.licenceApplicationService.hasValueChanged = true;
	}

	onShowSampleTearOffModal(): void {
		this.dialog.open(FingerprintTearOffModalComponent);
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
