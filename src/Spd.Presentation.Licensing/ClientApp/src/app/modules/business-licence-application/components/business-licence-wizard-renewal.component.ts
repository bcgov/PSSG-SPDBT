import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, BizTypeCode, ServiceTypeCode } from '@app/api/models';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { BusinessLicenceApplicationRoutes } from '../business-license-application-routes';
import { StepsBusinessLicenceContactInformationComponent } from './steps-business-licence-contact-information.component';
import { StepsBusinessLicenceControllingMembersComponent } from './steps-business-licence-controlling-members.component';
import { StepsBusinessLicenceInformationComponent } from './steps-business-licence-information.component';
import { StepsBusinessLicenceReviewComponent } from './steps-business-licence-review.component';
import { StepsBusinessLicenceSelectionComponent } from './steps-business-licence-selection.component';
import { StepsBusinessLicenceSpEmployeesComponent } from './steps-business-licence-sp-employees.component';

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
					[isSoleProprietorSimultaneousFlow]="isSoleProprietorSimultaneousFlow"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-business-licence-information>
			</mat-step>

			<mat-step [completed]="step2Complete">
				<ng-template matStepLabel>Licence Selection</ng-template>
				<app-steps-business-licence-selection
					[serviceTypeCode]="serviceTypeCode"
					[applicationTypeCode]="applicationTypeCode"
					[bizTypeCode]="bizTypeCode"
					[isBusinessLicenceSoleProprietor]="isBusinessLicenceSoleProprietor"
					[isFormValid]="isFormValid"
					[showSaveAndExit]="false"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-business-licence-selection>
			</mat-step>

			@if (!isBusinessLicenceSoleProprietor) {
				<mat-step [completed]="step3Complete">
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
			}

			@if (isBusinessLicenceSoleProprietor) {
				<mat-step [completed]="step4Complete">
					<ng-template matStepLabel>Employees</ng-template>
					<app-steps-business-licence-sp-employees
						[applicationTypeCode]="applicationTypeCode"
						[isFormValid]="isFormValid"
						[showSaveAndExit]="false"
						(childNextStep)="onChildNextStep()"
						(nextReview)="onGoToReview()"
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(nextStepperStep)="onNextStepperStep(stepper)"
						(scrollIntoView)="onScrollIntoView()"
					></app-steps-business-licence-sp-employees>
				</mat-step>
			}

			@if (!isBusinessLicenceSoleProprietor) {
				<mat-step [completed]="step4Complete">
					<ng-template matStepLabel>Controlling Members, Business Managers & Employees</ng-template>
					<app-steps-business-licence-controlling-members
						[applicationTypeCode]="applicationTypeCode"
						[isFormValid]="isFormValid"
						[showSaveAndExit]="false"
						[isBusinessStakeholdersWithoutSwlExist]="isBusinessStakeholdersWithoutSwlExist"
						(childNextStep)="onChildNextStep()"
						(nextReview)="onGoToReview()"
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(nextStepperStep)="onNextStepperStep(stepper)"
						(scrollIntoView)="onScrollIntoView()"
					></app-steps-business-licence-controlling-members>
				</mat-step>
			}

			<mat-step completed="false">
				<ng-template matStepLabel>Review & Confirm</ng-template>
				<app-steps-business-licence-review
					[applicationTypeCode]="applicationTypeCode"
					[isBusinessLicenceSoleProprietor]="isBusinessLicenceSoleProprietor"
					[isSoleProprietorSimultaneousFlow]="false"
					[isBusinessStakeholdersWithoutSwlExist]="isBusinessStakeholdersWithoutSwlExist"
					[showSaveAndExit]="false"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextPayStep)="onNextSubmit()"
					(nextSubmitStep)="onNextSubmit()"
					(scrollIntoView)="onScrollIntoView()"
					(goToStep)="onGoToStep($event)"
				></app-steps-business-licence-review>
			</mat-step>

			@if (showPayStep) {
				<mat-step completed="false">
					<ng-template matStepLabel>Pay</ng-template>
				</mat-step>
			}
		</mat-stepper>
	`,
	styles: [],
	standalone: false,
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

	serviceTypeCode!: ServiceTypeCode;
	applicationTypeCode!: ApplicationTypeCode;
	bizTypeCode!: BizTypeCode;
	isBusinessLicenceSoleProprietor!: boolean;
	isSoleProprietorSimultaneousFlow!: boolean;
	isBusinessStakeholdersWithoutSwlExist!: boolean;
	showPayStep!: boolean;

	private businessModelValueChangedSubscription!: Subscription;

	@ViewChild(StepsBusinessLicenceInformationComponent)
	stepsBusinessInformationComponent!: StepsBusinessLicenceInformationComponent;
	@ViewChild(StepsBusinessLicenceSelectionComponent)
	stepsLicenceSelectionComponent!: StepsBusinessLicenceSelectionComponent;
	@ViewChild(StepsBusinessLicenceContactInformationComponent)
	stepsContactInformationComponent!: StepsBusinessLicenceContactInformationComponent;
	@ViewChild(StepsBusinessLicenceControllingMembersComponent)
	stepsControllingMembersComponent!: StepsBusinessLicenceControllingMembersComponent;
	@ViewChild(StepsBusinessLicenceSpEmployeesComponent)
	stepsSpEmployeesComponent!: StepsBusinessLicenceSpEmployeesComponent;
	@ViewChild(StepsBusinessLicenceReviewComponent)
	stepsReviewAndConfirm!: StepsBusinessLicenceReviewComponent;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private businessApplicationService: BusinessApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		if (!this.businessApplicationService.initialized) {
			this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessLicence());
			return;
		}

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.businessModelValueChangedSubscription = this.businessApplicationService.businessModelValueChanges$.subscribe(
			(_resp: boolean) => {
				this.serviceTypeCode = this.businessApplicationService.businessModelFormGroup.get(
					'serviceTypeData.serviceTypeCode'
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
				this.isSoleProprietorSimultaneousFlow =
					this.businessApplicationService.businessModelFormGroup.get('isSoleProprietorSimultaneousFlow')?.value ??
					false;

				this.isBusinessStakeholdersWithoutSwlExist = this.businessApplicationService.businessModelFormGroup.get(
					'isBusinessStakeholdersWithoutSwlExist'
				)?.value;

				this.showPayStep =
					this.isBusinessLicenceSoleProprietor ||
					(!this.isBusinessLicenceSoleProprietor && !this.isBusinessStakeholdersWithoutSwlExist);

				this.isFormValid = _resp;

				this.updateCompleteStatus();
			}
		);
	}

	ngOnDestroy() {
		if (this.businessModelValueChangedSubscription) this.businessModelValueChangedSubscription.unsubscribe();
	}

	override onStepSelectionChange(event: StepperSelectionEvent) {
		const component = this.getSelectedIndexComponent(event.selectedIndex);
		component?.onGoToFirstStep();

		super.onStepSelectionChange(event);
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();

		const component = this.getSelectedIndexComponent(stepper.selectedIndex);
		component?.onGoToLastStep();
	}

	onNextSubmit(): void {
		this.businessApplicationService.payBusinessLicenceRenewal();
	}

	onNextStepperStep(stepper: MatStepper): void {
		if (stepper?.selected) stepper.selected.completed = true;
		stepper.next();
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
		const component = this.getSelectedIndexComponent(this.stepper.selectedIndex);
		component?.onGoToNextStep();
	}

	private getSelectedIndexComponent(index: number): any {
		if (this.isBusinessLicenceSoleProprietor) {
			switch (index) {
				case this.STEP_BUSINESS_INFORMATION:
					return this.stepsBusinessInformationComponent;
				case this.STEP_LICENCE_SELECTION:
					return this.stepsLicenceSelectionComponent;
				case this.STEP_CONTROLLING_MEMBERS:
					return this.stepsSpEmployeesComponent;
				case this.STEP_REVIEW_AND_CONFIRM_SOLE_PROPRIETOR:
					return this.stepsReviewAndConfirm;
			}
		} else {
			switch (index) {
				case this.STEP_BUSINESS_INFORMATION:
					return this.stepsBusinessInformationComponent;
				case this.STEP_LICENCE_SELECTION:
					return this.stepsLicenceSelectionComponent;
				case this.STEP_CONTACT_INFORMATION:
					return this.stepsContactInformationComponent;
				case this.STEP_CONTROLLING_MEMBERS:
					return this.stepsControllingMembersComponent;
				case this.STEP_REVIEW_AND_CONFIRM:
					return this.stepsReviewAndConfirm;
			}
		}
		return null;
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
		this.step4Complete = this.businessApplicationService.isStepBusinessStakeholdersComplete();

		console.debug('Complete Status', this.step1Complete, this.step2Complete, this.step3Complete, this.step4Complete);
	}
}
