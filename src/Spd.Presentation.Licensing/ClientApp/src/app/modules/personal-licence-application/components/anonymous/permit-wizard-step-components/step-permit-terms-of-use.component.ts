import { Component, Input, ViewChild } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { PermitApplicationService } from '@app/core/services/permit-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { CommonSwlPermitTermsComponent } from '@app/modules/personal-licence-application/components/shared/common-step-components/common-swl-permit-terms.component';
import { CommonSwlPermitTermsUpdateReplaceComponent } from '../../shared/common-step-components/common-swl-permit-terms-update-replace.component';

@Component({
	selector: 'app-step-permit-terms-of-use',
	template: `
		<app-step-section
			heading="Terms and Conditions"
			subheading="Read, download, and accept the Terms of Use to continue"
		>
			@if (isNewOrRenewal) {
				<app-common-swl-permit-terms [form]="form"></app-common-swl-permit-terms>
			} @else {
				<app-common-swl-permit-terms-update-replace [form]="form"></app-common-swl-permit-terms-update-replace>
			}
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepPermitTermsOfUseComponent implements LicenceChildStepperStepComponent {
	form = this.permitApplicationService.termsAndConditionsFormGroup;

	@ViewChild(CommonSwlPermitTermsComponent) commonTermsComponent!: CommonSwlPermitTermsComponent;
	@ViewChild(CommonSwlPermitTermsUpdateReplaceComponent)
	commonTermsUpdateReplaceComponent!: CommonSwlPermitTermsUpdateReplaceComponent;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private permitApplicationService: PermitApplicationService) {}

	isFormValid(): boolean {
		if (this.isNewOrRenewal) {
			return this.commonTermsComponent.isFormValid();
		}

		return this.commonTermsUpdateReplaceComponent.isFormValid();
	}

	get isNewOrRenewal(): boolean {
		return (
			this.applicationTypeCode === ApplicationTypeCode.Renewal || this.applicationTypeCode === ApplicationTypeCode.New
		);
	}
}
