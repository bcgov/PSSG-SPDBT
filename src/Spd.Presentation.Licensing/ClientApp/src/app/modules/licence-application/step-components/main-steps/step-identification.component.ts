import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { HeightAndWeightComponent } from '../height-and-weight.component';

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
						<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
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
						<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-address></app-address>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext()">Next</button>
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

	showAdditionalGovermentIdStep = true;

	@Output() previousStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();

	@ViewChild(AliasesComponent) aliasesComponent!: AliasesComponent;
	@ViewChild(CitizenshipComponent) citizenshipComponent!: CitizenshipComponent;
	@ViewChild(AdditionalGovIdComponent) additionalGovIdComponent!: AdditionalGovIdComponent;
	@ViewChild(BcDriverLicenceComponent) bcDriverLicenceComponent!: BcDriverLicenceComponent;
	@ViewChild(HeightAndWeightComponent) heightAndWeightComponent!: HeightAndWeightComponent;

	@ViewChild('childstepper') private childstepper!: MatStepper;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	onStepSelectionChange(event: StepperSelectionEvent) {}

	onStepPrevious(): void {
		this.previousStepperStep.emit(true);
	}

	onStepNext(): void {
		this.nextStepperStep.emit(true);
	}

	onFormValidNextStep(formNumber: string): void {
		this.setStepData();

		const isValid = this.dirtyForm(formNumber);
		// console.log('onFormValidNextStep formNumber:', formNumber, isValid);

		if (!isValid) return;

		if (formNumber == this.STEP_CITIZENSHIP) {
			this.showAdditionalGovermentIdStep = !(
				this.licenceApplicationService.licenceModel.proofOfCitizenship ==
					ProofOfCanadianCitizenshipCode.ValidCanadianPassport ||
				this.licenceApplicationService.licenceModel.proofOfAbility ==
					ProofOfAbilityToWorkInCanadaCode.ValidPermanentResidentCard
			);
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
		};

		const licenceModel = this.licenceApplicationService.licenceModel;
		this.licenceApplicationService.licenceModel = { ...licenceModel, ...stepData };

		this.licenceApplicationService.updateFlags();

		console.log('stepData', stepData);
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
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
