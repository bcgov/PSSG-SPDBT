import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BusinessApplicationService } from '@app/modules/business-licence-application/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/shared/services/common-application.helper';

@Component({
	selector: 'app-step-business-licence-reprint',
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
export class StepBusinessLicenceReprintComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.businessApplicationService.reprintLicenceFormGroup;

	constructor(private businessApplicationService: BusinessApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
