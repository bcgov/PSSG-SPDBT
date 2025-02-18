import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ServiceTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';

@Component({
	selector: 'app-step-worker-licence-expired',
	template: `
		<app-step-section title="Do you have an expired licence in BC?">
			<div class="row">
				<div class="offset-md-2 col-md-8 col-sm-12">
					<app-alert type="info" icon="info">
						Provide information from your expired licence to reduce processing time.
					</app-alert>
				</div>
			</div>

			<app-form-expired-licence
				[form]="form"
				[isLoggedIn]="isLoggedIn"
				[serviceTypeCode]="securityWorkerLicenceCode"
			></app-form-expired-licence>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepWorkerLicenceExpiredComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.workerApplicationService.expiredLicenceFormGroup;
	securityWorkerLicenceCode = ServiceTypeCode.SecurityWorkerLicence;

	@Input() isLoggedIn!: boolean;

	constructor(private workerApplicationService: WorkerApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
