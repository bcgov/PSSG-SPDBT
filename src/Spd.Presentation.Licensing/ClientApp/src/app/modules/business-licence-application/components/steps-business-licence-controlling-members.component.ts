import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { ApplicationService } from '@app/core/services/application.service';
import { BusinessLicenceApplicationRoutes } from '@app/modules/business-licence-application/business-license-application-routes';
import { StepBusinessLicenceControllingMemberInvitesComponent } from './step-business-licence-controlling-member-invites-component';
import { StepBusinessLicenceControllingMembersComponent } from './step-business-licence-controlling-members.component';
import { StepBusinessLicenceEmployeesComponent } from './step-business-licence-employees.component';

@Component({
	selector: 'app-steps-business-licence-controlling-members',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-business-licence-controlling-members
					[applicationTypeCode]="applicationTypeCode"
					[isWizard]="true"
				></app-step-business-licence-controlling-members>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_CONTROLLING_MEMBERS)"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onFormValidNextStep(STEP_CONTROLLING_MEMBERS)"
					(nextReviewStepperStep)="onNextReview(STEP_CONTROLLING_MEMBERS)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="isControllingMembersWithoutSwlExist">
				<app-step-business-licence-controlling-member-invites></app-step-business-licence-controlling-member-invites>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_CONTROLLING_MEMBERS_INVITES)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_CONTROLLING_MEMBERS_INVITES)"
					(nextReviewStepperStep)="onNextReview(STEP_CONTROLLING_MEMBERS_INVITES)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-business-licence-employees
					[applicationTypeCode]="applicationTypeCode"
				></app-step-business-licence-employees>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_EMPLOYEES)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_EMPLOYEES)"
					(nextReviewStepperStep)="onNextReview(STEP_EMPLOYEES)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsBusinessLicenceControllingMembersComponent extends BaseWizardStepComponent {
	readonly STEP_CONTROLLING_MEMBERS = 0;
	readonly STEP_CONTROLLING_MEMBERS_INVITES = 1;
	readonly STEP_EMPLOYEES = 2;

	@Input() isFormValid!: boolean;
	@Input() showSaveAndExit!: boolean;
	@Input() isControllingMembersWithoutSwlExist!: boolean;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(StepBusinessLicenceControllingMembersComponent)
	stepControllingMembersComponent!: StepBusinessLicenceControllingMembersComponent;
	@ViewChild(StepBusinessLicenceEmployeesComponent) stepEmployeesComponent!: StepBusinessLicenceEmployeesComponent;
	@ViewChild(StepBusinessLicenceControllingMemberInvitesComponent)
	stepMembersInvitesComponent!: StepBusinessLicenceControllingMemberInvitesComponent;

	constructor(override commonApplicationService: ApplicationService, private router: Router) {
		super(commonApplicationService);
	}

	onStepClose(): void {
		this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessApplications());
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_CONTROLLING_MEMBERS:
				return this.stepControllingMembersComponent.isFormValid();
			case this.STEP_CONTROLLING_MEMBERS_INVITES:
				return this.stepMembersInvitesComponent.isFormValid();
			case this.STEP_EMPLOYEES:
				return this.stepEmployeesComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
