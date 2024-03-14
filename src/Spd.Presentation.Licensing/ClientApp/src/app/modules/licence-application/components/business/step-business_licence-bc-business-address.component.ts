import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { BusinessApplicationService } from '../../services/business-application.service';

@Component({
	selector: 'app-step-business-licence-bc-business-address',
	template: `
		<section class="step-section">
			<div class="step">
				<!-- <ng-container *ngIf="isRenewalOrUpdate">
					<app-common-update-renewal-alert
						[applicationTypeCode]="applicationTypeCode"
					></app-common-update-renewal-alert>
				</ng-container> -->

				<app-step-title
					title="B.C. business address"
					subtitle="Provide an address in British Columbia for document service"
				></app-step-title>

				<app-common-address [form]="form"></app-common-address>
			</div>
		</section>
	`,
	styles: [],
})
export class StepBusinessLicenceBcBusinessAddressComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.businessApplicationService.bcBusinessAddressFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	// @ViewChild(CommonAddressComponent) commonAddressComponent!: CommonAddressComponent;

	constructor(private businessApplicationService: BusinessApplicationService) {}

	isFormValid(): boolean {
		console.debug('bcBusinessAddressFormGroup', this.form.value);
		this.form.markAllAsTouched();
		// return this.form.valid;
		return true;
	}

	// get isRenewalOrUpdate(): boolean {
	// 	return (
	// 		this.applicationTypeCode === ApplicationTypeCode.Renewal ||
	// 		this.applicationTypeCode === ApplicationTypeCode.Update
	// 	);
	// }
}
