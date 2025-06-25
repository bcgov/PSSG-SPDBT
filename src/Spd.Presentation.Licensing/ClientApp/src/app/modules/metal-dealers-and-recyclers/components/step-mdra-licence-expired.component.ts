import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ServiceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-mdra-licence-expired',
	template: `
		<app-step-section heading="Do you have an expired metal dealers & recyclers registration in BC?">
			<div class="row">
				<div class="offset-md-2 col-md-8 col-sm-12">
					<app-alert type="info" icon="info">
						<p>Provide information from your expired registration to reduce processing time.</p>
						<p>
							If you don’t know your expired registration number, call Security Program’s Licensing Unit during regular
							office hours at {{ mdraPhoneNumber }}.
						</p>
					</app-alert>
				</div>
			</div>

			<app-form-expired-licence
				[form]="form"
				[isLoggedIn]="false"
				[serviceTypeCode]="mdraServiceTypeCode"
			></app-form-expired-licence>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepMdraLicenceExpiredComponent implements LicenceChildStepperStepComponent {
	mdraPhoneNumber = SPD_CONSTANTS.phone.mdraPhoneNumber;

	form: FormGroup = this.mdraDealersApplicationService.expiredLicenceFormGroup;
	mdraServiceTypeCode = ServiceTypeCode.Mdra;

	constructor(private mdraDealersApplicationService: MetalDealersApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
