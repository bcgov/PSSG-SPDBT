import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
	ApplicationTypeCode,
	ArmouredVehiclePermitReasonCode,
	BodyArmourPermitReasonCode,
	LicenceFeeResponse,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { UtilService } from '@app/core/services/util.service';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';
import { BooleanTypeCode } from 'src/app/core/code-types/model-desc.models';

@Component({
	selector: 'app-step-permit-summary-review-update-authenticated',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Application Summary"
					subtitle="Review your information before submitting your application"
				></app-step-title>

				<div class="row">
					<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row mt-0 mb-4">
							<div class="col-lg-6 col-md-12">
								<div class="text-label d-block text-muted">
									Licence Holder Name <span *ngIf="hasBcscNameChanged">(New Name)</span>
								</div>
								<div class="summary-text-data">{{ licenceHolderName }}</div>
							</div>
							<div class="col-lg-6 col-md-12">
								<div class="text-label d-block text-muted">Licence Number</div>
								<div class="summary-text-data">{{ originalLicenceNumber }}</div>
							</div>
							<div class="col-lg-6 col-md-12" *ngIf="showPhotographOfYourself">
								<div class="text-label d-block text-muted">Photograph of Yourself</div>
								<div class="summary-text-data">
									<div *ngFor="let doc of photoOfYourselfAttachments; let i = index">
										{{ doc.name }}
									</div>
								</div>
							</div>
							<div class="col-lg-6 col-md-12">
								<div class="text-label d-block text-muted">Expiry Date</div>
								<div class="summary-text-data">
									{{ originalExpiryDate | formatDate : formalDateFormat }}
								</div>
							</div>
							<div class="col-lg-6 col-md-12">
								<div class="text-label d-block text-muted">Licence Term</div>
								<div class="summary-text-data">{{ originalLicenceTermCode | options : 'LicenceTermTypes' }}</div>
							</div>
							<div class="col-lg-6 col-md-12">
								<div class="text-label d-block text-muted">Print Permit</div>
								<div class="summary-text-data">{{ isReprint }}</div>
							</div>
							<div class="col-lg-6 col-md-12" *ngIf="licenceFee">
								<div class="text-label d-block text-muted">Reprint Fee</div>
								<div class="summary-text-data">
									{{ licenceFee | currency : 'CAD' : 'symbol-narrow' : '1.0' | default }}
								</div>
							</div>

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

							<ng-container *ngIf="showEmployerInformation">
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
											{{ supervisorPhoneNumber | mask : phoneMask }}
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
							</ng-container>
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
export class StepPermitSummaryReviewUpdateAuthenticatedComponent implements OnInit {
	permitModelData: any = {};
	showEmployerInformation = false;
	formalDateFormat = SPD_CONSTANTS.date.formalDateFormat;
	phoneMask = SPD_CONSTANTS.phone.displayMask;

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

	get licenceHolderName(): string {
		return this.utilService.getFullNameWithMiddle(
			this.permitModelData.personalInformationData.givenName,
			this.permitModelData.personalInformationData.middleName1,
			this.permitModelData.personalInformationData.middleName2,
			this.permitModelData.personalInformationData.surname
		);
	}
	get showPhotographOfYourself(): boolean {
		return this.hasGenderChanged && this.photoOfYourselfAttachments?.length > 0;
	}

	get hasBcscNameChanged(): boolean {
		return this.permitModelData.personalInformationData.hasBcscNameChanged ?? '';
	}
	get hasGenderChanged(): boolean {
		return this.permitModelData.personalInformationData.hasGenderChanged ?? '';
	}
	get originalLicenceNumber(): string {
		return this.permitModelData.originalLicenceNumber ?? '';
	}
	get originalExpiryDate(): string {
		return this.permitModelData.originalExpiryDate ?? '';
	}
	get originalLicenceTermCode(): string {
		return this.permitModelData.originalLicenceTermCode ?? '';
	}

	get licenceFee(): number | null {
		if (!this.licenceTermCode) {
			return null;
		}

		const businessTypeCode = this.permitModelData.originalBusinessTypeCode;
		const originalLicenceTermCode = this.permitModelData.originalLicenceTermCode;

		const fee = this.commonApplicationService
			.getLicenceTermsAndFees(
				this.workerLicenceTypeCode,
				ApplicationTypeCode.Update,
				businessTypeCode,
				originalLicenceTermCode
			)
			.find((item: LicenceFeeResponse) => item.licenceTermCode == this.licenceTermCode);
		return fee ? fee.amount ?? null : null;
	}

	get photoOfYourselfAttachments(): File[] {
		return this.permitModelData.photographOfYourselfData.updateAttachments ?? [];
	}

	get workerLicenceTypeCode(): WorkerLicenceTypeCode | null {
		return this.permitModelData.workerLicenceTypeData?.workerLicenceTypeCode ?? null;
	}

	get licenceTermCode(): string {
		return this.permitModelData.licenceTermData.licenceTermCode ?? '';
	}
	get isReprint(): string {
		return this.permitModelData.reprintLicenceData.reprintLicence ?? '';
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