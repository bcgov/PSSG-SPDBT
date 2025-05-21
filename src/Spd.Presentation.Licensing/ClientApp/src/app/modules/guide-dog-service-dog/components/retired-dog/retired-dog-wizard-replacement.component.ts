import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode, RetiredDogAppCommandResponse } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { RetiredDogApplicationService } from '@app/core/services/retired-dog-application.service';
import { GuideDogServiceDogRoutes } from '@app/modules/guide-dog-service-dog/guide-dog-service-dog-routes';
import { distinctUntilChanged } from 'rxjs';
import { StepRdMailingAddressReplacementComponent } from './step-rd-mailing-address-replacement.component';

@Component({
	selector: 'app-retired-dog-wizard-replacement',
	template: `
		<div class="row">
			<mat-stepper linear labelPosition="bottom" [orientation]="orientation" #stepper>
				<mat-step>
					<ng-template matStepLabel>Licence Confirmation</ng-template>
					<app-step-rd-licence-confirmation></app-step-rd-licence-confirmation>

					<app-wizard-footer (nextStepperStep)="onGoToNextStep()"></app-wizard-footer>
				</mat-step>

				<mat-step>
					<ng-template matStepLabel>Mailing Address</ng-template>
					<app-step-rd-mailing-address-replacement></app-step-rd-mailing-address-replacement>

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
export class RetiredDogWizardReplacementComponent extends BaseWizardComponent implements OnInit {
	isLoggedIn = false;

	@ViewChild(StepRdMailingAddressReplacementComponent)
	stepAddressComponent!: StepRdMailingAddressReplacementComponent;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private authenticationService: AuthenticationService,
		private retiredDogApplicationService: RetiredDogApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		if (!this.retiredDogApplicationService.initialized) {
			this.router.navigateByUrl(GuideDogServiceDogRoutes.path());
			return;
		}

		this.isLoggedIn = this.authenticationService.isLoggedIn();

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());
	}

	onGoToNextStep(): void {
		this.stepper.next();
	}

	onGoToPreviousStep(): void {
		this.stepper.previous();
	}

	onSubmit(): void {
		if (!this.stepAddressComponent.isFormValid()) {
			return;
		}

		if (this.isLoggedIn) {
			this.retiredDogApplicationService.submitLicenceAuthenticated(ApplicationTypeCode.Replacement).subscribe({
				next: (_resp: StrictHttpResponse<RetiredDogAppCommandResponse>) => {
					this.router.navigateByUrl(GuideDogServiceDogRoutes.pathGdsdAuthenticated());
				},
				error: (error: any) => {
					console.log('An error occurred during save', error);
				},
			});
			return;
		}

		this.retiredDogApplicationService.submitLicenceReplacementAnonymous().subscribe({
			next: (_resp: StrictHttpResponse<RetiredDogAppCommandResponse>) => {
				this.router.navigateByUrl(
					GuideDogServiceDogRoutes.pathGdsdAnonymous(GuideDogServiceDogRoutes.GDSD_APPLICATION_RECEIVED)
				);
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
			},
		});
	}
}
