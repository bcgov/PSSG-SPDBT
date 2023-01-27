import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { AuthorizedContactInformationComponent } from '../step-components/authorized-contact-information.component';
import { MailingAddressComponent } from '../step-components/mailing-address.component';
import { OrganizationInformationComponent } from '../step-components/organization-information.component';
import { OrganizationNameComponent } from '../step-components/organization-name.component';
import { PaymentQuestionComponent } from '../step-components/payment-question.component';
import { ScreeningsQuestionComponent } from '../step-components/screenings-question.component';

@Component({
	selector: 'app-step-three',
	template: `
		<mat-stepper class="child-stepper" #childstepper>
			<mat-step>
				<app-authorized-contact-information></app-authorized-contact-information>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-raised-button color="primary" class="large mb-2" (click)="onFormValidNextStep(10)">Next</button>
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
						<button mat-raised-button color="primary" class="large mb-2" (click)="onFormValidNextStep(8)">Next</button>
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
						<button mat-raised-button color="primary" class="large mb-2" (click)="onFormValidNextStep(9)">Next</button>
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
						<button mat-raised-button color="primary" class="large mb-2" (click)="onFormValidNextStep(11)">Next</button>
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
						<button mat-raised-button color="primary" class="large mb-2" (click)="onStepNext(12)">Next</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showStep13">
				<app-payment-question></app-payment-question>
				<!-- Note: This screen is only shows up when “employees" is selected -->

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-raised-button color="primary" class="large mb-2" (click)="goToStepNext(13)">Next</button>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepThreeComponent {
	showStep13: boolean = false;

	private _registrationTypeCode!: string;
	@Input() set registrationTypeCode(value: string) {
		this.showStep13 = value == 'EMP' ? true : false;
	}
	get registrationTypeCode(): string {
		return this._registrationTypeCode;
	}

	@Output() previousStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();

	@ViewChild(AuthorizedContactInformationComponent)
	authorizedContactInformationComponent!: AuthorizedContactInformationComponent;

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
			...this.authorizedContactInformationComponent.getDataToSave(),
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

		if (!this.showStep13) {
			this.nextStepperStep.emit(true);
		} else {
			this.childstepper.next();
		}
	}

	onFormValidNextStep(formNumber: number): void {
		console.log(this.getStepData());
		const isValid = this.dirtyForm(formNumber);
		console.log('isValid', isValid);
		if (!isValid) return;
		this.childstepper.next();
	}

	goToStepNext(formNumber: number): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;
		this.nextStepperStep.emit(true);
	}

	private dirtyForm(step: number): boolean {
		switch (step) {
			case 13:
				this.paymentQuestionComponent.form.markAllAsTouched();
				return this.paymentQuestionComponent.isFormValid();
			case 12:
				this.screeningsQuestionComponent.form.markAllAsTouched();
				return this.screeningsQuestionComponent.isFormValid();
			case 11:
				this.mailingAddressComponent.form.markAllAsTouched();
				return this.mailingAddressComponent.isFormValid();
			case 10:
				this.authorizedContactInformationComponent.form.markAllAsTouched();
				return this.authorizedContactInformationComponent.isFormValid();
			case 9:
				this.organizationInformationComponent.form.markAllAsTouched();
				return this.organizationInformationComponent.isFormValid();
			case 8:
				this.organizationNameComponent.form.markAllAsTouched();
				return this.organizationNameComponent.isFormValid();
			default:
				console.log('Unknown Form', step);
		}
		return false;
	}
}
