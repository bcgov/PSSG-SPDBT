import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { Subscription } from 'rxjs';
import { BaseWizardStepComponent } from 'src/app/core/components/base-wizard-step.component';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { StepPermitAliasesComponent } from './step-permit-aliases.component';
import { StepPermitBcDriverLicenceComponent } from './step-permit-bc-driver-licence.component';
import { StepPermitCitizenshipComponent } from './step-permit-citizenship.component';
import { StepPermitCriminalHistoryComponent } from './step-permit-criminal-history.component';
import { StepPermitFingerprintsComponent } from './step-permit-fingerprints.component';
import { StepPermitPersonalInformationComponent } from './step-permit-personal-information.component';
import { StepPermitPhotographOfYourselfComponent } from './step-permit-photograph-of-yourself.component';
import { StepPermitPhysicalCharacteristicsComponent } from './step-permit-physical-characteristics.component';

@Component({
	selector: 'app-steps-permit-identification',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-permit-personal-information
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-personal-information>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_PERSONAL_INFORMATION)"
							*ngIf="isLoggedIn"
						>
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_PERSONAL_INFORMATION)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onNextReview(STEP_PERSONAL_INFORMATION)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>
			<mat-step>
				<app-step-permit-criminal-history
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-criminal-history>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_CRIMINAL_HISTORY)"
							*ngIf="isLoggedIn"
						>
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_CRIMINAL_HISTORY)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_CRIMINAL_HISTORY)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-permit-fingerprints [applicationTypeCode]="applicationTypeCode"></app-step-permit-fingerprints>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_FINGERPRINTS)"
							*ngIf="isLoggedIn"
						>
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_FINGERPRINTS)">
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_FINGERPRINTS)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-permit-aliases [applicationTypeCode]="applicationTypeCode"></app-step-permit-aliases>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_ALIASES)"
							*ngIf="isLoggedIn"
						>
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_ALIASES)">
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_ALIASES)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-permit-citizenship [applicationTypeCode]="applicationTypeCode"></app-step-permit-citizenship>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_CITIZENSHIP)"
							*ngIf="isLoggedIn"
						>
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_CITIZENSHIP)">
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_CITIZENSHIP)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-permit-bc-driver-licence
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-bc-driver-licence>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_BC_DRIVERS_LICENCE)"
							*ngIf="isLoggedIn"
						>
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_BC_DRIVERS_LICENCE)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_BC_DRIVERS_LICENCE)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-permit-physical-characteristics
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-physical-characteristics>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_PHYSICAL_CHARACTERISTICS)"
							*ngIf="isLoggedIn"
						>
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_PHYSICAL_CHARACTERISTICS)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onNextReview(STEP_PHYSICAL_CHARACTERISTICS)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-permit-photograph-of-yourself
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-photograph-of-yourself>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_PHOTOGRAPH_OF_YOURSELF)"
							*ngIf="isLoggedIn"
						>
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onStepNext(STEP_PHOTOGRAPH_OF_YOURSELF)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onNextReview(STEP_PHOTOGRAPH_OF_YOURSELF)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsPermitIdentificationComponent extends BaseWizardStepComponent implements OnInit, OnDestroy {
	readonly STEP_PERSONAL_INFORMATION = 1;
	readonly STEP_CRIMINAL_HISTORY = 2;
	readonly STEP_FINGERPRINTS = 3;
	readonly STEP_ALIASES = 4;
	readonly STEP_CITIZENSHIP = 5;
	readonly STEP_BC_DRIVERS_LICENCE = 6;
	readonly STEP_PHYSICAL_CHARACTERISTICS = 7;
	readonly STEP_PHOTOGRAPH_OF_YOURSELF = 8;

	private authenticationSubscription!: Subscription;
	private licenceModelChangedSubscription!: Subscription;

	isLoggedIn = false;
	isFormValid = false;

	applicationTypeCode: ApplicationTypeCode | null = null;
	applicationTypeCodes = ApplicationTypeCode;

	@ViewChild(StepPermitPersonalInformationComponent)
	stepPersonalInformationComponent!: StepPermitPersonalInformationComponent;
	@ViewChild(StepPermitCriminalHistoryComponent) stepCriminalHistoryComponent!: StepPermitCriminalHistoryComponent;
	@ViewChild(StepPermitFingerprintsComponent) stepFingerprintsComponent!: StepPermitFingerprintsComponent;
	@ViewChild(StepPermitAliasesComponent) stepAliasesComponent!: StepPermitAliasesComponent;
	@ViewChild(StepPermitCitizenshipComponent) stepCitizenshipComponent!: StepPermitCitizenshipComponent;
	@ViewChild(StepPermitBcDriverLicenceComponent)
	stepDriverLicenceComponent!: StepPermitBcDriverLicenceComponent;
	@ViewChild(StepPermitPhysicalCharacteristicsComponent)
	stepCharacteristicsComponent!: StepPermitPhysicalCharacteristicsComponent;
	@ViewChild(StepPermitPhotographOfYourselfComponent)
	stepPhotographComponent!: StepPermitPhotographOfYourselfComponent;

	constructor(
		private authProcessService: AuthProcessService,
		private permitApplicationService: PermitApplicationService
	) {
		super();
	}

	ngOnInit(): void {
		this.licenceModelChangedSubscription = this.permitApplicationService.permitModelValueChanges$.subscribe(
			(_resp: any) => {
				// console.debug('permitModelValueChanges$', _resp);
				this.isFormValid = _resp;

				this.applicationTypeCode = this.permitApplicationService.permitModelFormGroup.get(
					'applicationTypeData.applicationTypeCode'
				)?.value;
			}
		);

		this.authenticationSubscription = this.authProcessService.waitUntilAuthentication$.subscribe(
			(isLoggedIn: boolean) => {
				this.isLoggedIn = isLoggedIn;
			}
		);
	}

	ngOnDestroy() {
		if (this.authenticationSubscription) this.authenticationSubscription.unsubscribe();
		if (this.licenceModelChangedSubscription) this.licenceModelChangedSubscription.unsubscribe();
	}

	override onFormValidNextStep(_formNumber: number): void {
		const isValid = this.dirtyForm(_formNumber);
		console.log('onFormValidNextStep isValid', this.childstepper.selectedIndex, isValid);
		if (!isValid) return;

		this.childNextStep.next(true);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_PERSONAL_INFORMATION:
				return this.stepPersonalInformationComponent.isFormValid();
			case this.STEP_CRIMINAL_HISTORY:
				return this.stepCriminalHistoryComponent.isFormValid();
			case this.STEP_FINGERPRINTS:
				return this.stepFingerprintsComponent.isFormValid();
			case this.STEP_ALIASES:
				return this.stepAliasesComponent.isFormValid();
			case this.STEP_CITIZENSHIP:
				return this.stepCitizenshipComponent.isFormValid();
			case this.STEP_BC_DRIVERS_LICENCE:
				return this.stepDriverLicenceComponent.isFormValid();
			case this.STEP_PHYSICAL_CHARACTERISTICS:
				return this.stepCharacteristicsComponent.isFormValid();
			case this.STEP_PHOTOGRAPH_OF_YOURSELF:
				return this.stepPhotographComponent.isFormValid();
		}
		return false;
	}
}
