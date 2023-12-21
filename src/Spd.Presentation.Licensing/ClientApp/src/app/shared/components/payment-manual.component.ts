import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-payment-manual',
	template: `
		<div class="row">
			<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
				<div class="row">
					<div class="col-xl-6 col-lg-8 col-md-8 col-sm-6">
						<h2 class="fs-3 mt-0 mt-md-3">Manual Payment</h2>
					</div>

					<div class="col-xl-6 col-lg-4 col-md-4 col-sm-6">
						<div class="d-flex justify-content-end">
							<button
								mat-stroked-button
								color="primary"
								class="large w-auto mb-3"
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
				<img class="payment__image__item" src="/assets/payment-fail.png" alt="Payment fail" />
			</div>
		</div>

		<div class="row mx-4">
			<div class="col-12 mt-4">
				<div class="fs-4 text-center">Your payment must be completed manually</div>
			</div>

			<div class="offset-lg-3 col-lg-6 offset-md-2 col-md-8 col-sm-12">
				<div class="my-4">
					Please download and complete the
					<a tabindex="0" (click)="onDownloadManualPaymentForm()" (keydown)="onKeydownDownloadManualPaymentForm($event)"
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

	onKeydownDownloadManualPaymentForm(event: KeyboardEvent) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onDownloadManualPaymentForm();
	}

	onBack(): void {
		this.backRoute.emit();
	}
}
