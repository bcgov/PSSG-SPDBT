import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { LicenceDocumentTypeCode } from 'src/app/api/models';
import { BooleanTypeCode } from 'src/app/core/code-types/model-desc.models';
import { LicenceStepperStepComponent } from '../../licence-application.helper';
import { LicenceApplicationService } from '../../licence-application.service';
import { AdditionalGovIdComponent } from '../additional-gov-id.component';
import { BcDriverLicenceComponent } from '../bc-driver-licence.component';
import { CitizenshipComponent } from '../citizenship.component';
import { HeightAndWeightComponent } from '../height-and-weight.component';
import { PhotographOfYourselfComponent } from '../photograph-of-yourself.component';

@Component({
	selector: 'app-step-identification-authenticated',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<!-- <mat-step>
				<app-personal-information></app-personal-information>
			</mat-step> -->

			<!-- <mat-step>
				<app-step-aliases></app-step-aliases>
			</mat-step> -->

			<mat-step>
				<app-citizenship></app-citizenship>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button class="large bordered mb-2" (click)="onSaveAndExit(STEP_CITIZENSHIP)">
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

			<mat-step *ngIf="showAdditionalGovermentIdStep">
				<app-additional-gov-id></app-additional-gov-id>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button class="large bordered mb-2" (click)="onSaveAndExit(STEP_ADDITIONAL_GOV_ID)">
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

			<mat-step>
				<app-bc-driver-licence></app-bc-driver-licence>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button class="large bordered mb-2" (click)="onSaveAndExit(STEP_BC_DRIVERS_LICENCE)">
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
				<app-height-and-weight></app-height-and-weight>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button class="large bordered mb-2" (click)="onSaveAndExit(STEP_HEIGHT_AND_WEIGHT)">
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
				<app-photograph-of-yourself></app-photograph-of-yourself>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button class="large bordered mb-2" (click)="onSaveAndExit(STEP_PHOTO)">
							Save and Exit
						</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext(STEP_PHOTO)">Next</button>
					</div>
					<div class="offset-xxl-2 col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6" *ngIf="isFormValid">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onNextReview(STEP_PHOTO)">
							Next: Review
						</button>
					</div>
				</div>
			</mat-step>

			<!--onFormValidNextStep vs onStepNext-->
			<!-- <mat-step>
				<app-step-residential-address></app-step-residential-address>
			</mat-step> -->

			<!-- <mat-step>
				<app-step-mailing-address></app-step-mailing-address>
			</mat-step> -->

			<!-- <mat-step>
				<app-step-contact-information></app-step-contact-information>
			</mat-step> -->
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepIdentificationAuthenticatedComponent implements OnInit, OnDestroy, LicenceStepperStepComponent {
	readonly STEP_CITIZENSHIP = 2;
	readonly STEP_ADDITIONAL_GOV_ID = 3;
	readonly STEP_BC_DRIVERS_LICENCE = 4;
	readonly STEP_HEIGHT_AND_WEIGHT = 5;
	readonly STEP_PHOTO = 6;

	private authenticationSubscription!: Subscription;
	private licenceModelChangedSubscription!: Subscription;

	isFormValid = false;

	@Output() previousStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() scrollIntoView: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() childNextStep: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() saveAndExit: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() nextReview: EventEmitter<boolean> = new EventEmitter<boolean>();

	@ViewChild(CitizenshipComponent) citizenshipComponent!: CitizenshipComponent;
	@ViewChild(AdditionalGovIdComponent) additionalGovIdComponent!: AdditionalGovIdComponent;
	@ViewChild(BcDriverLicenceComponent) bcDriverLicenceComponent!: BcDriverLicenceComponent;
	@ViewChild(HeightAndWeightComponent) heightAndWeightComponent!: HeightAndWeightComponent;
	@ViewChild(PhotographOfYourselfComponent) photoComponent!: PhotographOfYourselfComponent;

	@ViewChild('childstepper') private childstepper!: MatStepper;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.isFormValid = this.licenceApplicationService.licenceModelFormGroup.valid;

		this.licenceModelChangedSubscription = this.licenceApplicationService.licenceModelFormGroup.valueChanges
			.pipe(debounceTime(200), distinctUntilChanged())
			.subscribe((_resp: any) => {
				this.isFormValid = this.licenceApplicationService.licenceModelFormGroup.valid;
			});
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

	onStepNext(formNumber: number): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;

		this.nextStepperStep.emit(true);
	}

	onSaveAndExit(formNumber: number): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;

		this.saveAndExit.emit(true);
	}

	onNextReview(formNumber: number): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;

		this.nextReview.emit(true);
	}

	onFormValidNextStep(formNumber: number): void {
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

	private dirtyForm(step: number): boolean {
		switch (step) {
			// case this.STEP_PERSONAL_INFORMATION:
			// 	return this.personalInformationComponent.isFormValid();
			// case this.STEP_ALIASES:
			// 	return this.aliasesComponent.isFormValid();
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
			// case this.STEP_RESIDENTIAL_ADDRESS:
			// 	return this.residentialAddressComponent.isFormValid();
			// case this.STEP_MAILING_ADDRESS:
			// 	return this.mailingAddressComponent.isFormValid();
			// case this.STEP_CONTACT_INFORMATION:
			// 	return this.contactInformationComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	// get showMailingAddressStep(): boolean {
	// 	const form = this.licenceApplicationService.residentialAddressFormGroup;
	// 	return !form.value.isMailingTheSameAsResidential;
	// }

	get showAdditionalGovermentIdStep(): boolean {
		const form = this.licenceApplicationService.citizenshipFormGroup;
		return (
			(form.value.isCanadianCitizen == BooleanTypeCode.Yes &&
				form.value.canadianCitizenProofTypeCode != LicenceDocumentTypeCode.CanadianPassport) ||
			(form.value.isCanadianCitizen == BooleanTypeCode.No &&
				form.value.notCanadianCitizenProofTypeCode != LicenceDocumentTypeCode.PermanentResidentCard)
		);
	}
}
