import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, PermitAppCommandResponse, WorkerLicenceTypeCode } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routing.module';
import { ApplicationService } from '@app/core/services/application.service';
import { PermitApplicationService } from '@core/services/permit-application.service';
import { HotToastService } from '@ngneat/hot-toast';
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
				<ng-template matStepLabel> Permit Details </ng-template>
				<app-steps-permit-details-update
					[isLoggedIn]="false"
					[isFormValid]="isFormValid"
					[workerLicenceTypeCode]="workerLicenceTypeCode"
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
					[workerLicenceTypeCode]="workerLicenceTypeCode"
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
					[workerLicenceTypeCode]="workerLicenceTypeCode"
					[applicationTypeCode]="applicationTypeCode"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextSubmitStep)="onSubmitStep()"
					(scrollIntoView)="onScrollIntoView()"
					(goToStep)="onGoToStep($event)"
				></app-steps-permit-review-anonymous>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Pay</ng-template>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
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
	stepReviewLicenceComponent!: StepsPermitReviewAnonymousComponent;

	isFormValid = false;
	showEmployerInformation = false;

	workerLicenceTypeCode!: WorkerLicenceTypeCode;
	applicationTypeCode!: ApplicationTypeCode;

	private permitModelChangedSubscription!: Subscription;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private hotToastService: HotToastService,
		private permitApplicationService: PermitApplicationService,
		private commonApplicationService: ApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.permitModelChangedSubscription = this.permitApplicationService.permitModelValueChanges$.subscribe(
			(_resp: any) => {
				this.isFormValid = _resp;

				this.workerLicenceTypeCode = this.permitApplicationService.permitModelFormGroup.get(
					'workerLicenceTypeData.workerLicenceTypeCode'
				)?.value;
				this.applicationTypeCode = this.permitApplicationService.permitModelFormGroup.get(
					'applicationTypeData.applicationTypeCode'
				)?.value;

				if (this.workerLicenceTypeCode === WorkerLicenceTypeCode.BodyArmourPermit) {
					const bodyArmourRequirement = this.permitApplicationService.permitModelFormGroup.get(
						'permitRequirementData.bodyArmourRequirementFormGroup'
					)?.value;

					this.showEmployerInformation = !!bodyArmourRequirement.isMyEmployment;
				} else {
					const armouredVehicleRequirement = this.permitApplicationService.permitModelFormGroup.get(
						'permitRequirementData.armouredVehicleRequirementFormGroup'
					)?.value;

					this.showEmployerInformation = !!armouredVehicleRequirement.isMyEmployment;
				}

				this.updateCompleteStatus();
			}
		);
	}

	ngOnDestroy() {
		if (this.permitModelChangedSubscription) this.permitModelChangedSubscription.unsubscribe();
	}

	override onStepSelectionChange(event: StepperSelectionEvent) {
		switch (event.selectedIndex) {
			case this.STEP_PERMIT_DETAILS:
				this.stepsPermitDetailsComponent?.onGoToFirstStep();
				break;
			case this.STEP_PURPOSE_AND_RATIONALE:
				this.stepsPermitPurposeComponent?.onGoToFirstStep();
				break;
			case this.STEP_IDENTIFICATION:
				this.stepsPermitIdentificationComponent?.onGoToFirstStep();
				break;
			case this.STEP_CONTACT_INFORMATION:
				this.stepsPermitContactComponent?.onGoToFirstStep();
				break;
			case this.STEP_REVIEW_AND_CONFIRM:
				this.stepReviewLicenceComponent?.onGoToFirstStep();
				break;
		}

		super.onStepSelectionChange(event);
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();

		switch (stepper.selectedIndex) {
			case this.STEP_PERMIT_DETAILS:
				this.stepsPermitDetailsComponent?.onGoToLastStep();
				break;
			case this.STEP_PURPOSE_AND_RATIONALE:
				this.stepsPermitPurposeComponent?.onGoToLastStep();
				break;
			case this.STEP_IDENTIFICATION:
				this.stepsPermitIdentificationComponent?.onGoToLastStep();
				break;
			case this.STEP_CONTACT_INFORMATION:
				this.stepsPermitContactComponent?.onGoToLastStep();
				break;
		}
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
		switch (this.stepper.selectedIndex) {
			case this.STEP_PERMIT_DETAILS:
				this.stepsPermitDetailsComponent?.onGoToNextStep();
				break;
			case this.STEP_PURPOSE_AND_RATIONALE:
				this.stepsPermitPurposeComponent?.onGoToNextStep();
				break;
			case this.STEP_IDENTIFICATION:
				this.stepsPermitIdentificationComponent?.onGoToNextStep();
				break;
			case this.STEP_CONTACT_INFORMATION:
				this.stepsPermitContactComponent?.onGoToNextStep();
				break;
		}
	}

	onSubmitStep(): void {
		if (this.newLicenceAppId) {
			if (this.newLicenceCost > 0) {
				this.stepReviewLicenceComponent?.onGoToLastStep();
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

					this.hotToastService.success('Your permit update has been successfully submitted');

					if (this.newLicenceCost > 0) {
						this.stepReviewLicenceComponent?.onGoToLastStep();
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

	private updateCompleteStatus(): void {
		this.step1Complete = this.permitApplicationService.isStepPermitDetailsComplete();
		this.step2Complete = this.permitApplicationService.isStepPurposeAndRationaleComplete();
		this.step3Complete = this.permitApplicationService.isStepIdentificationComplete();
		this.step4Complete = this.permitApplicationService.isStepContactComplete();

		console.debug('Complete Status', this.step1Complete, this.step2Complete, this.step3Complete, this.step4Complete);
	}

	private payNow(licenceAppId: string): void {
		this.commonApplicationService.payNowAnonymous(licenceAppId, 'Payment for Permit update');
	}
}
