import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { ApplicationService } from '@app/core/services/application.service';
import { StepWorkerLicenceCategoryComponent } from './step-worker-licence-category.component';
import { StepWorkerLicenceDogsAuthorizationComponent } from './step-worker-licence-dogs-authorization.component';
import { StepWorkerLicenceExpiredComponent } from './step-worker-licence-expired.component';
import { StepWorkerLicenceRestraintsComponent } from './step-worker-licence-restraints.component';
import { StepWorkerLicenceSoleProprietorComponent } from './step-worker-licence-sole-proprietor.component';
import { StepWorkerLicenceTermComponent } from './step-worker-licence-term.component';
import { StepWorkerLicenceTermsOfUseComponent } from './step-worker-licence-terms-of-use.component';

@Component({
	selector: 'app-steps-worker-licence-selection',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step *ngIf="showTermsOfUse">
				<app-step-worker-licence-terms-of-use
					[applicationTypeCode]="applicationTypeCode"
				></app-step-worker-licence-terms-of-use>

				<app-wizard-footer (nextStepperStep)="onFormValidNextStep(STEP_TERMS)"></app-wizard-footer>
			</mat-step>

			<mat-step>
				<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.New">
					<app-step-worker-licence-checklist-new></app-step-worker-licence-checklist-new>
				</ng-container>

				<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.Renewal">
					<app-step-worker-licence-checklist-renewal></app-step-worker-licence-checklist-renewal>
				</ng-container>

				<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.Update">
					<app-step-worker-licence-checklist-update></app-step-worker-licence-checklist-update>
				</ng-container>

				<ng-container *ngIf="showTermsOfUse; else isLoggedInChecklistSteps">
					<app-wizard-footer
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onGoToNextStep()"
					></app-wizard-footer>
				</ng-container>
				<ng-template #isLoggedInChecklistSteps>
					<app-wizard-footer
						(previousStepperStep)="onGotoUserProfile()"
						(nextStepperStep)="onGoToNextStep()"
					></app-wizard-footer>
				</ng-template>
			</mat-step>

			<mat-step *ngIf="isRenewalOrUpdate">
				<app-step-worker-licence-confirmation></app-step-worker-licence-confirmation>

				<app-wizard-footer
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_LICENCE_CONFIRMATION)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="applicationTypeCode !== applicationTypeCodes.Update">
				<app-step-worker-licence-sole-proprietor
					[applicationTypeCode]="applicationTypeCode"
				></app-step-worker-licence-sole-proprietor>

				<app-wizard-footer
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_SOLE_PROPRIETOR)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="applicationTypeCode === applicationTypeCodes.New">
				<app-step-worker-licence-expired [isLoggedIn]="isLoggedIn"></app-step-worker-licence-expired>

				<app-wizard-footer
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_LICENCE_EXPIRED)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-worker-licence-category
					[applicationTypeCode]="applicationTypeCode"
				></app-step-worker-licence-category>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_LICENCE_CATEGORY)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormCategoryValidNextStep()"
					(nextReviewStepperStep)="onNextReview(STEP_LICENCE_CATEGORY)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="showStepDogsAndRestraints">
				<app-step-worker-licence-restraints
					[applicationTypeCode]="applicationTypeCode"
				></app-step-worker-licence-restraints>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_RESTRAINTS)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_RESTRAINTS)"
					(nextReviewStepperStep)="onNextReview(STEP_RESTRAINTS)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="showStepDogsAndRestraints">
				<app-step-worker-licence-dogs-authorization
					[applicationTypeCode]="applicationTypeCode"
				></app-step-worker-licence-dogs-authorization>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_DOGS)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormDogsValidNextStep()"
					(nextReviewStepperStep)="onNextReview(STEP_DOGS)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="applicationTypeCode !== applicationTypeCodes.Update">
				<app-step-worker-licence-term [applicationTypeCode]="applicationTypeCode"></app-step-worker-licence-term>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_LICENCE_TERM)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_LICENCE_TERM)"
					(nextReviewStepperStep)="onNextReview(STEP_LICENCE_TERM)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsWorkerLicenceSelectionComponent extends BaseWizardStepComponent {
	// If step ordering changes, crucial  to update this <- look for this comment below
	readonly STEP_TERMS = 0;
	readonly STEP_SOLE_PROPRIETOR = 1;
	readonly STEP_LICENCE_CONFIRMATION = 2;
	readonly STEP_LICENCE_EXPIRED = 3;
	readonly STEP_LICENCE_CATEGORY = 4;
	readonly STEP_DOGS = 5;
	readonly STEP_RESTRAINTS = 6;
	readonly STEP_LICENCE_TERM = 7;

	@Input() isLoggedIn = false;
	@Input() showSaveAndExit = false;
	@Input() isFormValid = false;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;
	@Input() showStepDogsAndRestraints = false;

	applicationTypeCodes = ApplicationTypeCode;

	@ViewChild(StepWorkerLicenceTermsOfUseComponent)
	termsOfUseComponent!: StepWorkerLicenceTermsOfUseComponent;

	@ViewChild(StepWorkerLicenceSoleProprietorComponent)
	soleProprietorComponent!: StepWorkerLicenceSoleProprietorComponent;

	@ViewChild(StepWorkerLicenceExpiredComponent)
	licenceExpiredComponent!: StepWorkerLicenceExpiredComponent;

	@ViewChild(StepWorkerLicenceCategoryComponent)
	licenceCategoryComponent!: StepWorkerLicenceCategoryComponent;

	@ViewChild(StepWorkerLicenceRestraintsComponent)
	restraintsComponent!: StepWorkerLicenceRestraintsComponent;

	@ViewChild(StepWorkerLicenceDogsAuthorizationComponent)
	dogsComponent!: StepWorkerLicenceDogsAuthorizationComponent;

	@ViewChild(StepWorkerLicenceTermComponent)
	licenceTermComponent!: StepWorkerLicenceTermComponent;

	constructor(override commonApplicationService: ApplicationService) {
		super(commonApplicationService);
	}

	onFormDogsValidNextStep() {
		const isValid = this.dirtyForm(this.STEP_DOGS);
		if (!isValid) return;

		if (this.applicationTypeCode === ApplicationTypeCode.Update) {
			this.nextStepperStep.emit(true);
			return;
		}

		this.childNextStep.emit(true);
	}

	onFormCategoryValidNextStep() {
		const isValid = this.dirtyForm(this.STEP_LICENCE_CATEGORY);
		if (!isValid) return;

		if (this.applicationTypeCode === ApplicationTypeCode.Update && !this.showStepDogsAndRestraints) {
			this.nextStepperStep.emit(true);
			return;
		}

		this.childNextStep.emit(true);
	}

	onGotoUserProfile(): void {
		this.commonApplicationService.onGotoSwlUserProfile(this.applicationTypeCode!);
	}

	isStepToSave(): boolean {
		const index = this.childstepper.selectedIndex;
		return index >= 2;
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_TERMS:
				return this.termsOfUseComponent.isFormValid();
			case this.STEP_SOLE_PROPRIETOR:
				return this.soleProprietorComponent.isFormValid();
			case this.STEP_LICENCE_CONFIRMATION:
				return true;
			case this.STEP_LICENCE_EXPIRED:
				return this.licenceExpiredComponent.isFormValid();
			case this.STEP_LICENCE_CATEGORY:
				return this.licenceCategoryComponent.isFormValid();
			case this.STEP_RESTRAINTS:
				return this.restraintsComponent.isFormValid();
			case this.STEP_DOGS:
				return this.dogsComponent.isFormValid();
			case this.STEP_LICENCE_TERM:
				return this.licenceTermComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	get showTermsOfUse(): boolean {
		// anonymous: agree everytime for all
		return !this.isLoggedIn;
	}

	get isRenewalOrUpdate(): boolean {
		return (
			this.applicationTypeCode === ApplicationTypeCode.Renewal ||
			this.applicationTypeCode === ApplicationTypeCode.Update
		);
	}
}
