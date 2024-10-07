import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode, ServiceTypeCode } from '@app/api/models';
import { StepPermitTermsOfUseComponent } from '@app/modules/personal-licence-application/components/anonymous/permit-wizard-step-components/step-permit-terms-of-use.component';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routes';
import { PermitApplicationService } from '@core/services/permit-application.service';

@Component({
	selector: 'app-step-permit-update-terms-authenticated',
	template: `
		<app-step-permit-terms-of-use [applicationTypeCode]="applicationTypeCodeUpdate"></app-step-permit-terms-of-use>

		<app-wizard-footer (nextStepperStep)="onFormValidNextStep()"></app-wizard-footer>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepPermitUpdateTermsAuthenticatedComponent {
	serviceTypeCode: ServiceTypeCode | null = null;
	applicationTypeCodeUpdate = ApplicationTypeCode.Update;

	@ViewChild(StepPermitTermsOfUseComponent)
	termsOfUseComponent!: StepPermitTermsOfUseComponent;

	constructor(private router: Router, private permitApplicationService: PermitApplicationService) {
		const state = this.router.getCurrentNavigation()?.extras.state;
		this.serviceTypeCode = state && state['serviceTypeCode'];
	}

	onFormValidNextStep(): void {
		const isValid = this.termsOfUseComponent.isFormValid();
		if (!isValid) return;

		this.router.navigateByUrl(
			PersonalLicenceApplicationRoutes.pathPermitAuthenticated(
				PersonalLicenceApplicationRoutes.PERMIT_USER_PROFILE_AUTHENTICATED
			),
			{ state: { serviceTypeCode: this.serviceTypeCode, applicationTypeCode: ApplicationTypeCode.Update } }
		);
	}

	onCancel(): void {
		this.router.navigateByUrl(PersonalLicenceApplicationRoutes.pathPermitAuthenticated());
	}
}
