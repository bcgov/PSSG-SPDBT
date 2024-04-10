import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';

@Component({
	selector: 'app-step-permit-reprint',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="Do you need a new permit printed?"></app-step-title>

				<app-common-reprint [form]="form"></app-common-reprint>
			</div>
		</section>
	`,
	styles: [],
})
export class StepPermitReprintComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.permitApplicationService.reprintLicenceFormGroup;

	constructor(private permitApplicationService: PermitApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
