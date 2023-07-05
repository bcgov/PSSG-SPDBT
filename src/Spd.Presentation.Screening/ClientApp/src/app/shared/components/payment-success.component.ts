import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-payment-success',
	template: `
		<div class="row">
			<div class="col-xl-6 col-lg-4 col-md-12">
				<h3 class="fw-normal">Payment Succeeded</h3>
			</div>
			<div class="col-xl-6 col-lg-8 col-md-12">
				<div class="d-flex justify-content-end">
					<button mat-stroked-button color="primary" class="large w-auto m-2" aria-label="Back" (click)="onBack()">
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
				<div class="fw-normal fs-3 text-center">Your payment transaction was successful</div>
			</div>
		</div>

		<div class="row text-center mb-4">
			<div class="offset-lg-2 col-lg-3 mt-4">
				<small class="d-block"> Case ID </small>
				<div class="text">APP-2023-H7V9J7965</div>
			</div>
			<div class="col-lg-3 mt-4">
				<small class="d-block"> Date & Time of Transaction </small>
				<div class="text">Aug 23, 2023 11:15 am</div>
				<!-- <div class="text">{{ transactionDate | date : appConstants.date.formalDateTimeFormat }} </div>-->
			</div>
			<div class="col-lg-3 mt-4">
				<small class="d-block">Invoice/Order Number</small>
				<div class="text">123345</div>
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
export class PaymentSuccessComponent {
	@Input() backRoute = '';

	constructor(private router: Router) {}

	onBack(): void {
		this.router.navigate([this.backRoute]);
	}
}
