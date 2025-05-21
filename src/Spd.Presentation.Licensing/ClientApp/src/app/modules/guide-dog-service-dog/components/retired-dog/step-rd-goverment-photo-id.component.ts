import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RetiredDogApplicationService } from '@app/core/services/retired-dog-application.service';
import { FormGdsdGovermentPhotoIdComponent } from '@app/modules/guide-dog-service-dog/components/shared/form-gdsd-goverment-photo-id.component';

@Component({
	selector: 'app-step-rd-government-id',
	template: `
		<app-step-section title="Government-issued photo ID" subtitle="Upload a piece of your government-issued photo ID.">
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
export class StepRdGovermentPhotoIdComponent {
	form: FormGroup = this.retiredDogApplicationService.governmentPhotoIdFormGroup;

	@ViewChild(FormGdsdGovermentPhotoIdComponent) govPhotoIdComponent!: FormGdsdGovermentPhotoIdComponent;

	constructor(private retiredDogApplicationService: RetiredDogApplicationService) {}

	onFileUploaded(file: File): void {
		this.retiredDogApplicationService.fileUploaded(
			this.photoTypeCode.value,
			file,
			this.attachments,
			this.govPhotoIdComponent.fileUploadComponent
		);
	}

	onFileRemoved(): void {
		this.retiredDogApplicationService.fileRemoved();
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
