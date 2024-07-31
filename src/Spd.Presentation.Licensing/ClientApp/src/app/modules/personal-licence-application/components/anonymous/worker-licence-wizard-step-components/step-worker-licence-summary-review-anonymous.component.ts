import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
	ApplicationTypeCode,
	BizTypeCode,
	LicenceDocumentTypeCode,
	LicenceFeeResponse,
	PoliceOfficerRoleCode,
	WorkerCategoryTypeCode,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { BooleanTypeCode, WorkerCategoryTypes } from '@app/core/code-types/model-desc.models';
import { LicenceApplicationService } from '@app/modules/personal-licence-application/licence-application.service';
import { CommonApplicationService } from '@app/shared/services/common-application.service';

@Component({
	selector: 'app-step-worker-licence-summary-review-anonymous',
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
											<ng-container *ngIf="applicationTypeCode !== applicationTypeCodes.Update">
												<div class="col-lg-4 col-md-12" *ngIf="soleProprietorBizTypeCode">
													<div class="text-label d-block text-muted">Sole Proprietorship Security Business Licence</div>
													<div class="summary-text-data">
														{{ soleProprietorBizTypeCode | options : 'BizTypes' }}
													</div>
												</div>
											</ng-container>

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
													<div class="text-label d-block text-muted">Request to Use Restraints</div>
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
													<div class="text-label d-block text-muted">Request to Use Dogs</div>
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
												<div class="panel-header">Background Information</div>
												<button
													mat-mini-fab
													color="primary"
													class="go-to-step-button"
													matTooltip="Go to Step 2"
													aria-label="Go to Step 2"
													(click)="$event.stopPropagation(); onEditStep(1)"
												>
													<mat-icon>edit</mat-icon>
												</button>
											</mat-toolbar>
										</mat-panel-title>
									</mat-expansion-panel-header>
									<div class="panel-body">
										<div class="text-minor-heading mt-4">Police Background</div>
										<div class="row mt-0">
											<div class="col-lg-4 col-md-12">
												<div class="text-label d-block text-muted">Police Officer or Peace Officer Roles</div>
												<div class="summary-text-data">{{ isPoliceOrPeaceOfficer }}</div>
											</div>
											<ng-container *ngIf="isPoliceOrPeaceOfficer === booleanTypeCodes.Yes">
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted">Role</div>
													<div class="summary-text-data">
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
												<div class="col-lg-4 col-md-12" *ngIf="letterOfNoConflictAttachments">
													<div class="text-label d-block text-muted">Letter of No Conflict</div>
													<div class="summary-text-data">
														<ul class="m-0">
															<ng-container *ngFor="let doc of letterOfNoConflictAttachments; let i = index">
																<li>{{ doc.name }}</li>
															</ng-container>
														</ul>
													</div>
												</div>
											</ng-container>
										</div>
										<mat-divider class="mt-3 mb-2"></mat-divider>

										<div class="text-minor-heading">Mental Health Conditions</div>
										<div class="row mt-0">
											<div class="col-lg-6 col-md-12">
												<div class="text-label d-block text-muted">Mental Health Conditions</div>
												<div class="summary-text-data">{{ isTreatedForMHC }}</div>
											</div>
											<div class="col-lg-6 col-md-12" *ngIf="mentalHealthConditionAttachments.length > 0">
												<div class="text-label d-block text-muted">Mental Health Condition Form</div>
												<div class="summary-text-data">
													<ul class="m-0">
														<ng-container *ngFor="let doc of mentalHealthConditionAttachments; let i = index">
															<li>{{ doc.name }}</li>
														</ng-container>
													</ul>
												</div>
											</div>
										</div>
										<mat-divider class="mt-3 mb-2"></mat-divider>

										<div class="text-minor-heading">Criminal History</div>
										<div class="row mt-0">
											<div class="col-12">
												<div class="text-label d-block text-muted">{{ criminalHistoryLabel }}</div>
												<div class="summary-text-data">{{ hasCriminalHistory }}</div>
											</div>
											<div class="col-12" *ngIf="criminalChargeDescription">
												<div class="text-label d-block text-muted">Description of New Charges or Convictions</div>
												<div class="summary-text-data">{{ criminalChargeDescription }}</div>
											</div>
										</div>
										<ng-container *ngIf="applicationTypeCode !== applicationTypeCodes.Update">
											<mat-divider class="mt-3 mb-2"></mat-divider>

											<div class="text-minor-heading">Fingerprints</div>
											<div class="row mt-0">
												<div class="col-12">
													<div class="text-label d-block text-muted">Request for Fingerprinting Form</div>
													<div class="summary-text-data">
														<ul class="m-0">
															<ng-container *ngFor="let doc of proofOfFingerprintAttachments; let i = index">
																<li>{{ doc.name }}</li>
															</ng-container>
														</ul>
													</div>
												</div>
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
													(click)="$event.stopPropagation(); onEditStep(2)"
												>
													<mat-icon>edit</mat-icon>
												</button>
											</mat-toolbar>
										</mat-panel-title>
									</mat-expansion-panel-header>
									<div class="panel-body">
										<div class="text-minor-heading mt-4">Personal Information</div>
										<div class="row mt-0">
											<div class="col-lg-6 col-md-12">
												<div class="text-label d-block text-muted">Applicant Name</div>
												<div class="summary-text-data">
													{{ givenName }} {{ middleName1 }} {{ middleName2 }}
													{{ surname }}
												</div>
											</div>
											<div class="col-lg-3 col-md-12">
												<div class="text-label d-block text-muted">Date of Birth</div>
												<div class="summary-text-data">
													{{ dateOfBirth | formatDate | default }}
												</div>
											</div>
											<div class="col-lg-3 col-md-12">
												<div class="text-label d-block text-muted">Sex</div>
												<div class="summary-text-data">
													{{ genderCode | options : 'GenderTypes' | default }}
												</div>
											</div>
										</div>

										<ng-container *ngIf="applicationTypeCode !== applicationTypeCodes.Update">
											<mat-divider class="mt-3 mb-2"></mat-divider>

											<div class="text-minor-heading">Aliases</div>
											<div class="row mt-0">
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted">Previous Names or Aliases</div>
													<div class="summary-text-data">{{ previousNameFlag }}</div>
												</div>
												<div class="col-lg-4 col-md-12">
													<ng-container *ngIf="previousNameFlag === booleanTypeCodes.Yes">
														<div class="text-label d-block text-muted">Alias Name(s)</div>
														<div class="summary-text-data">
															<div
																*ngFor="let alias of aliases; let i = index; let first = first"
																[ngClass]="first ? 'mt-lg-0' : 'mt-lg-2'"
															>
																{{ alias.givenName }} {{ alias.middleName1 }} {{ alias.middleName2 }}
																{{ alias.surname }}
															</div>
														</div>
													</ng-container>
												</div>
											</div>
										</ng-container>

										<ng-container *ngIf="applicationTypeCode !== applicationTypeCodes.Update">
											<mat-divider class="mt-3 mb-2"></mat-divider>

											<div class="text-minor-heading">Identification</div>
											<div class="row mt-0">
												<div class="col-lg-6 col-md-12">
													<div class="text-label d-block text-muted">Canadian Citizen?</div>
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

												<div class="col-lg-6 col-md-12">
													<div class="text-label d-block text-muted">BC Driver's Licence</div>
													<div class="summary-text-data">{{ bcDriversLicenceNumber | default }}</div>
												</div>
											</div>
										</ng-container>
										<mat-divider class="mt-3 mb-2"></mat-divider>

										<div class="text-minor-heading">Characteristics</div>
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

								<mat-expansion-panel class="mb-2" [expanded]="true">
									<mat-expansion-panel-header>
										<mat-panel-title class="review-panel-title">
											<mat-toolbar class="d-flex justify-content-between">
												<div class="panel-header">Contact Information</div>
												<button
													mat-mini-fab
													color="primary"
													class="go-to-step-button"
													matTooltip="Go to Step 3"
													aria-label="Go to Step 3"
													(click)="$event.stopPropagation(); onEditStep(99)"
												>
													<mat-icon>edit</mat-icon>
												</button>
											</mat-toolbar>
										</mat-panel-title>
									</mat-expansion-panel-header>
									<div class="panel-body">
										<div class="text-minor-heading mt-4">Contact</div>
										<div class="row mt-0">
											<div class="col-lg-4 col-md-12">
												<div class="text-label d-block text-muted">Email Address</div>
												<div class="summary-text-data">{{ emailAddress | default }}</div>
											</div>
											<div class="col-lg-4 col-md-12">
												<div class="text-label d-block text-muted">Phone Number</div>
												<div class="summary-text-data">
													{{ phoneNumber | formatPhoneNumber }}
												</div>
											</div>
										</div>
										<mat-divider class="mt-3 mb-2"></mat-divider>

										<div class="text-minor-heading">Residential Address</div>
										<div class="row mt-0">
											<div class="col-lg-4 col-md-12">
												<div class="text-label d-block text-muted">Address Line 1</div>
												<div class="summary-text-data">{{ residentialAddressLine1 | default }}</div>
											</div>
											<div class="col-lg-4 col-md-12">
												<div class="text-label d-block text-muted">Address Line 2</div>
												<div class="summary-text-data">{{ residentialAddressLine2 | default }}</div>
											</div>
											<div class="col-lg-4 col-md-12">
												<div class="text-label d-block text-muted">City</div>
												<div class="summary-text-data">{{ residentialCity | default }}</div>
											</div>
											<div class="col-lg-4 col-md-12">
												<div class="text-label d-block text-muted">Postal Code</div>
												<div class="summary-text-data">{{ residentialPostalCode | default }}</div>
											</div>
											<div class="col-lg-4 col-md-12">
												<div class="text-label d-block text-muted">Province</div>
												<div class="summary-text-data">
													{{ residentialProvince | default }}
												</div>
											</div>
											<div class="col-lg-4 col-md-12">
												<div class="text-label d-block text-muted">Country</div>
												<div class="summary-text-data">
													{{ residentialCountry | default }}
												</div>
											</div>
										</div>
										<mat-divider class="mt-3 mb-2"></mat-divider>

										<div class="text-minor-heading">Mailing Address</div>
										<ng-container *ngIf="isAddressTheSame; else mailingIsDifferentThanResidential">
											<div class="row mt-0">
												<div class="col-12">
													<div class="summary-text-data">Mailing address is the same as the residential address</div>
												</div>
											</div>
										</ng-container>
										<ng-template #mailingIsDifferentThanResidential>
											<div class="row mt-0">
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted">Address Line 1</div>
													<div class="summary-text-data">{{ mailingAddressLine1 | default }}</div>
												</div>
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted">Address Line 2</div>
													<div class="summary-text-data">{{ mailingAddressLine2 | default }}</div>
												</div>
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted">City</div>
													<div class="summary-text-data">{{ mailingCity | default }}</div>
												</div>
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted">Postal Code</div>
													<div class="summary-text-data">{{ mailingPostalCode | default }}</div>
												</div>
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted">Province</div>
													<div class="summary-text-data">{{ mailingProvince | default }}</div>
												</div>
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted">Country</div>
													<div class="summary-text-data">{{ mailingCountry | default }}</div>
												</div>
											</div>
										</ng-template>
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
						line-height: normal;
						font-size: 1em;
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
export class StepWorkerLicenceSummaryReviewAnonymousComponent implements OnInit {
	licenceModelData: any = {};

	booleanTypeCodes = BooleanTypeCode;
	policeOfficerRoleCodes = PoliceOfficerRoleCode;
	categoryTypeCodes = WorkerCategoryTypeCode;
	swlCategoryTypes = WorkerCategoryTypes;
	applicationTypeCodes = ApplicationTypeCode;

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
		private commonApplicationService: CommonApplicationService
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

	get workerLicenceTypeCode(): WorkerLicenceTypeCode | null {
		return this.licenceModelData.workerLicenceTypeData?.workerLicenceTypeCode ?? null;
	}

	get applicationTypeCode(): ApplicationTypeCode | null {
		return this.licenceModelData.applicationTypeData?.applicationTypeCode ?? null;
	}

	get soleProprietorBizTypeCode(): string {
		const isSoleProprietor = this.licenceModelData.soleProprietorData.isSoleProprietor === BooleanTypeCode.Yes;
		return isSoleProprietor ? this.licenceModelData.soleProprietorData?.bizTypeCode : '';
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

		const originalLicenceData = this.licenceModelData.originalLicenceData;

		let bizTypeCode: BizTypeCode | null = originalLicenceData.originalBizTypeCode;
		if (this.applicationTypeCode === ApplicationTypeCode.New) {
			bizTypeCode = this.licenceModelData.soleProprietorData.bizTypeCode;
		}

		const fee = this.commonApplicationService
			.getLicenceTermsAndFees(
				this.workerLicenceTypeCode,
				this.applicationTypeCode,
				bizTypeCode,
				originalLicenceData.originalLicenceTermCode
			)
			.find((item: LicenceFeeResponse) => item.licenceTermCode == this.licenceTermCode);
		return fee ? fee.amount ?? null : null;
	}

	get hasExpiredLicence(): string {
		return this.licenceModelData.expiredLicenceData.hasExpiredLicence ?? '';
	}
	get expiredLicenceNumber(): string {
		return this.licenceModelData.expiredLicenceData.expiredLicenceNumber ?? '';
	}
	get expiredLicenceExpiryDate(): string {
		return this.licenceModelData.expiredLicenceData.expiredLicenceExpiryDate ?? '';
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

	get givenName(): string {
		return this.licenceModelData.personalInformationData.givenName ?? '';
	}
	get middleName1(): string {
		return this.licenceModelData.personalInformationData.middleName1 ?? '';
	}
	get middleName2(): string {
		return this.licenceModelData.personalInformationData.middleName2 ?? '';
	}
	get surname(): string {
		return this.licenceModelData.personalInformationData.surname ?? '';
	}
	get genderCode(): string {
		return this.licenceModelData.personalInformationData.genderCode ?? '';
	}
	get dateOfBirth(): string {
		return this.licenceModelData.personalInformationData.dateOfBirth ?? '';
	}

	get previousNameFlag(): string {
		return this.licenceModelData.aliasesData.previousNameFlag ?? '';
	}
	get aliases(): Array<any> {
		return this.licenceModelData.aliasesData.aliases ?? [];
	}

	get isTreatedForMHC(): string {
		return this.licenceModelData.mentalHealthConditionsData.isTreatedForMHC ?? '';
	}
	get mentalHealthConditionAttachments(): File[] {
		return this.licenceModelData.mentalHealthConditionsData.attachments ?? [];
	}

	get criminalHistoryLabel(): string {
		if (
			this.applicationTypeCode === ApplicationTypeCode.Update ||
			this.applicationTypeCode === ApplicationTypeCode.Renewal
		) {
			return 'New Criminal Charges or Convictions';
		} else {
			return 'Previously been Charged or Convicted of a Crime';
		}
	}
	get hasCriminalHistory(): string {
		return this.licenceModelData.criminalHistoryData.hasCriminalHistory ?? '';
	}
	get criminalChargeDescription(): string {
		return this.applicationTypeCode === ApplicationTypeCode.Update && this.hasCriminalHistory === BooleanTypeCode.Yes
			? this.licenceModelData.criminalHistoryData.criminalChargeDescription
			: '';
	}

	get proofOfFingerprintAttachments(): File[] {
		return this.licenceModelData.fingerprintProofData.attachments ?? [];
	}

	get isCanadianCitizen(): string {
		return this.licenceModelData.citizenshipData.isCanadianCitizen ?? '';
	}
	get canadianCitizenProofTypeCode(): string {
		return this.licenceModelData.citizenshipData.isCanadianCitizen === BooleanTypeCode.Yes
			? this.licenceModelData.citizenshipData.canadianCitizenProofTypeCode ?? ''
			: '';
	}
	get notCanadianCitizenProofTypeCode(): string {
		return this.licenceModelData.citizenshipData.isCanadianCitizen === BooleanTypeCode.No
			? this.licenceModelData.citizenshipData.notCanadianCitizenProofTypeCode ?? ''
			: '';
	}
	get proofOfAbility(): string {
		return this.licenceModelData.citizenshipData.proofOfAbility ?? '';
	}
	get citizenshipExpiryDate(): string {
		return this.licenceModelData.citizenshipData.expiryDate ?? '';
	}
	get citizenshipAttachments(): File[] {
		return this.licenceModelData.citizenshipData.attachments ?? [];
	}
	get governmentIssuedPhotoTypeCode(): string {
		return this.showAdditionalGovIdData ? this.licenceModelData.citizenshipData.governmentIssuedPhotoTypeCode : '';
	}
	get governmentIssuedPhotoExpiryDate(): string {
		return this.showAdditionalGovIdData ? this.licenceModelData.citizenshipData.governmentIssuedExpiryDate : '';
	}
	get governmentIssuedPhotoAttachments(): File[] {
		return this.showAdditionalGovIdData ? this.licenceModelData.citizenshipData.governmentIssuedAttachments : [];
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

	get photoOfYourselfAttachments(): File[] {
		if (this.applicationTypeCode === ApplicationTypeCode.New) {
			return this.licenceModelData.photographOfYourselfData.attachments ?? [];
		} else {
			const updatePhoto = this.licenceModelData.photographOfYourselfData.updatePhoto === BooleanTypeCode.Yes;
			const updateAttachments = this.licenceModelData.photographOfYourselfData.updateAttachments ?? [];
			return updatePhoto ? updateAttachments : null;
		}
	}

	get emailAddress(): string {
		return this.licenceModelData.contactInformationData?.emailAddress ?? '';
	}
	get phoneNumber(): string {
		return this.licenceModelData.contactInformationData?.phoneNumber ?? '';
	}

	get residentialAddressLine1(): string {
		return this.licenceModelData.residentialAddress?.addressLine1 ?? '';
	}
	get residentialAddressLine2(): string {
		return this.licenceModelData.residentialAddress?.addressLine2 ?? '';
	}
	get residentialCity(): string {
		return this.licenceModelData.residentialAddress?.city ?? '';
	}
	get residentialPostalCode(): string {
		return this.licenceModelData.residentialAddress?.postalCode ?? '';
	}
	get residentialProvince(): string {
		return this.licenceModelData.residentialAddress?.province ?? '';
	}
	get residentialCountry(): string {
		return this.licenceModelData.residentialAddress?.country ?? '';
	}
	get isAddressTheSame(): string {
		return this.licenceModelData.mailingAddress?.isAddressTheSame ?? '';
	}

	get mailingAddressLine1(): string {
		return this.licenceModelData.mailingAddress?.addressLine1 ?? '';
	}
	get mailingAddressLine2(): string {
		return this.licenceModelData.mailingAddress?.addressLine2 ?? '';
	}
	get mailingCity(): string {
		return this.licenceModelData.mailingAddress?.city ?? '';
	}
	get mailingPostalCode(): string {
		return this.licenceModelData.mailingAddress?.postalCode ?? '';
	}
	get mailingProvince(): string {
		return this.licenceModelData.mailingAddress?.province ?? '';
	}
	get mailingCountry(): string {
		return this.licenceModelData.mailingAddress?.country ?? '';
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
