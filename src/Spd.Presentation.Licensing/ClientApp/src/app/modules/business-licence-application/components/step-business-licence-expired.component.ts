import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WorkerLicenceTypeCode } from '@app/api/models';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-business-licence-expired',
	template: `
		<app-step-section
			title="Does your business have an expired licence in BC?"
			subtitle="Processing time will be reduced if you provide info from your past licence"
		>
			<app-expired-licence
				[form]="form"
				[isLoggedIn]="true"
				[workerLicenceTypeCode]="securityBusinessLicenceCode"
			></app-expired-licence>
		</app-step-section>
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
