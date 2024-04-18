import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AddressRetrieveResponse, ApplicationTypeCode } from '@app/api/models';
import { CommonResidentialAddressComponent } from '@app/modules/licence-application/components/shared/step-components/common-residential-address.component';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';

@Component({
	selector: 'app-step-permit-residential-address',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title [title]="title" [subtitle]="subtitle"></app-step-title>

				<app-common-residential-address [form]="form"></app-common-residential-address>
			</div>
		</section>
	`,
	styles: [],
})
export class StepPermitResidentialAddressComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';

	addressAutocompleteFields: AddressRetrieveResponse[] = [];

	form: FormGroup = this.permitApplicationService.residentialAddressFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(CommonResidentialAddressComponent) residentialAddressComponent!: CommonResidentialAddressComponent;

	constructor(private permitApplicationService: PermitApplicationService) {}

	ngOnInit(): void {
		switch (this.applicationTypeCode) {
			case ApplicationTypeCode.Replacement: {
				this.title = 'Review your residential address';
				this.subtitle = 'Ensure your residential address is correct before submitting your application';
				break;
			}
			case ApplicationTypeCode.Renewal:
			case ApplicationTypeCode.Update: {
				this.title = 'Confirm your residential address';
				this.subtitle = 'Ensure your residential address is correct before submitting your application';
				break;
			}
			default: {
				this.title = 'Provide your residential address';
				this.subtitle = 'This is the address where you currently live';
				break;
			}
		}
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
