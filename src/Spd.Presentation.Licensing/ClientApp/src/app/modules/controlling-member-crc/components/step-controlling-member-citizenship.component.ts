import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { ControllingMemberCrcService } from '@app/core/services/controlling-member-crc.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormSwlCitizenshipComponent } from '@app/shared/components/form-swl-citizenship.component';

@Component({
	selector: 'app-step-controlling-member-citizenship',
	template: `
		<app-step-section [title]="title">
			<app-form-swl-citizenship
				[applicationTypeCode]="applicationTypeCodeNew"
				[form]="form"
				[showFullCitizenshipQuestion]="true"
				(fileUploaded)="onFileUploaded($event)"
				(fileRemoved)="onFileRemoved()"
				(filesCleared)="onFilesCleared()"
				(fileGovernmentIssuedUploaded)="onFileGovernmentIssuedUploaded($event)"
				(fileGovernmentIssuedRemoved)="onFileGovernmentIssuedRemoved()"
				(fileGovernmentIssuedCleared)="onFilesGovernmentIssuedCleared()"
			></app-form-swl-citizenship>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepControllingMemberCitizenshipComponent implements LicenceChildStepperStepComponent {
	applicationTypeCodeNew = ApplicationTypeCode.New;
	title = 'Are you a Canadian citizen?';
	form: FormGroup = this.controllingMembersService.citizenshipFormGroup;

	@ViewChild(FormSwlCitizenshipComponent) formSwlCitizenshipComponent!: FormSwlCitizenshipComponent;

	constructor(private controllingMembersService: ControllingMemberCrcService) {}

	onFileUploaded(file: File): void {
		this.controllingMembersService.fileUploaded(
			this.formSwlCitizenshipComponent.getProofTypeCode(),
			file,
			this.formSwlCitizenshipComponent.attachments,
			this.formSwlCitizenshipComponent.fileUploadComponent
		);
	}

	onFileRemoved(): void {
		this.controllingMembersService.fileRemoved();
	}

	onFilesCleared(): void {
		this.attachments.setValue([]);
	}

	onFileGovernmentIssuedUploaded(file: File): void {
		this.controllingMembersService.fileUploaded(
			this.formSwlCitizenshipComponent.getGovernmentIssuedProofTypeCode(),
			file,
			this.formSwlCitizenshipComponent.governmentIssuedAttachments,
			this.formSwlCitizenshipComponent.governmentIssuedFileUploadComponent
		);
	}

	onFileGovernmentIssuedRemoved(): void {
		this.controllingMembersService.fileRemoved();
	}

	onFilesGovernmentIssuedCleared(): void {
		this.governmentIssuedAttachments.setValue([]);
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
	get governmentIssuedAttachments(): FormControl {
		return this.form.get('governmentIssuedAttachments') as FormControl;
	}
}
