import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';

@Component({
	selector: 'app-step-worker-licence-photograph-of-yourself',
	template: `
		@if (applicationTypeCode === applicationTypeCodes.New) {
			<app-step-worker-licence-photograph-of-yourself-new
				[form]="form"
			></app-step-worker-licence-photograph-of-yourself-new>
		} @else {
			<app-step-worker-licence-photograph-of-yourself-renew-and-update
				[form]="form"
			></app-step-worker-licence-photograph-of-yourself-renew-and-update>
		}
	`,
	styles: [],
	standalone: false,
})
export class StepWorkerLicencePhotographOfYourselfComponent implements LicenceChildStepperStepComponent {
	applicationTypeCodes = ApplicationTypeCode;

	form: FormGroup = this.workerApplicationService.photographOfYourselfFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private workerApplicationService: WorkerApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
