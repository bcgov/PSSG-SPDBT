import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { CommonApplicationService } from '../../services/common-application.service';
import { StepBusinessLicenceApplicationOnHoldComponent } from './step-business-licence-application-on-hold.component';
import { StepBusinessLicenceControllingMemberConfirmationComponent } from './step-business-licence-controlling-member-confirmation.component';
import { StepBusinessLicenceControllingMemberInvitesComponent } from './step-business-licence-controlling-member-invites-component';
import { StepBusinessLicenceControllingMembersComponent } from './step-business-licence-controlling-members.component';
import { StepBusinessLicenceEmployeesComponent } from './step-business-licence-employees.component';

@Component({
	selector: 'app-steps-business-licence-controlling-members-new',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-business-licence-controlling-members></app-step-business-licence-controlling-members>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onFormValidNextStep(STEP_CONTROLLING_MEMBERS)"
					(nextReviewStepperStep)="onNextReview(STEP_CONTROLLING_MEMBERS)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-business-licence-controlling-member-confirmation></app-step-business-licence-controlling-member-confirmation>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_CONTROLLING_MEMBERS_CONFIRMATION)"
					(nextReviewStepperStep)="onNextReview(STEP_CONTROLLING_MEMBERS_CONFIRMATION)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-business-licence-controlling-member-invites></app-step-business-licence-controlling-member-invites>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_CONTROLLING_MEMBERS_INVITES)"
					(nextReviewStepperStep)="onNextReview(STEP_CONTROLLING_MEMBERS_INVITES)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-business-licence-employees></app-step-business-licence-employees>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_EMPLOYEES)"
					(nextReviewStepperStep)="onNextReview(STEP_EMPLOYEES)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-business-licence-application-on-hold></app-step-business-licence-application-on-hold>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_APPLICATION_ON_HOLD)"
					(nextReviewStepperStep)="onNextReview(STEP_APPLICATION_ON_HOLD)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsBusinessLicenceControllingMembersNewComponent extends BaseWizardStepComponent {
	readonly STEP_CONTROLLING_MEMBERS = 1;
	readonly STEP_CONTROLLING_MEMBERS_CONFIRMATION = 2;
	readonly STEP_CONTROLLING_MEMBERS_INVITES = 3;
	readonly STEP_EMPLOYEES = 4;
	readonly STEP_APPLICATION_ON_HOLD = 5;

	isFormValid = false;

	@ViewChild(StepBusinessLicenceControllingMembersComponent)
	stepControllingMembersComponent!: StepBusinessLicenceControllingMembersComponent;
	@ViewChild(StepBusinessLicenceEmployeesComponent) stepEmployeesComponent!: StepBusinessLicenceEmployeesComponent;
	@ViewChild(StepBusinessLicenceControllingMemberConfirmationComponent)
	stepMembersConfirmationComponent!: StepBusinessLicenceControllingMemberConfirmationComponent;
	@ViewChild(StepBusinessLicenceControllingMemberInvitesComponent)
	stepMembersInvitesComponent!: StepBusinessLicenceControllingMemberInvitesComponent;
	@ViewChild(StepBusinessLicenceApplicationOnHoldComponent)
	stepOnHoldComponent!: StepBusinessLicenceApplicationOnHoldComponent;

	constructor(override commonApplicationService: CommonApplicationService) {
		super(commonApplicationService);
	}

	// ngOnInit(): void {
	// this.licenceModelChangedSubscription = this.permitApplicationService.permitModelValueChanges$.subscribe(
	// 	(_resp: any) => {
	// 		// console.debug('permitModelValueChanges$', _resp);
	// 		this.isFormValid = _resp;
	// 		this.applicationTypeCode = this.permitApplicationService.permitModelFormGroup.get(
	// 			'applicationTypeData.applicationTypeCode'
	// 		)?.value;
	// 	}
	// );
	// }

	// ngOnDestroy() {
	// 	// if (this.licenceModelChangedSubscription) this.licenceModelChangedSubscription.unsubscribe();
	// }
	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_CONTROLLING_MEMBERS:
				return this.stepControllingMembersComponent.isFormValid();
			case this.STEP_CONTROLLING_MEMBERS_CONFIRMATION:
				return this.stepMembersConfirmationComponent.isFormValid();
			case this.STEP_CONTROLLING_MEMBERS_INVITES:
				return this.stepMembersInvitesComponent.isFormValid();
			case this.STEP_EMPLOYEES:
				return this.stepEmployeesComponent.isFormValid();
			case this.STEP_APPLICATION_ON_HOLD:
				return this.stepOnHoldComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
