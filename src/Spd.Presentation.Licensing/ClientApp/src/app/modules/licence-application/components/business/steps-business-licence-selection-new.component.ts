import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { BusinessApplicationService } from '@app/modules/licence-application/services/business-application.service';
import { StepBusinessLicenceCategoryComponent } from './step-business-licence-category.component';
import { StepBusinessLicenceLiabilityComponent } from './step-business-licence-liability.component';
import { StepBusinessLicenceTermComponent } from './step-business-licence-term.component';

@Component({
	selector: 'app-steps-business-licence-selection-new',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-business-licence-liability></app-step-business-licence-liability>

				<div class="row wizard-button-row">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_LICENCE_LIABILITY)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_LICENCE_LIABILITY)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-business-licence-category></app-step-business-licence-category>

				<div class="row wizard-button-row">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
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
				<app-step-business-licence-term></app-step-business-licence-term>

				<div class="row wizard-button-row">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
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
	readonly STEP_LICENCE_LIABILITY = 1;
	readonly STEP_LICENCE_CATEGORY = 2;
	readonly STEP_LICENCE_TERM = 3;

	isFormValid = false;
	applicationTypeCode: ApplicationTypeCode | null = null;
	applicationTypeCodes = ApplicationTypeCode;

	@ViewChild(StepBusinessLicenceLiabilityComponent) stepLiabilityComponent!: StepBusinessLicenceLiabilityComponent;
	@ViewChild(StepBusinessLicenceCategoryComponent) stepCategoryComponent!: StepBusinessLicenceCategoryComponent;
	@ViewChild(StepBusinessLicenceTermComponent) stepTermComponent!: StepBusinessLicenceTermComponent;

	constructor(private router: Router, private businessApplicationService: BusinessApplicationService) {
		super();
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

	onCancel(): void {
		this.router.navigate([LicenceApplicationRoutes.pathBusinessLicence()]);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_LICENCE_LIABILITY:
				return this.stepLiabilityComponent.isFormValid();
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
