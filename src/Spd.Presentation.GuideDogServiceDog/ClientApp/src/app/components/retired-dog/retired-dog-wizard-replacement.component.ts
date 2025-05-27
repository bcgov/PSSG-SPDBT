import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode, RetiredDogAppCommandResponse } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { AppRoutes } from '@app/app.routes';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { RetiredDogApplicationService } from '@app/core/services/retired-dog-application.service';
import { UtilService } from '@app/core/services/util.service';
import { distinctUntilChanged, Subscription } from 'rxjs';
import { StepRdConsentReplacementComponent } from './step-rd-consent-replacement.component';
import { StepRdMailingAddressComponent } from './step-rd-mailing-address.component';

@Component({
	selector: 'app-retired-dog-wizard-replacement',
	template: `
		<div class="row">
			<mat-stepper linear labelPosition="bottom" [orientation]="orientation" #stepper>
				<mat-step>
					<ng-template matStepLabel>Licence Confirmation</ng-template>
					<app-step-rd-licence-confirmation></app-step-rd-licence-confirmation>

					<app-wizard-footer (nextStepperStep)="onFormValidNextStep(STEP_SUMMARY)"></app-wizard-footer>
				</mat-step>

				<mat-step [completed]="step2Complete">
					<ng-template matStepLabel>Mailing Address</ng-template>
					<app-step-rd-mailing-address
						[isLoggedIn]="isLoggedIn"
						[applicationTypeCode]="applicationTypeReplacement"
					></app-step-rd-mailing-address>

					<app-wizard-footer
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onFormValidNextStep(STEP_MAILING_ADDRESS)"
					></app-wizard-footer>
				</mat-step>

				<mat-step [completed]="step3Complete">
					<ng-template matStepLabel>Acknowledgement</ng-template>
					<app-step-rd-consent-replacement></app-step-rd-consent-replacement>

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
export class RetiredDogWizardReplacementComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	readonly STEP_SUMMARY = 0;
	readonly STEP_MAILING_ADDRESS = 1;

	step2Complete = false;
	step3Complete = false;

	isLoggedIn = false;
	applicationTypeReplacement = ApplicationTypeCode.Replacement;

	@ViewChild(StepRdMailingAddressComponent) stepAddress!: StepRdMailingAddressComponent;
	@ViewChild(StepRdConsentReplacementComponent) stepConsent!: StepRdConsentReplacementComponent;

	private retiredDogChangedSubscription!: Subscription;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private utilService: UtilService,
		private authenticationService: AuthenticationService,
		private retiredDogApplicationService: RetiredDogApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		if (!this.retiredDogApplicationService.initialized) {
			this.router.navigateByUrl(AppRoutes.path());
			return;
		}

		this.isLoggedIn = this.authenticationService.isLoggedIn();

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.retiredDogChangedSubscription = this.retiredDogApplicationService.retiredDogModelValueChanges$.subscribe(
			(_resp: boolean) => {
				this.updateCompleteStatus();
			}
		);
	}

	ngOnDestroy() {
		if (this.retiredDogChangedSubscription) this.retiredDogChangedSubscription.unsubscribe();
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

		if (this.isLoggedIn) {
			this.retiredDogApplicationService.submitLicenceAuthenticated(ApplicationTypeCode.Replacement).subscribe({
				next: (_resp: StrictHttpResponse<RetiredDogAppCommandResponse>) => {
					this.router.navigateByUrl(AppRoutes.pathGdsdAuthenticated());
				},
				error: (error: any) => {
					console.log('An error occurred during save', error);
				},
			});
			return;
		}

		this.retiredDogApplicationService.submitLicenceReplacementAnonymous().subscribe({
			next: (_resp: StrictHttpResponse<RetiredDogAppCommandResponse>) => {
				this.router.navigateByUrl(AppRoutes.path(AppRoutes.GDSD_APPLICATION_RECEIVED));
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
			},
		});
	}

	private updateCompleteStatus(): void {
		this.step2Complete = this.retiredDogApplicationService.mailingAddressFormGroup.valid;
		this.step3Complete = this.retiredDogApplicationService.consentAndDeclarationFormGroup.valid;

		console.debug('Complete Status', this.step2Complete, this.step3Complete);
	}
}
