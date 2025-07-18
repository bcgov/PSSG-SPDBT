import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ServiceTypeCode } from '@app/api/models';
import { DogTrainerApplicationService } from '@app/core/services/dog-trainer-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-dt-photograph-of-yourself',
	template: `
		<app-step-section
			heading="Passport-quality photo of the dog trainer"
			subheading="This photo will appear on your certificate."
		>
			<app-form-photograph-of-yourself
				[serviceTypeCode]="serviceTypeDogTrainer"
				[form]="form"
				(fileUploaded)="onFileChanged()"
				(fileRemoved)="onFileChanged()"
			></app-form-photograph-of-yourself>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepDtPhotographOfYourselfComponent implements LicenceChildStepperStepComponent {
	readonly serviceTypeDogTrainer = ServiceTypeCode.DogTrainerCertification;

	form: FormGroup = this.dogTrainerApplicationService.photographOfYourselfFormGroup;

	constructor(private dogTrainerApplicationService: DogTrainerApplicationService) {}

	onFileChanged(): void {
		this.dogTrainerApplicationService.fileRemoved();
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
