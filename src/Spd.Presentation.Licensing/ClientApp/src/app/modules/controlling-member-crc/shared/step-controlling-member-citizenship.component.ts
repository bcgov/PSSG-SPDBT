import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { ControllingMemberCrcService } from '@app/core/services/controlling-member-crc.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormSwlCitizenshipComponent } from '@app/shared/components/form-swl-citizenship.component';

@Component({
	selector: 'app-step-controlling-member-citizenship',
	template: `
		<app-step-section [title]="title">
			<app-form-swl-citizenship
				[applicationTypeCode]="applicationTypeCode"
				[form]="form"
				(fileUploaded)="onFileUploaded($event)"
				(fileRemoved)="onFileRemoved()"
				(fileGovernmentIssuedUploaded)="onFileGovernmentIssuedUploaded($event)"
				(fileGovernmentIssuedRemoved)="onFileGovernmentIssuedRemoved()"
			></app-form-swl-citizenship>
		</app-step-section>
	`,
	styles: [],
})
export class StepControllingMemberCitizenshipComponent implements OnInit, LicenceChildStepperStepComponent {
	title = 'Are you a Canadian citizen?';
	form: FormGroup = this.controllingMembersService.citizenshipFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(FormSwlCitizenshipComponent) formSwlCitizenshipComponent!: FormSwlCitizenshipComponent;

	constructor(private controllingMembersService: ControllingMemberCrcService) {}

	ngOnInit(): void {
		if (this.applicationTypeCode === ApplicationTypeCode.Renewal) {
			this.title = 'Provide proof of ability to work in Canada';
		}
	}

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

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
