import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { PermitApplicationService } from '@app/modules/personal-licence-application/permit-application.service';
import { LicenceChildStepperStepComponent } from '@app/shared/services/common-application.helper';

@Component({
	selector: 'app-step-permit-mailing-address',
	template: `
		<app-step-section [title]="title" [subtitle]="subtitle">
			<app-address-and-is-same-flag
				[form]="form"
				isAddressTheSameLabel="My residential address and mailing address are the same"
			></app-address-and-is-same-flag>
		</app-step-section>
	`,
	styles: [],
})
export class StepPermitMailingAddressComponent implements OnInit, LicenceChildStepperStepComponent {
	form: FormGroup = this.permitApplicationService.mailingAddressFormGroup;
	title = '';
	subtitle = '';

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private permitApplicationService: PermitApplicationService) {}

	ngOnInit(): void {
		switch (this.applicationTypeCode) {
			case ApplicationTypeCode.Replacement: {
				this.title = 'Review your mailing address';
				this.subtitle = 'Ensure your mailing address is correct before submitting your application';
				break;
			}
			case ApplicationTypeCode.Renewal:
			case ApplicationTypeCode.Update: {
				this.title = 'Confirm your mailing address';
				this.subtitle = 'Ensure your mailing address is correct before submitting your application';
				break;
			}
			default: {
				this.title = 'Provide your mailing address';
				this.subtitle =
					'Provide your mailing address, if different from your residential address. This cannot be a company address.';
				break;
			}
		}
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
