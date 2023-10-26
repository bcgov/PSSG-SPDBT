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
	selector: 'app-licence-wizard',
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
									(childNextStep)="onChildNextStep()"
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
				<div class="col-xl-1 col-lg-12 text-end">
					<!-- <button mat-flat-button class="large mat-green-button w-auto mt-2" matTooltip="Save & Exit" (click)="onSave()">
					<mat-icon class="m-0">save</mat-icon>
				</button> -->
					<button
						mat-fab
						class="icon-button-large mx-3"
						color="primary"
						style="color: white; top: 10px;"
						matTooltip="Save & Exit"
						aria-label="Save and Exit"
						(click)="onSave()"
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

					<!-- <button
						*ngIf="isFormValid"
						mat-raised-button
						class="large mt-3"
						color="primary"
						matTooltip="Go to Review"
						aria-label="Go to Review"
						(click)="onGoToReview()"
					>
						Next: Review >
					</button> -->
					<!-- <button mat-fab color="primary" matTooltip="Save & Exit" aria-label="Save & Exit">
					<mat-icon>save</mat-icon>
				</button> -->
				</div>
			</div>
		</ng-container>
	`,
	styles: [],
})
export class LicenceWizardComponent implements OnInit, OnDestroy, AfterViewInit {
	private licenceModelLoadedSubscription!: Subscription;
	private licenceModelChangedSubscription!: Subscription;

	readonly STEP_LICENCE_SELECTION = 0;
	readonly STEP_BACKGROUND = 1;
	readonly STEP_IDENTIFICATION = 2;
	readonly STEP_REVIEW = 3;

	isLoaded$ = new BehaviorSubject<boolean>(false);

	orientation: StepperOrientation = 'vertical';

	hasValueChanged = false;
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
		console.log(
			'LicenceWizardComponent ONINIT',
			this.licenceApplicationService.initialized,
			this.licenceApplicationService.licenceModelFormGroup.value
		);
		this.isFormValid = this.licenceApplicationService.licenceModelFormGroup.valid;

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		if (!this.licenceApplicationService.initialized) {
			this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.APPLICATIONS_IN_PROGRESS));
			return;
		}

		this.licenceModelLoadedSubscription = this.licenceApplicationService.licenceModelLoaded$.subscribe({
			next: () => {
				console.log('LicenceWizardComponent ISLOADED');

				this.step1Complete = this.licenceApplicationService.isStep1Complete();
				this.step2Complete = this.licenceApplicationService.isStep2Complete();
				this.step3Complete = this.licenceApplicationService.isStep3Complete();

				this.isLoaded$.next(true);
			},
		});

		this.licenceModelChangedSubscription = this.licenceApplicationService.licenceModelFormGroup.valueChanges
			.pipe(debounceTime(500), distinctUntilChanged())
			.subscribe((xxx: any) => {
				this.hasValueChanged = true;
				console.log('valueChanges', this.licenceApplicationService.licenceModelFormGroup.valid);
				// console.log('xxx', this.licenceApplicationService.licenceModelFormGroup);

				// Object.keys(this.form.controls).forEach((key) => {
				// 	console.log(this.form.get(key)?.errors);
				// });
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
		// this.saveIfChanged();
		if (this.hasValueChanged) {
			this.licenceApplicationService.saveLicence().subscribe({
				next: (resp) => {
					this.hotToastService.success('Licence information has been saved');
					this.hasValueChanged = false;

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
				error: (error) => {
					// only 404 will be here as an error
					console.log('An error occurred during save', error);
				},
			});
		} else {
			this.hasValueChanged = false;
			if (stepper?.selected) stepper.selected.completed = true;
			stepper.next();
		}
	}

	onGoToStep(step: number) {
		console.debug('onGoToStep', step);
		// this.saveIfChanged();

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

	onSave() {
		this.licenceApplicationService.saveLicence().subscribe({
			next: (resp) => {
				this.hotToastService.success('Licence information has been saved');
				this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.APPLICATIONS_IN_PROGRESS));
			},
			error: (error) => {
				// only 404 will be here as an error
				console.log('An error occurred during save', error);
			},
		});
	}

	onGoToReview() {
		this.stepper.selectedIndex = this.STEP_REVIEW;
	}

	onChildNextStep() {
		// this.saveIfChanged();
		if (this.hasValueChanged) {
			this.licenceApplicationService.saveLicence().subscribe({
				next: (resp) => {
					this.hotToastService.success('Licence information has been saved');
					this.hasValueChanged = false;
					this.goToChildNextStep();
				},
				error: (error) => {
					// only 404 will be here as an error
					console.log('An error occurred during save', error);
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

	// private saveIfChanged() {
	// 	console.log('saveIfChanged', this.hasValueChanged);

	// 	if (this.hasValueChanged) {
	// 		this.licenceApplicationService.saveLicence().subscribe({
	// 			next: (resp) => {
	// 				this.hotToastService.success('Licence information has been saved');
	// 				this.hasValueChanged = false;
	// 			},
	// 			error: (error) => {
	// 				// only 404 will be here as an error
	// 				console.log('An error occurred during save', error);
	// 			},
	// 		});
	// 	}
	// }

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
