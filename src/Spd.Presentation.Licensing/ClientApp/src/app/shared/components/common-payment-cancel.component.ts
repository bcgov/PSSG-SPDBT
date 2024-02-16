import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';

@Component({
	selector: 'app-common-payment-cancel',
	template: `
		<div class="row">
			<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
				<div class="row">
					<div class="col-xl-6 col-lg-8 col-md-8 col-sm-6">
						<h2 class="fs-3 mt-0 mt-md-3">Payment Cancelled</h2>
					</div>

					<div class="col-xl-6 col-lg-4 col-md-12">
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
						<img class="payment__image__item" src="/assets/payment-fail.png" alt="Payment fail" />
					</div>
				</div>

				<div class="row mx-4">
					<div class="offset-lg-3 col-lg-6 offset-md-2 col-md-8 col-sm-12">
						<div class="mt-4 text-center">
							Your application is submitted, but it won't be processed until payment is received.
						</div>
					</div>
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
export class CommonPaymentCancelComponent {
	payBySecureLink = true;

	@Output() backRoute: EventEmitter<any> = new EventEmitter();
	@Output() payNow: EventEmitter<any> = new EventEmitter();
	@Output() downloadManualPaymentForm: EventEmitter<any> = new EventEmitter();

	constructor(private router: Router) {}

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
		this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.LOGIN_SELECTION));
	}
}
