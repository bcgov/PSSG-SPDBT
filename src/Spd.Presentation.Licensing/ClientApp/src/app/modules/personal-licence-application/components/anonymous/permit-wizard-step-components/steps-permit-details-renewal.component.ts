import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { ApplicationService } from '@app/core/services/application.service';
import { StepPermitTermsOfUseComponent } from './step-permit-terms-of-use.component';

@Component({
	selector: 'app-steps-permit-details-renewal',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step *ngIf="showTermsOfUse">
				<app-step-permit-terms-of-use [applicationTypeCode]="applicationTypeCode"></app-step-permit-terms-of-use>

				<app-wizard-footer (nextStepperStep)="onFormValidNextStep(STEP_TERMS)"></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-permit-checklist-renewal></app-step-permit-checklist-renewal>

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
				<app-step-permit-confirmation [workerLicenceTypeCode]="workerLicenceTypeCode"></app-step-permit-confirmation>

				<app-wizard-footer
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_PERMIT_CONFIRMATION)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsPermitDetailsRenewalComponent extends BaseWizardStepComponent {
	readonly STEP_TERMS = 0;
	readonly STEP_PERMIT_CONFIRMATION = 1;

	@Input() isLoggedIn = false;
	@Input() workerLicenceTypeCode!: WorkerLicenceTypeCode;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(StepPermitTermsOfUseComponent) termsOfUseComponent!: StepPermitTermsOfUseComponent;

	constructor(override commonApplicationService: ApplicationService) {
		super(commonApplicationService);
	}

	onGotoUserProfile(): void {
		this.commonApplicationService.onGotoPermitUserProfile(this.workerLicenceTypeCode, this.applicationTypeCode);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_TERMS:
				return this.termsOfUseComponent.isFormValid();
			case this.STEP_PERMIT_CONFIRMATION:
				return true;
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
