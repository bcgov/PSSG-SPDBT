import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { RegistrationTypeCode } from 'src/app/api/models';
import { ContactInformationComponent } from '../step-components/contact-information.component';
import { MailingAddressComponent } from '../step-components/mailing-address.component';
import { OrganizationInformationComponent } from '../step-components/organization-information.component';
import { OrganizationNameComponent } from '../step-components/organization-name.component';
import { PaymentQuestionComponent } from '../step-components/payment-question.component';
import { ScreeningsQuestionComponent } from '../step-components/screenings-question.component';

@Component({
	selector: 'app-step-three',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-contact-information></app-contact-information>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_CONTACT_INFORMATION)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-organization-name></app-organization-name>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_ORGANIZATION_NAME)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-organization-information></app-organization-information>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button
							mat-flat-button
							color="primary"
							class="large mb-2"
							(click)="onFormValidNextStep(STEP_ORGANIZATION_INFORMATION)"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
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
				<app-screenings-question></app-screenings-question>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext(STEP_SCREENINGS_QUESTION)">
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showStepPaymentQuestion">
				<app-payment-question></app-payment-question>
				<!-- Note: This screen is only shows up when “employees" is selected -->

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="goToStepNext(STEP_PAYMENT_QUESTION)">
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
export class StepThreeComponent {
	readonly STEP_ORGANIZATION_NAME = 8;
	readonly STEP_ORGANIZATION_INFORMATION = 9;
	readonly STEP_CONTACT_INFORMATION = 10;
	readonly STEP_MAILING_ADDRESS = 11;
	readonly STEP_SCREENINGS_QUESTION = 12;
	readonly STEP_PAYMENT_QUESTION = 13;

	showStepPaymentQuestion = false;

	private _registrationTypeCode: RegistrationTypeCode | null = null;
	@Input() set registrationTypeCode(value: RegistrationTypeCode | null) {
		this._registrationTypeCode = value;
		this.showStepPaymentQuestion = value == RegistrationTypeCode.Employee;
	}
	get registrationTypeCode(): RegistrationTypeCode | null {
		return this._registrationTypeCode;
	}

	@Output() previousStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() scrollIntoView: EventEmitter<boolean> = new EventEmitter<boolean>();

	@ViewChild(ContactInformationComponent)
	contactInformationComponent!: ContactInformationComponent;

	@ViewChild(OrganizationNameComponent)
	organizationNameComponent!: OrganizationNameComponent;

	@ViewChild(OrganizationInformationComponent)
	organizationInformationComponent!: OrganizationInformationComponent;

	@ViewChild(MailingAddressComponent)
	mailingAddressComponent!: MailingAddressComponent;

	@ViewChild(ScreeningsQuestionComponent)
	screeningsQuestionComponent!: ScreeningsQuestionComponent;

	@ViewChild(PaymentQuestionComponent)
	paymentQuestionComponent!: PaymentQuestionComponent;

	@ViewChild('childstepper') private childstepper!: MatStepper;

	getStepData(): any {
		return {
			...this.contactInformationComponent.getDataToSave(),
			...this.organizationNameComponent.getDataToSave(),
			...this.organizationInformationComponent.getDataToSave(),
			...this.mailingAddressComponent.getDataToSave(),
			...this.screeningsQuestionComponent.getDataToSave(),
			...(this.paymentQuestionComponent ? this.paymentQuestionComponent.getDataToSave() : {}),
		};
	}

	onStepPrevious(): void {
		this.previousStepperStep.emit(true);
	}

	onStepNext(formNumber: number): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;

		if (!this.showStepPaymentQuestion) {
			this.nextStepperStep.emit(true);
		} else {
			this.childstepper.next();
		}
	}

	onFormValidNextStep(formNumber: number): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;
		this.childstepper.next();
	}

	onStepSelectionChange(_event: StepperSelectionEvent) {
		this.scrollIntoView.emit(true);
	}

	goToStepNext(formNumber: number): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;
		this.nextStepperStep.emit(true);
	}

	onGoToFirstStep() {
		this.childstepper.selectedIndex = 0;
	}

	onGoToLastStep() {
		this.childstepper.selectedIndex = this.childstepper.steps.length - 1;
	}

	private dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_PAYMENT_QUESTION:
				this.paymentQuestionComponent.form.markAllAsTouched();
				return this.paymentQuestionComponent.isFormValid();
			case this.STEP_SCREENINGS_QUESTION:
				this.screeningsQuestionComponent.form.markAllAsTouched();
				return this.screeningsQuestionComponent.isFormValid();
			case this.STEP_MAILING_ADDRESS:
				this.mailingAddressComponent.form.markAllAsTouched();
				return this.mailingAddressComponent.isFormValid();
			case this.STEP_CONTACT_INFORMATION:
				this.contactInformationComponent.form.markAllAsTouched();
				return this.contactInformationComponent.isFormValid();
			case this.STEP_ORGANIZATION_INFORMATION:
				this.organizationInformationComponent.form.markAllAsTouched();
				return this.organizationInformationComponent.isFormValid();
			case this.STEP_ORGANIZATION_NAME:
				this.organizationNameComponent.form.markAllAsTouched();
				return this.organizationNameComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	clearStepData(): void {
		this.contactInformationComponent?.clearCurrentData();
		this.organizationNameComponent?.clearCurrentData();
		this.organizationInformationComponent?.clearCurrentData();
		this.mailingAddressComponent?.clearCurrentData();
		this.screeningsQuestionComponent?.clearCurrentData();
		this.paymentQuestionComponent?.clearCurrentData();
	}
}
