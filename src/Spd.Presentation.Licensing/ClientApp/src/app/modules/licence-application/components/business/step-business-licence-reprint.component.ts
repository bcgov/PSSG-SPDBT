import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { BusinessApplicationService } from '../../services/business-application.service';

@Component({
	selector: 'app-step-business-licence-reprint',
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
export class StepBusinessLicenceReprintComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.businessApplicationService.reprintLicenceFormGroup;

	constructor(private businessApplicationService: BusinessApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
