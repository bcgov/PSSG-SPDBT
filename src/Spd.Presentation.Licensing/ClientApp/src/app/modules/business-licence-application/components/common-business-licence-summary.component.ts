import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
	ApplicationTypeCode,
	BizTypeCode,
	LicenceTermCode,
	ServiceTypeCode,
	WorkerCategoryTypeCode,
} from '@app/api/models';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { BooleanTypeCode } from 'src/app/core/code-types/model-desc.models';

@Component({
	selector: 'app-common-business-licence-summary',
	template: `
		@if (businessModelData) {
			<div class="row">
				<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row mb-3">
						<div class="col-12">
							<mat-accordion multi="true">
								<mat-expansion-panel class="mb-2" [expanded]="true">
									<mat-expansion-panel-header>
										<mat-panel-title class="review-panel-title">
											<mat-toolbar class="d-flex justify-content-between">
												<div class="panel-header">Business Information</div>
												@if (showEditButton) {
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
												}
											</mat-toolbar>
										</mat-panel-title>
									</mat-expansion-panel-header>
									<div class="panel-body">
										<div class="text-minor-heading-small mt-4">Business Information</div>
										<div class="row mt-0">
											<div class="col-lg-4 col-md-12">
												<div class="text-label d-block text-muted">Licence Type</div>
												<div class="summary-text-data">
													{{ serviceTypeCode | options: 'ServiceTypes' }}
												</div>
											</div>
											<div class="col-lg-4 col-md-12">
												<div class="text-label d-block text-muted">Application Type</div>
												<div class="summary-text-data">
													{{ applicationTypeCode | options: 'ApplicationTypes' }}
												</div>
											</div>
											<div class="col-lg-4 col-md-12">
												<div class="text-label d-block text-muted">Business Type</div>
												<div class="summary-text-data">
													{{ bizTypeCode | options: 'BizTypes' }}
												</div>
											</div>
											@if (isUpdate) {
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted">Print Licence</div>
													<div class="summary-text-data">Yes</div>
												</div>
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted">Reprint Fee</div>
													<div class="summary-text-data">
														{{ licenceFee | currency: 'CAD' : 'symbol-narrow' : '1.0' | default }}
													</div>
												</div>
											}
										</div>
										@if (isBusinessLicenceSoleProprietor) {
											<mat-divider class="mt-3 mb-2"></mat-divider>
											<div class="text-minor-heading-small">Sole Proprietor</div>
											<div class="row mt-0">
												@if (soleProprietorLicenceHolderName) {
													<div class="col-lg-4 col-md-12">
														<div class="text-label d-block text-muted">Name</div>
														<div class="summary-text-data">
															{{ soleProprietorLicenceHolderName | default }}
														</div>
													</div>
													<div class="col-lg-4 col-md-12">
														<div class="text-label d-block text-muted">Security Worker Licence Number</div>
														<div class="summary-text-data">
															{{ soleProprietorLicenceNumber | default }}
														</div>
													</div>
													<div class="col-lg-4 col-md-12">
														<div class="text-label d-block text-muted">Expiry Date</div>
														<div class="summary-text-data">
															{{ soleProprietorLicenceExpiryDate | formatDate | default }}
														</div>
													</div>
												}
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted">Email Address</div>
													<div class="summary-text-data">
														{{ soleProprietorSwlEmailAddress | default }}
													</div>
												</div>
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted">Phone Number</div>
													<div class="summary-text-data">
														{{ soleProprietorSwlPhoneNumber | formatPhoneNumber | default }}
													</div>
												</div>
											</div>
										}
										@if (isSoleProprietorSimultaneousFlow) {
											<mat-divider class="mt-3 mb-2"></mat-divider>
											<app-form-address-summary
												[formData]="businessModelData.businessMailingAddressData"
												headingLabel="Mailing Address"
												[isAddressTheSame]="false"
											></app-form-address-summary>
											<mat-divider class="mt-3 mb-2"></mat-divider>
											<app-form-address-summary
												[formData]="businessModelData.businessAddressData"
												headingLabel="Business Address"
												[isAddressTheSame]="isAddressTheSame"
												isAddressTheSameLabel="Business address is the same as the mailing address"
											></app-form-address-summary>
											@if (!isBcBusinessAddress) {
												<mat-divider class="mt-3 mb-2"></mat-divider>
												<app-form-address-summary
													[formData]="businessModelData.bcBusinessAddressData"
													headingLabel="B.C. Business Address"
													[isAddressTheSame]="false"
												></app-form-address-summary>
											}
										}
										@if (hasExpiredLicence === booleanTypeCodes.Yes) {
											<mat-divider class="mt-3 mb-2"></mat-divider>
											<div class="text-minor-heading-small">Expired Licence</div>
											<div class="row mt-0">
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted">Expired Licence Number</div>
													<div class="summary-text-data">{{ expiredLicenceNumber | default }}</div>
												</div>
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted">Expiry Date</div>
													<div class="summary-text-data">
														{{ expiredLicenceExpiryDate | formatDate | default }}
													</div>
												</div>
											</div>
										}
										@if (!isUpdate) {
											<mat-divider class="mt-3 mb-2"></mat-divider>
											<div class="text-minor-heading-small">Company Branding</div>
											<div class="row">
												<div class="col-12">
													@if (noLogoOrBranding) {
														<div class="summary-text-data mt-3">There is no logo or branding</div>
													} @else {
														<div class="text-label d-block text-muted">Documents</div>
														<div class="summary-text-data">
															<ul class="m-0">
																@for (doc of companyBrandingAttachments; track doc; let i = $index) {
																	<li>{{ doc.name }}</li>
																}
															</ul>
														</div>
													}
												</div>
											</div>
											<mat-divider class="mt-3 mb-2"></mat-divider>
											<div class="text-minor-heading-small">Proof of Insurance</div>
											<div class="row">
												<div class="col-12">
													<div class="text-label d-block text-muted">Documents</div>
													<div class="summary-text-data">
														<ul class="m-0">
															@for (doc of proofOfInsuranceAttachments; track doc; let i = $index) {
																<li>{{ doc.name }}</li>
															}
														</ul>
													</div>
												</div>
											</div>
										}
										@if (isSoleProprietorSimultaneousFlow) {
											<mat-divider class="mt-3 mb-2"></mat-divider>
											<app-common-business-employees-summary
												[businessModelData]="businessModelData"
											></app-common-business-employees-summary>
										}
									</div>
								</mat-expansion-panel>
								<mat-expansion-panel class="mb-2" [expanded]="true">
									<mat-expansion-panel-header>
										<mat-panel-title class="review-panel-title">
											<mat-toolbar class="d-flex justify-content-between">
												<div class="panel-header">Licence Selection</div>
												@if (showEditButton) {
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
												}
											</mat-toolbar>
										</mat-panel-title>
									</mat-expansion-panel-header>
									<div class="panel-body">
										@if (!isUpdate) {
											<div class="text-minor-heading-small mt-4">Licence Information</div>
											<div class="row mt-0">
												<div class="col-lg-3 col-md-12">
													<div class="text-label d-block text-muted">Licence Term</div>
													<div class="summary-text-data">{{ licenceTermCode | options: 'LicenceTermTypes' }}</div>
												</div>
												<div class="col-lg-3 col-md-12">
													<div class="text-label d-block text-muted">Fee</div>
													<div class="summary-text-data">
														{{ licenceFee | currency: 'CAD' : 'symbol-narrow' : '1.0' | default }}
													</div>
												</div>
											</div>
										}
										<app-form-licence-category-summary
											[categoryList]="categoryList"
											[showDivider]="!isUpdate"
										></app-form-licence-category-summary>
										@if (isPrivateInvestigator && !isBusinessLicenceSoleProprietor) {
											<mat-divider class="mt-3 mb-2"></mat-divider>
											<div class="text-minor-heading-small">Private Investigator Information</div>
											<div class="row mt-0">
												<div class="col-lg-5 col-md-12">
													<div class="text-label d-block text-muted">Manager Name</div>
													<div class="summary-text-data">
														{{ privateInvestigatorName | default }}
													</div>
												</div>
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted">Licence Number</div>
													<div class="summary-text-data">
														{{ privateInvestigatorLicenceNumber | default }}
													</div>
												</div>
												<div class="col-lg-3 col-md-12">
													<div class="text-label d-block text-muted">Expiry Date</div>
													<div class="summary-text-data">
														{{ privateInvestigatorExpiryDate | formatDate | default }}
													</div>
												</div>
											</div>
										}
										@if (isDogs) {
											<mat-divider class="mt-3 mb-2"></mat-divider>
											<div class="text-minor-heading-small">Dogs Authorization</div>
											<div class="row mt-0">
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted">Request to Use Dogs</div>
													<div class="summary-text-data">{{ useDogs }}</div>
												</div>
												@if (useDogs === booleanTypeCodes.Yes) {
													<div class="col-lg-4 col-md-12">
														<div class="text-label d-block text-muted">Reason</div>
														<div class="summary-text-data">
															<ul class="m-0">
																@if (isDogsPurposeProtection) {
																	<li>Protection</li>
																}
																@if (isDogsPurposeDetectionDrugs) {
																	<li>Detection - Drugs</li>
																}
																@if (isDogsPurposeDetectionExplosives) {
																	<li>Detection - Explosives</li>
																}
															</ul>
														</div>
													</div>
													<div class="col-lg-4 col-md-12">
														<div class="text-label d-block text-muted">Dog Validation Certificate</div>
														<div class="summary-text-data">
															<ul class="m-0">
																@for (doc of dogsPurposeAttachments; track doc; let i = $index) {
																	<li>{{ doc.name }}</li>
																}
															</ul>
														</div>
													</div>
												}
											</div>
										}
										@if (isAnyDocuments) {
											<mat-divider class="mt-3 mb-2"></mat-divider>
											<div class="text-minor-heading-small">Documents Uploaded</div>
											<div class="row mt-0">
												@if (showArmouredCarGuard) {
													<div class="col-lg-6 col-md-12">
														<div class="text-label d-block text-muted">
															{{ categoryTypeCodes.ArmouredCarGuard | options: 'WorkerCategoryTypes' }} Documents
														</div>
														<div class="summary-text-data">
															<ul class="m-0">
																@for (doc of categoryArmouredCarGuardAttachments; track doc; let i = $index) {
																	<li>{{ doc.name }}</li>
																}
															</ul>
														</div>
													</div>
												}
											</div>
										}
									</div>
								</mat-expansion-panel>
								@if (!isBusinessLicenceSoleProprietor) {
									<mat-expansion-panel class="mb-2" [expanded]="true">
										<mat-expansion-panel-header>
											<mat-panel-title class="review-panel-title">
												<mat-toolbar class="d-flex justify-content-between">
													<div class="panel-header">Contact Information</div>
													@if (showEditButton) {
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
													}
												</mat-toolbar>
											</mat-panel-title>
										</mat-expansion-panel-header>
										<div class="panel-body">
											<div class="text-minor-heading-small mt-4">Business Manager Information</div>
											<div class="row mt-0">
												<div class="col-lg-5 col-md-12">
													<div class="text-label d-block text-muted">Name</div>
													<div class="summary-text-data">
														{{ businessManagerGivenName }} {{ businessManagerMiddleName1 }}
														{{ businessManagerMiddleName2 }}
														{{ businessManagerSurname }}
													</div>
												</div>
												<div class="col-lg-4 col-md-12">
													<div class="text-label d-block text-muted">Email Address</div>
													<div class="summary-text-data">
														{{ businessManagerEmailAddress | default }}
													</div>
												</div>
												<div class="col-lg-3 col-md-12">
													<div class="text-label d-block text-muted">Phone Number</div>
													<div class="summary-text-data">
														{{ businessManagerPhoneNumber | formatPhoneNumber | default }}
													</div>
												</div>
											</div>
											@if (!applicantIsBizManager) {
												<mat-divider class="mt-3 mb-2"></mat-divider>
												<div class="text-minor-heading-small">Your Information</div>
												<div class="row mt-0">
													<div class="col-lg-5 col-md-12">
														<div class="text-label d-block text-muted">Name</div>
														<div class="summary-text-data">
															{{ yourContactGivenName }} {{ yourContactMiddleName1 }} {{ yourContactMiddleName2 }}
															{{ yourContactSurname }}
														</div>
													</div>
													<div class="col-lg-4 col-md-12">
														<div class="text-label d-block text-muted">Email Address</div>
														<div class="summary-text-data">
															{{ yourContactEmailAddress | default }}
														</div>
													</div>
													<div class="col-lg-3 col-md-12">
														<div class="text-label d-block text-muted">Phone Number</div>
														<div class="summary-text-data">
															{{ yourContactPhoneNumber | formatPhoneNumber | default }}
														</div>
													</div>
												</div>
											}
										</div>
									</mat-expansion-panel>
								}
								@if (!isUpdate && !isBusinessLicenceSoleProprietor) {
									<mat-expansion-panel class="mb-2" [expanded]="true">
										<mat-expansion-panel-header>
											<mat-panel-title class="review-panel-title">
												<mat-toolbar class="d-flex justify-content-between">
													<div class="panel-header">Controlling Members, Business Managers & Employees</div>
													@if (showEditButton) {
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
													}
												</mat-toolbar>
											</mat-panel-title>
										</mat-expansion-panel-header>
										<div class="panel-body">
											<div class="text-minor-heading-small mt-4 mb-2">Active Security Worker Licence Holders</div>
											<div class="row summary-text-data mt-0">
												@if (membersWithSwlList.length > 0) {
													@for (member of membersWithSwlList; track member; let i = $index) {
														<div class="col-xl-6 col-lg-12">
															<ul class="m-0">
																<li>{{ member.licenceHolderName }} - {{ member.licenceNumber }}</li>
															</ul>
														</div>
													}
												} @else {
													<div class="col-12">None</div>
												}
											</div>
											<mat-divider class="mt-3 mb-2"></mat-divider>
											<div class="text-minor-heading-small mb-2">Members who require Criminal Record Checks</div>
											<div class="row summary-text-data mt-0">
												@if (membersWithoutSwlList.length > 0) {
													@for (member of membersWithoutSwlList; track member; let i = $index) {
														<div class="col-xl-6 col-lg-12">
															<ul class="m-0">
																<li style="word-break: break-all;">
																	{{ member.licenceHolderName }} -
																	{{ member.emailAddress ? member.emailAddress : 'No email address' }}
																</li>
															</ul>
														</div>
													}
												} @else {
													<div class="col-12">None</div>
												}
											</div>
											<mat-divider class="mt-3 mb-2"></mat-divider>
											<app-common-business-employees-summary
												[businessModelData]="businessModelData"
											></app-common-business-employees-summary>
											<mat-divider class="mt-3 mb-2"></mat-divider>
											<div class="text-minor-heading-small">Corporate Registry Documents</div>
											<div class="row">
												<div class="col-12">
													<div class="text-label d-block text-muted">Documents</div>
													<div class="summary-text-data">
														<ul class="m-0">
															@for (doc of corporateRegistryDocumentsAttachments; track doc; let i = $index) {
																<li>{{ doc.name }}</li>
															}
														</ul>
													</div>
												</div>
											</div>
										</div>
									</mat-expansion-panel>
								}
								@if (isUpdate && !isBusinessLicenceSoleProprietor) {
									<mat-expansion-panel class="mb-2" [expanded]="true">
										<mat-expansion-panel-header>
											<mat-panel-title class="review-panel-title">
												<mat-toolbar class="d-flex justify-content-between">
													<div class="panel-header">Employees</div>
												</mat-toolbar>
											</mat-panel-title>
										</mat-expansion-panel-header>
										<div class="panel-body">
											<app-common-business-employees-summary
												[businessModelData]="businessModelData"
											></app-common-business-employees-summary>
										</div>
									</mat-expansion-panel>
								}
								@if (!isSoleProprietorSimultaneousFlow && isBusinessLicenceSoleProprietor) {
									<mat-expansion-panel class="mb-2" [expanded]="true">
										<mat-expansion-panel-header>
											<mat-panel-title class="review-panel-title">
												<mat-toolbar class="d-flex justify-content-between">
													<div class="panel-header">Employees</div>
													@if (showEditButton) {
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
													}
												</mat-toolbar>
											</mat-panel-title>
										</mat-expansion-panel-header>
										<div class="panel-body">
											<app-common-business-employees-summary
												[businessModelData]="businessModelData"
											></app-common-business-employees-summary>
										</div>
									</mat-expansion-panel>
								}
							</mat-accordion>
						</div>
					</div>
				</div>
			</div>
		}
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
export class CommonBusinessLicenceSummaryComponent implements OnInit {
	businessModelData: any = {};

	booleanTypeCodes = BooleanTypeCode;
	categoryTypeCodes = WorkerCategoryTypeCode;

	@Input() isBusinessLicenceSoleProprietor!: boolean;
	@Input() isSoleProprietorSimultaneousFlow!: boolean;
	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	constructor(
		private businessApplicationService: BusinessApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		this.businessModelData = {
			...this.businessApplicationService.businessModelFormGroup.getRawValue(),
		};
	}

	onEditStep(stepNumber: number) {
		this.editStep.emit(stepNumber);
	}

	onUpdateData(): void {
		this.businessModelData = {
			...this.businessApplicationService.businessModelFormGroup.getRawValue(),
		};
	}

	get hasExpiredLicence(): string {
		return this.businessApplicationService.getSummaryhasExpiredLicence(this.businessModelData);
	}
	get expiredLicenceNumber(): string {
		return this.businessApplicationService.getSummaryexpiredLicenceNumber(this.businessModelData);
	}
	get expiredLicenceExpiryDate(): string {
		return this.businessApplicationService.getSummaryexpiredLicenceExpiryDate(this.businessModelData);
	}

	get noLogoOrBranding(): string {
		return this.businessApplicationService.getSummarynoLogoOrBranding(this.businessModelData);
	}
	get companyBrandingAttachments(): File[] {
		return this.businessApplicationService.getSummarycompanyBrandingAttachments(this.businessModelData);
	}

	get proofOfInsuranceAttachments(): File[] {
		return this.businessApplicationService.getSummaryproofOfInsuranceAttachments(this.businessModelData);
	}

	get serviceTypeCode(): ServiceTypeCode | null {
		return this.businessApplicationService.getSummaryserviceTypeCode(this.businessModelData);
	}
	get applicationTypeCode(): ApplicationTypeCode | null {
		return this.businessApplicationService.getSummaryapplicationTypeCode(this.businessModelData);
	}
	get bizTypeCode(): BizTypeCode | null {
		return this.businessApplicationService.getSummarybizTypeCode(this.businessModelData);
	}

	get soleProprietorLicenceHolderName(): string {
		return this.businessApplicationService.getSummarysoleProprietorLicenceHolderName(this.businessModelData);
	}
	get soleProprietorLicenceNumber(): string {
		return this.businessApplicationService.getSummarysoleProprietorLicenceNumber(this.businessModelData);
	}
	get soleProprietorLicenceExpiryDate(): string {
		return this.businessApplicationService.getSummarysoleProprietorLicenceExpiryDate(this.businessModelData);
	}
	get soleProprietorSwlEmailAddress(): string {
		return this.businessApplicationService.getSummarysoleProprietorSwlEmailAddress(this.businessModelData);
	}
	get soleProprietorSwlPhoneNumber(): string {
		return this.businessApplicationService.getSummarysoleProprietorSwlPhoneNumber(this.businessModelData);
	}

	get licenceTermCode(): LicenceTermCode | null {
		return this.businessApplicationService.getSummarylicenceTermCode(this.businessModelData);
	}
	get licenceFee(): number | null {
		if (!this.licenceTermCode) {
			return null;
		}

		const fee = this.commonApplicationService.getLicenceFee(
			this.serviceTypeCode,
			this.applicationTypeCode,
			this.bizTypeCode,
			this.licenceTermCode
		);
		return fee ? (fee.amount ?? null) : null;
	}

	get categoryList(): Array<WorkerCategoryTypeCode> {
		return this.businessApplicationService.getSummarycategoryList(this.businessModelData);
	}

	get isDogs(): boolean {
		return this.businessApplicationService.getSummaryisDogs(this.businessModelData);
	}
	get useDogs(): string {
		return this.businessApplicationService.getSummaryuseDogs(this.businessModelData);
	}
	get isDogsPurposeProtection(): string {
		return this.businessApplicationService.getSummaryisDogsPurposeProtection(this.businessModelData);
	}
	get isDogsPurposeDetectionDrugs(): string {
		return this.businessApplicationService.getSummaryisDogsPurposeDetectionDrugs(this.businessModelData);
	}
	get isDogsPurposeDetectionExplosives(): string {
		return this.businessApplicationService.getSummaryisDogsPurposeDetectionExplosives(this.businessModelData);
	}
	get dogsPurposeAttachments(): File[] {
		return this.businessApplicationService.getSummarydogsPurposeAttachments(this.businessModelData);
	}

	get isPrivateInvestigator(): boolean {
		return this.businessApplicationService.getSummaryisPrivateInvestigator(this.businessModelData);
	}
	get privateInvestigatorName(): string {
		return this.businessApplicationService.getSummaryprivateInvestigatorName(this.businessModelData);
	}
	get privateInvestigatorLicenceNumber(): string {
		return this.businessApplicationService.getSummaryprivateInvestigatorLicenceNumber(this.businessModelData);
	}
	get privateInvestigatorExpiryDate(): string {
		return this.businessApplicationService.getSummaryprivateInvestigatorExpiryDate(this.businessModelData);
	}

	get isAnyDocuments(): boolean {
		return this.businessApplicationService.getSummaryisAnyDocuments(this.businessModelData);
	}
	get showArmouredCarGuard(): boolean {
		return this.businessApplicationService.getSummaryshowArmouredCarGuard(this.businessModelData);
	}
	get showSecurityGuard(): boolean {
		return this.businessApplicationService.getSummaryshowSecurityGuard(this.businessModelData);
	}
	get categoryArmouredCarGuardAttachments(): File[] {
		return this.businessApplicationService.getSummarycategoryArmouredCarGuardAttachments(this.businessModelData);
	}
	get categorySecurityGuardAttachments(): File[] {
		return this.businessApplicationService.getSummarycategorySecurityGuardAttachments(this.businessModelData);
	}

	get isAddressTheSame(): boolean {
		return this.businessApplicationService.getSummaryisAddressTheSame(this.businessModelData);
	}

	get isBcBusinessAddress(): boolean {
		return this.businessApplicationService.getSummaryisBcBusinessAddress(this.businessModelData);
	}

	get businessManagerGivenName(): string {
		return this.businessApplicationService.getSummarybusinessManagerGivenName(this.businessModelData);
	}
	get businessManagerMiddleName1(): string {
		return this.businessApplicationService.getSummarybusinessManagerMiddleName1(this.businessModelData);
	}
	get businessManagerMiddleName2(): string {
		return this.businessApplicationService.getSummarybusinessManagerMiddleName2(this.businessModelData);
	}
	get businessManagerSurname(): string {
		return this.businessApplicationService.getSummarybusinessManagerSurname(this.businessModelData);
	}
	get businessManagerEmailAddress(): string {
		return this.businessApplicationService.getSummarybusinessManagerEmailAddress(this.businessModelData);
	}
	get businessManagerPhoneNumber(): string {
		return this.businessApplicationService.getSummarybusinessManagerPhoneNumber(this.businessModelData);
	}

	get applicantIsBizManager(): string {
		return this.businessApplicationService.getSummaryapplicantIsBizManager(this.businessModelData);
	}
	get yourContactGivenName(): string {
		return this.businessApplicationService.getSummaryyourContactGivenName(this.businessModelData);
	}
	get yourContactMiddleName1(): string {
		return this.businessApplicationService.getSummaryyourContactMiddleName1(this.businessModelData);
	}
	get yourContactMiddleName2(): string {
		return this.businessApplicationService.getSummaryyourContactMiddleName2(this.businessModelData);
	}
	get yourContactSurname(): string {
		return this.businessApplicationService.getSummaryyourContactSurname(this.businessModelData);
	}
	get yourContactEmailAddress(): string {
		return this.businessApplicationService.getSummaryyourContactEmailAddress(this.businessModelData);
	}
	get yourContactPhoneNumber(): string {
		return this.businessApplicationService.getSummaryyourContactPhoneNumber(this.businessModelData);
	}

	get membersWithSwlList(): Array<any> {
		return this.businessApplicationService.getSummarymembersWithSwlList(this.businessModelData);
	}
	get membersWithoutSwlList(): Array<any> {
		return this.businessApplicationService.getSummarymembersWithoutSwlList(this.businessModelData);
	}

	get employeesList(): Array<any> {
		return this.businessApplicationService.getSummaryemployeesList(this.businessModelData);
	}

	get corporateRegistryDocumentsAttachments(): File[] {
		return this.businessApplicationService.getSummarycorporateRegistryDocumentsAttachments(this.businessModelData);
	}

	get isUpdate(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Update;
	}
	get showEditButton(): boolean {
		return !this.isUpdate;
	}
}
