import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { BusinessApplicationService } from '../../services/business-application.service';

@Component({
	selector: 'app-step-business-licence-business-address',
	template: `
		<section class="step-section">
			<div class="step">
				<!-- <ng-container *ngIf="isRenewalOrUpdate">
					<app-common-update-renewal-alert
						[applicationTypeCode]="applicationTypeCode"
					></app-common-update-renewal-alert>
				</ng-container> -->

				<app-step-title
					title="Confirm your business address"
					subtitle="This is the address of your business's primary location"
				></app-step-title>

				<app-common-address [form]="form"></app-common-address>

				<form [formGroup]="form" novalidate>
					<div class="row">
						<div class="offset-lg-2 col-lg-8">
							<mat-checkbox formControlName="isMailingTheSame">
								The mailing address is the same as the business address
							</mat-checkbox>
						</div>
					</div>
				</form>
			</div>
		</section>
	`,
	styles: [],
})
export class StepBusinessLicenceBusinessAddressComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.businessApplicationService.businessAddressFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	// @ViewChild(CommonAddressComponent) commonAddressComponent!: CommonAddressComponent;

	constructor(private businessApplicationService: BusinessApplicationService) {}

	isFormValid(): boolean {
		console.debug('businessAddressFormGroup', this.form.value);
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
