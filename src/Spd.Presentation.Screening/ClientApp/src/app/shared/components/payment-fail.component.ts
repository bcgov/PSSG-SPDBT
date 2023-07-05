import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-payment-fail',
	template: `
		<div class="row">
			<div class="col-xl-6 col-lg-4 col-md-12">
				<h3 class="fw-normal">Payment Failed</h3>
			</div>
			<div class="col-xl-6 col-lg-8 col-md-12">
				<div class="d-flex justify-content-end">
					<button mat-stroked-button color="primary" class="large w-auto m-2" aria-label="Back" (click)="onBack()">
						<mat-icon>arrow_back</mat-icon>Back
					</button>
					<button mat-flat-button color="primary" class="large w-auto m-2" aria-label="Pay Now">
						<mat-icon>attach_money</mat-icon>Pay Now
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

			<div class="offset-lg-3 col-lg-6 offset-md-2 col-md-8 col-sm-12">
				<div class="lead fs-5 mt-4">
					Please ensure the information you entered is correct and try again, or use a different credit card.
				</div>
				<div class="lead fs-5 mt-4">You have x more attempts.</div>
				<div class="lead fs-5 my-4">
					Alternatively, you can download the Manual Payment Form. Fill it out, and follow the instructions to submit it
					to the Security Programs Division.
				</div>
			</div>
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
		`,
	],
})
export class PaymentFailComponent {
	@Input() backRoute = '';

	constructor(private router: Router) {}

	onBack(): void {
		this.router.navigate([this.backRoute]);
	}
}
