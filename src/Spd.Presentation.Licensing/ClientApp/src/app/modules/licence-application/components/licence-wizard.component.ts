import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { BehaviorSubject, distinctUntilChanged, Subscription } from 'rxjs';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { LicenceApplicationRoutes } from '../licence-application-routing.module';
import { LicenceApplicationService, LicenceModelSubject } from '../licence-application.service';
import { StepBackgroundComponent } from '../step-components/main-steps/step-background.component';
import { StepIdentificationComponent } from '../step-components/main-steps/step-identification.component';
import { StepLicenceSelectionComponent } from '../step-components/main-steps/step-licence-selection.component';
import { StepReviewComponent } from '../step-components/main-steps/step-review.component';
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
						<mat-step completed="true">
							<ng-template matStepLabel>
								<span *ngIf="isNotReplacement; else isReplacementTabName">Licence Selection</span>
								<ng-template #isReplacementTabName>Licence Confirmation</ng-template>
							</ng-template>
							<app-step-licence-selection (nextStepperStep)="onNextStepperStep(stepper)"></app-step-licence-selection>
						</mat-step>

						<ng-container *ngIf="isNotReplacement">
							<mat-step completed="true">
								<ng-template matStepLabel>Background</ng-template>
								<app-step-background
									(previousStepperStep)="onPreviousStepperStep(stepper)"
									(nextStepperStep)="onNextStepperStep(stepper)"
								></app-step-background>
							</mat-step>

							<mat-step completed="true">
								<ng-template matStepLabel>Identification</ng-template>
								<app-step-identification
									(previousStepperStep)="onPreviousStepperStep(stepper)"
									(nextStepperStep)="onNextStepperStep(stepper)"
								></app-step-identification>
							</mat-step>

							<mat-step completed="true">
								<ng-template matStepLabel>Review and Confirm</ng-template>
								<ng-template matStepContent>
									<app-step-review
										(previousStepperStep)="onPreviousStepperStep(stepper)"
										(nextStepperStep)="onNextStepperStep(stepper)"
									></app-step-review>
								</ng-template>
							</mat-step>
						</ng-container>

						<ng-container *ngIf="isReplacement">
							<!-- <mat-step completed="true">
								<ng-template matStepLabel>Licence Confirmation</ng-template>
								<app-step-review
									(previousStepperStep)="onPreviousStepperStep(stepper)"
									(nextStepperStep)="onNextStepperStep(stepper)"
								></app-step-review>
							</mat-step> -->

							<mat-step completed="true">
								<ng-template matStepLabel>Address Update</ng-template>
								<app-step-review
									(previousStepperStep)="onPreviousStepperStep(stepper)"
									(nextStepperStep)="onNextStepperStep(stepper)"
								></app-step-review>
							</mat-step>
						</ng-container>

						<mat-step completed="true">
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
						class="icon-button-large"
						color="accent"
						style="color: white; top: 10px;"
						matTooltip="Save & Exit"
						aria-label="Save & Exit"
						(click)="onSave()"
					>
						<mat-icon>save</mat-icon>
					</button>
					<!-- <button mat-fab color="primary" matTooltip="Save & Exit" aria-label="Save & Exit">
					<mat-icon>save</mat-icon>
				</button> -->
				</div>
			</div>
		</ng-container>
	`,
	styles: [],
})
export class LicenceWizardComponent implements OnInit, OnDestroy {
	private licenceModelLoadedSubscription!: Subscription;

	readonly STEP_LICENCE_SELECTION = 0;
	readonly STEP_BACKGROUND = 1;
	readonly STEP_IDENTIFICATION = 2;
	readonly STEP_REVIEW = 3;

	isLoaded$ = new BehaviorSubject<boolean>(false);

	orientation: StepperOrientation = 'vertical';

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
		private authProcessService: AuthProcessService
	) {}

	ngOnInit(): void {
		console.log('LicenceWizardComponent ONINIT', this.licenceApplicationService.initialized);

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		if (!this.licenceApplicationService.initialized) {
			this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.APPLICATIONS_IN_PROGRESS));
			return;
		}

		this.licenceApplicationService.notifyLoaded();

		this.licenceModelLoadedSubscription = this.licenceApplicationService.licenceModelLoaded$.subscribe({
			next: (loaded: LicenceModelSubject) => {
				if (loaded.isLoaded || loaded.isSetFlags) {
					this.isReplacement = this.licenceApplicationService.licenceModel.isReplacement ?? false;
					this.isNotReplacement = this.licenceApplicationService.licenceModel.isNotReplacement ?? false;

					this.isLoaded$.next(true);
				}
			},
		});
	}

	ngOnDestroy() {
		if (this.licenceModelLoadedSubscription) this.licenceModelLoadedSubscription.unsubscribe();
	}

	onStepSelectionChange(event: StepperSelectionEvent) {
		this.scrollIntoView();
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		// console.log('previous', stepper);
		stepper.previous();
	}

	onNextStepperStep(stepper: MatStepper): void {
		// console.log('next', stepper);
		stepper.next();
	}

	onSave() {
		this.licenceApplicationService.saveLicence();
		// this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.APPLICATIONS_IN_PROGRESS));
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
