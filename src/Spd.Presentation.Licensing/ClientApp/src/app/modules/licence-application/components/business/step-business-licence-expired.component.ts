import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WorkerLicenceTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { BusinessApplicationService } from '../../services/business-application.service';

@Component({
	selector: 'app-step-business-licence-expired',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Does your business have an expired licence?"
					subtitle="Processing time will be reduced if you provide info from your past licence"
				></app-step-title>

				<app-common-expired-licence
					[form]="form"
					[workerLicenceTypeCode]="workerLicenceTypeCode"
					(linkSuccess)="onLinkSuccess()"
				></app-common-expired-licence>
			</div>
		</section>
	`,
	styles: [],
})
export class StepBusinessLicenceExpiredComponent implements OnInit, LicenceChildStepperStepComponent {
	form: FormGroup = this.businessApplicationService.expiredLicenceFormGroup;
	workerLicenceTypeCode!: WorkerLicenceTypeCode;

	constructor(private businessApplicationService: BusinessApplicationService) {}

	ngOnInit(): void {
		this.workerLicenceTypeCode = this.businessApplicationService.businessModelFormGroup.get(
			'workerLicenceTypeData.workerLicenceTypeCode'
		)?.value;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onLinkSuccess(): void {
		// TODO handle onLinkSuccess
	}
}
