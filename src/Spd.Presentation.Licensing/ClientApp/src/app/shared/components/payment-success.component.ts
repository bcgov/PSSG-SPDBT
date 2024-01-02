import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SPD_CONSTANTS } from '@app/core/constants/constants';

@Component({
	selector: 'app-payment-success',
	template: `
		<div class="row">
			<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
				<div class="row">
					<div class="col-xl-6 col-lg-8 col-md-8 col-sm-6">
						<h2 class="fs-3 mt-0 mt-md-3">Payment Succeeded</h2>
					</div>

					<div class="col-xl-6 col-lg-4 col-md-4 col-sm-6">
						<div class="d-flex justify-content-end">
							<button
								mat-stroked-button
								color="primary"
								class="large w-auto m-2"
								aria-label="Back"
								*ngIf="isBackRoute"
								(click)="onBack()"
							>
								<mat-icon>arrow_back</mat-icon>Back
							</button>
						</div>
					</div>
				</div>
				<mat-divider class="mat-divider-main mb-3"></mat-divider>
			</div>
		</div>

		<div class="d-flex justify-content-center">
			<div class="payment__image text-center">
				<img class="payment__image__item" src="/assets/payment-success.png" alt="Payment success" />
			</div>
		</div>

		<div class="row">
			<div class="col-12 my-4">
				<div class="fs-4 text-center">
					<ng-container *ngIf="isApplicationReceived; else notApplicationReceived">
						Your application has been received
					</ng-container>
					<ng-template #notApplicationReceived> Your payment transaction was successful </ng-template>
				</div>
			</div>
		</div>

		<!-- <div class="row text-center mb-4">
			<div class="offset-xl-3 col-xl-2 offset-lg-2 col-lg-3 mt-4">
				<small class="d-block"> Case ID </small>
				<div class="payment__text">{{ payment?.caseNumber }}</div>
			</div>
			<div class=" col-xl-2 col-lg-3 mt-4">
				<small class="d-block"> Date of Transaction </small>
				<div class="payment__text">
					{{ payment?.transDateTime | formatDate : appConstants.date.formalDateFormat }}
				</div>
			</div>
			<div class=" col-xl-2 col-lg-3 mt-4">
				<small class="d-block">Invoice/Order Number</small>
				<div class="payment__text">{{ payment?.transOrderId }}</div>
			</div>
		</div> -->

		<div
			class="offset-lg-3 col-lg-6 offset-md-2 col-md-8 col-sm-12"
			*ngIf="isApplicationReceived; else noApplicationReceivedMessage"
		>
			<div class="mt-4">Thank you for submitting your application to the Criminal Records Review Program.</div>
			<div class="my-4">
				Your application will be reviewed shortly. We will contact you if further information is required.
			</div>
		</div>

		<ng-template #noApplicationReceivedMessage>
			<div class="row" *ngIf="sendEmailTo; else successMessage">
				<div class="offset-lg-3 col-lg-6 offset-md-2 col-md-8 col-sm-12">
					<div class="mb-4">
						Your payment has been received and your application will be reviewed shortly. You will be contacted if it is
						found to be incomplete or inaccurate. An email with a receipt has been sent to:
						<strong>{{ sendEmailTo }}</strong
						>.
					</div>
				</div>
			</div>

			<ng-template #successMessage>
				<div class="row">
					<div class="offset-lg-3 col-lg-6 offset-md-2 col-md-8 col-sm-12">
						<div class="mb-4">
							Thank you for your payment. This application will be reviewed shortly. We will contact the applicant if
							further information is required.
						</div>
					</div>
				</div>
			</ng-template>
		</ng-template>
	`,
	styles: [],
})
export class PaymentSuccessComponent implements OnInit {
	isBackRoute = false;
	appConstants = SPD_CONSTANTS;

	@Input() sendEmailTo: string | null = null;
	@Input() isApplicationReceived = false;

	private _payment: PaymentResponse | null = null;
	@Input()
	set payment(data: PaymentResponse | null) {
		if (data == null) {
			this._payment = null;
			return;
		}

		this._payment = data;

		// if (data.paidSuccess != true) {
		// 	this.router.navigate([AppRoutes.ACCESS_DENIED]);
		// }
	}
	get payment(): PaymentResponse | null {
		return this._payment;
	}

	@Output() backRoute: EventEmitter<any> = new EventEmitter();

	constructor(private router: Router) {}

	ngOnInit(): void {
		this.isBackRoute = this.backRoute.observed;
	}

	onBack(): void {
		this.backRoute.emit();
	}
}
