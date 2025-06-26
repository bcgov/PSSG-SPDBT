import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LicenceDocumentTypeCode } from '@app/api/models';
import { ControllingMemberCrcService } from '@app/core/services/controlling-member-crc.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormFingerprintsComponent } from '@app/shared/components/form-fingerprints.component';

@Component({
	selector: 'app-step-controlling-member-fingerprints',
	template: `
		<app-step-section
			heading="Upload proof of fingerprinting"
			subheading="Provide confirmation that you have completed fingerprinting at your local police detachment or accredited fingerprinting agency."
		>
			<app-form-fingerprints
				[form]="form"
				(fileUploaded)="onFileUploaded($event)"
				(fileRemoved)="onFileRemoved()"
			></app-form-fingerprints>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepControllingMemberFingerprintsComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.controllingMembersService.fingerprintProofFormGroup;

	@ViewChild(FormFingerprintsComponent) formFingerprintsComponent!: FormFingerprintsComponent;

	constructor(private controllingMembersService: ControllingMemberCrcService) {}

	onFileUploaded(file: File): void {
		this.controllingMembersService.fileUploaded(
			LicenceDocumentTypeCode.ProofOfFingerprint,
			file,
			this.formFingerprintsComponent.attachments,
			this.formFingerprintsComponent.fileUploadComponent
		);
	}

	onFileRemoved(): void {
		this.controllingMembersService.fileRemoved();
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
