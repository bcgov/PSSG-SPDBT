import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AddressRetrieveResponse, ApplicationTypeCode } from '@app/api/models';
import { PermitApplicationService } from '@app/modules/personal-licence-application/permit-application.service';
import { LicenceChildStepperStepComponent } from '@app/shared/services/common-application.helper';

@Component({
	selector: 'app-step-permit-residential-address',
	template: `
		<app-step-section [title]="title" [subtitle]="subtitle">
			<app-address [form]="form"></app-address>
		</app-step-section>
	`,
	styles: [],
})
export class StepPermitResidentialAddressComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';

	addressAutocompleteFields: AddressRetrieveResponse[] = [];

	form: FormGroup = this.permitApplicationService.residentialAddressFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

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
