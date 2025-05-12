import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, PermitAppCommandResponse, ServiceTypeCode } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { AppRoutes } from '@app/app-routes';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { PermitApplicationService } from '@app/core/services/permit-application.service';
import { UtilService } from '@app/core/services/util.service';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routes';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { StepsPermitContactComponent } from './permit-wizard-step-components/steps-permit-contact.component';
import { StepsPermitDetailsUpdateComponent } from './permit-wizard-step-components/steps-permit-details-update.component';
import { StepsPermitIdentificationAnonymousComponent } from './permit-wizard-step-components/steps-permit-identification-anonymous.component';
import { StepsPermitPurposeAnonymousComponent } from './permit-wizard-step-components/steps-permit-purpose.component-anonymous';
import { StepsPermitReviewAnonymousComponent } from './permit-wizard-step-components/steps-permit-review-anonymous.component';

@Component({
	selector: 'app-permit-wizard-anonymous-update',
	template: `
		<mat-stepper
			linear
			labelPosition="bottom"
			[orientation]="orientation"
			(selectionChange)="onStepSelectionChange($event)"
			#stepper
		>
			<mat-step [completed]="step1Complete">
				<ng-template matStepLabel>Permit Details</ng-template>
				<app-steps-permit-details-update
					[isLoggedIn]="false"
					[isFormValid]="isFormValid"
					[serviceTypeCode]="serviceTypeCode"
					[applicationTypeCode]="applicationTypeCode"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-permit-details-update>
			</mat-step>

			<mat-step [completed]="step2Complete">
				<ng-template matStepLabel>Purpose & Rationale</ng-template>
				<app-steps-permit-purpose-anonymous
					[isFormValid]="isFormValid"
					[showEmployerInformation]="showEmployerInformation"
					[serviceTypeCode]="serviceTypeCode"
					[applicationTypeCode]="applicationTypeCode"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-permit-purpose-anonymous>
			</mat-step>

			<mat-step [completed]="step3Complete">
				<ng-template matStepLabel>Identification</ng-template>
				<app-steps-permit-identification-anonymous
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					[serviceTypeCode]="serviceTypeCode"
					[showPhotographOfYourselfStep]="showPhotographOfYourselfStep"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-permit-identification-anonymous>
			</mat-step>

			<mat-step [completed]="step4Complete">
				<ng-template matStepLabel>Contact Information</ng-template>
				<app-steps-permit-contact
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					[showSaveAndExit]="false"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-permit-contact>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Review & Confirm</ng-template>
				<app-steps-permit-review-anonymous
					[serviceTypeCode]="serviceTypeCode"
					[applicationTypeCode]="applicationTypeCode"
					[showEmployerInformation]="showEmployerInformation"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextSubmitStep)="onSubmitStep()"
					(scrollIntoView)="onScrollIntoView()"
					(goToStep)="onGoToStep($event)"
				></app-steps-permit-review-anonymous>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Submit</ng-template>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	standalone: false,
})
export class PermitWizardAnonymousUpdateComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	readonly STEP_PERMIT_DETAILS = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_PURPOSE_AND_RATIONALE = 1;
	readonly STEP_IDENTIFICATION = 2;
	readonly STEP_CONTACT_INFORMATION = 3;
	readonly STEP_REVIEW_AND_CONFIRM = 4;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;
	step4Complete = false;

	newLicenceAppId: string | null = null;
	newLicenceCost = 0;

	@ViewChild(StepsPermitDetailsUpdateComponent)
	stepsPermitDetailsComponent!: StepsPermitDetailsUpdateComponent;
	@ViewChild(StepsPermitPurposeAnonymousComponent)
	stepsPermitPurposeComponent!: StepsPermitPurposeAnonymousComponent;
	@ViewChild(StepsPermitIdentificationAnonymousComponent)
	stepsPermitIdentificationComponent!: StepsPermitIdentificationAnonymousComponent;
	@ViewChild(StepsPermitContactComponent)
	stepsPermitContactComponent!: StepsPermitContactComponent;
	@ViewChild(StepsPermitReviewAnonymousComponent)
	stepsPermitReviewComponent!: StepsPermitReviewAnonymousComponent;

	isFormValid = false;
	showEmployerInformation = false;
	showPhotographOfYourselfStep = false;

	serviceTypeCode!: ServiceTypeCode;
	applicationTypeCode!: ApplicationTypeCode;

	private permitModelChangedSubscription!: Subscription;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private utilService: UtilService,
		private permitApplicationService: PermitApplicationService,
		private commonApplicationService: CommonApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		if (!this.permitApplicationService.initialized) {
			this.router.navigateByUrl(AppRoutes.path(AppRoutes.LANDING));
			return;
		}

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.permitModelChangedSubscription = this.permitApplicationService.permitModelValueChanges$.subscribe(
			(_resp: any) => {
				this.isFormValid = _resp;

				this.serviceTypeCode = this.permitApplicationService.permitModelFormGroup.get(
					'serviceTypeData.serviceTypeCode'
				)?.value;
				this.applicationTypeCode = this.permitApplicationService.permitModelFormGroup.get(
					'applicationTypeData.applicationTypeCode'
				)?.value;

				this.showEmployerInformation = this.permitApplicationService.getShowEmployerInformation(this.serviceTypeCode);

				const hasGenderChanged = !!this.permitApplicationService.permitModelFormGroup.get(
					'personalInformationData.hasGenderChanged'
				)?.value;

				const photoOfYourselfExpired = !!this.permitApplicationService.permitModelFormGroup.get(
					'originalLicenceData.originalPhotoOfYourselfExpired'
				)?.value;

				// Show this step if gender has changed, photo has expired or is missing
				this.showPhotographOfYourselfStep = hasGenderChanged || photoOfYourselfExpired;

				this.updateCompleteStatus();
			}
		);
	}

	ngOnDestroy() {
		if (this.permitModelChangedSubscription) this.permitModelChangedSubscription.unsubscribe();
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

	onNextStepperStep(stepper: MatStepper): void {
		if (stepper?.selected) stepper.selected.completed = true;
		stepper.next();
	}

	onGoToStep(step: number) {
		this.stepsPermitDetailsComponent?.onGoToFirstStep();
		this.stepsPermitPurposeComponent?.onGoToFirstStep();
		this.stepsPermitIdentificationComponent?.onGoToFirstStep();
		this.stepsPermitContactComponent?.onGoToFirstStep();
		this.stepper.selectedIndex = step;
	}

	onGoToReview() {
		setTimeout(() => {
			// hack... does not navigate without the timeout
			this.stepper.selectedIndex = this.STEP_REVIEW_AND_CONFIRM;
		}, 250);
	}

	onChildNextStep() {
		const component = this.getSelectedIndexComponent(this.stepper.selectedIndex);
		component?.onGoToNextStep();
	}

	onSubmitStep(): void {
		if (this.newLicenceAppId) {
			if (this.newLicenceCost > 0) {
				this.stepsPermitReviewComponent?.onGoToLastStep();
			} else {
				this.router.navigateByUrl(
					PersonalLicenceApplicationRoutes.path(PersonalLicenceApplicationRoutes.PERMIT_UPDATE_SUCCESS)
				);
			}
		} else {
			this.permitApplicationService.submitPermitAnonymous().subscribe({
				next: (resp: StrictHttpResponse<PermitAppCommandResponse>) => {
					console.debug('[onSubmitStep] submitPermitAnonymous', resp.body);

					const workerLicenceCommandResponse = resp.body;

					// save this locally just in application payment fails
					this.newLicenceAppId = workerLicenceCommandResponse.licenceAppId!;
					this.newLicenceCost = workerLicenceCommandResponse.cost ?? 0;

					const successMessage = this.commonApplicationService.getSubmitSuccessMessage(
						this.serviceTypeCode,
						this.applicationTypeCode
					);
					this.utilService.toasterSuccess(successMessage);

					if (this.newLicenceCost > 0) {
						this.stepsPermitReviewComponent?.onGoToLastStep();
					} else {
						this.router.navigateByUrl(
							PersonalLicenceApplicationRoutes.path(PersonalLicenceApplicationRoutes.PERMIT_UPDATE_SUCCESS)
						);
					}
				},
				error: (error: any) => {
					console.log('An error occurred during save', error);
				},
			});
		}
	}

	onNextPayStep(): void {
		this.payNow(this.newLicenceAppId!);
	}

	private getSelectedIndexComponent(index: number): any {
		switch (index) {
			case this.STEP_PERMIT_DETAILS:
				return this.stepsPermitDetailsComponent;
			case this.STEP_PURPOSE_AND_RATIONALE:
				return this.stepsPermitPurposeComponent;
			case this.STEP_IDENTIFICATION:
				return this.stepsPermitIdentificationComponent;
			case this.STEP_CONTACT_INFORMATION:
				return this.stepsPermitContactComponent;
			case this.STEP_REVIEW_AND_CONFIRM:
				return this.stepsPermitReviewComponent;
		}
		return null;
	}

	private updateCompleteStatus(): void {
		this.step1Complete = this.permitApplicationService.isStepPermitDetailsComplete();
		this.step2Complete = this.permitApplicationService.isStepPurposeAndRationaleComplete();
		this.step3Complete = this.permitApplicationService.isStepIdentificationComplete();
		this.step4Complete = this.permitApplicationService.isStepContactComplete();

		console.debug('Complete Status', this.step1Complete, this.step2Complete, this.step3Complete, this.step4Complete);
	}

	private payNow(licenceAppId: string): void {
		this.commonApplicationService.payNowPersonalLicenceAnonymous(licenceAppId);
	}
}
