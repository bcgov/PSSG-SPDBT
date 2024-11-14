import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LicenceDocumentTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { FormFingerprintsComponent } from '@app/shared/components/form-fingerprints.component';

@Component({
	selector: 'app-step-worker-licence-fingerprints',
	template: `
		<app-step-section
			title="Upload proof of fingerprinting request"
			subtitle="Provide confirmation of fingerprinting request from a law enforcement agency."
		>
			<app-form-fingerprints
				[form]="form"
				(fileUploaded)="onFileUploaded($event)"
				(fileRemoved)="onFileRemoved()"
			></app-form-fingerprints>
		</app-step-section>
	`,
	styles: [],
})
export class StepWorkerLicenceFingerprintsComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.workerApplicationService.fingerprintProofFormGroup;

	@ViewChild(FormFingerprintsComponent) commonFingerprintsComponent!: FormFingerprintsComponent;

	constructor(private workerApplicationService: WorkerApplicationService) {}

	onFileUploaded(file: File): void {
		this.workerApplicationService.hasValueChanged = true;

		if (!this.workerApplicationService.isAutoSave()) {
			return;
		}

		this.workerApplicationService.addUploadDocument(LicenceDocumentTypeCode.ProofOfFingerprint, file).subscribe({
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
		this.workerApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
