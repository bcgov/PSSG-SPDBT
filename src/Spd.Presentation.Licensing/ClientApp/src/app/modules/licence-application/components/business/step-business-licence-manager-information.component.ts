import { Component } from '@angular/core';
import { LicenceChildStepperStepComponent } from '../../services/licence-application.helper';

@Component({
	selector: 'app-step-business-licence-manager-information',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Provide contact information"
					subtitle="We require contact information for your company's business manager, who will be responsible for day-to-day supervision of licensed security employees in B.C. in accordance with section 14(2) of the <i>Security Services Act</i>"
				></app-step-title>
			</div>
		</section>
	`,
	styles: [],
})
export class StepBusinessLicenceManagerInformationComponent implements LicenceChildStepperStepComponent {
	isFormValid(): boolean {
		// this.form.markAllAsTouched();
		// return this.form.valid;
		return true;
	}
}
