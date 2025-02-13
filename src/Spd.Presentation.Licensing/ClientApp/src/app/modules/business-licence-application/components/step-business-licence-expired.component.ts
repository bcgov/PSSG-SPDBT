import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ServiceTypeCode } from '@app/api/models';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-business-licence-expired',
	template: `
		<app-step-section title="Does your business have an expired licence in BC?">
			<div class="row">
				<div class="offset-md-2 col-md-8 col-sm-12">
					<app-alert type="info" icon="info">
						Providing information from your expired licence may speed up the processing time.
					</app-alert>
				</div>
			</div>

			<app-form-expired-licence
				[form]="form"
				[isLoggedIn]="true"
				[serviceTypeCode]="securityBusinessLicenceCode"
			></app-form-expired-licence>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepBusinessLicenceExpiredComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.businessApplicationService.expiredLicenceFormGroup;
	securityBusinessLicenceCode = ServiceTypeCode.SecurityBusinessLicence;

	constructor(private businessApplicationService: BusinessApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
