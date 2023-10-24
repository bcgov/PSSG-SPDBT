import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';
import { LicenceApplicationService, LicenceFormStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-fingerprints',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title
					title="Upload proof of fingerprinting request"
					subtitle="Provide confirmation of fingerprinting request from a law enforcement agency."
				></app-step-title>
				<div class="step-container row mt-2 mb-4">
					<div class="offset-md-2 col-md-8 col-sm-12">
						<form [formGroup]="form" novalidate>
							<p>
								Scan or take a photo of the tear-off section on page 2 of the
								<a
									href="https://www2.gov.bc.ca/assets/gov/employment-business-and-economic-development/business-management/security-services/industry/legislation/licensingpolicy.pdf"
									target="_blank"
									>Request for Fingerprinting</a
								>
								form
								<mat-icon class="info-icon" matTooltip="TODO"> info </mat-icon>
							</p>
							<!-- TODO link to the form to download for reference -->
							<div class="text-minor-heading fw-normal mb-2">Upload your document:</div>
							<app-file-upload
								[maxNumberOfFiles]="1"
								[files]="attachments.value"
								(filesChanged)="onFilesChanged()"
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
		</section>
	`,
	styles: [],
})
export class FingerprintsComponent implements LicenceFormStepComponent {
	form: FormGroup = this.licenceApplicationService.proofOfFingerprintFormGroup;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	isFormValid(): boolean {
		this.onFilesChanged();

		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onFilesChanged(): void {
		const attachments =
			this.fileUploadComponent?.files && this.fileUploadComponent?.files.length > 0
				? this.fileUploadComponent.files
				: [];
		this.form.controls['attachments'].setValue(attachments);
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
