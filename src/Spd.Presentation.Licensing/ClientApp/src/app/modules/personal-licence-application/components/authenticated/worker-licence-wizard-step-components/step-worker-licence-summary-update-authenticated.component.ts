import { Component, OnInit } from '@angular/core';
import { ApplicationTypeCode, ServiceTypeCode, WorkerCategoryTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { UtilService } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';

@Component({
	selector: 'app-step-worker-licence-summary-update-authenticated',
	template: `
		<app-step-section title="Application summary" subtitle="Review your information before submitting your application">
			<div class="row">
				<div class="col-xxl-10 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<mat-accordion multi="true">
						<mat-expansion-panel class="mb-2" [expanded]="true">
							<mat-expansion-panel-header>
								<mat-panel-title class="review-panel-title">
									<mat-toolbar class="d-flex justify-content-between">
										<div class="panel-header">Licence Updates</div>
									</mat-toolbar>
								</mat-panel-title>
							</mat-expansion-panel-header>

							<div class="panel-body">
								<div class="row mt-0 mb-4">
									<div class="col-xl-4 col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">
											Licence Holder Name <span *ngIf="hasBcscNameChanged">(New Name)</span>
										</div>
										<div class="summary-text-data">{{ licenceHolderName }}</div>
									</div>
									<div class="col-xl-4 col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">Licence Number</div>
										<div class="summary-text-data">{{ originalLicenceNumber }}</div>
									</div>
									<div class="col-xl-4 col-lg-6 col-md-12" *ngIf="showPhotographOfYourselfStep">
										<div class="text-label d-block text-muted">Photograph of Yourself</div>
										<div class="summary-text-data">
											<ul class="m-0">
												<ng-container *ngFor="let doc of photoOfYourselfAttachments; let i = index">
													<li>{{ doc.name }}</li>
												</ng-container>
											</ul>
										</div>
									</div>
									<div class="col-xl-4 col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">Expiry Date</div>
										<div class="summary-text-data">
											{{ originalExpiryDate | formatDate: formalDateFormat }}
										</div>
									</div>

									<div class="col-xl-4 col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">Licence Term</div>
										<div class="summary-text-data">{{ originalLicenceTermCode | options: 'LicenceTermTypes' }}</div>
									</div>
									<div class="col-xl-4 col-lg-6 col-md-12">
										<ng-container *ngIf="isUpdate">
											<div class="text-label d-block text-muted">Reprint Fee</div>
											<div class="summary-text-data">
												{{ licenceFee | currency: 'CAD' : 'symbol-narrow' : '1.0' | default }}
											</div>
										</ng-container>
									</div>
								</div>

								<app-form-licence-category-summary [categoryList]="categoryList"></app-form-licence-category-summary>

								<app-worker-summary-document-uploaded
									[workerModelData]="licenceModelData"
								></app-worker-summary-document-uploaded>

								<app-worker-summary-dogs-restraints
									[workerModelData]="licenceModelData"
								></app-worker-summary-dogs-restraints>

								<mat-divider class="mt-3 mb-2"></mat-divider>
								<app-worker-summary-police-background
									[workerModelData]="licenceModelData"
								></app-worker-summary-police-background>

								<mat-divider class="mt-3 mb-2"></mat-divider>
								<app-worker-summary-mental-health-conditions
									[workerModelData]="licenceModelData"
								></app-worker-summary-mental-health-conditions>

								<mat-divider class="mt-3 mb-2"></mat-divider>
								<app-worker-summary-criminal-history
									[workerModelData]="licenceModelData"
								></app-worker-summary-criminal-history>
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
		`,
	],
	standalone: false,
})
export class StepWorkerLicenceSummaryUpdateAuthenticatedComponent implements OnInit {
	formalDateFormat = SPD_CONSTANTS.date.formalDateFormat;

	licenceModelData: any = {};

	constructor(
		private workerApplicationService: WorkerApplicationService,
		private commonApplicationService: CommonApplicationService,
		private utilService: UtilService
	) {}

	ngOnInit(): void {
		this.licenceModelData = this.workerApplicationService.workerModelFormGroup.getRawValue();
	}

	onUpdateData(): void {
		this.licenceModelData = {
			...this.workerApplicationService.workerModelFormGroup.getRawValue(),
		};
	}

	isFormValid(): boolean {
		return true;
	}

	get licenceHolderName(): string {
		return this.utilService.getFullNameWithMiddle(
			this.licenceModelData.personalInformationData.givenName,
			this.licenceModelData.personalInformationData.middleName1,
			this.licenceModelData.personalInformationData.middleName2,
			this.licenceModelData.personalInformationData.surname
		);
	}
	get showPhotographOfYourselfStep(): boolean {
		return this.workerApplicationService.showPhotographOfYourselfStep(this.licenceModelData);
	}

	get hasBcscNameChanged(): boolean {
		return this.workerApplicationService.getSummaryhasBcscNameChanged(this.licenceModelData);
	}
	get originalLicenceNumber(): string {
		return this.workerApplicationService.getSummaryoriginalLicenceNumber(this.licenceModelData);
	}
	get originalExpiryDate(): string {
		return this.workerApplicationService.getSummaryoriginalExpiryDate(this.licenceModelData);
	}
	get originalLicenceTermCode(): string {
		return this.workerApplicationService.getSummaryoriginalLicenceTermCode(this.licenceModelData);
	}

	get isUpdate(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Update;
	}
	get licenceFee(): number | null {
		if (!this.originalLicenceTermCode && !this.isUpdate) {
			return null;
		}

		const originalLicenceData = this.licenceModelData.originalLicenceData;

		const fee = this.commonApplicationService.getLicenceFee(
			this.serviceTypeCode,
			ApplicationTypeCode.Update,
			originalLicenceData.originalBizTypeCode,
			originalLicenceData.originalLicenceTermCode,
			originalLicenceData.originalLicenceTermCode
		);
		return fee ? (fee.amount ?? null) : null;
	}

	get serviceTypeCode(): ServiceTypeCode | null {
		return this.workerApplicationService.getSummaryserviceTypeCode(this.licenceModelData);
	}

	get applicationTypeCode(): ApplicationTypeCode | null {
		return this.workerApplicationService.getSummaryapplicationTypeCode(this.licenceModelData);
	}

	get photoOfYourselfAttachments(): File[] {
		return this.workerApplicationService.getSummaryphotoOfYourselfAttachments(this.licenceModelData) ?? [];
	}

	get categoryList(): Array<WorkerCategoryTypeCode> {
		return this.workerApplicationService.getSummarycategoryList(this.licenceModelData);
	}
}
