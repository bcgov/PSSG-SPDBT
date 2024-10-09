import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApplicationTypeCode, BizTypeCode, ServiceTypeCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { ApplicationService } from '@app/core/services/application.service';
import { PermitApplicationService } from '@core/services/permit-application.service';

@Component({
	selector: 'app-step-permit-summary-anonymous',
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
													{{ serviceTypeCode | options : 'ServiceTypes' }}
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

											<mat-divider class="mt-3 mb-2"></mat-divider>
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
														<ul class="m-0">
															<ng-container *ngFor="let doc of attachments; let i = index">
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
										</ng-container>

										<ng-container
											*ngIf="applicationTypeCode === applicationTypeCodes.Update && photoOfYourselfAttachments"
										>
											<mat-divider class="mt-3 mb-2"></mat-divider>
											<div class="text-minor-heading">Identification</div>
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
														{{ hairColourCode | options : 'HairColourTypes' }}
													</div>
												</div>
												<div class="col-lg-3 col-md-12">
													<div class="text-label d-block text-muted">Eye Colour</div>
													<div class="summary-text-data">
														{{ eyeColourCode | options : 'EyeColourTypes' }}
													</div>
												</div>
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
											</div>
										</ng-container>
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
													matTooltip="Go to Step 4"
													aria-label="Go to Step 4"
													(click)="$event.stopPropagation(); onEditStep(3)"
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

	applicationTypeCodes = ApplicationTypeCode;
	booleanTypeCodes = BooleanTypeCode;

	@Input() showEmployerInformation!: boolean;

	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	constructor(
		private permitApplicationService: PermitApplicationService,
		private commonApplicationService: ApplicationService
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
		const fee = this.commonApplicationService
			.getLicenceTermsAndFees(this.serviceTypeCode, this.applicationTypeCode, BizTypeCode.None)
			.find((item) => item.applicationTypeCode === this.permitModelData.applicationTypeData.applicationTypeCode);

		return fee ? fee.amount ?? null : null;
	}

	get licenceTermCode(): string {
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

	get givenName(): string {
		return this.permitApplicationService.getSummarygivenName(this.permitModelData);
	}
	get middleName1(): string {
		return this.permitApplicationService.getSummarymiddleName1(this.permitModelData);
	}
	get middleName2(): string {
		return this.permitApplicationService.getSummarymiddleName2(this.permitModelData);
	}
	get surname(): string {
		return this.permitApplicationService.getSummarysurname(this.permitModelData);
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

	get emailAddress(): string {
		return this.permitApplicationService.getSummaryemailAddress(this.permitModelData);
	}
	get phoneNumber(): string {
		return this.permitApplicationService.getSummaryphoneNumber(this.permitModelData);
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

	get residentialAddressLine1(): string {
		return this.permitApplicationService.getSummaryresidentialAddressLine1(this.permitModelData);
	}
	get residentialAddressLine2(): string {
		return this.permitApplicationService.getSummaryresidentialAddressLine2(this.permitModelData);
	}
	get residentialCity(): string {
		return this.permitApplicationService.getSummaryresidentialCity(this.permitModelData);
	}
	get residentialPostalCode(): string {
		return this.permitApplicationService.getSummaryresidentialPostalCode(this.permitModelData);
	}
	get residentialProvince(): string {
		return this.permitApplicationService.getSummaryresidentialProvince(this.permitModelData);
	}
	get residentialCountry(): string {
		return this.permitApplicationService.getSummaryresidentialCountry(this.permitModelData);
	}
	get isAddressTheSame(): string {
		return this.permitApplicationService.getSummaryisAddressTheSame(this.permitModelData);
	}

	get mailingAddressLine1(): string {
		return this.permitApplicationService.getSummarymailingAddressLine1(this.permitModelData);
	}
	get mailingAddressLine2(): string {
		return this.permitApplicationService.getSummarymailingAddressLine2(this.permitModelData);
	}
	get mailingCity(): string {
		return this.permitApplicationService.getSummarymailingCity(this.permitModelData);
	}
	get mailingPostalCode(): string {
		return this.permitApplicationService.getSummarymailingPostalCode(this.permitModelData);
	}
	get mailingProvince(): string {
		return this.permitApplicationService.getSummarymailingProvince(this.permitModelData);
	}
	get mailingCountry(): string {
		return this.permitApplicationService.getSummarymailingCountry(this.permitModelData);
	}
}
