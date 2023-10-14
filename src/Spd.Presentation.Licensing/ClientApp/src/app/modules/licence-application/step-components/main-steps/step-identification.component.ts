import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import {
	ProofOfAbilityToWorkInCanadaCode,
	ProofOfCanadianCitizenshipCode,
} from 'src/app/core/code-types/model-desc.models';
import { LicenceApplicationService } from '../../licence-application.service';
import { AdditionalGovIdComponent } from '../additional-gov-id.component';
import { AliasesComponent } from '../aliases.component';
import { BcDriverLicenceComponent } from '../bc-driver-licence.component';
import { CitizenshipComponent } from '../citizenship.component';
import { ContactInformationComponent } from '../contact-information.component';
import { HeightAndWeightComponent } from '../height-and-weight.component';
import { MailingAddressComponent } from '../mailing-address.component';
import { PhotoComponent } from '../photo.component';
import { ResidentialAddressComponent } from '../residential-address.component';

@Component({
	selector: 'app-step-identification',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-aliases></app-aliases>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_ALIASES)">
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-citizenship></app-citizenship>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_CITIZENSHIP)">
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showAdditionalGovermentIdStep">
				<app-additional-gov-id></app-additional-gov-id>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_ADDITIONAL_GOV_ID)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-bc-driver-licence></app-bc-driver-licence>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_BC_DRIVERS_LICENCE)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-height-and-weight></app-height-and-weight>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_HEIGHT_AND_WEIGHT)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-photo></app-photo>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_PHOTO)">
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-residential-address></app-residential-address>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_RESIDENTIAL_ADDRESS)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showMailingAddressStep">
				<app-mailing-address></app-mailing-address>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_MAILING_ADDRESS)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-contact-information></app-contact-information>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext(STEP_CONTACT_INFORMATION)">
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
export class StepIdentificationComponent {
	readonly STEP_ALIASES = '1';
	readonly STEP_CITIZENSHIP = '2';
	readonly STEP_ADDITIONAL_GOV_ID = '3';
	readonly STEP_BC_DRIVERS_LICENCE = '4';
	readonly STEP_HEIGHT_AND_WEIGHT = '5';
	readonly STEP_PHOTO = '6';
	readonly STEP_RESIDENTIAL_ADDRESS = '7';
	readonly STEP_MAILING_ADDRESS = '8';
	readonly STEP_CONTACT_INFORMATION = '9';

	showAdditionalGovermentIdStep = true;
	showMailingAddressStep = true;

	@Output() previousStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();

	@ViewChild(AliasesComponent) aliasesComponent!: AliasesComponent;
	@ViewChild(CitizenshipComponent) citizenshipComponent!: CitizenshipComponent;
	@ViewChild(AdditionalGovIdComponent) additionalGovIdComponent!: AdditionalGovIdComponent;
	@ViewChild(BcDriverLicenceComponent) bcDriverLicenceComponent!: BcDriverLicenceComponent;
	@ViewChild(HeightAndWeightComponent) heightAndWeightComponent!: HeightAndWeightComponent;
	@ViewChild(PhotoComponent) photoComponent!: PhotoComponent;
	@ViewChild(ResidentialAddressComponent) residentialAddressComponent!: ResidentialAddressComponent;
	@ViewChild(MailingAddressComponent) mailingAddressComponent!: MailingAddressComponent;
	@ViewChild(ContactInformationComponent) contactInformationComponent!: ContactInformationComponent;

	@ViewChild('childstepper') private childstepper!: MatStepper;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

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
		this.setStepData();

		const isValid = this.dirtyForm(formNumber);
		// console.log('onFormValidNextStep formNumber:', formNumber, isValid);

		if (!isValid) return;

		if (formNumber == this.STEP_CITIZENSHIP) {
			const proofOfCitizenship = this.licenceApplicationService.licenceModelFormGroup.controls[
				'citizenshipFormGroup'
			].get('proofOfCitizenship') as FormControl;
			const proofOfAbility = this.licenceApplicationService.licenceModelFormGroup.controls['citizenshipFormGroup'].get(
				'proofOfAbility'
			) as FormControl;

			this.showAdditionalGovermentIdStep = !(
				proofOfCitizenship.value == ProofOfCanadianCitizenshipCode.ValidCanadianPassport ||
				proofOfAbility.value == ProofOfAbilityToWorkInCanadaCode.ValidPermanentResidentCard
			);
		} else if (formNumber == this.STEP_RESIDENTIAL_ADDRESS) {
			const isMailingTheSameAsResidential = this.licenceApplicationService.licenceModelFormGroup.controls[
				'residentialAddressFormGroup'
			].get('isMailingTheSameAsResidential') as FormControl;

			this.showMailingAddressStep = !isMailingTheSameAsResidential.value;
		}

		this.childstepper.next();
	}

	private setStepData(): void {
		let stepData = {
			...(this.aliasesComponent ? this.aliasesComponent.getDataToSave() : {}),
			...(this.citizenshipComponent ? this.citizenshipComponent.getDataToSave() : {}),
			...(this.additionalGovIdComponent ? this.additionalGovIdComponent.getDataToSave() : {}),
			...(this.bcDriverLicenceComponent ? this.bcDriverLicenceComponent.getDataToSave() : {}),
			...(this.heightAndWeightComponent ? this.heightAndWeightComponent.getDataToSave() : {}),
			...(this.residentialAddressComponent ? this.residentialAddressComponent.getDataToSave() : {}),
			...(this.mailingAddressComponent ? this.mailingAddressComponent.getDataToSave() : {}),
			...(this.contactInformationComponent ? this.contactInformationComponent.getDataToSave() : {}),
		};

		this.licenceApplicationService.notifyModelChanged(stepData);

		// console.log('IDENTIFICATION stepData', stepData);
		// console.log('IDENTIFICATION stepData2', this.licenceApplicationService.licenceModel);
	}

	private dirtyForm(step: string): boolean {
		switch (step) {
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
				return this.contactInformationComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
