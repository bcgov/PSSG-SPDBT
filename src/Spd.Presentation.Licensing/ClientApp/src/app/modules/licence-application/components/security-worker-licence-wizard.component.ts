import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { LicenceApplicationRoutes } from '../licence-application-routing.module';
import { LicenceApplicationService } from '../licence-application.service';
import { StepBackgroundComponent } from '../step-components/wizard-steps/step-background.component';
import { StepIdentificationComponent } from '../step-components/wizard-steps/step-identification.component';
import { StepLicenceSelectionComponent } from '../step-components/wizard-steps/step-licence-selection.component';
import { StepReviewComponent } from '../step-components/wizard-steps/step-review.component';

@Component({
	selector: 'app-security-worker-licence-wizard',
	template: `
		<ng-container *ngIf="isLoaded$ | async">
			<div class="row">
				<div class="offset-xl-1 col-xl-10 col-lg-12">
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
								(nextStepperStep)="onNextStepperStep(stepper)"
								(scrollIntoView)="onScrollIntoView()"
							></app-step-licence-selection>
						</mat-step>

						<mat-step [completed]="step2Complete">
							<ng-template matStepLabel>Background</ng-template>
							<app-step-background
								(childNextStep)="onChildNextStep()"
								(previousStepperStep)="onPreviousStepperStep(stepper)"
								(nextStepperStep)="onNextStepperStep(stepper)"
								(scrollIntoView)="onScrollIntoView()"
							></app-step-background>
						</mat-step>

						<mat-step [completed]="step3Complete">
							<ng-template matStepLabel>Identification</ng-template>
							<app-step-identification
								(childNextStep)="onChildNextStep()"
								(previousStepperStep)="onPreviousStepperStep(stepper)"
								(nextStepperStep)="onNextStepperStep(stepper)"
								(scrollIntoView)="onScrollIntoView()"
							></app-step-identification>
						</mat-step>

						<mat-step completed="false">
							<ng-template matStepLabel>Review and Confirm</ng-template>
							<ng-template matStepContent>
								<app-step-review
									(previousStepperStep)="onPreviousStepperStep(stepper)"
									(nextStepperStep)="onNextStepperStep(stepper)"
									(scrollIntoView)="onScrollIntoView()"
									(goToStep)="onGoToStep($event)"
								></app-step-review>
							</ng-template>
						</mat-step>

						<mat-step completed="false">
							<ng-template matStepLabel>Pay</ng-template>
						</mat-step>
					</mat-stepper>
				</div>
				<div class="col-xl-1 col-lg-12 text-center">
					<button
						mat-fab
						class="icon-button-large mx-3"
						color="primary"
						style="color: white; top: 10px;"
						matTooltip="Save and Exit"
						aria-label="Save and Exit"
						(click)="onSaveAndExit()"
					>
						<mat-icon>exit_to_app</mat-icon>
					</button>
					<!--TODO   && stepper.selectedIndex != STEP_REVIEW -->
					<button
						*ngIf="isFormValid"
						mat-fab
						class="icon-button-large m-3"
						color="primary"
						style="color: white; top: 10px;"
						matTooltip="Go to Review"
						aria-label="Go to Review"
						(click)="onGoToReview()"
					>
						<mat-icon>skip_next</mat-icon>
					</button>

					<div class="m-3">
						<a class="large" style="top: 10px;" (click)="onSaveAndExit()"> Save and Exit </a>
					</div>
					<div class="m-3">
						<a *ngIf="isFormValid" class="large" style="top: 10px;" (click)="onGoToReview()"> Go to Review </a>
					</div>
					<!-- <div class="m-3">
						<a class="large" style="color: var(--color-red) !important;" (click)="onGoToReview()">
							Cancel Business Licence Application
						</a>
					</div> -->

					<!-- 
						Next: Review >
					 -->
				</div>
			</div>
		</ng-container>
	`,
	styles: [],
})
export class SecurityWorkerLicenceWizardComponent implements OnInit, OnDestroy, AfterViewInit {
	private licenceModelLoadedSubscription!: Subscription;
	private licenceModelChangedSubscription!: Subscription;

	readonly STEP_LICENCE_SELECTION = 0;
	readonly STEP_BACKGROUND = 1;
	readonly STEP_IDENTIFICATION = 2;
	readonly STEP_REVIEW = 3;

	isLoaded$ = new BehaviorSubject<boolean>(false);

	orientation: StepperOrientation = 'vertical';

	// hasValueChanged = false;
	isFormValid = false;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;

	isReplacement: boolean = false;
	isNotReplacement: boolean = false;

	@ViewChild(StepLicenceSelectionComponent)
	stepLicenceSelectionComponent!: StepLicenceSelectionComponent;

	@ViewChild(StepBackgroundComponent)
	stepBackgroundComponent!: StepBackgroundComponent;

	@ViewChild(StepIdentificationComponent)
	stepIdentificationComponent!: StepIdentificationComponent;

	@ViewChild(StepReviewComponent)
	stepReviewComponent!: StepReviewComponent;

	@ViewChild('stepper') stepper!: MatStepper;

	constructor(
		private router: Router,
		private breakpointObserver: BreakpointObserver,
		private licenceApplicationService: LicenceApplicationService,
		private authProcessService: AuthProcessService,
		private hotToastService: HotToastService
	) {}

	ngOnInit(): void {
		// console.log(
		// 	'LicenceWizardComponent ONINIT',
		// 	this.licenceApplicationService.initialized,
		// 	this.licenceApplicationService.licenceModelFormGroup.value
		// );
		this.isFormValid = this.licenceApplicationService.licenceModelFormGroup.valid;

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.licenceModelLoadedSubscription = this.licenceApplicationService.licenceModelLoaded$.subscribe({
			next: () => {
				this.step1Complete = this.licenceApplicationService.isStep1Complete();
				this.step2Complete = this.licenceApplicationService.isStep2Complete();
				this.step3Complete = this.licenceApplicationService.isStep3Complete();

				this.isLoaded$.next(true);
			},
		});

		this.licenceModelChangedSubscription = this.licenceApplicationService.licenceModelFormGroup.valueChanges
			.pipe(debounceTime(200), distinctUntilChanged())
			.subscribe((_resp: any) => {
				this.licenceApplicationService.hasValueChanged = true;

				console.debug(
					'valueChanges changed flags',
					'hasValueChanged',
					this.licenceApplicationService.hasValueChanged,
					'hasDocumentsChanged',
					this.licenceApplicationService.hasDocumentsChanged
				);

				console.debug('valueChanges isFormValid', this.licenceApplicationService.licenceModelFormGroup.valid);
				this.isFormValid = this.licenceApplicationService.licenceModelFormGroup.valid;
			});
	}

	ngAfterViewInit(): void {
		if (this.step1Complete) {
			if (this.step3Complete) {
				this.stepper.selectedIndex = this.STEP_REVIEW;
			} else if (this.step2Complete) {
				this.stepper.selectedIndex = this.STEP_IDENTIFICATION;
			} else {
				this.stepper.selectedIndex = this.STEP_BACKGROUND;
			}
		}
	}

	ngOnDestroy() {
		if (this.licenceModelLoadedSubscription) this.licenceModelLoadedSubscription.unsubscribe();
		if (this.licenceModelChangedSubscription) this.licenceModelChangedSubscription.unsubscribe();
	}

	onStepSelectionChange(event: StepperSelectionEvent) {
		if (event.selectedIndex == 3) {
			console.log('onStepSelectionChange', event);
		}

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
				this.stepReviewComponent?.onGoToFirstStep();
				break;
		}

		// 	this.scrollIntoView();
	}

	onScrollIntoView(): void {
		this.scrollIntoView();
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		// this.saveIfChanged();

		stepper.previous();

		switch (stepper.selectedIndex) {
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
		if (this.licenceApplicationService.hasValueChanged) {
			this.licenceApplicationService.saveLicence().subscribe({
				next: (resp: any) => {
					this.licenceApplicationService.hasValueChanged = false;
					this.licenceApplicationService.hasDocumentsChanged = false;

					this.hotToastService.success('Licence information has been saved');

					if (stepper?.selected) stepper.selected.completed = true;

					stepper.next();

					switch (stepper.selectedIndex) {
						case this.STEP_LICENCE_SELECTION:
							this.stepLicenceSelectionComponent?.onGoToFirstStep();
							break;
						case this.STEP_BACKGROUND:
							this.stepBackgroundComponent?.onGoToFirstStep();
							break;
						case this.STEP_IDENTIFICATION:
							this.stepIdentificationComponent?.onGoToFirstStep();
							break;
					}
				},
				error: (error: any) => {
					console.log('An error occurred during save', error);
					this.hotToastService.error('An error occurred during the save. Please try again.');
				},
			});
		} else {
			if (stepper?.selected) stepper.selected.completed = true;
			stepper.next();
		}
	}

	onGoToStep(step: number) {
		console.debug('onGoToStep', step);

		if (step == 3) {
			this.stepper.selectedIndex = 2;
			this.stepIdentificationComponent.onGoToContactStep();
			return;
		}

		this.stepLicenceSelectionComponent?.onGoToFirstStep();
		this.stepBackgroundComponent?.onGoToFirstStep();
		this.stepIdentificationComponent?.onGoToFirstStep();
		this.stepper.selectedIndex = step;
	}

	onSaveAndExit() {
		this.licenceApplicationService.saveLicence().subscribe({
			next: (resp: any) => {
				this.licenceApplicationService.hasValueChanged = false;
				this.licenceApplicationService.hasDocumentsChanged = false;

				this.hotToastService.success('Licence information has been saved');
				this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.USER_APPLICATIONS));
			},
			error: (error: any) => {
				// only 404 will be here as an error
				// TODO what error codes to handle here?
				console.log('An error occurred during save', error);
				this.hotToastService.error('An error occurred during the save. Please try again.');
			},
		});
	}

	onGoToReview() {
		if (this.licenceApplicationService.hasValueChanged) {
			this.licenceApplicationService.saveLicence().subscribe({
				next: (resp: any) => {
					this.licenceApplicationService.hasValueChanged = false;
					this.licenceApplicationService.hasDocumentsChanged = false;

					this.hotToastService.success('Licence information has been saved');
					this.stepper.selectedIndex = this.STEP_REVIEW;
				},
				error: (error: any) => {
					// only 404 will be here as an error
					console.log('An error occurred during save', error);
					this.hotToastService.error('An error occurred during the save. Please try again.');
				},
			});
		} else {
			this.stepper.selectedIndex = this.STEP_REVIEW;
		}
	}

	onChildNextStep() {
		if (this.licenceApplicationService.hasValueChanged) {
			this.licenceApplicationService.saveLicence().subscribe({
				next: (resp: any) => {
					this.licenceApplicationService.hasValueChanged = false;
					this.licenceApplicationService.hasDocumentsChanged = false;

					this.hotToastService.success('Licence information has been saved');
					this.goToChildNextStep();
				},
				error: (error: any) => {
					// only 404 will be here as an error
					console.log('An error occurred during save', error);
					this.hotToastService.error('An error occurred during the save. Please try again.');
				},
			});
		} else {
			this.goToChildNextStep();
		}
	}

	private goToChildNextStep() {
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
