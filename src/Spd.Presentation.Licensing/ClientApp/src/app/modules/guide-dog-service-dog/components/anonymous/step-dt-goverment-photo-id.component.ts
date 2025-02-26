import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { DogTrainerApplicationService } from '@app/core/services/dog-trainer-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-dt-government-id',
	template: `
		<app-step-section
			title="Government-issued photo ID of the dog trainer"
			subtitle="Upload a piece of your dog trainer's government-issued photo ID."
		>
			<app-form-gdsd-government-id
				[form]="form"
				(fileRemoved)="onFileChange()"
				(fileUploaded)="onFileChange()"
			></app-form-gdsd-government-id>
		</app-step-section>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
	standalone: false,
})
export class StepDtGovermentPhotoIdComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.dogTrainerApplicationService.governmentPhotoIdFormGroup;

	constructor(private dogTrainerApplicationService: DogTrainerApplicationService) {}

	onFileChange(): void {
		this.dogTrainerApplicationService.fileRemoved();
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
