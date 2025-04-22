import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { MetalDealersAndRecyclersRoutes } from '@app/modules/metal-dealers-and-recyclers/metal-dealers-and-recyclers-routes';
import { distinctUntilChanged, Subscription } from 'rxjs';
import { StepsMdraBranchesComponent } from './steps-mdra-branches.component';
import { StepsMdraBusinessInfoComponent } from './steps-mdra-business-info.component';
import { StepsMdraDetailsComponent } from './steps-mdra-details.component';
import { StepsMdraReviewAndConfirmComponent } from './steps-mdra-review-and-confirm.component';

@Component({
	selector: 'app-mdra-wizard-new-renewal',
	template: `
		<mat-stepper
			linear
			labelPosition="bottom"
			[orientation]="orientation"
			(selectionChange)="onStepSelectionChange($event)"
			#stepper
		>
			<mat-step [completed]="step1Complete">
				<ng-template matStepLabel>Checklist</ng-template>

				<app-steps-mdra-details
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-mdra-details>
			</mat-step>

			<mat-step [completed]="step2Complete">
				<ng-template matStepLabel>Business Information</ng-template>

				<app-steps-mdra-business-info
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-mdra-business-info>
			</mat-step>

			<mat-step [completed]="step3Complete">
				<ng-template matStepLabel>Branch Offices</ng-template>

				<app-steps-mdra-branches
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-mdra-branches>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Review & Confirm</ng-template>

				<app-steps-mdra-review-and-confirm
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onSubmit()"
					(scrollIntoView)="onScrollIntoView()"
					(goToStep)="onGoToStep($event)"
				></app-steps-mdra-review-and-confirm>
			</mat-step>
		</mat-stepper>
	`,
	styles: ``,
	standalone: false,
})
export class MdraWizardNewRenewalComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	step1Complete = false;
	step2Complete = false;
	step3Complete = false;

	readonly STEP_CHECKLIST = 0;
	readonly STEP_BUSINESS_INFO = 1;
	readonly STEP_BRANCH_OFFICES = 2;
	readonly STEP_REVIEW_AND_CONFIRM = 3;

	@ViewChild(StepsMdraDetailsComponent) stepChecklist!: StepsMdraDetailsComponent;
	@ViewChild(StepsMdraBusinessInfoComponent) stepsBusinessInfo!: StepsMdraBusinessInfoComponent;
	@ViewChild(StepsMdraBranchesComponent) stepBranches!: StepsMdraBranchesComponent;
	@ViewChild(StepsMdraReviewAndConfirmComponent) stepReview!: StepsMdraReviewAndConfirmComponent;

	isFormValid = false;
	applicationTypeCode!: ApplicationTypeCode;

	private mdraModelValueChangedSubscription!: Subscription;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private metalDealersApplicationService: MetalDealersApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		if (!this.metalDealersApplicationService.initialized) {
			this.router.navigateByUrl(MetalDealersAndRecyclersRoutes.path());
			return;
		}

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.mdraModelValueChangedSubscription =
			this.metalDealersApplicationService.metalDealersModelValueChanges$.subscribe((_resp: boolean) => {
				this.isFormValid = _resp;

				this.applicationTypeCode = this.metalDealersApplicationService.metalDealersModelFormGroup.get(
					'applicationTypeData.applicationTypeCode'
				)?.value;

				this.updateCompleteStatus();
			});
	}

	ngOnDestroy() {
		if (this.mdraModelValueChangedSubscription) this.mdraModelValueChangedSubscription.unsubscribe();
	}

	onSubmit(): void {
		// TODO mdra submit
	}

	override onStepSelectionChange(event: StepperSelectionEvent) {
		const index = event.selectedIndex;
		switch (index) {
			case this.STEP_CHECKLIST:
				this.stepChecklist?.onGoToFirstStep();
				break;
			case this.STEP_BUSINESS_INFO:
				this.stepsBusinessInfo?.onGoToFirstStep();
				break;
			case this.STEP_BRANCH_OFFICES:
				this.stepBranches?.onGoToFirstStep();
				break;
			case this.STEP_REVIEW_AND_CONFIRM:
				this.stepReview?.onGoToFirstStep();
				break;
		}

		super.onStepSelectionChange(event);
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();

		const index = stepper.selectedIndex;
		switch (index) {
			case this.STEP_CHECKLIST:
				this.stepChecklist?.onGoToLastStep();
				break;
			case this.STEP_BUSINESS_INFO:
				this.stepsBusinessInfo?.onGoToLastStep();
				break;
			case this.STEP_BRANCH_OFFICES:
				this.stepBranches?.onGoToLastStep();
				break;
		}
	}

	onNextStepperStep(stepper: MatStepper): void {
		if (stepper?.selected) stepper.selected.completed = true;
		stepper.next();
	}

	onGoToReview() {
		this.stepper.selectedIndex = this.STEP_REVIEW_AND_CONFIRM;
	}

	onGoToStep(stepIndex: number) {
		this.stepChecklist?.onGoToFirstStep();
		this.stepsBusinessInfo?.onGoToFirstStep();
		this.stepBranches?.onGoToFirstStep();
		this.stepReview?.onGoToFirstStep();

		this.stepper.selectedIndex = stepIndex;
	}

	onChildNextStep() {
		const index = this.stepper.selectedIndex;
		switch (index) {
			case this.STEP_CHECKLIST:
				this.stepChecklist?.onGoToNextStep();
				break;
			case this.STEP_BUSINESS_INFO:
				this.stepsBusinessInfo?.onGoToNextStep();
				break;
			case this.STEP_BRANCH_OFFICES:
				this.stepBranches?.onGoToNextStep();
				break;
		}
	}

	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}

	private updateCompleteStatus(): void {
		this.step2Complete = this.metalDealersApplicationService.isStepBusinessInfoComplete();
		this.step3Complete = this.metalDealersApplicationService.isStepBranchOfficesComplete();

		console.debug('Complete Status', this.step2Complete, this.step3Complete);
	}
}
