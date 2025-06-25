import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { BusinessLicenceApplicationRoutes } from '@app/modules/business-licence-application/business-license-application-routes';
import { FormBusinessTermsComponent } from '@app/shared/components/form-business-terms.component';

@Component({
	selector: 'app-step-business-licence-update-terms',
	template: `
		<app-step-section
			heading="Terms and Conditions"
			subheading="Read, download, and accept the Terms of Use to continue"
		>
			<app-form-business-terms
				[form]="form"
				[applicationTypeCode]="applicationTypeCodeUpdate"
			></app-form-business-terms>
		</app-step-section>

		<app-wizard-footer (nextStepperStep)="onFormValidNextStep()"></app-wizard-footer>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepBusinessLicenceUpdateTermsComponent {
	applicationTypeCodeUpdate = ApplicationTypeCode.Update;

	form = this.businessApplicationService.termsAndConditionsFormGroup;

	@ViewChild(FormBusinessTermsComponent) commonTermsComponent!: FormBusinessTermsComponent;

	constructor(
		private router: Router,
		private businessApplicationService: BusinessApplicationService
	) {}

	onFormValidNextStep(): void {
		if (!this.commonTermsComponent.isFormValid()) return;

		this.router.navigateByUrl(
			BusinessLicenceApplicationRoutes.pathBusinessLicence(
				BusinessLicenceApplicationRoutes.BUSINESS_LICENCE_APP_PROFILE
			),
			{ state: { applicationTypeCode: ApplicationTypeCode.Update } }
		);
	}
}
