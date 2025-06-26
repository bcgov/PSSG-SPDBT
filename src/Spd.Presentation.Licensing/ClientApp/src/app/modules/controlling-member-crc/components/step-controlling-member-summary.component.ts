import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApplicationTypeCode, PoliceOfficerRoleCode, ServiceTypeCode, WorkerCategoryTypeCode } from '@app/api/models';
import { BooleanTypeCode, WorkerCategoryTypes } from '@app/core/code-types/model-desc.models';
import { ControllingMemberCrcService } from '@app/core/services/controlling-member-crc.service';
import { UtilService } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-controlling-member-summary',
	template: `
		<app-step-section
			heading="Application summary"
			subheading="Review your information before submitting your application"
		>
			<div class="row">
				<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mb-3 mx-auto">
					<mat-accordion multi="true">
						<mat-expansion-panel class="mb-2" [expanded]="true">
							<mat-expansion-panel-header>
								<mat-panel-title class="review-panel-title">
									<mat-toolbar class="d-flex justify-content-between">
										<div class="panel-header">Personal Information</div>
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
								<div class="text-minor-heading-small mt-4">Personal Information</div>
								<div class="row mt-0">
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Name</div>
										<div class="summary-text-data">
											{{ givenName }} {{ middleName1 }} {{ middleName2 }}
											{{ surname }}
										</div>
									</div>
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Date of Birth</div>
										<div class="summary-text-data">
											{{ dateOfBirth | formatDate | default }}
										</div>
									</div>
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Sex</div>
										<div class="summary-text-data">
											{{ genderCode | options: 'GenderTypes' | default }}
										</div>
									</div>
								</div>

								<div class="text-minor-heading-small mt-4">Contact</div>
								<div class="row mt-0">
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Email Address</div>
										<div class="summary-text-data">{{ emailAddress | default }}</div>
									</div>
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Phone Number</div>
										<div class="summary-text-data">
											{{ phoneNumber | formatPhoneNumber | default }}
										</div>
									</div>
								</div>

								<ng-container *ngIf="isNew">
									<mat-divider class="mt-3 mb-2"></mat-divider>

									<div class="text-minor-heading-small">Aliases</div>
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

								<app-form-address-summary
									[formData]="controllingMemberModelData.residentialAddressData"
									headingLabel="Residential Address"
									[isAddressTheSame]="false"
								></app-form-address-summary>
							</div>
						</mat-expansion-panel>

						<mat-expansion-panel class="mb-2" [expanded]="true">
							<mat-expansion-panel-header>
								<mat-panel-title class="review-panel-title">
									<mat-toolbar class="d-flex justify-content-between">
										<div class="panel-header">
											<ng-container *ngIf="isNew; else citizenshipTitle"> Citizenship & Residency </ng-container>
											<ng-template #citizenshipTitle> Identification </ng-template>
										</div>
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
								<ng-container *ngIf="isNew">
									<div class="text-minor-heading-small">Identification</div>
									<div class="row mt-0">
										<div class="col-lg-6 col-md-12">
											<div class="text-label d-block text-muted">Canadian Citizen?</div>
											<div class="summary-text-data">{{ isCanadianCitizen }}</div>
										</div>
										<div class="col-lg-6 col-md-12">
											<div class="text-label d-block text-muted">
												<span *ngIf="canadianCitizenProofTypeCode">
													{{ canadianCitizenProofTypeCode | options: 'ProofOfCanadianCitizenshipTypes' }}
												</span>
												<span *ngIf="notCanadianCitizenProofTypeCode">
													{{ notCanadianCitizenProofTypeCode | options: 'ProofOfAbilityToWorkInCanadaTypes' }}
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
												{{ governmentIssuedPhotoTypeCode | options: 'GovernmentIssuedPhotoIdTypes' }}
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

								<div class="text-minor-heading-small">Fingerprints</div>
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

								<ng-container *ngIf="isNew && bcDriversLicenceNumber">
									<mat-divider class="mt-3 mb-2"></mat-divider>

									<div class="text-minor-heading-small">BC Driver's Licence</div>
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
								<div class="text-minor-heading-small mt-4">Business Involvement</div>
								<div class="row mt-0">
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Criminal Charges or Convictions</div>
										<div class="summary-text-data">{{ hasCriminalHistory }}</div>
									</div>
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Court Judgements</div>
										<div class="summary-text-data">{{ hasCourtJudgement }}</div>
									</div>
									<div class="col-lg-12 col-md-12" *ngIf="showCriminalHistoryDetail">
										<div class="text-label d-block text-muted">Criminal History Details</div>
										<div class="summary-text-data">{{ criminalHistoryDetail }}</div>
									</div>
								</div>
								<ng-container *ngIf="isNew">
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
								</ng-container>
								<mat-divider class="mt-3 mb-2"></mat-divider>

								<div class="text-minor-heading-small">Police Background</div>
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
													*ngIf="policeOfficerRoleCode !== policeOfficerRoleCodes.Other; else otherPoliceOfficerRole"
													>{{ policeOfficerRoleCode | options: 'PoliceOfficerRoleTypes' | default }}</span
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

								<div class="text-minor-heading-small">Mental Health Conditions</div>
								<div class="row mt-0">
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Mental Health Conditions</div>
										<div class="summary-text-data">{{ isTreatedForMHC }}</div>
									</div>
									<ng-container *ngIf="isTreatedForMHC === booleanTypeCodes.Yes">
										<div class="col-lg-8 col-md-12" *ngIf="mentalHealthConditionAttachments.length > 0">
											<div class="text-label d-block text-muted">Mental Health Condition Form</div>
											<div class="summary-text-data">
												<ul class="m-0">
													<ng-container *ngFor="let doc of mentalHealthConditionAttachments; let i = index">
														<li>{{ doc.name }}</li>
													</ng-container>
												</ul>
											</div>
										</div>
									</ng-container>
								</div>
							</div>
						</mat-expansion-panel>
					</mat-accordion>
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
	standalone: false,
})
export class StepControllingMemberSummaryComponent implements OnInit {
	controllingMemberModelData: any = {};

	booleanTypeCodes = BooleanTypeCode;
	policeOfficerRoleCodes = PoliceOfficerRoleCode;
	categoryTypeCodes = WorkerCategoryTypeCode;
	swlCategoryTypes = WorkerCategoryTypes;
	applicationTypeCodes = ApplicationTypeCode;

	@Input() applicationTypeCode!: ApplicationTypeCode;
	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	constructor(
		private controllingMembersService: ControllingMemberCrcService,
		private utilService: UtilService
	) {}

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

	get serviceTypeCode(): ServiceTypeCode | null {
		return this.controllingMemberModelData.serviceTypeData?.serviceTypeCode ?? null;
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
			? (this.controllingMemberModelData.bcSecurityLicenceHistoryData.bankruptcyHistoryDetail ?? '')
			: '';
	}
	get hasCriminalHistory(): string {
		return this.controllingMemberModelData.bcSecurityLicenceHistoryData.hasCriminalHistory ?? '';
	}
	get hasCourtJudgement(): string {
		return this.controllingMemberModelData.bcSecurityLicenceHistoryData.hasCourtJudgement ?? '';
	}
	get showCriminalHistoryDetail(): boolean {
		return this.hasCriminalHistory === BooleanTypeCode.Yes || this.hasCourtJudgement === BooleanTypeCode.Yes;
	}
	get criminalHistoryDetail(): File[] {
		return this.controllingMemberModelData.bcSecurityLicenceHistoryData.criminalHistoryDetail ?? '';
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
		if (this.controllingMemberModelData.mentalHealthConditionsData.isTreatedForMHC === BooleanTypeCode.Yes) {
			return this.controllingMemberModelData.mentalHealthConditionsData.attachments ?? [];
		}

		return [];
	}

	get proofOfFingerprintAttachments(): File[] {
		return this.controllingMemberModelData.fingerprintProofData.attachments ?? [];
	}

	get isCanadianCitizen(): string {
		return this.controllingMemberModelData.citizenshipData.isCanadianCitizen ?? '';
	}
	get canadianCitizenProofTypeCode(): string {
		return this.controllingMemberModelData.citizenshipData.isCanadianCitizen === BooleanTypeCode.Yes
			? (this.controllingMemberModelData.citizenshipData.canadianCitizenProofTypeCode ?? '')
			: '';
	}
	get notCanadianCitizenProofTypeCode(): string {
		return this.controllingMemberModelData.citizenshipData.isCanadianCitizen === BooleanTypeCode.No
			? (this.controllingMemberModelData.citizenshipData.notCanadianCitizenProofTypeCode ?? '')
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
			? (this.controllingMemberModelData.bcDriversLicenceData.bcDriversLicenceNumber ?? '')
			: '';
	}

	get emailAddress(): string {
		return this.controllingMemberModelData.contactInformationData?.emailAddress ?? '';
	}
	get phoneNumber(): string {
		return this.controllingMemberModelData.contactInformationData?.phoneNumber ?? '';
	}
}
