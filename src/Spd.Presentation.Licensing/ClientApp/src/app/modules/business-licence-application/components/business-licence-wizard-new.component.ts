import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, BizTypeCode, ServiceTypeCode } from '@app/api/models';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { BusinessLicenceApplicationRoutes } from '@app/modules/business-licence-application/business-license-application-routes';
import { Subscription, distinctUntilChanged } from 'rxjs';

import { StepsBusinessLicenceContactInformationComponent } from './steps-business-licence-contact-information.component';
import { StepsBusinessLicenceControllingMembersComponent } from './steps-business-licence-controlling-members.component';
import { StepsBusinessLicenceInformationComponent } from './steps-business-licence-information.component';
import { StepsBusinessLicenceReviewComponent } from './steps-business-licence-review.component';
import { StepsBusinessLicenceSelectionComponent } from './steps-business-licence-selection.component';
import { StepsBusinessLicenceSpEmployeesComponent } from './steps-business-licence-sp-employees.component';

@Component({
	selector: 'app-business-licence-wizard-new',
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
		      [showSaveAndExit]="showSaveAndExit"
		      [applicationTypeCode]="applicationTypeCode"
		      [isBusinessLicenceSoleProprietor]="isBusinessLicenceSoleProprietor"
		      [isSoleProprietorSimultaneousFlow]="isSoleProprietorSimultaneousFlow"
		      (childNextStep)="onChildNextStep()"
		      (saveAndExit)="onSaveAndExit()"
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
		      [showSaveAndExit]="showSaveAndExit"
		      (childNextStep)="onChildNextStep()"
		      (saveAndExit)="onSaveAndExit()"
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
		        [showSaveAndExit]="showSaveAndExit"
		        (childNextStep)="onChildNextStep()"
		        (saveAndExit)="onSaveAndExit()"
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
		        [showSaveAndExit]="showSaveAndExit"
		        (childNextStep)="onChildNextStep()"
		        (saveAndExit)="onSaveAndExit()"
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
		        [showSaveAndExit]="showSaveAndExit"
		        [isBusinessStakeholdersWithoutSwlExist]="isBusinessStakeholdersWithoutSwlExist"
		        (childNextStep)="onChildNextStep()"
		        (saveAndExit)="onSaveAndExit()"
		        (nextReview)="onGoToReview()"
		        (previousStepperStep)="onPreviousStepperStep(stepper)"
		        (nextStepperStep)="onNextStepperStep(stepper)"
		        (scrollIntoView)="onScrollIntoView()"
		      ></app-steps-business-licence-controlling-members>
		    </mat-step>
		  }
		
		  <mat-step completed="false">
		    <ng-template matStepLabel>Business Licence Review</ng-template>
		    <app-steps-business-licence-review
		      [applicationTypeCode]="applicationTypeCode"
		      [showSaveAndExit]="showSaveAndExit"
		      [isBusinessLicenceSoleProprietor]="isBusinessLicenceSoleProprietor"
		      [isSoleProprietorSimultaneousFlow]="false"
		      [isBusinessStakeholdersWithoutSwlExist]="isBusinessStakeholdersWithoutSwlExist"
		      (saveAndExit)="onSaveAndExit()"
		      (previousStepperStep)="onPreviousStepperStep(stepper)"
		      (nextPayStep)="onNextSubmit()"
		      (nextSubmitStep)="onNextSubmit()"
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
	standalone: false,
})
export class BusinessLicenceWizardNewComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	readonly STEP_BUSINESS_INFORMATION = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_LICENCE_SELECTION = 1;
	readonly STEP_CONTACT_INFORMATION = 2;
	readonly STEP_CONTROLLING_MEMBERS = 3;
	readonly STEP_SP_EMPLOYEES = 2;
	readonly STEP_REVIEW_AND_CONFIRM = 4;
	readonly STEP_SP_REVIEW_AND_CONFIRM = 3;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;
	step4Complete = false;

	isFormValid = false;
	showSaveAndExit = true;

	serviceTypeCode!: ServiceTypeCode;
	applicationTypeCode!: ApplicationTypeCode;
	bizTypeCode!: BizTypeCode;
	isBusinessLicenceSoleProprietor!: boolean;
	isSoleProprietorSimultaneousFlow!: boolean;
	isBusinessStakeholdersWithoutSwlExist!: boolean;

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
		private commonApplicationService: CommonApplicationService,
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
		this.businessApplicationService.payBusinessLicenceNew();
	}

	onNextStepperStep(stepper: MatStepper): void {
		this.saveStep(stepper);
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
		if (this.businessApplicationService.isAutoSave()) {
			this.businessApplicationService.partialSaveBusinessLicenceStep().subscribe({
				next: (_resp: any) => {
					setTimeout(() => {
						// hack... does not navigate without the timeout
						this.goToReviewStep();
					}, 250);
				},
				error: (error: HttpErrorResponse) => {
					this.handlePartialSaveError(error);
				},
			});
		} else {
			this.goToReviewStep();
		}
	}

	onChildNextStep() {
		this.saveStep();
	}

	onSaveAndExit(): void {
		if (!this.businessApplicationService.isSaveAndExit()) {
			return;
		}

		this.businessApplicationService.partialSaveBusinessLicenceStep(true).subscribe({
			next: (_resp: any) => {
				this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessApplications());
			},
			error: (error: HttpErrorResponse) => {
				this.handlePartialSaveError(error);
			},
		});
	}

	private saveStep(stepper?: MatStepper): void {
		if (this.businessApplicationService.isAutoSave()) {
			this.businessApplicationService.partialSaveBusinessLicenceStep().subscribe({
				next: (_resp: any) => {
					if (stepper) {
						if (stepper?.selected) stepper.selected.completed = true;
						stepper.next();
					} else {
						this.goToChildNextStep();
					}
				},
				error: (error: HttpErrorResponse) => {
					this.handlePartialSaveError(error);
				},
			});
		} else if (stepper) {
			if (stepper?.selected) stepper.selected.completed = true;
			stepper.next();
		} else {
			this.goToChildNextStep();
		}
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
				case this.STEP_SP_EMPLOYEES:
					return this.stepsSpEmployeesComponent;
				case this.STEP_SP_REVIEW_AND_CONFIRM:
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
			this.stepper.selectedIndex = this.STEP_SP_REVIEW_AND_CONFIRM;
		} else {
			this.stepper.selectedIndex = this.STEP_REVIEW_AND_CONFIRM;
		}
	}

	private handlePartialSaveError(error: HttpErrorResponse): void {
		// only 403s will be here as an error
		if (error.status == 403) {
			this.commonApplicationService.handleDuplicateBusinessLicence();
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
