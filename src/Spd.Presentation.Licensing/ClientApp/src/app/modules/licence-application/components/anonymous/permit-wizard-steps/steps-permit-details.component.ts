import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { Subscription } from 'rxjs';
import { BaseWizardStepComponent } from 'src/app/core/components/base-wizard-step.component';
import { StepPermitExpiredComponent } from './step-permit-expired.component';

@Component({
	selector: 'app-steps-permit-details',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.New">
					<app-step-checklist-new-permit></app-step-checklist-new-permit>

					<div class="row mt-4">
						<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6 mx-auto">
							<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
						</div>
					</div>
				</ng-container>

				<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.Renewal">
					<app-step-checklist-renewal-worker></app-step-checklist-renewal-worker>

					<div class="row mt-4">
						<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6 mx-auto">
							<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
						</div>
					</div>
				</ng-container>

				<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.Update">
					<app-step-checklist-update-worker></app-step-checklist-update-worker>

					<div class="row mt-4">
						<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6 mx-auto">
							<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
						</div>
					</div>
				</ng-container>
			</mat-step>

			<mat-step *ngIf="applicationTypeCode === applicationTypeCodes.New">
				<app-step-permit-expired></app-step-permit-expired>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext(STEP_PERMIT_EXPIRED)">
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_PERMIT_EXPIRED)">
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
export class StepsPermitDetailsComponent extends BaseWizardStepComponent implements OnInit, OnDestroy {
	readonly STEP_PERMIT_EXPIRED = 1;

	// private authenticationSubscription!: Subscription;
	private licenceModelChangedSubscription!: Subscription;

	isFormValid = false;
	applicationTypeCode: ApplicationTypeCode | null = null;
	applicationTypeCodes = ApplicationTypeCode;

	@ViewChild(StepPermitExpiredComponent)
	stepPermitExpiredComponent!: StepPermitExpiredComponent;

	constructor(private router: Router, private permitApplicationService: PermitApplicationService) {
		super();
	}

	ngOnInit(): void {
		this.licenceModelChangedSubscription = this.permitApplicationService.permitModelValueChanges$.subscribe(
			(_resp: any) => {
				// console.debug('permitModelValueChanges$', _resp);
				this.isFormValid = _resp;
				this.applicationTypeCode = this.permitApplicationService.permitModelFormGroup.get(
					'applicationTypeData.applicationTypeCode'
				)?.value;
			}
		);
	}

	ngOnDestroy() {
		if (this.licenceModelChangedSubscription) this.licenceModelChangedSubscription.unsubscribe();
		// if (this.authenticationSubscription) this.authenticationSubscription.unsubscribe();
	}

	onCancel(): void {
		this.router.navigate([LicenceApplicationRoutes.pathPermitAnonymous()]);
	}

	override onGoToNextStep() {
		console.debug('onGoToNextStep', this.childstepper.selectedIndex);

		// if (this.childstepper.selectedIndex === 2 && this.applicationTypeCode === ApplicationTypeCode.Update) {
		// 	this.nextStepperStep.emit(true);
		// 	return;
		// }
		this.childstepper.next();
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_PERMIT_EXPIRED:
				return this.stepPermitExpiredComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
