import { Component, Input, ViewChild } from '@angular/core';
import { AddressRetrieveResponse, ApplicationTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { Subscription } from 'rxjs';
import { ResidentialAddressComponent } from '../step-components/residential-address.component';

@Component({
	selector: 'app-step-residential-address',
	template: `
		<section class="step-section">
			<div class="step">
				<ng-container
					*ngIf="
						applicationTypeCode === applicationTypeCodes.Renewal || applicationTypeCode === applicationTypeCodes.Update
					"
				>
					<app-renewal-alert [applicationTypeCode]="applicationTypeCode"></app-renewal-alert>
				</ng-container>

				<app-step-title title="Confirm your residential address" [subtitle]="subtitle"></app-step-title>
				<app-residential-address></app-residential-address>
			</div>
		</section>
	`,
	styles: [],
})
export class StepResidentialAddressComponent implements LicenceChildStepperStepComponent {
	applicationTypeCodes = ApplicationTypeCode;

	readonly subtitle_unauth_new = 'This is the address where you currently live';
	readonly subtitle_auth_new = `This is the address from your BC Services Card. If you need to make any updates, visit <a href="${SPD_CONSTANTS.urls.addressChangeUrl}" target="_blank">addresschange.gov.bc.ca</a>`;

	subtitle = '';

	authenticationSubscription!: Subscription;
	addressAutocompleteFields: AddressRetrieveResponse[] = [];

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(ResidentialAddressComponent) residentialAddressComponent!: ResidentialAddressComponent;

	isFormValid(): boolean {
		return this.residentialAddressComponent.isFormValid();
	}
}
