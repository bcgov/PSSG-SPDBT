import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { UtilService } from '@app/core/services/util.service';
import { StepBusinessLicenceCompanyBrandingComponent } from './step-business-licence-company-branding.component';
import { StepBusinessLicenceExpiredComponent } from './step-business-licence-expired.component';
import { StepBusinessLicenceLiabilityComponent } from './step-business-licence-liability.component';

@Component({
	selector: 'app-steps-business-licence-information',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				@if (isNew) {
					<app-step-business-licence-checklist-new></app-step-business-licence-checklist-new>
				}

				@if (isRenewal) {
					<app-step-business-licence-checklist-renew></app-step-business-licence-checklist-renew>
				}

				@if (isBusinessLicenceSoleProprietor) {
					@if (isSoleProprietorSimultaneousFlow) {
						<app-wizard-footer
							[isFormValid]="isFormValid"
							(nextStepperStep)="onGoToNextStep()"
							(nextReviewStepperStep)="onNextReview(STEP_CHECKLIST)"
						></app-wizard-footer>
					} @else {
						<app-wizard-footer
							[isFormValid]="isFormValid"
							(previousStepperStep)="onGotoBusinessProfile()"
							(nextStepperStep)="onGoToNextStep()"
							(nextReviewStepperStep)="onNextReview(STEP_CHECKLIST)"
						></app-wizard-footer>
					}
				} @else {
					<app-wizard-footer
						[isFormValid]="isFormValid"
						(previousStepperStep)="onGotoBusinessProfile()"
						(nextStepperStep)="onGoToNextStep()"
						(nextReviewStepperStep)="onNextReview(STEP_CHECKLIST)"
					></app-wizard-footer>
				}
			</mat-step>

			@if (isRenewalOrUpdate) {
				<mat-step>
					<app-step-business-licence-confirmation
						[applicationTypeCode]="applicationTypeCode"
					></app-step-business-licence-confirmation>
					<app-wizard-footer
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onFormValidNextStep(STEP_LICENCE_CONFIRMATION)"
					></app-wizard-footer>
				</mat-step>
			}

			@if (isNew) {
				<mat-step>
					<app-step-business-licence-expired></app-step-business-licence-expired>
					<app-wizard-footer
						[isFormValid]="isFormValid"
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onFormValidNextStep(STEP_LICENCE_EXPIRED)"
						(nextReviewStepperStep)="onNextReview(STEP_LICENCE_EXPIRED)"
					></app-wizard-footer>
				</mat-step>
			}

			<mat-step>
				<app-step-business-licence-company-branding
					[applicationTypeCode]="applicationTypeCode"
				></app-step-business-licence-company-branding>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_LICENCE_BRANDING)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_LICENCE_BRANDING)"
					(nextReviewStepperStep)="onNextReview(STEP_LICENCE_BRANDING)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-business-licence-liability></app-step-business-licence-liability>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_LICENCE_LIABILITY)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_LICENCE_LIABILITY)"
					(nextReviewStepperStep)="onNextReview(STEP_LICENCE_LIABILITY)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsBusinessLicenceInformationComponent extends BaseWizardStepComponent {
	readonly STEP_CHECKLIST = 0;
	readonly STEP_LICENCE_CONFIRMATION = 1;
	readonly STEP_LICENCE_EXPIRED = 2;
	readonly STEP_LICENCE_BRANDING = 3;
	readonly STEP_LICENCE_LIABILITY = 4;

	@Input() isBusinessLicenceSoleProprietor!: boolean;
	@Input() isSoleProprietorSimultaneousFlow!: boolean;
	@Input() isFormValid!: boolean;
	@Input() showSaveAndExit!: boolean;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(StepBusinessLicenceExpiredComponent) stepExpiredComponent!: StepBusinessLicenceExpiredComponent;
	@ViewChild(StepBusinessLicenceCompanyBrandingComponent)
	stepCompanyBrandingComponent!: StepBusinessLicenceCompanyBrandingComponent;
	@ViewChild(StepBusinessLicenceLiabilityComponent) stepLiabilityComponent!: StepBusinessLicenceLiabilityComponent;

	constructor(
		utilService: UtilService,
		private commonApplicationService: CommonApplicationService
	) {
		super(utilService);
	}

	onGotoBusinessProfile(): void {
		this.commonApplicationService.onGotoBusinessProfile(this.applicationTypeCode);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_CHECKLIST:
				return true;
			case this.STEP_LICENCE_CONFIRMATION:
				return true;
			case this.STEP_LICENCE_EXPIRED:
				return this.stepExpiredComponent.isFormValid();
			case this.STEP_LICENCE_BRANDING:
				return this.stepCompanyBrandingComponent.isFormValid();
			case this.STEP_LICENCE_LIABILITY:
				return this.stepLiabilityComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}

	get isRenewal(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Renewal;
	}

	get isUpdate(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Update;
	}

	get isRenewalOrUpdate(): boolean {
		return (
			this.applicationTypeCode === ApplicationTypeCode.Renewal ||
			this.applicationTypeCode === ApplicationTypeCode.Update
		);
	}
}
