import { Component, Input, OnInit } from '@angular/core';
import { ApplicationTypeCode, LicenceTermCode, ServiceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { PermitApplicationService } from '@app/core/services/permit-application.service';

@Component({
	selector: 'app-step-permit-summary-update-authenticated',
	template: `
		<app-step-section
			heading="Application summary"
			subheading="Review your information before submitting your application"
		>
			<div class="row">
				<div class="col-xxl-10 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<mat-accordion multi="true">
						<mat-expansion-panel class="mb-2" [expanded]="true">
							<mat-expansion-panel-header>
								<mat-panel-title class="review-panel-title">
									<mat-toolbar class="d-flex justify-content-between">
										<div class="panel-header">Permit Updates</div>
									</mat-toolbar>
								</mat-panel-title>
							</mat-expansion-panel-header>

							<div class="panel-body">
								<div class="row mt-0 mb-4">
									<div class="col-xl-4 col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">
											Licence Holder Name
											@if (hasBcscNameChanged) {
												<span>(New Name)</span>
											}
										</div>
										<div class="summary-text-data">{{ licenceHolderName }}</div>
									</div>
									<div class="col-xl-4 col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">Licence Number</div>
										<div class="summary-text-data">{{ originalLicenceNumber }}</div>
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
										<div class="text-label d-block text-muted">Print Permit</div>
										<div class="summary-text-data">{{ isReprint }}</div>
									</div>
									<div class="col-xl-4 col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">Reprint Fee</div>
										<div class="summary-text-data">
											{{ licenceFee | currency: 'CAD' : 'symbol-narrow' : '1.0' | default }}
										</div>
									</div>
									@if (showPhotographOfYourselfStep) {
										<div class="col-xl-4 col-lg-6 col-md-12">
											<div class="text-label d-block text-muted">Photograph of Yourself</div>
											<div class="summary-text-data">
												<ul class="m-0">
													@for (doc of photoOfYourselfAttachments; track doc; let i = $index) {
														<li>{{ doc.name }}</li>
													}
												</ul>
											</div>
										</div>
									}

									<mat-divider class="mt-3 mb-2"></mat-divider>
									<app-worker-summary-criminal-history
										[workerModelData]="permitModelData"
									></app-worker-summary-criminal-history>

									<mat-divider class="mt-3 mb-2"></mat-divider>
									<app-permit-summary-purpose [permitModelData]="permitModelData"></app-permit-summary-purpose>

									@if (showEmployerInformation) {
										<mat-divider class="mt-3 mb-2"></mat-divider>
										<app-permit-summary-employer-information
											[permitModelData]="permitModelData"
										></app-permit-summary-employer-information>
									}

									<mat-divider class="mt-3 mb-2"></mat-divider>
									<app-permit-summary-rationale [permitModelData]="permitModelData"></app-permit-summary-rationale>
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
		`,
	],
	standalone: false,
})
export class StepPermitSummaryUpdateAuthenticatedComponent implements OnInit {
	formalDateFormat = SPD_CONSTANTS.date.formalDateFormat;

	permitModelData: any = {};

	@Input() showEmployerInformation!: boolean;

	constructor(
		private permitApplicationService: PermitApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		this.permitModelData = this.permitApplicationService.permitModelFormGroup.getRawValue();
	}

	onUpdateData(): void {
		this.permitModelData = {
			...this.permitApplicationService.permitModelFormGroup.getRawValue(),
		};
	}

	get licenceHolderName(): string {
		return this.permitApplicationService.getSummarylicenceHolderName(this.permitModelData);
	}
	get showPhotographOfYourselfStep(): boolean {
		return this.permitApplicationService.showPhotographOfYourselfStep(this.permitModelData);
	}

	get hasBcscNameChanged(): boolean {
		return this.permitApplicationService.getSummaryhasBcscNameChanged(this.permitModelData);
	}
	get hasGenderChanged(): boolean {
		return this.permitApplicationService.getSummaryhasGenderChanged(this.permitModelData);
	}
	get originalLicenceNumber(): string {
		return this.permitApplicationService.getSummaryoriginalLicenceNumber(this.permitModelData);
	}
	get originalExpiryDate(): string {
		return this.permitApplicationService.getSummaryoriginalExpiryDate(this.permitModelData);
	}
	get originalLicenceTermCode(): string {
		return this.permitApplicationService.getSummaryoriginalLicenceTermCode(this.permitModelData);
	}

	get licenceFee(): number | null {
		if (!this.licenceTermCode) {
			return null;
		}

		const originalLicenceData = this.permitModelData.originalLicenceData;
		const fee = this.commonApplicationService.getLicenceFee(
			this.serviceTypeCode,
			ApplicationTypeCode.Update,
			originalLicenceData.originalBizTypeCode,
			this.licenceTermCode,
			originalLicenceData.originalLicenceTermCode
		);

		return fee ? (fee.amount ?? null) : null;
	}
	get isReprint(): string {
		return this.permitApplicationService.getSummaryisReprint(this.permitModelData);
	}

	get serviceTypeCode(): ServiceTypeCode | null {
		return this.permitApplicationService.getSummaryserviceTypeCode(this.permitModelData);
	}

	get licenceTermCode(): LicenceTermCode | null {
		return this.permitApplicationService.getSummarylicenceTermCode(this.permitModelData);
	}

	get photoOfYourselfAttachments(): File[] | null {
		return this.permitApplicationService.getSummaryphotoOfYourselfAttachments(this.permitModelData);
	}
}
