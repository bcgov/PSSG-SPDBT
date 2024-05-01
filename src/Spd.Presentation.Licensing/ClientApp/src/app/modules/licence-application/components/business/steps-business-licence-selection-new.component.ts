import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
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

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button class="large bordered mb-2" (click)="onExit()">Cancel</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_LICENCE_CATEGORY)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_LICENCE_CATEGORY)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-business-licence-term
					[isBusinessLicenceSoleProprietor]="isBusinessLicenceSoleProprietor"
				></app-step-business-licence-term>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button class="large bordered mb-2" (click)="onExit()">Cancel</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext(STEP_LICENCE_TERM)">
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_LICENCE_TERM)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsBusinessLicenceSelectionNewComponent extends BaseWizardStepComponent {
	readonly STEP_LICENCE_CATEGORY = 1;
	readonly STEP_LICENCE_TERM = 2;

	isFormValid = false;
	applicationTypeCode: ApplicationTypeCode | null = null;

	@Input() isBusinessLicenceSoleProprietor!: boolean;

	@ViewChild(StepBusinessLicenceCategoryComponent) stepCategoryComponent!: StepBusinessLicenceCategoryComponent;
	@ViewChild(StepBusinessLicenceTermComponent) stepTermComponent!: StepBusinessLicenceTermComponent;

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
