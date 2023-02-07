import { Component } from '@angular/core';

@Component({
	selector: 'app-payment',
	template: `
		<section class="step-section pt-4 pb-5">
			<div class="step">
				<div class="title mb-5">Payment Approved</div>

				<div class="title mb-3 col-md-8 col-sm-12 mx-auto" style="font-size: 1.4em;">
					<div class="alert alert-success d-flex align-items-center" role="alert">
						<mat-icon>check_circle</mat-icon>
						<div style="margin-left: 20px">Payment has been successfully received.</div>
					</div>
				</div>
				<div class="title col-8 mx-auto mb-5" style="font-size: 1.5em;">
					Your application will be reviewed shortly and you will be contacted if it is found to be incomplete or
					inaccurate. An email with a receipt has been sent to: [EMAIL].
					<!-- Your payment has been received and your application will be reviewed shortly. You will be contacted if it is
				found to be incomplete or inaccurate. An email with a receipt has been sent to: [EMAIL]. -->
				</div>

				<div class="row">
					<div class="offset-md-2 col-md-8 col-sm-12">
						<section class="px-4 py-2 mb-3 card-section">
							<div class="row mt-2">
								<div class="offset-lg-1 col-lg-3">
									<small class="d-block text-muted">Contact Email</small>
									<strong>test@test.com </strong>
								</div>
								<div class="col-lg-3">
									<small class="d-block text-muted">Applicant Paid</small>
									<strong>Yes </strong>
								</div>
								<div class="col-lg-3">
									<small class="d-block text-muted">Paid For By</small>
									<strong> Applicant </strong>
								</div>
							</div>

							<hr />

							<div class="row mb-2">
								<div class="offset-lg-1 col-lg-3">
									<small class="d-block text-muted">Payment Type</small>
									<div class="text-data">BC Pay</div>
								</div>
								<div class="col-lg-3">
									<small class="d-block text-muted">Amount Paid</small>
									<div class="text-data">$28.00</div>
								</div>
								<div class="col-lg-3">
									<small class="d-block text-muted">Transaction Number</small>
									<div class="text-data">12345678</div>
								</div>
							</div>
						</section>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.card-section {
				background-color: #ededed !important;
				border-left: 3px solid var(--color-primary);
				border-bottom-width: 1px;
				border-bottom-style: solid;
				border-bottom-color: rgba(0, 0, 0, 0.12);
			}

			.text-data {
				font-weight: 500;
			}
		`,
	],
})
export class PaymentComponent {}
