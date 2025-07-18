import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApplicationTypeCode, PaymentResponse } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { CommonApplicationService } from '@app/core/services/common-application.service';

@Component({
	selector: 'app-payment-success',
	template: `
		<div class="row">
		  <div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
		    <div class="row">
		      <div class="col-xl-6 col-lg-8 col-md-8 col-sm-6">
		        <h2 class="fs-3 mt-0 mt-md-3">Payment Received</h2>
		      </div>
		    </div>
		    <mat-divider class="mat-divider-main mb-3"></mat-divider>
		
		    <div class="d-flex justify-content-center">
		      <div class="payment__image text-center">
		        <img class="payment__image__item" src="./assets/payment-success.png" alt="Payment success" />
		      </div>
		    </div>
		
		    <div class="row mt-4">
		      @if (payment?.applicationTypeCode === applicationTypeCodes.New) {
		        <div class="text-center fs-5">
		          Your application for a new {{ payment?.serviceTypeCode | options: 'ServiceTypes' }} has been received.
		        </div>
		      }
		
		      @if (payment?.applicationTypeCode === applicationTypeCodes.Renewal) {
		        <div class="text-center fs-5">
		          Your application for renewing your {{ payment?.serviceTypeCode | options: 'ServiceTypes' }} has been
		          received.
		        </div>
		      }
		
		      @if (payment?.applicationTypeCode === applicationTypeCodes.Update) {
		        <div class="text-center fs-5">
		          Your update to your {{ payment?.serviceTypeCode | options: 'ServiceTypes' }} has been received.
		        </div>
		      }
		
		      @if (payment?.applicationTypeCode === applicationTypeCodes.Replacement) {
		        <div class="text-center fs-5">
		          Your application for a replacement {{ payment?.serviceTypeCode | options: 'ServiceTypes' }} has been
		          received.
		        </div>
		      }
		
		      <div class="mt-3">
		        <app-alert type="info" icon="info">
		          @if (payment?.applicationTypeCode === applicationTypeCodes.Update) {
		            <div class="mb-3">
		              We will contact you if we need more information, and we will send you a temporary copy of your updated
		              licence as an email attachment, which you can start using right away.
		            </div>
		            <div class="mb-3">The permanent licence card will be mailed to the address you provided.</div>
		          }
		
		          @if (payment?.applicationTypeCode === applicationTypeCodes.Replacement) {
		            <div class="mb-3">
		              We will send you a temporary copy of your licence as an email attachment, which you can work with for
		              90 days.
		            </div>
		            <div class="mb-3">The permanent licence card will be mailed to the address you provided.</div>
		          }
		
		          <div>You can save a copy of this payment confirmation for your records.</div>
		        </app-alert>
		      </div>
		    </div>
		
		    <div class="row mb-3">
		      <div class="col-md-6 col-sm-12 mt-2">
		        <div class="d-block payment__text-label text-md-end">Licence Term</div>
		      </div>
		      <div class="col-md-6 col-sm-12 mt-md-2">
		        <div class="payment__text">{{ payment?.licenceTermCode | options: 'LicenceTermTypes' }}</div>
		      </div>
		      <div class="col-md-6 col-sm-12 mt-2">
		        <div class="d-block payment__text-label text-md-end">Amount Paid</div>
		      </div>
		      <div class="col-md-6 col-sm-12 mt-md-2">
		        <div class="payment__text">{{ payment?.transAmount | currency: 'CAD' : 'symbol-narrow' : '1.0' }}</div>
		      </div>
		      <div class="col-md-6 col-sm-12 mt-2">
		        <div class="d-block payment__text-label text-md-end">Case Number</div>
		      </div>
		      <div class="col-md-6 col-sm-12 mt-md-2">
		        <div class="payment__text">{{ payment?.caseNumber }}</div>
		      </div>
		      <div class="col-md-6 col-sm-12 mt-2">
		        <div class="d-block payment__text-label text-md-end">Date and Time of Transaction</div>
		      </div>
		      <div class="col-md-6 col-sm-12 mt-md-2">
		        <div class="payment__text">
		          {{ payment?.transDateTime | formatDate: appConstants.date.formalDateTimeFormat }}
		        </div>
		      </div>
		      <div class="col-md-6 col-sm-12 mt-2">
		        <div class="d-block payment__text-label text-md-end">Invoice/Order Number</div>
		      </div>
		      <div class="col-md-6 col-sm-12 mt-md-2">
		        <div class="payment__text">{{ payment?.transOrderId }}</div>
		      </div>
		    </div>
		
		    <div class="row mt-4">
		      <div class="col-md-4 col-sm-12">
		        <button
		          mat-flat-button
		          color="primary"
		          class="large m-2"
		          aria-label="Download payment receipt"
		          (click)="onDownloadReceipt()"
		          >
		          <mat-icon class="d-none d-md-block">file_download</mat-icon>Download Receipt
		        </button>
		      </div>
		      <div class="offset-md-4 col-md-4 col-sm-12">
		        <button
		          mat-stroked-button
		          color="primary"
		          class="large m-2"
		          aria-label="Back to main page"
		          (click)="onBackToHome()"
		          >
		          <mat-icon>arrow_back</mat-icon>Back to Home
		        </button>
		      </div>
		    </div>
		  </div>
		</div>
		`,
	styles: [],
	standalone: false,
})
export class PaymentSuccessComponent {
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
			this.commonApplicationService.onGoToHome();
		}
	}
	get payment(): PaymentResponse | null {
		return this._payment;
	}

	@Output() downloadReceipt: EventEmitter<any> = new EventEmitter();

	constructor(private commonApplicationService: CommonApplicationService) {}

	onDownloadReceipt(): void {
		this.downloadReceipt.emit();
	}

	onBackToHome(): void {
		this.commonApplicationService.onGoToHome();
	}
}
