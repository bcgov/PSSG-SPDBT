import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-business-licence-reprint',
	template: `
		<app-step-section title="Do you need a new licence printed?">
			<app-licence-reprint [form]="form"></app-licence-reprint>
		</app-step-section>
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
