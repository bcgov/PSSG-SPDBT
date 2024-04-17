import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';

@Component({
	selector: 'app-step-worker-licence-bc-driver-licence',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="Do you have a BC Driver's Licence?" [subtitle]="subtitle"></app-step-title>

				<div class="row">
					<div class="offset-md-2 col-md-8 col-sm-12">
						<app-alert type="info" icon="info">
							Providing your driver's licence number will speed up processing times
						</app-alert>
					</div>
				</div>

				<app-common-bc-driver-licence [form]="form"></app-common-bc-driver-licence>
			</div>
		</section>
	`,
	styles: [],
})
export class StepWorkerLicenceBcDriverLicenceComponent implements LicenceChildStepperStepComponent {
	subtitle = '';

	form: FormGroup = this.licenceApplicationService.bcDriversLicenceFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

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
