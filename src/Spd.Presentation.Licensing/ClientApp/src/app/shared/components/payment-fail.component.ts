import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-payment-fail',
	template: `
		<div class="row">
			<div class="col-xl-6 col-lg-4 col-md-12">
				<h3 class="fw-normal m-2">Payment Failed</h3>
			</div>
			<div class="col-xl-6 col-lg-8 col-md-12">
				<div class="d-flex justify-content-end">
					<button
						mat-stroked-button
						color="primary"
						class="large w-auto m-2"
						aria-label="Back"
						*ngIf="backRoute"
						(click)="onBack()"
					>
						<mat-icon>arrow_back</mat-icon>Back
					</button>
					<button mat-flat-button color="primary" class="large w-auto m-2" aria-label="Try again">
						<mat-icon>payment</mat-icon>Try Again
					</button>
				</div>
			</div>
		</div>

		<mat-divider class="mb-2 mb-lg-4"></mat-divider>

		<div class="d-flex justify-content-center">
			<div class="fail-image text-center">
				<img class="fail-image__item" src="/assets/payment-fail.png" />
			</div>
		</div>

		<div class="row mx-4">
			<div class="col-12 mt-4">
				<div class="fw-normal fs-3 text-center">Your payment transaction has failed</div>
			</div>

			<ng-container *ngIf="numberOfAttemptsRemaining == 0; else remaining">
				<div class="offset-lg-3 col-lg-6 offset-md-2 col-md-8 col-sm-12">
					<div class="lead fs-5 mt-4">
						Your application has been submitted, but it won't be processed until payment is received.
					</div>
					<div class="lead fs-5 my-4">
						Please download and complete the
						<a (click)="onDownloadManualPaymentForm()">Manual Payment Form</a> then follow the instructions on the form
						to submit payment to the Security Programs Division.
					</div>
				</div>
			</ng-container>

			<ng-template #remaining>
				<div class="offset-lg-3 col-lg-6 offset-md-2 col-md-8 col-sm-12">
					<div class="lead fs-5 mt-4">
						Please ensure the information you entered is correct and try again, or use a different credit card. You have
						{{ numberOfAttemptsRemaining }} more attempt{{ numberOfAttemptsRemaining == 1 ? '' : 's' }}.
					</div>
					<div class="lead fs-5 my-4">
						Alternatively, you can download the
						<a (click)="onDownloadManualPaymentForm()">Manual Payment Form</a>. Fill it out, and follow the instructions
						to submit it to the Security Programs Division.
					</div>
				</div>
			</ng-template>
		</div>
	`,
	styles: [
		`
			.fail-image {
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

			a {
				color: var(--bs-link-color) !important;
			}
		`,
	],
})
export class PaymentFailComponent {
	@Input() backRoute = '';
	@Input() numberOfAttemptsRemaining = 0;

	constructor(private router: Router) {}

	onDownloadManualPaymentForm(): void {}

	onBack(): void {
		this.router.navigate([this.backRoute]);
	}
}
