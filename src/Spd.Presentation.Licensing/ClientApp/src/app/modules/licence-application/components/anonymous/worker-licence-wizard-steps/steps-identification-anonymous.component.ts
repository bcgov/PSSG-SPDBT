import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { Subscription } from 'rxjs';
import { StepAdditionalGovIdComponent } from '../../shared/worker-licence-wizard-child-steps/step-additional-gov-id.component';
import { StepAliasesComponent } from '../../shared/worker-licence-wizard-child-steps/step-aliases.component';
import { StepBcDriverLicenceComponent } from '../../shared/worker-licence-wizard-child-steps/step-bc-driver-licence.component';
import { StepCitizenshipComponent } from '../../shared/worker-licence-wizard-child-steps/step-citizenship.component';
import { StepContactInformationComponent } from '../../shared/worker-licence-wizard-child-steps/step-contact-information.component';
import { StepMailingAddressComponent } from '../../shared/worker-licence-wizard-child-steps/step-mailing-address.component';
import { StepPhotographOfYourselfAnonymousComponent } from '../../shared/worker-licence-wizard-child-steps/step-photograph-of-yourself.component-anonymous';
import { StepPhysicalCharacteristicsComponent } from '../../shared/worker-licence-wizard-child-steps/step-physical-characteristics.component';
import { StepResidentialAddressComponent } from '../../shared/worker-licence-wizard-child-steps/step-residential-address.component';
import { StepPersonalInformationAnonymousComponent } from './step-personal-information-anonymous.component';

@Component({
	selector: 'app-steps-identification-anonymous',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-personal-information-anonymous
					[applicationTypeCode]="applicationTypeCode"
				></app-step-personal-information-anonymous>

				<div class="row wizard-button-row">
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
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
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

			<mat-step *ngIf="applicationTypeCode !== applicationTypeCodes.Update">
				<app-step-aliases></app-step-aliases>

				<div class="row wizard-button-row">
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

			<mat-step *ngIf="applicationTypeCode !== applicationTypeCodes.Update">
				<app-step-citizenship></app-step-citizenship>

				<div class="row wizard-button-row">
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

			<mat-step *ngIf="showAdditionalGovermentIdStep && applicationTypeCode !== applicationTypeCodes.Update">
				<app-step-additional-gov-id></app-step-additional-gov-id>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_ADDITIONAL_GOV_ID)"
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
							(click)="onFormValidNextStep(STEP_ADDITIONAL_GOV_ID)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_ADDITIONAL_GOV_ID)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="applicationTypeCode !== applicationTypeCodes.Update">
				<app-step-bc-driver-licence></app-step-bc-driver-licence>

				<div class="row wizard-button-row">
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
				<app-step-physical-characteristics
					[applicationTypeCode]="applicationTypeCode"
				></app-step-physical-characteristics>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_HEIGHT_AND_WEIGHT)"
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
							(click)="onFormValidNextStep(STEP_HEIGHT_AND_WEIGHT)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_HEIGHT_AND_WEIGHT)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-photograph-of-yourself-anonymous
					[applicationTypeCode]="applicationTypeCode"
				></app-step-photograph-of-yourself-anonymous>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button class="large bordered mb-2" (click)="onSaveAndExit(STEP_PHOTO)" *ngIf="isLoggedIn">
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_PHOTO)">
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_PHOTO)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-residential-address [applicationTypeCode]="applicationTypeCode"></app-step-residential-address>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_RESIDENTIAL_ADDRESS)"
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
							(click)="onFormValidNextStep(STEP_RESIDENTIAL_ADDRESS)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_RESIDENTIAL_ADDRESS)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showMailingAddressStep">
				<app-step-mailing-address [applicationTypeCode]="applicationTypeCode"></app-step-mailing-address>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_MAILING_ADDRESS)"
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
							(click)="onFormValidNextStep(STEP_MAILING_ADDRESS)"
						>
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_MAILING_ADDRESS)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-contact-information [applicationTypeCode]="applicationTypeCode"></app-step-contact-information>

				<div class="row wizard-button-row">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							class="large bordered mb-2"
							(click)="onSaveAndExit(STEP_CONTACT_INFORMATION)"
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
							color="primary"
							class="large mb-2"
							(click)="onStepNext(STEP_CONTACT_INFORMATION)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsIdentificationAnonymousComponent extends BaseWizardStepComponent implements OnInit, OnDestroy {
	readonly STEP_PERSONAL_INFORMATION = 0;
	readonly STEP_ALIASES = 1;
	readonly STEP_CITIZENSHIP = 2;
	readonly STEP_ADDITIONAL_GOV_ID = 3;
	readonly STEP_BC_DRIVERS_LICENCE = 4;
	readonly STEP_HEIGHT_AND_WEIGHT = 5;
	readonly STEP_PHOTO = 6;
	readonly STEP_RESIDENTIAL_ADDRESS = 7;
	readonly STEP_MAILING_ADDRESS = 8;
	readonly STEP_CONTACT_INFORMATION = 9;

	private authenticationSubscription!: Subscription;
	private licenceModelChangedSubscription!: Subscription;

	isLoggedIn = false;
	isFormValid = false;

	applicationTypeCode: ApplicationTypeCode | null = null;
	applicationTypeCodes = ApplicationTypeCode;

	@ViewChild(StepPersonalInformationAnonymousComponent)
	personalInformationComponent!: StepPersonalInformationAnonymousComponent;
	@ViewChild(StepAliasesComponent) aliasesComponent!: StepAliasesComponent;
	@ViewChild(StepCitizenshipComponent) citizenshipComponent!: StepCitizenshipComponent;
	@ViewChild(StepAdditionalGovIdComponent) additionalGovIdComponent!: StepAdditionalGovIdComponent;
	@ViewChild(StepBcDriverLicenceComponent) bcDriverLicenceComponent!: StepBcDriverLicenceComponent;
	@ViewChild(StepPhysicalCharacteristicsComponent) heightAndWeightComponent!: StepPhysicalCharacteristicsComponent;
	@ViewChild(StepPhotographOfYourselfAnonymousComponent)
	photoComponent!: StepPhotographOfYourselfAnonymousComponent;
	@ViewChild(StepResidentialAddressComponent) residentialAddressComponent!: StepResidentialAddressComponent;
	@ViewChild(StepMailingAddressComponent) mailingAddressComponent!: StepMailingAddressComponent;
	@ViewChild(StepContactInformationComponent) stepContactInformationComponent!: StepContactInformationComponent;

	constructor(
		private authProcessService: AuthProcessService,
		private licenceApplicationService: LicenceApplicationService
	) {
		super();
	}

	ngOnInit(): void {
		this.authenticationSubscription = this.authProcessService.waitUntilAuthentication$.subscribe(
			(isLoggedIn: boolean) => {
				this.isLoggedIn = isLoggedIn;
			}
		);

		this.licenceModelChangedSubscription = this.licenceApplicationService.licenceModelValueChanges$.subscribe(
			(_resp: any) => {
				// console.debig('StepIdentificationAnonymousComponent licenceModelValueChanges$', _resp);
				this.isFormValid = _resp;

				this.applicationTypeCode = this.licenceApplicationService.licenceModelFormGroup.get(
					'applicationTypeData.applicationTypeCode'
				)?.value;
			}
		);
	}

	ngOnDestroy() {
		if (this.authenticationSubscription) this.authenticationSubscription.unsubscribe();
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
			case this.STEP_ADDITIONAL_GOV_ID:
				return this.additionalGovIdComponent.isFormValid();
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
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	get showMailingAddressStep(): boolean {
		const form = this.licenceApplicationService.residentialAddressFormGroup;
		return !form.value.isMailingTheSameAsResidential;
	}

	get showAdditionalGovermentIdStep(): boolean {
		return this.licenceApplicationService.isShowAdditionalGovermentIdStep();
		// const form = this.licenceApplicationService.citizenshipFormGroup;
		// return (
		// 	(form.value.isCanadianCitizen == BooleanTypeCode.Yes &&
		// 		form.value.canadianCitizenProofTypeCode != LicenceDocumentTypeCode.CanadianPassport) ||
		// 	(form.value.isCanadianCitizen == BooleanTypeCode.No &&
		// 		form.value.notCanadianCitizenProofTypeCode != LicenceDocumentTypeCode.PermanentResidentCard)
		// );
	}
}
