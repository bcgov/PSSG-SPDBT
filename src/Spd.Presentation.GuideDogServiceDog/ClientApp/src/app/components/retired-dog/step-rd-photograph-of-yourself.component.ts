import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LicenceDocumentTypeCode, ServiceTypeCode } from '@app/api/models';
import { RetiredDogApplicationService } from '@app/core/services/retired-dog-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormPhotographOfYourselfComponent } from '@app/shared/components/form-photograph-of-yourself.component';

@Component({
	selector: 'app-step-rd-photograph-of-yourself',
	template: `
		<app-step-section
			title="Passport-quality photo of yourself"
			subtitle="This must be a photo of the handler and will appear on your certificate."
		>
			<app-form-photograph-of-yourself
				[serviceTypeCode]="serviceTypeRetiredDog"
				[form]="form"
				(fileUploaded)="onFileUploaded($event)"
				(fileRemoved)="onFileRemoved()"
			></app-form-photograph-of-yourself>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepRdPhotographOfYourselfComponent implements LicenceChildStepperStepComponent {
	readonly serviceTypeRetiredDog = ServiceTypeCode.RetiredServiceDogCertification;
	form: FormGroup = this.retiredDogApplicationService.photographOfYourselfFormGroup;

	@ViewChild(FormPhotographOfYourselfComponent) formPhotographOfYourselfComponent!: FormPhotographOfYourselfComponent;

	constructor(private retiredDogApplicationService: RetiredDogApplicationService) {}

	onFileUploaded(file: File): void {
		this.retiredDogApplicationService.fileUploaded(
			LicenceDocumentTypeCode.PhotoOfYourself,
			file,
			this.attachments,
			this.formPhotographOfYourselfComponent.fileUploadComponent
		);
	}

	onFileRemoved(): void {
		this.retiredDogApplicationService.fileRemoved();
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
