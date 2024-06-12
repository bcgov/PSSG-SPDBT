import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';
import { StepBusinessLicenceCompanyBrandingComponent } from './step-business-licence-company-branding.component';
import { StepBusinessLicenceExpiredComponent } from './step-business-licence-expired.component';
import { StepBusinessLicenceLiabilityComponent } from './step-business-licence-liability.component';

@Component({
	selector: 'app-steps-business-licence-information',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<ng-container *ngIf="isNew">
					<app-step-business-licence-checklist-new></app-step-business-licence-checklist-new>
				</ng-container>

				<ng-container *ngIf="isRenewal">
					<!--//TODO update checklist -->
					<app-step-business-licence-checklist-new></app-step-business-licence-checklist-new>
				</ng-container>

				<ng-container *ngIf="isUpdate">
					<!--//TODO update checklist -->
					<app-step-business-licence-checklist-new></app-step-business-licence-checklist-new>
				</ng-container>

				<app-wizard-footer
					(previousStepperStep)="onGotoUserProfile()"
					(nextStepperStep)="onGoToNextStep()"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="isRenewalOrUpdate">
				<app-step-business-licence-confirmation></app-step-business-licence-confirmation>

				<app-wizard-footer
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_LICENCE_CONFIRMATION)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="isNew">
				<app-step-business-licence-expired
					(validExpiredLicenceData)="onValidExpiredLicence()"
				></app-step-business-licence-expired>

				<app-wizard-footer
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_LICENCE_EXPIRED)"
				></app-wizard-footer>
			</mat-step>

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
export class StepsBusinessLicenceInformationComponent extends BaseWizardStepComponent {
	readonly STEP_LICENCE_CONFIRMATION = 1;
	readonly STEP_LICENCE_EXPIRED = 2;
	readonly STEP_LICENCE_BRANDING = 3;
	readonly STEP_LICENCE_LIABILITY = 4;

	@Input() isBusinessLicenceSoleProprietor!: boolean;
	@Input() isFormValid!: boolean;
	@Input() showSaveAndExit!: boolean;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(StepBusinessLicenceExpiredComponent) stepExpiredComponent!: StepBusinessLicenceExpiredComponent;
	@ViewChild(StepBusinessLicenceCompanyBrandingComponent)
	stepCompanyBrandingComponent!: StepBusinessLicenceCompanyBrandingComponent;
	@ViewChild(StepBusinessLicenceLiabilityComponent) stepLiabilityComponent!: StepBusinessLicenceLiabilityComponent;

	constructor(override commonApplicationService: CommonApplicationService, private router: Router) {
		super(commonApplicationService);
	}

	onGotoUserProfile(): void {
		this.router.navigateByUrl(
			LicenceApplicationRoutes.pathBusinessLicence(LicenceApplicationRoutes.BUSINESS_LICENCE_USER_PROFILE),
			{ state: { applicationTypeCode: this.applicationTypeCode } }
		);
	}

	onValidExpiredLicence(): void {
		this.childNextStep.emit(true);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
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
