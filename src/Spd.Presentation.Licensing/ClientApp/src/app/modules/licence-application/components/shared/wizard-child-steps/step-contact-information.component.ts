import { Component, Input, ViewChild } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { ContactInformationComponent } from '../step-components/contact-information.component';

@Component({
	selector: 'app-step-contact-information',
	template: `
		<section class="step-section">
			<div class="step">
				<ng-container
					*ngIf="
						applicationTypeCode === applicationTypeCodes.Renewal || applicationTypeCode === applicationTypeCodes.Update
					"
				>
					<app-renewal-alert></app-renewal-alert>
				</ng-container>

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
	applicationTypeCodes = ApplicationTypeCode;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(ContactInformationComponent) contactInformationComponent!: ContactInformationComponent;

	isFormValid(): boolean {
		this.contactInformationComponent.form.markAllAsTouched();
		return this.contactInformationComponent.form.valid;
	}
}
