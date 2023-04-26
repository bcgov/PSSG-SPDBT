import { Component } from '@angular/core';

@Component({
	selector: 'app-completed',
	template: `
		<section class="step-section pt-4 pb-4 px-3">
			<div class="step">
				<div class="row">
					<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12 mx-auto">
						<div class="alert alert-success align-items-center mb-0 alert-layout" role="alert">
							<mat-icon class="d-none d-md-block alert-icon">schedule</mat-icon>
							<div>
								<h4 class="alert-heading">Application Received</h4>
								<hr />
								<p class="margin-top: 1.5em;">Your application was successfully submitted.</p>
								<p>Thank you for submitting your application to the Criminal Records Review Program.</p>
								<p class="mb-0">
									Your application will be reviewed shortly. We will contact you if further information is required.
								</p>
							</div>
						</div>
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
		`,
	],
})
export class CompletedComponent {}
