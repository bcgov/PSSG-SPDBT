import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
	ApplicationTypeCode,
	PoliceOfficerRoleCode,
	WorkerCategoryTypeCode,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { BooleanTypeCode, WorkerCategoryTypes } from '@app/core/code-types/model-desc.models';
import { ControllingMemberCrcService } from '@app/core/services/controlling-member-crc.service';
import { UtilService } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-controlling-member-summary-review-anonymous',
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
												<div class="panel-header">Identification</div>
												<button
													mat-mini-fab
													color="primary"
													class="go-to-step-button"
													matTooltip="Go to Step 3"
													aria-label="Go to Step 3"
													(click)="$event.stopPropagation(); onEditStep(0)"
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
												<div class="text-label d-block text-muted">Name</div>
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

										<ng-container *ngIf="isNew">
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
									</div>
								</mat-expansion-panel>

								<mat-expansion-panel class="mb-2" [expanded]="true">
									<mat-expansion-panel-header>
										<mat-panel-title class="review-panel-title">
											<mat-toolbar class="d-flex justify-content-between">
												<div class="panel-header">Citizenship & Residency</div>
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
										<ng-container *ngIf="isNew">
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
											</div>

											<mat-divider class="mt-3 mb-2"></mat-divider>
										</ng-container>

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

										<ng-container *ngIf="isNew">
											<mat-divider class="mt-3 mb-2"></mat-divider>

											<div class="text-minor-heading">BC Driver's Licence</div>
											<div class="row mt-0">
												<div class="col-lg-6 col-md-12">
													<div class="text-label d-block text-muted">BC Driver's Licence</div>
													<div class="summary-text-data">{{ bcDriversLicenceNumber | default }}</div>
												</div>
											</div>
										</ng-container>
									</div>
								</mat-expansion-panel>

								<mat-expansion-panel class="mb-2" [expanded]="true">
									<mat-expansion-panel-header>
										<mat-panel-title class="review-panel-title">
											<mat-toolbar class="d-flex justify-content-between">
												<div class="panel-header">Background</div>
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
										<ng-container *ngIf="isNew">
											<div class="text-minor-heading mt-4">Business Involvement</div>
											<div class="row mt-0">
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted">Criminal Charges, Convictions, or Lawsuits</div>
													<div class="summary-text-data">{{ hasCriminalHistory }}</div>
												</div>
												<div class="col-lg-8 col-md-12" *ngIf="criminalHistoryDetail">
													<div class="text-label d-block text-muted">Criminal History Details</div>
													<div class="summary-text-data">{{ criminalHistoryDetail }}</div>
												</div>
											</div>
											<div class="row mt-0">
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted">Bankruptcy History</div>
													<div class="summary-text-data">{{ hasBankruptcyHistory }}</div>
												</div>
												<div class="col-lg-8 col-md-12" *ngIf="bankruptcyHistoryDetail">
													<div class="text-label d-block text-muted">Bankruptcy History Details</div>
													<div class="summary-text-data">{{ bankruptcyHistoryDetail }}</div>
												</div>
											</div>
											<mat-divider class="mt-3 mb-2"></mat-divider>
										</ng-container>

										<div class="text-minor-heading">Police Background</div>
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
export class StepControllingMemberSummaryReviewAnonymousComponent implements OnInit {
	controllingMemberModelData: any = {};

	booleanTypeCodes = BooleanTypeCode;
	policeOfficerRoleCodes = PoliceOfficerRoleCode;
	categoryTypeCodes = WorkerCategoryTypeCode;
	swlCategoryTypes = WorkerCategoryTypes;
	applicationTypeCodes = ApplicationTypeCode;

	@Input() applicationTypeCode!: ApplicationTypeCode;
	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	constructor(private controllingMembersService: ControllingMemberCrcService, private utilService: UtilService) {}

	ngOnInit(): void {
		this.controllingMemberModelData = {
			...this.controllingMembersService.controllingMembersModelFormGroup.getRawValue(),
		};
	}

	onEditStep(stepNumber: number) {
		this.editStep.emit(stepNumber);
	}

	onUpdateData(): void {
		this.controllingMemberModelData = {
			...this.controllingMembersService.controllingMembersModelFormGroup.getRawValue(),
		};
	}

	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}

	get workerLicenceTypeCode(): WorkerLicenceTypeCode | null {
		return this.controllingMemberModelData.workerLicenceTypeData?.workerLicenceTypeCode ?? null;
	}

	get isPoliceOrPeaceOfficer(): string {
		return this.controllingMemberModelData.policeBackgroundData.isPoliceOrPeaceOfficer ?? '';
	}
	get policeOfficerRoleCode(): string {
		return this.controllingMemberModelData.policeBackgroundData.policeOfficerRoleCode ?? '';
	}
	get otherOfficerRole(): string {
		return this.controllingMemberModelData.policeBackgroundData.otherOfficerRole ?? '';
	}
	get letterOfNoConflictAttachments(): File[] {
		return this.controllingMemberModelData.policeBackgroundData.attachments ?? [];
	}

	get hasBankruptcyHistory(): string {
		return this.controllingMemberModelData.bcSecurityLicenceHistoryData.hasBankruptcyHistory ?? '';
	}
	get bankruptcyHistoryDetail(): string {
		return this.controllingMemberModelData.bcSecurityLicenceHistoryData.hasBankruptcyHistory === BooleanTypeCode.Yes
			? this.controllingMemberModelData.bcSecurityLicenceHistoryData.bankruptcyHistoryDetail ?? ''
			: '';
	}
	get hasCriminalHistory(): string {
		return this.controllingMemberModelData.bcSecurityLicenceHistoryData.hasCriminalHistory ?? '';
	}
	get criminalHistoryDetail(): File[] {
		return this.controllingMemberModelData.bcSecurityLicenceHistoryData.hasCriminalHistory === BooleanTypeCode.Yes
			? this.controllingMemberModelData.bcSecurityLicenceHistoryData.criminalHistoryDetail ?? ''
			: '';
	}

	get givenName(): string {
		return this.controllingMemberModelData.personalInformationData.givenName ?? '';
	}
	get middleName1(): string {
		return this.controllingMemberModelData.personalInformationData.middleName1 ?? '';
	}
	get middleName2(): string {
		return this.controllingMemberModelData.personalInformationData.middleName2 ?? '';
	}
	get surname(): string {
		return this.controllingMemberModelData.personalInformationData.surname ?? '';
	}
	get genderCode(): string {
		return this.controllingMemberModelData.personalInformationData.genderCode ?? '';
	}
	get dateOfBirth(): string {
		return this.controllingMemberModelData.personalInformationData.dateOfBirth ?? '';
	}

	get previousNameFlag(): string {
		return this.controllingMemberModelData.aliasesData.previousNameFlag ?? '';
	}
	get aliases(): Array<any> {
		return this.controllingMemberModelData.aliasesData.aliases ?? [];
	}

	get isTreatedForMHC(): string {
		return this.controllingMemberModelData.mentalHealthConditionsData.isTreatedForMHC ?? '';
	}
	get mentalHealthConditionAttachments(): File[] {
		return this.controllingMemberModelData.mentalHealthConditionsData.attachments ?? [];
	}

	get proofOfFingerprintAttachments(): File[] {
		return this.controllingMemberModelData.fingerprintProofData.attachments ?? [];
	}

	get isCanadianCitizen(): string {
		return this.controllingMemberModelData.citizenshipData.isCanadianCitizen ?? '';
	}
	get canadianCitizenProofTypeCode(): string {
		return this.controllingMemberModelData.citizenshipData.isCanadianCitizen === BooleanTypeCode.Yes
			? this.controllingMemberModelData.citizenshipData.canadianCitizenProofTypeCode ?? ''
			: '';
	}
	get notCanadianCitizenProofTypeCode(): string {
		return this.controllingMemberModelData.citizenshipData.isCanadianCitizen === BooleanTypeCode.No
			? this.controllingMemberModelData.citizenshipData.notCanadianCitizenProofTypeCode ?? ''
			: '';
	}
	get proofOfAbility(): string {
		return this.controllingMemberModelData.citizenshipData.proofOfAbility ?? '';
	}
	get citizenshipExpiryDate(): string {
		return this.controllingMemberModelData.citizenshipData.expiryDate ?? '';
	}
	get citizenshipAttachments(): File[] {
		return this.controllingMemberModelData.citizenshipData.attachments ?? [];
	}
	get governmentIssuedPhotoTypeCode(): string {
		return this.showAdditionalGovIdData
			? this.controllingMemberModelData.citizenshipData.governmentIssuedPhotoTypeCode
			: '';
	}
	get governmentIssuedPhotoExpiryDate(): string {
		return this.showAdditionalGovIdData
			? this.controllingMemberModelData.citizenshipData.governmentIssuedExpiryDate
			: '';
	}
	get governmentIssuedPhotoAttachments(): File[] {
		return this.showAdditionalGovIdData
			? this.controllingMemberModelData.citizenshipData.governmentIssuedAttachments
			: [];
	}

	get showAdditionalGovIdData(): boolean {
		return this.utilService.getControllingMemberCrcShowAdditionalGovIdData(
			this.controllingMemberModelData.citizenshipData.isCanadianCitizen == BooleanTypeCode.Yes,
			this.controllingMemberModelData.citizenshipData.canadianCitizenProofTypeCode,
			this.controllingMemberModelData.citizenshipData.notCanadianCitizenProofTypeCode
		);
	}

	get bcDriversLicenceNumber(): string {
		return this.controllingMemberModelData.bcDriversLicenceData.hasBcDriversLicence === BooleanTypeCode.Yes
			? this.controllingMemberModelData.bcDriversLicenceData.bcDriversLicenceNumber ?? ''
			: '';
	}

	get emailAddress(): string {
		return this.controllingMemberModelData.personalInformationData?.emailAddress ?? '';
	}
	get phoneNumber(): string {
		return this.controllingMemberModelData.personalInformationData?.phoneNumber ?? '';
	}

	get residentialAddressLine1(): string {
		return this.controllingMemberModelData.residentialAddressData?.addressLine1 ?? '';
	}
	get residentialAddressLine2(): string {
		return this.controllingMemberModelData.residentialAddressData?.addressLine2 ?? '';
	}
	get residentialCity(): string {
		return this.controllingMemberModelData.residentialAddressData?.city ?? '';
	}
	get residentialPostalCode(): string {
		return this.controllingMemberModelData.residentialAddressData?.postalCode ?? '';
	}
	get residentialProvince(): string {
		return this.controllingMemberModelData.residentialAddressData?.province ?? '';
	}
	get residentialCountry(): string {
		return this.controllingMemberModelData.residentialAddressData?.country ?? '';
	}
}
