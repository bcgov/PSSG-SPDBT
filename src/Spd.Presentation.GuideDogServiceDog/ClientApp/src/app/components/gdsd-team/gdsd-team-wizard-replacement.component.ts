import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode, GdsdTeamAppCommandResponse } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { AppRoutes } from '@app/app.routes';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { UtilService } from '@app/core/services/util.service';
import { distinctUntilChanged, Subscription } from 'rxjs';
import { StepTeamConsentReplacementComponent } from './step-team-consent-replacement.component';
import { StepTeamMailingAddressComponent } from './step-team-mailing-address.component';
import { StepTeamPhotographOfYourselfRenewComponent } from './step-team-photograph-of-yourself-renew.component';

@Component({
	selector: 'app-gdsd-team-wizard-replacement',
	template: `
		<div class="row">
			<mat-stepper linear labelPosition="bottom" [orientation]="orientation" #stepper>
				<mat-step>
					<ng-template matStepLabel>Licence Confirmation</ng-template>
					<app-step-team-licence-confirmation></app-step-team-licence-confirmation>

					<app-wizard-footer (nextStepperStep)="onFormValidNextStep(STEP_SUMMARY)"></app-wizard-footer>
				</mat-step>

				<mat-step [completed]="step2Complete">
					<ng-template matStepLabel>Mailing Address</ng-template>
					<app-step-team-mailing-address
						[isLoggedIn]="isLoggedIn"
						[applicationTypeCode]="applicationTypeReplacement"
					></app-step-team-mailing-address>

					<app-wizard-footer
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onFormValidNextStep(STEP_MAILING_ADDRESS)"
					></app-wizard-footer>
				</mat-step>

				<mat-step [completed]="step3Complete" *ngIf="updatePhoto">
					<ng-template matStepLabel>Photograph of Yourself</ng-template>
					<app-step-team-photograph-of-yourself-renew></app-step-team-photograph-of-yourself-renew>

					<app-wizard-footer
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onFormValidNextStep(STEP_PHOTO_OF_YOURSELF)"
					></app-wizard-footer>
				</mat-step>

				<mat-step>
					<ng-template matStepLabel>Acknowledgement</ng-template>
					<app-step-team-consent-replacement></app-step-team-consent-replacement>

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
export class GdsdTeamWizardReplacementComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	readonly STEP_SUMMARY = 0;
	readonly STEP_MAILING_ADDRESS = 1;
	readonly STEP_PHOTO_OF_YOURSELF = 2;

	step2Complete = false;
	step3Complete = false;

	isLoggedIn = false;
	updatePhoto = false;
	applicationTypeReplacement = ApplicationTypeCode.Replacement;

	@ViewChild(StepTeamMailingAddressComponent) stepAddress!: StepTeamMailingAddressComponent;
	@ViewChild(StepTeamPhotographOfYourselfRenewComponent) stepPhoto!: StepTeamPhotographOfYourselfRenewComponent;
	@ViewChild(StepTeamConsentReplacementComponent) stepConsent!: StepTeamConsentReplacementComponent;

	private gdsdTeamChangedSubscription!: Subscription;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private utilService: UtilService,
		private authenticationService: AuthenticationService,
		private gdsdTeamApplicationService: GdsdTeamApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		if (!this.gdsdTeamApplicationService.initialized) {
			this.router.navigateByUrl(AppRoutes.path());
			return;
		}

		this.isLoggedIn = this.authenticationService.isLoggedIn();

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.gdsdTeamChangedSubscription = this.gdsdTeamApplicationService.gdsdTeamModelValueChanges$.subscribe(
			(_resp: boolean) => {
				this.updatePhoto =
					this.gdsdTeamApplicationService.gdsdTeamModelFormGroup.get('photographOfYourselfData.updatePhoto')?.value ===
					BooleanTypeCode.Yes;

				this.updateCompleteStatus();
			}
		);
	}

	ngOnDestroy() {
		if (this.gdsdTeamChangedSubscription) this.gdsdTeamChangedSubscription.unsubscribe();
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

		if (this.isLoggedIn) {
			this.gdsdTeamApplicationService.submitLicenceAuthenticated(ApplicationTypeCode.Replacement).subscribe({
				next: (_resp: StrictHttpResponse<GdsdTeamAppCommandResponse>) => {
					this.router.navigateByUrl(AppRoutes.pathGdsdAuthenticated());
				},
				error: (error: any) => {
					console.log('An error occurred during save', error);
				},
			});
			return;
		}

		this.gdsdTeamApplicationService.submitLicenceAnonymous().subscribe({
			next: (_resp: StrictHttpResponse<GdsdTeamAppCommandResponse>) => {
				this.router.navigateByUrl(AppRoutes.path(AppRoutes.GDSD_APPLICATION_RECEIVED));
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
			},
		});
	}

	private updateCompleteStatus(): void {
		this.step2Complete = this.gdsdTeamApplicationService.mailingAddressFormGroup.valid;
		this.step3Complete = this.updatePhoto ? this.gdsdTeamApplicationService.photographOfYourselfFormGroup.valid : true;

		console.debug('Complete Status', this.step2Complete, this.step3Complete);
	}
}
