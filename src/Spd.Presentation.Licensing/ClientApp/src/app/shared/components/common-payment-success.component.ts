import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode, PaymentResponse } from '@app/api/models';
import { AppRoutes } from '@app/app-routing.module';
import { SPD_CONSTANTS } from '@app/core/constants/constants';

@Component({
	selector: 'app-common-payment-success',
	template: `
		<div class="row">
			<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
				<div class="row">
					<div class="col-6">
						<h2 class="fs-3 mt-0 mt-md-3">Payment Received</h2>
					</div>

					<div class="col-6">
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
								<mat-icon class="d-none d-md-block">file_download</mat-icon>Download Receipt
							</button>
						</div>
					</div>
				</div>
				<mat-divider class="mat-divider-main mb-3"></mat-divider>

				<div class="d-flex justify-content-center">
					<div class="payment__image text-center">
						<img class="payment__image__item" src="/assets/payment-success.png" alt="Payment success" />
					</div>
				</div>

				<div class="row mt-4">
					<div class="col-12">
						<div class="text-center">
							<ng-container *ngIf="payment?.applicationTypeCode === applicationTypeCodes.New">
								<div class="fs-5">Your application for a new Security Worker Licence has been received.</div>
							</ng-container>

							<ng-container *ngIf="payment?.applicationTypeCode === applicationTypeCodes.Renewal">
								<div class="fs-5">Your application for renewing your Security Worker Licence has been received.</div>
							</ng-container>

							<ng-container *ngIf="payment?.applicationTypeCode === applicationTypeCodes.Update">
								<div class="fs-5">Your update to your Security Worker Licence has been received.</div>
								<div class="my-4">
									We will contact you if we need more information, and we will send you a temporary copy of your updated
									licence as an email attachment, which you can start using right away.
								</div>
								<div class="my-4">The permanent licence card will be mailed to the address you provided.</div>
							</ng-container>

							<ng-container *ngIf="payment?.applicationTypeCode === applicationTypeCodes.Replacement">
								<div class="fs-5">Your application for a replacement Security Worker Licence has been received.</div>
								<div class="my-4">
									We will send you a temporary copy of your licence as an email attachment, which you can work with for
									90 days. The permanent licence card will be mailed to the address you provided.
								</div>
							</ng-container>

							<div class="my-4">You can print or save a copy of this payment confirmation for your records.</div>
						</div>
					</div>
				</div>

				<div class="row text-center">
					<div class="col-lg-4 col-md-12 mt-3">
						<div class="d-block text-label">Licence Term</div>
						<div class="payment__text">{{ payment?.licenceTermCode | options : 'LicenceTermTypes' }}</div>
					</div>
					<div class="col-lg-4 col-md-12 mt-3">
						<div class="d-block text-label">Amount Paid</div>
						<div class="payment__text">{{ payment?.transAmount | currency : 'CAD' : 'symbol-narrow' : '1.0' }}</div>
					</div>
					<div class="col-lg-4 col-md-12 mt-3">
						<div class="d-block text-label">Case ID</div>
						<div class="payment__text">{{ payment?.caseNumber }}</div>
					</div>
				</div>

				<div class="row mb-3 text-center">
					<div class="col-lg-4 col-md-12 mt-3">
						<div class="d-block text-label">Date and Time of Transaction</div>
						<div class="payment__text">
							{{ payment?.transDateTime | formatDate : appConstants.date.formalDateTimeFormat }}
						</div>
					</div>
					<div class="col-lg-4 col-md-12 mt-3">
						<div class="d-block text-label">Invoice/Order Number</div>
						<div class="payment__text">{{ payment?.transOrderId }}</div>
					</div>
				</div>
			</div>
		</div>
	`,
	styles: [],
})
export class CommonPaymentSuccessComponent implements OnInit {
	isBackRoute = false;
	appConstants = SPD_CONSTANTS;
	applicationTypeCodes = ApplicationTypeCode;

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
}
