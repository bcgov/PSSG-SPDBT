import { Component, OnInit } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';

@Component({
	selector: 'app-step-gdsd-licence-confirmation',
	template: `
		<app-step-section title="Confirm your current licence information">
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
						<div class="col-lg-6 col-md-12">
							<div class="text-label d-block text-muted">Licence Holder Name</div>
							<div class="summary-text-data">{{ originalLicenceHolderName }}</div>
						</div>
						<div class="col-lg-6 col-md-12">
							<div class="text-label d-block text-muted">Licence Number</div>
							<div class="summary-text-data">{{ originalLicenceNumber }}</div>
						</div>
						<div class="col-lg-6 col-md-12">
							<div class="text-label d-block text-muted">Licence Term</div>
							<div class="summary-text-data">{{ originalLicenceTermCode | options: 'LicenceTermTypes' }}</div>
						</div>
						<div class="col-lg-6 col-md-12">
							<div class="text-label d-block text-muted">Expiry Date</div>
							<div class="summary-text-data">
								{{ originalExpiryDate | formatDate: formalDateFormat }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepGdsdLicenceConfirmationComponent implements OnInit {
	formalDateFormat = SPD_CONSTANTS.date.formalDateFormat;
	spdPhoneNumber = SPD_CONSTANTS.phone.spdPhoneNumber;

	private gdsdModelData: any = {};

	constructor(private gdsdApplicationService: GdsdApplicationService) {}

	ngOnInit() {
		this.gdsdModelData = { ...this.gdsdApplicationService.gdsdModelFormGroup.getRawValue() };
	}

	get originalLicenceHolderName(): string {
		return this.gdsdApplicationService.getSummaryoriginalLicenceHolderName(this.gdsdModelData);
	}
	get originalLicenceNumber(): string {
		return this.gdsdApplicationService.getSummaryoriginalLicenceNumber(this.gdsdModelData);
	}
	get originalExpiryDate(): string {
		return this.gdsdApplicationService.getSummaryoriginalExpiryDate(this.gdsdModelData);
	}
	get originalLicenceTermCode(): string {
		return this.gdsdApplicationService.getSummaryoriginalLicenceTermCode(this.gdsdModelData);
	}
}
