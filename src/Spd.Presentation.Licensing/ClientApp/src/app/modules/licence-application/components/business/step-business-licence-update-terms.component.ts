import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { BusinessApplicationService } from '../../services/business-application.service';
import { CommonBusinessTermsComponent } from '../shared/step-components/common-business-terms.component';

@Component({
	selector: 'app-step-business-licence-update-terms',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Terms and Conditions"
					subtitle="Read, download, and accept the Terms of Use to continue"
				></app-step-title>

				<app-common-business-terms
					[form]="form"
					[applicationTypeCode]="applicationTypeCodeUpdate"
				></app-common-business-terms>
			</div>
		</section>

		<app-wizard-footer (nextStepperStep)="onFormValidNextStep()"></app-wizard-footer>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepBusinessLicenceUpdateTermsComponent {
	applicationTypeCodeUpdate = ApplicationTypeCode.Update;

	form = this.businessApplicationService.termsAndConditionsFormGroup;

	@ViewChild(CommonBusinessTermsComponent) commonTermsComponent!: CommonBusinessTermsComponent;

	constructor(private router: Router, private businessApplicationService: BusinessApplicationService) {}

	onFormValidNextStep(): void {
		if (!this.commonTermsComponent.isFormValid()) return;

		this.router.navigateByUrl(
			LicenceApplicationRoutes.pathBusinessLicence(LicenceApplicationRoutes.BUSINESS_LICENCE_USER_PROFILE),
			{ state: { applicationTypeCode: ApplicationTypeCode.Update } }
		);
	}
}