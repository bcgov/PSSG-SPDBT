import { Component } from '@angular/core';
import { LicenceChildStepperStepComponent } from '../../services/licence-application.helper';

@Component({
	selector: 'app-step-business-licence-name',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Provide your business information"
					subtitle="Sole proprietors must have a valid security worker licence"
				></app-step-title>
			</div>
		</section>
	`,
	styles: [],
})
export class StepBusinessLicenceNameComponent implements LicenceChildStepperStepComponent {
	// TODO is component needed?
	isFormValid(): boolean {
		// this.form.markAllAsTouched();
		// return this.form.valid;
		return true;
	}
}
