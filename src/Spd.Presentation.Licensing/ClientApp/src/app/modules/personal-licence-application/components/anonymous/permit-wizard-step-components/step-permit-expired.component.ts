import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WorkerLicenceTypeCode } from '@app/api/models';
import { PermitChildStepperStepComponent } from '@app/core/services/permit-application.helper';
import { PermitApplicationService } from '@core/services/permit-application.service';

@Component({
	selector: 'app-step-permit-expired',
	template: `
		<app-step-section
			title="Do you have an expired permit in BC?"
			subtitle="Processing time will be reduced if you provide info from your past permit"
		>
			<app-expired-licence
				[form]="form"
				[isLoggedIn]="isLoggedIn"
				[workerLicenceTypeCode]="workerLicenceTypeCode"
			></app-expired-licence>
		</app-step-section>
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
