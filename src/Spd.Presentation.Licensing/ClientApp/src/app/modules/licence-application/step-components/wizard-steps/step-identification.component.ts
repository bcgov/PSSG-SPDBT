import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { DocumentTypeCode } from 'src/app/api/models';
import { BooleanTypeCode } from 'src/app/core/code-types/model-desc.models';
import { LicenceApplicationService } from '../../licence-application.service';
import { AdditionalGovIdComponent } from '../additional-gov-id.component';
import { AliasesComponent } from '../aliases.component';
import { BcDriverLicenceComponent } from '../bc-driver-licence.component';
import { CitizenshipComponent } from '../citizenship.component';
import { ContactInformationComponent } from '../contact-information.component';
import { HeightAndWeightComponent } from '../height-and-weight.component';
import { MailingAddressComponent } from '../mailing-address.component';
import { PersonalInformationComponent } from '../personal-information.component';
import { PhotoComponent } from '../photo.component';
import { ResidentialAddressComponent } from '../residential-address.component';

@Component({
	selector: 'app-step-identification',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-personal-information></app-personal-information>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
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
				</div>
			</mat-step>

			<mat-step>
				<app-aliases></app-aliases>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_ALIASES)">
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-citizenship></app-citizenship>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_CITIZENSHIP)">
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showAdditionalGovermentIdStep">
				<app-additional-gov-id></app-additional-gov-id>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
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
				</div>
			</mat-step>

			<mat-step>
				<app-bc-driver-licence></app-bc-driver-licence>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
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
				</div>
			</mat-step>

			<mat-step>
				<app-height-and-weight></app-height-and-weight>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
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
				</div>
			</mat-step>

			<mat-step>
				<app-photo></app-photo>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_PHOTO)">
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-residential-address></app-residential-address>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
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
				</div>
			</mat-step>

			<mat-step *ngIf="showMailingAddressStep">
				<app-mailing-address></app-mailing-address>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
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
				</div>
			</mat-step>

			<mat-step>
				<app-contact-information></app-contact-information>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
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
	readonly STEP_PERSONAL_INFORMATION = '9';
	readonly STEP_ALIASES = '0';
	readonly STEP_CITIZENSHIP = '1';
	readonly STEP_ADDITIONAL_GOV_ID = '2';
	readonly STEP_BC_DRIVERS_LICENCE = '3';
	readonly STEP_HEIGHT_AND_WEIGHT = '4';
	readonly STEP_PHOTO = '5';
	readonly STEP_RESIDENTIAL_ADDRESS = '6';
	readonly STEP_MAILING_ADDRESS = '7';
	readonly STEP_CONTACT_INFORMATION = '8';

	@Output() previousStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() scrollIntoView: EventEmitter<boolean> = new EventEmitter<boolean>();

	@ViewChild(PersonalInformationComponent) personalInformationComponent!: PersonalInformationComponent;
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

	onStepSelectionChange(_event: StepperSelectionEvent) {
		this.scrollIntoView.emit(true);
	}

	onStepPrevious(): void {
		this.previousStepperStep.emit(true);
	}

	onStepNext(formNumber: string): void {
		console.log('onStepNext formNumber:', formNumber);

		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;

		this.nextStepperStep.emit(true);
	}

	onFormValidNextStep(formNumber: string): void {
		const isValid = this.dirtyForm(formNumber);
		// console.log('onFormValidNextStep formNumber:', formNumber, isValid);

		if (!isValid) return;
		this.childstepper.next();
	}

	onGoToFirstStep() {
		this.childstepper.selectedIndex = 0;
	}

	onGoToContactStep() {
		this.childstepper.selectedIndex = this.STEP_RESIDENTIAL_ADDRESS;
	}

	private dirtyForm(step: string): boolean {
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
				return this.contactInformationComponent.isFormValid();
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
		const form = this.licenceApplicationService.citizenshipFormGroup;
		return (
			(form.value.isBornInCanada == BooleanTypeCode.Yes &&
				form.value.proofOfCitizenship != DocumentTypeCode.CanadianPassport) ||
			(form.value.isBornInCanada == BooleanTypeCode.No &&
				form.value.proofOfAbility != DocumentTypeCode.PermanentResidentCard)
		);
	}
}
