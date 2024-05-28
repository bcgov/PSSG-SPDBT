import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-sa-application-submitted',
	template: `
		<section class="step-section pt-4 pb-4 px-3">
			<app-step-title title="Application Submitted"></app-step-title>

			<div class="row">
				<div class="offset-lg-3 col-lg-6 col-md-12 col-sm-12">
					Thank you for submitting your application to the Criminal Records Review Program. A confirmation email has
					been sent to <strong>{{ emailAddress }}</strong
					>.
				</div>
			</div>

			<div class="row my-4">
				<div class="offset-lg-3 col-lg-6 col-md-12 col-sm-12">
					Your application will be reviewed shortly. We will contact you if further information is required.
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class SaApplicationSubmittedComponent {
	@Input() emailAddress: string | null = null;
}
