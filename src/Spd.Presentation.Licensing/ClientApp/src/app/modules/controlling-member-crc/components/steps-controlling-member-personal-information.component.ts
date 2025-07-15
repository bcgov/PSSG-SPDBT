import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { StepControllingMemberAliasesComponent } from './step-controlling-member-aliases.component';
import { StepControllingMemberPersonalInfoComponent } from './step-controlling-member-personal-info.component';
import { StepControllingMemberResidentialAddressComponent } from './step-controlling-member-residential-address.component';
import { StepControllingMemberTermsComponent } from './step-controlling-member-terms.component';

@Component({
	selector: 'app-steps-controlling-member-personal-information',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
		  <mat-step>
		    <app-step-controlling-member-terms
		      [applicationTypeCode]="applicationTypeCode"
		    ></app-step-controlling-member-terms>
		
		    <app-wizard-footer
		      (nextStepperStep)="onFormValidNextStep(STEP_TERMS)"
		      (cancelAndExit)="onCancelAndExit()"
		    ></app-wizard-footer>
		  </mat-step>
		
		  <mat-step>
		    @if (isNew) {
		      <app-step-controlling-member-checklist-new></app-step-controlling-member-checklist-new>
		    } @else {
		      <app-step-controlling-member-checklist-update></app-step-controlling-member-checklist-update>
		    }
		
		    <app-wizard-footer
		      [showSaveAndExit]="showSaveAndExit"
		      (saveAndExit)="onSaveAndExit(STEP_CHECKLIST)"
		      (cancelAndExit)="onCancelAndExit()"
		      (previousStepperStep)="onGoToPreviousStep()"
		      (nextStepperStep)="onGoToNextStep()"
		    ></app-wizard-footer>
		  </mat-step>
		
		  <mat-step>
		    <app-step-controlling-member-personal-info
		      [isLoggedIn]="isLoggedIn"
		      [applicationTypeCode]="applicationTypeCode"
		    ></app-step-controlling-member-personal-info>
		
		    <app-wizard-footer
		      [isFormValid]="isFormValid"
		      [showSaveAndExit]="showSaveAndExit"
		      (saveAndExit)="onSaveAndExit(STEP_PERSONAL_INFO)"
		      (cancelAndExit)="onCancelAndExit()"
		      (previousStepperStep)="onGoToPreviousStep()"
		      (nextStepperStep)="onFormValidNextStep(STEP_PERSONAL_INFO)"
		      (nextReviewStepperStep)="onNextReview(STEP_PERSONAL_INFO)"
		    ></app-wizard-footer>
		  </mat-step>
		
		  @if (isNew) {
		    <mat-step>
		      <app-step-controlling-member-aliases></app-step-controlling-member-aliases>
		      <app-wizard-footer
		        [isFormValid]="isFormValid"
		        [showSaveAndExit]="showSaveAndExit"
		        (saveAndExit)="onSaveAndExit(STEP_ALIASES)"
		        (cancelAndExit)="onCancelAndExit()"
		        (previousStepperStep)="onGoToPreviousStep()"
		        (nextStepperStep)="onFormValidNextStep(STEP_ALIASES)"
		        (nextReviewStepperStep)="onNextReview(STEP_ALIASES)"
		      ></app-wizard-footer>
		    </mat-step>
		  }
		
		  <mat-step>
		    <app-step-controlling-member-residential-address
		      [isLoggedIn]="isLoggedIn"
		      [applicationTypeCode]="applicationTypeCode"
		    ></app-step-controlling-member-residential-address>
		
		    <app-wizard-footer
		      [isFormValid]="isFormValid"
		      [showSaveAndExit]="showSaveAndExit"
		      (saveAndExit)="onSaveAndExit(STEP_RESIDENTIAL_ADDRESS)"
		      (cancelAndExit)="onCancelAndExit()"
		      (previousStepperStep)="onGoToPreviousStep()"
		      (nextStepperStep)="onStepNext(STEP_RESIDENTIAL_ADDRESS)"
		      (nextReviewStepperStep)="onNextReview(STEP_RESIDENTIAL_ADDRESS)"
		    ></app-wizard-footer>
		  </mat-step>
		</mat-stepper>
		`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsControllingMemberPersonalInformationComponent extends BaseWizardStepComponent {
	readonly STEP_TERMS = 0;
	readonly STEP_CHECKLIST = 1;
	readonly STEP_PERSONAL_INFO = 2;
	readonly STEP_ALIASES = 3;
	readonly STEP_RESIDENTIAL_ADDRESS = 4;

	@Input() isFormValid!: boolean;
	@Input() isLoggedIn!: boolean;
	@Input() showSaveAndExit!: boolean;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(StepControllingMemberTermsComponent) termsOfUseComponent!: StepControllingMemberTermsComponent;
	@ViewChild(StepControllingMemberPersonalInfoComponent) stepPersonalInfo!: StepControllingMemberPersonalInfoComponent;
	@ViewChild(StepControllingMemberAliasesComponent) stepAliases!: StepControllingMemberAliasesComponent;
	@ViewChild(StepControllingMemberResidentialAddressComponent)
	stepAddress!: StepControllingMemberResidentialAddressComponent;

	constructor(utilService: UtilService) {
		super(utilService);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_TERMS:
				return this.termsOfUseComponent.isFormValid();
			case this.STEP_CHECKLIST:
				return true;
			case this.STEP_PERSONAL_INFO:
				return this.stepPersonalInfo.isFormValid();
			case this.STEP_ALIASES:
				return this.stepAliases.isFormValid();
			case this.STEP_RESIDENTIAL_ADDRESS:
				return this.stepAddress.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}
}
