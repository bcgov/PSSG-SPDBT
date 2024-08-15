import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { ApplicationService } from '@app/core/services/application.service';

@Component({
	selector: 'app-steps-controlling-members-personal-information',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<!-- <ng-container *ngIf="isNew"> -->
				<app-step-controlling-members-checklist-new></app-step-controlling-members-checklist-new>
				<!-- </ng-container>

				<ng-container *ngIf="isRenewal">
					<app-step-controlling-members-checklist-renewal></app-step-controlling-members-checklist-renewal>
				</ng-container> 
					(previousStepperStep)="onGoToPreviousStep()"
					(previousStepperStep)="onGotoBusinessProfile()"-->

				<app-wizard-footer (nextStepperStep)="onGoToNextStep()"></app-wizard-footer>
			</mat-step>

			<mat-step>
				Confirm your personal information

				<app-wizard-footer
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_LICENCE_CONFIRMATION)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-controlling-members-aliases
					[applicationTypeCode]="applicationTypeCode"
				></app-step-controlling-members-aliases>

				<app-wizard-footer
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_LICENCE_CONFIRMATION)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-controlling-members-residential-address
					[applicationTypeCode]="applicationTypeCode"
				></app-step-controlling-members-residential-address>

				<app-wizard-footer
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_LICENCE_CONFIRMATION)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsControllingMembersPersonalInformationComponent extends BaseWizardStepComponent {
	readonly STEP_LICENCE_CONFIRMATION = 1;
	readonly STEP_LICENCE_EXPIRED = 2;
	readonly STEP_LICENCE_BRANDING = 3;
	readonly STEP_LICENCE_LIABILITY = 4;

	@Input() isFormValid!: boolean;
	@Input() showSaveAndExit!: boolean;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	// @ViewChild(StepBusinessLicenceExpiredComponent) stepExpiredComponent!: StepBusinessLicenceExpiredComponent;
	// @ViewChild(StepBusinessLicenceCompanyBrandingComponent)
	// stepCompanyBrandingComponent!: StepBusinessLicenceCompanyBrandingComponent;
	// @ViewChild(StepBusinessLicenceLiabilityComponent) stepLiabilityComponent!: StepBusinessLicenceLiabilityComponent;

	constructor(override commonApplicationService: ApplicationService) {
		super(commonApplicationService);
	}

	override dirtyForm(_step: number): boolean {
		// 	switch (step) {
		// 		case this.STEP_LICENCE_CONFIRMATION:
		// 			return true;
		// 		case this.STEP_LICENCE_EXPIRED:
		// 			return this.stepExpiredComponent.isFormValid();
		// 		case this.STEP_LICENCE_BRANDING:
		// 			return this.stepCompanyBrandingComponent.isFormValid();
		// 		case this.STEP_LICENCE_LIABILITY:
		// 			return this.stepLiabilityComponent.isFormValid();
		// 		default:
		// 			console.error('Unknown Form', step);
		// 	}
		// 	return false;
		return true;
	}
}
