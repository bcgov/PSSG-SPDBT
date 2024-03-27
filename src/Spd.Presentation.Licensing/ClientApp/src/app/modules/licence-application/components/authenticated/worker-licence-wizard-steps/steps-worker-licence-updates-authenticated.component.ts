import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { StepWorkerLicencePhotographOfYourselfComponent } from '@app/modules/licence-application/components/shared/worker-licence-wizard-steps/step-worker-licence-photograph-of-yourself.component';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { Subscription } from 'rxjs';
import { StepWorkerLicenceCategoryComponent } from '../../shared/worker-licence-wizard-steps/step-worker-licence-category.component';
import { StepWorkerLicenceDogsAuthorizationComponent } from '../../shared/worker-licence-wizard-steps/step-worker-licence-dogs-authorization.component';
import { StepWorkerLicenceRestraintsComponent } from '../../shared/worker-licence-wizard-steps/step-worker-licence-restraints.component';
import { StepWorkerLicenceReviewNameChangeComponent } from '../../shared/worker-licence-wizard-steps/step-worker-licence-review-name-change.component';

@Component({
	selector: 'app-steps-worker-licence-updates-authenticated',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step *ngIf="hasBcscNameChanged">
				<app-step-worker-licence-review-name-change></app-step-worker-licence-review-name-change>

				<div class="row wizard-button-row">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_NAME_CHANGE)">
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="hasGenderChanged">
				<app-step-worker-licence-photograph-of-yourself
					[applicationTypeCode]="applicationTypeCodes.Update"
				></app-step-worker-licence-photograph-of-yourself>

				<div class="row wizard-button-row">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
						<button
							mat-stroked-button
							color="primary"
							class="large mb-2"
							(click)="onStepUpdatePrevious(STEP_PHOTOGRAPH_OF_YOURSELF)"
						>
							Previous
						</button>
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
				</div>
			</mat-step>

			<mat-step>
				<app-step-worker-licence-category
					[applicationTypeCode]="applicationTypeCodes.Update"
				></app-step-worker-licence-category>

				<div class="row wizard-button-row">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
						<button
							mat-stroked-button
							color="primary"
							class="large mb-2"
							(click)="onStepUpdatePrevious(STEP_LICENCE_CATEGORY)"
						>
							Previous
						</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidCategoryNextStep()">
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showStepDogsAndRestraints">
				<app-step-worker-licence-restraints
					[applicationTypeCode]="applicationTypeCodes.Update"
				></app-step-worker-licence-restraints>

				<div class="row wizard-button-row">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_RESTRAINTS)">
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showStepDogsAndRestraints">
				<app-step-worker-licence-dogs-authorization
					[applicationTypeCode]="applicationTypeCodes.Update"
				></app-step-worker-licence-dogs-authorization>

				<div class="row wizard-button-row">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext(STEP_DOGS)">Next</button>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsWorkerLicenceUpdatesAuthenticatedComponent
	extends BaseWizardStepComponent
	implements OnInit, OnDestroy
{
	applicationTypeCodes = ApplicationTypeCode;

	readonly STEP_NAME_CHANGE = 0;
	readonly STEP_PHOTOGRAPH_OF_YOURSELF = 1;
	readonly STEP_LICENCE_CATEGORY = 2;
	readonly STEP_DOGS = 3;
	readonly STEP_RESTRAINTS = 4;

	showStepDogsAndRestraints = false;
	hasBcscNameChanged = false;
	hasGenderChanged = false;

	private licenceModelChangedSubscription!: Subscription;

	@ViewChild(StepWorkerLicenceReviewNameChangeComponent)
	stepLicenceNameChangeComponent!: StepWorkerLicenceReviewNameChangeComponent;
	@ViewChild(StepWorkerLicencePhotographOfYourselfComponent)
	stepLicencePhotographOfYourselfComponent!: StepWorkerLicencePhotographOfYourselfComponent;
	@ViewChild(StepWorkerLicenceCategoryComponent)
	licenceCategoryComponent!: StepWorkerLicenceCategoryComponent;
	@ViewChild(StepWorkerLicenceRestraintsComponent)
	restraintsComponent!: StepWorkerLicenceRestraintsComponent;
	@ViewChild(StepWorkerLicenceDogsAuthorizationComponent)
	dogsComponent!: StepWorkerLicenceDogsAuthorizationComponent;

	constructor(private licenceApplicationService: LicenceApplicationService) {
		super();
	}

	ngOnInit(): void {
		this.licenceModelChangedSubscription = this.licenceApplicationService.licenceModelValueChanges$.subscribe(
			(_resp: boolean) => {
				this.showStepDogsAndRestraints = this.licenceApplicationService.licenceModelFormGroup.get(
					'categorySecurityGuardFormGroup.isInclude'
				)?.value;

				this.hasBcscNameChanged = this.licenceApplicationService.licenceModelFormGroup.get(
					'personalInformationData.hasBcscNameChanged'
				)?.value;

				this.hasGenderChanged = this.licenceApplicationService.licenceModelFormGroup.get(
					'personalInformationData.hasGenderChanged'
				)?.value;
			}
		);
	}

	ngOnDestroy() {
		if (this.licenceModelChangedSubscription) this.licenceModelChangedSubscription.unsubscribe();
	}

	onStepUpdatePrevious(step: number): void {
		switch (step) {
			case this.STEP_PHOTOGRAPH_OF_YOURSELF:
				if (this.hasBcscNameChanged) {
					this.childstepper.previous();
					return;
				}
				break;
			case this.STEP_LICENCE_CATEGORY:
				if (this.hasGenderChanged || this.hasBcscNameChanged) {
					this.childstepper.previous();
					return;
				}
				break;
			default:
				console.error('Unknown Form', step);
		}

		this.previousStepperStep.emit(true);
	}

	onFormValidCategoryNextStep(): void {
		const isValid = this.dirtyForm(this.STEP_LICENCE_CATEGORY);
		if (!isValid) return;

		if (this.showStepDogsAndRestraints) {
			this.childNextStep.emit(true);
			return;
		}

		this.nextStepperStep.emit(true);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_NAME_CHANGE:
				return this.stepLicenceNameChangeComponent.isFormValid();
			case this.STEP_PHOTOGRAPH_OF_YOURSELF:
				return this.stepLicencePhotographOfYourselfComponent.isFormValid();
			case this.STEP_LICENCE_CATEGORY:
				return this.licenceCategoryComponent.isFormValid();
			case this.STEP_RESTRAINTS:
				return this.restraintsComponent.isFormValid();
			case this.STEP_DOGS:
				return this.dogsComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
