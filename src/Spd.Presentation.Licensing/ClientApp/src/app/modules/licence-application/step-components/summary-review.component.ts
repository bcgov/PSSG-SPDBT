import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BooleanTypeCode } from 'src/app/api/models';
import { PoliceOfficerRoleCode, SwlCategoryTypeCode } from 'src/app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { LicenceApplicationService, LicenceModel, LicenceModelSubject } from '../licence-application.service';

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
					<div class="row" *ngIf="licenceModel">
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
												<div class="text-minor-heading mb-3">Licence Information</div>
												<div class="row mt-0">
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Licence Type</div>
														<div class="text-data">
															{{ licenceModel.licenceTypeCode | options : 'SwlTypes' }}
														</div>
													</div>
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Application Type</div>
														<div class="text-data">
															{{ licenceModel.applicationTypeCode | options : 'SwlApplicationTypes' }}
														</div>
													</div>
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">
															Sole Proprietorship Security Business Licence
														</div>
														<div class="text-data">{{ licenceModel.isSoleProprietor }}</div>
													</div>
												</div>
												<div class="row mt-0">
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Licence Category</div>
														<div class="text-data">
															<div *ngFor="let item of licenceModel.swlCategoryList; let i = index">
																{{ item.desc }}
															</div>
														</div>
													</div>
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Licence Term</div>
														<div class="text-data">{{ licenceModel.licenceTermCode | options : 'SwlTermTypes' }}</div>
													</div>
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Fee</div>
														<div class="text-data">??</div>
													</div>
												</div>
												<div class="row mt-0" *ngIf="licenceModel.hasExpiredLicence == booleanTypeCodes.Yes">
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Expired Licence Number</div>
														<div class="text-data">{{ licenceModel.expiredLicenceNumber | default }}</div>
													</div>
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Expired Licence Expiry Date</div>
														<div class="text-data">
															{{ licenceModel.expiryDate | date : constants.date.dateFormat | default }}
														</div>
													</div>
												</div>
												<mat-divider class="mt-4 mb-2"></mat-divider>
												<div class="text-minor-heading mb-3">Documents Uploaded</div>

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
																		<div>
																			<span class="text-label">Expiry Date:</span>
																			{{
																				licenceModel.licenceCategoryArmouredCarGuard?.documentExpiryDate
																					| date : constants.date.dateFormat
																			}}
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
																				let doc of licenceModel.licenceCategoryPrivateInvestigator?.trainingattachments;
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

												<ng-container *ngIf="licenceModel.hasExpiredLicence == booleanTypeCodes.Yes">
													<mat-divider class="mt-4 mb-2"></mat-divider>
													<div class="text-minor-heading">Dog & Restraints Authorization</div>
													<div class="row mt-0">
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Request to use restraints?</div>
															<div class="text-data">
																{{ licenceModel.carryAndUseRetraints | options : 'BooleanTypes' }}
															</div>
														</div>
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">
																{{ licenceModel.carryAndUseRetraintsDocument | options : 'RestraintDocumentTypes' }}
															</div>
															<div class="text-data">
																<div *ngFor="let doc of licenceModel.carryAndUseRetraintsAttachments; let i = index">
																	{{ doc.name }}
																</div>
															</div>
														</div>
													</div>
													<div class="row mt-0">
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Request to use dogs?</div>
															<div class="text-data">{{ licenceModel.useDogsOrRestraints }}</div>
														</div>
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Reason</div>
															<div class="text-data">
																<div *ngIf="licenceModel.isDogsPurposeProtection">Protection</div>
																<div *ngIf="licenceModel.isDogsPurposeDetectionDrugs">Detection - Drugs</div>
																<div *ngIf="licenceModel.isDogsPurposeDetectionExplosives">Detection - Explosives</div>
															</div>
														</div>
														<div class="col-lg-4 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">
																{{ licenceModel.dogsPurposeDocumentType | options : 'DogDocumentTypes' }}
															</div>
															<div class="text-data">
																<div *ngFor="let doc of licenceModel.dogsPurposeAttachments; let i = index">
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
														<div class="text-data">{{ licenceModel.isPoliceOrPeaceOfficer }}</div>
													</div>
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Role</div>
														<div class="text-data">
															<span
																*ngIf="
																	licenceModel.officerRole != policeOfficerRoleCodes.Other;
																	else otherPoliceOfficerRole
																"
																>{{ licenceModel.officerRole | options : 'PoliceOfficerRoleTypes' }}</span
															>
															<ng-template #otherPoliceOfficerRole>
																Other: {{ licenceModel.otherOfficerRole }}
															</ng-template>
														</div>
													</div>
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Letter of No Conflict</div>
														<div class="text-data">
															<div *ngFor="let doc of licenceModel.letterOfNoConflictAttachments; let i = index">
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
														<div class="text-data">{{ licenceModel.isTreatedForMHC }}</div>
													</div>
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Mental Health Condition Form</div>
														<div class="text-data">
															<div *ngFor="let doc of licenceModel.mentalHealthConditionAttachments; let i = index">
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
														<div class="text-data">{{ licenceModel.hasCriminalHistory }}</div>
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
															<div *ngFor="let doc of licenceModel.proofOfFingerprintAttachments; let i = index">
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
															{{ licenceModel.givenName }} {{ licenceModel.middleName1 }}
															{{ licenceModel.middleName2 }} {{ licenceModel.surname }}
														</div>
													</div>
													<div class="col-lg-3 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Date of Birth</div>
														<div class="text-data">
															{{ licenceModel.dateOfBirth | date : constants.date.dateFormat | default }}
														</div>
													</div>
													<div class="col-lg-3 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Sex</div>
														<div class="text-data">
															{{ licenceModel.genderCode | options : 'GenderTypes' }}
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
														<div class="text-data">{{ licenceModel.previousNameFlag }}</div>
													</div>
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<ng-container *ngIf="licenceModel.previousNameFlag == booleanTypeCodes.Yes">
															<div class="mt-lg-2">
																<div class="text-label d-block text-muted mt-2 mt-lg-0">Alias Name(s)</div>
																<div class="text-data">
																	<div *ngFor="let alias of licenceModel.aliases; let i = index" class="mt-lg-2">
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
																<div class="text-data">{{ licenceModel.isBornInCanada }}</div>
															</div>
															<div class="col-lg-6 col-md-12 mt-lg-2">
																<div class="text-label d-block text-muted mt-2 mt-lg-0">
																	<span *ngIf="licenceModel.proofOfCitizenship">
																		{{ licenceModel.proofOfCitizenship | options : 'ProofOfCanadianCitizenshipTypes' }}
																	</span>
																	<span *ngIf="licenceModel.proofOfAbility">
																		{{ licenceModel.proofOfAbility | options : 'ProofOfAbilityToWorkInCanadaTypes' }}
																	</span>
																</div>
																<div class="text-data">
																	<div
																		*ngFor="let doc of licenceModel.citizenshipDocumentPhotoAttachments; let i = index"
																	>
																		{{ doc.name }}
																	</div>
																</div>
															</div>
															<div class="col-lg-6 col-md-12 mt-lg-2">
																<div class="text-label d-block text-muted mt-2 mt-lg-0">BC Driver's Licence</div>
																<div class="text-data">{{ licenceModel.bcDriversLicenceNumber | default }}</div>
															</div>
															<div class="col-lg-6 col-md-12 mt-lg-2">
																<div class="text-label d-block text-muted mt-2 mt-lg-0">
																	<span *ngIf="licenceModel.proofOfCitizenship">
																		{{ licenceModel.proofOfCitizenship | options : 'ProofOfCanadianCitizenshipTypes' }}
																	</span>
																	<span *ngIf="licenceModel.proofOfAbility">
																		{{ licenceModel.proofOfAbility | options : 'ProofOfAbilityToWorkInCanadaTypes' }}
																	</span>
																</div>
																<div class="text-data">
																	<div
																		*ngFor="let doc of licenceModel.citizenshipDocumentPhotoAttachments; let i = index"
																	>
																		{{ doc.name }}
																	</div>
																</div>
															</div>
															<div class="col-lg-6 col-md-12 mt-lg-2">
																<div class="text-label d-block text-muted mt-2 mt-lg-0">Height</div>
																<div class="text-data">
																	{{ licenceModel.height }}
																	{{ licenceModel.heightUnitCode | options : 'HeightUnitTypes' }}
																</div>
															</div>
															<div class="col-lg-6 col-md-12 mt-lg-2">
																<div class="text-label d-block text-muted mt-2 mt-lg-0">Weight</div>
																<div class="text-data">
																	{{ licenceModel.weight }}
																	{{ licenceModel.weightUnitCode | options : 'WeightUnitTypes' }}
																</div>
															</div>
															<div class="col-lg-6 col-md-12 mt-lg-2">
																<div class="text-label d-block text-muted mt-2 mt-lg-0">Hair Colour</div>
																<div class="text-data">
																	{{ licenceModel.hairColourCode | options : 'HairColourTypes' }}
																</div>
															</div>
															<div class="col-lg-6 col-md-12 mt-lg-2">
																<div class="text-label d-block text-muted mt-2 mt-lg-0">Eye Colour</div>
																<div class="text-data">
																	{{ licenceModel.eyeColourCode | options : 'EyeColourTypes' }}
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
														<div class="text-data">{{ licenceModel.residentialAddressLine1 }}</div>
													</div>
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Address Line 2</div>
														<div class="text-data">{{ licenceModel.residentialAddressLine2 }}</div>
													</div>
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">City</div>
														<div class="text-data">{{ licenceModel.residentialCity }}</div>
													</div>
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Postal Code</div>
														<div class="text-data">{{ licenceModel.residentialPostalCode }}</div>
													</div>
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Province</div>
														<div class="text-data">
															{{ licenceModel.residentialProvince }}
														</div>
													</div>
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Country</div>
														<div class="text-data">
															{{ licenceModel.residentialCountry }}
														</div>
													</div>
												</div>
												<mat-divider class="mt-4 mb-2"></mat-divider>
												<div class="text-minor-heading">Mailing Address</div>
												<div class="row mt-0">
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Address Line 1</div>
														<div class="text-data">{{ licenceModel.mailingAddressLine1 }}</div>
													</div>
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Address Line 2</div>
														<div class="text-data">{{ licenceModel.mailingAddressLine2 }}</div>
													</div>
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">City</div>
														<div class="text-data">{{ licenceModel.mailingCity }}</div>
													</div>
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Postal Code</div>
														<div class="text-data">{{ licenceModel.mailingPostalCode }}</div>
													</div>
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Province</div>
														<div class="text-data">{{ licenceModel.mailingProvince }}</div>
													</div>
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Country</div>
														<div class="text-data">{{ licenceModel.mailingCountry }}</div>
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
	private licenceModelLoadedSubscription!: Subscription;

	licenceModel: LicenceModel | null = null;
	constants = SPD_CONSTANTS;
	booleanTypeCodes = BooleanTypeCode;
	policeOfficerRoleCodes = PoliceOfficerRoleCode;
	categoryTypeCodes = SwlCategoryTypeCode;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		console.log('SummaryReviewComponent ONINIT');

		this.licenceModelLoadedSubscription = this.licenceApplicationService.licenceModelLoaded$.subscribe({
			next: (loaded: LicenceModelSubject) => {
				console.log('SummaryReviewComponent', loaded);
				if (loaded.isLoaded || loaded.isUpdated) {
					this.licenceModel = this.licenceApplicationService.licenceModel;
				}
			},
		});
	}

	ngOnDestroy() {
		this.licenceModelLoadedSubscription.unsubscribe();
	}
}
