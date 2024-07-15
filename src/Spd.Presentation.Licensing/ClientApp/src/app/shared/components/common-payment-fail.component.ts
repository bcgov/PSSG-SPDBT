import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';

@Component({
	selector: 'app-common-payment-fail',
	template: `
		<div class="row">
			<div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
				<div class="row">
					<div class="col-xl-6 col-lg-8 col-md-8 col-sm-6">
						<h2 class="fs-3 mt-0 mt-md-3">Payment Failed</h2>
					</div>

					<div class="col-xl-6 col-lg-4 col-md-12 col-sm-6">
						<div class="d-flex justify-content-end">
							<button
								mat-flat-button
								color="primary"
								class="large w-auto m-2"
								*ngIf="numberOfAttemptsRemaining > 0"
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

				<ng-container *ngIf="numberOfAttemptsRemaining === 0; else remainingAttempts">
					<div class="mt-4">
						Your application has been submitted, but it won't be processed until payment is received.
					</div>
					<div class="my-4">
						Please download and complete the
						<a
							tabindex="0"
							(click)="onDownloadManualPaymentForm()"
							(keydown)="onKeydownDownloadManualPaymentForm($event)"
							>Manual Payment Form</a
						>
						then follow the instructions on the form to submit payment to the Security Programs Division.
					</div>
				</ng-container>

				<ng-template #remainingAttempts>
					<div class="mt-4">
						Please ensure the information you entered is correct and try again, or use a different credit card. You have
						{{ numberOfAttemptsRemaining }} more attempt{{ numberOfAttemptsRemaining === 1 ? '' : 's' }}.
					</div>
					<div class="my-4">
						Alternatively, you can download the
						<a
							tabindex="0"
							(click)="onDownloadManualPaymentForm()"
							(keydown)="onKeydownDownloadManualPaymentForm($event)"
							>Manual Payment Form</a
						>. Fill it out, and follow the instructions to submit it to the Security Programs Division.
					</div>
				</ng-template>

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
export class CommonPaymentFailComponent {
	payBySecureLink = true;

	private _payment: PaymentResponse | null = null;
	@Input()
	set payment(data: PaymentResponse | null) {
		if (data == null) {
			this._payment = null;
			return;
		}

		this._payment = data;

		// if (data.paidSuccess) {
		// 	this.router.navigate([AppRoutes.ACCESS_DENIED]);
		// }
	}
	get payment(): PaymentResponse | null {
		return this._payment;
	}

	private _numberOfAttemptsRemaining!: number;
	@Input()
	set numberOfAttemptsRemaining(data: number | null) {
		if (data == null) {
			this._numberOfAttemptsRemaining = 0;
			return;
		}

		this._numberOfAttemptsRemaining = data;
	}
	get numberOfAttemptsRemaining(): number {
		return this._numberOfAttemptsRemaining;
	}

	@Output() payNow: EventEmitter<any> = new EventEmitter();
	@Output() downloadManualPaymentForm: EventEmitter<any> = new EventEmitter();

	constructor(private commonApplicationService: CommonApplicationService) {}

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
