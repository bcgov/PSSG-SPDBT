import { Component } from '@angular/core';

@Component({
	selector: 'app-completed',
	template: `
		<section class="step-section pt-4 pb-5 px-3">
			<div class="step">
				<div class="title mb-5">Application Submitted</div>
				<div class="title mb-3 col-md-6 col-sm-12 mx-auto" style="font-size: 1.4em;">
					<div class="alert alert-success d-flex align-items-center" role="alert">
						<mat-icon>check_circle</mat-icon>
						<div style="margin-left: 20px">Application has been successfully submitted.</div>
					</div>
				</div>
				<div class="title mb-3 col-10 mx-auto" style="font-size: 1.2em;">
					Thank you for submitting your application to the Criminal Records Review Program.
				</div>
				<div class="title mb-5 col-10 mx-auto" style="font-size: 1.2em;">
					Your application will be reviewed shortly. We will contact you if further information is required.
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
		`,
	],
})
export class CompletedComponent {}
