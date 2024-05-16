import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { Subscription } from 'rxjs';
import { BusinessApplicationService } from '../../services/business-application.service';
import { CommonApplicationService } from '../../services/common-application.service';
import { StepBusinessLicenceCompanyBrandingComponent } from './step-business-licence-company-branding.component';
import { StepBusinessLicenceExpiredComponent } from './step-business-licence-expired.component';
import { StepBusinessLicenceLiabilityComponent } from './step-business-licence-liability.component';

@Component({
	selector: 'app-steps-business-licence-information-new',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-business-licence-checklist-new></app-step-business-licence-checklist-new>

				<app-wizard-footer
					(previousStepperStep)="onGotoUserProfile()"
					(nextStepperStep)="onGoToNextStep()"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-business-licence-expired
					(validExpiredLicenceData)="onValidExpiredLicence()"
				></app-step-business-licence-expired>

				<app-wizard-footer
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onExpiredLicenceNextStep()"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-business-licence-company-branding></app-step-business-licence-company-branding>

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
})
export class StepsBusinessLicenceInformationNewComponent extends BaseWizardStepComponent implements OnInit {
	readonly STEP_LICENCE_EXPIRED = 1;
	readonly STEP_LICENCE_BRANDING = 2;
	readonly STEP_LICENCE_LIABILITY = 3;

	isFormValid = false;
	showSaveAndExit = false;

	@Input() isBusinessLicenceSoleProprietor!: boolean;

	@ViewChild(StepBusinessLicenceExpiredComponent) stepExpiredComponent!: StepBusinessLicenceExpiredComponent;
	@ViewChild(StepBusinessLicenceCompanyBrandingComponent)
	stepCompanyBrandingComponent!: StepBusinessLicenceCompanyBrandingComponent;
	@ViewChild(StepBusinessLicenceLiabilityComponent) stepLiabilityComponent!: StepBusinessLicenceLiabilityComponent;

	private licenceModelChangedSubscription!: Subscription;

	constructor(
		override commonApplicationService: CommonApplicationService,
		private router: Router,
		private businessApplicationService: BusinessApplicationService
	) {
		super(commonApplicationService);
	}

	ngOnInit(): void {
		this.licenceModelChangedSubscription = this.businessApplicationService.businessModelValueChanges$.subscribe(
			(_resp: any) => {
				this.isFormValid = _resp;

				this.showSaveAndExit = this.businessApplicationService.isAutoSave();
			}
		);
	}

	ngOnDestroy() {
		if (this.licenceModelChangedSubscription) this.licenceModelChangedSubscription.unsubscribe();
	}

	onGotoUserProfile(): void {
		this.router.navigateByUrl(
			LicenceApplicationRoutes.pathBusinessLicence(LicenceApplicationRoutes.BUSINESS_LICENCE_USER_PROFILE)
		);
	}

	onExpiredLicenceNextStep(): void {
		this.stepExpiredComponent.onSearchAndValidate();
	}

	onValidExpiredLicence(): void {
		this.childNextStep.emit(true);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
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
}
