import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaymentResponse } from 'src/app/api/models';
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
					<button mat-flat-button color="primary" class="large w-auto m-2" aria-label="Download Receipt">
						<mat-icon>file_download</mat-icon>Download Receipt
					</button>
				</div>
			</div>
		</div>

		<mat-divider class="mb-2 mb-lg-4"></mat-divider>

		<div class="d-flex justify-content-center">
			<div class="success-image text-center">
				<img class="success-image__item" src="/assets/payment-success.png" />
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
			<div class="offset-xl-3 col-xl-2 offset-lg-2  col-lg-3 mt-4">
				<small class="d-block"> Case ID </small>
				<div class="text">{{ payment?.caseNumber }}</div>
			</div>
			<div class=" col-xl-2 col-lg-3 mt-4">
				<small class="d-block"> Date of Transaction </small>
				<div class="text">{{ payment?.transDateTime | date : appConstants.date.formalDateFormat : 'UTC' }}</div>
			</div>
			<div class=" col-xl-2 col-lg-3 mt-4">
				<small class="d-block">Invoice/Order Number</small>
				<div class="text">{{ payment?.transOrderId }}</div>
			</div>
		</div>

		<div class="offset-lg-3 col-lg-6 offset-md-2 col-md-8 col-sm-12" *ngIf="isApplicationReceived">
			<div class="lead fs-5 mt-4">
				Thank you for submitting your application to the Criminal Records Review Program.
			</div>
			<div class="lead fs-5 my-4">
				Your application will be reviewed shortly. We will contact you if further information is required.
			</div>
		</div>
	`,
	styles: [
		`
			.success-image {
				max-height: 8em;
				border-radius: 50%;
				width: 400px;
				background: var(--color-grey-lighter);
				font: 32px Arial, sans-serif;

				&__item {
					margin-top: 15px;
					height: 5em;
				}
			}

			.text {
				font-weight: 700;
				line-height: 1.5em;
			}
		`,
	],
})
export class PaymentSuccessComponent implements OnInit {
	isBackRoute: boolean = false;
	appConstants = SPD_CONSTANTS;

	@Input() payment: PaymentResponse | null = null;
	@Input() isApplicationReceived = false;

	@Output() backRoute: EventEmitter<any> = new EventEmitter();

	ngOnInit(): void {
		this.isBackRoute = this.backRoute.observed;
	}

	onBack(): void {
		this.backRoute.emit();
	}
}
