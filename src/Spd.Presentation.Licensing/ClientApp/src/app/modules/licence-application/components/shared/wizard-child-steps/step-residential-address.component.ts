import { Component, Input, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AddressRetrieveResponse, ApplicationTypeCode } from 'src/app/api/models';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { LicenceChildStepperStepComponent } from '../../../services/licence-application.helper';
import { LicenceApplicationService } from '../../../services/licence-application.service';
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
					<app-renewal-alert></app-renewal-alert>
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
	readonly subtitle_auth_new =
		'This is the address from your BC Services Card. If you need to make any updates, visit <a href="https://www.addresschange.gov.bc.ca/" target="_blank">addresschange.gov.bc.ca</a>';

	subtitle = '';

	isLoggedIn = false;

	authenticationSubscription!: Subscription;
	addressAutocompleteFields: AddressRetrieveResponse[] = [];

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(ResidentialAddressComponent) residentialAddressComponent!: ResidentialAddressComponent;

	constructor(
		private authProcessService: AuthProcessService,
		private licenceApplicationService: LicenceApplicationService
	) {}

	isFormValid(): boolean {
		return this.residentialAddressComponent.isFormValid();
	}
}
