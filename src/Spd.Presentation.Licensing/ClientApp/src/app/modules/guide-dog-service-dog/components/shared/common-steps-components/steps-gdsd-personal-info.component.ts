import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { StepGdsdPersonalInfoAnonymousComponent } from '../../anonymous/step-gdsd-personal-info-anonymous.component';
import { StepGdsdPersonalInfoComponent } from '../../authenticated/step-gdsd-personal-info.component';
import { StepGdsdGovermentPhotoIdComponent } from '../common-step-components/step-gdsd-goverment-photo-id.component';
import { StepGdsdMailingAddressComponent } from '../common-step-components/step-gdsd-mailing-address.component';
import { StepGdsdMedicalInformationComponent } from '../common-step-components/step-gdsd-medical-information.component';
import { StepGdsdPhotographOfYourselfComponent } from '../common-step-components/step-gdsd-photograph-of-yourself.component';

@Component({
	selector: 'app-steps-gdsd-personal-info',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<ng-container *ngIf="isLoggedIn; else notLoggedIn">
					<app-step-gdsd-personal-info [applicationTypeCode]="applicationTypeCode"></app-step-gdsd-personal-info>
				</ng-container>
				<ng-template #notLoggedIn>
					<app-step-gdsd-personal-info-anonymous
						[applicationTypeCode]="applicationTypeCode"
					></app-step-gdsd-personal-info-anonymous>
				</ng-template>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_PERSONAL_INFO)"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onFormValidNextStep(STEP_PERSONAL_INFO)"
					(nextReviewStepperStep)="onNextReview(STEP_PERSONAL_INFO)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-gdsd-mailing-address
					[isLoggedIn]="isLoggedIn"
					[applicationTypeCode]="applicationTypeCode"
				></app-step-gdsd-mailing-address>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_MAILING_ADDRESS)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_MAILING_ADDRESS)"
					(nextReviewStepperStep)="onNextReview(STEP_MAILING_ADDRESS)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="isNew && !isTrainedByAccreditedSchools">
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
	@Input() applicationTypeCode!: ApplicationTypeCode;
	@Input() isTrainedByAccreditedSchools!: boolean;

	@ViewChild(StepGdsdPersonalInfoAnonymousComponent) personAnonymous!: StepGdsdPersonalInfoAnonymousComponent;
	@ViewChild(StepGdsdPersonalInfoComponent) personAuth!: StepGdsdPersonalInfoComponent;
	@ViewChild(StepGdsdPhotographOfYourselfComponent) photoComponent!: StepGdsdPhotographOfYourselfComponent;
	@ViewChild(StepGdsdGovermentPhotoIdComponent) govPhotoIdComponent!: StepGdsdGovermentPhotoIdComponent;
	@ViewChild(StepGdsdMailingAddressComponent) mailingAddressComponent!: StepGdsdMailingAddressComponent;
	@ViewChild(StepGdsdMedicalInformationComponent) medicalComponent!: StepGdsdMedicalInformationComponent;

	constructor(utilService: UtilService) {
		super(utilService);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_PERSONAL_INFO:
				if (this.isLoggedIn) return this.personAuth.isFormValid();
				return this.personAnonymous.isFormValid();
			case this.STEP_MAILING_ADDRESS:
				return this.mailingAddressComponent.isFormValid();
			case this.STEP_MEDICAL:
				return this.medicalComponent.isFormValid();
			case this.STEP_PHOTO_OF_YOURSELF:
				return this.photoComponent.isFormValid();
			case this.STEP_GOV_ID:
				return this.govPhotoIdComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}
}
