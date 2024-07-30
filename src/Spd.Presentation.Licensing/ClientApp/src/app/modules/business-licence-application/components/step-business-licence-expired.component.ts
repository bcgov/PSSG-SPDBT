import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WorkerLicenceTypeCode } from '@app/api/models';
import { BusinessApplicationService } from '@app/modules/business-licence-application/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/shared/services/common-application.helper';

@Component({
	selector: 'app-step-business-licence-expired',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Does your business have an expired licence?"
					subtitle="Processing time will be reduced if you provide info from your past licence"
				></app-step-title>

				<app-expired-licence
					[form]="form"
					[isLoggedIn]="true"
					[workerLicenceTypeCode]="securityBusinessLicenceCode"
				></app-expired-licence>
			</div>
		</section>
	`,
	styles: [],
})
export class StepBusinessLicenceExpiredComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.businessApplicationService.expiredLicenceFormGroup;
	securityBusinessLicenceCode = WorkerLicenceTypeCode.SecurityBusinessLicence;

	constructor(private businessApplicationService: BusinessApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
