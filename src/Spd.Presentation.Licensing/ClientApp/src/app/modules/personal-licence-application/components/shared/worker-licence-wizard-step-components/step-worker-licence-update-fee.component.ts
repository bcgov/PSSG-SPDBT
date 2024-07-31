import { Component, Input } from '@angular/core';
import { LicenceChildStepperStepComponent } from '@app/shared/services/common-application.helper';

@Component({
	selector: 'app-step-worker-licence-update-fee',
	template: `
		<app-step-section title="Update fee">
			<div class="row">
				<div class="col-xxl-4 col-xl-4 col-lg-8 col-md-12 col-sm-12 mx-auto">
					<div class="mb-3">
						A {{ licenceCost | currency : 'CAD' : 'symbol-narrow' : '1.0' }} fee applies to any of these updates:
					</div>
					<ul>
						<li>Name change</li>
						<li>Licence category</li>
						<li>Restraints and dogs authorization request</li>
						<li>New licence photograph</li>
					</ul>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [
		`
			li:not(:last-child) {
				margin-bottom: 1em;
			}
		`,
	],
})
export class StepWorkerLicenceUpdateFeeComponent implements LicenceChildStepperStepComponent {
	@Input() licenceCost = 0;

	isFormValid(): boolean {
		return true;
	}
}
