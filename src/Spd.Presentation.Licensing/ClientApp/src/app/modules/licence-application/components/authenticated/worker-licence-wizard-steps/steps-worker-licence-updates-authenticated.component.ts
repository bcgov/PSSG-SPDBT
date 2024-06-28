import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { StepWorkerLicencePhotographOfYourselfComponent } from '@app/modules/licence-application/components/shared/worker-licence-wizard-steps/step-worker-licence-photograph-of-yourself.component';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';
import { StepWorkerLicenceCategoryComponent } from '../../shared/worker-licence-wizard-steps/step-worker-licence-category.component';
import { StepWorkerLicenceDogsAuthorizationComponent } from '../../shared/worker-licence-wizard-steps/step-worker-licence-dogs-authorization.component';
import { StepWorkerLicenceReprintComponent } from '../../shared/worker-licence-wizard-steps/step-worker-licence-reprint.component';
import { StepWorkerLicenceRestraintsComponent } from '../../shared/worker-licence-wizard-steps/step-worker-licence-restraints.component';
import { StepWorkerLicenceReviewNameChangeComponent } from '../../shared/worker-licence-wizard-steps/step-worker-licence-review-name-change.component';

@Component({
	selector: 'app-steps-worker-licence-updates-authenticated',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step *ngIf="hasBcscNameChanged">
				<app-step-worker-licence-review-name-change></app-step-worker-licence-review-name-change>

				<app-wizard-footer
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onFormValidNextStep(STEP_NAME_CHANGE)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="hasGenderChanged">
				<app-step-worker-licence-photograph-of-yourself
					[applicationTypeCode]="applicationTypeCodes.Update"
				></app-step-worker-licence-photograph-of-yourself>

				<app-wizard-footer
					(previousStepperStep)="onStepUpdatePrevious(STEP_PHOTOGRAPH_OF_YOURSELF)"
					(nextStepperStep)="onFormValidNextStep(STEP_PHOTOGRAPH_OF_YOURSELF)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-worker-licence-category
					[applicationTypeCode]="applicationTypeCodes.Update"
				></app-step-worker-licence-category>

				<app-wizard-footer
					(previousStepperStep)="onStepUpdatePrevious(STEP_LICENCE_CATEGORY)"
					(nextStepperStep)="onFormValidCategoryNextStep()"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="showStepDogsAndRestraints">
				<app-step-worker-licence-restraints
					[applicationTypeCode]="applicationTypeCodes.Update"
				></app-step-worker-licence-restraints>

				<app-wizard-footer
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_RESTRAINTS)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="showStepDogsAndRestraints">
				<app-step-worker-licence-dogs-authorization
					[applicationTypeCode]="applicationTypeCodes.Update"
				></app-step-worker-licence-dogs-authorization>

				<app-wizard-footer
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidDogsNextStep()"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="showReprint">
				<app-step-worker-licence-reprint></app-step-worker-licence-reprint>

				<app-wizard-footer
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_REPRINT)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsWorkerLicenceUpdatesAuthenticatedComponent extends BaseWizardStepComponent {
	applicationTypeCodes = ApplicationTypeCode;

	readonly STEP_NAME_CHANGE = 0;
	readonly STEP_PHOTOGRAPH_OF_YOURSELF = 1;
	readonly STEP_LICENCE_CATEGORY = 2;
	readonly STEP_DOGS = 3;
	readonly STEP_RESTRAINTS = 4;
	readonly STEP_REPRINT = 5;

	@Input() showStepDogsAndRestraints = false;
	@Input() hasBcscNameChanged = false;
	@Input() hasGenderChanged = false;
	@Input() isUpdateFlowWithHideReprintStep!: boolean;

	@ViewChild(StepWorkerLicenceReviewNameChangeComponent)
	stepNameChangeComponent!: StepWorkerLicenceReviewNameChangeComponent;
	@ViewChild(StepWorkerLicencePhotographOfYourselfComponent)
	stepPhotographOfYourselfComponent!: StepWorkerLicencePhotographOfYourselfComponent;
	@ViewChild(StepWorkerLicenceCategoryComponent)
	stepLicenceCategoryComponent!: StepWorkerLicenceCategoryComponent;
	@ViewChild(StepWorkerLicenceRestraintsComponent)
	stepRestraintsComponent!: StepWorkerLicenceRestraintsComponent;
	@ViewChild(StepWorkerLicenceDogsAuthorizationComponent)
	stepDogsComponent!: StepWorkerLicenceDogsAuthorizationComponent;
	@ViewChild(StepWorkerLicenceReprintComponent)
	stepReprintComponent!: StepWorkerLicenceReprintComponent;

	constructor(override commonApplicationService: CommonApplicationService) {
		super(commonApplicationService);
	}

	onStepUpdatePrevious(step: number): void {
		switch (step) {
			case this.STEP_PHOTOGRAPH_OF_YOURSELF:
				if (this.hasBcscNameChanged) {
					this.childstepper.previous();
					return;
				}
				break;
			case this.STEP_LICENCE_CATEGORY:
				if (this.hasGenderChanged || this.hasBcscNameChanged) {
					this.childstepper.previous();
					return;
				}
				break;
			default:
				console.error('Unknown Form', step);
		}

		this.previousStepperStep.emit(true);
	}

	onFormValidCategoryNextStep(): void {
		if (this.showStepDogsAndRestraints || this.showReprint) {
			this.onFormValidNextStep(this.STEP_LICENCE_CATEGORY);
		} else {
			this.onStepNext(this.STEP_LICENCE_CATEGORY);
		}
	}

	onFormValidDogsNextStep(): void {
		if (this.showReprint) {
			this.onFormValidNextStep(this.STEP_DOGS);
		} else {
			this.onStepNext(this.STEP_DOGS);
		}
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_NAME_CHANGE:
				return this.stepNameChangeComponent.isFormValid();
			case this.STEP_REPRINT:
				return this.stepReprintComponent.isFormValid();
			case this.STEP_PHOTOGRAPH_OF_YOURSELF:
				return this.stepPhotographOfYourselfComponent.isFormValid();
			case this.STEP_LICENCE_CATEGORY:
				return this.stepLicenceCategoryComponent.isFormValid();
			case this.STEP_RESTRAINTS:
				return this.stepRestraintsComponent.isFormValid();
			case this.STEP_DOGS:
				return this.stepDogsComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	// for Update flow: only show if they changed their sex selection earlier in the application
	// and name change
	get showReprint(): boolean {
		return this.hasGenderChanged || this.hasBcscNameChanged || !this.isUpdateFlowWithHideReprintStep;
	}
}
