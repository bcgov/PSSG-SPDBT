import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
	ApplicationTypeCode,
	BizTypeCode,
	LicenceTermCode,
	ServiceTypeCode,
	WorkerCategoryTypeCode,
} from '@app/api/models';
import { ApplicationService } from '@app/core/services/application.service';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { SpdFile } from '@app/core/services/file-util.service';
import { BooleanTypeCode } from 'src/app/core/code-types/model-desc.models';

@Component({
	selector: 'app-common-business-licence-summary',
	template: `
		<div class="row" *ngIf="businessModelData">
			<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
				<div class="row mb-3">
					<div class="col-12">
						<mat-accordion multi="true">
							<mat-expansion-panel class="mb-2" [expanded]="true">
								<mat-expansion-panel-header>
									<mat-panel-title class="review-panel-title">
										<mat-toolbar class="d-flex justify-content-between">
											<div class="panel-header">Business Information</div>
											<button
												*ngIf="showEditButton"
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
									<div class="text-minor-heading mt-4">Business Information</div>
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
										<ng-container *ngIf="isUpdate">
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
										</ng-container>
									</div>

									<ng-container *ngIf="hasExpiredLicence === booleanTypeCodes.Yes && !isStaticDataView">
										<mat-divider class="mt-3 mb-2"></mat-divider>
										<div class="text-minor-heading">Expired Licence</div>
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
									</ng-container>

									<ng-container *ngIf="!isUpdate">
										<mat-divider class="mt-3 mb-2"></mat-divider>
										<div class="text-minor-heading">Company Branding</div>
										<div class="row mt-3">
											<div class="col-lg-6 col-md-12">
												<ng-container *ngIf="noLogoOrBranding; else CompanyBrandingExamples">
													<div class="summary-text-data">There is no logo or branding</div>
												</ng-container>
												<ng-template #CompanyBrandingExamples>
													<div class="summary-text-data">
														<ul class="m-0">
															<ng-container *ngFor="let doc of companyBrandingAttachments; let i = index">
																<li>{{ doc.name }}</li>
															</ng-container>
														</ul>
													</div>
												</ng-template>
											</div>
										</div>

										<ng-container *ngIf="!isStaticDataView">
											<mat-divider class="mt-3 mb-2"></mat-divider>
											<div class="text-minor-heading">Proof of Insurance</div>
											<div class="row mt-3">
												<div class="col-lg-6 col-md-12">
													<div class="summary-text-data">
														<ul class="m-0">
															<ng-container *ngFor="let doc of proofOfInsuranceAttachments; let i = index">
																<li>{{ doc.name }}</li>
															</ng-container>
														</ul>
													</div>
												</div>
											</div>
										</ng-container>
									</ng-container>
								</div>
							</mat-expansion-panel>

							<mat-expansion-panel class="mb-2" [expanded]="true">
								<mat-expansion-panel-header>
									<mat-panel-title class="review-panel-title">
										<mat-toolbar class="d-flex justify-content-between">
											<div class="panel-header">Licence Selection</div>
											<button
												*ngIf="showEditButton"
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
									<div class="text-minor-heading mt-4">Licence Information</div>
									<div class="row mt-0">
										<ng-container *ngIf="!isStaticDataView && !isUpdate">
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
										</ng-container>

										<div class="col-lg-6 col-md-12">
											<div class="text-label d-block text-muted">Licence Categories</div>
											<div class="summary-text-data">
												<ul class="m-0">
													<ng-container *ngFor="let category of categoryList; let i = index">
														<li>{{ category | options: 'WorkerCategoryTypes' }}</li>
													</ng-container>
												</ul>
											</div>
										</div>

										<ng-container *ngIf="isAnyDocuments">
											<mat-divider class="mt-3 mb-2"></mat-divider>
											<div class="text-minor-heading">Documents Uploaded</div>
											<div class="row mt-0">
												<div class="col-lg-6 col-md-12" *ngIf="showArmouredCarGuard">
													<div class="text-label d-block text-muted">
														{{ categoryTypeCodes.ArmouredCarGuard | options: 'WorkerCategoryTypes' }} Documents
													</div>
													<div class="summary-text-data">
														<ul class="m-0">
															<ng-container *ngFor="let doc of categoryArmouredCarGuardAttachments; let i = index">
																<li>{{ doc.name }}</li>
															</ng-container>
														</ul>
													</div>
												</div>
												<div class="col-lg-6 col-md-12" *ngIf="showSecurityGuard">
													<div class="text-label d-block text-muted">
														{{ categoryTypeCodes.SecurityGuard | options: 'WorkerCategoryTypes' }} Documents
													</div>
													<div class="summary-text-data">
														<ul class="m-0">
															<ng-container *ngFor="let doc of categorySecurityGuardAttachments; let i = index">
																<li>{{ doc.name }}</li>
															</ng-container>
														</ul>
													</div>
												</div>
											</div>
										</ng-container>
									</div>
								</div>
							</mat-expansion-panel>

							<mat-expansion-panel class="mb-2" [expanded]="true" *ngIf="!isBusinessLicenceSoleProprietor">
								<mat-expansion-panel-header>
									<mat-panel-title class="review-panel-title">
										<mat-toolbar class="d-flex justify-content-between">
											<div class="panel-header">Contact Information</div>
											<button
												*ngIf="showEditButton"
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
									<div class="text-minor-heading mt-4">Business Manager Information</div>
									<div class="row mt-0">
										<div class="col-lg-6 col-md-12">
											<div class="text-label d-block text-muted">Name</div>
											<div class="summary-text-data">
												{{ businessManagerGivenName }} {{ businessManagerMiddleName1 }}
												{{ businessManagerMiddleName2 }}
												{{ businessManagerSurname }}
											</div>
										</div>
										<div class="col-lg-3 col-md-12">
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

									<ng-container *ngIf="!applicantIsBizManager">
										<mat-divider class="mt-3 mb-2"></mat-divider>
										<div class="text-minor-heading">Your Information</div>
										<div class="row mt-0">
											<div class="col-lg-6 col-md-12">
												<div class="text-label d-block text-muted">Name</div>
												<div class="summary-text-data">
													{{ yourContactGivenName }} {{ yourContactMiddleName1 }} {{ yourContactMiddleName2 }}
													{{ yourContactSurname }}
												</div>
											</div>
											<div class="col-lg-3 col-md-12">
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
									</ng-container>
								</div>
							</mat-expansion-panel>

							<ng-container *ngIf="!isUpdate">
								<mat-expansion-panel class="mb-2" [expanded]="true" *ngIf="!isBusinessLicenceSoleProprietor">
									<mat-expansion-panel-header>
										<mat-panel-title class="review-panel-title">
											<mat-toolbar class="d-flex justify-content-between">
												<div class="panel-header">Controlling Members & Employees</div>
												<button
													*ngIf="showEditButton"
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
										<div class="text-minor-heading mt-4 mb-2">Active Security Worker Licence Holders</div>
										<div class="row summary-text-data mt-0">
											<ng-container *ngIf="membersWithSwlList.length > 0; else NoMembersWithSwlList">
												<ng-container *ngFor="let member of membersWithSwlList; let i = index">
													<div class="col-xl-6 col-lg-12">
														<ul class="m-0">
															<li>{{ member.licenceHolderName }} - {{ member.licenceNumber }}</li>
														</ul>
													</div>
												</ng-container>
											</ng-container>
											<ng-template #NoMembersWithSwlList> <div class="col-12">None</div> </ng-template>
										</div>

										<mat-divider class="mt-3 mb-2"></mat-divider>
										<div class="text-minor-heading mb-2">Members who require Criminal Record Checks</div>
										<div class="row summary-text-data mt-0">
											<ng-container *ngIf="membersWithoutSwlList.length > 0; else NoMembersWithoutSwlList">
												<ng-container *ngFor="let member of membersWithoutSwlList; let i = index">
													<div class="col-xl-6 col-lg-12">
														<ul class="m-0">
															<li>{{ member.licenceHolderName }}</li>
														</ul>
													</div>
												</ng-container>
											</ng-container>
											<ng-template #NoMembersWithoutSwlList> <div class="col-12">None</div></ng-template>
										</div>

										<mat-divider class="mt-3 mb-2"></mat-divider>
										<div class="text-minor-heading mb-2">Employees</div>
										<div class="row summary-text-data mt-0">
											<ng-container *ngIf="employeesList.length > 0; else NoEmployeesList">
												<ng-container *ngFor="let employee of employeesList; let i = index">
													<div class="col-xl-6 col-lg-12">
														<ul class="m-0">
															<li>{{ employee.licenceHolderName }} - {{ employee.licenceNumber }}</li>
														</ul>
													</div>
												</ng-container>
											</ng-container>
											<ng-template #NoEmployeesList> <div class="col-12">None</div> </ng-template>
										</div>
									</div>
								</mat-expansion-panel>
							</ng-container>
						</mat-accordion>
					</div>
				</div>
			</div>
		</div>
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
export class CommonBusinessLicenceSummaryComponent implements OnInit {
	businessModelData: any = {};

	booleanTypeCodes = BooleanTypeCode;
	categoryTypeCodes = WorkerCategoryTypeCode;

	@Input() isStaticDataView: boolean = false;

	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	constructor(
		private businessApplicationService: BusinessApplicationService,
		private commonApplicationService: ApplicationService
	) {}

	ngOnInit(): void {
		const businessModelData = this.businessApplicationService.businessModelFormGroup.getRawValue();

		if (this.isStaticDataView) {
			const companyBrandingData = { ...businessModelData.companyBrandingData };
			const businessModelDataCopied = JSON.parse(JSON.stringify(businessModelData));

			// we want the data on this page to remain static.
			// The JSON stringify does not copy these attachments, so copy the data manually
			businessModelDataCopied.companyBrandingData.attachments = [];
			if (companyBrandingData.noLogoOrBranding === false) {
				companyBrandingData.attachments.forEach((item: SpdFile) => {
					businessModelDataCopied.companyBrandingData.attachments.push({
						documentUrlId: item.documentUrlId,
						name: item.name,
					});
				});
			}
			this.businessModelData = businessModelDataCopied;
		} else {
			this.businessModelData = { ...businessModelData };
		}
	}

	onEditStep(stepNumber: number) {
		this.editStep.emit(stepNumber);
	}

	onUpdateData(): void {
		if (this.isStaticDataView) {
			return;
		}

		this.businessModelData = {
			...this.businessApplicationService.businessModelFormGroup.getRawValue(),
		};
	}

	get isBusinessLicenceSoleProprietor(): string {
		return this.businessApplicationService.getSummaryisBusinessLicenceSoleProprietor(this.businessModelData);
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

	get isUpdate(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Update;
	}
	get showEditButton(): boolean {
		return !this.isStaticDataView && !this.isUpdate;
	}
}
