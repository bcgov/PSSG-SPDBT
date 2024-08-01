import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { StepPermitPhysicalCharacteristicsComponent } from '@app/modules/personal-licence-application/components/shared/permit-wizard-step-components/step-permit-physical-characteristics.component';
import { ApplicationService } from '@app/core/services/application.service';
import { PermitApplicationService } from '@core/services/permit-application.service';
import { StepPermitAliasesComponent } from './step-permit-aliases.component';
import { StepPermitBcDriverLicenceComponent } from './step-permit-bc-driver-licence.component';
import { StepPermitCitizenshipComponent } from './step-permit-citizenship.component';
import { StepPermitCriminalHistoryComponent } from './step-permit-criminal-history.component';
import { StepPermitPersonalInformationComponent } from './step-permit-personal-information.component';
import { StepPermitPhotographOfYourselfAnonymousComponent } from './step-permit-photograph-of-yourself-anonymous.component';

@Component({
	selector: 'app-steps-permit-identification-anonymous',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-permit-personal-information
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-personal-information>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onFormValidNextStep(STEP_PERSONAL_INFORMATION)"
					(nextReviewStepperStep)="onNextReview(STEP_PERSONAL_INFORMATION)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-permit-criminal-history
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-criminal-history>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onCriminalHistoryNextStep()"
					(nextReviewStepperStep)="onNextReview(STEP_CRIMINAL_HISTORY)"
				></app-wizard-footer>
			</mat-step>

			<ng-container *ngIf="applicationTypeCode !== applicationTypeCodes.Update">
				<mat-step>
					<app-step-permit-aliases [applicationTypeCode]="applicationTypeCode"></app-step-permit-aliases>

					<app-wizard-footer
						[isFormValid]="isFormValid"
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onFormValidNextStep(STEP_ALIASES)"
						(nextReviewStepperStep)="onNextReview(STEP_ALIASES)"
					></app-wizard-footer>
				</mat-step>

				<mat-step>
					<app-step-permit-citizenship [applicationTypeCode]="applicationTypeCode"></app-step-permit-citizenship>

					<app-wizard-footer
						[isFormValid]="isFormValid"
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onFormValidNextStep(STEP_CITIZENSHIP)"
						(nextReviewStepperStep)="onNextReview(STEP_CITIZENSHIP)"
					></app-wizard-footer>
				</mat-step>

				<mat-step>
					<app-step-permit-bc-driver-licence
						[applicationTypeCode]="applicationTypeCode"
					></app-step-permit-bc-driver-licence>

					<app-wizard-footer
						[isFormValid]="isFormValid"
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onFormValidNextStep(STEP_BC_DRIVERS_LICENCE)"
						(nextReviewStepperStep)="onNextReview(STEP_BC_DRIVERS_LICENCE)"
					></app-wizard-footer>
				</mat-step>

				<mat-step>
					<app-step-permit-physical-characteristics
						[applicationTypeCode]="applicationTypeCode"
					></app-step-permit-physical-characteristics>

					<app-wizard-footer
						[isFormValid]="isFormValid"
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onPhysicalCharacteristicsNextStep()"
						(nextReviewStepperStep)="onNextReview(STEP_PHYSICAL_CHARACTERISTICS)"
					></app-wizard-footer>
				</mat-step>
			</ng-container>

			<mat-step *ngIf="showPhotographOfYourself">
				<app-step-permit-photograph-of-yourself-anonymous
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-photograph-of-yourself-anonymous>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_PHOTOGRAPH_OF_YOURSELF)"
					(nextReviewStepperStep)="onNextReview(STEP_PHOTOGRAPH_OF_YOURSELF)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsPermitIdentificationAnonymousComponent extends BaseWizardStepComponent {
	readonly STEP_PERSONAL_INFORMATION = 1;
	readonly STEP_CRIMINAL_HISTORY = 2;
	readonly STEP_ALIASES = 4;
	readonly STEP_CITIZENSHIP = 5;
	readonly STEP_BC_DRIVERS_LICENCE = 6;
	readonly STEP_PHYSICAL_CHARACTERISTICS = 7;
	readonly STEP_PHOTOGRAPH_OF_YOURSELF = 8;

	applicationTypeCodes = ApplicationTypeCode;

	@Input() applicationTypeCode!: ApplicationTypeCode;
	@Input() isFormValid = false;

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
		override commonApplicationService: ApplicationService,
		private permitApplicationService: PermitApplicationService
	) {
		super(commonApplicationService);
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
