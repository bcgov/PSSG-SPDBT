import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { BusinessApplicationService } from '@app/modules/licence-application/services/business-application.service';
import { StepBusinessLicenceMailingAddressComponent } from './step-business-licence-mailing-address.component';
import { StepBusinessLicenceManagerInformationComponent } from './step-business-licence-manager-information.component';
import { StepBusinessLicenceBcBusinessAddressComponent } from './step-business_licence-bc-business-address.component';
import { StepBusinessLicenceBranchesComponent } from './step-business_licence-branches.component';
import { StepBusinessLicenceBusinessAddressComponent } from './step-business_licence-business-address.component';

@Component({
	selector: 'app-steps-business-licence-contact-information-new',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-business-licence-manager-information></app-step-business-licence-manager-information>

				<div class="row wizard-button-row">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_LICENCE_MANAGER_INFORMATION)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_LICENCE_MANAGER_INFORMATION)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-business-licence-business-address></app-step-business-licence-business-address>

				<div class="row wizard-button-row">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_LICENCE_BUSINESS_ADDRESS)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_LICENCE_BUSINESS_ADDRESS)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-business-licence-mailing-address></app-step-business-licence-mailing-address>

				<div class="row wizard-button-row">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_LICENCE_MAILING_ADDRESS)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_LICENCE_MAILING_ADDRESS)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-business-licence-bc-business-address></app-step-business-licence-bc-business-address>

				<div class="row wizard-button-row">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_LICENCE_BC_BUSINESS_ADDRESS)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_LICENCE_BC_BUSINESS_ADDRESS)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-business-licence-branches></app-step-business-licence-branches>

				<div class="row wizard-button-row">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext(STEP_LICENCE_BRANCHES)">
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_LICENCE_BRANCHES)"
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
export class StepsBusinessLicenceContactInformationNewComponent extends BaseWizardStepComponent {
	readonly STEP_LICENCE_MANAGER_INFORMATION = 1;
	readonly STEP_LICENCE_BUSINESS_ADDRESS = 2;
	readonly STEP_LICENCE_MAILING_ADDRESS = 3;
	readonly STEP_LICENCE_BC_BUSINESS_ADDRESS = 4;
	readonly STEP_LICENCE_BRANCHES = 5;

	isFormValid = false;
	applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(StepBusinessLicenceManagerInformationComponent)
	stepManagerInformationComponent!: StepBusinessLicenceManagerInformationComponent;
	@ViewChild(StepBusinessLicenceBusinessAddressComponent)
	stepBusinessAddressComponent!: StepBusinessLicenceBusinessAddressComponent;
	@ViewChild(StepBusinessLicenceMailingAddressComponent)
	stepMailingAddressComponent!: StepBusinessLicenceMailingAddressComponent;
	@ViewChild(StepBusinessLicenceBcBusinessAddressComponent)
	stepBcBusinessAddressComponent!: StepBusinessLicenceBcBusinessAddressComponent;
	@ViewChild(StepBusinessLicenceBranchesComponent)
	stepBranchesComponent!: StepBusinessLicenceBranchesComponent;

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
			case this.STEP_LICENCE_MANAGER_INFORMATION:
				return this.stepManagerInformationComponent.isFormValid();
			case this.STEP_LICENCE_BUSINESS_ADDRESS:
				return this.stepBusinessAddressComponent.isFormValid();
			case this.STEP_LICENCE_MAILING_ADDRESS:
				return this.stepMailingAddressComponent.isFormValid();
			case this.STEP_LICENCE_BC_BUSINESS_ADDRESS:
				return this.stepBcBusinessAddressComponent.isFormValid();
			case this.STEP_LICENCE_BRANCHES:
				return this.stepBranchesComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
