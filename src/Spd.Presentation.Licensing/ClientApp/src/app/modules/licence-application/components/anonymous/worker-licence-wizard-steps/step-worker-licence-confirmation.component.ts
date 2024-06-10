import { Component, OnInit } from '@angular/core';
import { ApplicationTypeCode, WorkerCategoryTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';

@Component({
	selector: 'app-step-worker-licence-confirmation',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="Confirm your current licence information"></app-step-title>

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
								<div class="text-label d-block text-muted">Licence Holder Name</div>
								<div class="summary-text-data">{{ cardHolderName }}</div>
							</div>
							<div class="col-lg-6 col-md-12">
								<div class="text-label d-block text-muted">Licence Number</div>
								<div class="summary-text-data">{{ originalLicenceNumber }}</div>
							</div>
							<div class="col-lg-6 col-md-12">
								<div class="text-label d-block text-muted">Licence Categories</div>
								<div class="summary-text-data">
									<ul class="m-0">
										<ng-container *ngFor="let category of categoryList; let i = index">
											<li>{{ category | options : 'WorkerCategoryTypes' }}</li>
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
export class StepWorkerLicenceConfirmationComponent implements OnInit {
	formalDateFormat = SPD_CONSTANTS.date.formalDateFormat;
	feeAmount: null | number = null;
	spdPhoneNumber = SPD_CONSTANTS.phone.spdPhoneNumber;

	applicationTypeCode: ApplicationTypeCode | null = null;

	private licenceModelData: any = {};

	constructor(
		private licenceApplicationService: LicenceApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit() {
		this.licenceModelData = { ...this.licenceApplicationService.licenceModelFormGroup.getRawValue() };

		// only show fee for Replacement flow
		this.applicationTypeCode = this.licenceModelData.applicationTypeData?.applicationTypeCode;
		if (this.applicationTypeCode === ApplicationTypeCode.Replacement) {
			const workerLicenceTypeCode = this.licenceModelData.workerLicenceTypeData?.workerLicenceTypeCode;
			const originalLicenceData = this.licenceModelData.originalLicenceData;
			const bizTypeCode = originalLicenceData.originalBizTypeCode;
			const originalLicenceTermCode = originalLicenceData.originalLicenceTermCode;

			const fee = this.commonApplicationService
				.getLicenceTermsAndFees(workerLicenceTypeCode, this.applicationTypeCode, bizTypeCode, originalLicenceTermCode)
				.filter((item) => item.licenceTermCode == originalLicenceTermCode);

			if (fee?.length > 0) {
				this.feeAmount = fee[0]?.amount ? fee[0]?.amount : null;
			}
		}
	}

	get cardHolderName(): string {
		return this.licenceModelData.personalInformationData.cardHolderName;
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
	get categoryList(): Array<WorkerCategoryTypeCode> {
		const list: Array<WorkerCategoryTypeCode> = [];
		if (this.licenceModelData.categoryArmouredCarGuardFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.ArmouredCarGuard);
		}
		if (this.licenceModelData.categoryBodyArmourSalesFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.BodyArmourSales);
		}
		if (this.licenceModelData.categoryClosedCircuitTelevisionInstallerFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller);
		}
		if (this.licenceModelData.categoryElectronicLockingDeviceInstallerFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller);
		}
		if (this.licenceModelData.categoryFireInvestigatorFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.FireInvestigator);
		}
		if (this.licenceModelData.categoryLocksmithFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.Locksmith);
		}
		if (this.licenceModelData.categoryLocksmithSupFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.LocksmithUnderSupervision);
		}
		if (this.licenceModelData.categoryPrivateInvestigatorFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.PrivateInvestigator);
		}
		if (this.licenceModelData.categoryPrivateInvestigatorSupFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision);
		}
		if (this.licenceModelData.categorySecurityAlarmInstallerFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.SecurityAlarmInstaller);
		}
		if (this.licenceModelData.categorySecurityAlarmInstallerSupFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision);
		}
		if (this.licenceModelData.categorySecurityAlarmMonitorFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.SecurityAlarmMonitor);
		}
		if (this.licenceModelData.categorySecurityAlarmResponseFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.SecurityAlarmResponse);
		}
		if (this.licenceModelData.categorySecurityAlarmSalesFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.SecurityAlarmSales);
		}
		if (this.licenceModelData.categorySecurityConsultantFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.SecurityConsultant);
		}
		if (this.licenceModelData.categorySecurityGuardFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.SecurityGuard);
		}
		if (this.licenceModelData.categorySecurityGuardSupFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.SecurityGuardUnderSupervision);
		}

		return list;
	}
}
