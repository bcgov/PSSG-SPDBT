import { Component, Input, OnInit } from '@angular/core';
import { ApplicationTypeCode, WorkerCategoryTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';
import { BusinessApplicationService } from '../../services/business-application.service';

@Component({
	selector: 'app-step-business-licence-confirmation',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="Confirm your current business licence information"></app-step-title>

				<div class="row">
					<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<app-alert type="warning" icon="warning">
							If any of this information is not correct, please call the Security Program's Licensing Unit during
							regular office hours: {{ spdPhoneNumber }}
						</app-alert>
					</div>
				</div>

				<div class="row">
					<div class="col-xl-7 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row mt-0 mb-3">
							<div class="col-lg-6 col-md-12">
								<div class="text-label d-block text-muted">Business Name</div>
								<div class="summary-text-data">{{ businessName }}</div>
							</div>
							<div class="col-lg-6 col-md-12">
								<div class="text-label d-block text-muted">Business Licence Number</div>
								<div class="summary-text-data">{{ originalLicenceNumber }}</div>
							</div>
							<div class="col-lg-6 col-md-12">
								<div class="text-label d-block text-muted">Licence Categories</div>
								<div class="summary-text-data">
									<ul class="m-0">
										<ng-container *ngFor="let catCode of categoryData; let i = index">
											<li>{{ catCode | options : 'WorkerCategoryTypes' }}</li>
										</ng-container>
									</ul>
								</div>
							</div>
							<div class="col-lg-6 col-md-12">
								<div class="text-label d-block text-muted">Expiry Date</div>
								<div class="summary-text-data">
									{{ originalExpiryDate | formatDate : formalDateFormat }}
								</div>
							</div>
							<div class="col-lg-6 col-md-12">
								<div class="text-label d-block text-muted">Licence Term</div>
								<div class="summary-text-data">{{ originalLicenceTermCode | options : 'LicenceTermTypes' }}</div>
							</div>
							<div class="col-lg-6 col-md-12" *ngIf="feeAmount">
								<div class="text-label d-block text-muted">{{ applicationTypeCode }} Fee</div>
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
export class StepBusinessLicenceConfirmationComponent implements OnInit {
	formalDateFormat = SPD_CONSTANTS.date.formalDateFormat;
	feeAmount: null | number = null;
	spdPhoneNumber = SPD_CONSTANTS.phone.spdPhoneNumber;

	@Input() applicationTypeCode!: ApplicationTypeCode;

	private licenceModelData: any = {};

	constructor(
		private businessApplicationService: BusinessApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit() {
		this.licenceModelData = { ...this.businessApplicationService.businessModelFormGroup.getRawValue() };

		// only show fee for Replacement flow
		if (this.applicationTypeCode === ApplicationTypeCode.Replacement) {
			const workerLicenceTypeCode = this.licenceModelData.workerLicenceTypeData?.workerLicenceTypeCode;
			const originalLicenceData = this.licenceModelData.originalLicenceData;

			const fee = this.commonApplicationService
				.getLicenceTermsAndFees(
					workerLicenceTypeCode,
					this.applicationTypeCode,
					originalLicenceData.originalBizTypeCode,
					originalLicenceData.originalLicenceTermCode
				)
				.filter((item) => item.licenceTermCode == originalLicenceData.originalLicenceTermCode);

			if (fee?.length > 0) {
				this.feeAmount = fee[0]?.amount ? fee[0]?.amount : null;
			}
		}
	}

	get businessName(): string {
		return (
			this.licenceModelData.businessInformationData.legalBusinessName ??
			this.licenceModelData.businessInformationData.bizTradeName
		);
	}
	get originalLicenceNumber(): string {
		return this.licenceModelData.originalLicenceData.originalLicenceNumber ?? '';
	}
	get originalExpiryDate(): string {
		return this.licenceModelData.originalLicenceData.originalExpiryDate ?? '';
	}
	get originalLicenceTermCode(): string {
		return this.licenceModelData.originalLicenceData.originalLicenceTermCode ?? '';
	}
	get categoryData(): Array<WorkerCategoryTypeCode> {
		const categoryData = this.licenceModelData.categoryData;
		const workerCategoryTypeCodes = Object.values(WorkerCategoryTypeCode);
		const selected = workerCategoryTypeCodes.filter((item: string) => {
			return !!categoryData[item];
		});
		return selected ?? [];
	}
}
