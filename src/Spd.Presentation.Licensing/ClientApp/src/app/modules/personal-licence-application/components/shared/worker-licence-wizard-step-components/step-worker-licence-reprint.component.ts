import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LicenceApplicationService } from '@app/modules/personal-licence-application/licence-application.service';
import { LicenceChildStepperStepComponent } from '@app/shared/services/common-application.helper';

@Component({
	selector: 'app-step-worker-licence-reprint',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="Do you need a new licence printed?"></app-step-title>

				<app-licence-reprint [form]="form"></app-licence-reprint>
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
