import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PermitChildStepperStepComponent } from '@app/modules/licence-application/services/permit-application.helper';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { showHideTriggerSlideAnimation } from 'src/app/core/animations';

@Component({
	selector: 'app-step-permit-expired',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Do you have an expired permit?"
					subtitle="Processing time will be reduced if you provide info from your past permit"
				></app-step-title>

				<app-common-expired-licence [form]="form"></app-common-expired-licence>
			</div>
		</section>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class StepPermitExpiredComponent implements PermitChildStepperStepComponent {
	form: FormGroup = this.permitApplicationService.expiredLicenceFormGroup;

	constructor(private permitApplicationService: PermitApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
