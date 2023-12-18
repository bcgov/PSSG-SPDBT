import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs';
import { BaseWizardComponent } from 'src/app/core/components/base-wizard.component';
import { LicenceApplicationRoutes } from '../../licence-application-routing.module';
import { LicenceApplicationService } from '../../services/licence-application.service';
import { StepBackgroundComponent } from '../shared/wizard-steps/step-background.component';
import { StepLicenceSelectionComponent } from '../shared/wizard-steps/step-licence-selection.component';
import { StepReviewLicenceComponent } from '../shared/wizard-steps/step-review-licence.component';
import { StepIdentificationAnonymousComponent } from './wizard-steps/step-identification-anonymous.component';

@Component({
	selector: 'app-worker-licence-new-wizard-anonymous',
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
						<ng-template matStepLabel> Licence Selection </ng-template>
						<app-step-licence-selection
							(childNextStep)="onChildNextStep()"
							(nextReview)="onGoToReview()"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextStepperStep)="onNextStepperStep(stepper)"
							(scrollIntoView)="onScrollIntoView()"
						></app-step-licence-selection>
					</mat-step>

					<mat-step [completed]="step2Complete">
						<ng-template matStepLabel>Background</ng-template>
						<app-step-background
							(childNextStep)="onChildNextStep()"
							(nextReview)="onGoToReview()"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextStepperStep)="onNextStepperStep(stepper)"
							(scrollIntoView)="onScrollIntoView()"
						></app-step-background>
					</mat-step>

					<mat-step [completed]="step3Complete">
						<ng-template matStepLabel>Identification</ng-template>
						<app-step-identification-anonymous
							(childNextStep)="onChildNextStep()"
							(nextReview)="onGoToReview()"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextStepperStep)="onNextStepperStep(stepper)"
							(scrollIntoView)="onScrollIntoView()"
						></app-step-identification-anonymous>
					</mat-step>

					<mat-step completed="false">
						<ng-template matStepLabel>Review and Confirm</ng-template>
						<ng-template matStepContent>
							<app-step-review-licence
								(previousStepperStep)="onPreviousStepperStep(stepper)"
								(nextStepperStep)="onNextStepperStep(stepper)"
								(scrollIntoView)="onScrollIntoView()"
								(goToStep)="onGoToStep($event)"
							></app-step-review-licence>
						</ng-template>
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
export class WorkerLicenceNewWizardAnonymousComponent extends BaseWizardComponent implements OnInit {
	readonly STEP_LICENCE_SELECTION = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_BACKGROUND = 1;
	readonly STEP_IDENTIFICATION = 2;
	readonly STEP_REVIEW = 3;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;

	@ViewChild(StepLicenceSelectionComponent)
	stepLicenceSelectionComponent!: StepLicenceSelectionComponent;

	@ViewChild(StepBackgroundComponent)
	stepBackgroundComponent!: StepBackgroundComponent;

	@ViewChild(StepIdentificationAnonymousComponent)
	stepIdentificationComponent!: StepIdentificationAnonymousComponent;

	@ViewChild(StepReviewLicenceComponent)
	stepReviewLicenceComponent!: StepReviewLicenceComponent;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private licenceApplicationService: LicenceApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.updateCompleteStatus();
	}

	onStepSelectionChange(event: StepperSelectionEvent) {
		switch (event.selectedIndex) {
			case this.STEP_LICENCE_SELECTION:
				this.stepLicenceSelectionComponent?.onGoToFirstStep();
				break;
			case this.STEP_BACKGROUND:
				this.stepBackgroundComponent?.onGoToFirstStep();
				break;
			case this.STEP_IDENTIFICATION:
				this.stepIdentificationComponent?.onGoToFirstStep();
				break;
			case this.STEP_REVIEW:
				this.stepReviewLicenceComponent?.onGoToFirstStep();
				break;
		}
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();

		switch (stepper.selectedIndex) {
			case this.STEP_LICENCE_SELECTION:
				this.router.navigateByUrl(
					LicenceApplicationRoutes.pathSecurityWorkerLicenceAnonymous(
						LicenceApplicationRoutes.LICENCE_APPLICATION_TYPE_ANONYMOUS
					)
				);
				break;
			case this.STEP_BACKGROUND:
				this.stepBackgroundComponent?.onGoToLastStep();
				break;
			case this.STEP_IDENTIFICATION:
				this.stepIdentificationComponent?.onGoToLastStep();
				break;
		}
	}

	onNextStepperStep(stepper: MatStepper): void {
		this.updateCompleteStatus();

		if (stepper?.selected) stepper.selected.completed = true;
		stepper.next();
	}

	onGoToStep(step: number) {
		if (step == 4) {
			this.stepper.selectedIndex = this.STEP_IDENTIFICATION;
			this.stepIdentificationComponent.onGoToContactStep();
			return;
		}

		this.stepLicenceSelectionComponent?.onGoToFirstStep();
		this.stepBackgroundComponent?.onGoToFirstStep();
		this.stepIdentificationComponent?.onGoToFirstStep();
		this.stepper.selectedIndex = step;
	}

	onGoToReview() {
		this.updateCompleteStatus();

		setTimeout(() => {
			// hack... does not navigate without the timeout
			this.stepper.selectedIndex = this.STEP_REVIEW;
		}, 250);
	}

	private updateCompleteStatus(): void {
		this.step1Complete = this.licenceApplicationService.isStepLicenceSelectionComplete();
		this.step2Complete = this.licenceApplicationService.isStepBackgroundComplete();
		this.step3Complete = this.licenceApplicationService.isStepIdentificationComplete();

		// console.debug('iscomplete', this.step1Complete, this.step2Complete, this.step3Complete);
	}

	onChildNextStep() {
		switch (this.stepper.selectedIndex) {
			case this.STEP_LICENCE_SELECTION:
				this.stepLicenceSelectionComponent?.onGoToNextStep();
				break;
			case this.STEP_BACKGROUND:
				this.stepBackgroundComponent?.onGoToNextStep();
				break;
			case this.STEP_IDENTIFICATION:
				this.stepIdentificationComponent?.onGoToNextStep();
				break;
		}
		this.updateCompleteStatus();
	}
}
