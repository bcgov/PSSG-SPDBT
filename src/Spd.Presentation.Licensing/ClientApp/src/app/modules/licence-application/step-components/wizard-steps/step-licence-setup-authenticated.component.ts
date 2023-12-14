import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BaseWizardStepComponent } from 'src/app/core/components/base-wizard-step.component';
import { LicenceApplicationRoutes } from '../../licence-application-routing.module';
import { StepLicenceApplicationTypeComponent } from '../wizard-child-steps/step-licence-application-type.component';
import { StepLicenceTypeSelectionComponent } from '../wizard-child-steps/step-licence-type-selection.component';
import { StepLicenceUserProfileComponent } from '../wizard-child-steps/step-licence-user-profile.component';
@Component({
	selector: 'app-step-licence-setup-authenticated',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-licence-user-profile></app-step-licence-user-profile>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onCancel()">Cancel</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_USER_PROFILE)">
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-licence-type-selection></app-step-licence-type-selection>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_LICENCE_TYPE)">
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-licence-application-type></app-step-licence-application-type>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext(STEP_APPLICATION_TYPE)">
							Next
						</button>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepLicenceSetupAuthenticatedComponent extends BaseWizardStepComponent {
	readonly STEP_USER_PROFILE = 0;
	readonly STEP_LICENCE_TYPE = 1;
	readonly STEP_APPLICATION_TYPE = 2;

	@ViewChild(StepLicenceUserProfileComponent)
	licenceUserProfileComponent!: StepLicenceUserProfileComponent;

	@ViewChild(StepLicenceTypeSelectionComponent)
	licenceTypeSelectionComponent!: StepLicenceTypeSelectionComponent;

	@ViewChild(StepLicenceApplicationTypeComponent)
	licenceApplicationTypeComponent!: StepLicenceApplicationTypeComponent;
	constructor(private router: Router) {
		super();
	}

	override onStepPrevious(): void {
		// unused
	}

	onCancel(): void {
		this.router.navigate([LicenceApplicationRoutes.pathUserApplications()]);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_USER_PROFILE:
				return this.licenceUserProfileComponent.isFormValid();
			case this.STEP_LICENCE_TYPE:
				return this.licenceTypeSelectionComponent.isFormValid();
			case this.STEP_APPLICATION_TYPE:
				return this.licenceApplicationTypeComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
