import { Component, Input } from '@angular/core';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';

@Component({
	selector: 'app-step-business-licence-update-fee',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="Update fee"></app-step-title>

				<div class="row">
					<div class="col-xxl-4 col-xl-4 col-lg-8 col-md-12 col-sm-12 mx-auto">
						<div class="mb-3">
							A {{ licenceCost | currency : 'CAD' : 'symbol-narrow' : '1.0' }} fee applies to updates made to:
						</div>
						<ul>
							<li>add or remove branch</li>
							<li>change to business trade name</li>
							<li>change to business legal name</li>
							<li>change to business address</li>
							<li>add request for dogs authorization</li>
							<li>update licence category</li>
						</ul>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			li:not(:last-child) {
				margin-bottom: 1em;
			}
		`,
	],
})
export class StepBusinessLicenceUpdateFeeComponent implements LicenceChildStepperStepComponent {
	@Input() licenceCost = 0;

	isFormValid(): boolean {
		return true;
	}
}