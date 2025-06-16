import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ServiceTypeCode } from '@app/api/models';
import { RetiredDogApplicationService } from '@app/core/services/retired-dog-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-rd-photograph-of-yourself-renew',
	template: `
		<app-step-section [heading]="title">
			<app-form-photograph-of-yourself-update
				[form]="form"
				[serviceTypeCode]="serviceTypeRetiredDog"
				[originalPhotoOfYourselfExpired]="originalPhotoOfYourselfExpired"
				[photographOfYourself]="photographOfYourself"
				(fileUploaded)="onFileUploaded()"
				(fileRemoved)="onFileRemoved()"
			></app-form-photograph-of-yourself-update>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepRdPhotographOfYourselfRenewComponent implements OnInit, LicenceChildStepperStepComponent {
	readonly serviceTypeRetiredDog = ServiceTypeCode.RetiredServiceDogCertification;
	title = '';
	originalPhotoOfYourselfExpired = false;
	photographOfYourself = this.retiredDogApplicationService.photographOfYourself;

	form: FormGroup = this.retiredDogApplicationService.photographOfYourselfFormGroup;

	constructor(private retiredDogApplicationService: RetiredDogApplicationService) {}

	ngOnInit(): void {
		this.originalPhotoOfYourselfExpired = this.retiredDogApplicationService.retiredDogModelFormGroup.get(
			'originalLicenceData.originalPhotoOfYourselfExpired'
		)?.value;

		if (!this.originalPhotoOfYourselfExpired) {
			this.title = 'Do you want to update your photo?';
		} else {
			this.title = 'Upload a photo of yourself';
		}
	}

	onFileUploaded(): void {
		this.retiredDogApplicationService.hasValueChanged = true;
	}

	onFileRemoved(): void {
		this.retiredDogApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
