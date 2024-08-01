import { Component, EventEmitter, Output } from '@angular/core';
import { ApplicationService } from '@app/core/services/application.service';

@Component({
	selector: 'app-payment-cancel',
	template: `
		<div class="row">
			<div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
				<div class="row">
					<div class="col-xl-6 col-lg-8 col-md-8 col-sm-6">
						<h2 class="fs-3 mt-0 mt-md-3">Payment Cancelled</h2>
					</div>
					<div class="col-xl-6 col-lg-4 col-md-12 col-sm-6">
						<div class="d-flex justify-content-end">
							<button
								mat-flat-button
								color="primary"
								class="large w-auto m-2"
								aria-label="Try again"
								(click)="onPayNow()"
							>
								<mat-icon>payment</mat-icon>Try Again
							</button>
						</div>
					</div>
				</div>
				<mat-divider class="mat-divider-main mb-3"></mat-divider>

				<div class="d-flex justify-content-center">
					<div class="payment__image text-center">
						<img class="payment__image__item" src="./assets/payment-fail.png" alt="Payment fail" />
					</div>
				</div>

				<div class="fs-4 text-center mt-4">Your payment attempt was cancelled</div>
				<div class="text-center my-4">
					Your application is submitted, but it won't be processed until payment is received.
				</div>

				<div class="d-flex justify-content-end">
					<button
						mat-stroked-button
						color="primary"
						class="large w-auto m-2"
						aria-label="Back"
						(click)="onBackToHome()"
					>
						<mat-icon>arrow_back</mat-icon>Back to Home
					</button>
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
export class PaymentCancelComponent {
	payBySecureLink = true;

	@Output() backRoute: EventEmitter<any> = new EventEmitter();
	@Output() payNow: EventEmitter<any> = new EventEmitter();
	@Output() downloadManualPaymentForm: EventEmitter<any> = new EventEmitter();

	constructor(private commonApplicationService: ApplicationService) {}

	onDownloadManualPaymentForm(): void {
		this.downloadManualPaymentForm.emit();
	}

	onKeydownDownloadManualPaymentForm(event: KeyboardEvent) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onDownloadManualPaymentForm();
	}

	onPayNow(): void {
		this.payNow.emit();
	}

	onBackToHome(): void {
		this.commonApplicationService.onGoToHome();
	}
}
