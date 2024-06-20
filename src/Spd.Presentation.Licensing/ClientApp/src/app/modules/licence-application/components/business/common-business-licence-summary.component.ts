import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
	ApplicationTypeCode,
	BizTypeCode,
	LicenceFeeResponse,
	WorkerCategoryTypeCode,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { SpdFile } from '@app/core/services/util.service';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';
import { BooleanTypeCode } from 'src/app/core/code-types/model-desc.models';
import { BusinessApplicationService } from '../../services/business-application.service';

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
												{{ workerLicenceTypeCode | options : 'WorkerLicenceTypes' }}
											</div>
										</div>
										<div class="col-lg-4 col-md-12">
											<div class="text-label d-block text-muted">Application Type</div>
											<div class="summary-text-data">
												{{ applicationTypeCode | options : 'ApplicationTypes' }}
											</div>
										</div>
										<div class="col-lg-4 col-md-12">
											<div class="text-label d-block text-muted">Business Type</div>
											<div class="summary-text-data">
												{{ bizTypeCode | options : 'BizTypes' }}
											</div>
										</div>
										<ng-container *ngIf="isUpdate">
											<div class="col-lg-4 col-md-12">
												<div class="text-label d-block text-muted">Print Permit</div>
												<div class="summary-text-data">{{ isReprint }}</div>
											</div>
											<div class="col-lg-4 col-md-12" *ngIf="licenceFee">
												<div class="text-label d-block text-muted">Reprint Fee</div>
												<div class="summary-text-data">
													{{ licenceFee | currency : 'CAD' : 'symbol-narrow' : '1.0' | default }}
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
											<div class="col-lg-4 col-md-12">
												<div class="text-label d-block text-muted">Licence Term</div>
												<div class="summary-text-data">{{ licenceTermCode | options : 'LicenceTermTypes' }}</div>
											</div>
											<div class="col-lg-4 col-md-12">
												<div class="text-label d-block text-muted">Fee</div>
												<div class="summary-text-data">
													{{ licenceFee | currency : 'CAD' : 'symbol-narrow' : '1.0' | default }}
												</div>
											</div>
										</ng-container>

										<ng-container
											*ngFor="let category of categoryList; let i = index; let first = first; let last = last"
										>
											<div class="col-lg-4 col-md-12">
												<div class="text-label d-block text-muted">
													Licence Category <span *ngIf="categoryList.length > 1"> #{{ i + 1 }}</span>
												</div>
												<div class="summary-text-data">
													{{ category | options : 'WorkerCategoryTypes' }}
												</div>
											</div>
										</ng-container>

										<ng-container *ngIf="isAnyDocuments">
											<mat-divider class="mt-3 mb-2"></mat-divider>
											<div class="text-minor-heading">Documents Uploaded</div>
											<div class="row mt-0">
												<div class="col-lg-6 col-md-12" *ngIf="showArmouredCarGuard">
													<div class="text-label d-block text-muted">
														{{ categoryTypeCodes.ArmouredCarGuard | options : 'WorkerCategoryTypes' }} Documents
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
														{{ categoryTypeCodes.SecurityGuard | options : 'WorkerCategoryTypes' }} Documents
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

									<ng-container *ngIf="!isBusinessManager">
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
										<div class="text-minor-heading mt-4">Active Security Worker Licence Holders</div>
										<div class="row mt-0">
											<ng-container *ngIf="membersWithSwlList.length > 0; else NoMembersWithSwlList">
												<ng-container *ngFor="let member of membersWithSwlList; let i = index">
													<div class="col-lg-4 col-md-12">
														<div class="text-label d-block text-muted">
															Member <span *ngIf="membersWithSwlList.length > 1"> #{{ i + 1 }}</span>
														</div>
														<div class="summary-text-data">
															{{ member.licenceHolderName }} - {{ member.licenceNumber }}
														</div>
													</div>
												</ng-container>
											</ng-container>
											<ng-template #NoMembersWithSwlList> <div class="col-12">None</div> </ng-template>
										</div>

										<mat-divider class="mt-3 mb-2"></mat-divider>
										<div class="text-minor-heading">Members who require Criminal Record Checks</div>
										<div class="row mt-0">
											<ng-container *ngIf="membersWithoutSwlList.length > 0; else NoMembersWithoutSwlList">
												<ng-container *ngFor="let member of membersWithoutSwlList; let i = index">
													<div class="col-lg-4 col-md-12">
														<div class="text-label d-block text-muted">
															Member <span *ngIf="membersWithoutSwlList.length > 1"> #{{ i + 1 }}</span>
														</div>
														<div class="summary-text-data">
															{{ member.licenceHolderName }}
														</div>
													</div>
												</ng-container>
											</ng-container>
											<ng-template #NoMembersWithoutSwlList> <div class="col-12">None</div></ng-template>
										</div>

										<mat-divider class="mt-3 mb-2"></mat-divider>
										<div class="text-minor-heading">Employees</div>
										<div class="row mt-0">
											<ng-container *ngIf="employeesList.length > 0; else NoEmployeesList">
												<ng-container *ngFor="let employee of employeesList; let i = index">
													<div class="col-lg-4 col-md-12">
														<div class="text-label d-block text-muted">
															Employee <span *ngIf="employeesList.length > 1"> #{{ i + 1 }}</span>
														</div>
														<div class="summary-text-data">
															{{ employee.licenceHolderName }} - {{ employee.licenceNumber }}
														</div>
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
		private commonApplicationService: CommonApplicationService
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
		return this.businessModelData.isBusinessLicenceSoleProprietor ?? false;
	}

	get hasExpiredLicence(): string {
		return this.businessModelData.expiredLicenceData.hasExpiredLicence ?? '';
	}
	get expiredLicenceNumber(): string {
		return this.businessModelData.expiredLicenceData.expiredLicenceNumber ?? '';
	}
	get expiredLicenceExpiryDate(): string {
		return this.businessModelData.expiredLicenceData.expiredLicenceExpiryDate ?? '';
	}

	get noLogoOrBranding(): string {
		return this.businessModelData.companyBrandingData.noLogoOrBranding ?? '';
	}
	get companyBrandingAttachments(): File[] {
		return this.businessModelData.companyBrandingData.attachments ?? [];
	}

	get proofOfInsuranceAttachments(): File[] {
		return this.businessModelData.liabilityData.attachments ?? [];
	}

	get workerLicenceTypeCode(): WorkerLicenceTypeCode | null {
		return this.businessModelData.workerLicenceTypeData?.workerLicenceTypeCode ?? null;
	}
	get applicationTypeCode(): ApplicationTypeCode | null {
		return this.businessModelData.applicationTypeData?.applicationTypeCode ?? null;
	}
	get bizTypeCode(): BizTypeCode | null {
		return this.businessModelData.businessInformationData?.bizTypeCode ?? null;
	}
	get licenceTermCode(): string {
		return this.businessModelData.licenceTermData.licenceTermCode ?? '';
	}
	get licenceFee(): number | null {
		if (!this.licenceTermCode) {
			return null;
		}

		const fee = this.commonApplicationService
			.getLicenceTermsAndFees(this.workerLicenceTypeCode, this.applicationTypeCode, this.bizTypeCode)
			.find((item: LicenceFeeResponse) => item.licenceTermCode == this.licenceTermCode);
		return fee ? fee.amount ?? null : null;
	}

	get categoryList(): Array<WorkerCategoryTypeCode> {
		const list: Array<WorkerCategoryTypeCode> = [];
		const categoryData = { ...this.businessModelData.categoryData };

		for (const [key, value] of Object.entries(categoryData)) {
			if (value) {
				list.push(key as WorkerCategoryTypeCode);
			}
		}
		return list;
	}
	get isAnyDocuments(): boolean {
		return this.showArmouredCarGuard || this.showSecurityGuard;
	}
	get showArmouredCarGuard(): boolean {
		return this.businessModelData.categoryArmouredCarGuardData?.isInclude ?? false;
	}
	get showSecurityGuard(): boolean {
		const isInclude = this.businessModelData.categorySecurityGuardData?.isInclude ?? false;
		return (
			isInclude && this.businessModelData.categorySecurityGuardData?.isRequestDogAuthorization === BooleanTypeCode.Yes
		);
	}
	get categoryArmouredCarGuardAttachments(): File[] {
		return this.businessModelData.categoryArmouredCarGuardData.attachments ?? [];
	}
	get categorySecurityGuardAttachments(): File[] {
		return this.businessModelData.categorySecurityGuardData.attachments ?? [];
	}

	get businessManagerGivenName(): string {
		return this.businessModelData.businessManagerData.givenName ?? '';
	}
	get businessManagerMiddleName1(): string {
		return this.businessModelData.businessManagerData.middleName1 ?? '';
	}
	get businessManagerMiddleName2(): string {
		return this.businessModelData.businessManagerData.middleName2 ?? '';
	}
	get businessManagerSurname(): string {
		return this.businessModelData.businessManagerData.surname ?? '';
	}
	get businessManagerEmailAddress(): string {
		return this.businessModelData.businessManagerData.emailAddress ?? '';
	}
	get businessManagerPhoneNumber(): string {
		return this.businessModelData.businessManagerData.phoneNumber ?? '';
	}

	get isBusinessManager(): string {
		return this.businessModelData.businessManagerData.isBusinessManager ?? '';
	}
	get yourContactGivenName(): string {
		return this.businessModelData.businessManagerData.applicantGivenName ?? '';
	}
	get yourContactMiddleName1(): string {
		return this.businessModelData.businessManagerData.applicantMiddleName1 ?? '';
	}
	get yourContactMiddleName2(): string {
		return this.businessModelData.businessManagerData.applicantMiddleName2 ?? '';
	}
	get yourContactSurname(): string {
		return this.businessModelData.businessManagerData.applicantSurname ?? '';
	}
	get yourContactEmailAddress(): string {
		return this.businessModelData.businessManagerData.applicantEmailAddress ?? '';
	}
	get yourContactPhoneNumber(): string {
		return this.businessModelData.businessManagerData.applicantPhoneNumber ?? '';
	}

	get membersWithSwlList(): Array<any> {
		return this.businessModelData.controllingMembersData.membersWithSwl;
	}
	get membersWithoutSwlList(): Array<any> {
		return this.businessModelData.controllingMembersData.membersWithoutSwl;
	}

	get employeesList(): Array<any> {
		return this.businessModelData.employeesData.employees ?? [];
	}

	get isReprint(): string {
		console.log('reprint', this.businessModelData.reprintLicenceData);
		return this.businessModelData.reprintLicenceData.reprintLicence ?? '';
	}

	get isUpdate(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Update;
	}
	get showEditButton(): boolean {
		return !this.isStaticDataView && !this.isUpdate;
	}
}
