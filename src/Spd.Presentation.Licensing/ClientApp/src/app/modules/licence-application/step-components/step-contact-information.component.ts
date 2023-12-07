import { Component, ViewChild } from '@angular/core';
import { LicenceChildStepperStepComponent } from '../services/licence-application.helper';
import { LicenceApplicationService } from '../services/licence-application.service';
import { ContactInformationComponent } from './contact-information.component';

@Component({
	selector: 'app-step-contact-information',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="Provide your contact information"></app-step-title>
				<div class="step-container">
					<div class="row">
						<div class="col-12 mx-auto">
							<app-contact-information></app-contact-information>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class StepContactInformationComponent implements LicenceChildStepperStepComponent {
	@ViewChild(ContactInformationComponent) contactInformationComponent!: ContactInformationComponent;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	isFormValid(): boolean {
		this.contactInformationComponent.form.markAllAsTouched();
		return this.contactInformationComponent.form.valid;
	}
}
