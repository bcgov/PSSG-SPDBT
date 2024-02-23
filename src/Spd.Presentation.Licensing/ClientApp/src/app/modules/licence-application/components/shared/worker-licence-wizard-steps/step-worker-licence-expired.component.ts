import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WorkerLicenceTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { CommonExpiredLicenceComponent } from '../step-components/common-expired-licence.component';

@Component({
	selector: 'app-step-worker-licence-expired',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Do you have an expired licence?"
					subtitle="Processing time will be reduced if you provide info from your past licence"
				></app-step-title>

				<app-common-expired-licence
					[form]="form"
					[workerLicenceTypeCode]="workerLicenceTypeCode"
					(validExpiredLicenceData)="onValidData()"
				></app-common-expired-licence>
			</div>
		</section>
	`,
	styles: [],
})
export class StepWorkerLicenceExpiredComponent implements OnInit, LicenceChildStepperStepComponent {
	form: FormGroup = this.licenceApplicationService.expiredLicenceFormGroup;
	workerLicenceTypeCode!: WorkerLicenceTypeCode;

	@Output() validExpiredLicenceData = new EventEmitter();

	@ViewChild(CommonExpiredLicenceComponent)
	commonExpiredLicenceComponent!: CommonExpiredLicenceComponent;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.workerLicenceTypeCode = this.licenceApplicationService.licenceModelFormGroup.get(
			'workerLicenceTypeData.workerLicenceTypeCode'
		)?.value;
	}

	onSearchAndValidate(): void {
		this.commonExpiredLicenceComponent.onValidateAndSearch();
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onValidData(): void {
		this.validExpiredLicenceData.emit();
	}
}
