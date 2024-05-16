import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { Subscription } from 'rxjs';
import { BusinessApplicationService } from '../../services/business-application.service';
import { CommonApplicationService } from '../../services/common-application.service';
import { StepBusinessLicenceCategoryComponent } from './step-business-licence-category.component';
import { StepBusinessLicenceTermComponent } from './step-business-licence-term.component';

@Component({
	selector: 'app-steps-business-licence-selection-new',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-business-licence-category
					[isBusinessLicenceSoleProprietor]="isBusinessLicenceSoleProprietor"
				></app-step-business-licence-category>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_LICENCE_CATEGORY)"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onFormValidNextStep(STEP_LICENCE_CATEGORY)"
					(nextReviewStepperStep)="onNextReview(STEP_LICENCE_CATEGORY)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-business-licence-term
					[isBusinessLicenceSoleProprietor]="isBusinessLicenceSoleProprietor"
				></app-step-business-licence-term>

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
export class StepsBusinessLicenceSelectionNewComponent extends BaseWizardStepComponent implements OnInit {
	readonly STEP_LICENCE_CATEGORY = 1;
	readonly STEP_LICENCE_TERM = 2;

	isFormValid = false;
	showSaveAndExit = false;

	@Input() isBusinessLicenceSoleProprietor!: boolean;

	@ViewChild(StepBusinessLicenceCategoryComponent) stepCategoryComponent!: StepBusinessLicenceCategoryComponent;
	@ViewChild(StepBusinessLicenceTermComponent) stepTermComponent!: StepBusinessLicenceTermComponent;

	private licenceModelChangedSubscription!: Subscription;

	constructor(
		override commonApplicationService: CommonApplicationService,
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

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_LICENCE_CATEGORY:
				return this.stepCategoryComponent.isFormValid();
			case this.STEP_LICENCE_TERM:
				return this.stepTermComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
