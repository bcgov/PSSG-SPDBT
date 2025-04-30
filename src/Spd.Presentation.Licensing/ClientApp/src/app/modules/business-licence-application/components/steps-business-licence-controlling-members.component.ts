import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { BusinessLicenceApplicationRoutes } from '@app/modules/business-licence-application/business-license-application-routes';
import { StepBusinessLicenceBusinessMembersComponent } from './step-business-licence-business-members.component';
import { StepBusinessLicenceControllingMemberInvitesComponent } from './step-business-licence-controlling-member-invites-component';
import { StepBusinessLicenceControllingMembersComponent } from './step-business-licence-controlling-members.component';
import { StepBusinessLicenceCorporateRegistryDocumentComponent } from './step-business-licence-corporate-registry-document.component';
import { StepBusinessLicenceEmployeesComponent } from './step-business-licence-employees.component';

@Component({
	selector: 'app-steps-business-licence-controlling-members',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-business-licence-controlling-members
					[applicationTypeCode]="applicationTypeCode"
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

			<mat-step>
				<app-step-business-licence-business-members
					[applicationTypeCode]="applicationTypeCode"
				></app-step-business-licence-business-members>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_BUSINESS_MEMBERS)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_BUSINESS_MEMBERS)"
					(nextReviewStepperStep)="onNextReview(STEP_BUSINESS_MEMBERS)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-business-licence-corporate-registry-document></app-step-business-licence-corporate-registry-document>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_CORP_REGISTRY_DOCUMENT)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_CORP_REGISTRY_DOCUMENT)"
					(nextReviewStepperStep)="onNextReview(STEP_CORP_REGISTRY_DOCUMENT)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="isBusinessStakeholdersWithoutSwlExist">
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
					[isBusinessLicenceSoleProprietor]="false"
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
	standalone: false,
})
export class StepsBusinessLicenceControllingMembersComponent extends BaseWizardStepComponent {
	readonly STEP_CONTROLLING_MEMBERS = 0;
	readonly STEP_BUSINESS_MEMBERS = 1;
	readonly STEP_CORP_REGISTRY_DOCUMENT = 2;
	readonly STEP_CONTROLLING_MEMBERS_INVITES = 3;
	readonly STEP_EMPLOYEES = 4;

	@Input() isFormValid!: boolean;
	@Input() showSaveAndExit!: boolean;
	@Input() isBusinessStakeholdersWithoutSwlExist!: boolean;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(StepBusinessLicenceControllingMembersComponent)
	stepControllingMembersComponent!: StepBusinessLicenceControllingMembersComponent;
	@ViewChild(StepBusinessLicenceBusinessMembersComponent)
	stepBusinessMembersComponent!: StepBusinessLicenceBusinessMembersComponent;
	@ViewChild(StepBusinessLicenceCorporateRegistryDocumentComponent)
	stepCorpRegistryComponent!: StepBusinessLicenceCorporateRegistryDocumentComponent;
	@ViewChild(StepBusinessLicenceEmployeesComponent) stepEmployeesComponent!: StepBusinessLicenceEmployeesComponent;
	@ViewChild(StepBusinessLicenceControllingMemberInvitesComponent)
	stepMembersInvitesComponent!: StepBusinessLicenceControllingMemberInvitesComponent;

	constructor(
		utilService: UtilService,
		private router: Router
	) {
		super(utilService);
	}

	onStepClose(): void {
		this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessApplications());
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_CONTROLLING_MEMBERS:
				return this.stepControllingMembersComponent.isFormValid();
			case this.STEP_BUSINESS_MEMBERS:
				return this.stepBusinessMembersComponent.isFormValid();
			case this.STEP_CORP_REGISTRY_DOCUMENT:
				return this.stepCorpRegistryComponent.isFormValid();
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
