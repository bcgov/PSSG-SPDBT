import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode, PoliceOfficerRoleCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { Subscription } from 'rxjs';
import { StepWorkerLicenceCriminalHistoryComponent } from './step-worker-licence-criminal-history.component';
import { StepWorkerLicenceFingerprintsComponent } from './step-worker-licence-fingerprints.component';
import { StepWorkerLicenceMentalHealthConditionsComponent } from './step-worker-licence-mental-health-conditions.component';
import { StepWorkerLicencePoliceBackgroundComponent } from './step-worker-licence-police-background.component';

@Component({
	selector: 'app-steps-worker-licence-background',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-worker-licence-police-background></app-step-worker-licence-police-background>

				<div class="row wizard-button-row" *ngIf="policeOfficerRoleCode !== policeOfficerRoleCodes.PoliceOfficer">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_POLICE_BACKGROUND)"
							*ngIf="showSaveAndExit"
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
							(click)="onFormValidNextStep(STEP_POLICE_BACKGROUND)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_POLICE_BACKGROUND)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-worker-licence-mental-health-conditions
					[applicationTypeCode]="applicationTypeCode"
				></app-step-worker-licence-mental-health-conditions>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_MENTAL_HEALTH_CONDITIONS)"
							*ngIf="showSaveAndExit"
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
							(click)="onFormValidNextStep(STEP_MENTAL_HEALTH_CONDITIONS)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_MENTAL_HEALTH_CONDITIONS)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="applicationTypeCode !== applicationTypeCodes.Update">
				<app-step-worker-licence-criminal-history
					[applicationTypeCode]="applicationTypeCode"
				></app-step-worker-licence-criminal-history>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_CRIMINAL_HISTORY)"
							*ngIf="showSaveAndExit"
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
							(click)="onFormValidNextStep(STEP_CRIMINAL_HISTORY)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_CRIMINAL_HISTORY)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="applicationTypeCode !== applicationTypeCodes.Update">
				<app-step-worker-licence-fingerprints></app-step-worker-licence-fingerprints>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_FINGERPRINTS)"
							*ngIf="showSaveAndExit"
						>
							Save & Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext(STEP_FINGERPRINTS)">
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_FINGERPRINTS)"
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
export class StepsWorkerLicenceBackgroundComponent extends BaseWizardStepComponent implements OnInit, OnDestroy {
	readonly STEP_POLICE_BACKGROUND = 1;
	readonly STEP_MENTAL_HEALTH_CONDITIONS = 2;
	readonly STEP_CRIMINAL_HISTORY = 3;
	readonly STEP_FINGERPRINTS = 4;

	policeOfficerRoleCodes = PoliceOfficerRoleCode;

	private licenceModelChangedSubscription!: Subscription;

	showSaveAndExit = false;
	isFormValid = false;

	applicationTypeCode: ApplicationTypeCode | null = null;
	applicationTypeCodes = ApplicationTypeCode;

	@ViewChild(StepWorkerLicencePoliceBackgroundComponent)
	policeBackgroundComponent!: StepWorkerLicencePoliceBackgroundComponent;
	@ViewChild(StepWorkerLicenceMentalHealthConditionsComponent)
	mentalHealthConditionsComponent!: StepWorkerLicenceMentalHealthConditionsComponent;
	@ViewChild(StepWorkerLicenceCriminalHistoryComponent)
	criminalHistoryComponent!: StepWorkerLicenceCriminalHistoryComponent;
	@ViewChild(StepWorkerLicenceFingerprintsComponent) fingerprintsComponent!: StepWorkerLicenceFingerprintsComponent;

	constructor(
		override commonApplicationService: CommonApplicationService,
		private licenceApplicationService: LicenceApplicationService
	) {
		super(commonApplicationService);
	}

	ngOnInit(): void {
		this.licenceModelChangedSubscription = this.licenceApplicationService.licenceModelValueChanges$.subscribe(
			(_resp: boolean) => {
				// console.debug('licenceModelValueChanges$', _resp);
				this.isFormValid = _resp;

				this.applicationTypeCode = this.licenceApplicationService.licenceModelFormGroup.get(
					'applicationTypeData.applicationTypeCode'
				)?.value;

				this.showSaveAndExit = this.licenceApplicationService.isAutoSave();
			}
		);
	}

	ngOnDestroy() {
		if (this.licenceModelChangedSubscription) this.licenceModelChangedSubscription.unsubscribe();
	}

	override onFormValidNextStep(_formNumber: number): void {
		const isValid = this.dirtyForm(_formNumber);
		if (!isValid) return;

		if (_formNumber === this.STEP_MENTAL_HEALTH_CONDITIONS && this.applicationTypeCode === ApplicationTypeCode.Update) {
			this.nextStepperStep.emit(true);
			return;
		}
		this.childNextStep.next(true);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_POLICE_BACKGROUND:
				return this.policeBackgroundComponent.isFormValid();
			case this.STEP_MENTAL_HEALTH_CONDITIONS:
				return this.mentalHealthConditionsComponent.isFormValid();
			case this.STEP_CRIMINAL_HISTORY:
				return this.criminalHistoryComponent.isFormValid();
			case this.STEP_FINGERPRINTS:
				return this.fingerprintsComponent.isFormValid();
		}
		return false;
	}

	get policeOfficerRoleCode(): string {
		const form = this.licenceApplicationService.policeBackgroundFormGroup;
		return form.value.policeOfficerRoleCode;
	}
}
