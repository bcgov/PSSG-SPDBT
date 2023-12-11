import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
	LicenceDocumentTypeCode,
	LicenceFeeResponse,
	PoliceOfficerRoleCode,
	WorkerCategoryTypeCode,
} from 'src/app/api/models';
import { BooleanTypeCode, SelectOptions, WorkerCategoryTypes } from 'src/app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { LicenceApplicationService } from '../../services/licence-application.service';

@Component({
	selector: 'app-step-summary-review-authenticated',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Application Summary"
					subtitle="Review your information before submitting your application"
				></app-step-title>
				<div class="step-container">
					<div class="row">
						<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
							<div class="row mb-3">
								<div class="col-12">
									<mat-accordion multi="true">
										<mat-expansion-panel class="mb-2" [expanded]="true">
											<mat-expansion-panel-header>
												<mat-panel-title class="review-panel-title">
													<mat-toolbar class="d-flex justify-content-between">
														<div class="panel-header fs-4 my-2">Licence Selection</div>
														<button
															mat-mini-fab
															color="primary"
															class="go-to-step-button"
															matTooltip="Go to Step 1"
															aria-label="Go to Step 1"
															(click)="$event.stopPropagation(); onEditStep(1)"
														>
															<mat-icon>edit</mat-icon>
														</button>
													</mat-toolbar>
												</mat-panel-title>
											</mat-expansion-panel-header>
											<div class="panel-body">
												<div class="text-minor-heading mt-4">Licence Information</div>
												<div class="row mt-0">
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Licence Type</div>
														<div class="text-data">
															{{ workerLicenceTypeCode | options : 'WorkerLicenceTypes' }}
														</div>
													</div>
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Application Type</div>
														<div class="text-data">
															{{ applicationTypeCode | options : 'ApplicationTypes' }}
														</div>
													</div>
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">
															Sole Proprietorship Security Business Licence
														</div>
														<div class="text-data">{{ isSoleProprietor }}</div>
													</div>
												</div>
												<div class="row mt-0">
													<ng-container
														*ngFor="let category of categoryList; let i = index; let first = first; let last = last"
													>
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">
																Licence Category <span *ngIf="categoryList.length > 1"> #{{ i + 1 }}</span>
															</div>
															<div class="text-data">
																{{ category.desc }}
															</div>
														</div>
													</ng-container>
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Licence Term</div>
														<div class="text-data">{{ licenceTermCode | options : 'LicenceTermTypes' }}</div>
													</div>
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Fee</div>
														<div class="text-data">
															{{ licenceFee | currency : 'CAD' : 'symbol-narrow' : '1.0' | default }}
														</div>
													</div>
												</div>

												<ng-container *ngIf="isAnyDocuments">
													<mat-divider class="mt-4 mb-2"></mat-divider>
													<div class="text-minor-heading">Documents Uploaded</div>
													<div class="row mt-0">
														<div class="col-lg-6 col-md-12 mt-lg-2" *ngIf="showArmouredCarGuard">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">
																{{ categoryTypeCodes.ArmouredCarGuard | options : 'WorkerCategoryTypes' }} Documents
															</div>
															<div class="text-data">
																<div *ngFor="let doc of categoryArmouredCarGuardAttachments; let i = index">
																	{{ doc.name }}
																</div>
															</div>
														</div>
														<div class="col-lg-6 col-md-12 mt-lg-2" *ngIf="showFireInvestigator">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">
																{{ categoryTypeCodes.FireInvestigator | options : 'WorkerCategoryTypes' }} Documents
															</div>
															<div class="text-data">
																<div *ngFor="let doc of categoryFireInvestigatorCertificateAttachments; let i = index">
																	{{ doc.name }}
																</div>
																<div *ngFor="let doc of categoryFireInvestigatorLetterAttachments; let i = index">
																	{{ doc.name }}
																</div>
															</div>
														</div>
														<div class="col-lg-6 col-md-12 mt-lg-2" *ngIf="showLocksmith">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">
																{{ categoryTypeCodes.Locksmith | options : 'WorkerCategoryTypes' }} Documents
															</div>
															<div class="text-data">
																<div *ngFor="let doc of categoryLocksmithAttachments; let i = index">
																	{{ doc.name }}
																</div>
															</div>
														</div>

														<div class="col-lg-6 col-md-12 mt-lg-2" *ngIf="showPrivateInvestigator">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">
																{{ categoryTypeCodes.PrivateInvestigator | options : 'WorkerCategoryTypes' }}
																Documents
															</div>
															<div class="text-data">
																<div class="text-data">
																	<div *ngFor="let doc of categoryPrivateInvestigatorAttachments; let i = index">
																		{{ doc.name }}
																	</div>

																	<div
																		*ngFor="let doc of categoryPrivateInvestigatorTrainingAttachments; let i = index"
																	>
																		{{ doc.name }}
																	</div>
																</div>
															</div>
														</div>

														<div class="col-lg-6 col-md-12 mt-lg-2" *ngIf="showPrivateInvestigatorUnderSupervision">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">
																{{
																	categoryTypeCodes.PrivateInvestigatorUnderSupervision
																		| options : 'WorkerCategoryTypes'
																}}
																Documents
															</div>
															<div class="text-data">
																<div
																	*ngFor="
																		let doc of categoryPrivateInvestigatorUnderSupervisionAttachments;
																		let i = index
																	"
																>
																	{{ doc.name }}
																</div>
															</div>
														</div>

														<div class="col-lg-6 col-md-12 mt-lg-2" *ngIf="showSecurityAlarmInstaller">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">
																{{ categoryTypeCodes.SecurityAlarmInstaller | options : 'WorkerCategoryTypes' }}
																Documents
															</div>
															<div class="text-data">
																<div *ngFor="let doc of categorySecurityAlarmInstallerAttachments; let i = index">
																	{{ doc.name }}
																</div>
															</div>
														</div>

														<div class="col-lg-6 col-md-12 mt-lg-2" *ngIf="showSecurityConsultant">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">
																{{ categoryTypeCodes.SecurityConsultant | options : 'WorkerCategoryTypes' }} Documents
															</div>
															<div class="text-data">
																<div *ngFor="let doc of categorySecurityConsultantAttachments; let i = index">
																	{{ doc.name }}
																</div>
																<div *ngFor="let doc of categorySecurityConsultantResumeAttachments; let i = index">
																	{{ doc.name }}
																</div>
															</div>
														</div>

														<div class="col-lg-6 col-md-12 mt-lg-2" *ngIf="showSecurityGuard">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">
																{{ categoryTypeCodes.SecurityGuard | options : 'WorkerCategoryTypes' }} Documents
															</div>
															<div class="text-data">
																<div *ngFor="let doc of categorySecurityGuardAttachments; let i = index">
																	{{ doc.name }}
																</div>
															</div>
														</div>
													</div>
												</ng-container>

												<ng-container *ngIf="showDogsAndRestraints">
													<mat-divider class="mt-4 mb-2"></mat-divider>
													<div class="text-minor-heading">Restraints Authorization</div>
													<div class="row mt-0">
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Request to use restraints?</div>
															<div class="text-data">
																{{ carryAndUseRestraints | options : 'BooleanTypes' }}
															</div>
														</div>
														<ng-container *ngIf="carryAndUseRestraints === booleanTypeCodes.Yes">
															<div class="col-lg-8 col-md-12 mt-lg-2">
																<div class="text-label d-block text-muted mt-2 mt-lg-0">
																	{{ carryAndUseRestraintsDocument | options : 'RestraintDocumentTypes' }}
																</div>
																<div class="text-data">
																	<div *ngFor="let doc of carryAndUseRestraintsAttachments; let i = index">
																		{{ doc.name }}
																	</div>
																</div>
															</div>
														</ng-container>
													</div>

													<mat-divider class="mt-4 mb-2"></mat-divider>
													<div class="text-minor-heading">Dogs Authorization</div>
													<div class="row mt-0">
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Request to use dogs?</div>
															<div class="text-data">{{ useDogs }}</div>
														</div>
														<ng-container *ngIf="useDogs === booleanTypeCodes.Yes">
															<div class="col-lg-4 col-md-12 mt-lg-2">
																<div class="text-label d-block text-muted mt-2 mt-lg-0">Reason</div>
																<div class="text-data">
																	<div *ngIf="isDogsPurposeProtection">Protection</div>
																	<div *ngIf="isDogsPurposeDetectionDrugs">Detection - Drugs</div>
																	<div *ngIf="isDogsPurposeDetectionExplosives">Detection - Explosives</div>
																</div>
															</div>
															<div class="col-lg-4 col-md-12 mt-lg-2">
																<div class="text-label d-block text-muted mt-2 mt-lg-0">Dog Validation Certificate</div>
																<div class="text-data">
																	<div *ngFor="let doc of dogsPurposeAttachments; let i = index">
																		{{ doc.name }}
																	</div>
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
														<div class="panel-header fs-4 my-2">Background Information</div>
														<button
															mat-mini-fab
															color="primary"
															class="go-to-step-button"
															matTooltip="Go to Step 2"
															aria-label="Go to Step 2"
															(click)="$event.stopPropagation(); onEditStep(2)"
														>
															<mat-icon>edit</mat-icon>
														</button>
													</mat-toolbar>
												</mat-panel-title>
											</mat-expansion-panel-header>
											<div class="panel-body">
												<div class="text-minor-heading mt-4">Police Background</div>
												<div class="row mt-0">
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">
															Police Officer or Peace Officer Roles
														</div>
														<div class="text-data">{{ isPoliceOrPeaceOfficer }}</div>
													</div>
													<ng-container *ngIf="isPoliceOrPeaceOfficer === booleanTypeCodes.Yes">
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Role</div>
															<div class="text-data">
																<span
																	*ngIf="
																		policeOfficerRoleCode !== policeOfficerRoleCodes.Other;
																		else otherPoliceOfficerRole
																	"
																	>{{ policeOfficerRoleCode | options : 'PoliceOfficerRoleTypes' | default }}</span
																>
																<ng-template #otherPoliceOfficerRole> Other: {{ otherOfficerRole }} </ng-template>
															</div>
														</div>
														<div class="col-lg-4 col-md-12 mt-lg-2" *ngIf="letterOfNoConflictAttachments">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Letter of No Conflict</div>
															<div class="text-data">
																<div *ngFor="let doc of letterOfNoConflictAttachments; let i = index">
																	{{ doc.name }}
																</div>
															</div>
														</div>
													</ng-container>
												</div>
												<mat-divider class="mt-4 mb-2"></mat-divider>

												<div class="text-minor-heading">Mental Health Conditions</div>
												<div class="row mt-0">
													<div class="col-lg-6 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Mental Health Conditions?</div>
														<div class="text-data">{{ isTreatedForMHC }}</div>
													</div>
													<div class="col-lg-6 col-md-12 mt-lg-2" *ngIf="mentalHealthConditionAttachments.length > 0">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Mental Health Condition Form</div>
														<div class="text-data">
															<div *ngFor="let doc of mentalHealthConditionAttachments; let i = index">
																{{ doc.name }}
															</div>
														</div>
													</div>
												</div>
												<mat-divider class="mt-4 mb-2"></mat-divider>

												<div class="text-minor-heading">Criminal History</div>
												<div class="row mt-0">
													<div class="col-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">
															Have you previously been charged or convicted of a crime?
														</div>
														<div class="text-data">{{ hasCriminalHistory }}</div>
													</div>
												</div>
												<mat-divider class="mt-4 mb-2"></mat-divider>

												<div class="text-minor-heading">Fingerprints</div>
												<div class="row mt-0">
													<div class="col-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">
															Request for Fingerprinting Form
														</div>
														<div class="text-data">
															<div *ngFor="let doc of proofOfFingerprintAttachments; let i = index">
																{{ doc.name }}
															</div>
														</div>
													</div>
												</div>
											</div>
										</mat-expansion-panel>

										<mat-expansion-panel class="mb-2" [expanded]="true">
											<mat-expansion-panel-header>
												<mat-panel-title class="review-panel-title">
													<mat-toolbar class="d-flex justify-content-between">
														<div class="panel-header fs-4 my-2">Identification</div>
														<button
															mat-mini-fab
															color="primary"
															class="go-to-step-button"
															matTooltip="Go to Step 3"
															aria-label="Go to Step 3"
															(click)="$event.stopPropagation(); onEditStep(3)"
														>
															<mat-icon>edit</mat-icon>
														</button>
													</mat-toolbar>
												</mat-panel-title>
											</mat-expansion-panel-header>
											<div class="panel-body">
												<div class="text-minor-heading">Identification</div>
												<div class="row mt-0">
													<div class="col-lg-8 col-md-12">
														<div class="row mt-0">
															<div class="col-lg-6 col-md-12 mt-lg-2">
																<div class="text-label d-block text-muted mt-2 mt-lg-0">Were you born in Canada?</div>
																<div class="text-data">{{ isCanadianCitizen }}</div>
															</div>
															<div class="col-lg-6 col-md-12 mt-lg-2">
																<div class="text-label d-block text-muted mt-2 mt-lg-0">
																	<span *ngIf="canadianCitizenProofTypeCode">
																		{{ canadianCitizenProofTypeCode | options : 'ProofOfCanadianCitizenshipTypes' }}
																	</span>
																	<span *ngIf="notCanadianCitizenProofTypeCode">
																		{{
																			notCanadianCitizenProofTypeCode | options : 'ProofOfAbilityToWorkInCanadaTypes'
																		}}
																	</span>
																</div>
																<div class="text-data">
																	<div *ngFor="let doc of attachments; let i = index">
																		{{ doc.name }}
																	</div>
																</div>
															</div>
															<div class="col-lg-6 col-md-12 mt-lg-2">
																<div class="text-label d-block text-muted mt-2 mt-lg-0">BC Driver's Licence</div>
																<div class="text-data">{{ bcDriversLicenceNumber | default }}</div>
															</div>
															<div class="col-lg-6 col-md-12 mt-lg-2">
																<div class="text-label d-block text-muted mt-2 mt-lg-0">
																	{{ governmentIssuedPhotoTypeCode | options : 'GovernmentIssuedPhotoIdTypes' }}
																</div>
																<div class="text-data">
																	<div *ngFor="let doc of governmentIssuedPhotoAttachments; let i = index">
																		{{ doc.name }}
																	</div>
																</div>
															</div>
															<div class="col-lg-6 col-md-12 mt-lg-2">
																<div class="text-label d-block text-muted mt-2 mt-lg-0">Height</div>
																<div class="text-data">
																	{{ height }}
																	{{ heightUnitCode | options : 'HeightUnitTypes' }}
																	{{ heightInches }}
																</div>
															</div>
															<div class="col-lg-6 col-md-12 mt-lg-2">
																<div class="text-label d-block text-muted mt-2 mt-lg-0">Weight</div>
																<div class="text-data">
																	{{ weight }}
																	{{ weightUnitCode | options : 'WeightUnitTypes' }}
																</div>
															</div>
															<div class="col-lg-6 col-md-12 mt-lg-2">
																<div class="text-label d-block text-muted mt-2 mt-lg-0">Hair Colour</div>
																<div class="text-data">
																	{{ hairColourCode | options : 'HairColourTypes' }}
																</div>
															</div>
															<div class="col-lg-6 col-md-12 mt-lg-2">
																<div class="text-label d-block text-muted mt-2 mt-lg-0">Eye Colour</div>
																<div class="text-data">
																	{{ eyeColourCode | options : 'EyeColourTypes' }}
																</div>
															</div>
														</div>
													</div>
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Photograph</div>
														<div class="text-data">
															<img src="/assets/sample-photo.svg" alt="Photo of yourself" />
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
				</div>
			</div>
		</section>
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

			.text-data {
				font-size: 1.1rem !important;
				font-weight: 500 !important;
				color: var(--color-primary);
			}

			.text-label {
				font-size: 0.9rem !important;
			}

			.review-panel-title {
				width: 100%;

				.mat-toolbar {
					background-color: var(--color-primary-lighter) !important;
					color: var(--color-primary-dark) !important;
					padding: 0;

					.panel-header {
						white-space: normal;
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
export class StepSummaryReviewAuthenticatedComponent implements OnInit {
	licenceModelData: any = {};
	licenceUserModelData: any = {};

	constants = SPD_CONSTANTS;
	booleanTypeCodes = BooleanTypeCode;
	policeOfficerRoleCodes = PoliceOfficerRoleCode;
	categoryTypeCodes = WorkerCategoryTypeCode;
	swlCategoryTypes = WorkerCategoryTypes;

	categoryArmouredCarGuardFormGroup: FormGroup =
		this.licenceApplicationAuthenticatedService.categoryArmouredCarGuardFormGroup;
	categoryBodyArmourSalesFormGroup: FormGroup =
		this.licenceApplicationAuthenticatedService.categoryBodyArmourSalesFormGroup;
	categoryClosedCircuitTelevisionInstallerFormGroup: FormGroup =
		this.licenceApplicationAuthenticatedService.categoryClosedCircuitTelevisionInstallerFormGroup;
	categoryElectronicLockingDeviceInstallerFormGroup: FormGroup =
		this.licenceApplicationAuthenticatedService.categoryElectronicLockingDeviceInstallerFormGroup;
	categoryFireInvestigatorFormGroup: FormGroup =
		this.licenceApplicationAuthenticatedService.categoryFireInvestigatorFormGroup;
	categoryLocksmithFormGroup: FormGroup = this.licenceApplicationAuthenticatedService.categoryLocksmithFormGroup;
	categoryPrivateInvestigatorSupFormGroup: FormGroup =
		this.licenceApplicationAuthenticatedService.categoryPrivateInvestigatorSupFormGroup;
	categoryPrivateInvestigatorFormGroup: FormGroup =
		this.licenceApplicationAuthenticatedService.categoryPrivateInvestigatorFormGroup;
	categorySecurityAlarmInstallerFormGroup: FormGroup =
		this.licenceApplicationAuthenticatedService.categorySecurityAlarmInstallerFormGroup;
	categorySecurityConsultantFormGroup: FormGroup =
		this.licenceApplicationAuthenticatedService.categorySecurityConsultantFormGroup;
	categoryLocksmithSupFormGroup: FormGroup = this.licenceApplicationAuthenticatedService.categoryLocksmithSupFormGroup;
	categorySecurityAlarmInstallerSupFormGroup: FormGroup =
		this.licenceApplicationAuthenticatedService.categorySecurityAlarmInstallerSupFormGroup;
	categorySecurityAlarmMonitorFormGroup: FormGroup =
		this.licenceApplicationAuthenticatedService.categorySecurityAlarmMonitorFormGroup;
	categorySecurityAlarmResponseFormGroup: FormGroup =
		this.licenceApplicationAuthenticatedService.categorySecurityAlarmResponseFormGroup;
	categorySecurityAlarmSalesFormGroup: FormGroup =
		this.licenceApplicationAuthenticatedService.categorySecurityAlarmSalesFormGroup;
	categorySecurityGuardFormGroup: FormGroup =
		this.licenceApplicationAuthenticatedService.categorySecurityGuardFormGroup;
	categorySecurityGuardSupFormGroup: FormGroup =
		this.licenceApplicationAuthenticatedService.categorySecurityGuardSupFormGroup;

	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	constructor(private licenceApplicationAuthenticatedService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.licenceModelData = {
			...this.licenceApplicationAuthenticatedService.licenceModelFormGroup.getRawValue(),
		};
	}

	onEditStep(stepNumber: number) {
		this.editStep.emit(stepNumber);
	}

	onUpdateData(): void {
		this.licenceModelData = {
			...this.licenceApplicationAuthenticatedService.licenceModelFormGroup.getRawValue(),
		};
	}

	get workerLicenceTypeCode(): string {
		return this.licenceModelData.workerLicenceTypeData?.workerLicenceTypeCode ?? '';
	}

	get applicationTypeCode(): string {
		return this.licenceModelData.applicationTypeData?.applicationTypeCode ?? '';
	}

	get isSoleProprietor(): string {
		return this.licenceModelData.soleProprietorData?.isSoleProprietor ?? '';
	}

	get categoryArmouredCarGuardAttachments(): File[] {
		return this.licenceModelData.categoryArmouredCarGuardFormGroup.attachments ?? [];
	}
	get categoryFireInvestigatorCertificateAttachments(): File[] {
		return this.licenceModelData.categoryFireInvestigatorFormGroup.fireCourseCertificateAttachments ?? [];
	}
	get categoryFireInvestigatorLetterAttachments(): File[] {
		return this.licenceModelData.categoryFireInvestigatorFormGroup.fireVerificationLetterAttachments ?? [];
	}
	get categoryLocksmithAttachments(): File[] {
		return this.licenceModelData.categoryLocksmithFormGroup.attachments ?? [];
	}
	get categorySecurityGuardAttachments(): File[] {
		return this.licenceModelData.categorySecurityGuardFormGroup.attachments ?? [];
	}
	get categorySecurityConsultantAttachments(): File[] {
		return this.licenceModelData.categorySecurityConsultantFormGroup.attachments ?? [];
	}
	get categorySecurityConsultantResumeAttachments(): File[] {
		return this.licenceModelData.categorySecurityConsultantFormGroup.resumeAttachments ?? [];
	}
	get categorySecurityAlarmInstallerAttachments(): File[] {
		return this.licenceModelData.categorySecurityAlarmInstallerFormGroup.attachments ?? [];
	}
	get categoryPrivateInvestigatorAttachments(): File[] {
		return this.licenceModelData.categoryPrivateInvestigatorFormGroup.attachments ?? [];
	}
	get categoryPrivateInvestigatorTrainingAttachments(): File[] {
		return this.licenceModelData.categoryPrivateInvestigatorFormGroup.trainingAttachments ?? [];
	}
	get categoryPrivateInvestigatorFireCertificateAttachments(): File[] {
		return this.licenceModelData.categoryPrivateInvestigatorFormGroup.fireCourseCertificateAttachments;
	}
	get categoryPrivateInvestigatorFireLetterAttachments(): File[] {
		return this.licenceModelData.categoryPrivateInvestigatorFormGroup.fireVerificationLetterAttachments;
	}
	get categoryPrivateInvestigatorUnderSupervisionAttachments(): File[] {
		return this.licenceModelData.categoryPrivateInvestigatorSupFormGroup.attachments ?? [];
	}

	get licenceTermCode(): string {
		return this.licenceModelData.licenceTermData.licenceTermCode ?? '';
	}
	get licenceFee(): number | null {
		if (!this.licenceTermCode) {
			return null;
		}

		const feeItem = this.licenceApplicationAuthenticatedService.licenceFeeTermCodes.find(
			(item: LicenceFeeResponse) => item.licenceTermCode == this.licenceTermCode
		);
		return feeItem?.amount ?? null;
	}

	get carryAndUseRestraints(): string {
		return this.licenceModelData.restraintsAuthorizationData.carryAndUseRestraints ?? '';
	}
	get carryAndUseRestraintsDocument(): string {
		return this.licenceModelData.restraintsAuthorizationData.carryAndUseRestraintsDocument ?? '';
	}
	get carryAndUseRestraintsAttachments(): File[] {
		return this.licenceModelData.restraintsAuthorizationData.attachments ?? [];
	}
	get showDogsAndRestraints(): boolean {
		return this.licenceModelData.categorySecurityGuardFormGroup.isInclude;
	}
	get useDogs(): string {
		return this.licenceModelData.dogsAuthorizationData.useDogs ?? '';
	}
	get isDogsPurposeProtection(): string {
		return this.licenceModelData.dogsAuthorizationData.dogsPurposeFormGroup.isDogsPurposeProtection ?? false;
	}
	get isDogsPurposeDetectionDrugs(): string {
		return this.licenceModelData.dogsAuthorizationData.dogsPurposeFormGroup.isDogsPurposeDetectionDrugs ?? false;
	}
	get isDogsPurposeDetectionExplosives(): string {
		return this.licenceModelData.dogsAuthorizationData.dogsPurposeFormGroup.isDogsPurposeDetectionExplosives ?? false;
	}
	get dogsPurposeAttachments(): File[] {
		return this.licenceModelData.dogsAuthorizationData.attachments ?? [];
	}

	get isPoliceOrPeaceOfficer(): string {
		return this.licenceModelData.policeBackgroundData.isPoliceOrPeaceOfficer ?? '';
	}
	get policeOfficerRoleCode(): string {
		return this.licenceModelData.policeBackgroundData.policeOfficerRoleCode ?? '';
	}
	get otherOfficerRole(): string {
		return this.licenceModelData.policeBackgroundData.otherOfficerRole ?? '';
	}
	get letterOfNoConflictAttachments(): File[] {
		return this.licenceModelData.policeBackgroundData.attachments ?? [];
	}

	get isTreatedForMHC(): string {
		return this.licenceModelData.mentalHealthConditionsData.isTreatedForMHC ?? '';
	}
	get mentalHealthConditionAttachments(): File[] {
		return this.licenceModelData.mentalHealthConditionsData.attachments ?? [];
	}

	get hasCriminalHistory(): string {
		return this.licenceModelData.criminalHistoryData.hasCriminalHistory ?? '';
	}

	get proofOfFingerprintAttachments(): File[] {
		return this.licenceModelData.fingerprintProofData.attachments ?? [];
	}

	get isCanadianCitizen(): string {
		return this.licenceModelData.citizenshipData.isCanadianCitizen ?? '';
	}
	get canadianCitizenProofTypeCode(): string {
		return this.licenceModelData.citizenshipData.canadianCitizenProofTypeCode ?? '';
	}
	get notCanadianCitizenProofTypeCode(): string {
		return this.licenceModelData.citizenshipData.notCanadianCitizenProofTypeCode ?? '';
	}
	get proofOfAbility(): string {
		return this.licenceModelData.citizenshipData.proofOfAbility ?? '';
	}
	get citizenshipExpiryDate(): string {
		return this.licenceModelData.citizenshipData.expiryDate ?? '';
	}
	get attachments(): File[] {
		return this.licenceModelData.citizenshipData.attachments ?? [];
	}

	get showAdditionalGovIdData(): boolean {
		return (
			(this.licenceModelData.citizenshipData.isCanadianCitizen == BooleanTypeCode.Yes &&
				this.licenceModelData.citizenshipData.canadianCitizenProofTypeCode !=
					LicenceDocumentTypeCode.CanadianPassport) ||
			(this.licenceModelData.citizenshipData.isCanadianCitizen == BooleanTypeCode.No &&
				this.licenceModelData.citizenshipData.notCanadianCitizenProofTypeCode !=
					LicenceDocumentTypeCode.PermanentResidentCard)
		);
	}

	get governmentIssuedPhotoTypeCode(): string {
		if (!this.showAdditionalGovIdData) return '';
		return this.licenceModelData.additionalGovIdData.governmentIssuedPhotoTypeCode ?? '';
	}
	get governmentIssuedPhotoExpiryDate(): string {
		if (!this.showAdditionalGovIdData) return '';
		return this.licenceModelData.additionalGovIdData.expiryDate ?? '';
	}
	get governmentIssuedPhotoAttachments(): File[] {
		if (!this.showAdditionalGovIdData) return [];
		return this.licenceModelData.additionalGovIdData.attachments ?? [];
	}

	get hasBcDriversLicence(): string {
		return this.licenceModelData.bcDriversLicenceData.hasBcDriversLicence ?? '';
	}
	get bcDriversLicenceNumber(): string {
		return this.licenceModelData.bcDriversLicenceData.bcDriversLicenceNumber ?? '';
	}

	get hairColourCode(): string {
		return this.licenceModelData.characteristicsData.hairColourCode ?? '';
	}
	get eyeColourCode(): string {
		return this.licenceModelData.characteristicsData.eyeColourCode ?? '';
	}
	get height(): string {
		return this.licenceModelData.characteristicsData.height ?? '';
	}
	get heightInches(): string {
		return this.licenceModelData.characteristicsData.heightInches ?? '';
	}
	get heightUnitCode(): string {
		return this.licenceModelData.characteristicsData.heightUnitCode ?? '';
	}
	get weight(): string {
		return this.licenceModelData.characteristicsData.weight ?? '';
	}
	get weightUnitCode(): string {
		return this.licenceModelData.characteristicsData.weightUnitCode ?? '';
	}

	get useBcServicesCardPhoto(): string {
		return this.licenceModelData.photographOfYourselfData.useBcServicesCardPhoto ?? '';
	}
	get photoOfYourselfAttachments(): File[] {
		return this.licenceModelData.photographOfYourselfData.attachments ?? [];
	}

	get categoryList(): Array<SelectOptions> {
		const list: Array<SelectOptions> = [];
		if (this.licenceModelData.categoryArmouredCarGuardFormGroup.isInclude) {
			const element = this.swlCategoryTypes.find((item) => item.code == WorkerCategoryTypeCode.ArmouredCarGuard);
			if (element) list.push(element);
		}

		if (this.licenceModelData.categoryBodyArmourSalesFormGroup.isInclude) {
			const element = this.swlCategoryTypes.find((item) => item.code == WorkerCategoryTypeCode.BodyArmourSales);
			if (element) list.push(element);
		}
		if (this.licenceModelData.categoryClosedCircuitTelevisionInstallerFormGroup.isInclude) {
			const element = this.swlCategoryTypes.find(
				(item) => item.code == WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller
			);
			if (element) list.push(element);
		}
		if (this.licenceModelData.categoryElectronicLockingDeviceInstallerFormGroup.isInclude) {
			const element = this.swlCategoryTypes.find(
				(item) => item.code == WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller
			);
			if (element) list.push(element);
		}
		if (this.licenceModelData.categoryFireInvestigatorFormGroup.isInclude) {
			const element = this.swlCategoryTypes.find((item) => item.code == WorkerCategoryTypeCode.FireInvestigator);
			if (element) list.push(element);
		}
		if (this.licenceModelData.categoryLocksmithFormGroup.isInclude) {
			const element = this.swlCategoryTypes.find((item) => item.code == WorkerCategoryTypeCode.Locksmith);
			if (element) list.push(element);
		}
		if (this.licenceModelData.categoryLocksmithSupFormGroup.isInclude) {
			const element = this.swlCategoryTypes.find(
				(item) => item.code == WorkerCategoryTypeCode.LocksmithUnderSupervision
			);
			if (element) list.push(element);
		}
		if (this.licenceModelData.categoryPrivateInvestigatorFormGroup.isInclude) {
			const element = this.swlCategoryTypes.find((item) => item.code == WorkerCategoryTypeCode.PrivateInvestigator);
			if (element) list.push(element);
		}
		if (this.licenceModelData.categoryPrivateInvestigatorSupFormGroup.isInclude) {
			const element = this.swlCategoryTypes.find(
				(item) => item.code == WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision
			);
			if (element) list.push(element);
		}
		if (this.licenceModelData.categorySecurityAlarmInstallerFormGroup.isInclude) {
			const element = this.swlCategoryTypes.find((item) => item.code == WorkerCategoryTypeCode.SecurityAlarmInstaller);
			if (element) list.push(element);
		}
		if (this.licenceModelData.categorySecurityAlarmInstallerSupFormGroup.isInclude) {
			const element = this.swlCategoryTypes.find(
				(item) => item.code == WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision
			);
			if (element) list.push(element);
		}
		if (this.licenceModelData.categorySecurityAlarmMonitorFormGroup.isInclude) {
			const element = this.swlCategoryTypes.find((item) => item.code == WorkerCategoryTypeCode.SecurityAlarmMonitor);
			if (element) list.push(element);
		}
		if (this.licenceModelData.categorySecurityAlarmResponseFormGroup.isInclude) {
			const element = this.swlCategoryTypes.find((item) => item.code == WorkerCategoryTypeCode.SecurityAlarmResponse);
			if (element) list.push(element);
		}
		if (this.licenceModelData.categorySecurityAlarmSalesFormGroup.isInclude) {
			const element = this.swlCategoryTypes.find((item) => item.code == WorkerCategoryTypeCode.SecurityAlarmSales);
			if (element) list.push(element);
		}
		if (this.licenceModelData.categorySecurityConsultantFormGroup.isInclude) {
			const element = this.swlCategoryTypes.find((item) => item.code == WorkerCategoryTypeCode.SecurityConsultant);
			if (element) list.push(element);
		}
		if (this.licenceModelData.categorySecurityGuardFormGroup.isInclude) {
			const element = this.swlCategoryTypes.find((item) => item.code == WorkerCategoryTypeCode.SecurityGuard);
			if (element) list.push(element);
		}
		if (this.licenceModelData.categorySecurityGuardSupFormGroup.isInclude) {
			const element = this.swlCategoryTypes.find(
				(item) => item.code == WorkerCategoryTypeCode.SecurityGuardUnderSupervision
			);
			if (element) list.push(element);
		}

		return list;
	}

	get isAnyDocuments(): boolean {
		return (
			this.showArmouredCarGuard ||
			this.showFireInvestigator ||
			this.showLocksmith ||
			this.showPrivateInvestigator ||
			this.showPrivateInvestigatorUnderSupervision ||
			this.showSecurityAlarmInstaller ||
			this.showSecurityConsultant ||
			this.showSecurityGuard
		);
	}

	get showArmouredCarGuard(): boolean {
		return this.licenceModelData.categoryArmouredCarGuardFormGroup?.isInclude ?? false;
	}
	get showFireInvestigator(): boolean {
		return this.licenceModelData.categoryFireInvestigatorFormGroup?.isInclude ?? false;
	}
	get showLocksmith(): boolean {
		return this.licenceModelData.categoryLocksmithFormGroup?.isInclude ?? false;
	}
	get showPrivateInvestigator(): boolean {
		return this.licenceModelData.categoryPrivateInvestigatorFormGroup?.isInclude ?? false;
	}
	get showPrivateInvestigatorUnderSupervision(): boolean {
		return this.licenceModelData.categoryPrivateInvestigatorSupFormGroup?.isInclude ?? false;
	}
	get showSecurityAlarmInstaller(): boolean {
		return this.licenceModelData.categorySecurityAlarmInstallerFormGroup?.isInclude ?? false;
	}
	get showSecurityConsultant(): boolean {
		return this.licenceModelData.categorySecurityConsultantFormGroup?.isInclude ?? false;
	}
	get showSecurityGuard(): boolean {
		return this.licenceModelData.categorySecurityGuardFormGroup?.isInclude ?? false;
	}
}
