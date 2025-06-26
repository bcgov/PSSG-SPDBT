import { Component, OnInit } from '@angular/core';
import { ApplicationTypeCode, WorkerCategoryTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';

@Component({
	selector: 'app-step-worker-licence-confirmation',
	template: `
		<app-step-section heading="Confirm your current licence information">
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
							<div class="text-label d-block text-muted">Licence Holder Name</div>
							<div class="summary-text-data">{{ cardHolderName }}</div>
						</div>
						<div class="col-lg-4 col-md-12">
							<div class="text-label d-block text-muted">Licence Number</div>
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
									<ng-container *ngFor="let category of categoryList; let i = index">
										<li>{{ category | options: 'WorkerCategoryTypes' }}</li>
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
export class StepWorkerLicenceConfirmationComponent implements OnInit {
	formalDateFormat = SPD_CONSTANTS.date.formalDateFormat;

	feeAmount: null | number = null;
	spdPhoneNumber = SPD_CONSTANTS.phone.spdPhoneNumber;

	applicationTypeCode: ApplicationTypeCode | null = null;

	private licenceModelData: any = {};

	constructor(
		private workerApplicationService: WorkerApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit() {
		this.licenceModelData = this.workerApplicationService.workerModelFormGroup.getRawValue();

		// only show fee for Replacement flow
		this.applicationTypeCode = this.licenceModelData.applicationTypeData?.applicationTypeCode;
		if (this.applicationTypeCode === ApplicationTypeCode.Replacement) {
			const serviceTypeCode = this.licenceModelData.serviceTypeData?.serviceTypeCode;
			const originalLicenceData = this.licenceModelData.originalLicenceData;

			const fee = this.commonApplicationService.getLicenceFee(
				serviceTypeCode,
				this.applicationTypeCode,
				originalLicenceData.originalBizTypeCode,
				originalLicenceData.originalLicenceTermCode,
				originalLicenceData.originalLicenceTermCode
			);

			this.feeAmount = fee ? (fee.amount ?? null) : null;
		}
	}

	get cardHolderName(): string {
		return this.workerApplicationService.getSummarycardHolderName(this.licenceModelData);
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
	get categoryList(): Array<WorkerCategoryTypeCode> {
		return this.workerApplicationService.getSummarycategoryList(this.licenceModelData);
	}
}
