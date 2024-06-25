import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { StepPermitTermsOfUseComponent } from '../../anonymous/permit-wizard-steps/step-permit-terms-of-use.component';

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
	workerLicenceTypeCode: WorkerLicenceTypeCode | null = null;
	applicationTypeCodeUpdate = ApplicationTypeCode.Update;

	@ViewChild(StepPermitTermsOfUseComponent)
	termsOfUseComponent!: StepPermitTermsOfUseComponent;

	constructor(private router: Router, private permitApplicationService: PermitApplicationService) {
		const state = this.router.getCurrentNavigation()?.extras.state;
		this.workerLicenceTypeCode = state && state['workerLicenceTypeCode'];
	}

	onFormValidNextStep(): void {
		const isValid = this.termsOfUseComponent.isFormValid();
		if (!isValid) return;

		this.router.navigateByUrl(
			LicenceApplicationRoutes.pathPermitAuthenticated(LicenceApplicationRoutes.PERMIT_USER_PROFILE_AUTHENTICATED),
			{ state: { workerLicenceTypeCode: this.workerLicenceTypeCode, applicationTypeCode: ApplicationTypeCode.Update } }
		);
	}

	onCancel(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.pathPermitAuthenticated());
	}
}
