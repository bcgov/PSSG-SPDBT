import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
	ApplicationTypeCode,
	LicenceFeeResponse,
	WorkerCategoryTypeCode,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { ApplicationService } from '@app/core/services/application.service';
import { UtilService } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';

@Component({
	selector: 'app-step-worker-licence-summary-review-update-authenticated',
	template: `
		<app-step-section title="Application Summary" subtitle="Review your information before submitting your application">
			<div class="row">
				<div class="col-xxl-8 col-xl-11 col-lg-12 col-md-12 col-sm-12 mx-auto">
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
						<div class="col-xl-4 col-lg-6 col-md-12" *ngIf="showPhotographOfYourself">
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
								{{ originalExpiryDate | formatDate : formalDateFormat }}
							</div>
						</div>
						<div class="col-xl-4 col-lg-6 col-md-12">
							<div class="text-label d-block text-muted">Licence Categories</div>
							<div class="summary-text-data">
								<ul class="m-0">
									<ng-container *ngFor="let category of categoryList; let i = index">
										<li>{{ category | options : 'WorkerCategoryTypes' }}</li>
									</ng-container>
								</ul>
							</div>
						</div>

						<ng-container *ngIf="showDogsAndRestraints">
							<div class="col-xl-4 col-lg-6 col-md-12">
								<div class="text-label d-block text-muted">Request to Use Restraints?</div>
								<div class="summary-text-data">
									{{ carryAndUseRestraints | options : 'BooleanTypes' }}
								</div>
							</div>
							<ng-container *ngIf="carryAndUseRestraints === booleanTypeCodeYes">
								<div class="col-xl-4 col-lg-6 col-md-12">
									<div class="text-label d-block text-muted">
										{{ carryAndUseRestraintsDocument | options : 'RestraintDocumentTypes' }}
									</div>
									<div class="summary-text-data">
										<ul class="m-0">
											<ng-container *ngFor="let doc of carryAndUseRestraintsAttachments; let i = index">
												<li>{{ doc.name }}</li>
											</ng-container>
										</ul>
									</div>
								</div>
							</ng-container>

							<div class="col-xl-4 col-lg-6 col-md-12">
								<div class="text-label d-block text-muted">Request to Use Dogs?</div>
								<div class="summary-text-data">{{ useDogs }}</div>
							</div>
							<ng-container *ngIf="useDogs === booleanTypeCodeYes">
								<div class="col-xl-4 col-lg-6 col-md-12">
									<div class="text-label d-block text-muted">Reason</div>
									<div class="summary-text-data">
										<div *ngIf="isDogsPurposeProtection">Protection</div>
										<div *ngIf="isDogsPurposeDetectionDrugs">Detection - Drugs</div>
										<div *ngIf="isDogsPurposeDetectionExplosives">Detection - Explosives</div>
									</div>
								</div>
								<div class="col-xl-4 col-lg-6 col-md-12">
									<div class="text-label d-block text-muted">Dog Validation Certificate</div>
									<div class="summary-text-data">
										<ul class="m-0">
											<ng-container *ngFor="let doc of dogsPurposeAttachments; let i = index">
												<li>{{ doc.name }}</li>
											</ng-container>
										</ul>
									</div>
								</div>
							</ng-container>
						</ng-container>

						<div class="col-xl-4 col-lg-6 col-md-12">
							<div class="text-label d-block text-muted">Licence Term</div>
							<div class="summary-text-data">{{ originalLicenceTermCode | options : 'LicenceTermTypes' }}</div>
						</div>
						<div class="col-xl-4 col-lg-6 col-md-12" *ngIf="isReprint">
							<div class="text-label d-block text-muted">Reprint Licence</div>
							<div class="summary-text-data">{{ isReprint }}</div>
						</div>
						<div class="col-xl-4 col-lg-6 col-md-12" *ngIf="licenceFee">
							<div class="text-label d-block text-muted">Reprint Fee</div>
							<div class="summary-text-data">
								{{ licenceFee | currency : 'CAD' : 'symbol-narrow' : '1.0' | default }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
})
export class StepWorkerLicenceSummaryReviewUpdateAuthenticatedComponent implements OnInit {
	licenceModelData: any = {};
	formalDateFormat = SPD_CONSTANTS.date.formalDateFormat;
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
		private commonApplicationService: ApplicationService,
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
	get showPhotographOfYourself(): boolean {
		return this.workerApplicationService.getSummaryshowPhotographOfYourself(this.licenceModelData);
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

	get isReprint(): string {
		return this.workerApplicationService.getSummaryisReprint(this.licenceModelData);
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

	get isSoleProprietor(): string {
		return this.workerApplicationService.getSummaryisSoleProprietor(this.licenceModelData);
	}

	get workerLicenceTypeCode(): WorkerLicenceTypeCode | null {
		return this.workerApplicationService.getSummaryworkerLicenceTypeCode(this.licenceModelData);
	}

	get applicationTypeCode(): ApplicationTypeCode | null {
		return this.workerApplicationService.getSummaryapplicationTypeCode(this.licenceModelData);
	}

	get licenceTermCode(): string {
		return this.workerApplicationService.getSummarylicenceTermCode(this.licenceModelData);
	}

	get carryAndUseRestraints(): string {
		return this.workerApplicationService.getSummarycarryAndUseRestraints(this.licenceModelData);
	}
	get carryAndUseRestraintsDocument(): string {
		return this.workerApplicationService.getSummarycarryAndUseRestraintsDocument(this.licenceModelData);
	}
	get carryAndUseRestraintsAttachments(): File[] {
		return this.workerApplicationService.getSummarycarryAndUseRestraintsAttachments(this.licenceModelData);
	}
	get showDogsAndRestraints(): boolean {
		return this.workerApplicationService.getSummaryshowDogsAndRestraints(this.licenceModelData);
	}
	get useDogs(): string {
		return this.workerApplicationService.getSummaryuseDogs(this.licenceModelData);
	}
	get isDogsPurposeProtection(): string {
		return this.workerApplicationService.getSummaryisDogsPurposeProtection(this.licenceModelData);
	}
	get isDogsPurposeDetectionDrugs(): string {
		return this.workerApplicationService.getSummaryisDogsPurposeDetectionDrugs(this.licenceModelData);
	}
	get isDogsPurposeDetectionExplosives(): string {
		return this.workerApplicationService.getSummaryisDogsPurposeDetectionExplosives(this.licenceModelData);
	}
	get dogsPurposeAttachments(): File[] {
		return this.workerApplicationService.getSummarydogsPurposeAttachments(this.licenceModelData);
	}

	get photoOfYourselfAttachments(): File[] {
		return this.workerApplicationService.getSummaryphotoOfYourselfAttachments(this.licenceModelData);
	}

	get categoryList(): Array<WorkerCategoryTypeCode> {
		return this.workerApplicationService.getSummarycategoryList(this.licenceModelData);
	}
}
