import { Component, Input, OnInit } from '@angular/core';
import { ApplicationTypeCode, ServiceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { PermitApplicationService } from '@app/core/services/permit-application.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';

@Component({
	selector: 'app-form-alert-update-or-renewal',
	template: `
		<div class="row">
			<div class="col-md-8 col-sm-12 mx-auto">
				<div class="alert-confirm mb-3 p-2">
					<div class="row mt-0 mx-3 mb-2">
						<div class="col-lg-4 col-md-12">
							<div class="text-label text-center d-block text-muted mt-3">Licence Number</div>
							<div class="summary-text-data text-center">{{ originalLicenceNumber }}</div>
						</div>
						<div class="col-lg-4 col-md-12">
							<div class="text-label text-center d-block text-muted mt-3">Current Licence Expiry Date</div>
							<div class="summary-text-data text-center">
								{{ originalExpiryDate | formatDate: formalDateFormat }}
							</div>
						</div>
						<div class="col-lg-4 col-md-12">
							<div class="text-label text-center d-block text-muted mt-3">Term</div>
							<div class="summary-text-data text-center">
								{{ originalLicenceTermCode | options: 'LicenceTermTypes' }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`,
	styles: [
		`
			.alert-confirm {
				color: #0c5460;
				background-color: #eef8fa;
				border: 1px solid #0c5460;
				border-radius: 0;
			}
		`,
	],
})
export class FormAlertUpdateOrRenewalComponent implements OnInit {
	formalDateFormat = SPD_CONSTANTS.date.formalDateFormat;

	licenceModelData: any = {};

	@Input() serviceTypeCode: ServiceTypeCode | null = null;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(
		private workerApplicationService: WorkerApplicationService,
		private permitApplicationService: PermitApplicationService,
		private businessApplicationService: BusinessApplicationService
	) {}

	ngOnInit() {
		if (this.serviceTypeCode === ServiceTypeCode.SecurityWorkerLicence) {
			this.licenceModelData = { ...this.workerApplicationService.workerModelFormGroup.getRawValue() };
		} else if (this.serviceTypeCode === ServiceTypeCode.SecurityBusinessLicence) {
			this.licenceModelData = { ...this.businessApplicationService.businessModelFormGroup.getRawValue() };
		} else {
			this.licenceModelData = { ...this.permitApplicationService.permitModelFormGroup.getRawValue() };
		}
	}

	get originalLicenceNumber(): string {
		return this.workerApplicationService.getSummaryoriginalLicenceNumber(this.licenceModelData);
	}
	get originalExpiryDate(): string {
		return this.workerApplicationService.getSummaryoriginalExpiryDate(this.licenceModelData);
	}
	get originalLicenceTermCode(): string {
		return this.workerApplicationService.getSummaryoriginalLicenceTermCode(this.licenceModelData);
	}
}
