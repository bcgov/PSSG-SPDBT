import { Component } from '@angular/core';

@Component({
	selector: 'app-payment-success',
	template: `
		<section class="step-section pt-4 pb-4 px-3">
			<app-step-title title="Payment Received"></app-step-title>

			<div class="row">
				<div class="offset-lg-3 col-lg-6 col-md-12 col-sm-12">
					<app-alert type="success" icon="done">
						<div>Payment has been successfully received</div>
					</app-alert>
				</div>
			</div>

			<div class="row my-4">
				<div class="offset-lg-3 col-lg-6 col-md-12 col-sm-12">
					<p>
						Your application will be reviewed shortly and you will be contacted if it is found to be incomplete or
						inaccurate.
					</p>
					<p class="mb-0">An email with a receipt has been sent to: [EMAIL].</p>
				</div>
			</div>

			<div class="row mt-4">
				<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12 mx-auto">
					<mat-divider class="my-3"></mat-divider>
					<section class="px-4 py-2 mb-3">
						<div class="row mt-2">
							<div class="offset-lg-1 col-lg-3">
								<div class="text-label d-block text-muted">Case ID</div>
								<div class="text-data">#######</div>
							</div>
							<div class="col-lg-3">
								<div class="text-label d-block text-muted mt-2 mt-lg-0">Date</div>
								<div class="text-data">2023-12-12</div>
							</div>
							<div class="col-lg-4">
								<div class="text-label d-block text-muted mt-2 mt-lg-0">Invoice / Order Number</div>
								<div class="text-data">BC Pay</div>
							</div>
						</div>
					</section>
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
export class PaymentSuccessComponent {}
