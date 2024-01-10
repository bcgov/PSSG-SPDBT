import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { Subscription } from 'rxjs';
import { BaseWizardStepComponent } from 'src/app/core/components/base-wizard-step.component';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { StepPermitCriminalHistoryComponent } from './step-permit-criminal-history.component';
import { StepPermitFingerprintsComponent } from './step-permit-fingerprints.component';

@Component({
	selector: 'app-steps-permit-identification',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<!-- <mat-step>
				<app-step-permit-criminal-history
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-criminal-history>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_CRIMINAL_HISTORY)"
							*ngIf="isLoggedIn"
						>
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_CRIMINAL_HISTORY)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_CRIMINAL_HISTORY)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step> -->

			<!-- <mat-step *ngIf="applicationTypeCode !== applicationTypeCodes.Update">
				<app-step-permit-fingerprints></app-step-permit-fingerprints>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_FINGERPRINTS)"
							*ngIf="isLoggedIn"
						>
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext(STEP_FINGERPRINTS)">
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_FINGERPRINTS)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step> -->

			<!-- <mat-step *ngIf="applicationTypeCode !== applicationTypeCodes.Update">
	<app-step-citizenship></app-step-citizenship>

	<div class="row mt-4">
		<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
			<button
				mat-flat-button
				class="large bordered mb-2"
				(click)="onSaveAndExit(STEP_CITIZENSHIP)"
				*ngIf="isLoggedIn"
			>
				Save and Exit
			</button>
		</div>
		<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
			<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
		</div>
		<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
			<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_CITIZENSHIP)">
				Next
			</button>
		</div>
		<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
			<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_CITIZENSHIP)">
				Next: Review
			</button>
		</div>
	</div>
</mat-step> -->

			<!-- 
			<mat-step *ngIf="applicationTypeCode !== applicationTypeCodes.Update">
				<app-step-aliases></app-step-aliases>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_ALIASES)"
							*ngIf="isLoggedIn"
						>
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_ALIASES)">
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_ALIASES)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="applicationTypeCode !== applicationTypeCodes.Update">
				<app-step-citizenship></app-step-citizenship>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_CITIZENSHIP)"
							*ngIf="isLoggedIn"
						>
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_CITIZENSHIP)">
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_CITIZENSHIP)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step> -->

			<!-- <mat-step *ngIf="showAdditionalGovermentIdStep && applicationTypeCode !== applicationTypeCodes.Update">
				<app-step-additional-gov-id></app-step-additional-gov-id>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_ADDITIONAL_GOV_ID)"
							*ngIf="isLoggedIn"
						>
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_ADDITIONAL_GOV_ID)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_ADDITIONAL_GOV_ID)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step> -->
			<!-- 
			<mat-step *ngIf="applicationTypeCode !== applicationTypeCodes.Update">
				<app-step-bc-driver-licence></app-step-bc-driver-licence>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_BC_DRIVERS_LICENCE)"
							*ngIf="isLoggedIn"
						>
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_BC_DRIVERS_LICENCE)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_BC_DRIVERS_LICENCE)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-physical-characteristics
					[applicationTypeCode]="applicationTypeCode"
				></app-step-physical-characteristics>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_HEIGHT_AND_WEIGHT)"
							*ngIf="isLoggedIn"
						>
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_HEIGHT_AND_WEIGHT)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_HEIGHT_AND_WEIGHT)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-photograph-of-yourself [applicationTypeCode]="applicationTypeCode"></app-step-photograph-of-yourself>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button class="large bordered mb-2" (click)="onSaveAndExit(STEP_PHOTO)" *ngIf="isLoggedIn">
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_PHOTO)">
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_PHOTO)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step> -->
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsPermitIdentificationComponent extends BaseWizardStepComponent implements OnInit, OnDestroy {
	readonly STEP_CRIMINAL_HISTORY = 1;
	readonly STEP_FINGERPRINTS = 2;

	private authenticationSubscription!: Subscription;
	private licenceModelChangedSubscription!: Subscription;

	isLoggedIn = false;
	isFormValid = false;

	applicationTypeCode: ApplicationTypeCode | null = null;
	applicationTypeCodes = ApplicationTypeCode;

	@ViewChild(StepPermitCriminalHistoryComponent) stepCriminalHistoryComponent!: StepPermitCriminalHistoryComponent;
	@ViewChild(StepPermitFingerprintsComponent) stepFingerprintsComponent!: StepPermitFingerprintsComponent;

	constructor(
		private authProcessService: AuthProcessService,
		private licenceApplicationService: LicenceApplicationService
	) {
		super();
	}

	ngOnInit(): void {
		this.licenceModelChangedSubscription = this.licenceApplicationService.licenceModelValueChanges$.subscribe(
			(_resp: any) => {
				// console.debug('licenceModelValueChanges$', _resp);
				this.isFormValid = _resp;

				this.applicationTypeCode = this.licenceApplicationService.licenceModelFormGroup.get(
					'applicationTypeData.applicationTypeCode'
				)?.value;
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
		console.log('onFormValidNextStep', this.childstepper.selectedIndex);

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
			case this.STEP_CRIMINAL_HISTORY:
				return this.stepCriminalHistoryComponent.isFormValid();
			case this.STEP_FINGERPRINTS:
				return this.stepFingerprintsComponent.isFormValid();
		}
		return false;
	}
}
