import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { StepWorkerLicenceTermsOfUseComponent } from '../../shared/worker-licence-wizard-steps/step-worker-licence-terms-of-use.component';

@Component({
	selector: 'app-step-worker-licence-update-terms-authenticated',
	template: `
		<app-step-worker-licence-terms-of-use
			[applicationTypeCode]="applicationTypeCodeUpdate"
		></app-step-worker-licence-terms-of-use>

		<app-wizard-footer (nextStepperStep)="onFormValidNextStep()"></app-wizard-footer>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepWorkerLicenceUpdateTermsAuthenticatedComponent {
	applicationTypeCodeUpdate = ApplicationTypeCode.Update;

	@ViewChild(StepWorkerLicenceTermsOfUseComponent)
	termsOfUseComponent!: StepWorkerLicenceTermsOfUseComponent;

	constructor(private router: Router) {}

	onFormValidNextStep(): void {
		const isValid = this.termsOfUseComponent.isFormValid();
		if (!isValid) return;

		this.router.navigateByUrl(
			LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
				LicenceApplicationRoutes.WORKER_LICENCE_USER_PROFILE_AUTHENTICATED
			),
			{ state: { applicationTypeCode: ApplicationTypeCode.Update } }
		);
	}
}
