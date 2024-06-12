import { Component, ViewChild } from '@angular/core';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { CommonControllingMembersComponent } from './common-controlling-members.component';

@Component({
	selector: 'app-step-business-licence-controlling-members',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Add all controlling members of this business <mat-icon class='info-icon' matTooltip='A controlling member is any person who can direct the activity of your business.'>info</mat-icon>"
					subtitle="A controlling member is any person who can direct the activity of your business."
					info="<a class='large' href='https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/security-industry-licensing/businesses/controlling-members' target='_blank'>Controlling members</a> who are also licensed security workers must provide their licence number to the Registrar of Security Services when the business applies for a licence."
				></app-step-title>

				<div class="row">
					<div class="col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<app-alert type="info" icon="info">
							Controlling members who are not licensed security workers must consent to criminal, police information and
							correctional service record checks. These checks help the Registrar determine whether or not to approve
							your security business application.
						</app-alert>

						<app-common-controlling-members [defaultExpanded]="true" [isWizard]="true"></app-common-controlling-members>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class StepBusinessLicenceControllingMembersComponent implements LicenceChildStepperStepComponent {
	@ViewChild(CommonControllingMembersComponent) controllingMembersComponent!: CommonControllingMembersComponent;

	isFormValid(): boolean {
		return this.controllingMembersComponent.isFormValid();
	}
}
