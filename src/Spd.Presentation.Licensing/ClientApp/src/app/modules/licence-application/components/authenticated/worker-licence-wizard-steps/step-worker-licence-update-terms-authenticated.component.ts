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

		<div class="row outside-wizard-button-row">
			<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
				<button mat-stroked-button color="primary" class="large mb-2" (click)="onCancel()">Cancel</button>
			</div>
			<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
				<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep()">Next</button>
			</div>
		</div>
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

	onCancel(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated());
	}
}
