import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WorkerLicenceTypeCode } from '@app/api/models';
import { PermitChildStepperStepComponent } from '@app/modules/licence-application/services/permit-application.helper';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { CommonExpiredLicenceComponent } from '../../shared/step-components/common-expired-licence.component';

@Component({
	selector: 'app-step-permit-expired',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Do you have an expired permit?"
					subtitle="Processing time will be reduced if you provide info from your past permit"
				></app-step-title>

				<app-common-expired-licence
					[form]="form"
					[isLoggedIn]="isLoggedIn"
					[workerLicenceTypeCode]="workerLicenceTypeCode"
				></app-common-expired-licence>
			</div>
		</section>
	`,
	styles: [],
})
export class StepPermitExpiredComponent implements OnInit, PermitChildStepperStepComponent {
	form: FormGroup = this.permitApplicationService.expiredLicenceFormGroup;
	workerLicenceTypeCode!: WorkerLicenceTypeCode;

	@Input() isLoggedIn!: boolean;

	@ViewChild(CommonExpiredLicenceComponent)
	commonExpiredLicenceComponent!: CommonExpiredLicenceComponent;

	constructor(private permitApplicationService: PermitApplicationService) {}

	ngOnInit(): void {
		this.workerLicenceTypeCode = this.permitApplicationService.permitModelFormGroup.get(
			'workerLicenceTypeData.workerLicenceTypeCode'
		)?.value;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
