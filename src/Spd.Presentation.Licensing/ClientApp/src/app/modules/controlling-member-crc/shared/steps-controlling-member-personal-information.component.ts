import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { ApplicationService } from '@app/core/services/application.service';
import { StepControllingMemberAliasesComponent } from './step-controlling-member-aliases.component';
import { StepControllingMemberPersonalInfoComponent } from './step-controlling-member-personal-info.component';
import { StepControllingMemberResidentialAddressComponent } from './step-controlling-member-residential-address.component';

@Component({
	selector: 'app-steps-controlling-member-personal-information',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<!-- <ng-container *ngIf="isNew"> -->
				<app-step-controlling-member-checklist-new></app-step-controlling-member-checklist-new>
				<!-- </ng-container>

				<ng-container *ngIf="isRenewal">
					<app-step-controlling-member-checklist-renewal></app-step-controlling-member-checklist-renewal>
				</ng-container> 
					(previousStepperStep)="onGoToPreviousStep()"
					(previousStepperStep)="onGotoBusinessProfile()"-->

				<app-wizard-footer (cancelAndExit)="onCancelAndExit()" (nextStepperStep)="onGoToNextStep()"></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-controlling-member-personal-info
					[applicationTypeCode]="applicationTypeCode"
				></app-step-controlling-member-personal-info>

				<app-wizard-footer
					(cancelAndExit)="onCancelAndExit()"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_PERSONAL_INFO)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-controlling-member-aliases
					[applicationTypeCode]="applicationTypeCode"
				></app-step-controlling-member-aliases>

				<app-wizard-footer
					(cancelAndExit)="onCancelAndExit()"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_ALIASES)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-controlling-member-residential-address
					[applicationTypeCode]="applicationTypeCode"
				></app-step-controlling-member-residential-address>

				<app-wizard-footer
					(cancelAndExit)="onCancelAndExit()"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_RESIDENTIAL_ADDRESS)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsControllingMemberPersonalInformationComponent extends BaseWizardStepComponent {
	readonly STEP_CHECKLIST = 0;
	readonly STEP_PERSONAL_INFO = 1;
	readonly STEP_ALIASES = 2;
	readonly STEP_RESIDENTIAL_ADDRESS = 3;

	@Input() isFormValid!: boolean;
	@Input() showSaveAndExit!: boolean;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(StepControllingMemberPersonalInfoComponent) stepPersonalInfo!: StepControllingMemberPersonalInfoComponent;
	@ViewChild(StepControllingMemberAliasesComponent) stepAliases!: StepControllingMemberAliasesComponent;
	@ViewChild(StepControllingMemberResidentialAddressComponent)
	stepAddress!: StepControllingMemberResidentialAddressComponent;

	constructor(override commonApplicationService: ApplicationService) {
		super(commonApplicationService);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
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
}
