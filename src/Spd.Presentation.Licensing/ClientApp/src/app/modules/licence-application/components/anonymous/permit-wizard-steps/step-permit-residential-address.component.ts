import { Component, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AddressRetrieveResponse, ApplicationTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { CommonResidentialAddressComponent } from '@app/modules/licence-application/components/shared/step-components/common-residential-address.component';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';

@Component({
	selector: 'app-step-permit-residential-address',
	template: `
		<section class="step-section">
			<div class="step">
				<ng-container *ngIf="isRenewalOrUpdate">
					<app-common-update-renewal-alert
						[applicationTypeCode]="applicationTypeCode"
					></app-common-update-renewal-alert>
				</ng-container>

				<app-step-title title="Confirm your residential address" [subtitle]="subtitle"></app-step-title>

				<app-common-residential-address [form]="form"></app-common-residential-address>
			</div>
		</section>
	`,
	styles: [],
})
export class StepPermitResidentialAddressComponent implements LicenceChildStepperStepComponent {
	readonly subtitle_unauth_new = 'This is the address where you currently live';
	readonly subtitle_auth_new = `This is the address from your BC Services Card. If you need to make any updates, visit <a href="${SPD_CONSTANTS.urls.addressChangeUrl}" target="_blank">addresschange.gov.bc.ca</a>`;

	subtitle = '';

	addressAutocompleteFields: AddressRetrieveResponse[] = [];

	form: FormGroup = this.permitApplicationService.residentialAddressFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(CommonResidentialAddressComponent) residentialAddressComponent!: CommonResidentialAddressComponent;

	constructor(private permitApplicationService: PermitApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get isRenewalOrUpdate(): boolean {
		return (
			this.applicationTypeCode === ApplicationTypeCode.Renewal ||
			this.applicationTypeCode === ApplicationTypeCode.Update
		);
	}
}
