import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { FormGdsdGovermentPhotoIdComponent } from '../shared/form-gdsd-goverment-photo-id.component';

@Component({
	selector: 'app-step-team-government-id',
	template: `
		<app-step-section
			heading="Government-issued photo ID"
			subheading="Upload a piece of your government-issued photo ID."
		>
			<app-form-gdsd-government-id
				[form]="form"
				(fileUploaded)="onFileUploaded($event)"
				(fileRemoved)="onFileRemoved()"
			></app-form-gdsd-government-id>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepTeamGovermentPhotoIdComponent {
	form: FormGroup = this.gdsdTeamApplicationService.governmentPhotoIdFormGroup;

	@ViewChild(FormGdsdGovermentPhotoIdComponent) govPhotoIdComponent!: FormGdsdGovermentPhotoIdComponent;

	constructor(private gdsdTeamApplicationService: GdsdTeamApplicationService) {}

	onFileUploaded(file: File): void {
		this.gdsdTeamApplicationService.fileUploaded(
			this.photoTypeCode.value,
			file,
			this.attachments,
			this.govPhotoIdComponent.fileUploadComponent
		);
	}

	onFileRemoved(): void {
		this.gdsdTeamApplicationService.fileRemoved();
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get photoTypeCode(): FormControl {
		return this.form.get('photoTypeCode') as FormControl;
	}
	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
