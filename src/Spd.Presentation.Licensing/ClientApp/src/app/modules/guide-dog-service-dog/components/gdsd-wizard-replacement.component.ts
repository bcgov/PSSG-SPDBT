import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode, GdsdAppCommandResponse } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';
import { distinctUntilChanged } from 'rxjs';
import { GuideDogServiceDogRoutes } from '../guide-dog-service-dog-routes';
import { StepGdsdMailingAddressReplacementComponent } from './shared/common-step-components/step-gdsd-mailing-address-replacement.component';

@Component({
	selector: 'app-gdsd-wizard-replacement',
	template: `
		<div class="row">
			<mat-stepper linear labelPosition="bottom" [orientation]="orientation" #stepper>
				<mat-step>
					<ng-template matStepLabel>Licence Confirmation</ng-template>
					<app-step-gdsd-licence-confirmation></app-step-gdsd-licence-confirmation>

					<app-wizard-footer (nextStepperStep)="onGoToNextStep()"></app-wizard-footer>
				</mat-step>

				<mat-step>
					<ng-template matStepLabel>Mailing Address</ng-template>
					<app-step-gdsd-mailing-address-replacement></app-step-gdsd-mailing-address-replacement>

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
export class GdsdWizardReplacementComponent extends BaseWizardComponent implements OnInit {
	@ViewChild(StepGdsdMailingAddressReplacementComponent)
	stepAddressComponent!: StepGdsdMailingAddressReplacementComponent;

	isLoggedIn = false;

	readonly applicationTypeCode = ApplicationTypeCode.Replacement;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private authenticationService: AuthenticationService,
		private gdsdApplicationService: GdsdApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		if (!this.gdsdApplicationService.initialized) {
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
			this.gdsdApplicationService.submitLicenceReplacementAuthenticated().subscribe({
				next: (_resp: StrictHttpResponse<GdsdAppCommandResponse>) => {
					this.router.navigateByUrl(
						GuideDogServiceDogRoutes.pathGdsdAnonymous(GuideDogServiceDogRoutes.GDSD_APPLICATION_RECEIVED)
					);
				},
				error: (error: any) => {
					console.log('An error occurred during save', error);
				},
			});
			return;
		}

		this.gdsdApplicationService.submitReplacementAnonymous().subscribe({
			next: (_resp: StrictHttpResponse<GdsdAppCommandResponse>) => {
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
