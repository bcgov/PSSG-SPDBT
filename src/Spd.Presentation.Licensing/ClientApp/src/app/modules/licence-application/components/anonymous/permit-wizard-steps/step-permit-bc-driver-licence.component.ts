import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { showHideTriggerSlideAnimation } from 'src/app/core/animations';

@Component({
	selector: 'app-step-permit-bc-driver-licence',
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
	animations: [showHideTriggerSlideAnimation],
})
export class StepPermitBcDriverLicenceComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.permitApplicationService.bcDriversLicenceFormGroup;

	constructor(private permitApplicationService: PermitApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
