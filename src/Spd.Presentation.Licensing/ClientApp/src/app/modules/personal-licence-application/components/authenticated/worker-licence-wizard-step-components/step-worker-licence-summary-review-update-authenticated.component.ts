import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode, LicenceTermCode, ServiceTypeCode, WorkerCategoryTypeCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { UtilService } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';

@Component({
	selector: 'app-step-worker-licence-summary-review-update-authenticated',
	template: `
		<app-step-section title="Application Summary" subtitle="Review your information before submitting your application">
			<div class="row">
				<div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<mat-accordion multi="true">
						<mat-expansion-panel class="mb-2" [expanded]="true">
							<mat-expansion-panel-header>
								<mat-panel-title class="review-panel-title">
									<mat-toolbar class="d-flex justify-content-between">
										<div class="panel-header">Licence Updates</div>
									</mat-toolbar>
								</mat-panel-title>
							</mat-expansion-panel-header>

							<div class="panel-body">
								<div class="row mt-0 mb-4">
									<div class="col-xl-4 col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">
											Licence Holder Name <span *ngIf="hasBcscNameChanged">(New Name)</span>
										</div>
										<div class="summary-text-data">{{ licenceHolderName }}</div>
									</div>
									<div class="col-xl-4 col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">Licence Number</div>
										<div class="summary-text-data">{{ originalLicenceNumber }}</div>
									</div>
									<div class="col-xl-4 col-lg-6 col-md-12" *ngIf="showPhotographOfYourselfGenderChanged">
										<div class="text-label d-block text-muted">Photograph of Yourself</div>
										<div class="summary-text-data">
											<ul class="m-0">
												<ng-container *ngFor="let doc of photoOfYourselfAttachments; let i = index">
													<li>{{ doc.name }}</li>
												</ng-container>
											</ul>
										</div>
									</div>
									<div class="col-xl-4 col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">Expiry Date</div>
										<div class="summary-text-data">
											{{ originalExpiryDate | formatDate: formalDateFormat }}
										</div>
									</div>

									<div class="col-xl-4 col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">Licence Term</div>
										<div class="summary-text-data">{{ originalLicenceTermCode | options: 'LicenceTermTypes' }}</div>
									</div>
									<div class="col-xl-4 col-lg-6 col-md-12">
										<ng-container *ngIf="isUpdate">
											<div class="text-label d-block text-muted">Reprint Fee</div>
											<div class="summary-text-data">
												{{ licenceFee | currency: 'CAD' : 'symbol-narrow' : '1.0' | default }}
											</div>
										</ng-container>
									</div>
									<div class="col-xl-4 col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">Licence Categories</div>
										<div class="summary-text-data">
											<ul class="m-0">
												<ng-container *ngFor="let category of categoryList; let i = index">
													<li>{{ category | options: 'WorkerCategoryTypes' }}</li>
												</ng-container>
											</ul>
										</div>
									</div>

									<app-worker-summary-dogs-restraints
										[workerModelData]="licenceModelData"
									></app-worker-summary-dogs-restraints>
								</div>
							</div>
						</mat-expansion-panel>
					</mat-accordion>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [
		`
			.mat-expansion-panel {
				border-radius: 0;
			}

			.mat-expansion-panel-header {
				height: unset;
			}

			.panel-body {
				margin-top: 10px;
				margin-bottom: 10px;
			}

			.review-panel-title {
				width: 100%;

				.mat-toolbar {
					background-color: var(--color-primary-lighter) !important;
					color: var(--color-primary-dark) !important;
					padding: 0;

					.panel-header {
						white-space: normal;
						margin-top: 0.5rem !important;
						margin-bottom: 0.5rem !important;
					}
				}
			}
		`,
	],
})
export class StepWorkerLicenceSummaryReviewUpdateAuthenticatedComponent implements OnInit {
	formalDateFormat = SPD_CONSTANTS.date.formalDateFormat;

	licenceModelData: any = {};
	booleanTypeCodeYes = BooleanTypeCode.Yes;

	categoryArmouredCarGuardFormGroup: FormGroup = this.workerApplicationService.categoryArmouredCarGuardFormGroup;
	categoryBodyArmourSalesFormGroup: FormGroup = this.workerApplicationService.categoryBodyArmourSalesFormGroup;
	categoryClosedCircuitTelevisionInstallerFormGroup: FormGroup =
		this.workerApplicationService.categoryClosedCircuitTelevisionInstallerFormGroup;
	categoryElectronicLockingDeviceInstallerFormGroup: FormGroup =
		this.workerApplicationService.categoryElectronicLockingDeviceInstallerFormGroup;
	categoryFireInvestigatorFormGroup: FormGroup = this.workerApplicationService.categoryFireInvestigatorFormGroup;
	categoryLocksmithFormGroup: FormGroup = this.workerApplicationService.categoryLocksmithFormGroup;
	categoryPrivateInvestigatorSupFormGroup: FormGroup =
		this.workerApplicationService.categoryPrivateInvestigatorSupFormGroup;
	categoryPrivateInvestigatorFormGroup: FormGroup = this.workerApplicationService.categoryPrivateInvestigatorFormGroup;
	categorySecurityAlarmInstallerFormGroup: FormGroup =
		this.workerApplicationService.categorySecurityAlarmInstallerFormGroup;
	categorySecurityConsultantFormGroup: FormGroup = this.workerApplicationService.categorySecurityConsultantFormGroup;
	categoryLocksmithSupFormGroup: FormGroup = this.workerApplicationService.categoryLocksmithSupFormGroup;
	categorySecurityAlarmInstallerSupFormGroup: FormGroup =
		this.workerApplicationService.categorySecurityAlarmInstallerSupFormGroup;
	categorySecurityAlarmMonitorFormGroup: FormGroup =
		this.workerApplicationService.categorySecurityAlarmMonitorFormGroup;
	categorySecurityAlarmResponseFormGroup: FormGroup =
		this.workerApplicationService.categorySecurityAlarmResponseFormGroup;
	categorySecurityAlarmSalesFormGroup: FormGroup = this.workerApplicationService.categorySecurityAlarmSalesFormGroup;
	categorySecurityGuardFormGroup: FormGroup = this.workerApplicationService.categorySecurityGuardFormGroup;
	categorySecurityGuardSupFormGroup: FormGroup = this.workerApplicationService.categorySecurityGuardSupFormGroup;

	constructor(
		private workerApplicationService: WorkerApplicationService,
		private commonApplicationService: CommonApplicationService,
		private utilService: UtilService
	) {}

	ngOnInit(): void {
		this.licenceModelData = { ...this.workerApplicationService.workerModelFormGroup.getRawValue() };
	}

	onUpdateData(): void {
		this.licenceModelData = {
			...this.workerApplicationService.workerModelFormGroup.getRawValue(),
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
	get showPhotographOfYourselfGenderChanged(): boolean {
		return this.workerApplicationService.getSummaryshowPhotographOfYourselfGenderChanged(this.licenceModelData);
	}

	get hasBcscNameChanged(): boolean {
		return this.workerApplicationService.getSummaryhasBcscNameChanged(this.licenceModelData);
	}
	get hasGenderChanged(): boolean {
		return this.workerApplicationService.getSummaryhasGenderChanged(this.licenceModelData);
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

	get isUpdate(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Update;
	}
	get licenceFee(): number | null {
		if (!this.originalLicenceTermCode && !this.isUpdate) {
			return null;
		}

		const originalLicenceData = this.licenceModelData.originalLicenceData;

		const fee = this.commonApplicationService.getLicenceFee(
			this.serviceTypeCode,
			ApplicationTypeCode.Update,
			originalLicenceData.originalBizTypeCode,
			originalLicenceData.originalLicenceTermCode,
			originalLicenceData.originalLicenceTermCode
		);
		return fee ? (fee.amount ?? null) : null;
	}

	get isSoleProprietor(): string {
		return this.workerApplicationService.getSummaryisSoleProprietor(this.licenceModelData);
	}

	get serviceTypeCode(): ServiceTypeCode | null {
		return this.workerApplicationService.getSummaryserviceTypeCode(this.licenceModelData);
	}

	get applicationTypeCode(): ApplicationTypeCode | null {
		return this.workerApplicationService.getSummaryapplicationTypeCode(this.licenceModelData);
	}

	get licenceTermCode(): LicenceTermCode | null {
		return this.workerApplicationService.getSummarylicenceTermCode(this.licenceModelData);
	}

	get photoOfYourselfAttachments(): File[] {
		return this.workerApplicationService.getSummaryphotoOfYourselfAttachments(this.licenceModelData) ?? [];
	}

	get categoryList(): Array<WorkerCategoryTypeCode> {
		return this.workerApplicationService.getSummarycategoryList(this.licenceModelData);
	}
}
