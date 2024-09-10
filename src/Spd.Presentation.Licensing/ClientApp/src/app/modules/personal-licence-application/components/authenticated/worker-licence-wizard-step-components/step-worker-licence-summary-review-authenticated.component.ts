import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
	ApplicationTypeCode,
	BizTypeCode,
	LicenceFeeResponse,
	WorkerCategoryTypeCode,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { ApplicationService } from '@app/core/services/application.service';
import { LicenceApplicationService } from '@app/core/services/licence-application.service';

@Component({
	selector: 'app-step-worker-licence-summary-review-authenticated',
	template: `
		<app-step-section title="Application Summary" subtitle="Review your information before submitting your application">
			<div class="row">
				<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row mb-3">
						<div class="col-12">
							<mat-accordion multi="true">
								<mat-expansion-panel class="mb-2" [expanded]="true">
									<mat-expansion-panel-header>
										<mat-panel-title class="review-panel-title">
											<mat-toolbar class="d-flex justify-content-between">
												<div class="panel-header">Licence Selection</div>
												<button
													mat-mini-fab
													color="primary"
													class="go-to-step-button"
													matTooltip="Go to Step 1"
													aria-label="Go to Step 1"
													(click)="$event.stopPropagation(); onEditStep(0)"
												>
													<mat-icon>edit</mat-icon>
												</button>
											</mat-toolbar>
										</mat-panel-title>
									</mat-expansion-panel-header>
									<div class="panel-body">
										<div class="text-minor-heading mt-4">Licence Information</div>
										<div class="row mt-0">
											<div class="col-lg-4 col-md-12">
												<div class="text-label d-block text-muted">Licence Type</div>
												<div class="summary-text-data">
													{{ workerLicenceTypeCode | options : 'WorkerLicenceTypes' }}
												</div>
											</div>
											<div class="col-lg-4 col-md-12">
												<div class="text-label d-block text-muted">Application Type</div>
												<div class="summary-text-data">
													{{ applicationTypeCode | options : 'ApplicationTypes' }}
												</div>
											</div>
											<div class="col-lg-4 col-md-12">
												<div class="text-label d-block text-muted">Sole Proprietorship Security Business Licence</div>
												<div class="summary-text-data">{{ isSoleProprietor }}</div>
											</div>
										</div>
										<div class="row mt-0">
											<ng-container
												*ngFor="let category of categoryList; let i = index; let first = first; let last = last"
											>
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted">
														Licence Category <span *ngIf="categoryList.length > 1"> #{{ i + 1 }}</span>
													</div>
													<div class="summary-text-data">
														{{ category | options : 'WorkerCategoryTypes' }}
													</div>
												</div>
											</ng-container>
											<div class="col-lg-4 col-md-12">
												<div class="text-label d-block text-muted">Licence Term</div>
												<div class="summary-text-data">{{ licenceTermCode | options : 'LicenceTermTypes' }}</div>
											</div>
											<div class="col-lg-4 col-md-12">
												<div class="text-label d-block text-muted">Fee</div>
												<div class="summary-text-data">
													{{ licenceFee | currency : 'CAD' : 'symbol-narrow' : '1.0' | default }}
												</div>
											</div>
										</div>

										<ng-container *ngIf="isAnyDocuments">
											<mat-divider class="mt-3 mb-2"></mat-divider>
											<div class="text-minor-heading">Documents Uploaded</div>
											<div class="row mt-0">
												<div class="col-lg-6 col-md-12" *ngIf="showArmouredCarGuard">
													<div class="text-label d-block text-muted">
														{{ categoryTypeCodes.ArmouredCarGuard | options : 'WorkerCategoryTypes' }} Documents
													</div>
													<div class="summary-text-data">
														<ul class="m-0">
															<ng-container *ngFor="let doc of categoryArmouredCarGuardAttachments; let i = index">
																<li>{{ doc.name }}</li>
															</ng-container>
														</ul>
													</div>
												</div>
												<div class="col-lg-6 col-md-12" *ngIf="showFireInvestigator">
													<div class="text-label d-block text-muted">
														{{ categoryTypeCodes.FireInvestigator | options : 'WorkerCategoryTypes' }} Documents
													</div>
													<div class="summary-text-data">
														<ul class="m-0">
															<ng-container
																*ngFor="let doc of categoryFireInvestigatorCertificateAttachments; let i = index"
															>
																<li>{{ doc.name }}</li>
															</ng-container>
														</ul>
														<ul class="m-0">
															<ng-container
																*ngFor="let doc of categoryFireInvestigatorLetterAttachments; let i = index"
															>
																<li>{{ doc.name }}</li>
															</ng-container>
														</ul>
													</div>
												</div>
												<div class="col-lg-6 col-md-12" *ngIf="showLocksmith">
													<div class="text-label d-block text-muted">
														{{ categoryTypeCodes.Locksmith | options : 'WorkerCategoryTypes' }} Documents
													</div>
													<div class="summary-text-data">
														<ul class="m-0">
															<ng-container *ngFor="let doc of categoryLocksmithAttachments; let i = index">
																<li>{{ doc.name }}</li>
															</ng-container>
														</ul>
													</div>
												</div>

												<div class="col-lg-6 col-md-12" *ngIf="showPrivateInvestigator">
													<div class="text-label d-block text-muted">
														{{ categoryTypeCodes.PrivateInvestigator | options : 'WorkerCategoryTypes' }}
														Documents
													</div>
													<div class="summary-text-data">
														<div class="summary-text-data">
															<ul class="m-0">
																<ng-container *ngFor="let doc of categoryPrivateInvestigatorAttachments; let i = index">
																	<li>{{ doc.name }}</li>
																</ng-container>
															</ul>
															<ul class="m-0">
																<ng-container
																	*ngFor="let doc of categoryPrivateInvestigatorTrainingAttachments; let i = index"
																>
																	<li>{{ doc.name }}</li>
																</ng-container>
															</ul>
														</div>
													</div>
												</div>

												<div class="col-lg-6 col-md-12" *ngIf="showPrivateInvestigatorUnderSupervision">
													<div class="text-label d-block text-muted">
														{{
															categoryTypeCodes.PrivateInvestigatorUnderSupervision | options : 'WorkerCategoryTypes'
														}}
														Documents
													</div>
													<div class="summary-text-data">
														<ul class="m-0">
															<ng-container
																*ngFor="
																	let doc of categoryPrivateInvestigatorUnderSupervisionAttachments;
																	let i = index
																"
															>
																<li>{{ doc.name }}</li>
															</ng-container>
														</ul>
													</div>
												</div>

												<div class="col-lg-6 col-md-12" *ngIf="showSecurityAlarmInstaller">
													<div class="text-label d-block text-muted">
														{{ categoryTypeCodes.SecurityAlarmInstaller | options : 'WorkerCategoryTypes' }}
														Documents
													</div>
													<div class="summary-text-data">
														<ul class="m-0">
															<ng-container
																*ngFor="let doc of categorySecurityAlarmInstallerAttachments; let i = index"
															>
																<li>{{ doc.name }}</li>
															</ng-container>
														</ul>
													</div>
												</div>

												<div class="col-lg-6 col-md-12" *ngIf="showSecurityConsultant">
													<div class="text-label d-block text-muted">
														{{ categoryTypeCodes.SecurityConsultant | options : 'WorkerCategoryTypes' }} Documents
													</div>
													<div class="summary-text-data">
														<ul class="m-0">
															<ng-container *ngFor="let doc of categorySecurityConsultantAttachments; let i = index">
																<li>{{ doc.name }}</li>
															</ng-container>
														</ul>
														<ul class="m-0">
															<ng-container
																*ngFor="let doc of categorySecurityConsultantResumeAttachments; let i = index"
															>
																<li>{{ doc.name }}</li>
															</ng-container>
														</ul>
													</div>
												</div>

												<div class="col-lg-6 col-md-12" *ngIf="showSecurityGuard">
													<div class="text-label d-block text-muted">
														{{ categoryTypeCodes.SecurityGuard | options : 'WorkerCategoryTypes' }} Documents
													</div>
													<div class="summary-text-data">
														<ul class="m-0">
															<ng-container *ngFor="let doc of categorySecurityGuardAttachments; let i = index">
																<li>{{ doc.name }}</li>
															</ng-container>
														</ul>
													</div>
												</div>
											</div>
										</ng-container>

										<ng-container *ngIf="hasExpiredLicence === booleanTypeCodes.Yes">
											<mat-divider class="mt-3 mb-2"></mat-divider>
											<div class="text-minor-heading">Expired Licence</div>
											<div class="row mt-0">
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted">Expired Licence Number</div>
													<div class="summary-text-data">{{ expiredLicenceNumber | default }}</div>
												</div>
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted">Expiry Date</div>
													<div class="summary-text-data">
														{{ expiredLicenceExpiryDate | formatDate | default }}
													</div>
												</div>
											</div>
										</ng-container>

										<ng-container *ngIf="showDogsAndRestraints">
											<mat-divider class="mt-3 mb-2"></mat-divider>
											<div class="text-minor-heading">Restraints Authorization</div>
											<div class="row mt-0">
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted">Request to Use Restraints?</div>
													<div class="summary-text-data">
														{{ carryAndUseRestraints | options : 'BooleanTypes' }}
													</div>
												</div>
												<ng-container *ngIf="carryAndUseRestraints === booleanTypeCodes.Yes">
													<div class="col-lg-8 col-md-12">
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
											</div>

											<mat-divider class="mt-3 mb-2"></mat-divider>
											<div class="text-minor-heading">Dogs Authorization</div>
											<div class="row mt-0">
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted">Request to Use Dogs?</div>
													<div class="summary-text-data">{{ useDogs }}</div>
												</div>
												<ng-container *ngIf="useDogs === booleanTypeCodes.Yes">
													<div class="col-lg-4 col-md-12">
														<div class="text-label d-block text-muted">Reason</div>
														<div class="summary-text-data">
															<div *ngIf="isDogsPurposeProtection">Protection</div>
															<div *ngIf="isDogsPurposeDetectionDrugs">Detection - Drugs</div>
															<div *ngIf="isDogsPurposeDetectionExplosives">Detection - Explosives</div>
														</div>
													</div>
													<div class="col-lg-4 col-md-12">
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
											</div>
										</ng-container>
									</div>
								</mat-expansion-panel>

								<mat-expansion-panel class="mb-2" [expanded]="true">
									<mat-expansion-panel-header>
										<mat-panel-title class="review-panel-title">
											<mat-toolbar class="d-flex justify-content-between">
												<div class="panel-header">Identification</div>
												<button
													mat-mini-fab
													color="primary"
													class="go-to-step-button"
													matTooltip="Go to Step 3"
													aria-label="Go to Step 3"
													(click)="$event.stopPropagation(); onEditStep(1)"
												>
													<mat-icon>edit</mat-icon>
												</button>
											</mat-toolbar>
										</mat-panel-title>
									</mat-expansion-panel-header>
									<div class="panel-body">
										<div class="text-minor-heading">Identification</div>
										<div class="row mt-0">
											<div class="col-lg-6 col-md-12">
												<div class="text-label d-block text-muted">Are you a Canadian citizen?</div>
												<div class="summary-text-data">{{ isCanadianCitizen }}</div>
											</div>
											<div class="col-lg-6 col-md-12">
												<div class="text-label d-block text-muted">
													<span *ngIf="canadianCitizenProofTypeCode">
														{{ canadianCitizenProofTypeCode | options : 'ProofOfCanadianCitizenshipTypes' }}
													</span>
													<span *ngIf="notCanadianCitizenProofTypeCode">
														{{ notCanadianCitizenProofTypeCode | options : 'ProofOfAbilityToWorkInCanadaTypes' }}
													</span>
												</div>
												<div class="summary-text-data">
													<ul class="m-0">
														<ng-container *ngFor="let doc of citizenshipAttachments; let i = index">
															<li>{{ doc.name }}</li>
														</ng-container>
													</ul>
												</div>
											</div>
											<div class="col-lg-6 col-md-12" *ngIf="governmentIssuedPhotoTypeCode">
												<div class="text-label d-block text-muted">
													{{ governmentIssuedPhotoTypeCode | options : 'GovernmentIssuedPhotoIdTypes' }}
												</div>
												<div class="summary-text-data">
													<ul class="m-0">
														<ng-container *ngFor="let doc of governmentIssuedPhotoAttachments; let i = index">
															<li>{{ doc.name }}</li>
														</ng-container>
													</ul>
												</div>
											</div>
											<div class="col-lg-6 col-md-12">
												<div class="text-label d-block text-muted">BC Driver's Licence</div>
												<div class="summary-text-data">{{ bcDriversLicenceNumber | default }}</div>
											</div>
											<div class="col-lg-6 col-md-12" *ngIf="isNotRenewal">
												<div class="text-label d-block text-muted">Request for Fingerprinting Form</div>
												<div class="summary-text-data">
													<ul class="m-0">
														<ng-container *ngFor="let doc of proofOfFingerprintAttachments; let i = index">
															<li>{{ doc.name }}</li>
														</ng-container>
													</ul>
												</div>
											</div>
											<div class="col-lg-6 col-md-12" *ngIf="photoOfYourselfAttachments">
												<div class="text-label d-block text-muted">Photograph of Yourself</div>
												<div class="summary-text-data">
													<ul class="m-0">
														<ng-container *ngFor="let doc of photoOfYourselfAttachments; let i = index">
															<li>{{ doc.name }}</li>
														</ng-container>
													</ul>
												</div>
											</div>
										</div>

										<div class="row mt-0">
											<div class="col-lg-3 col-md-12">
												<div class="text-label d-block text-muted">Height</div>
												<div class="summary-text-data">
													{{ height }}
													{{ heightUnitCode | options : 'HeightUnitTypes' }}
													{{ heightInches }}
												</div>
											</div>
											<div class="col-lg-3 col-md-12">
												<div class="text-label d-block text-muted">Weight</div>
												<div class="summary-text-data">
													{{ weight }}
													{{ weightUnitCode | options : 'WeightUnitTypes' }}
												</div>
											</div>
											<div class="col-lg-3 col-md-12">
												<div class="text-label d-block text-muted">Hair Colour</div>
												<div class="summary-text-data">
													{{ hairColourCode | options : 'HairColourTypes' }}
												</div>
											</div>
											<div class="col-lg-3 col-md-12">
												<div class="text-label d-block text-muted">Eye Colour</div>
												<div class="summary-text-data">
													{{ eyeColourCode | options : 'EyeColourTypes' }}
												</div>
											</div>
										</div>
									</div>
								</mat-expansion-panel>
							</mat-accordion>
						</div>
					</div>
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

			.text-minor-heading {
				font-size: 1.1rem !important;
				color: var(--color-primary-light) !important;
				font-weight: 300 !important;
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

			.go-to-step-button {
				width: 35px;
				height: 35px;
			}
		`,
	],
})
export class StepWorkerLicenceSummaryReviewAuthenticatedComponent implements OnInit {
	licenceModelData: any = {};

	booleanTypeCodes = BooleanTypeCode;
	categoryTypeCodes = WorkerCategoryTypeCode;

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

	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	constructor(
		private licenceApplicationService: LicenceApplicationService,
		private commonApplicationService: ApplicationService
	) {}

	ngOnInit(): void {
		this.licenceModelData = { ...this.licenceApplicationService.licenceModelFormGroup.getRawValue() };
	}

	onEditStep(stepNumber: number) {
		this.editStep.emit(stepNumber);
	}

	onUpdateData(): void {
		this.licenceModelData = {
			...this.licenceApplicationService.licenceModelFormGroup.getRawValue(),
		};
	}

	get isNotRenewal(): boolean {
		return this.applicationTypeCode != ApplicationTypeCode.Renewal;
	}

	get isSoleProprietor(): string {
		return this.licenceApplicationService.getSummaryisSoleProprietor(this.licenceModelData);
	}

	get licenceFee(): number | null {
		if (!this.licenceTermCode) {
			return null;
		}

		const originalLicenceData = this.licenceModelData.originalLicenceData;

		let bizTypeCode: BizTypeCode | null = originalLicenceData.originalBizTypeCode;
		if (this.applicationTypeCode === ApplicationTypeCode.New) {
			bizTypeCode = this.licenceModelData.soleProprietorData.bizTypeCode;
		}

		const originalLicenceTermCode = originalLicenceData.originalLicenceTermCode;

		const fee = this.commonApplicationService
			.getLicenceTermsAndFees(
				this.workerLicenceTypeCode,
				this.applicationTypeCode,
				bizTypeCode,
				originalLicenceTermCode
			)
			.find((item: LicenceFeeResponse) => item.licenceTermCode == this.licenceTermCode);
		return fee ? fee.amount ?? null : null;
	}

	get workerLicenceTypeCode(): WorkerLicenceTypeCode | null {
		return this.licenceApplicationService.getSummaryworkerLicenceTypeCode(this.licenceModelData);
	}

	get applicationTypeCode(): ApplicationTypeCode | null {
		return this.licenceApplicationService.getSummaryapplicationTypeCode(this.licenceModelData);
	}

	get soleProprietorBizTypeCode(): string {
		return this.licenceApplicationService.getSummarysoleProprietorBizTypeCode(this.licenceModelData);
	}

	get categoryArmouredCarGuardAttachments(): File[] {
		return this.licenceApplicationService.getSummarycategoryArmouredCarGuardAttachments(this.licenceModelData);
	}
	get categoryFireInvestigatorCertificateAttachments(): File[] {
		return this.licenceApplicationService.getSummarycategoryFireInvestigatorCertificateAttachments(
			this.licenceModelData
		);
	}
	get categoryFireInvestigatorLetterAttachments(): File[] {
		return this.licenceApplicationService.getSummarycategoryFireInvestigatorLetterAttachments(this.licenceModelData);
	}
	get categoryLocksmithAttachments(): File[] {
		return this.licenceApplicationService.getSummarycategoryLocksmithAttachments(this.licenceModelData);
	}
	get categorySecurityGuardAttachments(): File[] {
		return this.licenceApplicationService.getSummarycategorySecurityGuardAttachments(this.licenceModelData);
	}
	get categorySecurityConsultantAttachments(): File[] {
		return this.licenceApplicationService.getSummarycategorySecurityConsultantAttachments(this.licenceModelData);
	}
	get categorySecurityConsultantResumeAttachments(): File[] {
		return this.licenceApplicationService.getSummarycategorySecurityConsultantResumeAttachments(this.licenceModelData);
	}
	get categorySecurityAlarmInstallerAttachments(): File[] {
		return this.licenceApplicationService.getSummarycategorySecurityAlarmInstallerAttachments(this.licenceModelData);
	}
	get categoryPrivateInvestigatorAttachments(): File[] {
		return this.licenceApplicationService.getSummarycategoryPrivateInvestigatorAttachments(this.licenceModelData);
	}
	get categoryPrivateInvestigatorTrainingAttachments(): File[] {
		return this.licenceApplicationService.getSummarycategoryPrivateInvestigatorTrainingAttachments(
			this.licenceModelData
		);
	}
	get categoryPrivateInvestigatorFireCertificateAttachments(): File[] {
		return this.licenceApplicationService.getSummarycategoryPrivateInvestigatorFireCertificateAttachments(
			this.licenceModelData
		);
	}
	get categoryPrivateInvestigatorFireLetterAttachments(): File[] {
		return this.licenceApplicationService.getSummarycategoryPrivateInvestigatorFireLetterAttachments(
			this.licenceModelData
		);
	}
	get categoryPrivateInvestigatorUnderSupervisionAttachments(): File[] {
		return this.licenceApplicationService.getSummarycategoryPrivateInvestigatorUnderSupervisionAttachments(
			this.licenceModelData
		);
	}

	get licenceTermCode(): string {
		return this.licenceApplicationService.getSummarylicenceTermCode(this.licenceModelData);
	}

	get hasExpiredLicence(): string {
		return this.licenceApplicationService.getSummaryhasExpiredLicence(this.licenceModelData);
	}
	get expiredLicenceNumber(): string {
		return this.licenceApplicationService.getSummaryexpiredLicenceNumber(this.licenceModelData);
	}
	get expiredLicenceExpiryDate(): string {
		return this.licenceApplicationService.getSummaryexpiredLicenceExpiryDate(this.licenceModelData);
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

	get proofOfFingerprintAttachments(): File[] {
		return this.licenceApplicationService.getSummaryproofOfFingerprintAttachments(this.licenceModelData);
	}

	get isCanadianCitizen(): string {
		return this.licenceApplicationService.getSummaryisCanadianCitizen(this.licenceModelData);
	}
	get canadianCitizenProofTypeCode(): string {
		return this.licenceApplicationService.getSummarycanadianCitizenProofTypeCode(this.licenceModelData);
	}
	get notCanadianCitizenProofTypeCode(): string {
		return this.licenceApplicationService.getSummarynotCanadianCitizenProofTypeCode(this.licenceModelData);
	}
	get proofOfAbility(): string {
		return this.licenceApplicationService.getSummaryproofOfAbility(this.licenceModelData);
	}
	get citizenshipExpiryDate(): string {
		return this.licenceApplicationService.getSummarycitizenshipExpiryDate(this.licenceModelData);
	}
	get citizenshipAttachments(): File[] {
		return this.licenceApplicationService.getSummarycitizenshipAttachments(this.licenceModelData);
	}
	get governmentIssuedPhotoTypeCode(): string {
		return this.licenceApplicationService.getSummarygovernmentIssuedPhotoTypeCode(this.licenceModelData);
	}
	get governmentIssuedPhotoExpiryDate(): string {
		return this.licenceApplicationService.getSummarygovernmentIssuedPhotoExpiryDate(this.licenceModelData);
	}
	get governmentIssuedPhotoAttachments(): File[] {
		return this.licenceApplicationService.getSummarygovernmentIssuedPhotoAttachments(this.licenceModelData);
	}

	get showAdditionalGovIdData(): boolean {
		return this.licenceApplicationService.getSummaryshowAdditionalGovIdData(this.licenceModelData);
	}

	get bcDriversLicenceNumber(): string {
		return this.licenceApplicationService.getSummarybcDriversLicenceNumber(this.licenceModelData);
	}

	get hairColourCode(): string {
		return this.licenceApplicationService.getSummaryhairColourCode(this.licenceModelData);
	}
	get eyeColourCode(): string {
		return this.licenceApplicationService.getSummaryeyeColourCode(this.licenceModelData);
	}
	get height(): string {
		return this.licenceApplicationService.getSummaryheight(this.licenceModelData);
	}
	get heightInches(): string {
		return this.licenceApplicationService.getSummaryheightInches(this.licenceModelData);
	}
	get heightUnitCode(): string {
		return this.licenceApplicationService.getSummaryheightUnitCode(this.licenceModelData);
	}
	get weight(): string {
		return this.licenceApplicationService.getSummaryweight(this.licenceModelData);
	}
	get weightUnitCode(): string {
		return this.licenceApplicationService.getSummaryweightUnitCode(this.licenceModelData);
	}

	get photoOfYourselfAttachments(): File[] {
		return this.licenceApplicationService.getSummaryphotoOfYourselfAttachments(this.licenceModelData);
	}

	get categoryList(): Array<WorkerCategoryTypeCode> {
		return this.licenceApplicationService.getSummarycategoryList(this.licenceModelData);
	}

	get isAnyDocuments(): boolean {
		return this.licenceApplicationService.getSummaryisAnyDocuments(this.licenceModelData);
	}

	get showArmouredCarGuard(): boolean {
		return this.licenceApplicationService.getSummaryshowArmouredCarGuard(this.licenceModelData);
	}
	get showFireInvestigator(): boolean {
		return this.licenceApplicationService.getSummaryshowFireInvestigator(this.licenceModelData);
	}
	get showLocksmith(): boolean {
		return this.licenceApplicationService.getSummaryshowLocksmith(this.licenceModelData);
	}
	get showPrivateInvestigator(): boolean {
		return this.licenceApplicationService.getSummaryshowPrivateInvestigator(this.licenceModelData);
	}
	get showPrivateInvestigatorUnderSupervision(): boolean {
		return this.licenceApplicationService.getSummaryshowPrivateInvestigatorUnderSupervision(this.licenceModelData);
	}
	get showSecurityAlarmInstaller(): boolean {
		return this.licenceApplicationService.getSummaryshowSecurityAlarmInstaller(this.licenceModelData);
	}
	get showSecurityConsultant(): boolean {
		return this.licenceApplicationService.getSummaryshowSecurityConsultant(this.licenceModelData);
	}
	get showSecurityGuard(): boolean {
		return this.licenceApplicationService.getSummaryshowSecurityGuard(this.licenceModelData);
	}
}
