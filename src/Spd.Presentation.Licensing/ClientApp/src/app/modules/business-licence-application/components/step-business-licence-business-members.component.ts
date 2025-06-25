import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { CommonBusinessMembersComponent } from './common-business-members.component';

@Component({
	selector: 'app-step-business-licence-business-members',
	template: `
		<app-step-section
			[heading]="title"
			subheading="A business manager is the person responsible for the day-to-day supervision of licensed security workers at the locations from which a security business operates."
			[info]="info"
		>
			<div class="row">
				<div class="col-xxl-10 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<app-alert type="info" icon="info">
						You must disclose your business managers, and they are required to consent to criminal record checks so that
						we can conduct a review of their suitability.
					</app-alert>

					<app-common-business-members
						[applicationTypeCode]="applicationTypeCode"
						[defaultExpanded]="true"
						[isWizard]="true"
					></app-common-business-members>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepBusinessLicenceBusinessMembersComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	info = '';

	readonly title_new = 'Add all business managers of this business';
	readonly title_renew_update = 'Confirm business managers of this business';

	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(CommonBusinessMembersComponent) businessMembersComponent!: CommonBusinessMembersComponent;

	ngOnInit(): void {
		const securityIndustryLicensingCmUrl = SPD_CONSTANTS.urls.securityIndustryLicensingCmUrl;
		this.info = `<a class='large' href='${securityIndustryLicensingCmUrl}' target='_blank'>Business managers</a> who are also licensed security workers must provide their licence number to the Registrar of Security Services when the business applies for a licence.`;

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
		return this.businessMembersComponent.isFormValid();
	}
}
