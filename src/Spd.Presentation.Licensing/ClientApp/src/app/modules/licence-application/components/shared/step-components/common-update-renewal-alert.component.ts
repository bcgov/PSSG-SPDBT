import { Component, Input, OnInit } from '@angular/core';
import { ApplicationTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';

@Component({
	selector: 'app-common-update-renewal-alert',
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
								{{ originalExpiryDate | formatDate : constants.date.formalDateFormat }}
							</div>
						</div>
						<div class="col-lg-4 col-md-12">
							<div class="text-label text-center d-block text-muted mt-3">Term</div>
							<div class="summary-text-data text-center">
								{{ originalLicenceTermCode | options : 'LicenceTermTypes' }}
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
export class CommonUpdateRenewalAlertComponent implements OnInit {
	licenceModelData: any = {};
	constants = SPD_CONSTANTS;

	@Input() workerLicenceTypeCode: WorkerLicenceTypeCode | null = null;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(
		private licenceApplicationService: LicenceApplicationService,
		private permitApplicationService: PermitApplicationService
	) {}

	ngOnInit() {
		if (this.workerLicenceTypeCode === WorkerLicenceTypeCode.SecurityWorkerLicence) {
			this.licenceModelData = { ...this.licenceApplicationService.licenceModelFormGroup.getRawValue() };
		} else {
			this.licenceModelData = { ...this.permitApplicationService.permitModelFormGroup.getRawValue() };
		}
	}

	get originalLicenceNumber(): string {
		return this.licenceModelData.originalLicenceNumber ?? '';
	}
	get originalExpiryDate(): string {
		return this.licenceModelData.originalExpiryDate ?? '';
	}
	get originalLicenceTermCode(): string {
		return this.licenceModelData.originalLicenceTermCode ?? '';
	}
}
