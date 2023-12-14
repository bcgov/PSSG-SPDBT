import { Component, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BaseWizardStepComponent } from 'src/app/core/components/base-wizard-step.component';
import { LicenceApplicationRoutes } from '../../licence-application-routing.module';
import { LicenceApplicationService } from '../../services/licence-application.service';
import { StepConsentAndDeclarationComponent } from '../wizard-child-steps/step-consent-and-declaration.component';
import { StepSummaryReviewLicenceComponent } from '../wizard-child-steps/step-summary-review-licence.component';

@Component({
	selector: 'app-step-review-licence',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-summary-review-licence (editStep)="onGoToStep($event)"></app-step-summary-review-licence>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-consent-and-declaration></app-step-consent-and-declaration>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onPayNow()">Pay Now</button>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepReviewLicenceComponent extends BaseWizardStepComponent {
	@Output() goToStep: EventEmitter<number> = new EventEmitter<number>();

	@ViewChild(StepSummaryReviewLicenceComponent) summaryReviewComponent!: StepSummaryReviewLicenceComponent;
	@ViewChild(StepConsentAndDeclarationComponent) consentAndDeclarationComponent!: StepConsentAndDeclarationComponent;

	constructor(
		private router: Router,
		private licenceApplicationService: LicenceApplicationService,
		private hotToastService: HotToastService
	) {
		super();
	}

	onPayNow(): void {
		const isValid = this.consentAndDeclarationComponent.isFormValid();
		if (!isValid) return;

		this.licenceApplicationService.submitLicence().subscribe({
			next: (_resp: any) => {
				this.hotToastService.success('Your licence has been successfully submitted');
				this.router.navigateByUrl(LicenceApplicationRoutes.pathUserApplications());
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
				this.hotToastService.error('An error occurred during the save. Please try again.');
			},
		});
	}

	onGoToStep(step: number): void {
		this.goToStep.emit(step);
	}

	override onStepNext(_formNumber: number): void {
		// unused
	}

	override onFormValidNextStep(_formNumber: number): void {
		// unused
	}

	override onGoToFirstStep() {
		this.childstepper.selectedIndex = 0;
		this.summaryReviewComponent.onUpdateData();
	}
}
