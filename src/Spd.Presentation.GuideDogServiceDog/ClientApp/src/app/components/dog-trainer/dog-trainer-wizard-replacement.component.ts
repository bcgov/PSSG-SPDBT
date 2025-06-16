import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode, DogTrainerAppCommandResponse } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { AppRoutes } from '@app/app.routes';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { DogTrainerApplicationService } from '@app/core/services/dog-trainer-application.service';
import { UtilService } from '@app/core/services/util.service';
import { distinctUntilChanged, Subscription } from 'rxjs';
import { StepDtConsentReplacementComponent } from './step-dt-consent-replacement.component';
import { StepDtMailingAddressComponent } from './step-dt-mailing-address.component';
import { StepDtPhotographOfYourselfRenewComponent } from './step-dt-photograph-of-yourself-renew.component';

@Component({
	selector: 'app-dog-trainer-wizard-replacement',
	template: `
		<div class="row">
			<mat-stepper linear labelPosition="bottom" [orientation]="orientation" #stepper>
				<mat-step [completed]="true">
					<ng-template matStepLabel>Certificate Confirmation</ng-template>
					<app-step-dt-licence-confirmation></app-step-dt-licence-confirmation>

					<app-wizard-footer (nextStepperStep)="onFormValidNextStep(STEP_SUMMARY)"></app-wizard-footer>
				</mat-step>

				<mat-step [completed]="step2Complete">
					<ng-template matStepLabel>Mailing Address</ng-template>
					<app-step-dt-mailing-address [applicationTypeCode]="applicationTypeReplacement"></app-step-dt-mailing-address>

					<app-wizard-footer
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onFormValidNextStep(STEP_MAILING_ADDRESS)"
					></app-wizard-footer>
				</mat-step>

				<mat-step [completed]="step3Complete" *ngIf="updatePhoto">
					<ng-template matStepLabel>Photograph of Yourself</ng-template>
					<app-step-dt-photograph-of-yourself-renew></app-step-dt-photograph-of-yourself-renew>

					<app-wizard-footer
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onFormValidNextStep(STEP_PHOTO_OF_YOURSELF)"
					></app-wizard-footer>
				</mat-step>

				<mat-step>
					<ng-template matStepLabel>Acknowledgement</ng-template>
					<app-step-dt-consent-replacement></app-step-dt-consent-replacement>

					<app-wizard-footer
						nextButtonLabel="Submit"
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onSubmit()"
					></app-wizard-footer>
				</mat-step>

				<mat-step completed="false">
					<ng-template matStepLabel>Submit</ng-template>
				</mat-step>
			</mat-stepper>
		</div>
	`,
	styles: [],
	standalone: false,
})
export class DogTrainerWizardReplacementComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	readonly STEP_SUMMARY = 0;
	readonly STEP_MAILING_ADDRESS = 1;
	readonly STEP_PHOTO_OF_YOURSELF = 2;

	step2Complete = false;
	step3Complete = false;

	updatePhoto = false;

	@ViewChild(StepDtMailingAddressComponent) stepAddress!: StepDtMailingAddressComponent;
	@ViewChild(StepDtPhotographOfYourselfRenewComponent) stepPhoto!: StepDtPhotographOfYourselfRenewComponent;
	@ViewChild(StepDtConsentReplacementComponent) stepConsent!: StepDtConsentReplacementComponent;

	applicationTypeReplacement = ApplicationTypeCode.Replacement;

	private dogTrainerChangedSubscription!: Subscription;

	constructor(
		override breakpointObserver: BreakpointObserver,
		override viewportScroller: ViewportScroller,
		private router: Router,
		private utilService: UtilService,
		private dogTrainerApplicationService: DogTrainerApplicationService
	) {
		super(breakpointObserver, viewportScroller);
	}

	ngOnInit(): void {
		if (!this.dogTrainerApplicationService.initialized) {
			this.router.navigateByUrl(AppRoutes.path());
			return;
		}

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.dogTrainerChangedSubscription = this.dogTrainerApplicationService.dogTrainerModelValueChanges$.subscribe(
			(_resp: boolean) => {
				this.updatePhoto =
					this.dogTrainerApplicationService.dogTrainerModelFormGroup.get('photographOfYourselfData.updatePhoto')
						?.value === BooleanTypeCode.Yes;

				this.updateCompleteStatus();
			}
		);
	}

	ngOnDestroy() {
		if (this.dogTrainerChangedSubscription) this.dogTrainerChangedSubscription.unsubscribe();
	}

	onFormValidNextStep(formNumber: number): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) {
			this.utilService.scrollToErrorSection();
			return;
		}

		this.stepper.next();
	}

	private dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_SUMMARY:
				return true;
			case this.STEP_MAILING_ADDRESS:
				return this.stepAddress.isFormValid();
			case this.STEP_PHOTO_OF_YOURSELF:
				return this.stepPhoto.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	onGoToPreviousStep(): void {
		this.stepper.previous();
	}

	onSubmit(): void {
		if (!this.stepConsent.isFormValid()) return;

		this.dogTrainerApplicationService.submitLicenceAnonymous().subscribe({
			next: (_resp: StrictHttpResponse<DogTrainerAppCommandResponse>) => {
				this.router.navigateByUrl(AppRoutes.path(AppRoutes.GDSD_APPLICATION_RECEIVED));
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
			},
		});
	}

	private updateCompleteStatus(): void {
		this.step2Complete = this.dogTrainerApplicationService.trainerMailingAddressFormGroup.valid;
		this.step3Complete = this.updatePhoto
			? this.dogTrainerApplicationService.photographOfYourselfFormGroup.valid
			: true;

		console.debug('Complete Status', this.step2Complete, this.step3Complete);
	}
}
