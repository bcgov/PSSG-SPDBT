import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';
import { BaseWizardStepComponent } from 'src/app/core/components/base-wizard-step.component';
import { StepPermitExpiredComponent } from './step-permit-expired.component';
import { StepPermitTermsOfUseComponent } from './step-permit-terms-of-use.component';

@Component({
	selector: 'app-steps-permit-details-new',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step *ngIf="showTermsOfUse">
				<app-step-permit-terms-of-use [applicationTypeCode]="applicationTypeCode"></app-step-permit-terms-of-use>

				<app-wizard-footer (nextStepperStep)="onFormValidNextStep(STEP_TERMS)"></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-permit-checklist-new></app-step-permit-checklist-new>

				<ng-container *ngIf="showTermsOfUse; else isLoggedInChecklistSteps">
					<app-wizard-footer
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onGoToNextStep()"
					></app-wizard-footer>
				</ng-container>
				<ng-template #isLoggedInChecklistSteps>
					<app-wizard-footer
						(previousStepperStep)="onGotoUserProfile()"
						(nextStepperStep)="onGoToNextStep()"
					></app-wizard-footer>
				</ng-template>
			</mat-step>

			<mat-step>
				<app-step-permit-expired [isLoggedIn]="isLoggedIn"></app-step-permit-expired>

				<app-wizard-footer
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_PERMIT_EXPIRED)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsPermitDetailsNewComponent extends BaseWizardStepComponent {
	readonly STEP_TERMS = 1;
	readonly STEP_PERMIT_EXPIRED = 2;

	@Input() isLoggedIn = false;
	@Input() workerLicenceTypeCode!: WorkerLicenceTypeCode;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(StepPermitTermsOfUseComponent) termsOfUseComponent!: StepPermitTermsOfUseComponent;
	@ViewChild(StepPermitExpiredComponent) permitExpiredComponent!: StepPermitExpiredComponent;

	constructor(override commonApplicationService: CommonApplicationService, private router: Router) {
		super(commonApplicationService);
	}

	onGotoUserProfile(): void {
		this.router.navigateByUrl(
			LicenceApplicationRoutes.pathPermitAuthenticated(LicenceApplicationRoutes.PERMIT_USER_PROFILE_AUTHENTICATED),
			{ state: { workerLicenceTypeCode: this.workerLicenceTypeCode, applicationTypeCode: this.applicationTypeCode } }
		);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_TERMS:
				return this.termsOfUseComponent.isFormValid();
			case this.STEP_PERMIT_EXPIRED:
				return this.permitExpiredComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	get showTermsOfUse(): boolean {
		// anonymous: agree everytime for all
		return !this.isLoggedIn;
	}
}
