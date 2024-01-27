import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode, LicenceDocumentTypeCode } from '@app/api/models';
import { CommonFingerprintsComponent } from '@app/modules/licence-application/components/shared/step-components/common-fingerprints.component';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
	selector: 'app-step-permit-fingerprints',
	template: `
		<section class="step-section">
			<div class="step">
				<ng-container
					*ngIf="
						applicationTypeCode === applicationTypeCodes.Renewal || applicationTypeCode === applicationTypeCodes.Update
					"
				>
					<app-common-update-renewal-alert [applicationTypeCode]="applicationTypeCode"></app-common-update-renewal-alert>
				</ng-container>

				<app-step-title
					title="Upload proof of fingerprinting request"
					subtitle="Provide confirmation of fingerprinting request from a law enforcement agency."
				></app-step-title>

				<app-common-fingerprints
					[form]="form"
					(fileUploaded)="onFileUploaded($event)"
					(fileRemoved)="onFileRemoved()"
				></app-common-fingerprints>
				<!-- <div class="row">
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
							<div class="text-minor-heading mb-2">Upload your document:</div>
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
				</div> -->
			</div>
		</section>
	`,
	styles: [],
})
export class StepPermitFingerprintsComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.permitApplicationService.fingerprintProofFormGroup;

	applicationTypeCodes = ApplicationTypeCode;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(CommonFingerprintsComponent) commonFingerprintsComponent!: CommonFingerprintsComponent;

	constructor(
		private authenticationService: AuthenticationService,
		private permitApplicationService: PermitApplicationService,
		private hotToastService: HotToastService
	) {}

	onFileUploaded(file: File): void {
		if (this.authenticationService.isLoggedIn()) {
			this.permitApplicationService.addUploadDocument(LicenceDocumentTypeCode.ProofOfFingerprint, file).subscribe({
				next: (resp: any) => {
					const matchingFile = this.attachments.value.find((item: File) => item.name == file.name);
					matchingFile.documentUrlId = resp.body[0].documentUrlId;
				},
				error: (error: any) => {
					console.log('An error occurred during file upload', error);
					this.hotToastService.error('An error occurred during the file upload. Please try again.');
					this.commonFingerprintsComponent.fileUploadComponent.removeFailedFile(file);
				},
			});
		}
	}

	onFileRemoved(): void {
		this.permitApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
