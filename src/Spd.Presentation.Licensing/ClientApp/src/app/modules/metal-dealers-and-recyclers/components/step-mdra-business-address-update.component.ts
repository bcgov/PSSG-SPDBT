import { Component } from '@angular/core';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-mdra-business-address-update',
	template: `
		<app-step-section title="Business address" subtitle="Confirm your business location address">
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<app-form-address [form]="businessAddressForm" [isWideView]="false"></app-form-address>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepMdraBusinessAddressUpdateComponent implements LicenceChildStepperStepComponent {
	businessAddressForm = this.metalDealersApplicationService.businessAddressFormGroup;

	constructor(private metalDealersApplicationService: MetalDealersApplicationService) {}

	isFormValid(): boolean {
		this.businessAddressForm.markAllAsTouched();
		return this.businessAddressForm.valid;
	}
}
