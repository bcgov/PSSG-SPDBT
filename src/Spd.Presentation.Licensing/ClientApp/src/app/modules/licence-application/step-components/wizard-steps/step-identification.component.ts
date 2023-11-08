import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { LicenceDocumentTypeCode } from 'src/app/api/models';
import { BooleanTypeCode } from 'src/app/core/code-types/model-desc.models';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { LicenceStepperStepComponent } from '../../licence-application.helper';
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
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							class="large mb-2"
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
						<button mat-flat-button class="large mb-2" (click)="onNextReview(STEP_PERSONAL_INFORMATION)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-aliases></app-aliases>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button class="large mb-2" (click)="onSaveAndExit(STEP_ALIASES)" *ngIf="isLoggedIn">
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
						<button mat-flat-button class="large mb-2" (click)="onNextReview(STEP_ALIASES)">Next: Review</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-citizenship></app-citizenship>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button class="large mb-2" (click)="onSaveAndExit(STEP_CITIZENSHIP)" *ngIf="isLoggedIn">
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
						<button mat-flat-button class="large mb-2" (click)="onNextReview(STEP_CITIZENSHIP)">Next: Review</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showAdditionalGovermentIdStep">
				<app-additional-gov-id></app-additional-gov-id>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							class="large mb-2"
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
						<button mat-flat-button class="large mb-2" (click)="onNextReview(STEP_ADDITIONAL_GOV_ID)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-bc-driver-licence></app-bc-driver-licence>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							class="large mb-2"
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
						<button mat-flat-button class="large mb-2" (click)="onNextReview(STEP_BC_DRIVERS_LICENCE)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-height-and-weight></app-height-and-weight>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							class="large mb-2"
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
						<button mat-flat-button class="large mb-2" (click)="onNextReview(STEP_HEIGHT_AND_WEIGHT)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-photo></app-photo>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button class="large mb-2" (click)="onSaveAndExit(STEP_PHOTO)" *ngIf="isLoggedIn">
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
						<button mat-flat-button class="large mb-2" (click)="onNextReview(STEP_PHOTO)">Next: Review</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-residential-address></app-residential-address>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							class="large mb-2"
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
						<button mat-flat-button class="large mb-2" (click)="onNextReview(STEP_RESIDENTIAL_ADDRESS)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showMailingAddressStep">
				<app-mailing-address></app-mailing-address>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button class="large mb-2" (click)="onSaveAndExit(STEP_MAILING_ADDRESS)" *ngIf="isLoggedIn">
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
						<button mat-flat-button class="large mb-2" (click)="onNextReview(STEP_MAILING_ADDRESS)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-contact-information></app-contact-information>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							class="large mb-2"
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
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext(STEP_CONTACT_INFORMATION)">
							Next
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button class="large mb-2" (click)="onNextReview(STEP_CONTACT_INFORMATION)">
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
export class StepIdentificationComponent implements OnInit, OnDestroy, LicenceStepperStepComponent {
	readonly STEP_PERSONAL_INFORMATION = '0';
	readonly STEP_ALIASES = '1';
	readonly STEP_CITIZENSHIP = '2';
	readonly STEP_ADDITIONAL_GOV_ID = '3';
	readonly STEP_BC_DRIVERS_LICENCE = '4';
	readonly STEP_HEIGHT_AND_WEIGHT = '5';
	readonly STEP_PHOTO = '6';
	readonly STEP_RESIDENTIAL_ADDRESS = '7';
	readonly STEP_MAILING_ADDRESS = '8';
	readonly STEP_CONTACT_INFORMATION = '9';

	private authenticationSubscription!: Subscription;
	private licenceModelChangedSubscription!: Subscription;

	isLoggedIn = false;
	isFormValid = false;

	@Output() previousStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() scrollIntoView: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() childNextStep: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() saveAndExit: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() nextReview: EventEmitter<boolean> = new EventEmitter<boolean>();

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

	constructor(
		private authProcessService: AuthProcessService,
		private licenceApplicationService: LicenceApplicationService
	) {}

	ngOnInit(): void {
		this.isFormValid = this.licenceApplicationService.licenceModelFormGroup.valid;

		this.licenceModelChangedSubscription = this.licenceApplicationService.licenceModelFormGroup.valueChanges
			.pipe(debounceTime(200), distinctUntilChanged())
			.subscribe((_resp: any) => {
				this.isFormValid = this.licenceApplicationService.licenceModelFormGroup.valid;
			});

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

	onStepSelectionChange(_event: StepperSelectionEvent) {
		this.scrollIntoView.emit(true);
	}

	onStepPrevious(): void {
		this.previousStepperStep.emit(true);
	}

	onStepNext(formNumber: string): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;

		this.nextStepperStep.emit(true);
	}

	onSaveAndExit(formNumber: string): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;

		this.saveAndExit.emit(true);
	}

	onNextReview(formNumber: string): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;

		this.nextReview.emit(true);
	}

	onFormValidNextStep(formNumber: string): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;

		this.childNextStep.emit(true);
	}

	onGoToNextStep() {
		this.childstepper.next();
	}

	onGoToFirstStep() {
		this.childstepper.selectedIndex = 0;
	}

	onGoToLastStep() {
		this.childstepper.selectedIndex = this.childstepper.steps.length - 1;
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
			(form.value.isCanadianCitizen == BooleanTypeCode.Yes &&
				form.value.proofTypeCode != LicenceDocumentTypeCode.CanadianPassport) ||
			(form.value.isCanadianCitizen == BooleanTypeCode.No &&
				form.value.proofOfAbility != LicenceDocumentTypeCode.PermanentResidentCard)
		);
	}
}
