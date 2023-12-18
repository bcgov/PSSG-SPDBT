import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseWizardStepComponent } from 'src/app/core/components/base-wizard-step.component';
import { LicenceApplicationService } from '../../../services/licence-application.service';
import { StepAdditionalGovIdComponent } from '../../shared/wizard-child-steps/step-additional-gov-id.component';
import { StepBcDriverLicenceComponent } from '../../shared/wizard-child-steps/step-bc-driver-licence.component';
import { StepCitizenshipComponent } from '../../shared/wizard-child-steps/step-citizenship.component';
import { StepHeightAndWeightComponent } from '../../shared/wizard-child-steps/step-height-and-weight.component';
import { StepPhotographOfYourselfComponent } from '../../shared/wizard-child-steps/step-photograph-of-yourself.component';

@Component({
	selector: 'app-step-identification-authenticated',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-citizenship></app-step-citizenship>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button class="large bordered mb-2" (click)="onSaveAndExit(STEP_CITIZENSHIP)">
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_CITIZENSHIP)">
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_CITIZENSHIP)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showAdditionalGovermentIdStep">
				<app-step-additional-gov-id></app-step-additional-gov-id>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button class="large bordered mb-2" (click)="onSaveAndExit(STEP_ADDITIONAL_GOV_ID)">
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_ADDITIONAL_GOV_ID)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_ADDITIONAL_GOV_ID)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-bc-driver-licence></app-step-bc-driver-licence>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button class="large bordered mb-2" (click)="onSaveAndExit(STEP_BC_DRIVERS_LICENCE)">
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_BC_DRIVERS_LICENCE)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_BC_DRIVERS_LICENCE)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-height-and-weight></app-step-height-and-weight>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button class="large bordered mb-2" (click)="onSaveAndExit(STEP_HEIGHT_AND_WEIGHT)">
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_HEIGHT_AND_WEIGHT)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_HEIGHT_AND_WEIGHT)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-photograph-of-yourself></app-step-photograph-of-yourself>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button class="large bordered mb-2" (click)="onSaveAndExit(STEP_PHOTO)">
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext(STEP_PHOTO)">Next</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_PHOTO)">
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
export class StepIdentificationAuthenticatedComponent extends BaseWizardStepComponent implements OnInit, OnDestroy {
	readonly STEP_CITIZENSHIP = 2;
	readonly STEP_ADDITIONAL_GOV_ID = 3;
	readonly STEP_BC_DRIVERS_LICENCE = 4;
	readonly STEP_HEIGHT_AND_WEIGHT = 5;
	readonly STEP_PHOTO = 6;

	private authenticationSubscription!: Subscription;
	private licenceModelChangedSubscription!: Subscription;

	isFormValid = false;

	@ViewChild(StepCitizenshipComponent) citizenshipComponent!: StepCitizenshipComponent;
	@ViewChild(StepAdditionalGovIdComponent) additionalGovIdComponent!: StepAdditionalGovIdComponent;
	@ViewChild(StepBcDriverLicenceComponent) bcDriverLicenceComponent!: StepBcDriverLicenceComponent;
	@ViewChild(StepHeightAndWeightComponent) heightAndWeightComponent!: StepHeightAndWeightComponent;
	@ViewChild(StepPhotographOfYourselfComponent) photoComponent!: StepPhotographOfYourselfComponent;

	constructor(private licenceApplicationService: LicenceApplicationService) {
		super();
	}

	ngOnInit(): void {
		this.licenceModelChangedSubscription = this.licenceApplicationService.licenceModelValueChanges$.subscribe(
			(_resp: any) => {
				console.log('licenceModelValueChanges$', _resp);
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
			case this.STEP_ADDITIONAL_GOV_ID:
				return this.additionalGovIdComponent.isFormValid();
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

	get showAdditionalGovermentIdStep(): boolean {
		return this.licenceApplicationService.isShowAdditionalGovermentIdStep();
		// const form = this.licenceApplicationService.citizenshipFormGroup;
		// console.log('showAdditionalGovermentIdStep form1', form.value);
		// console.log(
		// 	'showAdditionalGovermentIdStep valid2',
		// 	(form.value.isCanadianCitizen == BooleanTypeCode.Yes &&
		// 		form.value.canadianCitizenProofTypeCode != LicenceDocumentTypeCode.CanadianPassport) ||
		// 		(form.value.isCanadianCitizen == BooleanTypeCode.No &&
		// 			form.value.notCanadianCitizenProofTypeCode != LicenceDocumentTypeCode.PermanentResidentCard)
		// );
		// console.log('showAdditionalGovermentIdStep form3', this.licenceApplicationService.additionalGovIdFormGroup);
		// console.log('showAdditionalGovermentIdStep form4', this.licenceApplicationService.additionalGovIdFormGroup.valid);

		// return (
		// 	(form.value.isCanadianCitizen == BooleanTypeCode.Yes &&
		// 		form.value.canadianCitizenProofTypeCode != LicenceDocumentTypeCode.CanadianPassport) ||
		// 	(form.value.isCanadianCitizen == BooleanTypeCode.No &&
		// 		form.value.notCanadianCitizenProofTypeCode != LicenceDocumentTypeCode.PermanentResidentCard)
		// );
	}
}
