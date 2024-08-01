import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LicenceApplicationService } from '@app/core/services/licence-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-worker-licence-reprint',
	template: `
		<app-step-section title="Do you need a new licence printed?">
			<app-licence-reprint [form]="form"></app-licence-reprint>
		</app-step-section>
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
