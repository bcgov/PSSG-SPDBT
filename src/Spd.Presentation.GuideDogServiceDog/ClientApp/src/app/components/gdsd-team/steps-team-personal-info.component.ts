import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { StepTeamAccreditedSchoolIdCardComponent } from './step-team-accredited-school-id-card.component';
import { StepTeamGovermentPhotoIdComponent } from './step-team-goverment-photo-id.component';
import { StepTeamMailingAddressComponent } from './step-team-mailing-address.component';
import { StepTeamMedicalInfoComponent } from './step-team-medical-info.component';
import { StepTeamPersonalInfoAnonymousComponent } from './step-team-personal-info-anonymous.component';
import { StepTeamPersonalInfoComponent } from './step-team-personal-info.component';
import { StepTeamPhotographOfYourselfRenewComponent } from './step-team-photograph-of-yourself-renew.component';
import { StepTeamPhotographOfYourselfComponent } from './step-team-photograph-of-yourself.component';

@Component({
	selector: 'app-steps-team-personal-info',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<ng-container *ngIf="isLoggedIn; else notLoggedIn">
					<app-step-team-personal-info [applicationTypeCode]="applicationTypeCode"></app-step-team-personal-info>
				</ng-container>
				<ng-template #notLoggedIn>
					<app-step-team-personal-info-anonymous
						[applicationTypeCode]="applicationTypeCode"
					></app-step-team-personal-info-anonymous>
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
				<app-step-team-mailing-address
					[isLoggedIn]="isLoggedIn"
					[applicationTypeCode]="applicationTypeCode"
				></app-step-team-mailing-address>

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
				<app-step-team-medical-info></app-step-team-medical-info>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_MEDICAL)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_MEDICAL)"
					(nextReviewStepperStep)="onNextReview(STEP_MEDICAL)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="isNew">
				<app-step-team-photograph-of-yourself></app-step-team-photograph-of-yourself>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_PHOTO_OF_YOURSELF)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_PHOTO_OF_YOURSELF)"
					(nextReviewStepperStep)="onNextReview(STEP_PHOTO_OF_YOURSELF)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="!isNew">
				<app-step-team-photograph-of-yourself-renew></app-step-team-photograph-of-yourself-renew>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_PHOTO_OF_YOURSELF_RENEW)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_PHOTO_OF_YOURSELF_RENEW)"
					(nextReviewStepperStep)="onNextReview(STEP_PHOTO_OF_YOURSELF_RENEW)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="!isNew && isTrainedByAccreditedSchools">
				<app-step-team-accredited-school-id-card></app-step-team-accredited-school-id-card>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_ACCREDITED_SCHOOL_ID_CARD)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_ACCREDITED_SCHOOL_ID_CARD)"
					(nextReviewStepperStep)="onNextReview(STEP_ACCREDITED_SCHOOL_ID_CARD)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-team-government-id></app-step-team-government-id>

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
export class StepsTeamPersonalInfoComponent extends BaseWizardStepComponent {
	readonly STEP_PERSONAL_INFO = 0;
	readonly STEP_MAILING_ADDRESS = 1;
	readonly STEP_MEDICAL = 2;
	readonly STEP_PHOTO_OF_YOURSELF = 3;
	readonly STEP_PHOTO_OF_YOURSELF_RENEW = 4;
	readonly STEP_ACCREDITED_SCHOOL_ID_CARD = 5;
	readonly STEP_GOV_ID = 6;

	@Input() isLoggedIn = false;
	@Input() showSaveAndExit = false;
	@Input() isFormValid = false;
	@Input() applicationTypeCode!: ApplicationTypeCode;
	@Input() isTrainedByAccreditedSchools!: boolean;

	@ViewChild(StepTeamPersonalInfoAnonymousComponent) personAnonymous!: StepTeamPersonalInfoAnonymousComponent;
	@ViewChild(StepTeamPersonalInfoComponent) personAuth!: StepTeamPersonalInfoComponent;
	@ViewChild(StepTeamPhotographOfYourselfComponent) photoComponent!: StepTeamPhotographOfYourselfComponent;
	@ViewChild(StepTeamPhotographOfYourselfRenewComponent)
	photoRenewComponent!: StepTeamPhotographOfYourselfRenewComponent;
	@ViewChild(StepTeamGovermentPhotoIdComponent) govPhotoIdComponent!: StepTeamGovermentPhotoIdComponent;
	@ViewChild(StepTeamMailingAddressComponent) mailingAddressComponent!: StepTeamMailingAddressComponent;
	@ViewChild(StepTeamMedicalInfoComponent) medicalComponent!: StepTeamMedicalInfoComponent;
	@ViewChild(StepTeamAccreditedSchoolIdCardComponent) schoolIdCardComponent!: StepTeamAccreditedSchoolIdCardComponent;

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
			case this.STEP_PHOTO_OF_YOURSELF_RENEW:
				return this.photoRenewComponent.isFormValid();
			case this.STEP_ACCREDITED_SCHOOL_ID_CARD:
				return this.schoolIdCardComponent.isFormValid();
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
