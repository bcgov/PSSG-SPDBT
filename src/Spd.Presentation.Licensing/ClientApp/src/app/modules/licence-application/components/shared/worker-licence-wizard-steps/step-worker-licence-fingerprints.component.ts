import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LicenceDocumentTypeCode } from '@app/api/models';
import { CommonFingerprintsComponent } from '@app/modules/licence-application/components/shared/step-components/common-fingerprints.component';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthenticationService } from '@app/core/services/authentication.service';

@Component({
	selector: 'app-step-worker-licence-fingerprints',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Upload proof of fingerprinting request"
					subtitle="Provide confirmation of fingerprinting request from a law enforcement agency."
				></app-step-title>

				<app-common-fingerprints
					[form]="form"
					(fileUploaded)="onFileUploaded($event)"
					(fileRemoved)="onFileRemoved()"
				></app-common-fingerprints>
			</div>
		</section>
	`,
	styles: [],
})
export class StepWorkerLicenceFingerprintsComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.licenceApplicationService.fingerprintProofFormGroup;

	@ViewChild(CommonFingerprintsComponent) commonFingerprintsComponent!: CommonFingerprintsComponent;

	constructor(
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
					this.commonFingerprintsComponent.fileUploadComponent.removeFailedFile(file);
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

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
