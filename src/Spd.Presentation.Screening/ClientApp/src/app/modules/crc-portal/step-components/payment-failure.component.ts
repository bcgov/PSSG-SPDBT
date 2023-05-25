import { Component } from '@angular/core';

@Component({
	selector: 'app-payment-failure',
	template: `
		<section class="step-section pt-4 pb-4 px-3">
			<app-step-title title="Payment Failed"></app-step-title>

			<div class="row">
				<div class="offset-lg-3 col-lg-6 col-md-12 col-sm-12">
					<app-alert type="danger">
						<div>Payment transaction has failed</div>
					</app-alert>
				</div>
			</div>

			<div class="row my-4">
				<div class="offset-lg-3 col-lg-6 col-md-12 col-sm-12">
					<p>
						Please ensure the information you entered is correct and try again, or use a different credit card. You have
						2 more attempts.
					</p>
					<button mat-flat-button color="primary" class="large mb-2 w-auto">Try Again</button>
				</div>
			</div>

			<mat-divider class="my-3"></mat-divider>
			<div class="row my-4">
				<div class="offset-lg-3 col-lg-6 col-md-12 col-sm-12">
					<p>Your application has been submitted, but it won't be processed until payment is received.</p>

					<p>
						Please download and fill out the Credit Card Payment Form, and return it to the email address or fax number
						on the form.
					</p>

					<p>If you prefer to pay by cheque or money order, please contact us at [email] or [phone].</p>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.alert {
				padding: 1rem 1rem;
			}
		`,
	],
})
export class PaymentFailureComponent {}
