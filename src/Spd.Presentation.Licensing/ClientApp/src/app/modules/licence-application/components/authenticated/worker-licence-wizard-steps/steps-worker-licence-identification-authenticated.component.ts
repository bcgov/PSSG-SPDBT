import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { StepWorkerLicenceBcDriverLicenceComponent } from '@app/modules/licence-application/components/shared/worker-licence-wizard-steps/step-worker-licence-bc-driver-licence.component';
import { StepWorkerLicenceCitizenshipComponent } from '@app/modules/licence-application/components/shared/worker-licence-wizard-steps/step-worker-licence-citizenship.component';
import { StepWorkerLicencePhotographOfYourselfComponent } from '@app/modules/licence-application/components/shared/worker-licence-wizard-steps/step-worker-licence-photograph-of-yourself.component';
import { StepWorkerLicencePhysicalCharacteristicsComponent } from '@app/modules/licence-application/components/shared/worker-licence-wizard-steps/step-worker-licence-physical-characteristics.component';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-steps-worker-licence-identification-authenticated',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-worker-licence-citizenship></app-step-worker-licence-citizenship>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button class="large bordered mb-2" (click)="onSaveAndExit(STEP_CITIZENSHIP)">
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_CITIZENSHIP)">
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_CITIZENSHIP)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-worker-licence-bc-driver-licence></app-step-worker-licence-bc-driver-licence>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button class="large bordered mb-2" (click)="onSaveAndExit(STEP_BC_DRIVERS_LICENCE)">
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_BC_DRIVERS_LICENCE)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_BC_DRIVERS_LICENCE)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-worker-licence-physical-characteristics></app-step-worker-licence-physical-characteristics>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button class="large bordered mb-2" (click)="onSaveAndExit(STEP_HEIGHT_AND_WEIGHT)">
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_HEIGHT_AND_WEIGHT)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_HEIGHT_AND_WEIGHT)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-worker-licence-photograph-of-yourself></app-step-worker-licence-photograph-of-yourself>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button class="large bordered mb-2" (click)="onSaveAndExit(STEP_PHOTO)">
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext(STEP_PHOTO)">Next</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_PHOTO)"
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
export class StepsWorkerLicenceIdentificationAuthenticatedComponent
	extends BaseWizardStepComponent
	implements OnInit, OnDestroy
{
	readonly STEP_CITIZENSHIP = 2;
	readonly STEP_BC_DRIVERS_LICENCE = 4;
	readonly STEP_HEIGHT_AND_WEIGHT = 5;
	readonly STEP_PHOTO = 6;

	private authenticationSubscription!: Subscription;
	private licenceModelChangedSubscription!: Subscription;

	isFormValid = false;

	@ViewChild(StepWorkerLicenceCitizenshipComponent) citizenshipComponent!: StepWorkerLicenceCitizenshipComponent;
	@ViewChild(StepWorkerLicenceBcDriverLicenceComponent)
	bcDriverLicenceComponent!: StepWorkerLicenceBcDriverLicenceComponent;
	@ViewChild(StepWorkerLicencePhysicalCharacteristicsComponent)
	heightAndWeightComponent!: StepWorkerLicencePhysicalCharacteristicsComponent;
	@ViewChild(StepWorkerLicencePhotographOfYourselfComponent)
	photoComponent!: StepWorkerLicencePhotographOfYourselfComponent;

	constructor(private licenceApplicationService: LicenceApplicationService) {
		super();
	}

	ngOnInit(): void {
		this.licenceModelChangedSubscription = this.licenceApplicationService.licenceModelValueChanges$.subscribe(
			(_resp: boolean) => {
				this.isFormValid = _resp;
			}
		);
	}

	ngOnDestroy() {
		if (this.authenticationSubscription) this.authenticationSubscription.unsubscribe();
		if (this.licenceModelChangedSubscription) this.licenceModelChangedSubscription.unsubscribe();
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_CITIZENSHIP:
				return this.citizenshipComponent.isFormValid();
			case this.STEP_BC_DRIVERS_LICENCE:
				return this.bcDriverLicenceComponent.isFormValid();
			case this.STEP_HEIGHT_AND_WEIGHT:
				return this.heightAndWeightComponent.isFormValid();
			case this.STEP_PHOTO:
				return this.photoComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
