import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ApplicationTypeCode, BizTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { StepsBusinessLicenceContactInformationComponent } from './steps-business-licence-contact-information.component';
import { StepsBusinessLicenceControllingMembersComponent } from './steps-business-licence-controlling-members.component';
import { StepsBusinessLicenceInformationComponent } from './steps-business-licence-information.component';
import { StepsBusinessLicenceReviewComponent } from './steps-business-licence-review.component';
import { StepsBusinessLicenceSelectionComponent } from './steps-business-licence-selection.component';

@Component({
	selector: 'app-business-licence-wizard-renewal',
	template: `
		<mat-stepper
			linear
			labelPosition="bottom"
			[orientation]="orientation"
			(selectionChange)="onStepSelectionChange($event)"
			#stepper
		>
			<mat-step [completed]="step1Complete">
				<ng-template matStepLabel>Business Information</ng-template>
				<app-steps-business-licence-information
					[isFormValid]="isFormValid"
					[showSaveAndExit]="false"
					[applicationTypeCode]="applicationTypeCode"
					[isBusinessLicenceSoleProprietor]="isBusinessLicenceSoleProprietor"
					[isRenewalShortForm]="isRenewalShortForm"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
					(renewalShortForm)="onRenewalShortForm($event)"
				></app-steps-business-licence-information>
			</mat-step>

			<mat-step [completed]="step2Complete">
				<ng-template matStepLabel>Licence Selection</ng-template>
				<app-steps-business-licence-selection
					[workerLicenceTypeCode]="workerLicenceTypeCode"
					[applicationTypeCode]="applicationTypeCode"
					[bizTypeCode]="bizTypeCode"
					[isBusinessLicenceSoleProprietor]="isBusinessLicenceSoleProprietor"
					[isFormValid]="isFormValid"
					[showSaveAndExit]="false"
					[isRenewalShortForm]="isRenewalShortForm"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-business-licence-selection>
			</mat-step>

			<mat-step [completed]="step3Complete" *ngIf="!isBusinessLicenceSoleProprietor && !isRenewalShortForm">
				<ng-template matStepLabel>Contact Information</ng-template>
				<app-steps-business-licence-contact-information
					[applicationTypeCode]="applicationTypeCode"
					[isFormValid]="isFormValid"
					[showSaveAndExit]="false"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-business-licence-contact-information>
			</mat-step>

			<mat-step [completed]="step4Complete" *ngIf="!isBusinessLicenceSoleProprietor && !isRenewalShortForm">
				<ng-template matStepLabel>Controlling Members & Employees</ng-template>
				<app-steps-business-licence-controlling-members
					[applicationTypeCode]="applicationTypeCode"
					[isFormValid]="isFormValid"
					[showSaveAndExit]="false"
					[nonSwlControllingMembersExist]="nonSwlControllingMembersExist"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-business-licence-controlling-members>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Review & Confirm</ng-template>
				<app-steps-business-licence-review
					[workerLicenceTypeCode]="workerLicenceTypeCode"
					[applicationTypeCode]="applicationTypeCode"
					[isRenewalShortForm]="isRenewalShortForm"
					[showSaveAndExit]="false"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextPayStep)="onNextPayStep()"
					(scrollIntoView)="onScrollIntoView()"
					(goToStep)="onGoToStep($event)"
				></app-steps-business-licence-review>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Pay</ng-template>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
})
export class BusinessLicenceWizardRenewalComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	readonly STEP_BUSINESS_INFORMATION = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_LICENCE_SELECTION = 1;
	readonly STEP_CONTACT_INFORMATION = 2;
	readonly STEP_CONTROLLING_MEMBERS = 3;
	readonly STEP_REVIEW_AND_CONFIRM = 4;
	readonly STEP_REVIEW_AND_CONFIRM_SOLE_PROPRIETOR = 3;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;
	step4Complete = false;

	isFormValid = false;
	nonSwlControllingMembersExist = false;
	isRenewalShortForm = false;

	workerLicenceTypeCode!: WorkerLicenceTypeCode;
	applicationTypeCode!: ApplicationTypeCode;
	bizTypeCode!: BizTypeCode;

	isBusinessLicenceSoleProprietor!: boolean;
	private businessModelValueChangedSubscription!: Subscription;

	@ViewChild(StepsBusinessLicenceInformationComponent)
	stepsBusinessInformationComponent!: StepsBusinessLicenceInformationComponent;
	@ViewChild(StepsBusinessLicenceSelectionComponent)
	stepsLicenceSelectionComponent!: StepsBusinessLicenceSelectionComponent;
	@ViewChild(StepsBusinessLicenceContactInformationComponent)
	stepsContactInformationComponent!: StepsBusinessLicenceContactInformationComponent;
	@ViewChild(StepsBusinessLicenceControllingMembersComponent)
	stepsControllingMembersComponent!: StepsBusinessLicenceControllingMembersComponent;
	@ViewChild(StepsBusinessLicenceReviewComponent)
	stepsReviewAndConfirm!: StepsBusinessLicenceReviewComponent;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private businessApplicationService: BusinessApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.businessModelValueChangedSubscription = this.businessApplicationService.businessModelValueChanges$.subscribe(
			(_resp: boolean) => {
				this.workerLicenceTypeCode = this.businessApplicationService.businessModelFormGroup.get(
					'workerLicenceTypeData.workerLicenceTypeCode'
				)?.value;
				this.applicationTypeCode = this.businessApplicationService.businessModelFormGroup.get(
					'applicationTypeData.applicationTypeCode'
				)?.value;
				this.bizTypeCode = this.businessApplicationService.businessModelFormGroup.get(
					'businessInformationData.bizTypeCode'
				)?.value;

				this.isBusinessLicenceSoleProprietor = this.businessApplicationService.businessModelFormGroup.get(
					'isBusinessLicenceSoleProprietor'
				)?.value;

				const membersWithoutSwl = this.businessApplicationService.businessModelFormGroup.get(
					'controllingMembersData.membersWithoutSwl'
				)?.value;
				this.nonSwlControllingMembersExist = membersWithoutSwl?.length > 0;

				this.isFormValid = _resp;

				this.updateCompleteStatus();
			}
		);
	}

	ngOnDestroy() {
		if (this.businessModelValueChangedSubscription) this.businessModelValueChangedSubscription.unsubscribe();
	}

	override onStepSelectionChange(event: StepperSelectionEvent) {
		switch (event.selectedIndex) {
			case this.STEP_BUSINESS_INFORMATION:
				this.stepsBusinessInformationComponent?.onGoToFirstStep();
				break;
			case this.STEP_LICENCE_SELECTION:
				this.stepsLicenceSelectionComponent?.onGoToFirstStep();
				break;
			case this.STEP_CONTACT_INFORMATION:
				this.stepsContactInformationComponent?.onGoToFirstStep();
				break;
			case this.STEP_CONTROLLING_MEMBERS:
				// If Sole Proprietor biz type, this step is not the controlling members step,
				// but the review step
				if (this.isBusinessLicenceSoleProprietor) {
					this.stepsReviewAndConfirm?.onGoToFirstStep();
				} else {
					this.stepsControllingMembersComponent?.onGoToFirstStep();
				}
				break;
			case this.STEP_REVIEW_AND_CONFIRM:
			case this.STEP_REVIEW_AND_CONFIRM_SOLE_PROPRIETOR:
				this.stepsReviewAndConfirm?.onGoToFirstStep();
				break;
		}

		super.onStepSelectionChange(event);
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();

		switch (stepper.selectedIndex) {
			case this.STEP_BUSINESS_INFORMATION:
				this.stepsBusinessInformationComponent?.onGoToLastStep();
				break;
			case this.STEP_LICENCE_SELECTION:
				this.stepsLicenceSelectionComponent?.onGoToLastStep();
				break;
			case this.STEP_CONTACT_INFORMATION:
				this.stepsContactInformationComponent?.onGoToLastStep();
				break;
			case this.STEP_CONTROLLING_MEMBERS:
				this.stepsControllingMembersComponent?.onGoToLastStep();
				break;
			case this.STEP_REVIEW_AND_CONFIRM:
			case this.STEP_REVIEW_AND_CONFIRM_SOLE_PROPRIETOR:
				this.stepsReviewAndConfirm?.onGoToLastStep();
				break;
		}
	}

	onNextPayStep(): void {
		this.businessApplicationService.payBusinessLicenceRenewalOrUpdateOrReplace({
			paymentSuccess: 'Your business licence renewal has been successfully submitted',
			paymentReason: 'Payment for renewal of Business Licence application',
		});
	}

	onNextStepperStep(stepper: MatStepper): void {
		if (stepper?.selected) stepper.selected.completed = true;
		stepper.next();
	}

	onRenewalShortForm(isShortForm: boolean) {
		this.businessApplicationService.businessModelFormGroup.patchValue(
			{ isRenewalShortForm: isShortForm },
			{ emitEvent: false }
		);
		this.isRenewalShortForm = isShortForm;
		this.goToChildNextStep();
	}

	onGoToStep(step: number) {
		this.stepsBusinessInformationComponent?.onGoToFirstStep();
		this.stepsLicenceSelectionComponent?.onGoToFirstStep();
		this.stepsContactInformationComponent?.onGoToFirstStep();
		this.stepsControllingMembersComponent?.onGoToFirstStep();
		this.stepsReviewAndConfirm?.onGoToFirstStep();
		this.stepper.selectedIndex = step;
	}

	onGoToReview() {
		this.goToReviewStep();
	}

	onChildNextStep() {
		this.goToChildNextStep();
	}

	private goToChildNextStep() {
		switch (this.stepper.selectedIndex) {
			case this.STEP_BUSINESS_INFORMATION:
				this.stepsBusinessInformationComponent?.onGoToNextStep();
				break;
			case this.STEP_LICENCE_SELECTION:
				this.stepsLicenceSelectionComponent?.onGoToNextStep();
				break;
			case this.STEP_CONTACT_INFORMATION:
				this.stepsContactInformationComponent?.onGoToNextStep();
				break;
			case this.STEP_CONTROLLING_MEMBERS:
				this.stepsControllingMembersComponent?.onGoToNextStep();
				break;
			case this.STEP_REVIEW_AND_CONFIRM:
				this.stepsReviewAndConfirm?.onGoToNextStep();
				break;
		}
	}

	private goToReviewStep(): void {
		if (this.isBusinessLicenceSoleProprietor) {
			this.stepper.selectedIndex = this.STEP_REVIEW_AND_CONFIRM_SOLE_PROPRIETOR;
		} else {
			this.stepper.selectedIndex = this.STEP_REVIEW_AND_CONFIRM;
		}
	}

	private updateCompleteStatus(): void {
		this.step1Complete = this.businessApplicationService.isStepBackgroundInformationComplete();
		this.step2Complete = this.businessApplicationService.isStepLicenceSelectionComplete();
		this.step3Complete = this.businessApplicationService.isStepContactInformationComplete();
		this.step4Complete = this.businessApplicationService.isStepControllingMembersAndEmployeesComplete();

		console.debug('Complete Status', this.step1Complete, this.step2Complete, this.step3Complete, this.step4Complete);
	}
}