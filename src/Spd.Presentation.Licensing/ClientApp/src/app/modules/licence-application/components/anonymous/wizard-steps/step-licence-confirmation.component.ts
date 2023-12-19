import { Component, OnInit } from '@angular/core';
import { WorkerCategoryTypeCode } from 'src/app/api/models';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { UtilService } from 'src/app/core/services/util.service';
import { LicenceApplicationService } from '../../../services/licence-application.service';

@Component({
	selector: 'app-step-licence-confirmation',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="Confirm your current licence information"></app-step-title>
				<div class="step-container">
					<div class="row">
						<div class="col-xxl-8 col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
							<div class="row mt-0">
								<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12 mt-lg-2">
									<div class="text-label d-block text-muted mt-2">Licence Holder Name</div>
									<div class="summary-text-data">{{ licenceHolderName }}</div>
								</div>
								<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12 mt-lg-2">
									<div class="text-label d-block text-muted mt-2">Licence Number</div>
									<div class="summary-text-data">{{ licenceNumber }}</div>
								</div>
								<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12 mt-lg-2">
									<div class="text-label d-block text-muted mt-2">Licence Categories</div>
									<div class="summary-text-data">
										<ng-container *ngFor="let category of categoryList; let i = index">
											<div>{{ category | options : 'WorkerCategoryTypes' }}</div>
										</ng-container>
									</div>
								</div>
								<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12 mt-lg-2">
									<div class="text-label d-block text-muted mt-2">Expiry Date</div>
									<div class="summary-text-data">{{ expiryDate | formatDate : constants.date.formalDateFormat }}</div>
								</div>
								<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12 mt-lg-2">
									<div class="text-label d-block text-muted mt-2">Licence Term</div>
									<div class="summary-text-data">{{ licenceTermCode | options : 'LicenceTermTypes' }}</div>
								</div>
								<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12 mt-lg-2">
									<div class="text-label d-block text-muted mt-2">Replacement Fee</div>
									<div class="summary-text-data">$20</div>
								</div>
							</div>
							<div class="mt-5">
								<app-alert type="warning" icon="warning">
									If any of this information is not correct, please call the Security Program's Licensing Unit during
									regular office hours: 1-855-587-0185
								</app-alert>
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

	private licenceModelData: any = {};

	constructor(private utilService: UtilService, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit() {
		this.licenceModelData = { ...this.licenceApplicationService.licenceModelFormGroup.getRawValue() };
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
