import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { Subscription } from 'rxjs';
import { BaseWizardStepComponent } from 'src/app/core/components/base-wizard-step.component';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { StepPermitEmployerInformationComponent } from './step-permit-employer-information.component';
import { StepPermitRationaleComponent } from './step-permit-rationale.component';
import { StepPermitReasonComponent } from './step-permit-reason.component';

@Component({
	selector: 'app-steps-permit-purpose',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-permit-reason
					[workerLicenceTypeCode]="workerLicenceTypeCode"
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-reason>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_PERMIT_REASON)"
							*ngIf="isLoggedIn"
						>
							Save & Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_PERMIT_REASON)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_PERMIT_REASON)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showEmployerInformation">
				<app-step-permit-employer-information
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-employer-information>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_EMPLOYER_INFORMATION)"
							*ngIf="isLoggedIn"
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
							(click)="onFormValidNextStep(STEP_EMPLOYER_INFORMATION)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_EMPLOYER_INFORMATION)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-permit-rationale [applicationTypeCode]="applicationTypeCode"></app-step-permit-rationale>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_PERMIT_RATIONALE)"
							*ngIf="isLoggedIn"
						>
							Save & Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext(STEP_PERMIT_RATIONALE)">
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_PERMIT_RATIONALE)"
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
export class StepsPermitPurposeComponent extends BaseWizardStepComponent implements OnInit, OnDestroy {
	readonly STEP_PERMIT_REASON = 1;
	readonly STEP_EMPLOYER_INFORMATION = 2;
	readonly STEP_PERMIT_RATIONALE = 3;

	private authenticationSubscription!: Subscription;
	private licenceModelChangedSubscription!: Subscription;

	isLoggedIn = false;
	isFormValid = false;
	showEmployerInformation = true;

	applicationTypeCode: ApplicationTypeCode | null = null;
	workerLicenceTypeCode: WorkerLicenceTypeCode | null = null;

	@ViewChild(StepPermitReasonComponent) stepPermitReasonComponent!: StepPermitReasonComponent;
	@ViewChild(StepPermitEmployerInformationComponent)
	stepEmployerInformationComponent!: StepPermitEmployerInformationComponent;
	@ViewChild(StepPermitRationaleComponent) stepPermitRationaleComponent!: StepPermitRationaleComponent;

	constructor(
		private authProcessService: AuthProcessService,
		private permitApplicationService: PermitApplicationService
	) {
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

				this.workerLicenceTypeCode = this.permitApplicationService.permitModelFormGroup.get(
					'workerLicenceTypeData.workerLicenceTypeCode'
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
			}
		);

		this.authenticationSubscription = this.authProcessService.waitUntilAuthentication$.subscribe(
			(isLoggedIn: boolean) => {
				this.isLoggedIn = isLoggedIn;
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

		// if (_formNumber === this.STEP_MENTAL_HEALTH_CONDITIONS && this.applicationTypeCode === ApplicationTypeCode.Update) {
		// 	this.nextStepperStep.emit(true);
		// 	return;
		// }
		this.childNextStep.next(true);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_PERMIT_REASON:
				return this.stepPermitReasonComponent.isFormValid();
			case this.STEP_EMPLOYER_INFORMATION:
				return this.stepEmployerInformationComponent.isFormValid();
			case this.STEP_PERMIT_RATIONALE:
				return this.stepPermitRationaleComponent.isFormValid();
		}
		return false;
	}
}
