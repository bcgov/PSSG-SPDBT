import { Component, Input, OnInit } from '@angular/core';
import { ApplicationTypeCode, WorkerCategoryTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { UtilService } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-business-licence-confirmation',
	template: `
		<app-step-section heading="Confirm your current business licence information">
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
							<div class="text-label d-block text-muted">Business Name</div>
							<div class="summary-text-data">{{ businessName }}</div>
						</div>
						<div class="col-lg-4 col-md-12">
							<div class="text-label d-block text-muted">Business Licence Number</div>
							<div class="summary-text-data">{{ originalLicenceNumber }}</div>
						</div>
						<div class="col-lg-4 col-md-12">
							<div class="text-label d-block text-muted">Licence Term</div>
							<div class="summary-text-data">{{ originalLicenceTermCode | options: 'LicenceTermTypes' }}</div>
						</div>
						<div class="col-lg-4 col-md-12">
							<div class="text-label d-block text-muted">Expiry Date</div>
							<div class="summary-text-data">
								{{ originalExpiryDate | formatDate: formalDateFormat }}
							</div>
						</div>
						<div class="col-lg-4 col-md-12" *ngIf="feeAmount">
							<div class="text-label d-block text-muted">{{ applicationTypeCode }} Fee</div>
							<div class="summary-text-data">
								{{ feeAmount | currency: 'CAD' : 'symbol-narrow' : '1.0' | default }}
							</div>
						</div>
						<div class="col-md-12" [ngClass]="feeAmount ? 'col-lg-4' : 'col-lg-8'">
							<div class="text-label d-block text-muted">Licence Categories</div>
							<div class="summary-text-data">
								<ul class="m-0">
									<ng-container *ngFor="let catCode of categoryData; let i = index">
										<li>{{ catCode | options: 'WorkerCategoryTypes' }}</li>
									</ng-container>
								</ul>
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
export class StepBusinessLicenceConfirmationComponent implements OnInit {
	formalDateFormat = SPD_CONSTANTS.date.formalDateFormat;

	feeAmount: null | number = null;
	spdPhoneNumber = SPD_CONSTANTS.phone.spdPhoneNumber;

	@Input() applicationTypeCode!: ApplicationTypeCode;

	private businessLicenceModelData: any = {};

	constructor(
		private utilService: UtilService,
		private businessApplicationService: BusinessApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit() {
		this.businessLicenceModelData = this.businessApplicationService.businessModelFormGroup.getRawValue();

		// only show fee for Replacement flow
		if (this.applicationTypeCode === ApplicationTypeCode.Replacement) {
			const serviceTypeCode = this.businessLicenceModelData.serviceTypeData?.serviceTypeCode;
			const originalLicenceData = this.businessLicenceModelData.originalLicenceData;

			const fee = this.commonApplicationService.getLicenceFee(
				serviceTypeCode,
				ApplicationTypeCode.Replacement,
				originalLicenceData.originalBizTypeCode,
				originalLicenceData.originalLicenceTermCode,
				originalLicenceData.originalLicenceTermCode
			);

			this.feeAmount = fee ? (fee.amount ?? null) : null;
		}
	}

	get businessName(): string {
		return (
			this.businessLicenceModelData.businessInformationData.legalBusinessName ??
			this.businessLicenceModelData.businessInformationData.bizTradeName
		);
	}
	get originalLicenceNumber(): string {
		return this.businessLicenceModelData.originalLicenceData.originalLicenceNumber ?? '';
	}
	get originalExpiryDate(): string {
		return this.businessLicenceModelData.originalLicenceData.originalExpiryDate ?? '';
	}
	get originalLicenceTermCode(): string {
		return this.businessLicenceModelData.originalLicenceData.originalLicenceTermCode ?? '';
	}
	get categoryData(): Array<WorkerCategoryTypeCode> {
		const categoryData = this.businessLicenceModelData.originalLicenceData.originalCategoryCodes ?? [];
		const workerCategoryTypeCodes = Object.values(WorkerCategoryTypeCode);
		const selected = workerCategoryTypeCodes.filter((item: string) => {
			return categoryData.find((cat: WorkerCategoryTypeCode) => cat === item);
		});
		return selected.sort((a, b) => this.utilService.sortByDirection(a.toUpperCase(), b.toUpperCase()));
	}
}
