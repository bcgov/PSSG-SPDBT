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
						Provide information from your expired licence to reduce processing time.
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
		const licenceAppId = this.businessApplicationService.businessModelFormGroup.get('licenceAppId')?.value;
		if (!licenceAppId) {
			// SPDBT-4130 - force auto-save to create a licenceAppId. This is needed for document uplaods.
			this.businessApplicationService.hasValueChanged = true;
		}

		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
