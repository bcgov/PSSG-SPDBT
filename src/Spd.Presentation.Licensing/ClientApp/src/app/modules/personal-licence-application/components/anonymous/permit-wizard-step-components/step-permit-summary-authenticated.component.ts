import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApplicationTypeCode, BizTypeCode, LicenceTermCode, ServiceTypeCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { PermitApplicationService } from '@app/core/services/permit-application.service';

@Component({
	selector: 'app-step-permit-summary-authenticated',
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
													{{ serviceTypeCode | options: 'ServiceTypes' }}
												</div>
											</div>
											<div class="col-lg-3 col-md-12">
												<div class="text-label d-block text-muted">Application Type</div>
												<div class="summary-text-data">
													{{ applicationTypeCode | options: 'ApplicationTypes' }}
												</div>
											</div>
											<div class="col-lg-3 col-md-12">
												<div class="text-label d-block text-muted">Permit Term</div>
												<div class="summary-text-data">{{ licenceTermCode | options: 'LicenceTermTypes' }}</div>
											</div>
											<div class="col-lg-3 col-md-12">
												<div class="text-label d-block text-muted">Fee</div>
												<div class="summary-text-data">
													{{ licenceFee | currency: 'CAD' : 'symbol-narrow' : '1.0' | default }}
												</div>
											</div>
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
										<div class="text-minor-heading">Purpose</div>
										<div class="row mt-0">
											<div class="col-lg-6 col-md-12">
												<div class="text-label d-block text-muted">{{ purposeLabel }}</div>
												<div class="summary-text-data">
													<ng-container *ngFor="let reason of purposeReasons; let i = index">
														<li>{{ reason }}</li>
													</ng-container>
												</div>
											</div>
											<div class="col-12" *ngIf="isOtherReason">
												<div class="text-label d-block text-muted">Other Reason</div>
												<div class="summary-text-data">
													{{ otherReason }}
												</div>
											</div>
										</div>

										<mat-divider class="mt-3 mb-2"></mat-divider>
										<div class="text-minor-heading">Rationale</div>
										<div class="row mt-0">
											<div class="col-12">
												<div class="text-label d-block text-muted">{{ rationaleLabel }}</div>
												<div class="summary-text-data">
													{{ rationale }}
												</div>
											</div>
											<div class="col-12" *ngIf="isRationaleAttachments">
												<div class="text-label d-block text-muted">Rationale Supporting Documents</div>
												<div class="summary-text-data">
													<ul class="m-0">
														<ng-container *ngFor="let doc of rationaleAttachments; let i = index">
															<li>{{ doc.name }}</li>
														</ng-container>
													</ul>
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
													{{ supervisorPhoneNumber | formatPhoneNumber }}
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
														{{ canadianCitizenProofTypeCode | options: 'ProofOfCanadianCitizenshipTypes' }}
													</span>
													<span *ngIf="proofOfResidentStatusCode">
														{{ proofOfResidentStatusCode | options: 'PermitProofOfResidenceStatusTypes' }}
													</span>
													<span *ngIf="proofOfCitizenshipCode">
														{{ proofOfCitizenshipCode | options: 'PermitProofOfCitizenshipTypes' }}
													</span>
												</div>
												<div class="summary-text-data">
													<ul class="m-0">
														<ng-container *ngFor="let doc of attachments; let i = index">
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
										<div class="text-minor-heading">Identification</div>
										<div class="row mt-0">
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

										<div class="row mt-0">
											<div class="col-lg-3 col-md-12">
												<div class="text-label d-block text-muted">Hair Colour</div>
												<div class="summary-text-data">
													{{ hairColourCode | options: 'HairColourTypes' }}
												</div>
											</div>
											<div class="col-lg-3 col-md-12">
												<div class="text-label d-block text-muted">Eye Colour</div>
												<div class="summary-text-data">
													{{ eyeColourCode | options: 'EyeColourTypes' }}
												</div>
											</div>
											<div class="col-lg-3 col-md-12">
												<div class="text-label d-block text-muted">Height</div>
												<div class="summary-text-data">
													{{ height }}
													{{ heightUnitCode | options: 'HeightUnitTypes' }}
													{{ heightInches }}
												</div>
											</div>
											<div class="col-lg-3 col-md-12">
												<div class="text-label d-block text-muted">Weight</div>
												<div class="summary-text-data">
													{{ weight }}
													{{ weightUnitCode | options: 'WeightUnitTypes' }}
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
export class StepPermitSummaryAuthenticatedComponent implements OnInit {
	permitModelData: any = {};

	booleanTypeCodes = BooleanTypeCode;

	@Input() showEmployerInformation!: boolean;

	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	constructor(
		private permitApplicationService: PermitApplicationService,
		private commonApplicationService: CommonApplicationService
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

	get serviceTypeCode(): ServiceTypeCode | null {
		return this.permitApplicationService.getSummaryserviceTypeCode(this.permitModelData);
	}
	get applicationTypeCode(): ApplicationTypeCode | null {
		return this.permitApplicationService.getSummaryapplicationTypeCode(this.permitModelData);
	}
	get licenceFee(): number | null {
		const fee = this.commonApplicationService.getLicenceFee(
			this.serviceTypeCode,
			this.applicationTypeCode,
			BizTypeCode.None,
			this.licenceTermCode
		);

		return fee ? (fee.amount ?? null) : null;
	}

	get licenceTermCode(): LicenceTermCode | null {
		return this.permitApplicationService.getSummarylicenceTermCode(this.permitModelData);
	}
	get hasExpiredLicence(): string {
		return this.permitApplicationService.getSummaryhasExpiredLicence(this.permitModelData);
	}
	get expiredLicenceNumber(): string {
		return this.permitApplicationService.getSummaryexpiredLicenceNumber(this.permitModelData);
	}
	get expiredLicenceExpiryDate(): string {
		return this.permitApplicationService.getSummaryexpiredLicenceExpiryDate(this.permitModelData);
	}

	get isCanadianCitizen(): string {
		return this.permitApplicationService.getSummaryisCanadianCitizen(this.permitModelData);
	}
	get canadianCitizenProofTypeCode(): string {
		return this.permitApplicationService.getSummarycanadianCitizenProofTypeCode(this.permitModelData);
	}
	get isCanadianResident(): string {
		return this.permitApplicationService.getSummaryisCanadianResident(this.permitModelData);
	}
	get proofOfResidentStatusCode(): string {
		return this.permitApplicationService.getSummaryproofOfResidentStatusCode(this.permitModelData);
	}
	get proofOfCitizenshipCode(): string {
		return this.permitApplicationService.getSummaryproofOfCitizenshipCode(this.permitModelData);
	}
	get citizenshipExpiryDate(): string {
		return this.permitApplicationService.getSummarycitizenshipExpiryDate(this.permitModelData);
	}
	get attachments(): File[] {
		return this.permitApplicationService.getSummaryattachments(this.permitModelData);
	}

	get showAdditionalGovIdData(): boolean {
		return this.permitApplicationService.getSummaryshowAdditionalGovIdData(this.permitModelData);
	}

	get governmentIssuedPhotoTypeCode(): string {
		return this.permitApplicationService.getSummarygovernmentIssuedPhotoTypeCode(this.permitModelData);
	}
	get governmentIssuedPhotoExpiryDate(): string {
		return this.permitApplicationService.getSummarygovernmentIssuedPhotoExpiryDate(this.permitModelData);
	}
	get governmentIssuedPhotoAttachments(): File[] {
		return this.permitApplicationService.getSummarygovernmentIssuedPhotoAttachments(this.permitModelData);
	}

	get bcDriversLicenceNumber(): string {
		return this.permitApplicationService.getSummarybcDriversLicenceNumber(this.permitModelData);
	}

	get hairColourCode(): string {
		return this.permitApplicationService.getSummaryhairColourCode(this.permitModelData);
	}
	get eyeColourCode(): string {
		return this.permitApplicationService.getSummaryeyeColourCode(this.permitModelData);
	}
	get height(): string {
		return this.permitApplicationService.getSummaryheight(this.permitModelData);
	}
	get heightInches(): string {
		return this.permitApplicationService.getSummaryheightInches(this.permitModelData);
	}
	get heightUnitCode(): string {
		return this.permitApplicationService.getSummaryheightUnitCode(this.permitModelData);
	}
	get weight(): string {
		return this.permitApplicationService.getSummaryweight(this.permitModelData);
	}
	get weightUnitCode(): string {
		return this.permitApplicationService.getSummaryweightUnitCode(this.permitModelData);
	}

	get photoOfYourselfAttachments(): File[] {
		return this.permitApplicationService.getSummaryphotoOfYourselfAttachments(this.permitModelData);
	}

	get purposeLabel(): string {
		return this.permitApplicationService.getSummarypurposeLabel(this.permitModelData);
	}
	get purposeReasons(): Array<string> {
		return this.permitApplicationService.getSummarypurposeReasons(this.permitModelData);
	}
	get isOtherReason(): boolean {
		return this.permitApplicationService.getSummaryisOtherReason(this.permitModelData);
	}
	get otherReason(): boolean {
		return this.permitApplicationService.getSummaryotherReason(this.permitModelData);
	}

	get rationaleLabel(): string {
		return this.permitApplicationService.getSummaryrationaleLabel(this.permitModelData);
	}
	get rationale(): string {
		return this.permitApplicationService.getSummaryrationale(this.permitModelData);
	}
	get isRationaleAttachments(): boolean {
		return this.permitApplicationService.getSummaryisRationaleAttachments(this.permitModelData);
	}
	get rationaleAttachments(): File[] {
		return this.permitApplicationService.getSummaryrationaleAttachments(this.permitModelData);
	}

	get employerName(): string {
		return this.permitApplicationService.getSummaryemployerName(this.permitModelData);
	}
	get supervisorName(): string {
		return this.permitApplicationService.getSummarysupervisorName(this.permitModelData);
	}
	get supervisorEmailAddress(): string {
		return this.permitApplicationService.getSummarysupervisorEmailAddress(this.permitModelData);
	}
	get supervisorPhoneNumber(): string {
		return this.permitApplicationService.getSummarysupervisorPhoneNumber(this.permitModelData);
	}
	get businessAddressLine1(): string {
		return this.permitApplicationService.getSummarybusinessAddressLine1(this.permitModelData);
	}
	get businessAddressLine2(): string {
		return this.permitApplicationService.getSummarybusinessAddressLine2(this.permitModelData);
	}
	get businessCity(): string {
		return this.permitApplicationService.getSummarybusinessCity(this.permitModelData);
	}
	get businessPostalCode(): string {
		return this.permitApplicationService.getSummarybusinessPostalCode(this.permitModelData);
	}
	get businessProvince(): string {
		return this.permitApplicationService.getSummarybusinessProvince(this.permitModelData);
	}
	get businessCountry(): string {
		return this.permitApplicationService.getSummarybusinessCountry(this.permitModelData);
	}
}
