import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/shared/services/common-application.helper';
import { CommonControllingMembersComponent } from './common-controlling-members.component';

@Component({
	selector: 'app-step-business-licence-controlling-members',
	template: `
		<app-step-section
			[title]="title"
			subtitle="A controlling member is any person who can direct the activity of your business."
			info="<a class='large' href='https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/security-industry-licensing/businesses/controlling-members' target='_blank'>Controlling members</a> who are also licensed security workers must provide their licence number to the Registrar of Security Services when the business applies for a licence."
		>
			<div class="row">
				<div class="col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<app-alert type="info" icon="info">
						Controlling members who are not licensed security workers must consent to criminal, police information and
						correctional service record checks. These checks help the Registrar determine whether or not to approve your
						security business application.
					</app-alert>

					<app-common-controlling-members [defaultExpanded]="true" [isWizard]="true"></app-common-controlling-members>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
})
export class StepBusinessLicenceControllingMembersComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';

	readonly title_new = 'Add all controlling members of this business';
	readonly title_renew_update = 'Confirm controlling members of this business';

	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(CommonControllingMembersComponent) controllingMembersComponent!: CommonControllingMembersComponent;

	ngOnInit(): void {
		switch (this.applicationTypeCode) {
			case ApplicationTypeCode.New: {
				this.title = this.title_new;
				break;
			}
			case ApplicationTypeCode.Renewal:
			case ApplicationTypeCode.Update: {
				this.title = this.title_renew_update;
				break;
			}
		}
	}

	isFormValid(): boolean {
		return this.controllingMembersComponent.isFormValid();
	}
}
