import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ServiceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';

@Component({
	selector: 'app-step-worker-licence-expired',
	template: `
		<app-step-section heading="Do you have an expired security worker licence in BC?">
			<div class="row">
				<div class="offset-md-2 col-md-8 col-sm-12">
					<app-alert type="info" icon="info">
						<p>Provide information from your expired licence to reduce processing time.</p>
						<p>
							If you don’t know your expired licence number, call Security Program’s Licensing Unit during regular
							office hours at {{ spdPhoneNumber }}.
						</p>
					</app-alert>
				</div>
			</div>

			<app-form-expired-licence
				[form]="form"
				[isLoggedIn]="isLoggedIn"
				[serviceTypeCode]="securityWorkerLicenceCode"
				[useAccessCode]="useAccessCode"
			></app-form-expired-licence>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepWorkerLicenceExpiredComponent implements OnInit, LicenceChildStepperStepComponent {
	spdPhoneNumber = SPD_CONSTANTS.phone.spdPhoneNumber;
	useAccessCode!: boolean;

	form: FormGroup = this.workerApplicationService.expiredLicenceFormGroup;
	securityWorkerLicenceCode = ServiceTypeCode.SecurityWorkerLicence;

	@Input() isLoggedIn!: boolean;

	constructor(private workerApplicationService: WorkerApplicationService) {}

	ngOnInit(): void {
		this.useAccessCode = !this.isLoggedIn;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
