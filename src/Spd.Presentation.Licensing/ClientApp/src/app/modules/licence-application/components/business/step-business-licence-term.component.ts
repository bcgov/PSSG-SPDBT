import { Component } from '@angular/core';
import { LicenceChildStepperStepComponent } from '../../services/licence-application.helper';

@Component({
	selector: 'app-step-business-licence-term',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Select your licence term"
					subtitle="The licence term will apply to all licence categories"
				></app-step-title>
			</div>
		</section>
	`,
	styles: [],
})
export class StepBusinessLicenceTermComponent implements LicenceChildStepperStepComponent {
	isFormValid(): boolean {
		// this.form.markAllAsTouched();
		// return this.form.valid;
		return true;
	}
}
