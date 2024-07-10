import { Component, EventEmitter, Output } from '@angular/core';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';

@Component({
	selector: 'app-common-payment-error',
	template: `
		<div class="row">
			<div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
				<h2 class="fs-3 mt-0 mt-md-3">Payment Error</h2>
				<mat-divider class="mat-divider-main mb-3"></mat-divider>

				<div class="d-flex justify-content-center">
					<div class="payment__image text-center">
						<img class="payment__image__item" src="./assets/payment-fail.png" alt="Payment error" />
					</div>
				</div>

				<div class="fs-4 text-center mt-4">Your payment attempt failed with an error</div>
				<div class="text-center my-4">An error occurred during the payment process</div>

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
	styles: [],
})
export class CommonPaymentErrorComponent {
	@Output() backRoute: EventEmitter<any> = new EventEmitter();

	constructor(private commonApplicationService: CommonApplicationService) {}

	onBackToHome(): void {
		this.commonApplicationService.onGoToHome();
	}
}
