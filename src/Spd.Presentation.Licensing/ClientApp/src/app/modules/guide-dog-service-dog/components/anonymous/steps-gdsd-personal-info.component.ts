import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { StepGdsdGovermentPhotoIdComponent } from '../shared/common-step-components/step-gdsd-goverment-photo-id.component';
import { StepGdsdMedicalInformationComponent } from '../shared/common-step-components/step-gdsd-medical-information.component';
import { StepGdsdPhotographOfYourselfComponent } from '../shared/common-step-components/step-gdsd-photograph-of-yourself.component';
import { StepGdsdMailingAddressComponent } from './step-components/step-gdsd-mailing-address.component';
import { StepGdsdPersonalInformationAnonymousComponent } from './step-components/step-gdsd-personal-information-anonymous.component';

@Component({
	selector: 'app-steps-gdsd-personal-info',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-gdsd-personal-information-anonymous></app-step-gdsd-personal-information-anonymous>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_PERSONAL_INFO)"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onFormValidNextStep(STEP_PERSONAL_INFO)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-gdsd-mailing-address></app-step-gdsd-mailing-address>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_MAILING_ADDRESS)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_MAILING_ADDRESS)"
					(nextReviewStepperStep)="onNextReview(STEP_MAILING_ADDRESS)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="!isTrainedByAccreditedSchools">
				<app-step-gdsd-medical-information></app-step-gdsd-medical-information>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_MEDICAL)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_MEDICAL)"
					(nextReviewStepperStep)="onNextReview(STEP_MEDICAL)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-gdsd-photograph-of-yourself></app-step-gdsd-photograph-of-yourself>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_PHOTO_OF_YOURSELF)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_PHOTO_OF_YOURSELF)"
					(nextReviewStepperStep)="onNextReview(STEP_PHOTO_OF_YOURSELF)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-gdsd-government-id></app-step-gdsd-government-id>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_GOV_ID)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_GOV_ID)"
					(nextReviewStepperStep)="onNextReview(STEP_GOV_ID)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsGdsdPersonalInfoComponent extends BaseWizardStepComponent {
	readonly STEP_PERSONAL_INFO = 0;
	readonly STEP_MAILING_ADDRESS = 1;
	readonly STEP_MEDICAL = 2;
	readonly STEP_PHOTO_OF_YOURSELF = 3;
	readonly STEP_GOV_ID = 4;

	@Input() isLoggedIn = false;
	@Input() showSaveAndExit = false;
	@Input() isFormValid = false;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;
	@Input() isTrainedByAccreditedSchools!: boolean;

	@ViewChild(StepGdsdPersonalInformationAnonymousComponent)
	personComponent!: StepGdsdPersonalInformationAnonymousComponent;
	@ViewChild(StepGdsdPhotographOfYourselfComponent) photoComponent!: StepGdsdPhotographOfYourselfComponent;
	@ViewChild(StepGdsdGovermentPhotoIdComponent) govPhotoIdComponent!: StepGdsdGovermentPhotoIdComponent;
	@ViewChild(StepGdsdMailingAddressComponent) mailingAddressComponent!: StepGdsdMailingAddressComponent;
	@ViewChild(StepGdsdMedicalInformationComponent) medicalComponent!: StepGdsdMedicalInformationComponent;

	constructor() {
		super();
	}

	override dirtyForm(_step: number): boolean {
		// switch (step) {
		// 	case this.STEP_PERSONAL_INFO:
		// 		return this.personComponent.isFormValid();
		// 	case this.STEP_MAILING_ADDRESS:
		// 		return this.mailingAddressComponent.isFormValid();
		// 	case this.STEP_MEDICAL:
		// 		return this.medicalComponent.isFormValid();
		// 	case this.STEP_PHOTO_OF_YOURSELF:
		// 		return this.photoComponent.isFormValid();
		// 	case this.STEP_GOV_ID:
		// 		return this.govPhotoIdComponent.isFormValid();
		// 	default:
		// 		console.error('Unknown Form', step);
		// }
		// return false;
		return true;
	}
}
