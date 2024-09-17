import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WorkerLicenceTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';

@Component({
	selector: 'app-step-worker-licence-expired',
	template: `
		<app-step-section
			title="Do you have an expired licence in BC?"
			subtitle="Processing time will be reduced if you provide info from your past licence"
		>
			<app-expired-licence
				[form]="form"
				[isLoggedIn]="isLoggedIn"
				[workerLicenceTypeCode]="securityWorkerLicenceCode"
			></app-expired-licence>
		</app-step-section>
	`,
	styles: [],
})
export class StepWorkerLicenceExpiredComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.workerApplicationService.expiredLicenceFormGroup;
	securityWorkerLicenceCode = WorkerLicenceTypeCode.SecurityWorkerLicence;

	@Input() isLoggedIn!: boolean;

	constructor(private workerApplicationService: WorkerApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
