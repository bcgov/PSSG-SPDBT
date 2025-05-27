import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ServiceTypeCode } from '@app/api/models';
import { DogTrainerApplicationService } from '@app/core/services/dog-trainer-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-dt-photograph-of-yourself-renew',
	template: `
		<app-step-section [title]="title">
			<app-form-photograph-of-yourself-update
				[form]="form"
				[serviceTypeCode]="serviceTypeDogTrainer"
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
export class StepDtPhotographOfYourselfRenewComponent implements OnInit, LicenceChildStepperStepComponent {
	readonly serviceTypeDogTrainer = ServiceTypeCode.DogTrainerCertification;

	title = '';
	originalPhotoOfYourselfExpired = false;
	photographOfYourself = this.dogTrainerApplicationService.photographOfYourself;

	form: FormGroup = this.dogTrainerApplicationService.photographOfYourselfFormGroup;

	constructor(private dogTrainerApplicationService: DogTrainerApplicationService) {}

	ngOnInit(): void {
		this.originalPhotoOfYourselfExpired = this.dogTrainerApplicationService.dogTrainerFormGroup.get(
			'originalLicenceData.originalPhotoOfYourselfExpired'
		)?.value;

		if (!this.originalPhotoOfYourselfExpired) {
			this.title = "Do you want to update the dog trainer's photo?";
		} else {
			this.title = 'Upload a photo of the dog trainer';
		}
	}

	onFileUploaded(): void {
		this.dogTrainerApplicationService.hasValueChanged = true;
	}

	onFileRemoved(): void {
		this.dogTrainerApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
