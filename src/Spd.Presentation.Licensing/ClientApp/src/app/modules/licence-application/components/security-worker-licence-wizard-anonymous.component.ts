import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { BehaviorSubject, distinctUntilChanged, Subscription } from 'rxjs';
import { LicenceApplicationService } from '../services/licence-application.service';
import { StepBackgroundComponent } from '../step-components/wizard-steps/step-background.component';
import { StepIdentificationAnonymousComponent } from '../step-components/wizard-steps/step-identification-anonymous.component';
import { StepLicenceSelectionComponent } from '../step-components/wizard-steps/step-licence-selection.component';
import { StepLicenceSetupAnonymousComponent } from '../step-components/wizard-steps/step-licence-setup-anonymous.component';
import { StepReviewLicenceComponent } from '../step-components/wizard-steps/step-review-licence.component';

@Component({
	selector: 'app-security-worker-licence-wizard-anonymous',
	template: `
		<ng-container *ngIf="isLoaded$ | async">
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
							<ng-template matStepLabel> Licence Setup </ng-template>
							<app-step-licence-setup-anonymous
								(childNextStep)="onChildNextStep()"
								(nextReview)="onGoToReview()"
								(nextStepperStep)="onNextStepperStep(stepper)"
								(scrollIntoView)="onScrollIntoView()"
							></app-step-licence-setup-anonymous>
						</mat-step>

						<mat-step [completed]="step2Complete">
							<ng-template matStepLabel> Licence Selection </ng-template>
							<app-step-licence-selection
								(childNextStep)="onChildNextStep()"
								(nextReview)="onGoToReview()"
								(previousStepperStep)="onPreviousStepperStep(stepper)"
								(nextStepperStep)="onNextStepperStep(stepper)"
								(scrollIntoView)="onScrollIntoView()"
							></app-step-licence-selection>
						</mat-step>

						<mat-step [completed]="step3Complete">
							<ng-template matStepLabel>Background</ng-template>
							<app-step-background
								(childNextStep)="onChildNextStep()"
								(nextReview)="onGoToReview()"
								(previousStepperStep)="onPreviousStepperStep(stepper)"
								(nextStepperStep)="onNextStepperStep(stepper)"
								(scrollIntoView)="onScrollIntoView()"
							></app-step-background>
						</mat-step>

						<mat-step [completed]="step4Complete">
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
		</ng-container>
	`,
	styles: [],
})
export class SecurityWorkerLicenceWizardAnonymousComponent implements OnInit, OnDestroy, AfterViewInit {
	private licenceModelLoadedSubscription!: Subscription;
	// private licenceModelChangedSubscription!: Subscription;

	readonly STEP_LICENCE_SETUP = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_LICENCE_SELECTION = 1;
	readonly STEP_BACKGROUND = 2;
	readonly STEP_IDENTIFICATION = 3;
	readonly STEP_REVIEW = 4;

	isLoaded$ = new BehaviorSubject<boolean>(false);

	orientation: StepperOrientation = 'vertical';

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;
	step4Complete = false;

	@ViewChild(StepLicenceSetupAnonymousComponent)
	stepLicenceSetupAnonymousComponent!: StepLicenceSetupAnonymousComponent;

	@ViewChild(StepLicenceSelectionComponent)
	stepLicenceSelectionComponent!: StepLicenceSelectionComponent;

	@ViewChild(StepBackgroundComponent)
	stepBackgroundComponent!: StepBackgroundComponent;

	@ViewChild(StepIdentificationAnonymousComponent)
	stepIdentificationComponent!: StepIdentificationAnonymousComponent;

	@ViewChild(StepReviewLicenceComponent)
	stepReviewLicenceComponent!: StepReviewLicenceComponent;

	@ViewChild('stepper') stepper!: MatStepper;

	constructor(
		private breakpointObserver: BreakpointObserver,
		private licenceApplicationService: LicenceApplicationService
	) {}

	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.licenceModelLoadedSubscription = this.licenceApplicationService.licenceModelLoaded$.subscribe({
			next: () => {
				this.updateCompleteStatus();
				this.isLoaded$.next(true);
			},
		});
	}

	ngAfterViewInit(): void {
		if (this.step1Complete) {
			if (this.step4Complete) {
				this.stepper.selectedIndex = this.STEP_REVIEW;
			} else if (this.step3Complete) {
				this.stepper.selectedIndex = this.STEP_IDENTIFICATION;
			} else if (this.step2Complete) {
				this.stepper.selectedIndex = this.STEP_BACKGROUND;
			} else {
				this.stepper.selectedIndex = this.STEP_LICENCE_SELECTION;
			}
		}
	}

	ngOnDestroy() {
		if (this.licenceModelLoadedSubscription) this.licenceModelLoadedSubscription.unsubscribe();
		// if (this.licenceModelChangedSubscription) this.licenceModelChangedSubscription.unsubscribe();
	}

	onStepSelectionChange(event: StepperSelectionEvent) {
		switch (event.selectedIndex) {
			case this.STEP_LICENCE_SETUP:
				this.stepLicenceSetupAnonymousComponent.onGoToFirstStep();
				break;
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

	onScrollIntoView(): void {
		this.scrollIntoView();
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();

		switch (stepper.selectedIndex) {
			case this.STEP_LICENCE_SETUP:
				this.stepLicenceSetupAnonymousComponent.onGoToLastStep();
				break;
			case this.STEP_LICENCE_SELECTION:
				this.stepLicenceSelectionComponent?.onGoToLastStep();
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

		this.stepLicenceSetupAnonymousComponent?.onGoToFirstStep();
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
		this.step1Complete = this.licenceApplicationService.isStep1Complete();
		this.step2Complete = this.licenceApplicationService.isStep2Complete();
		this.step3Complete = this.licenceApplicationService.isStep3Complete();
		this.step4Complete = this.licenceApplicationService.isStep4Complete();

		// console.debug('iscomplete', this.step1Complete, this.step2Complete, this.step3Complete, this.step4Complete);
	}

	onChildNextStep() {
		switch (this.stepper.selectedIndex) {
			case this.STEP_LICENCE_SETUP:
				this.stepLicenceSetupAnonymousComponent.onGoToNextStep();
				break;
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

	private breakpointChanged() {
		if (this.breakpointObserver.isMatched(Breakpoints.XLarge) || this.breakpointObserver.isMatched(Breakpoints.Large)) {
			this.orientation = 'horizontal';
		} else {
			this.orientation = 'vertical';
		}
	}

	private scrollIntoView(): void {
		const stepIndex = this.stepper.selectedIndex;
		const stepId = this.stepper._getStepLabelId(stepIndex);
		const stepElement = document.getElementById(stepId);
		if (stepElement) {
			setTimeout(() => {
				stepElement.scrollIntoView({
					block: 'start',
					inline: 'nearest',
					behavior: 'smooth',
				});
			}, 250);
		}
	}
}
