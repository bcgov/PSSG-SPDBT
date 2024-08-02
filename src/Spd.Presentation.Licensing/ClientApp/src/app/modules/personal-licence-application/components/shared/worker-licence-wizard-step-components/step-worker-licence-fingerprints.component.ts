import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LicenceDocumentTypeCode } from '@app/api/models';
import { LicenceApplicationService } from '@app/core/services/licence-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { CommonFingerprintsComponent } from '@app/modules/personal-licence-application/components/shared/common-step-components/common-fingerprints.component';

@Component({
	selector: 'app-step-worker-licence-fingerprints',
	template: `
		<app-step-section
			title="Upload proof of fingerprinting request"
			subtitle="Provide confirmation of fingerprinting request from a law enforcement agency."
		>
			<app-common-fingerprints
				[form]="form"
				(fileUploaded)="onFileUploaded($event)"
				(fileRemoved)="onFileRemoved()"
			></app-common-fingerprints>
		</app-step-section>
	`,
	styles: [],
})
export class StepWorkerLicenceFingerprintsComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.licenceApplicationService.fingerprintProofFormGroup;

	@ViewChild(CommonFingerprintsComponent) commonFingerprintsComponent!: CommonFingerprintsComponent;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	onFileUploaded(file: File): void {
		this.licenceApplicationService.hasValueChanged = true;

		if (!this.licenceApplicationService.isAutoSave()) {
			return;
		}

		this.licenceApplicationService.addUploadDocument(LicenceDocumentTypeCode.ProofOfFingerprint, file).subscribe({
			next: (resp: any) => {
				const matchingFile = this.attachments.value.find((item: File) => item.name == file.name);
				matchingFile.documentUrlId = resp.body[0].documentUrlId;
			},
			error: (error: any) => {
				console.log('An error occurred during file upload', error);

				this.commonFingerprintsComponent.fileUploadComponent.removeFailedFile(file);
			},
		});
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
