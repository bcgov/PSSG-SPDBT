import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { UtilService } from '@app/core/services/util.service';
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
			@if (showTermsOfUse) {
				<mat-step>
					<app-step-worker-licence-terms-of-use
						[applicationTypeCode]="applicationTypeCode"
					></app-step-worker-licence-terms-of-use>
					<app-wizard-footer
						[isFormValid]="isFormValid"
						(nextStepperStep)="onFormValidNextStep(STEP_TERMS)"
						(nextReviewStepperStep)="onNextReview(STEP_TERMS)"
					></app-wizard-footer>
				</mat-step>
			}

			<mat-step>
				@if (applicationTypeCode === applicationTypeCodes.New) {
					<app-step-worker-licence-checklist-new></app-step-worker-licence-checklist-new>
				}

				@if (applicationTypeCode === applicationTypeCodes.Renewal) {
					<app-step-worker-licence-checklist-renewal></app-step-worker-licence-checklist-renewal>
				}

				@if (applicationTypeCode === applicationTypeCodes.Update) {
					<app-step-worker-licence-checklist-update></app-step-worker-licence-checklist-update>
				}

				@if (showTermsOfUse) {
					<app-wizard-footer
						[isFormValid]="isFormValid"
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onGoToNextStep()"
						(nextReviewStepperStep)="onNextReview(STEP_CHECKLIST)"
					></app-wizard-footer>
				} @else {
					<app-wizard-footer
						[isFormValid]="isFormValid"
						(previousStepperStep)="onGotoUserProfile()"
						(nextStepperStep)="onGoToNextStep()"
						(nextReviewStepperStep)="onNextReview(STEP_CHECKLIST)"
					></app-wizard-footer>
				}
			</mat-step>

			@if (isRenewalOrUpdate) {
				<mat-step>
					<app-step-worker-licence-confirmation></app-step-worker-licence-confirmation>
					<app-wizard-footer
						[isFormValid]="isFormValid"
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onFormValidNextStep(STEP_LICENCE_CONFIRMATION)"
						(nextReviewStepperStep)="onNextReview(STEP_LICENCE_CONFIRMATION)"
					></app-wizard-footer>
				</mat-step>
			}

			@if (showWorkerLicenceSoleProprietorStep) {
				<mat-step>
					<app-step-worker-licence-sole-proprietor
						[applicationTypeCode]="applicationTypeCode"
					></app-step-worker-licence-sole-proprietor>
					<app-wizard-footer
						[isFormValid]="isFormValid"
						[showSaveAndExit]="showSaveAndExit"
						(saveAndExit)="onSaveAndExit(STEP_SOLE_PROPRIETOR)"
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onFormValidNextStep(STEP_SOLE_PROPRIETOR)"
						(nextReviewStepperStep)="onNextReview(STEP_SOLE_PROPRIETOR)"
					></app-wizard-footer>
				</mat-step>
			}

			@if (applicationTypeCode === applicationTypeCodes.New) {
				<mat-step>
					<app-step-worker-licence-expired [isLoggedIn]="isLoggedIn"></app-step-worker-licence-expired>
					<app-wizard-footer
						[isFormValid]="isFormValid"
						[showSaveAndExit]="showSaveAndExit"
						(saveAndExit)="onSaveAndExit(STEP_LICENCE_EXPIRED)"
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onFormValidNextStep(STEP_LICENCE_EXPIRED)"
						(nextReviewStepperStep)="onNextReview(STEP_LICENCE_EXPIRED)"
					></app-wizard-footer>
				</mat-step>
			}

			<mat-step>
				<app-step-worker-licence-category
					[applicationTypeCode]="applicationTypeCode"
					[isSoleProprietorSimultaneousFlow]="isSoleProprietorSimultaneousFlow"
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

			@if (showStepDogsAndRestraints) {
				<mat-step>
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
			}

			@if (showStepDogsAndRestraints) {
				<mat-step>
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
			}

			@if (applicationTypeCode !== applicationTypeCodes.Update) {
				<mat-step>
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
			}
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsWorkerLicenceSelectionComponent extends BaseWizardStepComponent {
	readonly STEP_TERMS = 0;
	readonly STEP_CHECKLIST = 1;
	readonly STEP_SOLE_PROPRIETOR = 2;
	readonly STEP_LICENCE_CONFIRMATION = 3;
	readonly STEP_LICENCE_EXPIRED = 4;
	readonly STEP_LICENCE_CATEGORY = 5;
	readonly STEP_DOGS = 6;
	readonly STEP_RESTRAINTS = 7;
	readonly STEP_LICENCE_TERM = 8;

	@Input() isLoggedIn = false;
	@Input() showSaveAndExit = false;
	@Input() isFormValid = false;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;
	@Input() showStepDogsAndRestraints = false;
	@Input() showWorkerLicenceSoleProprietorStep = false;
	@Input() isSoleProprietorSimultaneousFlow = false;

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

	constructor(
		utilService: UtilService,
		private commonApplicationService: CommonApplicationService
	) {
		super(utilService);
	}

	onFormDogsValidNextStep() {
		const isValid = this.dirtyForm(this.STEP_DOGS);
		if (!isValid) {
			this.utilService.scrollToErrorSection();
			return;
		}

		if (this.applicationTypeCode === ApplicationTypeCode.Update) {
			this.nextStepperStep.emit(true);
			return;
		}

		this.childNextStep.emit(true);
	}

	onFormCategoryValidNextStep() {
		const isValid = this.dirtyForm(this.STEP_LICENCE_CATEGORY);
		if (!isValid) {
			this.utilService.scrollToErrorSection();
			return;
		}

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
			case this.STEP_CHECKLIST:
				return true;
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
