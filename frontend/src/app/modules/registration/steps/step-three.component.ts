import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import {
	AuthorizedContactInformationComponent,
	AuthorizedContactModel,
} from '../step-components/authorized-contact-information.component';
import { MailingAddressComponent, MailingAddressModel } from '../step-components/mailing-address.component';
import {
	OrganizationInformationComponent,
	OrganizationInformationModel,
} from '../step-components/organization-information.component';
import { OrganizationNameComponent, OrganizationNameModel } from '../step-components/organization-name.component';
import { PaymentQuestionComponent, PaymentQuestionModel } from '../step-components/payment-question.component';
import { ScreeningsQuestionComponent, ScreeningsQuestionModel } from '../step-components/screenings-question.component';

@Component({
	selector: 'app-step-three',
	template: `
		<mat-stepper class="child-stepper" #childstepper>
			<mat-step>
				<app-authorized-contact-information
					[stepData]="authorizedContactData"
					(formValidity)="onAuthorizedContactValidity($event)"
				></app-authorized-contact-information>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-raised-button color="primary" class="large mb-2" [disabled]="!isFormValid10" matStepperNext>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-organization-name
					[stepData]="organizationNameData"
					(formValidity)="onOrganizationNameValidity($event)"
				></app-organization-name>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-raised-button color="primary" [disabled]="!isFormValid8" class="large mb-2" matStepperNext>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-organization-information
					[stepData]="organizationInformationData"
					(formValidity)="onOrganizationInformationValidity($event)"
				></app-organization-information>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-raised-button color="primary" [disabled]="!isFormValid9" class="large mb-2" matStepperNext>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-mailing-address
					[stepData]="mailingAddressData"
					(formValidity)="onMailingAddressValidity($event)"
				></app-mailing-address>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-raised-button color="primary" class="large mb-2" [disabled]="!isFormValid11" matStepperNext>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-screenings-question
					[stepData]="screeningsQuestionData"
					(formValidity)="onScreeningsQuestionValidity($event)"
				></app-screenings-question>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button
							mat-raised-button
							color="primary"
							class="large mb-2"
							[disabled]="!isFormValid12"
							(click)="onStepNext()"
						>
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="showStep13">
				<app-payment-question
					[stepData]="paymentQuestionData"
					(formValidity)="onPaymentQuestionValidity($event)"
				></app-payment-question>
				<!-- Note: This screen is only shows up when “employees" is selected -->

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button
							mat-raised-button
							color="primary"
							class="large mb-2"
							[disabled]="!isFormValid13"
							(click)="goToStepNext()"
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
export class StepThreeComponent {
	showStep13: boolean = false;

	isFormValid8: boolean = false;
	isFormValid9: boolean = false;
	isFormValid10: boolean = false;
	isFormValid11: boolean = false;
	isFormValid12: boolean = false;
	isFormValid13: boolean = false;

	authorizedContactData: AuthorizedContactModel = {
		givenName: '',
		surname: '',
		jobTitle: '',
		email: '',
		day: '',
		month: '',
		year: '',
		areaCode: '',
		phoneNumber: '',
		ext: '',
	};
	organizationNameData: OrganizationNameModel = { organizationName: '' };
	organizationInformationData: OrganizationInformationModel = {
		phoneOrEmailFlag: '',
		email: '',
		emailConfirmation: '',
		areaCode: '',
		phoneNumber: '',
		ext: '',
	};
	mailingAddressData: MailingAddressModel = {
		mailingAddress: '',
		addressLine1: '',
		addressLine2: '',
		city: '',
		postalCode: '',
		province: '',
		country: '',
	};
	screeningsQuestionData: ScreeningsQuestionModel = { screeningsCount: '' };
	paymentQuestionData: PaymentQuestionModel = { checkFeePayer: '' };

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

	onAuthorizedContactValidity(isValid: boolean): void {
		this.isFormValid10 = isValid;
		if (isValid) {
			this.authorizedContactData = this.authorizedContactInformationComponent.getDataToSave();
		}
	}

	onOrganizationNameValidity(isValid: boolean): void {
		this.isFormValid8 = isValid;
		if (isValid) {
			this.organizationNameData = this.organizationNameComponent.getDataToSave();
		}
	}

	onOrganizationInformationValidity(isValid: boolean): void {
		this.isFormValid9 = isValid;
		if (isValid) {
			this.organizationInformationData = this.organizationInformationComponent.getDataToSave();
		}
	}

	onMailingAddressValidity(isValid: boolean): void {
		this.isFormValid11 = isValid;
		if (isValid) {
			this.mailingAddressData = this.mailingAddressComponent.getDataToSave();
		}
	}

	onScreeningsQuestionValidity(isValid: boolean): void {
		this.isFormValid12 = isValid;
		if (isValid) {
			this.screeningsQuestionData = this.screeningsQuestionComponent.getDataToSave();
		}
	}

	onPaymentQuestionValidity(isValid: boolean): void {
		this.isFormValid13 = isValid;
		if (isValid) {
			this.paymentQuestionData = this.paymentQuestionComponent.getDataToSave();
		}
	}

	onStepPrevious(): void {
		this.previousStepperStep.emit(true);
	}

	onStepNext(): void {
		if (!this.showStep13) {
			this.nextStepperStep.emit(true);
		} else {
			this.childstepper.next();
		}
	}

	goToStepNext(): void {
		this.nextStepperStep.emit(true);
	}
}
