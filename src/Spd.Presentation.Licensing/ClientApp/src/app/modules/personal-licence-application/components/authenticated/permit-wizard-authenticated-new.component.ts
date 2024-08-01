import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, PermitAppCommandResponse, WorkerLicenceTypeCode } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { StepsPermitDetailsNewComponent } from '@app/modules/personal-licence-application/components/anonymous/permit-wizard-step-components/steps-permit-details-new.component';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routing.module';
import { ApplicationService } from '@app/core/services/application.service';
import { PermitApplicationService } from '@core/services/permit-application.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { StepsPermitIdentificationAuthenticatedComponent } from './permit-wizard-step-components/steps-permit-identification-authenticated.component';
import { StepsPermitPurposeAuthenticatedComponent } from './permit-wizard-step-components/steps-permit-purpose-authenticated.component';
import { StepsPermitReviewAuthenticatedComponent } from './permit-wizard-step-components/steps-permit-review-authenticated.component';

@Component({
	selector: 'app-permit-wizard-authenticated-new',
	template: `
		<div class="row">
			<div class="col-12">
				<mat-stepper
					linear
					labelPosition="bottom"
					[orientation]="orientation"
					(selectionChange)="onStepSelectionChange($event)"
					#stepper
				>
					<mat-step [completed]="step1Complete">
						<ng-template matStepLabel>Permit Details</ng-template>
						<app-steps-permit-details-new
							[isLoggedIn]="true"
							[workerLicenceTypeCode]="workerLicenceTypeCode"
							[applicationTypeCode]="applicationTypeCode"
							(childNextStep)="onChildNextStep()"
							(saveAndExit)="onSaveAndExit()"
							(nextReview)="onGoToReview()"
							(nextStepperStep)="onNextStepperStep(stepper)"
							(scrollIntoView)="onScrollIntoView()"
						></app-steps-permit-details-new>
					</mat-step>

					<mat-step [completed]="step2Complete">
						<ng-template matStepLabel>Purpose & Rationale</ng-template>
						<app-steps-permit-purpose-authenticated
							[isFormValid]="isFormValid"
							[showSaveAndExit]="showSaveAndExit"
							[showEmployerInformation]="showEmployerInformation"
							[workerLicenceTypeCode]="workerLicenceTypeCode"
							[applicationTypeCode]="applicationTypeCode"
							(childNextStep)="onChildNextStep()"
							(saveAndExit)="onSaveAndExit()"
							(nextReview)="onGoToReview()"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextStepperStep)="onNextStepperStep(stepper)"
							(scrollIntoView)="onScrollIntoView()"
						></app-steps-permit-purpose-authenticated>
					</mat-step>

					<mat-step [completed]="step3Complete">
						<ng-template matStepLabel>Identification</ng-template>
						<app-steps-permit-identification-authenticated
							[isFormValid]="isFormValid"
							[showSaveAndExit]="showSaveAndExit"
							[applicationTypeCode]="applicationTypeCode"
							(childNextStep)="onChildNextStep()"
							(saveAndExit)="onSaveAndExit()"
							(nextReview)="onGoToReview()"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextStepperStep)="onNextStepperStep(stepper)"
							(scrollIntoView)="onScrollIntoView()"
						></app-steps-permit-identification-authenticated>
					</mat-step>

					<mat-step completed="false">
						<ng-template matStepLabel>Review & Confirm</ng-template>
						<app-steps-permit-review-authenticated
							[workerLicenceTypeCode]="workerLicenceTypeCode"
							[applicationTypeCode]="applicationTypeCodeNew"
							(saveAndExit)="onSaveAndExit()"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextPayStep)="onNextPayStep()"
							(scrollIntoView)="onScrollIntoView()"
							(goToStep)="onGoToStep($event)"
						></app-steps-permit-review-authenticated>
					</mat-step>

					<mat-step completed="false">
						<ng-template matStepLabel>Pay</ng-template>
					</mat-step>
				</mat-stepper>
			</div>
		</div>
	`,
	styles: [],
})
export class PermitWizardAuthenticatedNewComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	applicationTypeCodeNew = ApplicationTypeCode.New;

	readonly STEP_PERMIT_DETAILS = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_PURPOSE_AND_RATIONALE = 1;
	readonly STEP_IDENTIFICATION = 2;
	readonly STEP_REVIEW = 3;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;

	@ViewChild(StepsPermitDetailsNewComponent)
	stepPermitDetailsComponent!: StepsPermitDetailsNewComponent;

	@ViewChild(StepsPermitPurposeAuthenticatedComponent)
	stepPurposeComponent!: StepsPermitPurposeAuthenticatedComponent;

	@ViewChild(StepsPermitIdentificationAuthenticatedComponent)
	stepIdentificationComponent!: StepsPermitIdentificationAuthenticatedComponent;

	@ViewChild(StepsPermitReviewAuthenticatedComponent)
	stepReviewComponent!: StepsPermitReviewAuthenticatedComponent;

	workerLicenceTypeCode!: WorkerLicenceTypeCode;
	applicationTypeCode!: ApplicationTypeCode;
	isFormValid = false;
	showSaveAndExit = true;
	showEmployerInformation = false;

	private permitModelChangedSubscription!: Subscription;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private hotToastService: HotToastService,
		private commonApplicationService: ApplicationService,
		private permitApplicationService: PermitApplicationService
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
				this.stepPermitDetailsComponent?.onGoToFirstStep();
				break;
			case this.STEP_PURPOSE_AND_RATIONALE:
				this.stepPurposeComponent?.onGoToFirstStep();
				break;
			case this.STEP_IDENTIFICATION:
				this.stepIdentificationComponent?.onGoToFirstStep();
				break;
			case this.STEP_REVIEW:
				this.stepReviewComponent?.onGoToFirstStep();
				break;
		}

		super.onStepSelectionChange(event);
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();

		switch (stepper.selectedIndex) {
			case this.STEP_PERMIT_DETAILS:
				this.stepPermitDetailsComponent?.onGoToLastStep();
				break;
			case this.STEP_PURPOSE_AND_RATIONALE:
				this.stepPurposeComponent?.onGoToLastStep();
				break;
			case this.STEP_IDENTIFICATION:
				this.stepIdentificationComponent?.onGoToLastStep();
				break;
		}
	}

	onNextStepperStep(stepper: MatStepper): void {
		if (this.permitApplicationService.isAutoSave()) {
			this.permitApplicationService.partialSavePermitStepAuthenticated().subscribe({
				next: (_resp: any) => {
					if (stepper?.selected) stepper.selected.completed = true;
					stepper.next();

					switch (stepper.selectedIndex) {
						case this.STEP_PERMIT_DETAILS:
							this.stepPermitDetailsComponent?.onGoToFirstStep();
							break;
						case this.STEP_PURPOSE_AND_RATIONALE:
							this.stepPurposeComponent?.onGoToFirstStep();
							break;
						case this.STEP_IDENTIFICATION:
							this.stepIdentificationComponent?.onGoToFirstStep();
							break;
					}
				},
				error: (error: HttpErrorResponse) => {
					this.handlePartialSaveError(error);
				},
			});
		} else {
			if (stepper?.selected) stepper.selected.completed = true;
			stepper.next();
		}
	}

	onNextPayStep(): void {
		this.permitApplicationService.submitPermitNewAuthenticated().subscribe({
			next: (_resp: StrictHttpResponse<PermitAppCommandResponse>) => {
				this.hotToastService.success('Your permit has been successfully submitted');
				this.payNow(_resp.body.licenceAppId!);
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
			},
		});
	}

	onGoToStep(step: number) {
		this.stepPermitDetailsComponent?.onGoToFirstStep();
		this.stepPurposeComponent?.onGoToFirstStep();
		this.stepIdentificationComponent?.onGoToFirstStep();
		this.stepper.selectedIndex = step;
	}

	onSaveAndExit() {
		if (!this.permitApplicationService.isSaveAndExit()) {
			return;
		}

		this.permitApplicationService.partialSavePermitStepAuthenticated(true).subscribe({
			next: (_resp: any) => {
				this.router.navigateByUrl(PersonalLicenceApplicationRoutes.pathUserApplications());
			},
			error: (error: HttpErrorResponse) => {
				this.handlePartialSaveError(error);
			},
		});
	}

	onGoToReview() {
		if (this.permitApplicationService.isAutoSave()) {
			this.permitApplicationService.partialSavePermitStepAuthenticated().subscribe({
				next: (_resp: any) => {
					setTimeout(() => {
						// hack... does not navigate without the timeout
						this.stepper.selectedIndex = this.STEP_REVIEW;
					}, 250);
				},
				error: (error: HttpErrorResponse) => {
					this.handlePartialSaveError(error);
				},
			});
		} else {
			this.stepper.selectedIndex = this.STEP_REVIEW;
		}
	}

	onChildNextStep() {
		if (this.permitApplicationService.isAutoSave()) {
			this.permitApplicationService.partialSavePermitStepAuthenticated().subscribe({
				next: (_resp: any) => {
					this.goToChildNextStep();
				},
				error: (error: HttpErrorResponse) => {
					this.handlePartialSaveError(error);
				},
			});
		} else {
			this.goToChildNextStep();
		}
	}

	private payNow(licenceAppId: string): void {
		this.commonApplicationService.payNowPersonalLicenceAuthenticated(
			licenceAppId,
			'Payment for new Permit application'
		);
	}

	private updateCompleteStatus(): void {
		this.step1Complete = this.permitApplicationService.isStepPermitDetailsComplete();
		this.step2Complete = this.permitApplicationService.isStepPurposeAndRationaleComplete();
		this.step3Complete = this.permitApplicationService.isStepIdentificationComplete();

		// console.debug('Complete Status', this.step1Complete, this.step2Complete, this.step3Complete);
	}

	private handlePartialSaveError(error: HttpErrorResponse): void {
		// only 403s will be here as an error
		if (error.status == 403) {
			this.commonApplicationService.handleDuplicateLicence();
		}
	}

	private goToChildNextStep() {
		switch (this.stepper.selectedIndex) {
			case this.STEP_PERMIT_DETAILS:
				this.stepPermitDetailsComponent?.onGoToNextStep();
				break;
			case this.STEP_PURPOSE_AND_RATIONALE:
				this.stepPurposeComponent?.onGoToNextStep();
				break;
			case this.STEP_IDENTIFICATION:
				this.stepIdentificationComponent?.onGoToNextStep();
				break;
		}
	}
}
