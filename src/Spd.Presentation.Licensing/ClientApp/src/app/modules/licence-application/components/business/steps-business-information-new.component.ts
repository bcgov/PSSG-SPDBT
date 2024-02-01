import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { Subscription } from 'rxjs';
import { BaseWizardStepComponent } from 'src/app/core/components/base-wizard-step.component';
import { BusinessApplicationService } from '../../services/business-application.service';
import { StepBusinessLicenceExpiredComponent } from './step-business-licence-expired.component';

@Component({
	selector: 'app-steps-business-information-new',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-permit-checklist-new></app-step-permit-checklist-new>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12 mx-auto">
						<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-business-licence-expired></app-step-business-licence-expired>

				<div class="row wizard-button-row">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext(STEP_LICENCE_EXPIRED)">
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_LICENCE_EXPIRED)"
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
export class StepsBusinessInformationNewComponent extends BaseWizardStepComponent {
	readonly STEP_LICENCE_EXPIRED = 1;

	private licenceModelChangedSubscription!: Subscription;

	isFormValid = false;
	applicationTypeCode: ApplicationTypeCode | null = null;
	applicationTypeCodes = ApplicationTypeCode;

	@ViewChild(StepBusinessLicenceExpiredComponent)
	stepLicenceExpiredComponent!: StepBusinessLicenceExpiredComponent;

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
			case this.STEP_LICENCE_EXPIRED:
				return this.stepLicenceExpiredComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
