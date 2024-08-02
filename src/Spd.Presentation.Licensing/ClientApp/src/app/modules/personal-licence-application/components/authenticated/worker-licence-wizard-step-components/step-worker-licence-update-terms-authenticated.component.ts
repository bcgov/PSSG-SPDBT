import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { StepWorkerLicenceTermsOfUseComponent } from '@app/modules/personal-licence-application/components/shared/worker-licence-wizard-step-components/step-worker-licence-terms-of-use.component';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routing.module';

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
			PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
				PersonalLicenceApplicationRoutes.WORKER_LICENCE_USER_PROFILE_AUTHENTICATED
			),
			{ state: { applicationTypeCode: ApplicationTypeCode.Update } }
		);
	}
}
