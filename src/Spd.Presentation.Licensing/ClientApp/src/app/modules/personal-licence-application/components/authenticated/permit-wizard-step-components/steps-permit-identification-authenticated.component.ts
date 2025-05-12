import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode, ServiceTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { PermitApplicationService } from '@app/core/services/permit-application.service';
import { UtilService } from '@app/core/services/util.service';
import { StepPermitBcDriverLicenceComponent } from '@app/modules/personal-licence-application/components/anonymous/permit-wizard-step-components/step-permit-bc-driver-licence.component';
import { StepPermitCitizenshipComponent } from '@app/modules/personal-licence-application/components/anonymous/permit-wizard-step-components/step-permit-citizenship.component';
import { StepPermitCriminalHistoryComponent } from '../../anonymous/permit-wizard-step-components/step-permit-criminal-history.component';
import { StepPermitPhotographOfYourselfComponent } from './step-permit-photograph-of-yourself.component';

@Component({
	selector: 'app-steps-permit-identification-authenticated',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-permit-criminal-history
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-criminal-history>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onFormValidNextStep(STEP_CRIMINAL_HISTORY)"
					(nextReviewStepperStep)="onNextReview(STEP_CRIMINAL_HISTORY)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-permit-citizenship [applicationTypeCode]="applicationTypeCode"></app-step-permit-citizenship>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_CITIZENSHIP)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_CITIZENSHIP)"
					(nextReviewStepperStep)="onNextReview(STEP_CITIZENSHIP)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-permit-bc-driver-licence
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-bc-driver-licence>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_BC_DRIVERS_LICENCE)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_BC_DRIVERS_LICENCE)"
					(nextReviewStepperStep)="onNextReview(STEP_BC_DRIVERS_LICENCE)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-permit-photograph-of-yourself
					[applicationTypeCode]="applicationTypeCode"
					[serviceTypeCode]="serviceTypeCode"
				></app-step-permit-photograph-of-yourself>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_PHOTOGRAPH_OF_YOURSELF)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_PHOTOGRAPH_OF_YOURSELF)"
					(nextReviewStepperStep)="onNextReview(STEP_PHOTOGRAPH_OF_YOURSELF)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsPermitIdentificationAuthenticatedComponent extends BaseWizardStepComponent {
	readonly STEP_CRIMINAL_HISTORY = 0;
	readonly STEP_CITIZENSHIP = 1;
	readonly STEP_BC_DRIVERS_LICENCE = 2;
	readonly STEP_PHOTOGRAPH_OF_YOURSELF = 3;

	@Input() applicationTypeCode!: ApplicationTypeCode;
	@Input() serviceTypeCode!: ServiceTypeCode;
	@Input() isFormValid = false;
	@Input() showSaveAndExit = false;

	@ViewChild(StepPermitCriminalHistoryComponent) criminalHistoryComponen!: StepPermitCriminalHistoryComponent;
	@ViewChild(StepPermitCitizenshipComponent) stepCitizenshipComponent!: StepPermitCitizenshipComponent;
	@ViewChild(StepPermitBcDriverLicenceComponent)
	stepDriverLicenceComponent!: StepPermitBcDriverLicenceComponent;
	@ViewChild(StepPermitPhotographOfYourselfComponent)
	stepPhotographComponent!: StepPermitPhotographOfYourselfComponent;

	constructor(
		utilService: UtilService,
		private permitApplicationService: PermitApplicationService
	) {
		super(utilService);
	}

	override onFormValidNextStep(_formNumber: number): void {
		const isValid = this.dirtyForm(_formNumber);
		if (!isValid) {
			this.utilService.scrollToErrorSection();
			return;
		}

		this.childNextStep.next(true);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_CRIMINAL_HISTORY:
				return this.criminalHistoryComponen.isFormValid();
			case this.STEP_CITIZENSHIP:
				return this.stepCitizenshipComponent.isFormValid();
			case this.STEP_BC_DRIVERS_LICENCE:
				return this.stepDriverLicenceComponent.isFormValid();
			case this.STEP_PHOTOGRAPH_OF_YOURSELF:
				return this.stepPhotographComponent.isFormValid();
		}
		return false;
	}
}
