import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { AppRoutes } from 'src/app/app-routing.module';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import { LicenceApplicationRoutes } from '../licence-application-routing.module';
import { LicenceApplicationService } from '../licence-application.service';
import { StepBackgroundComponent } from '../step-components/wizard-steps/step-background.component';
import { StepIdentificationAuthenticatedComponent } from '../step-components/wizard-steps/step-identification-authenticated.component';
import { StepLicenceSelectionComponent } from '../step-components/wizard-steps/step-licence-selection.component';
import { StepLicenceSetupAnonymousComponent } from '../step-components/wizard-steps/step-licence-setup-anonymous.component';
import { StepReviewComponent } from '../step-components/wizard-steps/step-review.component';

@Component({
	selector: 'app-security-worker-licence-anonymous-wizard',
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
								(saveAndExit)="onSaveAndExit()"
								(nextReview)="onGoToReview()"
								(nextStepperStep)="onNextStepperStep(stepper)"
								(scrollIntoView)="onScrollIntoView()"
							></app-step-licence-setup-anonymous>
						</mat-step>

						<mat-step [completed]="step2Complete">
							<ng-template matStepLabel> Licence Selection </ng-template>
							<app-step-licence-selection
								(childNextStep)="onChildNextStep()"
								(saveAndExit)="onSaveAndExit()"
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
								(saveAndExit)="onSaveAndExit()"
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
								(saveAndExit)="onSaveAndExit()"
								(nextReview)="onGoToReview()"
								(previousStepperStep)="onPreviousStepperStep(stepper)"
								(nextStepperStep)="onNextStepperStep(stepper)"
								(scrollIntoView)="onScrollIntoView()"
							></app-step-identification-anonymous>
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
			</div>
		</ng-container>
	`,
	styles: [],
})
export class SecurityWorkerLicenceAnonymousWizardComponent implements OnInit, OnDestroy, AfterViewInit {
	private licenceModelLoadedSubscription!: Subscription;
	private licenceModelChangedSubscription!: Subscription;

	readonly STEP_LICENCE_SETUP = 1;
	readonly STEP_LICENCE_SELECTION = 2;
	readonly STEP_BACKGROUND = 3;
	readonly STEP_IDENTIFICATION = 4;
	readonly STEP_REVIEW = 5;

	isLoaded$ = new BehaviorSubject<boolean>(false);

	orientation: StepperOrientation = 'vertical';

	isFormValid = false;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;
	step4Complete = false;

	isReplacement = false;
	isNotReplacement = false;

	@ViewChild(StepLicenceSetupAnonymousComponent)
	stepLicenceSetupAnonymousComponent!: StepLicenceSetupAnonymousComponent;

	@ViewChild(StepLicenceSelectionComponent)
	stepLicenceSelectionComponent!: StepLicenceSelectionComponent;

	@ViewChild(StepBackgroundComponent)
	stepBackgroundComponent!: StepBackgroundComponent;

	@ViewChild(StepIdentificationAuthenticatedComponent)
	stepIdentificationComponent!: StepIdentificationAuthenticatedComponent;

	@ViewChild(StepReviewComponent)
	stepReviewComponent!: StepReviewComponent;

	@ViewChild('stepper') stepper!: MatStepper;

	constructor(
		private router: Router,
		private dialog: MatDialog,
		private authenticationService: AuthenticationService,
		private breakpointObserver: BreakpointObserver,
		private licenceApplicationService: LicenceApplicationService,
		private hotToastService: HotToastService
	) {}

	ngOnInit(): void {
		this.isFormValid = this.licenceApplicationService.licenceModelFormGroup.valid;

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

		this.licenceModelChangedSubscription = this.licenceApplicationService.licenceModelFormGroup.valueChanges
			.pipe(debounceTime(200), distinctUntilChanged())
			.subscribe((_resp: any) => {
				this.licenceApplicationService.hasValueChanged = true;

				console.debug('*******valueChanges to TRUE');
				this.isFormValid = this.licenceApplicationService.licenceModelFormGroup.valid;
				console.debug('valueChanges isFormValid', this.licenceApplicationService.licenceModelFormGroup.valid);
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
				this.stepReviewComponent?.onGoToFirstStep();
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
		if (this.licenceApplicationService.hasValueChanged && this.authenticationService.isLoggedIn()) {
			this.licenceApplicationService.saveLicenceStep().subscribe({
				next: (_resp: any) => {
					this.licenceApplicationService.hasValueChanged = false;

					this.hotToastService.success('Licence information has been saved');

					if (stepper?.selected) stepper.selected.completed = true;
					stepper.next();

					switch (stepper.selectedIndex) {
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
					}
				},
				error: (_error: any) => {
					// only 403s will be here as an error
					this.handleDuplicateLicence();
				},
			});
		} else {
			if (stepper?.selected) stepper.selected.completed = true;
			stepper.next();
		}
	}

	onGoToStep(step: number) {
		console.debug('onGoToStep', step);

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

	onSaveAndExit() {
		if (!this.authenticationService.isLoggedIn()) {
			this.exitAndLoseChanges();
			return;
		}

		this.licenceApplicationService.saveLicenceStep().subscribe({
			next: (_resp: any) => {
				this.licenceApplicationService.hasValueChanged = false;

				this.hotToastService.success('Licence information has been saved');
				this.router.navigateByUrl(
					LicenceApplicationRoutes.path(LicenceApplicationRoutes.USER_APPLICATIONS_AUTHENTICATED)
				);
			},
			error: (_error: any) => {
				// only 403s will be here as an error
				this.handleDuplicateLicence();
			},
		});
	}

	private exitAndLoseChanges() {
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: 'Are you sure you want to leave this application? All of your data will be lost.',
			actionText: 'Yes',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.router.navigate([AppRoutes.LANDING]);
				}
			});
	}

	onGoToReview() {
		console.log(
			'onGoToReview',
			this.licenceApplicationService.hasValueChanged,
			this.authenticationService.isLoggedIn()
		);

		if (this.authenticationService.isLoggedIn()) {
			if (this.licenceApplicationService.hasValueChanged) {
				this.licenceApplicationService.saveLicenceStep().subscribe({
					next: (_resp: any) => {
						this.licenceApplicationService.hasValueChanged = false;
						this.updateCompleteStatus();

						this.hotToastService.success('Licence information has been saved');

						setTimeout(() => {
							// hack... does not navigate without the timeout
							this.stepper.selectedIndex = this.STEP_REVIEW;
						}, 250);
					},
					error: (_error: any) => {
						// only 403s will be here as an error
						this.handleDuplicateLicence();
					},
				});
			} else {
				this.stepper.selectedIndex = this.STEP_REVIEW;
			}
		} else {
			this.stepper.selectedIndex = this.STEP_REVIEW;
		}
	}

	private updateCompleteStatus(): void {
		this.step1Complete = this.licenceApplicationService.isStep1Complete();
		this.step2Complete = this.licenceApplicationService.isStep2Complete();
		this.step3Complete = this.licenceApplicationService.isStep3Complete();
		this.step4Complete = this.licenceApplicationService.isStep4Complete();

		console.log('iscomplete', this.step1Complete, this.step2Complete, this.step3Complete);
	}

	onChildNextStep() {
		if (this.authenticationService.isLoggedIn()) {
			if (this.licenceApplicationService.hasValueChanged) {
				this.licenceApplicationService.saveLicenceStep().subscribe({
					next: (_resp: any) => {
						this.licenceApplicationService.hasValueChanged = false;
						this.updateCompleteStatus();

						this.hotToastService.success('Licence information has been saved');
						this.goToChildNextStep();
					},
					error: (_error: any) => {
						// only 403s will be here as an error
						this.handleDuplicateLicence();
					},
				});
			} else {
				this.goToChildNextStep();
			}
		} else {
			this.goToChildNextStep();
		}
	}

	private handleDuplicateLicence(): void {
		const data: DialogOptions = {
			icon: 'error',
			title: 'Confirmation',
			message:
				'You already have the same kind of licence or licence application. Do you want to edit this licence information or return to your list?',
			actionText: 'Edit',
			cancelText: 'Go back',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (!response) {
					this.router.navigate([
						LicenceApplicationRoutes.path(LicenceApplicationRoutes.USER_APPLICATIONS_AUTHENTICATED),
					]);
				}
			});
	}

	private goToChildNextStep() {
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
