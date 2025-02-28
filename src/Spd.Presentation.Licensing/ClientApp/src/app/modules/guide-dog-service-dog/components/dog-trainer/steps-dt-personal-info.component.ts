import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode, ServiceTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { StepDtDogTrainerInfoComponent } from './step-dt-dog-trainer-info.component';
import { StepDtGovermentPhotoIdComponent } from './step-dt-goverment-photo-id.component';
import { StepDtMailingAddressComponent } from './step-dt-mailing-address.component';
import { StepDtPhotographOfYourselfRenewComponent } from './step-dt-photograph-of-yourself-renew.component';
import { StepDtPhotographOfYourselfComponent } from './step-dt-photograph-of-yourself.component';

@Component({
	selector: 'app-steps-dt-personal-info',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-dt-dog-trainer-info [applicationTypeCode]="applicationTypeCode"></app-step-dt-dog-trainer-info>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="false"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onFormValidNextStep(STEP_DOG_TRAINER_INFO)"
					(nextReviewStepperStep)="onNextReview(STEP_DOG_TRAINER_INFO)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-dt-mailing-address [applicationTypeCode]="applicationTypeCode"></app-step-dt-mailing-address>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="false"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_MAILING_ADDRESS)"
					(nextReviewStepperStep)="onNextReview(STEP_MAILING_ADDRESS)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="isNew">
				<app-step-dt-photograph-of-yourself></app-step-dt-photograph-of-yourself>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="false"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_PHOTO_OF_YOURSELF)"
					(nextReviewStepperStep)="onNextReview(STEP_PHOTO_OF_YOURSELF)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="!isNew">
				<app-step-dt-photograph-of-yourself-renew></app-step-dt-photograph-of-yourself-renew>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="false"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_PHOTO_OF_YOURSELF_RENEW)"
					(nextReviewStepperStep)="onNextReview(STEP_PHOTO_OF_YOURSELF_RENEW)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-dt-government-id></app-step-dt-government-id>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="false"
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
export class StepsDtPersonalInfoComponent extends BaseWizardStepComponent {
	readonly STEP_DOG_TRAINER_INFO = 0;
	readonly STEP_MAILING_ADDRESS = 1;
	readonly STEP_PHOTO_OF_YOURSELF = 2;
	readonly STEP_PHOTO_OF_YOURSELF_RENEW = 3;
	readonly STEP_GOV_ID = 4;

	@Input() isFormValid = false;
	@Input() serviceTypeCode!: ServiceTypeCode;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(StepDtDogTrainerInfoComponent) trainerComponent!: StepDtDogTrainerInfoComponent;
	@ViewChild(StepDtPhotographOfYourselfComponent) photoComponent!: StepDtPhotographOfYourselfComponent;
	@ViewChild(StepDtPhotographOfYourselfRenewComponent)
	photoRenewComponent!: StepDtPhotographOfYourselfRenewComponent;
	@ViewChild(StepDtGovermentPhotoIdComponent) govPhotoIdComponent!: StepDtGovermentPhotoIdComponent;
	@ViewChild(StepDtMailingAddressComponent) mailingAddressComponent!: StepDtMailingAddressComponent;

	constructor(utilService: UtilService) {
		super(utilService);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_DOG_TRAINER_INFO:
				return this.trainerComponent.isFormValid();
			case this.STEP_MAILING_ADDRESS:
				return this.mailingAddressComponent.isFormValid();
			case this.STEP_PHOTO_OF_YOURSELF:
				return this.photoComponent.isFormValid();
			case this.STEP_PHOTO_OF_YOURSELF_RENEW:
				return this.photoRenewComponent.isFormValid();
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
