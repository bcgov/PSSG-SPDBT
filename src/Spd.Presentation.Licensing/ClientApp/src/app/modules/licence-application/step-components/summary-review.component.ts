import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { BooleanTypeCode } from 'src/app/api/models';
import { PoliceOfficerRoleCode, SwlCategoryTypeCode } from 'src/app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { LicenceApplicationService, LicenceModel } from '../licence-application.service';

@Component({
	selector: 'app-summary-review',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title
					title="Application Summary"
					subtitle="Review your information before submitting your application"
				></app-step-title>
				<div class="step-container">
					<div class="row">
						<form [formGroup]="form" novalidate>
							<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
								<div class="row mb-3">
									<div class="col-12">
										<mat-accordion multi="true">
											<mat-expansion-panel [expanded]="true">
												<mat-expansion-panel-header>
													<mat-panel-title class="review-panel-title">
														<mat-toolbar class="d-flex justify-content-between">
															<div class="fs-5 fw-semibold my-2">Licence Selection</div>
															<button
																mat-mini-fab
																class="go-to-step-button"
																matTooltip="Go to Step 1"
																aria-label="Go to Step 1"
															>
																<mat-icon>edit</mat-icon>
															</button>
														</mat-toolbar>
													</mat-panel-title>
												</mat-expansion-panel-header>
												<div class="panel-body">
													<div class="text-minor-heading">Licence Information</div>
													<div class="row mt-0">
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Licence Type</div>
															<div class="text-data">
																{{ licenceTypeCode.value | options : 'SwlTypes' }}
															</div>
														</div>
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Application Type</div>
															<div class="text-data">
																{{ applicationTypeCode.value | options : 'SwlApplicationTypes' }}
															</div>
														</div>
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">
																Sole Proprietorship Security Business Licence
															</div>
															<div class="text-data">{{ isSoleProprietor.value }}</div>
														</div>
													</div>
													<div class="row mt-0">
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Licence Category</div>
															<div class="text-data">
																<div *ngFor="let item of categories.value; let i = index">
																	{{ item.desc }}
																</div>
															</div>
														</div>
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Licence Term</div>
															<div class="text-data">{{ licenceTermCode.value | options : 'SwlTermTypes' }}</div>
														</div>
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Fee</div>
															<div class="text-data">??</div>
														</div>
													</div>
													<div class="row mt-0" *ngIf="hasExpiredLicence.value == booleanTypeCodes.Yes">
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Expired Licence Number</div>
															<div class="text-data">{{ expiredLicenceNumber.value | default }}</div>
														</div>
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Expired Licence Expiry Date</div>
															<div class="text-data">
																{{ expiryDate.value | date : constants.date.dateFormat | default }}
															</div>
														</div>
													</div>
													<mat-divider class="mt-4 mb-2"></mat-divider>
													<div class="text-minor-heading">Documents Uploaded</div>

													<!--
													<div class="row mt-0">
														<ng-container *ngFor="let item of licenceModel.swlCategoryList; let i = index">
															<ng-container [ngSwitch]="item.code">
																<ng-container *ngSwitchCase="categoryTypeCodes.ArmouredCarGuard">
																	<div class="col-lg-6 col-md-12 mt-lg-2">
																		<div class="text-label d-block text-muted mt-2 mt-lg-0">
																			{{ item.code | options : 'SwlCategoryTypes' }} Documents
																		</div>
																		<div class="text-data">
																			<div
																				*ngFor="
																					let doc of licenceModel.licenceCategoryArmouredCarGuard?.attachments;
																					let i = index
																				"
																			>
																				{{ doc.name }}
																			</div>
																		
																		</div>
																	</div>
																</ng-container>
																<ng-container *ngSwitchCase="categoryTypeCodes.FireInvestigator">
																	<div class="col-lg-6 col-md-12 mt-lg-2">
																		<div class="text-label d-block text-muted mt-2 mt-lg-0">
																			{{ item.code | options : 'SwlCategoryTypes' }} Documents
																		</div>
																		<div class="text-data">
																			<div
																				*ngFor="
																					let doc of licenceModel.licenceCategoryFireInvestigator
																						?.fireinvestigatorcertificateattachments;
																					let i = index
																				"
																			>
																				{{ doc.name }}
																			</div>
																			<div
																				*ngFor="
																					let doc of licenceModel.licenceCategoryFireInvestigator
																						?.fireinvestigatorletterattachments;
																					let i = index
																				"
																			>
																				{{ doc.name }}
																			</div>
																		</div>
																	</div>
																</ng-container>
																<ng-container *ngSwitchCase="categoryTypeCodes.Locksmith">
																	<div class="col-lg-6 col-md-12 mt-lg-2">
																		<div class="text-label d-block text-muted mt-2 mt-lg-0">
																			{{ item.code | options : 'SwlCategoryTypes' }} Documents
																		</div>
																		<div class="text-data">
																			<div
																				*ngFor="
																					let doc of licenceModel.licenceCategoryLocksmith?.attachments;
																					let i = index
																				"
																			>
																				{{ doc.name }}
																			</div>
																		</div>
																	</div>
																</ng-container>
																<ng-container *ngSwitchCase="categoryTypeCodes.PrivateInvestigator">
																	<div class="col-lg-6 col-md-12 mt-lg-2">
																		<div class="text-label d-block text-muted mt-2 mt-lg-0">
																			{{ item.code | options : 'SwlCategoryTypes' }} Documents
																		</div>
																		<div class="text-data">
																			<div
																				*ngFor="
																					let doc of licenceModel.licenceCategoryPrivateInvestigator?.attachments;
																					let i = index
																				"
																			>
																				{{ doc.name }}
																			</div>

																			<div
																				*ngFor="
																					let doc of licenceModel.licenceCategoryPrivateInvestigator
																						?.trainingattachments;
																					let i = index
																				"
																			>
																				{{ doc.name }}
																			</div>

																			<div
																				*ngFor="
																					let doc of licenceModel.licenceCategoryPrivateInvestigator
																						?.fireinvestigatorcertificateattachments;
																					let i = index
																				"
																			>
																				{{ doc.name }}
																			</div>

																			<div
																				*ngFor="
																					let doc of licenceModel.licenceCategoryPrivateInvestigator
																						?.fireinvestigatorletterattachments;
																					let i = index
																				"
																			>
																				{{ doc.name }}
																			</div>
																		</div>
																	</div>
																</ng-container>
																<ng-container *ngSwitchCase="categoryTypeCodes.PrivateInvestigatorUnderSupervision">
																	<div class="col-lg-6 col-md-12 mt-lg-2">
																		<div class="text-label d-block text-muted mt-2 mt-lg-0">
																			{{ item.code | options : 'SwlCategoryTypes' }} Documents
																		</div>
																		<div class="text-data">
																			<div
																				*ngFor="
																					let doc of licenceModel.licenceCategoryPrivateInvestigatorUnderSupervision
																						?.attachments;
																					let i = index
																				"
																			>
																				{{ doc.name }}
																			</div>

																			<div
																				*ngFor="
																					let doc of licenceModel.licenceCategoryPrivateInvestigatorUnderSupervision
																						?.trainingattachments;
																					let i = index
																				"
																			>
																				{{ doc.name }}
																			</div>
																		</div>
																	</div>
																</ng-container>
																<ng-container *ngSwitchCase="categoryTypeCodes.SecurityAlarmInstaller">
																	<div class="col-lg-6 col-md-12 mt-lg-2">
																		<div class="text-label d-block text-muted mt-2 mt-lg-0">
																			{{ item.code | options : 'SwlCategoryTypes' }} Documents
																		</div>
																		<div class="text-data">
																			<div
																				*ngFor="
																					let doc of licenceModel.licenceCategorySecurityAlarmInstaller?.attachments;
																					let i = index
																				"
																			>
																				{{ doc.name }}
																			</div>
																		</div>
																	</div>
																</ng-container>
																<ng-container *ngSwitchCase="categoryTypeCodes.SecurityGuard">
																	<div class="col-lg-6 col-md-12 mt-lg-2">
																		<div class="text-label d-block text-muted mt-2 mt-lg-0">
																			{{ item.code | options : 'SwlCategoryTypes' }} Documents
																		</div>
																		<div class="text-data">
																			<div
																				*ngFor="
																					let doc of licenceModel.licenceCategorySecurityGuard?.attachments;
																					let i = index
																				"
																			>
																				{{ doc.name }}
																			</div>
																		</div>
																	</div>
																</ng-container>
																<ng-container *ngSwitchCase="categoryTypeCodes.SecurityConsultant">
																	<div class="col-lg-6 col-md-12 mt-lg-2">
																		<div class="text-label d-block text-muted mt-2 mt-lg-0">
																			{{ item.code | options : 'SwlCategoryTypes' }} Documents
																		</div>
																		<div class="text-data">
																			<div
																				*ngFor="
																					let doc of licenceModel.licenceCategorySecurityConsultant?.attachments;
																					let i = index
																				"
																			>
																				{{ doc.name }}
																			</div>
																			<div
																				*ngFor="
																					let doc of licenceModel.licenceCategorySecurityConsultant?.resumeattachments;
																					let i = index
																				"
																			>
																				{{ doc.name }}
																			</div>
																		</div>
																	</div>
																</ng-container>
															</ng-container>
														</ng-container>
													</div>
-->
													<ng-container *ngIf="hasExpiredLicence.value == booleanTypeCodes.Yes">
														<mat-divider class="mt-4 mb-2"></mat-divider>
														<div class="text-minor-heading">Dog & Restraints Authorization</div>
														<div class="row mt-0">
															<div class="col-lg-4 col-md-12 mt-lg-2">
																<div class="text-label d-block text-muted mt-2 mt-lg-0">Request to use restraints?</div>
																<div class="text-data">
																	{{ carryAndUseRetraints.value | options : 'BooleanTypes' }}
																</div>
															</div>
															<div class="col-lg-4 col-md-12 mt-lg-2">
																<div class="text-label d-block text-muted mt-2 mt-lg-0">
																	{{ carryAndUseRetraintsDocument.value | options : 'RestraintDocumentTypes' }}
																</div>
																<div class="text-data">
																	<div *ngFor="let doc of carryAndUseRetraintsAttachments.value; let i = index">
																		{{ doc.name }}
																	</div>
																</div>
															</div>
														</div>
														<div class="row mt-0">
															<div class="col-lg-4 col-md-12 mt-lg-2">
																<div class="text-label d-block text-muted mt-2 mt-lg-0">Request to use dogs?</div>
																<div class="text-data">{{ useDogsOrRestraints.value }}</div>
															</div>
															<div class="col-lg-4 col-md-12 mt-lg-2">
																<div class="text-label d-block text-muted mt-2 mt-lg-0">Reason</div>
																<div class="text-data">
																	<div *ngIf="isDogsPurposeProtection.value">Protection</div>
																	<div *ngIf="isDogsPurposeDetectionDrugs.value">Detection - Drugs</div>
																	<div *ngIf="isDogsPurposeDetectionExplosives.value">Detection - Explosives</div>
																</div>
															</div>
															<div class="col-lg-4 col-md-12 mt-lg-2">
																<div class="text-label d-block text-muted mt-2 mt-lg-0">
																	{{ dogsPurposeDocumentType.value | options : 'DogDocumentTypes' }}
																</div>
																<div class="text-data">
																	<div *ngFor="let doc of dogsPurposeAttachments.value; let i = index">
																		{{ doc.name }}
																	</div>
																</div>
															</div>
														</div>
													</ng-container>
												</div>
											</mat-expansion-panel>

											<mat-expansion-panel [expanded]="true">
												<mat-expansion-panel-header>
													<mat-panel-title class="review-panel-title">
														<mat-toolbar class="d-flex justify-content-between">
															<div class="fs-5 fw-semibold my-2">Background Information</div>
															<button
																mat-mini-fab
																class="go-to-step-button"
																matTooltip="Go to Step 2"
																aria-label="Go to Step 2"
															>
																<mat-icon>edit</mat-icon>
															</button>
														</mat-toolbar>
													</mat-panel-title>
												</mat-expansion-panel-header>
												<div class="panel-body">
													<div class="text-minor-heading">Police Background</div>
													<div class="row mt-0">
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">
																Police Officer or Peace Officer Roles
															</div>
															<div class="text-data">{{ isPoliceOrPeaceOfficer.value }}</div>
														</div>
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Role</div>
															<div class="text-data">
																<span
																	*ngIf="officerRole.value != policeOfficerRoleCodes.Other; else otherPoliceOfficerRole"
																	>{{ officerRole.value | options : 'PoliceOfficerRoleTypes' }}</span
																>
																<ng-template #otherPoliceOfficerRole> Other: {{ otherOfficerRole.value }} </ng-template>
															</div>
														</div>
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Letter of No Conflict</div>
															<div class="text-data">
																<div *ngFor="let doc of letterOfNoConflictAttachments.value; let i = index">
																	{{ doc.name }}
																</div>
															</div>
														</div>
													</div>
													<mat-divider class="mt-4 mb-2"></mat-divider>
													<div class="text-minor-heading">Mental Health Conditions</div>
													<div class="row mt-0">
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Mental Health Conditions?</div>
															<div class="text-data">{{ isTreatedForMHC.value }}</div>
														</div>
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Mental Health Condition Form</div>
															<div class="text-data">
																<div *ngFor="let doc of mentalHealthConditionAttachments.value; let i = index">
																	{{ doc.name }}
																</div>
															</div>
														</div>
													</div>
													<mat-divider class="mt-4 mb-2"></mat-divider>
													<div class="text-minor-heading">Criminal History</div>
													<div class="row mt-0">
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">
																Have you previously been charged or convicted of a crime?
															</div>
															<div class="text-data">{{ hasCriminalHistory.value }}</div>
														</div>
													</div>
													<mat-divider class="mt-4 mb-2"></mat-divider>
													<div class="text-minor-heading">Fingerprints</div>
													<div class="row mt-0">
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">
																Request for Fingerprinting Form
															</div>
															<div class="text-data">
																<div *ngFor="let doc of proofOfFingerprintAttachments.value; let i = index">
																	{{ doc.name }}
																</div>
															</div>
														</div>
													</div>
												</div>
											</mat-expansion-panel>

											<mat-expansion-panel [expanded]="true">
												<mat-expansion-panel-header>
													<mat-panel-title class="review-panel-title">
														<mat-toolbar class="d-flex justify-content-between">
															<div class="fs-5 fw-semibold my-2">Identification</div>
															<button
																mat-mini-fab
																class="go-to-step-button"
																matTooltip="Go to Step 3"
																aria-label="Go to Step 3"
															>
																<mat-icon>edit</mat-icon>
															</button>
														</mat-toolbar>
													</mat-panel-title>
												</mat-expansion-panel-header>
												<div class="panel-body">
													<div class="text-minor-heading">Personal Information</div>
													<div class="row mt-0">
														<div class="col-lg-6 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Applicant Name</div>
															<div class="text-data">
																{{ givenName.value }} {{ middleName1.value }} {{ middleName2.value }}
																{{ surname.value }}
															</div>
														</div>
														<div class="col-lg-3 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Date of Birth</div>
															<div class="text-data">
																{{ dateOfBirth.value | date : constants.date.dateFormat | default }}
															</div>
														</div>
														<div class="col-lg-3 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Sex</div>
															<div class="text-data">
																{{ genderCode.value | options : 'GenderTypes' }}
															</div>
														</div>
													</div>
													<mat-divider class="mt-4 mb-2"></mat-divider>
													<div class="text-minor-heading">Aliases</div>
													<div class="row mt-0">
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">
																Do you have any previous names?
															</div>
															<div class="text-data">{{ previousNameFlag.value }}</div>
														</div>
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<ng-container *ngIf="previousNameFlag.value == booleanTypeCodes.Yes">
																<div class="mt-lg-2">
																	<div class="text-label d-block text-muted mt-2 mt-lg-0">Alias Name(s)</div>
																	<div class="text-data">
																		<div *ngFor="let alias of aliases.value; let i = index" class="mt-lg-2">
																			{{ alias.givenName }} {{ alias.middleName1 }} {{ alias.middleName2 }}
																			{{ alias.surname }}
																		</div>
																	</div>
																</div>
															</ng-container>
														</div>
													</div>
													<mat-divider class="mt-4 mb-2"></mat-divider>
													<div class="text-minor-heading">Identification</div>
													<div class="row mt-0">
														<div class="col-lg-8 col-md-12">
															<div class="row mt-0">
																<div class="col-lg-6 col-md-12 mt-lg-2">
																	<div class="text-label d-block text-muted mt-2 mt-lg-0">Were you born in Canada?</div>
																	<div class="text-data">{{ isBornInCanada.value }}</div>
																</div>
																<div class="col-lg-6 col-md-12 mt-lg-2">
																	<div class="text-label d-block text-muted mt-2 mt-lg-0">
																		<span *ngIf="proofOfCitizenship">
																			{{ proofOfCitizenship.value | options : 'ProofOfCanadianCitizenshipTypes' }}
																		</span>
																		<span *ngIf="proofOfAbility">
																			{{ proofOfAbility.value | options : 'ProofOfAbilityToWorkInCanadaTypes' }}
																		</span>
																	</div>
																	<div class="text-data">
																		<div *ngFor="let doc of citizenshipDocumentPhotoAttachments.value; let i = index">
																			{{ doc.name }}
																		</div>
																	</div>
																</div>
																<div class="col-lg-6 col-md-12 mt-lg-2">
																	<div class="text-label d-block text-muted mt-2 mt-lg-0">BC Driver's Licence</div>
																	<div class="text-data">{{ bcDriversLicenceNumber.value | default }}</div>
																</div>
																<div class="col-lg-6 col-md-12 mt-lg-2">
																	<div class="text-label d-block text-muted mt-2 mt-lg-0">
																		<span *ngIf="proofOfCitizenship">
																			{{ proofOfCitizenship.value | options : 'ProofOfCanadianCitizenshipTypes' }}
																		</span>
																		<span *ngIf="proofOfAbility">
																			{{ proofOfAbility.value | options : 'ProofOfAbilityToWorkInCanadaTypes' }}
																		</span>
																	</div>
																	<div class="text-data">
																		<div *ngFor="let doc of citizenshipDocumentPhotoAttachments.value; let i = index">
																			{{ doc.name }}
																		</div>
																	</div>
																</div>
																<div class="col-lg-6 col-md-12 mt-lg-2">
																	<div class="text-label d-block text-muted mt-2 mt-lg-0">Height</div>
																	<div class="text-data">
																		{{ height.value }}
																		{{ heightUnitCode.value | options : 'HeightUnitTypes' }}
																	</div>
																</div>
																<div class="col-lg-6 col-md-12 mt-lg-2">
																	<div class="text-label d-block text-muted mt-2 mt-lg-0">Weight</div>
																	<div class="text-data">
																		{{ weight.value }}
																		{{ weightUnitCode.value | options : 'WeightUnitTypes' }}
																	</div>
																</div>
																<div class="col-lg-6 col-md-12 mt-lg-2">
																	<div class="text-label d-block text-muted mt-2 mt-lg-0">Hair Colour</div>
																	<div class="text-data">
																		{{ hairColourCode.value | options : 'HairColourTypes' }}
																	</div>
																</div>
																<div class="col-lg-6 col-md-12 mt-lg-2">
																	<div class="text-label d-block text-muted mt-2 mt-lg-0">Eye Colour</div>
																	<div class="text-data">
																		{{ eyeColourCode.value | options : 'EyeColourTypes' }}
																	</div>
																</div>
															</div>
														</div>
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Photograph</div>
															<div class="text-data">
																<img src="/assets/sample-photo.svg" />
															</div>
														</div>
													</div>
												</div>
											</mat-expansion-panel>

											<mat-expansion-panel [expanded]="true">
												<mat-expansion-panel-header>
													<mat-panel-title class="review-panel-title">
														<mat-toolbar class="d-flex justify-content-between">
															<div class="fs-5 fw-semibold my-2">Contact Information</div>
															<button
																mat-mini-fab
																class="go-to-step-button"
																matTooltip="Go to Step 4"
																aria-label="Go to Step 4"
															>
																<mat-icon>edit</mat-icon>
															</button>
														</mat-toolbar>
													</mat-panel-title>
												</mat-expansion-panel-header>
												<div class="panel-body">
													<div class="text-minor-heading">Residential Address</div>
													<div class="row mt-0">
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Address Line 1</div>
															<div class="text-data">{{ residentialAddressLine1.value }}</div>
														</div>
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Address Line 2</div>
															<div class="text-data">{{ residentialAddressLine2.value }}</div>
														</div>
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">City</div>
															<div class="text-data">{{ residentialCity.value }}</div>
														</div>
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Postal Code</div>
															<div class="text-data">{{ residentialPostalCode.value }}</div>
														</div>
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Province</div>
															<div class="text-data">
																{{ residentialProvince.value }}
															</div>
														</div>
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Country</div>
															<div class="text-data">
																{{ residentialCountry.value }}
															</div>
														</div>
													</div>
													<mat-divider class="mt-4 mb-2"></mat-divider>
													<div class="text-minor-heading">Mailing Address</div>
													<div class="row mt-0">
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Address Line 1</div>
															<div class="text-data">{{ mailingAddressLine1.value }}</div>
														</div>
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Address Line 2</div>
															<div class="text-data">{{ mailingAddressLine2.value }}</div>
														</div>
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">City</div>
															<div class="text-data">{{ mailingCity.value }}</div>
														</div>
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Postal Code</div>
															<div class="text-data">{{ mailingPostalCode.value }}</div>
														</div>
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Province</div>
															<div class="text-data">{{ mailingProvince.value }}</div>
														</div>
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Country</div>
															<div class="text-data">{{ mailingCountry.value }}</div>
														</div>
													</div>
												</div>
											</mat-expansion-panel>
										</mat-accordion>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.title {
				margin-top: 20px;
				margin-bottom: 10px;
			}
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

			.text-data {
				font-size: 1.05rem;
				font-weight: 400;
				line-height: 1.3em;
			}

			.text-label {
				font-size: smaller;
			}

			.review-panel-title {
				width: 100%;

				.mat-toolbar {
					background-color: var(--color-primary-lighter) !important;
					color: var(--color-primary-dark) !important;
					padding: 0;
				}
			}

			.go-to-step-button {
				width: 35px;
				height: 35px;
			}
		`,
	],
})
export class SummaryReviewComponent implements OnInit, OnDestroy {
	// private licenceModelLoadedSubscription!: Subscription;

	licenceModel: LicenceModel | null = null;
	form = this.licenceApplicationService.licenceModelFormGroup;

	constants = SPD_CONSTANTS;
	booleanTypeCodes = BooleanTypeCode;
	policeOfficerRoleCodes = PoliceOfficerRoleCode;
	categoryTypeCodes = SwlCategoryTypeCode;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		// 	console.log('SummaryReviewComponent ONINIT');
		// 	this.licenceModelLoadedSubscription = this.licenceApplicationService.licenceModelLoaded$.subscribe({
		// 		next: (loaded: LicenceModelSubject) => {
		// 			// console.log('SummaryReviewComponent', loaded);
		// 			// if (loaded.isLoaded || loaded.isUpdated) {
		// 			// 	this.licenceModel = this.licenceApplicationService.licenceModel;
		// 			// }
		// 		},
		// 	});
	}

	ngOnDestroy() {
		// 	this.licenceModelLoadedSubscription.unsubscribe();
	}

	get licenceTypeCode(): FormControl {
		return this.form.get('licenceTypeCode') as FormControl;
	}
	get applicationTypeCode(): FormControl {
		return this.form.get('applicationTypeCode') as FormControl;
	}

	get isSoleProprietor(): FormControl {
		return this.form.controls['soleProprietorFormGroup'].get('isSoleProprietor') as FormControl;
	}

	get categories(): FormArray {
		return this.form.controls['categoriesFormGroup'].get('categories') as FormArray;
	}

	get licenceTermCode(): FormControl {
		return this.form.controls['licenceTermFormGroup'].get('licenceTermCode') as FormControl;
	}

	get hasExpiredLicence(): FormControl {
		return this.form.controls['expiredLicenceFormGroup'].get('hasExpiredLicence') as FormControl;
	}
	get expiredLicenceNumber(): FormControl {
		return this.form.controls['expiredLicenceFormGroup'].get('expiredLicenceNumber') as FormControl;
	}
	get expiryDate(): FormControl {
		return this.form.controls['expiredLicenceFormGroup'].get('expiryDate') as FormControl;
	}

	get useDogsOrRestraints(): FormControl {
		return this.form.controls['dogsOrRestraintsFormGroup'].get('useDogsOrRestraints') as FormControl;
	}
	get carryAndUseRetraints(): FormControl {
		return this.form.controls['dogsOrRestraintsFormGroup'].get('carryAndUseRetraints') as FormControl;
	}
	get carryAndUseRetraintsDocument(): FormControl {
		return this.form.controls['dogsOrRestraintsFormGroup'].get('carryAndUseRetraintsDocument') as FormControl;
	}
	get carryAndUseRetraintsAttachments(): FormControl {
		return this.form.controls['dogsOrRestraintsFormGroup'].get('carryAndUseRetraintsAttachments') as FormControl;
	}
	get isDogsPurposeProtection(): FormControl {
		return (this.form.controls['dogsOrRestraintsFormGroup'].get('dogPurposeFormGroup') as FormGroup).get(
			'isDogsPurposeProtection'
		) as FormControl;
	}
	get isDogsPurposeDetectionDrugs(): FormControl {
		return (this.form.controls['dogsOrRestraintsFormGroup'].get('dogPurposeFormGroup') as FormGroup).get(
			'isDogsPurposeDetectionDrugs'
		) as FormControl;
	}
	get isDogsPurposeDetectionExplosives(): FormControl {
		return (this.form.controls['dogsOrRestraintsFormGroup'].get('dogPurposeFormGroup') as FormGroup).get(
			'isDogsPurposeDetectionExplosives'
		) as FormControl;
	}
	get dogsPurposeDocumentType(): FormControl {
		return this.form.controls['dogsOrRestraintsFormGroup'].get('dogsPurposeDocumentType') as FormControl;
	}
	get dogsPurposeAttachments(): FormControl {
		return this.form.controls['dogsOrRestraintsFormGroup'].get('dogsPurposeAttachments') as FormControl;
	}

	get isPoliceOrPeaceOfficer(): FormControl {
		return this.form.controls['policeBackgroundFormGroup'].get('isPoliceOrPeaceOfficer') as FormControl;
	}
	get officerRole(): FormControl {
		return this.form.controls['policeBackgroundFormGroup'].get('officerRole') as FormControl;
	}
	get otherOfficerRole(): FormControl {
		return this.form.controls['policeBackgroundFormGroup'].get('otherOfficerRole') as FormControl;
	}
	get letterOfNoConflictAttachments(): FormControl {
		return this.form.controls['policeBackgroundFormGroup'].get('letterOfNoConflictAttachments') as FormControl;
	}

	get oneLegalName(): FormControl {
		return this.form.controls['personalInformationFormGroup'].get('oneLegalName') as FormControl;
	}
	get givenName(): FormControl {
		return this.form.controls['personalInformationFormGroup'].get('givenName') as FormControl;
	}
	get middleName1(): FormControl {
		return this.form.controls['personalInformationFormGroup'].get('middleName1') as FormControl;
	}
	get middleName2(): FormControl {
		return this.form.controls['personalInformationFormGroup'].get('middleName2') as FormControl;
	}
	get surname(): FormControl {
		return this.form.controls['personalInformationFormGroup'].get('surname') as FormControl;
	}
	get genderCode(): FormControl {
		return this.form.controls['personalInformationFormGroup'].get('genderCode') as FormControl;
	}
	get dateOfBirth(): FormControl {
		return this.form.controls['personalInformationFormGroup'].get('dateOfBirth') as FormControl;
	}

	get previousNameFlag(): FormControl {
		return this.form.controls['aliasesFormGroup'].get('previousNameFlag') as FormControl;
	}
	get aliases(): FormArray {
		return this.form.controls['aliasesFormGroup'].get('aliases') as FormArray;
	}

	get isTreatedForMHC(): FormControl {
		return this.form.controls['mentalHealthConditionsFormGroup'].get('isTreatedForMHC') as FormControl;
	}
	get mentalHealthConditionAttachments(): FormControl {
		return this.form.controls['mentalHealthConditionsFormGroup'].get('mentalHealthConditionAttachments') as FormControl;
	}

	get hasCriminalHistory(): FormControl {
		return this.form.controls['criminalHistoryFormGroup'].get('hasCriminalHistory') as FormControl;
	}

	get proofOfFingerprintAttachments(): FormControl {
		return this.form.controls['proofOfFingerprintFormGroup'].get('proofOfFingerprintAttachments') as FormControl;
	}

	get isBornInCanada(): FormControl {
		return this.form.controls['citizenshipFormGroup'].get('isBornInCanada') as FormControl;
	}
	get proofOfCitizenship(): FormControl {
		return this.form.controls['citizenshipFormGroup'].get('proofOfCitizenship') as FormControl;
	}
	get proofOfAbility(): FormControl {
		return this.form.controls['citizenshipFormGroup'].get('proofOfAbility') as FormControl;
	}
	get citizenshipDocumentExpiryDate(): FormControl {
		return this.form.controls['citizenshipFormGroup'].get('citizenshipDocumentExpiryDate') as FormControl;
	}
	get citizenshipDocumentPhotoAttachments(): FormControl {
		return this.form.controls['citizenshipFormGroup'].get('citizenshipDocumentPhotoAttachments') as FormControl;
	}

	get governmentIssuedPhotoTypeCode(): FormControl {
		return this.form.controls['govIssuedIdFormGroup'].get('governmentIssuedPhotoTypeCode') as FormControl;
	}
	get governmentIssuedPhotoExpiryDate(): FormControl {
		return this.form.controls['govIssuedIdFormGroup'].get('governmentIssuedPhotoExpiryDate') as FormControl;
	}
	get governmentIssuedPhotoAttachments(): FormControl {
		return this.form.controls['govIssuedIdFormGroup'].get('governmentIssuedPhotoAttachments') as FormControl;
	}

	get hasBcDriversLicence(): FormControl {
		return this.form.controls['bcDriversLicenceFormGroup'].get('hasBcDriversLicence') as FormControl;
	}
	get bcDriversLicenceNumber(): FormControl {
		return this.form.controls['bcDriversLicenceFormGroup'].get('bcDriversLicenceNumber') as FormControl;
	}

	get hairColourCode(): FormControl {
		return this.form.controls['characteristicsFormGroup'].get('hairColourCode') as FormControl;
	}
	get eyeColourCode(): FormControl {
		return this.form.controls['characteristicsFormGroup'].get('eyeColourCode') as FormControl;
	}
	get height(): FormControl {
		return this.form.controls['characteristicsFormGroup'].get('height') as FormControl;
	}
	get heightUnitCode(): FormControl {
		return this.form.controls['characteristicsFormGroup'].get('heightUnitCode') as FormControl;
	}
	get weight(): FormControl {
		return this.form.controls['characteristicsFormGroup'].get('weight') as FormControl;
	}
	get weightUnitCode(): FormControl {
		return this.form.controls['characteristicsFormGroup'].get('weightUnitCode') as FormControl;
	}

	get useBcServicesCardPhoto(): FormControl {
		return this.form.controls['photographOfYourselfFormGroup'].get('useBcServicesCardPhoto') as FormControl;
	}
	get photoOfYourselfAttachments(): FormControl {
		return this.form.controls['photographOfYourselfFormGroup'].get('photoOfYourselfAttachments') as FormControl;
	}

	get contactEmailAddress(): FormControl {
		return this.form.controls['contactInformationFormGroup'].get('contactEmailAddress') as FormControl;
	}
	get contactPhoneNumber(): FormControl {
		return this.form.controls['contactInformationFormGroup'].get('contactPhoneNumber') as FormControl;
	}

	get residentialAddressLine1(): FormControl {
		return this.form.controls['residentialAddressFormGroup'].get('residentialAddressLine1') as FormControl;
	}
	get residentialAddressLine2(): FormControl {
		return this.form.controls['residentialAddressFormGroup'].get('residentialAddressLine2') as FormControl;
	}
	get residentialCity(): FormControl {
		return this.form.controls['residentialAddressFormGroup'].get('residentialCity') as FormControl;
	}
	get residentialPostalCode(): FormControl {
		return this.form.controls['residentialAddressFormGroup'].get('residentialPostalCode') as FormControl;
	}
	get residentialProvince(): FormControl {
		return this.form.controls['residentialAddressFormGroup'].get('residentialProvince') as FormControl;
	}
	get residentialCountry(): FormControl {
		return this.form.controls['residentialAddressFormGroup'].get('residentialCountry') as FormControl;
	}
	get isMailingTheSameAsResidential(): FormControl {
		return this.form.controls['residentialAddressFormGroup'].get('isMailingTheSameAsResidential') as FormControl;
	}

	get mailingAddressLine1(): FormControl {
		return this.form.controls['mailingAddressFormGroup'].get('mailingAddressLine1') as FormControl;
	}
	get mailingAddressLine2(): FormControl {
		return this.form.controls['mailingAddressFormGroup'].get('mailingAddressLine2') as FormControl;
	}
	get mailingCity(): FormControl {
		return this.form.controls['mailingAddressFormGroup'].get('mailingCity') as FormControl;
	}
	get mailingPostalCode(): FormControl {
		return this.form.controls['mailingAddressFormGroup'].get('mailingPostalCode') as FormControl;
	}
	get mailingProvince(): FormControl {
		return this.form.controls['mailingAddressFormGroup'].get('mailingProvince') as FormControl;
	}
	get mailingCountry(): FormControl {
		return this.form.controls['mailingAddressFormGroup'].get('mailingCountry') as FormControl;
	}
}
