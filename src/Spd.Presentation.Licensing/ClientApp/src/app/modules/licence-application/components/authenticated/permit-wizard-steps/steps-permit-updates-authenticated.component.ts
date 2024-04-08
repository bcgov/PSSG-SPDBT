import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { Subscription } from 'rxjs';
import { StepPermitRationaleComponent } from '../../anonymous/permit-wizard-steps/step-permit-rationale.component';
import { StepPermitReasonComponent } from '../../anonymous/permit-wizard-steps/step-permit-reason.component';
import { StepPermitReprintComponent } from '../../shared/permit-wizard-steps/step-permit-reprint.component';
import { StepPermitPhotographOfYourselfComponent } from './step-permit-photograph-of-yourself.component';
import { StepPermitReviewNameChangeComponent } from './step-permit-review-name-change.component';

@Component({
	selector: 'app-steps-permit-updates-authenticated',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step *ngIf="hasBcscNameChanged">
				<app-step-permit-review-name-change></app-step-permit-review-name-change>

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

			<mat-step *ngIf="showReprint">
				<app-step-permit-reprint></app-step-permit-reprint>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12"></div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepUpdatePrevious(STEP_REPRINT)">
							Previous
						</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_REPRINT)">
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="hasGenderChanged">
				<app-step-permit-photograph-of-yourself
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-photograph-of-yourself>

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
				<app-step-permit-reason
					[workerLicenceTypeCode]="workerLicenceTypeCode"
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-reason>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button class="large bordered mb-2" (click)="onSaveAndExit(STEP_REASON)">
							Save & Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_REASON)">
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-permit-rationale [applicationTypeCode]="applicationTypeCode"></app-step-permit-rationale>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button class="large bordered mb-2" (click)="onSaveAndExit(STEP_RATIONALE)">
							Save & Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext(STEP_RATIONALE)">
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
export class StepsPermitUpdatesAuthenticatedComponent extends BaseWizardStepComponent implements OnInit, OnDestroy {
	workerLicenceTypeCode!: WorkerLicenceTypeCode;
	applicationTypeCode = ApplicationTypeCode.Update;

	readonly STEP_NAME_CHANGE = 0;
	readonly STEP_REPRINT = 1;
	readonly STEP_PHOTOGRAPH_OF_YOURSELF = 2;
	readonly STEP_REASON = 3;
	readonly STEP_RATIONALE = 4;

	hasBcscNameChanged = false;
	hasGenderChanged = false;

	private licenceModelChangedSubscription!: Subscription;

	@ViewChild(StepPermitReviewNameChangeComponent)
	stepNameChangeComponent!: StepPermitReviewNameChangeComponent;
	@ViewChild(StepPermitPhotographOfYourselfComponent)
	stepPhotographOfYourselfComponent!: StepPermitPhotographOfYourselfComponent;
	@ViewChild(StepPermitReasonComponent) stepReasonComponent!: StepPermitReasonComponent;
	@ViewChild(StepPermitRationaleComponent) stepRationaleComponent!: StepPermitRationaleComponent;
	@ViewChild(StepPermitReprintComponent) stepReprintComponent!: StepPermitReprintComponent;

	constructor(private permitApplicationService: PermitApplicationService) {
		super();
	}

	ngOnInit(): void {
		this.licenceModelChangedSubscription = this.permitApplicationService.permitModelValueChanges$.subscribe(
			(_resp: boolean) => {
				this.workerLicenceTypeCode = this.permitApplicationService.permitModelFormGroup.get(
					'workerLicenceTypeData.workerLicenceTypeCode'
				)?.value;

				this.hasBcscNameChanged = this.permitApplicationService.permitModelFormGroup.get(
					'personalInformationData.hasBcscNameChanged'
				)?.value;

				this.hasGenderChanged = this.permitApplicationService.permitModelFormGroup.get(
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
			case this.STEP_REPRINT:
				if (this.hasBcscNameChanged) {
					this.childstepper.previous();
					return;
				}
				break;
			case this.STEP_PHOTOGRAPH_OF_YOURSELF:
				if (this.showReprint) {
					this.childstepper.previous();
					return;
				}
				break;
			default:
				console.error('Unknown Form', step);
		}

		this.previousStepperStep.emit(true);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_NAME_CHANGE:
				return this.stepNameChangeComponent.isFormValid();
			case this.STEP_REPRINT:
				return this.stepReprintComponent.isFormValid();
			case this.STEP_PHOTOGRAPH_OF_YOURSELF:
				return this.stepPhotographOfYourselfComponent.isFormValid();
			case this.STEP_REASON:
				return this.stepReasonComponent.isFormValid();
			case this.STEP_RATIONALE:
				return this.stepRationaleComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	// for Update flow: only show if they changed their sex selection earlier in the application
	// and name change
	get showReprint(): boolean {
		return this.hasGenderChanged || this.hasBcscNameChanged;
	}
}
