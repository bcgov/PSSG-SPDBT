import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-payment-manual',
	template: `
		<div class="row">
			<div class="col-xl-6 col-lg-4 col-md-12">
				<h3 class="fw-normal m-2">Manual Payment</h3>
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
				</div>
			</div>
		</div>

		<mat-divider class="mb-2 mb-lg-4"></mat-divider>

		<div class="d-flex justify-content-center">
			<div class="payment__image text-center">
				<img class="payment__image__item" src="./assets/payment-fail.png" alt="Payment fail" />
			</div>
		</div>

		<div class="row mx-4">
			<div class="col-12 mt-4">
				<div class="fw-normal fs-3 text-center">Your payment must be completed manually</div>
			</div>

			<div class="offset-lg-3 col-lg-6 offset-md-2 col-md-8 col-sm-12">
				<div class="lead fs-5 my-4">
					Please download and complete the
					<a tabindex="0" (click)="onDownloadManualPaymentForm()" (keydown)="onDownloadManualPaymentForm()"
						>Manual Payment Form</a
					>
					then follow the instructions on the form to submit payment to the Security Programs Division.
				</div>
			</div>
		</div>
	`,
	styles: [
		`
			a {
				color: var(--bs-link-color) !important;
			}
		`,
	],
})
export class PaymentManualComponent implements OnInit {
	isBackRoute = false;

	@Output() backRoute: EventEmitter<any> = new EventEmitter();
	@Output() downloadManualPaymentForm: EventEmitter<any> = new EventEmitter();

	ngOnInit(): void {
		this.isBackRoute = this.backRoute.observed;
	}

	onDownloadManualPaymentForm(): void {
		this.downloadManualPaymentForm.emit();
	}

	onBack(): void {
		this.backRoute.emit();
	}
}
