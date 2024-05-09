import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { Subscription } from 'rxjs';
import { StepPermitBcDriverLicenceComponent } from '../../anonymous/permit-wizard-steps/step-permit-bc-driver-licence.component';
import { StepPermitCitizenshipComponent } from '../../anonymous/permit-wizard-steps/step-permit-citizenship.component';
import { StepPermitPhysicalCharacteristicsComponent } from '../../shared/permit-wizard-steps/step-permit-physical-characteristics.component';
import { StepPermitPhotographOfYourselfComponent } from './step-permit-photograph-of-yourself.component';

@Component({
	selector: 'app-steps-permit-identification-authenticated',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-permit-citizenship [applicationTypeCode]="applicationTypeCode"></app-step-permit-citizenship>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_CITIZENSHIP)"
					(previousStepperStep)="onStepPrevious()"
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
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_BC_DRIVERS_LICENCE)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_BC_DRIVERS_LICENCE)"
					(nextReviewStepperStep)="onNextReview(STEP_BC_DRIVERS_LICENCE)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="showPhotographOfYourself">
				<app-step-permit-photograph-of-yourself
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-photograph-of-yourself>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_PHOTOGRAPH_OF_YOURSELF)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_PHOTOGRAPH_OF_YOURSELF)"
					(nextReviewStepperStep)="onNextReview(STEP_PHOTOGRAPH_OF_YOURSELF)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-permit-physical-characteristics
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-physical-characteristics>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_PHYSICAL_CHARACTERISTICS)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_PHYSICAL_CHARACTERISTICS)"
					(nextReviewStepperStep)="onNextReview(STEP_PHYSICAL_CHARACTERISTICS)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsPermitIdentificationAuthenticatedComponent
	extends BaseWizardStepComponent
	implements OnInit, OnDestroy
{
	readonly STEP_CITIZENSHIP = 1;
	readonly STEP_BC_DRIVERS_LICENCE = 2;
	readonly STEP_PHYSICAL_CHARACTERISTICS = 3;
	readonly STEP_PHOTOGRAPH_OF_YOURSELF = 4;

	private authenticationSubscription!: Subscription;
	private licenceModelChangedSubscription!: Subscription;

	showSaveAndExit = false;
	isFormValid = false;

	applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(StepPermitCitizenshipComponent) stepCitizenshipComponent!: StepPermitCitizenshipComponent;
	@ViewChild(StepPermitBcDriverLicenceComponent)
	stepDriverLicenceComponent!: StepPermitBcDriverLicenceComponent;
	@ViewChild(StepPermitPhysicalCharacteristicsComponent)
	stepCharacteristicsComponent!: StepPermitPhysicalCharacteristicsComponent;
	@ViewChild(StepPermitPhotographOfYourselfComponent)
	stepPhotographComponent!: StepPermitPhotographOfYourselfComponent;

	constructor(
		override commonApplicationService: CommonApplicationService,
		private permitApplicationService: PermitApplicationService
	) {
		super(commonApplicationService);
	}

	ngOnInit(): void {
		this.licenceModelChangedSubscription = this.permitApplicationService.permitModelValueChanges$.subscribe(
			(_resp: any) => {
				// console.debug('permitModelValueChanges$', _resp);
				this.isFormValid = _resp;

				this.applicationTypeCode = this.permitApplicationService.permitModelFormGroup.get(
					'applicationTypeData.applicationTypeCode'
				)?.value;

				this.showSaveAndExit = this.permitApplicationService.isAutoSave();
			}
		);
	}

	ngOnDestroy() {
		if (this.authenticationSubscription) this.authenticationSubscription.unsubscribe();
		if (this.licenceModelChangedSubscription) this.licenceModelChangedSubscription.unsubscribe();
	}

	override onFormValidNextStep(_formNumber: number): void {
		const isValid = this.dirtyForm(_formNumber);
		if (!isValid) return;

		this.childNextStep.next(true);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
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
