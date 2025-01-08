import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-metal-dealers-business-address',
	template: `
		<app-step-section title="Business Addresses">
			<div class="row">
				<div class="col-xl-11 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-xl-6 col-lg-12 col-md-12 col-sm-12">
							<div class="text-minor-heading mt-3 mb-4">Business Address</div>

							<app-form-address [form]="businessAddressForm" [isWideView]="false"></app-form-address>
						</div>

						<div class="col-xl-6 col-lg-12 col-md-12 col-sm-12">
							<div class="text-minor-heading mt-3 mb-4">Business Mailing Address</div>

							<app-form-address-and-is-same-flag
								[form]="businessMailingAddressForm"
								isAddressTheSameLabel="The business address and mailing address are the same"
								[isWideView]="false"
							></app-form-address-and-is-same-flag>
						</div>
					</div>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepMetalDealersBusinessAddressComponent {
	matcher = new FormErrorStateMatcher();

	phoneMask = SPD_CONSTANTS.phone.displayMask;

	form = this.metalDealersApplicationService.businessOwnerFormGroup;
	businessAddressForm = this.metalDealersApplicationService.businessAddressFormGroup;
	businessMailingAddressForm = this.metalDealersApplicationService.businessMailingAddressFormGroup;

	constructor(private metalDealersApplicationService: MetalDealersApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get givenName(): FormControl {
		return this.form.get('givenName') as FormControl;
	}
	get middleName1(): FormControl {
		return this.form.get('middleName1') as FormControl;
	}
	get middleName2(): FormControl {
		return this.form.get('middleName2') as FormControl;
	}
	get surname(): FormControl {
		return this.form.get('surname') as FormControl;
	}
	get emailAddress(): FormControl {
		return this.form.get('emailAddress') as FormControl;
	}
	get phoneNumber(): FormControl {
		return this.form.get('phoneNumber') as FormControl;
	}
}
