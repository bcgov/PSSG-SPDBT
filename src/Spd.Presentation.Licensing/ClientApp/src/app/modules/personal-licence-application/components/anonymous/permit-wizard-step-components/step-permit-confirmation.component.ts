import { Component, Input, OnInit } from '@angular/core';
import { ServiceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { PermitApplicationService } from '@app/core/services/permit-application.service';

@Component({
	selector: 'app-step-permit-confirmation',
	template: `
		<app-step-section title="Confirm your current permit information">
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<app-alert type="warning" icon="warning">
						If any of this information is not correct, please call the Security Program's Licensing Unit during regular
						office hours: {{ spdPhoneNumber }}
					</app-alert>
				</div>
			</div>

			<div class="row">
				<div class="col-xl-7 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row mt-0 mb-3">
						<div class="col-lg-4 col-md-12">
							<div class="text-label d-block text-muted">Permit Number</div>
							<div class="summary-text-data">{{ originalLicenceNumber }}</div>
						</div>
						<div class="col-lg-6 col-md-12">
							<div class="text-label d-block text-muted">Permit Type</div>
							<div class="summary-text-data">{{ serviceTypeCode | options: 'ServiceTypes' }}</div>
						</div>
						<div class="col-lg-4 col-md-12">
							<div class="text-label d-block text-muted">Expiry Date</div>
							<div class="summary-text-data">
								{{ originalExpiryDate | formatDate: formalDateFormat }}
							</div>
						</div>
						<div class="col-lg-6 col-md-12">
							<div class="text-label d-block text-muted">Name on Permit</div>
							<div class="summary-text-data">{{ cardHolderName }}</div>
						</div>
					</div>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
})
export class StepPermitConfirmationComponent implements OnInit {
	formalDateFormat = SPD_CONSTANTS.date.formalDateFormat;
	spdPhoneNumber = SPD_CONSTANTS.phone.spdPhoneNumber;

	@Input() serviceTypeCode!: ServiceTypeCode;

	private permitModelData: any = {};

	constructor(private permitApplicationService: PermitApplicationService) {}

	ngOnInit() {
		this.permitModelData = { ...this.permitApplicationService.permitModelFormGroup.getRawValue() };
	}

	get cardHolderName(): string {
		return this.permitModelData.personalInformationData.cardHolderName ?? '';
	}
	get originalLicenceNumber(): string {
		return this.permitModelData.originalLicenceData.originalLicenceNumber ?? '';
	}
	get originalExpiryDate(): string {
		return this.permitModelData.originalLicenceData.originalExpiryDate ?? '';
	}
}
