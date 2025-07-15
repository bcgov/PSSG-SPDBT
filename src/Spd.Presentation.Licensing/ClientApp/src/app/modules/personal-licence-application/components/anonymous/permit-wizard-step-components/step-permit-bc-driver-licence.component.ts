import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { PermitApplicationService } from '@app/core/services/permit-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-permit-bc-driver-licence',
	template: `
		<app-step-section heading="Do you have a BC Driver's Licence?" [subheading]="subtitle">
			<div class="row">
				<div class="offset-md-2 col-md-8 col-sm-12">
					<app-alert type="info" icon="info">
						Providing your driver’s licence number may speed up processing times.
					</app-alert>
				</div>
			</div>

			<app-form-bc-driver-licence [form]="form"></app-form-bc-driver-licence>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
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
