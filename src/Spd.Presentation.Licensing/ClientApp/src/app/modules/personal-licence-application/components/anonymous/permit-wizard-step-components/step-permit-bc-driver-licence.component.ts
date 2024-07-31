import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { PermitApplicationService } from '@app/modules/personal-licence-application/permit-application.service';
import { LicenceChildStepperStepComponent } from '@app/shared/services/common-application.helper';

@Component({
	selector: 'app-step-permit-bc-driver-licence',
	template: `
		<app-step-section title="Do you have a BC Driver's Licence?" [subtitle]="subtitle">
			<div class="row">
				<div class="offset-md-2 col-md-8 col-sm-12">
					<app-alert type="info" icon="info">
						Providing your driver's licence number will speed up processing times
					</app-alert>
				</div>
			</div>

			<app-common-bc-driver-licence [form]="form"></app-common-bc-driver-licence>
		</app-step-section>
	`,
	styles: [],
})
export class StepPermitBcDriverLicenceComponent implements OnInit, LicenceChildStepperStepComponent {
	subtitle = '';

	form: FormGroup = this.permitApplicationService.bcDriversLicenceFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private permitApplicationService: PermitApplicationService) {}

	ngOnInit(): void {
		this.subtitle = this.isRenewalOrUpdate
			? `If your driver's licence information has changed from your previous application, update your selection`
			: '';
	}

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
