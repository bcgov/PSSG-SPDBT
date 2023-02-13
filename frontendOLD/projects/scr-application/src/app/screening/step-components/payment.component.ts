import { Component } from '@angular/core';

@Component({
	selector: 'app-payment',
	template: `
		<section class="step-section pt-4 pb-5 px-3">
			<div class="step">
				<div class="row">
					<div class="col-md-8 col-sm-12 mx-auto">
						<div class="alert alert-success align-items-center mb-0 alert-layout" role="alert">
							<mat-icon class="d-none d-md-block alert-icon">paid</mat-icon>
							<div>
								<h4 class="alert-heading">Payment Received</h4>
								<hr />
								<p class="margin-top: 1.5em;">Payment has been successfully received.</p>
								<p>
									Your application will be reviewed shortly and you will be contacted if it is found to be incomplete or
									inaccurate.
								</p>
								<p class="mb-0">An email with a receipt has been sent to: [EMAIL].</p>
							</div>
						</div>
					</div>
				</div>

				<div class="row mt-4">
					<div class="col-md-8 col-sm-12 mx-auto">
						<section class="px-4 py-2 mb-3">
							<div class="row mt-2">
								<div class="offset-lg-1 col-lg-3">
									<small class="d-block text-muted">Contact Email</small>
									<strong>test@test.com </strong>
								</div>
								<div class="col-lg-3">
									<small class="d-block text-muted mt-2 mt-lg-0">Applicant Paid</small>
									<strong>Yes </strong>
								</div>
								<div class="col-lg-3">
									<small class="d-block text-muted mt-2 mt-lg-0">Paid For By</small>
									<strong> Applicant </strong>
								</div>
							</div>

							<mat-divider class="my-3"></mat-divider>

							<div class="row mb-2">
								<div class="offset-lg-1 col-lg-3">
									<small class="d-block text-muted">Payment Type</small>
									<div class="text-data">BC Pay</div>
								</div>
								<div class="col-lg-3">
									<small class="d-block text-muted mt-2 mt-lg-0">Amount Paid</small>
									<div class="text-data">$28.00</div>
								</div>
								<div class="col-lg-3">
									<small class="d-block text-muted mt-2 mt-lg-0">Transaction Number</small>
									<div class="text-data">12345678</div>
								</div>
							</div>

							<mat-divider class="my-3"></mat-divider>
						</section>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.alert-layout {
				display: inline-flex;
				gap: 1em;
			}

			.alert-icon {
				min-width: 1em;
				width: 40px;
				height: 40px;
				font-size: 40px;
			}

			.text-data {
				font-weight: 500;
			}
		`,
	],
})
export class PaymentComponent {}
