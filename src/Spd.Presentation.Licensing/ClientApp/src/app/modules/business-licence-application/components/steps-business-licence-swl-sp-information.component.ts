import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { ApplicationService } from '@app/core/services/application.service';
import { StepBusinessLicenceCompanyBrandingComponent } from './step-business-licence-company-branding.component';
import { StepBusinessLicenceExpiredComponent } from './step-business-licence-expired.component';
import { StepBusinessLicenceLiabilityComponent } from './step-business-licence-liability.component';
import { StepBusinessLicenceSwlSoleProprietorComponent } from './step-business-licence-swl-sole-proprietor.component';

@Component({
	selector: 'app-steps-business-licence-swl-sp-information',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<ng-container *ngIf="isNew">
					<app-step-business-licence-checklist-new></app-step-business-licence-checklist-new>
				</ng-container>

				<ng-container *ngIf="isRenewal">
					<app-step-business-licence-checklist-renew></app-step-business-licence-checklist-renew>
				</ng-container>

				<app-wizard-footer (nextStepperStep)="onGoToNextStep()"></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="isRenewalOrUpdate">
				<app-step-business-licence-confirmation></app-step-business-licence-confirmation>

				<app-wizard-footer
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_LICENCE_CONFIRMATION)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="isRenewal">
				<app-step-business-licence-static-summary></app-step-business-licence-static-summary>

				<div class="row wizard-button-row">
					<div class="offset-xxl-4 col-xxl-5 offset-xl-3 col-xl-7 offset-lg-3 col-lg-7 col-md-12">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onRenewalLongFormNextStep()">
							Yes, I need to update
						</button>
					</div>
				</div>

				<app-wizard-footer
					nextButtonLabel="No updates needed"
					[isWideNext]="true"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onRenewalShortFormNextStep()"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="isNew">
				<app-step-business-licence-expired></app-step-business-licence-expired>

				<app-wizard-footer
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_LICENCE_EXPIRED)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-business-licence-swl-sole-proprietor></app-step-business-licence-swl-sole-proprietor>

				<app-wizard-footer
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_LICENCE_BUSINESS_TYPE)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				Provide your business information <br />Legal business name / phone / email
				<app-wizard-footer
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onGoToNextStep()"
				></app-wizard-footer>
			</mat-step>

			<!-- <mat-step>
				Business Address
				<app-wizard-footer
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onGoToNextStep()"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				Mailing Address
				<app-wizard-footer
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onGoToNextStep()"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				BC Address
				<app-wizard-footer
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onGoToNextStep()"
				></app-wizard-footer>
			</mat-step> -->

			<mat-step *ngIf="!isRenewalShortForm">
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
				<app-step-business-licence-liability
					[applicationTypeCode]="applicationTypeCode"
				></app-step-business-licence-liability>

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
})
export class StepsBusinessLicenceSwlSpInformationComponent extends BaseWizardStepComponent {
	readonly STEP_LICENCE_CONFIRMATION = 1;
	readonly STEP_LICENCE_EXPIRED = 2;
	readonly STEP_LICENCE_BUSINESS_TYPE = 3;
	readonly STEP_LICENCE_BUSINESS_NAME = 4;
	readonly STEP_LICENCE_BRANDING = 5;
	readonly STEP_LICENCE_LIABILITY = 6;

	@Input() isFormValid!: boolean;
	@Input() showSaveAndExit!: boolean;
	@Input() isRenewalShortForm!: boolean;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@Output() renewalShortForm: EventEmitter<boolean> = new EventEmitter();

	@ViewChild(StepBusinessLicenceExpiredComponent) stepExpiredComponent!: StepBusinessLicenceExpiredComponent;
	@ViewChild(StepBusinessLicenceSwlSoleProprietorComponent)
	stepBusinessTypeComponent!: StepBusinessLicenceSwlSoleProprietorComponent;
	@ViewChild(StepBusinessLicenceCompanyBrandingComponent)
	stepCompanyBrandingComponent!: StepBusinessLicenceCompanyBrandingComponent;
	@ViewChild(StepBusinessLicenceLiabilityComponent) stepLiabilityComponent!: StepBusinessLicenceLiabilityComponent;

	constructor(override commonApplicationService: ApplicationService, private router: Router) {
		super(commonApplicationService);
	}

	onGotoBusinessProfile(): void {
		this.commonApplicationService.onGotoBusinessProfile(this.applicationTypeCode);
	}

	onRenewalShortFormNextStep(): void {
		this.renewalShortForm.emit(true);
	}

	onRenewalLongFormNextStep(): void {
		this.renewalShortForm.emit(false);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_LICENCE_CONFIRMATION:
				return true;
			case this.STEP_LICENCE_EXPIRED:
				return this.stepExpiredComponent.isFormValid();
			case this.STEP_LICENCE_BUSINESS_TYPE:
				return this.stepBusinessTypeComponent.isFormValid();
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

	get isRenewalOrUpdate(): boolean {
		return (
			this.applicationTypeCode === ApplicationTypeCode.Renewal ||
			this.applicationTypeCode === ApplicationTypeCode.Update
		);
	}
}
