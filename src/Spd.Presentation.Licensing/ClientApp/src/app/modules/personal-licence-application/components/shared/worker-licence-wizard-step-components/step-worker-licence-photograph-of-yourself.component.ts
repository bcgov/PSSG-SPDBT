import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';

@Component({
	selector: 'app-step-worker-licence-photograph-of-yourself',
	template: `
		<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.New; else isRenewOrUpdate">
			<app-step-worker-licence-photograph-of-yourself-new
				[form]="form"
			></app-step-worker-licence-photograph-of-yourself-new>
		</ng-container>

		<ng-template #isRenewOrUpdate>
			<app-step-worker-licence-photograph-of-yourself-renew-and-update
				[form]="form"
			></app-step-worker-licence-photograph-of-yourself-renew-and-update>
		</ng-template>
	`,
	styles: [],
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
