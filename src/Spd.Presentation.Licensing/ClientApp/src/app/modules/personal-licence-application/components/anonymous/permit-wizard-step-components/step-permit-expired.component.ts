import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WorkerLicenceTypeCode } from '@app/api/models';
import { PermitChildStepperStepComponent } from '@app/modules/personal-licence-application/permit-application.helper';
import { PermitApplicationService } from '@app/modules/personal-licence-application/permit-application.service';

@Component({
	selector: 'app-step-permit-expired',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Do you have an expired permit?"
					subtitle="Processing time will be reduced if you provide info from your past permit"
				></app-step-title>

				<app-expired-licence
					[form]="form"
					[isLoggedIn]="isLoggedIn"
					[workerLicenceTypeCode]="workerLicenceTypeCode"
				></app-expired-licence>
			</div>
		</section>
	`,
	styles: [],
})
export class StepPermitExpiredComponent implements PermitChildStepperStepComponent {
	form: FormGroup = this.permitApplicationService.expiredLicenceFormGroup;

	@Input() isLoggedIn!: boolean;
	@Input() workerLicenceTypeCode!: WorkerLicenceTypeCode;

	constructor(private permitApplicationService: PermitApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
