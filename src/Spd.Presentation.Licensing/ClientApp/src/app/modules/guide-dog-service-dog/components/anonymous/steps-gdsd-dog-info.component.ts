import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { StepGdsdDogInformationComponent } from '../shared/common-step-components/step-gdsd-dog-information.component';
import { StepGdsdDogMedicalComponent } from '../shared/common-step-components/step-gdsd-dog-medical.component';

@Component({
	selector: 'app-steps-gdsd-dog-info',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-gdsd-dog-information></app-step-gdsd-dog-information>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_DOG_INFO)"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onStepNextDogInfo()"
					(nextReviewStepperStep)="onNextReview(STEP_DOG_INFO)"
				></app-wizard-footer>
			</mat-step>

			<ng-container *ngIf="!isTrainedByAccreditedSchools">
				<mat-step>
					<app-step-gdsd-dog-medical></app-step-gdsd-dog-medical>

					<app-wizard-footer
						[isFormValid]="isFormValid"
						[showSaveAndExit]="showSaveAndExit"
						(saveAndExit)="onSaveAndExit(STEP_DOG_MEDICAL)"
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onStepNext(STEP_DOG_MEDICAL)"
						(nextReviewStepperStep)="onNextReview(STEP_DOG_MEDICAL)"
					></app-wizard-footer>
				</mat-step>
			</ng-container>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsGdsdDogInfoComponent extends BaseWizardStepComponent {
	readonly STEP_DOG_INFO = 0;
	readonly STEP_DOG_MEDICAL = 1;

	@Input() isLoggedIn = false;
	@Input() showSaveAndExit = false;
	@Input() isFormValid = false;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;
	@Input() isTrainedByAccreditedSchools!: boolean;

	@ViewChild(StepGdsdDogInformationComponent) dogInfoComponent!: StepGdsdDogInformationComponent;
	@ViewChild(StepGdsdDogMedicalComponent) dogMedicalComponent!: StepGdsdDogMedicalComponent;

	constructor() {
		super();
	}

	onStepNextDogInfo(): void {
		const isValid = this.dirtyForm(this.STEP_DOG_INFO);
		if (!isValid) return;

		if (this.isTrainedByAccreditedSchools) {
			this.nextStepperStep.emit(true);
			return;
		}

		this.childNextStep.emit(true);
	}

	override dirtyForm(_step: number): boolean {
		// switch (step) {
		// 	case this.STEP_DOG_INFO:
		// 		return this.dogInfoComponent.isFormValid();
		// 	case this.STEP_DOG_MEDICAL:
		// 		return this.dogMedicalComponent.isFormValid();
		// 	default:
		// 		console.error('Unknown Form', step);
		// }
		// return false;
		return true;
	}
}
