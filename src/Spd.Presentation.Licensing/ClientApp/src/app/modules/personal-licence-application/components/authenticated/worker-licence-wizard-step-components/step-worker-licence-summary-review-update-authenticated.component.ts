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
import { LicenceApplicationService } from '@app/core/services/licence-application.service';
import { UtilService } from '@app/core/services/util.service';

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
								<div class="text-label d-block text-muted">Request to use restraints?</div>
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
								<div class="text-label d-block text-muted">Request to use dogs?</div>
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
		private commonApplicationService: ApplicationService,
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
		return this.licenceApplicationService.getSummaryshowPhotographOfYourself(this.licenceModelData);
	}

	get hasBcscNameChanged(): boolean {
		return this.licenceApplicationService.getSummaryhasBcscNameChanged(this.licenceModelData);
	}
	get hasGenderChanged(): boolean {
		return this.licenceApplicationService.getSummaryhasGenderChanged(this.licenceModelData);
	}
	get originalLicenceNumber(): string {
		return this.licenceApplicationService.getSummaryoriginalLicenceNumber(this.licenceModelData);
	}
	get originalExpiryDate(): string {
		return this.licenceApplicationService.getSummaryoriginalExpiryDate(this.licenceModelData);
	}
	get originalLicenceTermCode(): string {
		return this.licenceApplicationService.getSummaryoriginalLicenceTermCode(this.licenceModelData);
	}

	get isReprint(): string {
		return this.licenceApplicationService.getSummaryisReprint(this.licenceModelData);
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
		return this.licenceApplicationService.getSummaryisSoleProprietor(this.licenceModelData);
	}

	get workerLicenceTypeCode(): WorkerLicenceTypeCode | null {
		return this.licenceApplicationService.getSummaryworkerLicenceTypeCode(this.licenceModelData);
	}

	get applicationTypeCode(): ApplicationTypeCode | null {
		return this.licenceApplicationService.getSummaryapplicationTypeCode(this.licenceModelData);
	}

	get licenceTermCode(): string {
		return this.licenceApplicationService.getSummarylicenceTermCode(this.licenceModelData);
	}

	get carryAndUseRestraints(): string {
		return this.licenceApplicationService.getSummarycarryAndUseRestraints(this.licenceModelData);
	}
	get carryAndUseRestraintsDocument(): string {
		return this.licenceApplicationService.getSummarycarryAndUseRestraintsDocument(this.licenceModelData);
	}
	get carryAndUseRestraintsAttachments(): File[] {
		return this.licenceApplicationService.getSummarycarryAndUseRestraintsAttachments(this.licenceModelData);
	}
	get showDogsAndRestraints(): boolean {
		return this.licenceApplicationService.getSummaryshowDogsAndRestraints(this.licenceModelData);
	}
	get useDogs(): string {
		return this.licenceApplicationService.getSummaryuseDogs(this.licenceModelData);
	}
	get isDogsPurposeProtection(): string {
		return this.licenceApplicationService.getSummaryisDogsPurposeProtection(this.licenceModelData);
	}
	get isDogsPurposeDetectionDrugs(): string {
		return this.licenceApplicationService.getSummaryisDogsPurposeDetectionDrugs(this.licenceModelData);
	}
	get isDogsPurposeDetectionExplosives(): string {
		return this.licenceApplicationService.getSummaryisDogsPurposeDetectionExplosives(this.licenceModelData);
	}
	get dogsPurposeAttachments(): File[] {
		return this.licenceApplicationService.getSummarydogsPurposeAttachments(this.licenceModelData);
	}

	get photoOfYourselfAttachments(): File[] {
		return this.licenceApplicationService.getSummaryphotoOfYourselfAttachments(this.licenceModelData);
	}

	get categoryList(): Array<WorkerCategoryTypeCode> {
		return this.licenceApplicationService.getSummarycategoryList(this.licenceModelData);
	}
}
