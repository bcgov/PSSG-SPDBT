import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceApplicationService } from '@app/modules/personal-licence-application/licence-application.service';
import { LicenceChildStepperStepComponent } from '@app/shared/services/common-application.helper';

@Component({
	selector: 'app-step-worker-licence-mailing-address-anonymous',
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
export class StepWorkerLicenceMailingAddressAnonymousComponent implements OnInit, LicenceChildStepperStepComponent {
	form: FormGroup = this.licenceApplicationService.mailingAddressFormGroup;
	title = '';
	subtitle = '';

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		switch (this.applicationTypeCode) {
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

	get captchaFormGroup(): FormGroup {
		return this.form.get('captchaFormGroup') as FormGroup;
	}
	get displayCaptcha(): FormControl {
		return this.form.get('captchaFormGroup')?.get('displayCaptcha') as FormControl;
	}
}
