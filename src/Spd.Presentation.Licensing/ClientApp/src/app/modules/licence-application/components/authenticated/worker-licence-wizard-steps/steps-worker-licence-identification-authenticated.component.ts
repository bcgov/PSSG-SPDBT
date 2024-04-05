import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { StepWorkerLicenceBcDriverLicenceComponent } from '@app/modules/licence-application/components/shared/worker-licence-wizard-steps/step-worker-licence-bc-driver-licence.component';
import { StepWorkerLicenceCitizenshipComponent } from '@app/modules/licence-application/components/shared/worker-licence-wizard-steps/step-worker-licence-citizenship.component';
import { StepWorkerLicencePhotographOfYourselfComponent } from '@app/modules/licence-application/components/shared/worker-licence-wizard-steps/step-worker-licence-photograph-of-yourself.component';
import { StepWorkerLicencePhysicalCharacteristicsComponent } from '@app/modules/licence-application/components/shared/worker-licence-wizard-steps/step-worker-licence-physical-characteristics.component';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { Subscription } from 'rxjs';
import { StepWorkerLicenceFingerprintsComponent } from '../../shared/worker-licence-wizard-steps/step-worker-licence-fingerprints.component';

@Component({
	selector: 'app-steps-worker-licence-identification-authenticated',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step *ngIf="showCitizenshipStep">
				<app-step-worker-licence-citizenship
					[applicationTypeCode]="applicationTypeCode"
				></app-step-worker-licence-citizenship>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_CITIZENSHIP)"
							*ngIf="showSaveAndExit"
						>
							Save & Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
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

			<mat-step *ngIf="isNotRenewal">
				<app-step-worker-licence-fingerprints></app-step-worker-licence-fingerprints>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_FINGERPRINTS)"
							*ngIf="showSaveAndExit"
						>
							Save & Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onFingerprintStepPrevious()">
							Previous
						</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_FINGERPRINTS)">
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_FINGERPRINTS)"
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
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_BC_DRIVERS_LICENCE)"
							*ngIf="showSaveAndExit"
						>
							Save & Exit
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
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_HEIGHT_AND_WEIGHT)"
							*ngIf="showSaveAndExit"
						>
							Save & Exit
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
				<app-step-worker-licence-photograph-of-yourself
					[applicationTypeCode]="applicationTypeCode"
				></app-step-worker-licence-photograph-of-yourself>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_PHOTO)"
							*ngIf="showSaveAndExit"
						>
							Save & Exit
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
	readonly STEP_CITIZENSHIP = 1;
	readonly STEP_FINGERPRINTS = 2;
	readonly STEP_BC_DRIVERS_LICENCE = 3;
	readonly STEP_HEIGHT_AND_WEIGHT = 4;
	readonly STEP_PHOTO = 5;

	showCitizenshipStep = true;
	showSaveAndExit = false;

	applicationTypeCode: ApplicationTypeCode | null = null;

	private licenceModelChangedSubscription!: Subscription;

	isFormValid = false;

	@ViewChild(StepWorkerLicenceCitizenshipComponent) citizenshipComponent!: StepWorkerLicenceCitizenshipComponent;
	@ViewChild(StepWorkerLicenceFingerprintsComponent) fingerprintsComponent!: StepWorkerLicenceFingerprintsComponent;
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

				this.applicationTypeCode = this.licenceApplicationService.licenceModelFormGroup.get(
					'applicationTypeData.applicationTypeCode'
				)?.value;

				const isCanadianCitizen = this.licenceApplicationService.licenceModelFormGroup.get(
					'citizenshipData.isCanadianCitizen'
				)?.value;

				this.showCitizenshipStep =
					this.applicationTypeCode === ApplicationTypeCode.New ||
					(this.applicationTypeCode === ApplicationTypeCode.Renewal && isCanadianCitizen === BooleanTypeCode.No);

				this.showSaveAndExit = this.licenceApplicationService.isAutoSave();
			}
		);
	}

	ngOnDestroy() {
		if (this.licenceModelChangedSubscription) this.licenceModelChangedSubscription.unsubscribe();
	}

	onFingerprintStepPrevious(): void {
		if (this.showCitizenshipStep) {
			this.childstepper.previous();
			return;
		}

		this.previousStepperStep.emit(true);
	}

	get isNotRenewal(): boolean {
		return this.applicationTypeCode != ApplicationTypeCode.Renewal;
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_CITIZENSHIP:
				return this.citizenshipComponent.isFormValid();
			case this.STEP_FINGERPRINTS:
				return this.fingerprintsComponent.isFormValid();
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
