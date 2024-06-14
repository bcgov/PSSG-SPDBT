import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WorkerLicenceTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';

@Component({
	selector: 'app-step-worker-licence-expired',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Do you have an expired licence?"
					subtitle="Processing time will be reduced if you provide info from your past licence"
				></app-step-title>

				<app-common-expired-licence
					[form]="form"
					[isLoggedIn]="isLoggedIn"
					[workerLicenceTypeCode]="securityWorkerLicenceCode"
				></app-common-expired-licence>
			</div>
		</section>
	`,
	styles: [],
})
export class StepWorkerLicenceExpiredComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.licenceApplicationService.expiredLicenceFormGroup;
	securityWorkerLicenceCode = WorkerLicenceTypeCode.SecurityWorkerLicence;

	@Input() isLoggedIn!: boolean;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
