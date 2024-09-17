import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';

@Component({
	selector: 'app-step-worker-licence-physical-characteristics',
	template: `
		<app-step-section [title]="title" [subtitle]="subtitle">
			<app-common-physical-characteristics [form]="form"></app-common-physical-characteristics>
		</app-step-section>
	`,
	styles: [],
})
export class StepWorkerLicencePhysicalCharacteristicsComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';
	form: FormGroup = this.workerApplicationService.characteristicsFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private workerApplicationService: WorkerApplicationService) {}

	ngOnInit(): void {
		if (this.isRenewalOrUpdate) {
			this.title = 'Confirm identifying information';
			this.subtitle = 'Update any information that has changed since your last application';
		} else {
			this.title = 'Provide identifying information';
			this.subtitle = '';
		}
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get isRenewalOrUpdate(): boolean {
		return (
			this.applicationTypeCode === ApplicationTypeCode.Renewal ||
			this.applicationTypeCode === ApplicationTypeCode.Update
		);
	}
}
