import { Component } from '@angular/core';
import { LicenceChildStepperStepComponent } from '../../services/licence-application.helper';

@Component({
	selector: 'app-step-business-licence-type',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="What is the type of business or company?"
					subtitle="Check your <a class='large' href='https://www.account.bcregistry.gov.bc.ca/decide-business' target='_blank'>BC Registries account</a> if you're not sure. "
				></app-step-title>
			</div>
		</section>
	`,
	styles: [],
})
export class StepBusinessLicenceTypeComponent implements LicenceChildStepperStepComponent {
	isFormValid(): boolean {
		// this.form.markAllAsTouched();
		// return this.form.valid;
		return true;
	}
}
