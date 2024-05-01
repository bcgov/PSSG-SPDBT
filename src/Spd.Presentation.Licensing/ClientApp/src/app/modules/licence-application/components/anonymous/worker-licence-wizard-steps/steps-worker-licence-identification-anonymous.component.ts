import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { StepWorkerLicenceAliasesComponent } from '@app/modules/licence-application/components/shared/worker-licence-wizard-steps/step-worker-licence-aliases.component';
import { StepWorkerLicenceBcDriverLicenceComponent } from '@app/modules/licence-application/components/shared/worker-licence-wizard-steps/step-worker-licence-bc-driver-licence.component';
import { StepWorkerLicenceCitizenshipComponent } from '@app/modules/licence-application/components/shared/worker-licence-wizard-steps/step-worker-licence-citizenship.component';
import { StepWorkerLicenceContactInformationComponent } from '@app/modules/licence-application/components/shared/worker-licence-wizard-steps/step-worker-licence-contact-information.component';
import { StepWorkerLicenceMailingAddressAnonymousComponent } from '@app/modules/licence-application/components/shared/worker-licence-wizard-steps/step-worker-licence-mailing-address-anonymous.component';
import { StepWorkerLicencePhotographOfYourselfAnonymousComponent } from '@app/modules/licence-application/components/shared/worker-licence-wizard-steps/step-worker-licence-photograph-of-yourself-anonymous.component';
import { StepWorkerLicencePhysicalCharacteristicsComponent } from '@app/modules/licence-application/components/shared/worker-licence-wizard-steps/step-worker-licence-physical-characteristics.component';
import { StepWorkerLicenceResidentialAddressComponent } from '@app/modules/licence-application/components/shared/worker-licence-wizard-steps/step-worker-licence-residential-address.component';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { Subscription } from 'rxjs';
import { StepWorkerLicenceReprintComponent } from '../../shared/worker-licence-wizard-steps/step-worker-licence-reprint.component';
import { StepWorkerLicencePersonalInformationAnonymousComponent } from './step-worker-licence-personal-information-anonymous.component';

@Component({
	selector: 'app-steps-worker-licence-identification-anonymous',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-worker-licence-personal-information-anonymous
					[applicationTypeCode]="applicationTypeCode"
				></app-step-worker-licence-personal-information-anonymous>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onFormValidNextStep(STEP_PERSONAL_INFORMATION)"
					(nextReviewStepperStep)="onNextReview(STEP_PERSONAL_INFORMATION)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="applicationTypeCode !== applicationTypeCodes.Update">
				<app-step-worker-licence-aliases [applicationTypeCode]="applicationTypeCode"></app-step-worker-licence-aliases>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_ALIASES)"
					(nextReviewStepperStep)="onNextReview(STEP_ALIASES)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="showCitizenshipStep">
				<app-step-worker-licence-citizenship
					[applicationTypeCode]="applicationTypeCode"
				></app-step-worker-licence-citizenship>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_CITIZENSHIP)"
					(nextReviewStepperStep)="onNextReview(STEP_CITIZENSHIP)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="applicationTypeCode !== applicationTypeCodes.Update">
				<app-step-worker-licence-bc-driver-licence
					[applicationTypeCode]="applicationTypeCode"
				></app-step-worker-licence-bc-driver-licence>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_BC_DRIVERS_LICENCE)"
					(nextReviewStepperStep)="onNextReview(STEP_BC_DRIVERS_LICENCE)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-worker-licence-physical-characteristics
					[applicationTypeCode]="applicationTypeCode"
				></app-step-worker-licence-physical-characteristics>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_HEIGHT_AND_WEIGHT)"
					(nextReviewStepperStep)="onNextReview(STEP_HEIGHT_AND_WEIGHT)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="showPhotographOfYourself">
				<app-step-worker-licence-photograph-of-yourself-anonymous
					[applicationTypeCode]="applicationTypeCode"
				></app-step-worker-licence-photograph-of-yourself-anonymous>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_PHOTO)"
					(nextReviewStepperStep)="onNextReview(STEP_PHOTO)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="showReprint">
				<app-step-worker-licence-reprint></app-step-worker-licence-reprint>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_REPRINT)"
					(nextReviewStepperStep)="onNextReview(STEP_REPRINT)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-worker-licence-residential-address
					[applicationTypeCode]="applicationTypeCode"
				></app-step-worker-licence-residential-address>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_RESIDENTIAL_ADDRESS)"
					(nextReviewStepperStep)="onNextReview(STEP_RESIDENTIAL_ADDRESS)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="showMailingAddressStep">
				<app-step-worker-licence-mailing-address-anonymous
					[applicationTypeCode]="applicationTypeCode"
				></app-step-worker-licence-mailing-address-anonymous>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_MAILING_ADDRESS)"
					(nextReviewStepperStep)="onNextReview(STEP_MAILING_ADDRESS)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-worker-licence-contact-information
					[applicationTypeCode]="applicationTypeCode"
				></app-step-worker-licence-contact-information>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_CONTACT_INFORMATION)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsWorkerLicenceIdentificationAnonymousComponent
	extends BaseWizardStepComponent
	implements OnInit, OnDestroy
{
	readonly STEP_PERSONAL_INFORMATION = 0;
	readonly STEP_ALIASES = 1;
	readonly STEP_CITIZENSHIP = 2;
	readonly STEP_BC_DRIVERS_LICENCE = 3;
	readonly STEP_HEIGHT_AND_WEIGHT = 4;
	readonly STEP_PHOTO = 5;
	readonly STEP_RESIDENTIAL_ADDRESS = 6;
	readonly STEP_MAILING_ADDRESS = 7;
	readonly STEP_CONTACT_INFORMATION = 8;
	readonly STEP_REPRINT = 9;

	private licenceModelChangedSubscription!: Subscription;

	isFormValid = false;
	showMailingAddressStep!: boolean;

	applicationTypeCode: ApplicationTypeCode | null = null;
	applicationTypeCodes = ApplicationTypeCode;

	@ViewChild(StepWorkerLicencePersonalInformationAnonymousComponent)
	personalInformationComponent!: StepWorkerLicencePersonalInformationAnonymousComponent;
	@ViewChild(StepWorkerLicenceAliasesComponent) aliasesComponent!: StepWorkerLicenceAliasesComponent;
	@ViewChild(StepWorkerLicenceCitizenshipComponent) citizenshipComponent!: StepWorkerLicenceCitizenshipComponent;
	@ViewChild(StepWorkerLicenceBcDriverLicenceComponent)
	bcDriverLicenceComponent!: StepWorkerLicenceBcDriverLicenceComponent;
	@ViewChild(StepWorkerLicencePhysicalCharacteristicsComponent)
	heightAndWeightComponent!: StepWorkerLicencePhysicalCharacteristicsComponent;
	@ViewChild(StepWorkerLicencePhotographOfYourselfAnonymousComponent)
	photoComponent!: StepWorkerLicencePhotographOfYourselfAnonymousComponent;
	@ViewChild(StepWorkerLicenceResidentialAddressComponent)
	residentialAddressComponent!: StepWorkerLicenceResidentialAddressComponent;
	@ViewChild(StepWorkerLicenceMailingAddressAnonymousComponent)
	mailingAddressComponent!: StepWorkerLicenceMailingAddressAnonymousComponent;
	@ViewChild(StepWorkerLicenceContactInformationComponent)
	stepContactInformationComponent!: StepWorkerLicenceContactInformationComponent;
	@ViewChild(StepWorkerLicenceReprintComponent)
	stepLicenceReprintComponent!: StepWorkerLicenceReprintComponent;

	constructor(
		override commonApplicationService: CommonApplicationService,
		private licenceApplicationService: LicenceApplicationService
	) {
		super(commonApplicationService);
	}

	ngOnInit(): void {
		// default it
		this.showMailingAddressStep = !this.licenceApplicationService.licenceModelFormGroup.get(
			'residentialAddress.isMailingTheSameAsResidential'
		)?.value;

		this.licenceModelChangedSubscription = this.licenceApplicationService.licenceModelValueChanges$.subscribe(
			(_resp: boolean) => {
				// console.debig('StepIdentificationAnonymousComponent licenceModelValueChanges$', _resp);
				this.isFormValid = _resp;

				this.applicationTypeCode = this.licenceApplicationService.licenceModelFormGroup.get(
					'applicationTypeData.applicationTypeCode'
				)?.value;

				this.showMailingAddressStep = !this.licenceApplicationService.licenceModelFormGroup.get(
					'residentialAddress.isMailingTheSameAsResidential'
				)?.value;
			}
		);
	}

	ngOnDestroy() {
		if (this.licenceModelChangedSubscription) this.licenceModelChangedSubscription.unsubscribe();
	}

	onGoToContactStep() {
		this.childstepper.selectedIndex = this.STEP_RESIDENTIAL_ADDRESS;
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_PERSONAL_INFORMATION:
				return this.personalInformationComponent.isFormValid();
			case this.STEP_ALIASES:
				return this.aliasesComponent.isFormValid();
			case this.STEP_CITIZENSHIP:
				return this.citizenshipComponent.isFormValid();
			case this.STEP_BC_DRIVERS_LICENCE:
				return this.bcDriverLicenceComponent.isFormValid();
			case this.STEP_HEIGHT_AND_WEIGHT:
				return this.heightAndWeightComponent.isFormValid();
			case this.STEP_PHOTO:
				return this.photoComponent.isFormValid();
			case this.STEP_RESIDENTIAL_ADDRESS:
				return this.residentialAddressComponent.isFormValid();
			case this.STEP_MAILING_ADDRESS:
				return this.mailingAddressComponent.isFormValid();
			case this.STEP_CONTACT_INFORMATION:
				return this.stepContactInformationComponent.isFormValid();
			case this.STEP_REPRINT:
				return this.stepLicenceReprintComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	get showCitizenshipStep(): boolean {
		if (this.applicationTypeCode === ApplicationTypeCode.Update) {
			return false;
		} else if (this.applicationTypeCode === ApplicationTypeCode.Renewal) {
			const form = this.licenceApplicationService.citizenshipFormGroup;
			return form.value.isCanadianCitizen === BooleanTypeCode.No;
		}

		return true;
	}

	get showPhotographOfYourself(): boolean {
		if (this.applicationTypeCode !== ApplicationTypeCode.Update) return true;
		return this.hasGenderChanged;
	}

	// for Update flow: only show unauthenticated user option to upload a new photo if they changed their sex selection earlier in the application
	get hasGenderChanged(): boolean {
		if (this.applicationTypeCode !== ApplicationTypeCode.Update) return false;

		const form = this.licenceApplicationService.personalInformationFormGroup;
		return !!form.value.hasGenderChanged;
	}

	// for Update flow: only show unauthenticated user option to upload a new photo if they changed their sex selection earlier in the application
	get hasLegalNameChanged(): boolean {
		if (this.applicationTypeCode !== ApplicationTypeCode.Update) return false;

		const form = this.licenceApplicationService.personalInformationFormGroup;
		return !!form.value.hasLegalNameChanged;
	}

	// for Update flow: only show unauthenticated user option to upload a new photo if they changed their sex selection earlier in the application
	// and name change
	get showReprint(): boolean {
		if (this.applicationTypeCode !== ApplicationTypeCode.Update) return false;

		return this.hasGenderChanged || this.hasLegalNameChanged;
	}
}
