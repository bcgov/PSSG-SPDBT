import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
	ApplicationTypeCode,
	ArmouredVehiclePermitReasonCode,
	BodyArmourPermitReasonCode,
	BusinessTypeCode,
	LicenceDocumentTypeCode,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { UtilService } from '@app/core/services/util.service';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';
import { BooleanTypeCode } from 'src/app/core/code-types/model-desc.models';

@Component({
	selector: 'app-step-permit-summary-authenticated',
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
													<div class="panel-header">Permit Selection</div>
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
											<div class="text-minor-heading mt-4">Permit Information</div>
											<div class="row mt-0">
												<div class="col-lg-3 col-md-12">
													<div class="text-label d-block text-muted">Permit Type</div>
													<div class="summary-text-data">
														{{ workerLicenceTypeCode | options : 'WorkerLicenceTypes' }}
													</div>
												</div>
												<div class="col-lg-3 col-md-12">
													<div class="text-label d-block text-muted">Application Type</div>
													<div class="summary-text-data">
														{{ applicationTypeCode | options : 'ApplicationTypes' }}
													</div>
												</div>
												<div class="col-lg-3 col-md-12">
													<div class="text-label d-block text-muted">Permit Term</div>
													<div class="summary-text-data">{{ licenceTermCode | options : 'LicenceTermTypes' }}</div>
												</div>
												<div class="col-lg-3 col-md-12">
													<div class="text-label d-block text-muted">Fee</div>
													<div class="summary-text-data">
														{{ licenceFee | currency : 'CAD' : 'symbol-narrow' : '1.0' | default }}
													</div>
												</div>
												<!-- <ng-container *ngIf="applicationTypeCode !== applicationTypeCodes.Update">
													<div class="col-lg-3 col-md-12">
														<div class="text-label d-block text-muted">Print Permit</div>
														<div class="summary-text-data">{{ isPrintPermit }}</div>
													</div>
												</ng-container> -->
											</div>

											<ng-container *ngIf="hasExpiredLicence === booleanTypeCodes.Yes">
												<mat-divider class="mt-3 mb-2"></mat-divider>
												<div class="text-minor-heading">Expired Permit</div>
												<div class="row mt-0">
													<div class="col-lg-4 col-md-12">
														<div class="text-label d-block text-muted">Expired Permit Number</div>
														<div class="summary-text-data">{{ expiredLicenceNumber | default }}</div>
													</div>
													<div class="col-lg-4 col-md-12">
														<div class="text-label d-block text-muted">Expired Permit Expiry Date</div>
														<div class="summary-text-data">
															{{ expiredLicenceExpiryDate | formatDate | default }}
														</div>
													</div>
												</div>
											</ng-container>
											<mat-divider class="mt-3 mb-2"></mat-divider>

											<div class="text-minor-heading mt-4">Purpose and Rationale</div>
											<div class="row mt-0">
												<div class="col-lg-6 col-md-12">
													<div class="text-label d-block text-muted">Reason to Require a Permit</div>
													<div class="summary-text-data">
														{{ reasonForRequirement }}
													</div>
												</div>
												<div class="col-lg-6 col-md-12" *ngIf="isOtherReason">
													<div class="text-label d-block text-muted">Other Reason</div>
													<div class="summary-text-data">
														{{ otherReason }}
													</div>
												</div>
												<div class="col-12">
													<div class="text-label d-block text-muted">Rationale</div>
													<div class="summary-text-data">
														{{ rationale }}
													</div>
												</div>
												<div class="col-lg-6 col-md-12" *ngIf="isRationaleAttachments">
													<div class="text-label d-block text-muted">Rationale Supporting Documents</div>
													<div class="summary-text-data">
														<div *ngFor="let doc of rationaleAttachments; let i = index">
															{{ doc.name }}
														</div>
													</div>
												</div>
											</div>
										</div>
									</mat-expansion-panel>

									<mat-expansion-panel class="mb-2" [expanded]="true" *ngIf="showEmployerInformation">
										<mat-expansion-panel-header>
											<mat-panel-title class="review-panel-title">
												<mat-toolbar class="d-flex justify-content-between">
													<div class="panel-header">Employer Information</div>
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
											<div class="text-minor-heading">Business Name</div>
											<div class="row mt-0">
												<div class="col-lg-6 col-md-12">
													<div class="text-label d-block text-muted">Business Name</div>
													<div class="summary-text-data">
														{{ employerName }}
													</div>
												</div>
												<div class="col-lg-6 col-md-12">
													<div class="text-label d-block text-muted">Supervisor's Name</div>
													<div class="summary-text-data">
														{{ supervisorName }}
													</div>
												</div>
												<div class="col-lg-6 col-md-12">
													<div class="text-label d-block text-muted">Phone Number</div>
													<div class="summary-text-data">
														{{ supervisorEmailAddress }}
													</div>
												</div>
												<div class="col-lg-6 col-md-12">
													<div class="text-label d-block text-muted">Email Address</div>
													<div class="summary-text-data">
														{{ supervisorPhoneNumber | mask : constants.phone.displayMask }}
													</div>
												</div>
											</div>
											<mat-divider class="mt-3 mb-2"></mat-divider>

											<div class="text-minor-heading">Business's Primary Address</div>
											<div class="row mt-0">
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted">Address Line 1</div>
													<div class="summary-text-data">{{ businessAddressLine1 | default }}</div>
												</div>
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted">Address Line 2</div>
													<div class="summary-text-data">{{ businessAddressLine2 | default }}</div>
												</div>
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted">City</div>
													<div class="summary-text-data">{{ businessCity | default }}</div>
												</div>
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted">Postal Code</div>
													<div class="summary-text-data">{{ businessPostalCode | default }}</div>
												</div>
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted">Province</div>
													<div class="summary-text-data">
														{{ businessProvince | default }}
													</div>
												</div>
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted">Country</div>
													<div class="summary-text-data">
														{{ businessCountry | default }}
													</div>
												</div>
											</div>
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
											<ng-container *ngIf="applicationTypeCode !== applicationTypeCodes.Update">
												<div class="text-minor-heading">Citizenship</div>
												<div class="row mt-0">
													<div class="col-lg-6 col-md-12">
														<div class="text-label d-block text-muted">Canadian Citizen</div>
														<div class="summary-text-data">{{ isCanadianCitizen }}</div>
													</div>
													<div class="col-lg-6 col-md-12" *ngIf="isCanadianCitizen === booleanTypeCodes.No">
														<div class="text-label d-block text-muted">Resident of Canada</div>
														<div class="summary-text-data">{{ isCanadianResident }}</div>
													</div>
													<div class="col-lg-6 col-md-12">
														<div class="text-label d-block text-muted">
															<span *ngIf="canadianCitizenProofTypeCode">
																{{ canadianCitizenProofTypeCode | options : 'ProofOfCanadianCitizenshipTypes' }}
															</span>
															<span *ngIf="proofOfResidentStatusCode">
																{{ proofOfResidentStatusCode | options : 'PermitProofOfResidenceStatusTypes' }}
															</span>
															<span *ngIf="proofOfCitizenshipCode">
																{{ proofOfCitizenshipCode | options : 'PermitProofOfCitizenshipTypes' }}
															</span>
														</div>
														<div class="summary-text-data">
															<div *ngFor="let doc of attachments; let i = index">
																{{ doc.name }}
															</div>
														</div>
													</div>

													<div class="col-lg-6 col-md-12" *ngIf="governmentIssuedPhotoTypeCode">
														<div class="text-label d-block text-muted">
															{{ governmentIssuedPhotoTypeCode | options : 'GovernmentIssuedPhotoIdTypes' }}
														</div>
														<div class="summary-text-data">
															<div *ngFor="let doc of governmentIssuedPhotoAttachments; let i = index">
																{{ doc.name }}
															</div>
														</div>
													</div>
												</div>
												<mat-divider class="mt-3 mb-2"></mat-divider>
											</ng-container>

											<div class="text-minor-heading">Identification</div>
											<div class="row mt-0">
												<div class="col-lg-6 col-md-12">
													<div class="text-label d-block text-muted">Photograph of Yourself</div>
													<div class="summary-text-data">
														<div *ngFor="let doc of photoOfYourselfAttachments; let i = index">
															{{ doc.name }}
														</div>
													</div>
												</div>

												<ng-container *ngIf="applicationTypeCode !== applicationTypeCodes.Update">
													<div class="col-lg-6 col-md-12">
														<div class="text-label d-block text-muted">BC Driver's Licence</div>
														<div class="summary-text-data">{{ bcDriversLicenceNumber | default }}</div>
													</div>
												</ng-container>
											</div>

											<ng-container *ngIf="applicationTypeCode !== applicationTypeCodes.Update">
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
											</ng-container>
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
export class StepPermitSummaryAuthenticatedComponent implements OnInit {
	permitModelData: any = {};
	showEmployerInformation = false;

	constants = SPD_CONSTANTS;
	applicationTypeCodes = ApplicationTypeCode;
	booleanTypeCodes = BooleanTypeCode;

	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	constructor(
		private permitApplicationService: PermitApplicationService,
		private commonApplicationService: CommonApplicationService,
		private utilService: UtilService,
		private optionsPipe: OptionsPipe
	) {}

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

	get workerLicenceTypeCode(): WorkerLicenceTypeCode | null {
		return this.permitModelData.workerLicenceTypeData?.workerLicenceTypeCode ?? null;
	}

	get applicationTypeCode(): ApplicationTypeCode | null {
		return this.permitModelData.applicationTypeData?.applicationTypeCode ?? null;
	}

	get licenceFee(): number | null {
		const fee = this.commonApplicationService
			.getLicenceTermsAndFees(this.workerLicenceTypeCode, this.applicationTypeCode, BusinessTypeCode.None)
			.find((item) => item.applicationTypeCode === this.permitModelData.applicationTypeData.applicationTypeCode);

		return fee ? fee.amount ?? null : null;
	}

	get licenceTermCode(): string {
		return this.permitModelData.licenceTermData.licenceTermCode ?? '';
	}
	get isPrintPermit(): string {
		return this.permitModelData.printPermitData.isPrintPermit ?? '';
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

	get isCanadianCitizen(): string {
		return this.permitModelData.citizenshipData.isCanadianCitizen ?? '';
	}
	get canadianCitizenProofTypeCode(): string {
		return this.permitModelData.citizenshipData.isCanadianCitizen === BooleanTypeCode.Yes
			? this.permitModelData.citizenshipData.canadianCitizenProofTypeCode ?? ''
			: '';
	}
	get isCanadianResident(): string {
		return this.permitModelData.citizenshipData.isCanadianCitizen === BooleanTypeCode.No
			? this.permitModelData.citizenshipData.isCanadianResident ?? ''
			: '';
	}
	get proofOfResidentStatusCode(): string {
		return this.permitModelData.citizenshipData.isCanadianCitizen === BooleanTypeCode.No &&
			this.permitModelData.citizenshipData.isCanadianResident === BooleanTypeCode.Yes
			? this.permitModelData.citizenshipData.proofOfResidentStatusCode ?? ''
			: '';
	}
	get proofOfCitizenshipCode(): string {
		return this.permitModelData.citizenshipData.isCanadianCitizen === BooleanTypeCode.No &&
			this.permitModelData.citizenshipData.isCanadianResident === BooleanTypeCode.No
			? this.permitModelData.citizenshipData.proofOfCitizenshipCode ?? ''
			: '';
	}
	get citizenshipExpiryDate(): string {
		return this.permitModelData.citizenshipData.expiryDate ?? '';
	}
	get attachments(): File[] {
		return this.permitModelData.citizenshipData.attachments ?? [];
	}

	get showAdditionalGovIdData(): boolean {
		return this.utilService.getPermitShowAdditionalGovIdData(
			this.isCanadianCitizen == BooleanTypeCode.Yes,
			this.isCanadianResident == BooleanTypeCode.Yes,
			this.canadianCitizenProofTypeCode as LicenceDocumentTypeCode,
			this.proofOfResidentStatusCode as LicenceDocumentTypeCode,
			this.proofOfCitizenshipCode as LicenceDocumentTypeCode
		);
	}

	get governmentIssuedPhotoTypeCode(): string {
		return this.showAdditionalGovIdData ? this.permitModelData.citizenshipData.governmentIssuedPhotoTypeCode : '';
	}
	get governmentIssuedPhotoExpiryDate(): string {
		return this.showAdditionalGovIdData ? this.permitModelData.citizenshipData.governmentIssuedExpiryDate : '';
	}
	get governmentIssuedPhotoAttachments(): File[] {
		return this.showAdditionalGovIdData ? this.permitModelData.citizenshipData.governmentIssuedAttachments : [];
	}

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

	get photoOfYourselfAttachments(): File[] {
		return this.permitModelData.photographOfYourselfData.attachments ?? [];
	}

	get reasonForRequirement(): string {
		const reasonList = [];
		this.showEmployerInformation = false;

		if (this.workerLicenceTypeCode === WorkerLicenceTypeCode.ArmouredVehiclePermit) {
			const armouredVehicleRequirement = this.permitModelData.permitRequirementData.armouredVehicleRequirementFormGroup;
			if (armouredVehicleRequirement.isPersonalProtection) {
				reasonList.push(
					this.optionsPipe.transform(
						ArmouredVehiclePermitReasonCode.PersonalProtection,
						'ArmouredVehiclePermitReasonTypes'
					)
				);
			}
			if (armouredVehicleRequirement.isProtectionOfAnotherPerson) {
				reasonList.push(
					this.optionsPipe.transform(
						ArmouredVehiclePermitReasonCode.ProtectionOfAnotherPerson,
						'ArmouredVehiclePermitReasonTypes'
					)
				);
			}
			if (armouredVehicleRequirement.isProtectionOfPersonalProperty) {
				reasonList.push(
					this.optionsPipe.transform(
						ArmouredVehiclePermitReasonCode.ProtectionOfPersonalProperty,
						'ArmouredVehiclePermitReasonTypes'
					)
				);
			}
			if (armouredVehicleRequirement.isProtectionOfOthersProperty) {
				reasonList.push(
					this.optionsPipe.transform(
						ArmouredVehiclePermitReasonCode.ProtectionOfOtherProperty,
						'ArmouredVehiclePermitReasonTypes'
					)
				);
			}
			if (armouredVehicleRequirement.isMyEmployment) {
				this.showEmployerInformation = true;
				reasonList.push(
					this.optionsPipe.transform(ArmouredVehiclePermitReasonCode.MyEmployment, 'ArmouredVehiclePermitReasonTypes')
				);
			}
			if (armouredVehicleRequirement.isOther) {
				reasonList.push(
					this.optionsPipe.transform(ArmouredVehiclePermitReasonCode.Other, 'ArmouredVehiclePermitReasonTypes')
				);
			}
		} else {
			const bodyArmourRequirementFormGroup = this.permitModelData.permitRequirementData.bodyArmourRequirementFormGroup;
			if (bodyArmourRequirementFormGroup.isOutdoorRecreation) {
				reasonList.push(
					this.optionsPipe.transform(BodyArmourPermitReasonCode.OutdoorRecreation, 'BodyArmourPermitReasonTypes')
				);
			}
			if (bodyArmourRequirementFormGroup.isPersonalProtection) {
				reasonList.push(
					this.optionsPipe.transform(BodyArmourPermitReasonCode.PersonalProtection, 'BodyArmourPermitReasonTypes')
				);
			}
			if (bodyArmourRequirementFormGroup.isMyEmployment) {
				this.showEmployerInformation = true;
				reasonList.push(
					this.optionsPipe.transform(BodyArmourPermitReasonCode.MyEmployment, 'BodyArmourPermitReasonTypes')
				);
			}
			if (bodyArmourRequirementFormGroup.isTravelForConflict) {
				reasonList.push(
					this.optionsPipe.transform(
						BodyArmourPermitReasonCode.TravelInResponseToInternationalConflict,
						'BodyArmourPermitReasonTypes'
					)
				);
			}
			if (bodyArmourRequirementFormGroup.isOther) {
				reasonList.push(this.optionsPipe.transform(BodyArmourPermitReasonCode.Other, 'BodyArmourPermitReasonTypes'));
			}
		}
		return reasonList.join(', ');
	}
	get isOtherReason(): boolean {
		if (this.workerLicenceTypeCode === WorkerLicenceTypeCode.ArmouredVehiclePermit) {
			const armouredVehicleRequirement = this.permitModelData.permitRequirementData.armouredVehicleRequirementFormGroup;
			return armouredVehicleRequirement.isOther;
		} else {
			const bodyArmourRequirementFormGroup = this.permitModelData.permitRequirementData.bodyArmourRequirementFormGroup;
			return bodyArmourRequirementFormGroup.isOther;
		}
	}
	get otherReason(): boolean {
		return this.permitModelData.permitRequirementData.otherReason;
	}

	get rationale(): string {
		return this.permitModelData.permitRationaleData?.rationale ?? '';
	}
	get isRationaleAttachments(): boolean {
		return this.permitModelData.permitRationaleData?.attachments?.length > 0;
	}
	get rationaleAttachments(): File[] {
		return this.permitModelData.permitRationaleData?.attachments ?? [];
	}

	get employerName(): string {
		return this.permitModelData.employerData?.employerName ?? '';
	}
	get supervisorName(): string {
		return this.permitModelData.employerData?.supervisorName ?? '';
	}
	get supervisorEmailAddress(): string {
		return this.permitModelData.employerData?.supervisorEmailAddress ?? '';
	}
	get supervisorPhoneNumber(): string {
		return this.permitModelData.employerData?.supervisorPhoneNumber ?? '';
	}
	get businessAddressLine1(): string {
		return this.permitModelData.employerData?.addressLine1 ?? '';
	}
	get businessAddressLine2(): string {
		return this.permitModelData.employerData?.addressLine2 ?? '';
	}
	get businessCity(): string {
		return this.permitModelData.employerData?.city ?? '';
	}
	get businessPostalCode(): string {
		return this.permitModelData.employerData?.postalCode ?? '';
	}
	get businessProvince(): string {
		return this.permitModelData.employerData?.province ?? '';
	}
	get businessCountry(): string {
		return this.permitModelData.employerData?.country ?? '';
	}
}