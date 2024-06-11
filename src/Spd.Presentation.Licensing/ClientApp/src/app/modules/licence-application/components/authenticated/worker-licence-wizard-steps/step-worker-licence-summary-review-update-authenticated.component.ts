import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
	ApplicationTypeCode,
	LicenceFeeResponse,
	WorkerCategoryTypeCode,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { UtilService } from '@app/core/services/util.service';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';

@Component({
	selector: 'app-step-worker-licence-summary-review-update-authenticated',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Application Summary"
					subtitle="Review your information before submitting your application"
				></app-step-title>

				<div class="row">
					<div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row mt-0 mb-4">
							<div class="col-lg-6 col-md-12">
								<div class="text-label d-block text-muted">
									Licence Holder Name <span *ngIf="hasBcscNameChanged">(New Name)</span>
								</div>
								<div class="summary-text-data">{{ licenceHolderName }}</div>
							</div>
							<div class="col-lg-6 col-md-12">
								<div class="text-label d-block text-muted">Licence Number</div>
								<div class="summary-text-data">{{ originalLicenceNumber }}</div>
							</div>
							<div class="col-lg-6 col-md-12" *ngIf="showPhotographOfYourself">
								<div class="text-label d-block text-muted">Photograph of Yourself</div>
								<div class="summary-text-data">
									<ul class="m-0">
										<ng-container *ngFor="let doc of photoOfYourselfAttachments; let i = index">
											<li>{{ doc.name }}</li>
										</ng-container>
									</ul>
								</div>
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
							<div class="col-lg-6 col-md-12" *ngIf="isReprint">
								<div class="text-label d-block text-muted">Reprint Licence</div>
								<div class="summary-text-data">{{ isReprint }}</div>
							</div>
							<div class="col-lg-6 col-md-12" *ngIf="licenceFee">
								<div class="text-label d-block text-muted">Reprint Fee</div>
								<div class="summary-text-data">
									{{ licenceFee | currency : 'CAD' : 'symbol-narrow' : '1.0' | default }}
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
export class StepWorkerLicenceSummaryReviewUpdateAuthenticatedComponent implements OnInit {
	licenceModelData: any = {};
	formalDateFormat = SPD_CONSTANTS.date.formalDateFormat;

	categoryArmouredCarGuardFormGroup: FormGroup = this.licenceApplicationService.categoryArmouredCarGuardFormGroup;
	categoryBodyArmourSalesFormGroup: FormGroup = this.licenceApplicationService.categoryBodyArmourSalesFormGroup;
	categoryClosedCircuitTelevisionInstallerFormGroup: FormGroup =
		this.licenceApplicationService.categoryClosedCircuitTelevisionInstallerFormGroup;
	categoryElectronicLockingDeviceInstallerFormGroup: FormGroup =
		this.licenceApplicationService.categoryElectronicLockingDeviceInstallerFormGroup;
	categoryFireInvestigatorFormGroup: FormGroup = this.licenceApplicationService.categoryFireInvestigatorFormGroup;
	categoryLocksmithFormGroup: FormGroup = this.licenceApplicationService.categoryLocksmithFormGroup;
	categoryPrivateInvestigatorSupFormGroup: FormGroup =
		this.licenceApplicationService.categoryPrivateInvestigatorSupFormGroup;
	categoryPrivateInvestigatorFormGroup: FormGroup = this.licenceApplicationService.categoryPrivateInvestigatorFormGroup;
	categorySecurityAlarmInstallerFormGroup: FormGroup =
		this.licenceApplicationService.categorySecurityAlarmInstallerFormGroup;
	categorySecurityConsultantFormGroup: FormGroup = this.licenceApplicationService.categorySecurityConsultantFormGroup;
	categoryLocksmithSupFormGroup: FormGroup = this.licenceApplicationService.categoryLocksmithSupFormGroup;
	categorySecurityAlarmInstallerSupFormGroup: FormGroup =
		this.licenceApplicationService.categorySecurityAlarmInstallerSupFormGroup;
	categorySecurityAlarmMonitorFormGroup: FormGroup =
		this.licenceApplicationService.categorySecurityAlarmMonitorFormGroup;
	categorySecurityAlarmResponseFormGroup: FormGroup =
		this.licenceApplicationService.categorySecurityAlarmResponseFormGroup;
	categorySecurityAlarmSalesFormGroup: FormGroup = this.licenceApplicationService.categorySecurityAlarmSalesFormGroup;
	categorySecurityGuardFormGroup: FormGroup = this.licenceApplicationService.categorySecurityGuardFormGroup;
	categorySecurityGuardSupFormGroup: FormGroup = this.licenceApplicationService.categorySecurityGuardSupFormGroup;

	constructor(
		private licenceApplicationService: LicenceApplicationService,
		private commonApplicationService: CommonApplicationService,
		private utilService: UtilService
	) {}

	ngOnInit(): void {
		this.licenceModelData = { ...this.licenceApplicationService.licenceModelFormGroup.getRawValue() };
	}

	onUpdateData(): void {
		this.licenceModelData = {
			...this.licenceApplicationService.licenceModelFormGroup.getRawValue(),
		};
	}

	isFormValid(): boolean {
		return true;
	}

	get licenceHolderName(): string {
		return this.utilService.getFullNameWithMiddle(
			this.licenceModelData.personalInformationData.givenName,
			this.licenceModelData.personalInformationData.middleName1,
			this.licenceModelData.personalInformationData.middleName2,
			this.licenceModelData.personalInformationData.surname
		);
	}
	get showPhotographOfYourself(): boolean {
		return this.hasGenderChanged && this.photoOfYourselfAttachments?.length > 0;
	}

	get hasBcscNameChanged(): boolean {
		return this.licenceModelData.personalInformationData.hasBcscNameChanged ?? '';
	}
	get hasGenderChanged(): boolean {
		return this.licenceModelData.personalInformationData.hasGenderChanged ?? '';
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

	get workerLicenceTypeCode(): WorkerLicenceTypeCode | null {
		return this.licenceModelData.workerLicenceTypeData?.workerLicenceTypeCode ?? null;
	}
	get applicationTypeCode(): ApplicationTypeCode | null {
		return this.licenceModelData.applicationTypeData?.applicationTypeCode ?? null;
	}
	get licenceTermCode(): string {
		return this.licenceModelData.licenceTermData.licenceTermCode ?? '';
	}
	get isReprint(): string {
		return this.licenceModelData.reprintLicenceData.reprintLicence ?? '';
	}
	get licenceFee(): number | null {
		if (!this.licenceTermCode || !this.isReprint) {
			return null;
		}

		const originalLicenceData = this.licenceModelData.originalLicenceData;

		const fee = this.commonApplicationService
			.getLicenceTermsAndFees(
				this.workerLicenceTypeCode,
				ApplicationTypeCode.Update,
				originalLicenceData.originalBizTypeCode,
				originalLicenceData.originalLicenceTermCode
			)
			.find((item: LicenceFeeResponse) => item.licenceTermCode == this.licenceTermCode);
		return fee ? fee.amount ?? null : null;
	}

	get photoOfYourselfAttachments(): File[] {
		return this.licenceModelData.photographOfYourselfData.updateAttachments ?? [];
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
