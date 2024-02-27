import { Component } from '@angular/core';
import { LicenceChildStepperStepComponent } from '../../services/licence-application.helper';

@Component({
	selector: 'app-step-business-licence-category',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="What category of security business licence are you applying for?"></app-step-title>
			</div>
		</section>
	`,
	styles: [],
})
export class StepBusinessLicenceCategoryComponent implements LicenceChildStepperStepComponent {
	isFormValid(): boolean {
		// this.form.markAllAsTouched();
		// return this.form.valid;
		return true;
	}
}
