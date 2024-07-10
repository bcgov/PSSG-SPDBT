import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentResponse, ServiceTypeCode } from 'src/app/api/models';
import { AppRoutes } from 'src/app/app-routing.module';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';

@Component({
	selector: 'app-payment-success',
	template: `
		<div class="row">
			<div class="col-xl-6 col-lg-4 col-md-12">
				<h3 class="fw-normal m-2">Payment Succeeded</h3>
			</div>
			<div class="col-xl-6 col-lg-8 col-md-12">
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
					<button
						mat-flat-button
						color="primary"
						class="large w-auto m-2"
						aria-label="Download Receipt"
						(click)="onDownloadReceipt()"
					>
						<mat-icon>file_download</mat-icon>Download Receipt
					</button>
				</div>
			</div>
		</div>

		<mat-divider class="mb-2 mb-lg-4"></mat-divider>

		<div class="d-flex justify-content-center">
			<div class="payment__image text-center">
				<img class="payment__image__item" src="/assets/payment-success.png" alt="Payment success" />
			</div>
		</div>

		<div class="row">
			<div class="col-12 mt-4">
				<div class="fw-normal fs-3 text-center">
					<ng-container *ngIf="isApplicationReceived; else notApplicationReceived">
						Your application has been received
					</ng-container>
					<ng-template #notApplicationReceived> Your payment transaction was successful </ng-template>
				</div>
			</div>
		</div>

		<div class="row text-center mb-4">
			<div class="offset-xl-3 col-xl-2 offset-lg-2 col-lg-3 mt-4">
				<div class="d-block text-label">Case ID</div>
				<div class="payment__text">{{ payment?.caseNumber }}</div>
			</div>
			<div class=" col-xl-2 col-lg-3 mt-4">
				<div class="d-block text-label">Date of Transaction</div>
				<div class="payment__text">
					{{ payment?.transDateTime | formatDate : appConstants.date.formalDateFormat }}
				</div>
			</div>
			<div class=" col-xl-2 col-lg-3 mt-4">
				<div class="d-block text-label">Invoice/Order Number</div>
				<div class="payment__text">{{ payment?.transOrderId }}</div>
			</div>
		</div>

		<div class="row">
			<div
				class="offset-lg-3 col-lg-6 offset-md-2 col-md-8 col-sm-12"
				*ngIf="isApplicationReceived; else noApplicationReceivedMessage"
			>
				<div class="lead fs-5 mt-4">
					Thank you for submitting your application to the Criminal Records Review Program. A confirmation email has
					been sent to <strong>{{ sendEmailTo }}</strong
					>.
				</div>
				<div class="lead fs-5 my-4">
					Your application will be reviewed shortly, and we will contact you if further information is required.
				</div>
			</div>
		</div>

		<ng-template #noApplicationReceivedMessage>
			<div class="row" *ngIf="sendEmailTo; else successMessage">
				<div class="col-lg-6 col-md-8 col-sm-12 mx-auto">
					<div class="lead fs-5 mb-4">
						Your payment has been received and your application will be reviewed shortly. You will be contacted if it is
						found to be incomplete or inaccurate.
					</div>
					<div class="lead fs-5 my-4">
						An email with a receipt has been sent to:
						<strong>{{ sendEmailTo }}</strong
						>.
					</div>
				</div>
			</div>

			<ng-template #successMessage>
				<div class="row">
					<div class="col-lg-6 col-md-8 col-sm-12 mx-auto">
						<div class="lead fs-5 mb-4">
							Thank you for your payment. This application will be reviewed shortly, and we will contact you if further
							information is required.
						</div>
					</div>
				</div>
			</ng-template>
		</ng-template>

		<div class="row mt-4" *ngIf="showCloseButton">
			<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
				<button mat-flat-button color="primary" class="large mb-2" (click)="onClose()">Close</button>
			</div>
		</div>
	`,
	styles: [],
})
export class PaymentSuccessComponent implements OnInit {
	isBackRoute = false;
	appConstants = SPD_CONSTANTS;

	@Input() isApplicationReceived = false;
	@Input() showCloseButton = true;

	private _payment: PaymentResponse | null = null;
	@Input()
	set payment(data: PaymentResponse | null) {
		if (data == null) {
			this._payment = null;
			return;
		}

		this._payment = data;

		if (data.paidSuccess != true) {
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
		}
	}
	get payment(): PaymentResponse | null {
		return this._payment;
	}

	@Output() backRoute: EventEmitter<any> = new EventEmitter();
	@Output() downloadReceipt: EventEmitter<any> = new EventEmitter();

	constructor(private router: Router) {}

	ngOnInit(): void {
		this.isBackRoute = this.backRoute.observed;
	}

	onBack(): void {
		this.backRoute.emit();
	}

	onDownloadReceipt(): void {
		this.downloadReceipt.emit();
	}

	onClose(): void {
		switch (this.payment?.serviceTypeCode) {
			case ServiceTypeCode.Mcfd:
				window.location.assign(SPD_CONSTANTS.closeRedirects.mcfdApplication);
				break;
			case ServiceTypeCode.PeCrc:
			case ServiceTypeCode.PeCrcVs:
				window.location.assign(SPD_CONSTANTS.closeRedirects.peCrcApplication);
				break;
			case ServiceTypeCode.Psso:
			case ServiceTypeCode.PssoVs:
				window.location.assign(SPD_CONSTANTS.closeRedirects.pssoCheck);
				break;
			default:
				window.location.assign(SPD_CONSTANTS.closeRedirects.crrpApplication);
				break;
		}
	}

	get sendEmailTo(): string | null {
		return this.payment?.email ?? null;
	}
}
