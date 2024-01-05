import { Component, Input, OnInit } from '@angular/core';
import { ApplicationTypeCode, WorkerCategoryTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
	selector: 'app-step-licence-confirmation',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="Confirm your current licence information"></app-step-title>
				<div class="step-container">
					<div class="row">
						<div class="col-xxl-8 col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
							<app-alert type="warning" icon="warning">
								If any of this information is not correct, please call the Security Program's Licensing Unit during
								regular office hours: {{ spdPhoneNumber }}
							</app-alert>
							<div class="row mt-0 mb-3">
								<div class="col-xxl-7 col-xl-7 col-lg-6 col-md-12 mt-lg-2">
									<div class="text-label d-block text-muted mt-2">Licence Holder Name</div>
									<div class="summary-text-data">{{ licenceHolderName }}</div>
								</div>
								<div class="col-xxl-5 col-xl-5 col-lg-6 col-md-12 mt-lg-2">
									<div class="text-label d-block text-muted mt-2">Licence Number</div>
									<div class="summary-text-data">{{ licenceNumber }}</div>
								</div>
								<div class="col-xxl-7 col-xl-7 col-lg-6 col-md-12 mt-lg-2">
									<div class="text-label d-block text-muted mt-2">Licence Categories</div>
									<div class="summary-text-data">
										<ng-container *ngFor="let category of categoryList; let i = index">
											<div>{{ category | options : 'WorkerCategoryTypes' }}</div>
										</ng-container>
									</div>
								</div>
								<div class="col-xxl-5 col-xl-5 col-lg-6 col-md-12 mt-lg-2">
									<div class="text-label d-block text-muted mt-2">Expiry Date</div>
									<div class="summary-text-data">{{ expiryDate | formatDate : constants.date.formalDateFormat }}</div>
								</div>
								<div class="col-xxl-7 col-xl-7 col-lg-6 col-md-12 mt-lg-2">
									<div class="text-label d-block text-muted mt-2">Licence Term</div>
									<div class="summary-text-data">{{ licenceTermCode | options : 'LicenceTermTypes' }}</div>
								</div>
								<div class="col-xxl-5 col-xl-5 col-lg-6 col-md-12 mt-lg-2">
									<div class="text-label d-block text-muted mt-2">{{ applicationTypeCode }} Fee</div>
									<div class="summary-text-data">{{ feeAmount }}</div>
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
export class StepLicenceConfirmationComponent implements OnInit {
	constants = SPD_CONSTANTS;
	feeAmount: null | string | undefined = '';
	spdPhoneNumber = SPD_CONSTANTS.phone.spdPhoneNumber;

	private licenceModelData: any = {};

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private utilService: UtilService, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit() {
		this.licenceModelData = { ...this.licenceApplicationService.licenceModelFormGroup.getRawValue() };

		const fee = this.licenceApplicationService.licenceFeeTermCodes?.filter(
			(item) => item.licenceTermCode == this.licenceTermCode
		);
		if (fee?.length > 0) {
			this.feeAmount = `$${fee[0].amount}`;
		} else {
			this.feeAmount = '';
		}
	}

	get licenceHolderName(): string {
		return this.utilService.getFullNameWithMiddle(
			this.licenceModelData.personalInformationData.givenName,
			this.licenceModelData.personalInformationData.middleName1,
			this.licenceModelData.personalInformationData.middleName2,
			this.licenceModelData.personalInformationData.surname
		);
	}
	get licenceNumber(): string {
		return this.licenceModelData.caseNumber ?? '';
	}
	get expiryDate(): string {
		return this.licenceModelData.expiryDate ?? '';
	}
	get licenceTermCode(): string {
		return this.licenceModelData.licenceTermData.licenceTermCode ?? '';
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
