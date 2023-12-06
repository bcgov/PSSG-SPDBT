import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';
import { HttpErrorResponse } from '@angular/common/http';
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
import { StepLicenceSetupAuthenticatedComponent } from '../step-components/wizard-steps/step-licence-setup-authenticated.component';
import { StepReviewComponent } from '../step-components/wizard-steps/step-review.component';

@Component({
	selector: 'app-security-worker-licence-authenticated-wizard',
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
							<app-step-licence-setup-authenticated
								(childNextStep)="onChildNextStep()"
								(saveAndExit)="onSaveAndExit()"
								(nextReview)="onGoToReview()"
								(nextStepperStep)="onNextStepperStep(stepper)"
								(scrollIntoView)="onScrollIntoView()"
							></app-step-licence-setup-authenticated>
						</mat-step>

						<mat-step [completed]="step2Complete">
							<ng-template matStepLabel> Licence Selection </ng-template>
							<app-step-licence-selection
								(childNextStep)="onChildNextStep()"
								(previousStepperStep)="onPreviousStepperStep(stepper)"
								(saveAndExit)="onSaveAndExit()"
								(nextReview)="onGoToReview()"
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
							<app-step-identification-authenticated
								(childNextStep)="onChildNextStep()"
								(saveAndExit)="onSaveAndExit()"
								(nextReview)="onGoToReview()"
								(previousStepperStep)="onPreviousStepperStep(stepper)"
								(nextStepperStep)="onNextStepperStep(stepper)"
								(scrollIntoView)="onScrollIntoView()"
							></app-step-identification-authenticated>
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
export class SecurityWorkerLicenceAuthenticatedWizardComponent implements OnInit, OnDestroy, AfterViewInit {
	private licenceModelLoadedSubscription!: Subscription;
	private licenceModelChangedSubscription!: Subscription;

	readonly STEP_LICENCE_SETUP = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_LICENCE_SELECTION = 1;
	readonly STEP_BACKGROUND = 2;
	readonly STEP_IDENTIFICATION = 3;
	readonly STEP_REVIEW = 4;

	isLoaded$ = new BehaviorSubject<boolean>(false);

	orientation: StepperOrientation = 'vertical';

	isFormValid = false;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;
	step4Complete = false;

	isReplacement = false;
	isNotReplacement = false;

	@ViewChild(StepLicenceSetupAuthenticatedComponent)
	stepLicenceSetupAuthenticatedComponent!: StepLicenceSetupAuthenticatedComponent;

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

				this.isFormValid = this.licenceApplicationService.licenceModelFormGroup.valid;
				console.debug(
					'*******valueChanges to TRUE',
					'valueChanges isFormValid',
					this.licenceApplicationService.licenceModelFormGroup.valid
				);
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
		if (this.licenceModelChangedSubscription) this.licenceModelChangedSubscription.unsubscribe();
	}

	onStepSelectionChange(event: StepperSelectionEvent) {
		switch (event.selectedIndex) {
			case this.STEP_LICENCE_SETUP:
				this.stepLicenceSetupAuthenticatedComponent?.onGoToFirstStep();
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
				this.stepLicenceSetupAuthenticatedComponent?.onGoToLastStep();
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
		if (this.licenceApplicationService.hasValueChanged) {
			this.licenceApplicationService.saveLicenceStep().subscribe({
				next: (_resp: any) => {
					this.licenceApplicationService.hasValueChanged = false;

					this.hotToastService.success('Licence information has been saved');

					if (stepper?.selected) stepper.selected.completed = true;
					stepper.next();

					switch (stepper.selectedIndex) {
						case this.STEP_LICENCE_SETUP:
							this.stepLicenceSetupAuthenticatedComponent?.onGoToFirstStep();
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
				error: (error: HttpErrorResponse) => {
					// only 403s will be here as an error
					if (error.status == 403) {
						this.handleDuplicateLicence();
					}
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
			this.stepper.selectedIndex = this.STEP_LICENCE_SETUP;
			return;
		}

		this.stepLicenceSetupAuthenticatedComponent?.onGoToFirstStep();
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
			error: (error: HttpErrorResponse) => {
				// only 403s will be here as an error
				if (error.status == 403) {
					this.handleDuplicateLicence();
				}
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
				error: (error: HttpErrorResponse) => {
					// only 403s will be here as an error
					if (error.status == 403) {
						this.handleDuplicateLicence();
					}
				},
			});
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
		if (this.licenceApplicationService.hasValueChanged) {
			this.licenceApplicationService.saveLicenceStep().subscribe({
				next: (_resp: any) => {
					this.licenceApplicationService.hasValueChanged = false;
					this.hotToastService.success('Licence information has been saved');
					this.goToChildNextStep();
				},
				error: (error: HttpErrorResponse) => {
					// only 403s will be here as an error
					if (error.status == 403) {
						this.handleDuplicateLicence();
					}
				},
			});
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
				this.stepLicenceSetupAuthenticatedComponent?.onGoToNextStep();
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
