import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode, LicenceDocumentTypeCode } from '@app/api/models';
import { ControllingMembersService } from '@app/core/services/controlling-members.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormPoliceBackgroundComponent } from '@app/shared/components/form-police-background.component';

@Component({
	selector: 'app-step-controlling-members-police-background',
	template: `
		<app-step-section
			[title]="title"
			subtitle="A member of a police force as defined in the <i>British Columbia Police Act</i> may not hold a security worker licence."
		>
			<app-form-police-background
				[form]="form"
				[isWizardStep]="true"
				(fileUploaded)="onFileUploaded($event)"
				(fileRemoved)="onFileRemoved()"
			></app-form-police-background>
		</app-step-section>
	`,
	styles: [],
})
export class StepControllingMembersPoliceBackgroundComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	form: FormGroup = this.controllingMembersService.policeBackgroundFormGroup;

	@ViewChild(FormPoliceBackgroundComponent)
	formPoliceBackgroundComponent!: FormPoliceBackgroundComponent;

	constructor(private controllingMembersService: ControllingMembersService) {}

	ngOnInit(): void {
		this.title = this.controllingMembersService.getPoliceBackgroundTitle(this.applicationTypeCode);
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onFileUploaded(file: File): void {
		this.controllingMembersService.fileUploaded(
			LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict,
			file,
			this.formPoliceBackgroundComponent.attachments,
			this.formPoliceBackgroundComponent.fileUploadComponent
		);
	}

	onFileRemoved(): void {
		this.controllingMembersService.fileRemoved();
	}
}
