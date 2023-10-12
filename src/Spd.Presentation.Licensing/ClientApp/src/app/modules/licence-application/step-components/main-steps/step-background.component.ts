import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { LicenceApplicationService, LicenceModelSubject } from '../../licence-application.service';
import { BackgroundInfoComponent } from '../background-info.component';
import { CriminalHistoryComponent } from '../criminal-history.component';
import { FingerprintsComponent } from '../fingerprints.component';
import { MentalHealthConditionsComponent } from '../mental-health-conditions.component';
import { PoliceBackgroundComponent } from '../police-background.component';

@Component({
	selector: 'app-step-background',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step *ngIf="showStepPoliceBackground">
				<app-police-background></app-police-background>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_POLICE_BACKGROUND)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showStepMentalHealth">
				<app-mental-health-conditions></app-mental-health-conditions>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_MENTAL_HEALTH_CONDITIONS)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showStepCriminalHistory">
				<app-criminal-history></app-criminal-history>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_CRIMINAL_HISTORY)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showStepFingerprints">
				<app-fingerprints></app-fingerprints>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext(STEP_FINGERPRINTS)">
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<!-- <mat-step *ngIf="showStepBackgroundInfo">
				<app-background-info></app-background-info>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext(STEP_BACKGROUND_INFO)">
							Next
						</button>
					</div>
				</div>
			</mat-step> -->
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepBackgroundComponent implements OnInit, OnDestroy {
	private licenceModelLoadedSubscription!: Subscription;

	readonly STEP_POLICE_BACKGROUND = '1';
	readonly STEP_MENTAL_HEALTH_CONDITIONS = '2';
	readonly STEP_CRIMINAL_HISTORY = '3';
	readonly STEP_FINGERPRINTS = '4';
	readonly STEP_BACKGROUND_INFO = '5';

	showStepPoliceBackground: boolean = true;
	showStepMentalHealth: boolean = true;
	showStepCriminalHistory: boolean = true;
	showStepFingerprints: boolean = true;
	showStepBackgroundInfo: boolean = true;

	@ViewChild(PoliceBackgroundComponent) policeBackgroundComponent!: PoliceBackgroundComponent;
	@ViewChild(MentalHealthConditionsComponent) mentalHealthConditionsComponent!: MentalHealthConditionsComponent;
	@ViewChild(CriminalHistoryComponent) criminalHistoryComponent!: CriminalHistoryComponent;
	@ViewChild(FingerprintsComponent) fingerprintsComponent!: FingerprintsComponent;
	@ViewChild(BackgroundInfoComponent) backgroundInfoComponent!: BackgroundInfoComponent;

	@ViewChild('childstepper') private childstepper!: MatStepper;

	@Output() previousStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		console.log('onInit StepBackgroundComponent1');

		this.licenceModelLoadedSubscription = this.licenceModelLoadedSubscription =
			this.licenceApplicationService.licenceModelLoaded$.subscribe({
				next: (loaded: LicenceModelSubject) => {
					console.log(
						'onInit StepBackgroundComponent2',
						this.licenceApplicationService.licenceModel.applicationTypeCode,
						this.showStepPoliceBackground
					);

					if (loaded.isLoaded || loaded.isSetFlags) {
						this.showStepPoliceBackground =
							this.licenceApplicationService.licenceModel.showStepPoliceBackground ?? true;
						this.showStepMentalHealth = this.licenceApplicationService.licenceModel.showStepMentalHealth ?? true;
						this.showStepCriminalHistory = this.licenceApplicationService.licenceModel.showStepCriminalHistory ?? true;
						this.showStepFingerprints = this.licenceApplicationService.licenceModel.showStepFingerprints ?? true;
						this.showStepBackgroundInfo = this.licenceApplicationService.licenceModel.showStepBackgroundInfo ?? true;
					}
					console.log(
						'onInit StepBackgroundComponent3',
						this.licenceApplicationService.licenceModel.applicationTypeCode,
						this.showStepPoliceBackground
					);
				},
			});
	}

	ngOnDestroy() {
		this.licenceModelLoadedSubscription.unsubscribe();
	}

	onStepSelectionChange(event: StepperSelectionEvent) {}

	onStepPrevious(): void {
		this.previousStepperStep.emit(true);
	}

	onStepNext(formNumber: string): void {
		console.log('onStepNext formNumber:', formNumber);

		this.setStepData();

		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;
		this.nextStepperStep.emit(true);
	}

	onFormValidNextStep(formNumber: string): void {
		console.log('onFormValidNextStep formNumber:', formNumber);

		this.setStepData();

		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;
		this.childstepper.next();
	}

	private setStepData(): void {}

	private dirtyForm(step: string): boolean {
		switch (step) {
			case this.STEP_POLICE_BACKGROUND:
				return this.policeBackgroundComponent.isFormValid();
			case this.STEP_MENTAL_HEALTH_CONDITIONS:
				return this.mentalHealthConditionsComponent.isFormValid();
			case this.STEP_CRIMINAL_HISTORY:
				return this.criminalHistoryComponent.isFormValid();
			case this.STEP_FINGERPRINTS:
				return this.fingerprintsComponent.isFormValid();
			// case  this.STEP_BACKGROUND_INFO:
			// return this.backgroundInfoComponent.isFormValid();
		}
		return false;
	}
}
