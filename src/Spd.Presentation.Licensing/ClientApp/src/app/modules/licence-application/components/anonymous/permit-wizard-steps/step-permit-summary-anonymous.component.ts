import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PoliceOfficerRoleCode, WorkerCategoryTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { BooleanTypeCode, WorkerCategoryTypes } from 'src/app/core/code-types/model-desc.models';

@Component({
	selector: 'app-step-permit-summary-anonymous',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Application Summary"
					subtitle="Review your information before submitting your application"
				></app-step-title>

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
												<div class="col-lg-4 col-md-12 mt-lg-2">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">Licence Type</div>
													<div class="summary-text-data">
														{{ workerLicenceTypeCode | options : 'WorkerLicenceTypes' }}
													</div>
												</div>
												<div class="col-lg-4 col-md-12 mt-lg-2">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">Application Type</div>
													<div class="summary-text-data">
														{{ applicationTypeCode | options : 'ApplicationTypes' }}
													</div>
												</div>
											</div>
											<div class="row mt-0">
												<!-- <div class="col-lg-4 col-md-12 mt-lg-2">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">Licence Term</div>
													<div class="summary-text-data">{{ licenceTermCode | options : 'LicenceTermTypes' }}</div>
												</div> -->
												<div class="col-lg-4 col-md-12 mt-lg-2">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">Fee</div>
													<div class="summary-text-data">
														{{ licenceFee | currency : 'CAD' : 'symbol-narrow' : '1.0' | default }}
													</div>
												</div>
											</div>

											<ng-container *ngIf="hasExpiredLicence === booleanTypeCodes.Yes">
												<mat-divider class="mt-4 mb-2"></mat-divider>
												<div class="text-minor-heading">Expired Licence</div>
												<div class="row mt-0">
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Expired Licence Number</div>
														<div class="summary-text-data">{{ expiredLicenceNumber | default }}</div>
													</div>
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Expired Licence Expiry Date</div>
														<div class="summary-text-data">
															{{ expiredLicenceExpiryDate | formatDate | default }}
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
													<div class="panel-header fs-4 my-2">Background Information</div>
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
											<!-- <div class="text-minor-heading mt-4">Police Background</div>
											<div class="row mt-0">
												<div class="col-lg-4 col-md-12 mt-lg-2">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">
														Police Officer or Peace Officer Roles
													</div>
													<div class="summary-text-data">{{ isPoliceOrPeaceOfficer }}</div>
												</div>
												<ng-container *ngIf="isPoliceOrPeaceOfficer === booleanTypeCodes.Yes">
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Role</div>
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
													<div class="col-lg-4 col-md-12 mt-lg-2" *ngIf="letterOfNoConflictAttachments">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Letter of No Conflict</div>
														<div class="summary-text-data">
															<div *ngFor="let doc of letterOfNoConflictAttachments; let i = index">
																{{ doc.name }}
															</div>
														</div>
													</div>
												</ng-container>
											</div> -->
											<!-- <mat-divider class="mt-4 mb-2"></mat-divider>

											<div class="text-minor-heading">Mental Health Conditions</div>
											<div class="row mt-0">
												<div class="col-lg-6 col-md-12 mt-lg-2">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">Mental Health Conditions?</div>
													<div class="summary-text-data">{{ isTreatedForMHC }}</div>
												</div>
												<div class="col-lg-6 col-md-12 mt-lg-2" *ngIf="mentalHealthConditionAttachments.length > 0">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">Mental Health Condition Form</div>
													<div class="summary-text-data">
														<div *ngFor="let doc of mentalHealthConditionAttachments; let i = index">
															{{ doc.name }}
														</div>
													</div>
												</div>
											</div>
											<mat-divider class="mt-4 mb-2"></mat-divider> -->

											<div class="text-minor-heading">Criminal History</div>
											<div class="row mt-0">
												<div class="col-12 mt-lg-2">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">
														Have you previously been charged or convicted of a crime?
													</div>
													<div class="summary-text-data">{{ hasCriminalHistory }}</div>
												</div>
											</div>
											<mat-divider class="mt-4 mb-2"></mat-divider>

											<div class="text-minor-heading">Fingerprints</div>
											<div class="row mt-0">
												<div class="col-12 mt-lg-2">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">Request for Fingerprinting Form</div>
													<div class="summary-text-data">
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
												<div class="col-lg-6 col-md-12 mt-lg-2">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">Applicant Name</div>
													<div class="summary-text-data">
														{{ givenName }} {{ middleName1 }} {{ middleName2 }}
														{{ surname }}
													</div>
												</div>
												<div class="col-lg-3 col-md-12 mt-lg-2">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">Date of Birth</div>
													<div class="summary-text-data">
														{{ dateOfBirth | formatDate | default }}
													</div>
												</div>
												<div class="col-lg-3 col-md-12 mt-lg-2">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">Sex</div>
													<div class="summary-text-data">
														{{ genderCode | options : 'GenderTypes' | default }}
													</div>
												</div>
											</div>
											<mat-divider class="mt-4 mb-2"></mat-divider>

											<div class="text-minor-heading">Aliases</div>
											<div class="row mt-0">
												<div class="col-lg-4 col-md-12 mt-lg-2">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">Do you have any previous names?</div>
													<div class="summary-text-data">{{ previousNameFlag }}</div>
												</div>
												<div class="col-lg-4 col-md-12 mt-lg-2">
													<ng-container *ngIf="previousNameFlag === booleanTypeCodes.Yes">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Alias Name(s)</div>
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
											<mat-divider class="mt-4 mb-2"></mat-divider>

											<div class="text-minor-heading">Identification</div>
											<div class="row mt-0">
												<div class="col-lg-8 col-md-12">
													<div class="row mt-0">
														<div class="col-lg-6 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Were you born in Canada?</div>
															<div class="summary-text-data">{{ isCanadianCitizen }}</div>
														</div>
														<div class="col-lg-6 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">
																<span *ngIf="canadianCitizenProofTypeCode">
																	{{ canadianCitizenProofTypeCode | options : 'ProofOfCanadianCitizenshipTypes' }}
																</span>
																<span *ngIf="notCanadianCitizenProofTypeCode">
																	{{ notCanadianCitizenProofTypeCode | options : 'ProofOfAbilityToWorkInCanadaTypes' }}
																</span>
															</div>
															<div class="summary-text-data">
																<div *ngFor="let doc of attachments; let i = index">
																	{{ doc.name }}
																</div>
															</div>
														</div>
														<div class="col-lg-6 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">BC Driver's Licence</div>
															<div class="summary-text-data">{{ bcDriversLicenceNumber | default }}</div>
														</div>
														<!-- <div class="col-lg-6 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">
																{{ governmentIssuedPhotoTypeCode | options : 'GovernmentIssuedPhotoIdTypes' }}
															</div>
															<div class="summary-text-data">
																<div *ngFor="let doc of governmentIssuedPhotoAttachments; let i = index">
																	{{ doc.name }}
																</div>
															</div>
														</div> -->
														<div class="col-lg-6 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Height</div>
															<div class="summary-text-data">
																{{ height }}
																{{ heightUnitCode | options : 'HeightUnitTypes' }}
																{{ heightInches }}
															</div>
														</div>
														<div class="col-lg-6 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Weight</div>
															<div class="summary-text-data">
																{{ weight }}
																{{ weightUnitCode | options : 'WeightUnitTypes' }}
															</div>
														</div>
														<div class="col-lg-6 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Hair Colour</div>
															<div class="summary-text-data">
																{{ hairColourCode | options : 'HairColourTypes' }}
															</div>
														</div>
														<div class="col-lg-6 col-md-12 mt-lg-2">
															<div class="text-label d-block text-muted mt-2 mt-lg-0">Eye Colour</div>
															<div class="summary-text-data">
																{{ eyeColourCode | options : 'EyeColourTypes' }}
															</div>
														</div>
													</div>
												</div>
												<div class="col-lg-4 col-md-12 mt-lg-2">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">Photograph</div>
													<div class="summary-text-data">
														<img src="/assets/sample-photo.svg" alt="Photo of yourself" />
													</div>
												</div>
											</div>
										</div>
									</mat-expansion-panel>

									<mat-expansion-panel class="mb-2" [expanded]="true">
										<mat-expansion-panel-header>
											<mat-panel-title class="review-panel-title">
												<mat-toolbar class="d-flex justify-content-between">
													<div class="panel-header fs-4 my-2">Contact Information</div>
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
												<div class="col-lg-4 col-md-12 mt-lg-2">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">Email Address</div>
													<div class="summary-text-data">{{ contactEmailAddress | default }}</div>
												</div>
												<div class="col-lg-4 col-md-12 mt-lg-2">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">Phone Number</div>
													<div class="summary-text-data">
														{{ contactPhoneNumber | mask : constants.phone.displayMask }}
													</div>
												</div>
											</div>
											<mat-divider class="mt-4 mb-2"></mat-divider>

											<div class="text-minor-heading">Residential Address</div>
											<div class="row mt-0">
												<div class="col-lg-4 col-md-12 mt-lg-2">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">Address Line 1</div>
													<div class="summary-text-data">{{ residentialAddressLine1 | default }}</div>
												</div>
												<div class="col-lg-4 col-md-12 mt-lg-2">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">Address Line 2</div>
													<div class="summary-text-data">{{ residentialAddressLine2 | default }}</div>
												</div>
												<div class="col-lg-4 col-md-12 mt-lg-2">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">City</div>
													<div class="summary-text-data">{{ residentialCity | default }}</div>
												</div>
												<div class="col-lg-4 col-md-12 mt-lg-2">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">Postal Code</div>
													<div class="summary-text-data">{{ residentialPostalCode | default }}</div>
												</div>
												<div class="col-lg-4 col-md-12 mt-lg-2">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">Province</div>
													<div class="summary-text-data">
														{{ residentialProvince | default }}
													</div>
												</div>
												<div class="col-lg-4 col-md-12 mt-lg-2">
													<div class="text-label d-block text-muted mt-2 mt-lg-0">Country</div>
													<div class="summary-text-data">
														{{ residentialCountry | default }}
													</div>
												</div>
											</div>
											<mat-divider class="mt-4 mb-2"></mat-divider>

											<div class="text-minor-heading">Mailing Address</div>
											<ng-container *ngIf="isMailingTheSameAsResidential; else mailingIsDifferentThanResidential">
												<div class="row mt-0">
													<div class="col-12 mt-lg-2">
														<div class="summary-text-data">Mailing address is the same as the residential address</div>
													</div>
												</div>
											</ng-container>
											<ng-template #mailingIsDifferentThanResidential>
												<div class="row mt-0">
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Address Line 1</div>
														<div class="summary-text-data">{{ mailingAddressLine1 | default }}</div>
													</div>
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Address Line 2</div>
														<div class="summary-text-data">{{ mailingAddressLine2 | default }}</div>
													</div>
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">City</div>
														<div class="summary-text-data">{{ mailingCity | default }}</div>
													</div>
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Postal Code</div>
														<div class="summary-text-data">{{ mailingPostalCode | default }}</div>
													</div>
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Province</div>
														<div class="summary-text-data">{{ mailingProvince | default }}</div>
													</div>
													<div class="col-lg-4 col-md-12 mt-lg-2">
														<div class="text-label d-block text-muted mt-2 mt-lg-0">Country</div>
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
export class StepPermitSummaryAnonymousComponent implements OnInit {
	permitModelData: any = {};

	constants = SPD_CONSTANTS;
	booleanTypeCodes = BooleanTypeCode;
	policeOfficerRoleCodes = PoliceOfficerRoleCode;
	categoryTypeCodes = WorkerCategoryTypeCode;
	swlCategoryTypes = WorkerCategoryTypes;

	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	constructor(private permitApplicationService: PermitApplicationService) {}

	ngOnInit(): void {
		this.permitModelData = { ...this.permitApplicationService.permitModelFormGroup.getRawValue() };
	}

	onEditStep(stepNumber: number) {
		this.editStep.emit(stepNumber);
	}

	onUpdateData(): void {
		this.permitModelData = {
			...this.permitApplicationService.permitModelFormGroup.getRawValue(),
		};
	}

	get workerLicenceTypeCode(): string {
		return this.permitModelData.workerLicenceTypeData?.workerLicenceTypeCode ?? '';
	}

	get applicationTypeCode(): string {
		return this.permitModelData.applicationTypeData?.applicationTypeCode ?? '';
	}

	get licenceFee(): number | null {
		// if (!this.licenceTermCode) {
		// 	return null;
		// }

		// const feeItem = this.permitApplicationService.licenceFeeTermCodes.find(
		// 	(item: LicenceFeeResponse) => item.licenceTermCode == this.licenceTermCode
		// );
		// return feeItem?.amount ?? null;
		return 5;
	}

	get hasExpiredLicence(): string {
		return this.permitModelData.expiredLicenceData.hasExpiredLicence ?? '';
	}
	get expiredLicenceNumber(): string {
		return this.permitModelData.expiredLicenceData.expiredLicenceNumber ?? '';
	}
	get expiredLicenceExpiryDate(): string {
		return this.permitModelData.expiredLicenceData.expiryDate ?? '';
	}

	// get carryAndUseRestraints(): string {
	// 	return this.permitModelData.restraintsAuthorizationData.carryAndUseRestraints ?? '';
	// }
	// get carryAndUseRestraintsDocument(): string {
	// 	return this.permitModelData.restraintsAuthorizationData.carryAndUseRestraintsDocument ?? '';
	// }
	// get carryAndUseRestraintsAttachments(): File[] {
	// 	return this.permitModelData.restraintsAuthorizationData.attachments ?? [];
	// }
	// get showDogsAndRestraints(): boolean {
	// 	return this.permitModelData.categorySecurityGuardFormGroup.isInclude;
	// }
	// get useDogs(): string {
	// 	return this.permitModelData.dogsAuthorizationData.useDogs ?? '';
	// }
	// get isDogsPurposeProtection(): string {
	// 	return this.permitModelData.dogsAuthorizationData.dogsPurposeFormGroup.isDogsPurposeProtection ?? false;
	// }
	// get isDogsPurposeDetectionDrugs(): string {
	// 	return this.permitModelData.dogsAuthorizationData.dogsPurposeFormGroup.isDogsPurposeDetectionDrugs ?? false;
	// }
	// get isDogsPurposeDetectionExplosives(): string {
	// 	return this.permitModelData.dogsAuthorizationData.dogsPurposeFormGroup.isDogsPurposeDetectionExplosives ?? false;
	// }
	// get dogsPurposeAttachments(): File[] {
	// 	return this.permitModelData.dogsAuthorizationData.attachments ?? [];
	// }

	// get isPoliceOrPeaceOfficer(): string {
	// 	return this.permitModelData.policeBackgroundData.isPoliceOrPeaceOfficer ?? '';
	// }
	// get policeOfficerRoleCode(): string {
	// 	return this.permitModelData.policeBackgroundData.policeOfficerRoleCode ?? '';
	// }
	// get otherOfficerRole(): string {
	// 	return this.permitModelData.policeBackgroundData.otherOfficerRole ?? '';
	// }
	// get letterOfNoConflictAttachments(): File[] {
	// 	return this.permitModelData.policeBackgroundData.attachments ?? [];
	// }

	get givenName(): string {
		return this.permitModelData.personalInformationData.givenName ?? '';
	}
	get middleName1(): string {
		return this.permitModelData.personalInformationData.middleName1 ?? '';
	}
	get middleName2(): string {
		return this.permitModelData.personalInformationData.middleName2 ?? '';
	}
	get surname(): string {
		return this.permitModelData.personalInformationData.surname ?? '';
	}
	get genderCode(): string {
		return this.permitModelData.personalInformationData.genderCode ?? '';
	}
	get dateOfBirth(): string {
		return this.permitModelData.personalInformationData.dateOfBirth ?? '';
	}

	get previousNameFlag(): string {
		return this.permitModelData.aliasesData.previousNameFlag ?? '';
	}
	get aliases(): Array<any> {
		return this.permitModelData.aliasesData.aliases ?? [];
	}

	// get isTreatedForMHC(): string {
	// 	return this.permitModelData.mentalHealthConditionsData.isTreatedForMHC ?? '';
	// }
	// get mentalHealthConditionAttachments(): File[] {
	// 	return this.permitModelData.mentalHealthConditionsData.attachments ?? [];
	// }

	get hasCriminalHistory(): string {
		return this.permitModelData.criminalHistoryData.hasCriminalHistory ?? '';
	}

	get proofOfFingerprintAttachments(): File[] {
		return this.permitModelData.fingerprintProofData.attachments ?? [];
	}

	get isCanadianCitizen(): string {
		return this.permitModelData.citizenshipData.isCanadianCitizen ?? '';
	}
	get canadianCitizenProofTypeCode(): string {
		return this.permitModelData.citizenshipData.isCanadianCitizen === BooleanTypeCode.Yes
			? this.permitModelData.citizenshipData.canadianCitizenProofTypeCode ?? ''
			: '';
	}
	get notCanadianCitizenProofTypeCode(): string {
		return this.permitModelData.citizenshipData.isCanadianCitizen === BooleanTypeCode.No
			? this.permitModelData.citizenshipData.notCanadianCitizenProofTypeCode ?? ''
			: '';
	}
	get proofOfAbility(): string {
		return this.permitModelData.citizenshipData.proofOfAbility ?? '';
	}
	get citizenshipExpiryDate(): string {
		return this.permitModelData.citizenshipData.expiryDate ?? '';
	}
	get attachments(): File[] {
		return this.permitModelData.citizenshipData.attachments ?? [];
	}

	// get showAdditionalGovIdData(): boolean {
	// 	return (
	// 		(this.permitModelData.citizenshipData.isCanadianCitizen == BooleanTypeCode.Yes &&
	// 			this.permitModelData.citizenshipData.canadianCitizenProofTypeCode !=
	// 				LicenceDocumentTypeCode.CanadianPassport) ||
	// 		(this.permitModelData.citizenshipData.isCanadianCitizen == BooleanTypeCode.No &&
	// 			this.permitModelData.citizenshipData.notCanadianCitizenProofTypeCode !=
	// 				LicenceDocumentTypeCode.PermanentResidentCard)
	// 	);
	// }

	// get governmentIssuedPhotoTypeCode(): string {
	// 	if (!this.showAdditionalGovIdData) return '';
	// 	return this.permitModelData.additionalGovIdData.governmentIssuedPhotoTypeCode ?? '';
	// }
	// get governmentIssuedPhotoExpiryDate(): string {
	// 	if (!this.showAdditionalGovIdData) return '';
	// 	return this.permitModelData.additionalGovIdData.expiryDate ?? '';
	// }
	// get governmentIssuedPhotoAttachments(): File[] {
	// 	if (!this.showAdditionalGovIdData) return [];
	// 	return this.permitModelData.additionalGovIdData.attachments ?? [];
	// }

	get hasBcDriversLicence(): string {
		return this.permitModelData.bcDriversLicenceData.hasBcDriversLicence ?? '';
	}
	get bcDriversLicenceNumber(): string {
		return this.permitModelData.bcDriversLicenceData.bcDriversLicenceNumber ?? '';
	}

	get hairColourCode(): string {
		return this.permitModelData.characteristicsData.hairColourCode ?? '';
	}
	get eyeColourCode(): string {
		return this.permitModelData.characteristicsData.eyeColourCode ?? '';
	}
	get height(): string {
		return this.permitModelData.characteristicsData.height ?? '';
	}
	get heightInches(): string {
		return this.permitModelData.characteristicsData.heightInches ?? '';
	}
	get heightUnitCode(): string {
		return this.permitModelData.characteristicsData.heightUnitCode ?? '';
	}
	get weight(): string {
		return this.permitModelData.characteristicsData.weight ?? '';
	}
	get weightUnitCode(): string {
		return this.permitModelData.characteristicsData.weightUnitCode ?? '';
	}

	get useBcServicesCardPhoto(): string {
		return this.permitModelData.photographOfYourselfData.useBcServicesCardPhoto ?? '';
	}
	get photoOfYourselfAttachments(): File[] {
		return this.permitModelData.photographOfYourselfData.attachments ?? [];
	}

	get contactEmailAddress(): string {
		return this.permitModelData.contactInformationData?.contactEmailAddress ?? '';
	}
	get contactPhoneNumber(): string {
		return this.permitModelData.contactInformationData?.contactPhoneNumber ?? '';
	}

	get residentialAddressLine1(): string {
		return this.permitModelData.residentialAddressData?.addressLine1 ?? '';
	}
	get residentialAddressLine2(): string {
		return this.permitModelData.residentialAddressData?.addressLine2 ?? '';
	}
	get residentialCity(): string {
		return this.permitModelData.residentialAddressData?.city ?? '';
	}
	get residentialPostalCode(): string {
		return this.permitModelData.residentialAddressData?.postalCode ?? '';
	}
	get residentialProvince(): string {
		return this.permitModelData.residentialAddressData?.province ?? '';
	}
	get residentialCountry(): string {
		return this.permitModelData.residentialAddressData?.country ?? '';
	}
	get isMailingTheSameAsResidential(): string {
		return this.permitModelData.residentialAddressData?.isMailingTheSameAsResidential ?? '';
	}

	get mailingAddressLine1(): string {
		return this.permitModelData.mailingAddressData?.addressLine1 ?? '';
	}
	get mailingAddressLine2(): string {
		return this.permitModelData.mailingAddressData?.addressLine2 ?? '';
	}
	get mailingCity(): string {
		return this.permitModelData.mailingAddressData?.city ?? '';
	}
	get mailingPostalCode(): string {
		return this.permitModelData.mailingAddressData?.postalCode ?? '';
	}
	get mailingProvince(): string {
		return this.permitModelData.mailingAddressData?.province ?? '';
	}
	get mailingCountry(): string {
		return this.permitModelData.mailingAddressData?.country ?? '';
	}

	// get categoryList(): Array<WorkerCategoryTypeCode> {
	// 	const list: Array<WorkerCategoryTypeCode> = [];
	// 	if (this.permitModelData.categoryArmouredCarGuardFormGroup.isInclude) {
	// 		list.push(WorkerCategoryTypeCode.ArmouredCarGuard);
	// 	}
	// 	if (this.permitModelData.categoryBodyArmourSalesFormGroup.isInclude) {
	// 		list.push(WorkerCategoryTypeCode.BodyArmourSales);
	// 	}
	// 	if (this.permitModelData.categoryClosedCircuitTelevisionInstallerFormGroup.isInclude) {
	// 		list.push(WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller);
	// 	}
	// 	if (this.permitModelData.categoryElectronicLockingDeviceInstallerFormGroup.isInclude) {
	// 		list.push(WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller);
	// 	}
	// 	if (this.permitModelData.categoryFireInvestigatorFormGroup.isInclude) {
	// 		list.push(WorkerCategoryTypeCode.FireInvestigator);
	// 	}
	// 	if (this.permitModelData.categoryLocksmithFormGroup.isInclude) {
	// 		list.push(WorkerCategoryTypeCode.Locksmith);
	// 	}
	// 	if (this.permitModelData.categoryLocksmithSupFormGroup.isInclude) {
	// 		list.push(WorkerCategoryTypeCode.LocksmithUnderSupervision);
	// 	}
	// 	if (this.permitModelData.categoryPrivateInvestigatorFormGroup.isInclude) {
	// 		list.push(WorkerCategoryTypeCode.PrivateInvestigator);
	// 	}
	// 	if (this.permitModelData.categoryPrivateInvestigatorSupFormGroup.isInclude) {
	// 		list.push(WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision);
	// 	}
	// 	if (this.permitModelData.categorySecurityAlarmInstallerFormGroup.isInclude) {
	// 		list.push(WorkerCategoryTypeCode.SecurityAlarmInstaller);
	// 	}
	// 	if (this.permitModelData.categorySecurityAlarmInstallerSupFormGroup.isInclude) {
	// 		list.push(WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision);
	// 	}
	// 	if (this.permitModelData.categorySecurityAlarmMonitorFormGroup.isInclude) {
	// 		list.push(WorkerCategoryTypeCode.SecurityAlarmMonitor);
	// 	}
	// 	if (this.permitModelData.categorySecurityAlarmResponseFormGroup.isInclude) {
	// 		list.push(WorkerCategoryTypeCode.SecurityAlarmResponse);
	// 	}
	// 	if (this.permitModelData.categorySecurityAlarmSalesFormGroup.isInclude) {
	// 		list.push(WorkerCategoryTypeCode.SecurityAlarmSales);
	// 	}
	// 	if (this.permitModelData.categorySecurityConsultantFormGroup.isInclude) {
	// 		list.push(WorkerCategoryTypeCode.SecurityConsultant);
	// 	}
	// 	if (this.permitModelData.categorySecurityGuardFormGroup.isInclude) {
	// 		list.push(WorkerCategoryTypeCode.SecurityGuard);
	// 	}
	// 	if (this.permitModelData.categorySecurityGuardSupFormGroup.isInclude) {
	// 		list.push(WorkerCategoryTypeCode.SecurityGuardUnderSupervision);
	// 	}

	// 	return list;
	// }

	// get isAnyDocuments(): boolean {
	// 	return (
	// 		this.showArmouredCarGuard ||
	// 		this.showFireInvestigator ||
	// 		this.showLocksmith ||
	// 		this.showPrivateInvestigator ||
	// 		this.showPrivateInvestigatorUnderSupervision ||
	// 		this.showSecurityAlarmInstaller ||
	// 		this.showSecurityConsultant ||
	// 		this.showSecurityGuard
	// 	);
	// }

	// get showArmouredCarGuard(): boolean {
	// 	return this.permitModelData.categoryArmouredCarGuardFormGroup?.isInclude ?? false;
	// }
	// get showFireInvestigator(): boolean {
	// 	return this.permitModelData.categoryFireInvestigatorFormGroup?.isInclude ?? false;
	// }
	// get showLocksmith(): boolean {
	// 	return this.permitModelData.categoryLocksmithFormGroup?.isInclude ?? false;
	// }
	// get showPrivateInvestigator(): boolean {
	// 	return this.permitModelData.categoryPrivateInvestigatorFormGroup?.isInclude ?? false;
	// }
	// get showPrivateInvestigatorUnderSupervision(): boolean {
	// 	return this.permitModelData.categoryPrivateInvestigatorSupFormGroup?.isInclude ?? false;
	// }
	// get showSecurityAlarmInstaller(): boolean {
	// 	return this.permitModelData.categorySecurityAlarmInstallerFormGroup?.isInclude ?? false;
	// }
	// get showSecurityConsultant(): boolean {
	// 	return this.permitModelData.categorySecurityConsultantFormGroup?.isInclude ?? false;
	// }
	// get showSecurityGuard(): boolean {
	// 	return this.permitModelData.categorySecurityGuardFormGroup?.isInclude ?? false;
	// }
}
