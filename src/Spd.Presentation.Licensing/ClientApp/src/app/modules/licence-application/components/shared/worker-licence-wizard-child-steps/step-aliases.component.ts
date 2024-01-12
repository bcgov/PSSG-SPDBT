import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';

@Component({
	selector: 'app-step-aliases',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="Do you have any previous names?"></app-step-title>

				<app-common-aliases [form]="form"></app-common-aliases>
			</div>
		</section>
	`,
	styles: [],
})
export class StepAliasesComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.licenceApplicationService.aliasesFormGroup;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
