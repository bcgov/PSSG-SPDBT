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
				<app-step-title
					title="Do you have a BC Driver's Licence?"
					subtitle="Providing your driver's licence number will speed up processing times"
				></app-step-title>

				<app-common-bc-driver-licence [form]="form"></app-common-bc-driver-licence>
			</div>
		</section>
	`,
	styles: [],
})
export class StepWorkerLicenceBcDriverLicenceComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.licenceApplicationService.bcDriversLicenceFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
