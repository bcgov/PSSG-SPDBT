import { Component, Input, ViewChild } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { CommonSwlPermitTermsComponent } from '@app/modules/licence-application/components/shared/step-components/common-swl-permit-terms.component';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';

@Component({
	selector: 'app-step-worker-licence-terms-of-use',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Terms and Conditions"
					subtitle="Read, download, and accept the Terms of Use to continue"
				></app-step-title>

				<app-common-swl-permit-terms
					[form]="form"
					[applicationTypeCode]="applicationTypeCode"
				></app-common-swl-permit-terms>
			</div>
		</section>
	`,
	styles: [],
})
export class StepWorkerLicenceTermsOfUseComponent implements LicenceChildStepperStepComponent {
	form = this.licenceApplicationService.termsAndConditionsFormGroup;

	@ViewChild(CommonSwlPermitTermsComponent) commonTermsComponent!: CommonSwlPermitTermsComponent;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	isFormValid(): boolean {
		return this.commonTermsComponent.isFormValid();
	}
}
