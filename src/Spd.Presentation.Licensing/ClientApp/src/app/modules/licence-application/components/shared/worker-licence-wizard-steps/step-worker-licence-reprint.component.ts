import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';

@Component({
	selector: 'app-step-worker-licence-reprint',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="Do you need a new licence printed?"></app-step-title>

				<app-common-reprint [form]="form"></app-common-reprint>
			</div>
		</section>
	`,
	styles: [],
})
export class StepWorkerLicenceReprintComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.licenceApplicationService.reprintLicenceFormGroup;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
