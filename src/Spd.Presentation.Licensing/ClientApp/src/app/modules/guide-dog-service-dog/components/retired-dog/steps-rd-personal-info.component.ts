import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { StepRdMailingAddressComponent } from './step-rd-mailing-address.component';
import { StepRdPersonalInfoAnonymousComponent } from './step-rd-personal-info-anonymous.component';
import { StepRdPersonalInfoComponent } from './step-rd-personal-info.component';
import { StepRdPhotographOfYourselfRenewComponent } from './step-rd-photograph-of-yourself-renew.component';
import { StepRdPhotographOfYourselfComponent } from './step-rd-photograph-of-yourself.component';

@Component({
	selector: 'app-steps-rd-personal-info',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<ng-container *ngIf="isLoggedIn; else notLoggedIn">
					<app-step-rd-personal-info [applicationTypeCode]="applicationTypeCode"></app-step-rd-personal-info>
				</ng-container>
				<ng-template #notLoggedIn>
					<app-step-rd-personal-info-anonymous
						[applicationTypeCode]="applicationTypeCode"
					></app-step-rd-personal-info-anonymous>
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
				<app-step-rd-mailing-address
					[isLoggedIn]="isLoggedIn"
					[applicationTypeCode]="applicationTypeCode"
				></app-step-rd-mailing-address>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_MAILING_ADDRESS)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_MAILING_ADDRESS)"
					(nextReviewStepperStep)="onNextReview(STEP_MAILING_ADDRESS)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="isNew">
				<app-step-rd-photograph-of-yourself></app-step-rd-photograph-of-yourself>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_PHOTO_OF_YOURSELF)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_PHOTO_OF_YOURSELF)"
					(nextReviewStepperStep)="onNextReview(STEP_PHOTO_OF_YOURSELF)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="!isNew">
				<app-step-rd-photograph-of-yourself-renew></app-step-rd-photograph-of-yourself-renew>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_PHOTO_OF_YOURSELF_RENEW)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_PHOTO_OF_YOURSELF_RENEW)"
					(nextReviewStepperStep)="onNextReview(STEP_PHOTO_OF_YOURSELF_RENEW)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsRdPersonalInfoComponent extends BaseWizardStepComponent {
	readonly STEP_PERSONAL_INFO = 0;
	readonly STEP_MAILING_ADDRESS = 1;
	readonly STEP_PHOTO_OF_YOURSELF = 2;
	readonly STEP_PHOTO_OF_YOURSELF_RENEW = 3;

	@Input() isLoggedIn = false;
	@Input() showSaveAndExit = false;
	@Input() isFormValid = false;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(StepRdPersonalInfoAnonymousComponent) personAnonymous!: StepRdPersonalInfoAnonymousComponent;
	@ViewChild(StepRdPersonalInfoComponent) personAuth!: StepRdPersonalInfoComponent;
	@ViewChild(StepRdPhotographOfYourselfComponent) photoComponent!: StepRdPhotographOfYourselfComponent;
	@ViewChild(StepRdPhotographOfYourselfRenewComponent)
	photoRenewComponent!: StepRdPhotographOfYourselfRenewComponent;
	@ViewChild(StepRdMailingAddressComponent) mailingAddressComponent!: StepRdMailingAddressComponent;

	constructor(utilService: UtilService) {
		super(utilService);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_PERSONAL_INFO:
				console.log(this.isLoggedIn, this.personAnonymous.isFormValid());
				return this.personAnonymous.isFormValid();
			case this.STEP_MAILING_ADDRESS:
				return this.mailingAddressComponent.isFormValid();
			case this.STEP_PHOTO_OF_YOURSELF:
				return this.photoComponent.isFormValid();
			case this.STEP_PHOTO_OF_YOURSELF_RENEW:
				return this.photoRenewComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}
}
