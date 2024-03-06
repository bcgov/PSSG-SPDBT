import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { Subscription } from 'rxjs';
import { StepPermitAliasesComponent } from './step-permit-aliases.component';
import { StepPermitBcDriverLicenceComponent } from './step-permit-bc-driver-licence.component';
import { StepPermitCitizenshipComponent } from './step-permit-citizenship.component';
import { StepPermitCriminalHistoryComponent } from './step-permit-criminal-history.component';
import { StepPermitPersonalInformationComponent } from './step-permit-personal-information.component';
import { StepPermitPhotographOfYourselfAnonymousComponent } from './step-permit-photograph-of-yourself-anonymous.component';
import { StepPermitPhysicalCharacteristicsComponent } from './step-permit-physical-characteristics.component';

@Component({
	selector: 'app-steps-permit-identification-anonymous',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-permit-personal-information
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-personal-information>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12"></div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_PERSONAL_INFORMATION)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
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

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12"></div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onCriminalHistoryNextStep()">
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
							(click)="onNextReview(STEP_CRIMINAL_HISTORY)"
						>
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<ng-container *ngIf="applicationTypeCode !== applicationTypeCodes.Update">
				<mat-step>
					<app-step-permit-aliases [applicationTypeCode]="applicationTypeCode"></app-step-permit-aliases>

					<div class="row wizard-button-row">
						<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12"></div>
						<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
							<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
						</div>
						<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
							<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_ALIASES)">
								Next
							</button>
						</div>
						<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
							<button
								mat-stroked-button
								color="primary"
								class="large next-review-step mb-2"
								(click)="onNextReview(STEP_ALIASES)"
							>
								Next: Review
							</button>
						</div>
					</div>
				</mat-step>

				<mat-step>
					<app-step-permit-citizenship [applicationTypeCode]="applicationTypeCode"></app-step-permit-citizenship>

					<div class="row wizard-button-row">
						<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12"></div>
						<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
							<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
						</div>
						<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
							<button
								mat-flat-button
								color="primary"
								class="large mb-2"
								(click)="onFormValidNextStep(STEP_CITIZENSHIP)"
							>
								Next
							</button>
						</div>
						<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
							<button
								mat-stroked-button
								color="primary"
								class="large next-review-step mb-2"
								(click)="onNextReview(STEP_CITIZENSHIP)"
							>
								Next: Review
							</button>
						</div>
					</div>
				</mat-step>

				<mat-step>
					<app-step-permit-bc-driver-licence
						[applicationTypeCode]="applicationTypeCode"
					></app-step-permit-bc-driver-licence>

					<div class="row wizard-button-row">
						<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12"></div>
						<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
							<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
						</div>
						<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
							<button
								mat-flat-button
								color="primary"
								class="large mb-2"
								(click)="onFormValidNextStep(STEP_BC_DRIVERS_LICENCE)"
							>
								Next
							</button>
						</div>
						<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
							<button
								mat-stroked-button
								color="primary"
								class="large next-review-step mb-2"
								(click)="onNextReview(STEP_BC_DRIVERS_LICENCE)"
							>
								Next: Review
							</button>
						</div>
					</div>
				</mat-step>

				<mat-step>
					<app-step-permit-physical-characteristics
						[applicationTypeCode]="applicationTypeCode"
					></app-step-permit-physical-characteristics>

					<div class="row wizard-button-row">
						<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12"></div>
						<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
							<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
						</div>
						<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
							<button mat-flat-button color="primary" class="large mb-2" (click)="onPhysicalCharacteristicsNextStep()">
								Next
							</button>
						</div>
						<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
							<button
								mat-stroked-button
								color="primary"
								class="large next-review-step mb-2"
								(click)="onNextReview(STEP_PHYSICAL_CHARACTERISTICS)"
							>
								Next: Review
							</button>
						</div>
					</div>
				</mat-step>
			</ng-container>

			<mat-step *ngIf="showPhotographOfYourself">
				<app-step-permit-photograph-of-yourself-anonymous
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-photograph-of-yourself-anonymous>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12"></div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onStepNext(STEP_PHOTOGRAPH_OF_YOURSELF)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-12" *ngIf="isFormValid">
						<button
							mat-stroked-button
							color="primary"
							class="large next-review-step mb-2"
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
export class StepsPermitIdentificationAnonymousComponent extends BaseWizardStepComponent implements OnInit, OnDestroy {
	readonly STEP_PERSONAL_INFORMATION = 1;
	readonly STEP_CRIMINAL_HISTORY = 2;
	readonly STEP_ALIASES = 4;
	readonly STEP_CITIZENSHIP = 5;
	readonly STEP_BC_DRIVERS_LICENCE = 6;
	readonly STEP_PHYSICAL_CHARACTERISTICS = 7;
	readonly STEP_PHOTOGRAPH_OF_YOURSELF = 8;

	private authenticationSubscription!: Subscription;
	private licenceModelChangedSubscription!: Subscription;

	isLoggedIn = false;
	isFormValid = false;

	applicationTypeCodes = ApplicationTypeCode;
	applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(StepPermitPersonalInformationComponent)
	stepPersonalInformationComponent!: StepPermitPersonalInformationComponent;
	@ViewChild(StepPermitCriminalHistoryComponent) stepCriminalHistoryComponent!: StepPermitCriminalHistoryComponent;
	@ViewChild(StepPermitAliasesComponent) stepAliasesComponent!: StepPermitAliasesComponent;
	@ViewChild(StepPermitCitizenshipComponent) stepCitizenshipComponent!: StepPermitCitizenshipComponent;
	@ViewChild(StepPermitBcDriverLicenceComponent)
	stepDriverLicenceComponent!: StepPermitBcDriverLicenceComponent;
	@ViewChild(StepPermitPhysicalCharacteristicsComponent)
	stepCharacteristicsComponent!: StepPermitPhysicalCharacteristicsComponent;
	@ViewChild(StepPermitPhotographOfYourselfAnonymousComponent)
	stepPhotographComponent!: StepPermitPhotographOfYourselfAnonymousComponent;

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

	onCriminalHistoryNextStep(): void {
		if (this.applicationTypeCode === ApplicationTypeCode.Update && !this.showPhotographOfYourself) {
			this.onStepNext(this.STEP_CRIMINAL_HISTORY);
		} else {
			this.onFormValidNextStep(this.STEP_CRIMINAL_HISTORY);
		}
	}

	onPhysicalCharacteristicsNextStep(): void {
		if (!this.showPhotographOfYourself) {
			this.onStepNext(this.STEP_PHYSICAL_CHARACTERISTICS);
		} else {
			this.onFormValidNextStep(this.STEP_PHYSICAL_CHARACTERISTICS);
		}
	}

	onPhotographOfYourselfNextStep(): void {
		if (this.applicationTypeCode === ApplicationTypeCode.Update) {
			this.onStepNext(this.STEP_PHOTOGRAPH_OF_YOURSELF);
		} else {
			this.onFormValidNextStep(this.STEP_PHOTOGRAPH_OF_YOURSELF);
		}
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_PERSONAL_INFORMATION:
				return this.stepPersonalInformationComponent.isFormValid();
			case this.STEP_CRIMINAL_HISTORY:
				return this.stepCriminalHistoryComponent.isFormValid();
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

	get showPhotographOfYourself(): boolean {
		if (this.applicationTypeCode !== ApplicationTypeCode.Update) return true;
		return this.hasGenderChanged;
	}

	// for Update flow: only show unauthenticated user option to upload a new photo if they changed their sex selection earlier in the application
	get hasGenderChanged(): boolean {
		if (this.applicationTypeCode !== ApplicationTypeCode.Update) return false;

		const form = this.permitApplicationService.personalInformationFormGroup;
		return !!form.value.hasGenderChanged;
	}
}
