import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DogTrainerAppCommandResponse } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { DogTrainerApplicationService } from '@app/core/services/dog-trainer-application.service';
import { GuideDogServiceDogRoutes } from '@app/modules/guide-dog-service-dog/guide-dog-service-dog-routes';
import { distinctUntilChanged } from 'rxjs';
import { StepDtMailingAddressReplacementComponent } from './step-dt-mailing-address-replacement.component';

@Component({
	selector: 'app-dog-trainer-wizard-replacement',
	template: `
		<div class="row">
			<mat-stepper linear labelPosition="bottom" [orientation]="orientation" #stepper>
				<mat-step>
					<ng-template matStepLabel>Licence Confirmation</ng-template>
					<app-step-dt-licence-confirmation></app-step-dt-licence-confirmation>

					<app-wizard-footer (nextStepperStep)="onGoToNextStep()"></app-wizard-footer>
				</mat-step>

				<mat-step>
					<ng-template matStepLabel>Mailing Address</ng-template>
					<app-step-dt-mailing-address-replacement></app-step-dt-mailing-address-replacement>

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
export class DogTrainerWizardReplacementComponent extends BaseWizardComponent implements OnInit {
	@ViewChild(StepDtMailingAddressReplacementComponent)
	stepAddressComponent!: StepDtMailingAddressReplacementComponent;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private dogTrainerApplicationService: DogTrainerApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		if (!this.dogTrainerApplicationService.initialized) {
			this.router.navigateByUrl(GuideDogServiceDogRoutes.path());
			return;
		}

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
		this.dogTrainerApplicationService.submitLicenceReplacementAnonymous().subscribe({
			next: (_resp: StrictHttpResponse<DogTrainerAppCommandResponse>) => {
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
