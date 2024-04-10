import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { Subscription } from 'rxjs';
import { StepPermitBcDriverLicenceComponent } from '../../anonymous/permit-wizard-steps/step-permit-bc-driver-licence.component';
import { StepPermitCitizenshipComponent } from '../../anonymous/permit-wizard-steps/step-permit-citizenship.component';
import { StepPermitPhysicalCharacteristicsComponent } from '../../shared/permit-wizard-steps/step-permit-physical-characteristics.component';
import { StepPermitPhotographOfYourselfComponent } from './step-permit-photograph-of-yourself.component';

@Component({
	selector: 'app-steps-permit-identification-authenticated',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-permit-citizenship [applicationTypeCode]="applicationTypeCode"></app-step-permit-citizenship>

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

			<mat-step>
				<app-step-permit-bc-driver-licence
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-bc-driver-licence>

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

			<mat-step *ngIf="showPhotographOfYourself">
				<app-step-permit-photograph-of-yourself
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-photograph-of-yourself>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_PHOTOGRAPH_OF_YOURSELF)"
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
							(click)="onFormValidNextStep(STEP_PHOTOGRAPH_OF_YOURSELF)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_PHOTOGRAPH_OF_YOURSELF)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-permit-physical-characteristics
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-physical-characteristics>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_PHYSICAL_CHARACTERISTICS)"
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
							(click)="onStepNext(STEP_PHYSICAL_CHARACTERISTICS)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_PHYSICAL_CHARACTERISTICS)"
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
export class StepsPermitIdentificationAuthenticatedComponent
	extends BaseWizardStepComponent
	implements OnInit, OnDestroy
{
	readonly STEP_CITIZENSHIP = 1;
	readonly STEP_BC_DRIVERS_LICENCE = 2;
	readonly STEP_PHYSICAL_CHARACTERISTICS = 3;
	readonly STEP_PHOTOGRAPH_OF_YOURSELF = 4;

	private authenticationSubscription!: Subscription;
	private licenceModelChangedSubscription!: Subscription;

	showSaveAndExit = false;
	isFormValid = false;

	applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(StepPermitCitizenshipComponent) stepCitizenshipComponent!: StepPermitCitizenshipComponent;
	@ViewChild(StepPermitBcDriverLicenceComponent)
	stepDriverLicenceComponent!: StepPermitBcDriverLicenceComponent;
	@ViewChild(StepPermitPhysicalCharacteristicsComponent)
	stepCharacteristicsComponent!: StepPermitPhysicalCharacteristicsComponent;
	@ViewChild(StepPermitPhotographOfYourselfComponent)
	stepPhotographComponent!: StepPermitPhotographOfYourselfComponent;

	constructor(private permitApplicationService: PermitApplicationService) {
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

				this.showSaveAndExit = this.permitApplicationService.isAutoSave();
			}
		);
	}

	ngOnDestroy() {
		if (this.authenticationSubscription) this.authenticationSubscription.unsubscribe();
		if (this.licenceModelChangedSubscription) this.licenceModelChangedSubscription.unsubscribe();
	}

	override onFormValidNextStep(_formNumber: number): void {
		const isValid = this.dirtyForm(_formNumber);
		if (!isValid) return;

		this.childNextStep.next(true);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_CITIZENSHIP:
				return this.stepCitizenshipComponent.isFormValid();
			case this.STEP_BC_DRIVERS_LICENCE:
				return this.stepDriverLicenceComponent.isFormValid();
			case this.STEP_PHYSICAL_CHARACTERISTICS:
				return this.stepCharacteristicsComponent.isFormValid();
			case this.STEP_PHOTOGRAPH_OF_YOURSELF:
				return this.stepPhotographComponent.isFormValid();
		}
		return false;
	}

	get showPhotographOfYourself(): boolean {
		if (this.applicationTypeCode !== ApplicationTypeCode.Update) return true;
		return this.hasGenderChanged;
	}

	// for Update flow: only show unauthenticated user option to upload a new photo if they changed their sex selection earlier in the application
	get hasGenderChanged(): boolean {
		if (this.applicationTypeCode !== ApplicationTypeCode.Update) return false;

		const form = this.permitApplicationService.personalInformationFormGroup;
		return !!form.value.hasGenderChanged;
	}
}
