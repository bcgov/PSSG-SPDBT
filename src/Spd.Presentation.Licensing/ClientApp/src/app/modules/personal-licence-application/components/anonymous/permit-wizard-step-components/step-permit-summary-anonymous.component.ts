import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApplicationTypeCode, BizTypeCode, LicenceTermCode, ServiceTypeCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { PermitApplicationService } from '@app/core/services/permit-application.service';

@Component({
	selector: 'app-step-permit-summary-anonymous',
	template: `
		<app-step-section title="Application summary" subtitle="Review your information before submitting your application">
			<div class="row">
				<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mb-3 mx-auto">
					<mat-accordion multi="true">
						<mat-expansion-panel class="mb-2" [expanded]="true">
							<mat-expansion-panel-header>
								<mat-panel-title class="review-panel-title">
									<mat-toolbar class="d-flex justify-content-between">
										<div class="panel-header">Permit Details</div>
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
								<div class="text-minor-heading-small mt-4">Permit Information</div>
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
									<div class="text-minor-heading-small">Expired Permit</div>
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
							</div>
						</mat-expansion-panel>

						<mat-expansion-panel class="mb-2" [expanded]="true">
							<mat-expansion-panel-header>
								<mat-panel-title class="review-panel-title">
									<mat-toolbar class="d-flex justify-content-between">
										<div class="panel-header">Purpose & Rationale</div>
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
								<app-permit-summary-purpose [permitModelData]="permitModelData"></app-permit-summary-purpose>

								<mat-divider class="mt-3 mb-2"></mat-divider>
								<app-permit-summary-rationale [permitModelData]="permitModelData"></app-permit-summary-rationale>

								<ng-container *ngIf="showEmployerInformation">
									<mat-divider class="mt-3 mb-2"></mat-divider>
									<app-permit-summary-employer-information
										[permitModelData]="permitModelData"
									></app-permit-summary-employer-information>
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
								<div class="text-minor-heading-small mt-4">Personal Information</div>
								<div class="row mt-0">
									<div class="col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">Applicant Name</div>
										<div class="summary-text-data">
											{{ applicantName }}
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
											{{ genderCode | options: 'GenderTypes' | default }}
										</div>
									</div>
								</div>

								<ng-container *ngIf="applicationTypeCode !== applicationTypeCodes.Update">
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

									<mat-divider class="mt-3 mb-2"></mat-divider>
									<div class="text-minor-heading-small">Citizenship</div>
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
									</div>
								</ng-container>

								<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.Update && photoOfYourselfAttachments">
									<mat-divider class="mt-3 mb-2"></mat-divider>
									<div class="text-minor-heading-small">Identification</div>
									<div class="row mt-0">
										<div class="col-lg-6 col-md-12">
											<div class="text-label d-block text-muted">Photograph of Yourself</div>
											<div class="summary-text-data">
												<ul class="m-0">
													<ng-container *ngFor="let doc of photoOfYourselfAttachments; let i = index">
														<li>{{ doc.name }}</li>
													</ng-container>
												</ul>
											</div>
										</div>
									</div>
								</ng-container>

								<ng-container *ngIf="applicationTypeCode !== applicationTypeCodes.Update">
									<mat-divider class="mt-3 mb-2"></mat-divider>
									<div class="text-minor-heading-small">Identification</div>
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

										<div class="col-lg-6 col-md-12" *ngIf="bcDriversLicenceNumber">
											<div class="text-label d-block text-muted">BC Driver's Licence</div>
											<div class="summary-text-data">{{ bcDriversLicenceNumber | default }}</div>
										</div>
									</div>

									<mat-divider class="mt-3 mb-2"></mat-divider>
									<app-permit-summary-characteristics
										[permitModelData]="permitModelData"
									></app-permit-summary-characteristics>
								</ng-container>
								<mat-divider class="mt-3 mb-2"></mat-divider>

								<mat-divider class="mt-3 mb-2"></mat-divider>
								<app-worker-summary-criminal-history
									[workerModelData]="permitModelData"
								></app-worker-summary-criminal-history>

								<mat-divider class="mt-3 mb-2"></mat-divider>
								<app-form-address-summary
									[formData]="permitModelData.residentialAddressData"
									headingLabel="Residential Address"
									[isAddressTheSame]="false"
								></app-form-address-summary>

								<mat-divider class="mt-3 mb-2"></mat-divider>
								<app-form-address-summary
									[formData]="permitModelData.mailingAddressData"
									headingLabel="Mailing Address"
									[isAddressTheSame]="isAddressTheSame"
									isAddressTheSameLabel="Mailing address is the same as the residential address"
								></app-form-address-summary>

								<mat-divider class="mt-3 mb-2"></mat-divider>
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
export class StepPermitSummaryAnonymousComponent implements OnInit {
	permitModelData: any = {};

	applicationTypeCodes = ApplicationTypeCode;
	booleanTypeCodes = BooleanTypeCode;

	@Input() showEmployerInformation!: boolean;

	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	constructor(
		private permitApplicationService: PermitApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		this.permitModelData = this.permitApplicationService.permitModelFormGroup.getRawValue();
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

	get applicantName(): string {
		return this.permitApplicationService.getSummaryapplicantName(this.permitModelData);
	}
	get genderCode(): string {
		return this.permitApplicationService.getSummarygenderCode(this.permitModelData);
	}
	get dateOfBirth(): string {
		return this.permitApplicationService.getSummarydateOfBirth(this.permitModelData);
	}

	get previousNameFlag(): string {
		return this.permitApplicationService.getSummarypreviousNameFlag(this.permitModelData);
	}
	get aliases(): Array<any> {
		return this.permitApplicationService.getSummaryaliases(this.permitModelData);
	}

	get criminalHistoryLabel(): string {
		return this.permitApplicationService.getSummarycriminalHistoryLabel(this.permitModelData);
	}
	get hasCriminalHistory(): string {
		return this.permitApplicationService.getSummaryhasCriminalHistory(this.permitModelData);
	}
	get criminalChargeDescription(): string {
		return this.permitApplicationService.getSummarycriminalChargeDescription(this.permitModelData);
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

	get bcDriversLicenceNumber(): string {
		return this.permitApplicationService.getSummarybcDriversLicenceNumber(this.permitModelData);
	}

	get photoOfYourselfAttachments(): File[] | null {
		return this.permitApplicationService.getSummaryphotoOfYourselfAttachments(this.permitModelData);
	}

	get emailAddress(): string {
		return this.permitApplicationService.getSummaryemailAddress(this.permitModelData);
	}
	get phoneNumber(): string {
		return this.permitApplicationService.getSummaryphoneNumber(this.permitModelData);
	}

	get isAddressTheSame(): boolean {
		return this.permitApplicationService.getSummaryisAddressTheSame(this.permitModelData);
	}
}
