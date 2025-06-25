import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { CommonControllingMembersComponent } from './common-controlling-members.component';

@Component({
	selector: 'app-step-business-licence-controlling-members',
	template: `
		<app-step-section
			[heading]="title"
			subheading="A controlling member is any person who can direct the activity of your business."
			[info]="info"
		>
			<div class="row">
				<div class="col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<app-alert type="info" icon="info">
						Controlling members who are not licensed security workers must consent to a criminal record check. This
						helps the Registrar determine whether to approve your security business application.
					</app-alert>

					<app-common-controlling-members
						[applicationTypeCode]="applicationTypeCode"
						[defaultExpanded]="true"
						[isWizard]="true"
					></app-common-controlling-members>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepBusinessLicenceControllingMembersComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	info = '';

	readonly title_new = 'Add all controlling members of this business';
	readonly title_renew_update = 'Confirm controlling members of this business';

	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(CommonControllingMembersComponent) controllingMembersComponent!: CommonControllingMembersComponent;

	ngOnInit(): void {
		const securityIndustryLicensingCmUrl = SPD_CONSTANTS.urls.securityIndustryLicensingCmUrl;
		this.info = `<a class='large' href='${securityIndustryLicensingCmUrl}' target='_blank'>Controlling members</a> who are also licensed security workers must provide their licence number to the Registrar of Security Services when the business applies for a licence.`;

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
