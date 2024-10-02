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
import { WorkerApplicationService } from '@app/core/services/worker-application.service';

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
											<div class="col-lg-4 col-md-12" *ngIf="soleProprietorBizTypeCode">
												<div class="text-label d-block text-muted">Sole Proprietorship Security Business Licence</div>
												<div class="summary-text-data">
													{{ soleProprietorBizTypeCode | options : 'BizTypes' }}
												</div>
											</div>
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
													<div class="col-xl-4 col-lg-6 col-md-12">
														<div class="text-label d-block text-muted">Proof of Qualification</div>
														<div class="summary-text-data">
															{{ carryAndUseRestraintsDocument | options : 'RestraintDocumentTypes' }}
														</div>
													</div>
													<div class="col-xl-4 col-lg-6 col-md-12">
														<div class="text-label d-block text-muted">Proof of Qualification Documents</div>
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

	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	constructor(
		private workerApplicationService: WorkerApplicationService,
		private commonApplicationService: ApplicationService
	) {}

	ngOnInit(): void {
		this.licenceModelData = { ...this.workerApplicationService.workerModelFormGroup.getRawValue() };
	}

	onEditStep(stepNumber: number) {
		this.editStep.emit(stepNumber);
	}

	onUpdateData(): void {
		this.licenceModelData = {
			...this.workerApplicationService.workerModelFormGroup.getRawValue(),
		};
	}

	get isNotRenewal(): boolean {
		return this.applicationTypeCode != ApplicationTypeCode.Renewal;
	}

	get isSoleProprietor(): string {
		return this.workerApplicationService.getSummaryisSoleProprietor(this.licenceModelData);
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
		return this.workerApplicationService.getSummaryworkerLicenceTypeCode(this.licenceModelData);
	}

	get applicationTypeCode(): ApplicationTypeCode | null {
		return this.workerApplicationService.getSummaryapplicationTypeCode(this.licenceModelData);
	}

	get soleProprietorBizTypeCode(): string {
		return this.workerApplicationService.getSummarysoleProprietorBizTypeCode(this.licenceModelData);
	}

	get categoryArmouredCarGuardAttachments(): File[] {
		return this.workerApplicationService.getSummarycategoryArmouredCarGuardAttachments(this.licenceModelData);
	}
	get categoryFireInvestigatorCertificateAttachments(): File[] {
		return this.workerApplicationService.getSummarycategoryFireInvestigatorCertificateAttachments(
			this.licenceModelData
		);
	}
	get categoryFireInvestigatorLetterAttachments(): File[] {
		return this.workerApplicationService.getSummarycategoryFireInvestigatorLetterAttachments(this.licenceModelData);
	}
	get categoryLocksmithAttachments(): File[] {
		return this.workerApplicationService.getSummarycategoryLocksmithAttachments(this.licenceModelData);
	}
	get categorySecurityGuardAttachments(): File[] {
		return this.workerApplicationService.getSummarycategorySecurityGuardAttachments(this.licenceModelData);
	}
	get categorySecurityConsultantAttachments(): File[] {
		return this.workerApplicationService.getSummarycategorySecurityConsultantAttachments(this.licenceModelData);
	}
	get categorySecurityConsultantResumeAttachments(): File[] {
		return this.workerApplicationService.getSummarycategorySecurityConsultantResumeAttachments(this.licenceModelData);
	}
	get categorySecurityAlarmInstallerAttachments(): File[] {
		return this.workerApplicationService.getSummarycategorySecurityAlarmInstallerAttachments(this.licenceModelData);
	}
	get categoryPrivateInvestigatorAttachments(): File[] {
		return this.workerApplicationService.getSummarycategoryPrivateInvestigatorAttachments(this.licenceModelData);
	}
	get categoryPrivateInvestigatorTrainingAttachments(): File[] {
		return this.workerApplicationService.getSummarycategoryPrivateInvestigatorTrainingAttachments(
			this.licenceModelData
		);
	}
	get categoryPrivateInvestigatorFireCertificateAttachments(): File[] {
		return this.workerApplicationService.getSummarycategoryPrivateInvestigatorFireCertificateAttachments(
			this.licenceModelData
		);
	}
	get categoryPrivateInvestigatorFireLetterAttachments(): File[] {
		return this.workerApplicationService.getSummarycategoryPrivateInvestigatorFireLetterAttachments(
			this.licenceModelData
		);
	}
	get categoryPrivateInvestigatorUnderSupervisionAttachments(): File[] {
		return this.workerApplicationService.getSummarycategoryPrivateInvestigatorUnderSupervisionAttachments(
			this.licenceModelData
		);
	}

	get licenceTermCode(): string {
		return this.workerApplicationService.getSummarylicenceTermCode(this.licenceModelData);
	}

	get hasExpiredLicence(): string {
		return this.workerApplicationService.getSummaryhasExpiredLicence(this.licenceModelData);
	}
	get expiredLicenceNumber(): string {
		return this.workerApplicationService.getSummaryexpiredLicenceNumber(this.licenceModelData);
	}
	get expiredLicenceExpiryDate(): string {
		return this.workerApplicationService.getSummaryexpiredLicenceExpiryDate(this.licenceModelData);
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

	get proofOfFingerprintAttachments(): File[] {
		return this.workerApplicationService.getSummaryproofOfFingerprintAttachments(this.licenceModelData);
	}

	get isCanadianCitizen(): string {
		return this.workerApplicationService.getSummaryisCanadianCitizen(this.licenceModelData);
	}
	get canadianCitizenProofTypeCode(): string {
		return this.workerApplicationService.getSummarycanadianCitizenProofTypeCode(this.licenceModelData);
	}
	get notCanadianCitizenProofTypeCode(): string {
		return this.workerApplicationService.getSummarynotCanadianCitizenProofTypeCode(this.licenceModelData);
	}
	get proofOfAbility(): string {
		return this.workerApplicationService.getSummaryproofOfAbility(this.licenceModelData);
	}
	get citizenshipExpiryDate(): string {
		return this.workerApplicationService.getSummarycitizenshipExpiryDate(this.licenceModelData);
	}
	get citizenshipAttachments(): File[] {
		return this.workerApplicationService.getSummarycitizenshipAttachments(this.licenceModelData);
	}
	get governmentIssuedPhotoTypeCode(): string {
		return this.workerApplicationService.getSummarygovernmentIssuedPhotoTypeCode(this.licenceModelData);
	}
	get governmentIssuedPhotoExpiryDate(): string {
		return this.workerApplicationService.getSummarygovernmentIssuedPhotoExpiryDate(this.licenceModelData);
	}
	get governmentIssuedPhotoAttachments(): File[] {
		return this.workerApplicationService.getSummarygovernmentIssuedPhotoAttachments(this.licenceModelData);
	}

	get showAdditionalGovIdData(): boolean {
		return this.workerApplicationService.getSummaryshowAdditionalGovIdData(this.licenceModelData);
	}

	get bcDriversLicenceNumber(): string {
		return this.workerApplicationService.getSummarybcDriversLicenceNumber(this.licenceModelData);
	}

	get hairColourCode(): string {
		return this.workerApplicationService.getSummaryhairColourCode(this.licenceModelData);
	}
	get eyeColourCode(): string {
		return this.workerApplicationService.getSummaryeyeColourCode(this.licenceModelData);
	}
	get height(): string {
		return this.workerApplicationService.getSummaryheight(this.licenceModelData);
	}
	get heightInches(): string {
		return this.workerApplicationService.getSummaryheightInches(this.licenceModelData);
	}
	get heightUnitCode(): string {
		return this.workerApplicationService.getSummaryheightUnitCode(this.licenceModelData);
	}
	get weight(): string {
		return this.workerApplicationService.getSummaryweight(this.licenceModelData);
	}
	get weightUnitCode(): string {
		return this.workerApplicationService.getSummaryweightUnitCode(this.licenceModelData);
	}

	get photoOfYourselfAttachments(): File[] | null {
		return this.workerApplicationService.getSummaryphotoOfYourselfAttachments(this.licenceModelData);
	}

	get categoryList(): Array<WorkerCategoryTypeCode> {
		return this.workerApplicationService.getSummarycategoryList(this.licenceModelData);
	}

	get isAnyDocuments(): boolean {
		return this.workerApplicationService.getSummaryisAnyDocuments(this.licenceModelData);
	}

	get showArmouredCarGuard(): boolean {
		return this.workerApplicationService.getSummaryshowArmouredCarGuard(this.licenceModelData);
	}
	get showFireInvestigator(): boolean {
		return this.workerApplicationService.getSummaryshowFireInvestigator(this.licenceModelData);
	}
	get showLocksmith(): boolean {
		return this.workerApplicationService.getSummaryshowLocksmith(this.licenceModelData);
	}
	get showPrivateInvestigator(): boolean {
		return this.workerApplicationService.getSummaryshowPrivateInvestigator(this.licenceModelData);
	}
	get showPrivateInvestigatorUnderSupervision(): boolean {
		return this.workerApplicationService.getSummaryshowPrivateInvestigatorUnderSupervision(this.licenceModelData);
	}
	get showSecurityAlarmInstaller(): boolean {
		return this.workerApplicationService.getSummaryshowSecurityAlarmInstaller(this.licenceModelData);
	}
	get showSecurityConsultant(): boolean {
		return this.workerApplicationService.getSummaryshowSecurityConsultant(this.licenceModelData);
	}
	get showSecurityGuard(): boolean {
		return this.workerApplicationService.getSummaryshowSecurityGuard(this.licenceModelData);
	}
}
