import { Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ServiceTypeCode } from '@app/api/models';
import { DogTrainerApplicationService } from '@app/core/services/dog-trainer-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormPhotographOfYourselfComponent } from '@app/shared/components/form-photograph-of-yourself.component';

@Component({
	selector: 'app-step-dt-photograph-of-yourself',
	template: `
		<app-step-section
			title="Passport-quality photo of the dog trainer"
			subtitle="This photo will appear on your certificate."
		>
			<app-form-photograph-of-yourself
				[serviceTypeCode]="serviceTypeDogTrainer"
				[form]="form"
				label="licence"
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

	@ViewChild(FormPhotographOfYourselfComponent) formPhotographOfYourselfComponent!: FormPhotographOfYourselfComponent;

	constructor(private dogTrainerApplicationService: DogTrainerApplicationService) {}

	onFileChanged(): void {
		this.dogTrainerApplicationService.fileRemoved();
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
