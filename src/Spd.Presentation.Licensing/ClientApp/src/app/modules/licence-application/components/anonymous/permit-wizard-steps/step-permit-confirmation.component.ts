import { Component, Input, OnInit } from '@angular/core';
import { ApplicationTypeCode, BusinessTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
	selector: 'app-step-permit-confirmation',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="Confirm your current permit information"></app-step-title>

				<div class="row">
					<div class="col-xxl-8 col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<app-alert type="warning" icon="warning">
							If any of this information is not correct, please call the Security Program's Licensing Unit during
							regular office hours: {{ spdPhoneNumber }}
						</app-alert>
						<div class="row mt-0 mb-3">
							<div class="col-xxl-7 col-xl-7 col-lg-6 col-md-12 mt-lg-2">
								<div class="text-label d-block text-muted mt-2">Permit Holder Name</div>
								<div class="summary-text-data">{{ permitHolderName }}</div>
							</div>
							<div class="col-xxl-5 col-xl-5 col-lg-6 col-md-12 mt-lg-2">
								<div class="text-label d-block text-muted mt-2">Permit Number</div>
								<div class="summary-text-data">{{ originalLicenceNumber }}</div>
							</div>
							<div class="col-xxl-7 col-xl-7 col-lg-6 col-md-12 mt-lg-2">
								<div class="text-label d-block text-muted mt-2">Expiry Date</div>
								<div class="summary-text-data">
									{{ originalExpiryDate | formatDate : constants.date.formalDateFormat }}
								</div>
							</div>
							<div class="col-xxl-5 col-xl-5 col-lg-6 col-md-12 mt-lg-2">
								<div class="text-label d-block text-muted mt-2">{{ applicationTypeCode }} Fee</div>
								<div class="summary-text-data">
									{{ feeAmount | currency : 'CAD' : 'symbol-narrow' : '1.0' | default }}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class StepPermitConfirmationComponent implements OnInit {
	constants = SPD_CONSTANTS;
	feeAmount: null | number = null;
	spdPhoneNumber = SPD_CONSTANTS.phone.spdPhoneNumber;

	private permitModelData: any = {};

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(
		private utilService: UtilService,
		private permitApplicationService: PermitApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit() {
		this.permitModelData = { ...this.permitApplicationService.permitModelFormGroup.getRawValue() };

		const workerLicenceTypeCode = this.permitModelData.workerLicenceTypeData.workerLicenceTypeCode;
		const applicationTypeCode = this.permitModelData.applicationTypeData.applicationTypeCode;

		const fee = this.commonApplicationService
			.getLicenceTermsAndFees(workerLicenceTypeCode, applicationTypeCode, BusinessTypeCode.None)
			.find((item) => item.applicationTypeCode === this.permitModelData.applicationTypeData.applicationTypeCode);

		this.feeAmount = fee?.amount ? fee.amount : null;
	}

	get permitHolderName(): string {
		return this.utilService.getFullNameWithMiddle(
			this.permitModelData.personalInformationData.givenName,
			this.permitModelData.personalInformationData.middleName1,
			this.permitModelData.personalInformationData.middleName2,
			this.permitModelData.personalInformationData.surname
		);
	}
	get originalLicenceNumber(): string {
		return this.permitModelData.originalLicenceNumber ?? '';
	}
	get originalExpiryDate(): string {
		return this.permitModelData.originalExpiryDate ?? '';
	}
}
