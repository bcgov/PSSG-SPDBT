import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
	ApplicationTypeCode,
	BizTypeCode,
	LicenceTermCode,
	ServiceTypeCode,
	WorkerCategoryTypeCode,
} from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';

@Component({
	selector: 'app-step-worker-licence-summary-review-authenticated',
	template: `
		<app-step-section title="Application summary" subtitle="Review your information before submitting your application">
			<div class="row">
				<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mb-3 mx-auto">
					<mat-accordion multi="true">
						<mat-expansion-panel class="mb-2" [expanded]="true">
							<mat-expansion-panel-header>
								<mat-panel-title class="review-panel-title">
									<mat-toolbar class="d-flex justify-content-between">
										<div class="panel-header">Licence Selection</div>
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
								<div class="text-minor-heading-small mt-4">Licence Information</div>
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
									<div class="col-lg-4 col-md-12" *ngIf="soleProprietorBizTypeCode">
										<div class="text-label d-block text-muted">Sole Proprietorship Security Business Licence</div>
										<div class="summary-text-data">
											{{ soleProprietorBizTypeCode | options: 'BizTypes' }}
										</div>
									</div>
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Licence Term</div>
										<div class="summary-text-data">{{ licenceTermCode | options: 'LicenceTermTypes' }}</div>
									</div>
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Fee</div>
										<div class="summary-text-data">
											{{ licenceFee | currency: 'CAD' : 'symbol-narrow' : '1.0' | default }}
										</div>
									</div>
									<div class="col-xl-4 col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">Licence Categories</div>
										<div class="summary-text-data">
											<ul class="m-0">
												<ng-container *ngFor="let category of categoryList; let i = index">
													<li>{{ category | options: 'WorkerCategoryTypes' }}</li>
												</ng-container>
											</ul>
										</div>
									</div>
								</div>

								<app-worker-summary-document-uploaded
									[workerModelData]="licenceModelData"
								></app-worker-summary-document-uploaded>

								<app-worker-summary-dogs-restraints
									[workerModelData]="licenceModelData"
								></app-worker-summary-dogs-restraints>

								<app-worker-summary-expired-licence
									[workerModelData]="licenceModelData"
								></app-worker-summary-expired-licence>
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
								<div class="text-minor-heading-small">Identification</div>

								<app-worker-summary-citizenship
									[workerModelData]="licenceModelData"
									[showCitizenshipStep]="showCitizenshipStep"
								></app-worker-summary-citizenship>

								<app-worker-summary-photo-of-yourself
									[workerModelData]="licenceModelData"
								></app-worker-summary-photo-of-yourself>

								<app-worker-summary-bc-drivers-licence
									[workerModelData]="licenceModelData"
								></app-worker-summary-bc-drivers-licence>

								<div class="row mt-0">
									<div class="col-lg-6 col-md-12" *ngIf="isNotRenewal">
										<div class="text-label d-block text-muted">Request for Fingerprinting Form</div>
										<div class="summary-text-data">
											<ul class="m-0">
												<ng-container *ngFor="let doc of proofOfFingerprintAttachments; let i = index">
													<li>{{ doc.name }}</li>
												</ng-container>
											</ul>
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
export class StepWorkerLicenceSummaryReviewAuthenticatedComponent implements OnInit {
	licenceModelData: any = {};

	booleanTypeCodes = BooleanTypeCode;
	categoryTypeCodes = WorkerCategoryTypeCode;

	categoryArmouredCarGuardFormGroup: FormGroup = this.workerApplicationService.categoryArmouredCarGuardFormGroup;
	categoryBodyArmourSalesFormGroup: FormGroup = this.workerApplicationService.categoryBodyArmourSalesFormGroup;
	categoryClosedCircuitTelevisionInstallerFormGroup: FormGroup =
		this.workerApplicationService.categoryClosedCircuitTelevisionInstallerFormGroup;
	categoryElectronicLockingDeviceInstallerFormGroup: FormGroup =
		this.workerApplicationService.categoryElectronicLockingDeviceInstallerFormGroup;
	categoryFireInvestigatorFormGroup: FormGroup = this.workerApplicationService.categoryFireInvestigatorFormGroup;
	categoryLocksmithFormGroup: FormGroup = this.workerApplicationService.categoryLocksmithFormGroup;
	categoryPrivateInvestigatorSupFormGroup: FormGroup =
		this.workerApplicationService.categoryPrivateInvestigatorSupFormGroup;
	categoryPrivateInvestigatorFormGroup: FormGroup = this.workerApplicationService.categoryPrivateInvestigatorFormGroup;
	categorySecurityAlarmInstallerFormGroup: FormGroup =
		this.workerApplicationService.categorySecurityAlarmInstallerFormGroup;
	categorySecurityConsultantFormGroup: FormGroup = this.workerApplicationService.categorySecurityConsultantFormGroup;
	categoryLocksmithSupFormGroup: FormGroup = this.workerApplicationService.categoryLocksmithSupFormGroup;
	categorySecurityAlarmInstallerSupFormGroup: FormGroup =
		this.workerApplicationService.categorySecurityAlarmInstallerSupFormGroup;
	categorySecurityAlarmMonitorFormGroup: FormGroup =
		this.workerApplicationService.categorySecurityAlarmMonitorFormGroup;
	categorySecurityAlarmResponseFormGroup: FormGroup =
		this.workerApplicationService.categorySecurityAlarmResponseFormGroup;
	categorySecurityAlarmSalesFormGroup: FormGroup = this.workerApplicationService.categorySecurityAlarmSalesFormGroup;
	categorySecurityGuardFormGroup: FormGroup = this.workerApplicationService.categorySecurityGuardFormGroup;
	categorySecurityGuardSupFormGroup: FormGroup = this.workerApplicationService.categorySecurityGuardSupFormGroup;

	@Input() showCitizenshipStep = true;

	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	constructor(
		private workerApplicationService: WorkerApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		this.licenceModelData = { ...this.workerApplicationService.workerModelFormGroup.getRawValue() };
	}

	onEditStep(stepNumber: number) {
		this.editStep.emit(stepNumber);
	}

	onUpdateData(): void {
		this.licenceModelData = {
			...this.workerApplicationService.workerModelFormGroup.getRawValue(),
		};
	}

	get isNotRenewal(): boolean {
		return this.applicationTypeCode != ApplicationTypeCode.Renewal;
	}

	get isSoleProprietor(): string {
		return this.workerApplicationService.getSummaryisSoleProprietor(this.licenceModelData);
	}

	get licenceFee(): number | null {
		if (!this.licenceTermCode) {
			return null;
		}

		const originalLicenceData = this.licenceModelData.originalLicenceData;

		let bizTypeCode: BizTypeCode | null = originalLicenceData.originalBizTypeCode;
		if (this.applicationTypeCode === ApplicationTypeCode.New) {
			bizTypeCode = this.licenceModelData.soleProprietorData.bizTypeCode ?? BizTypeCode.None;
		}

		const originalLicenceTermCode = originalLicenceData.originalLicenceTermCode;

		const fee = this.commonApplicationService.getLicenceFee(
			this.serviceTypeCode,
			this.applicationTypeCode,
			bizTypeCode,
			this.licenceTermCode,
			originalLicenceTermCode
		);
		return fee ? (fee.amount ?? null) : null;
	}

	get serviceTypeCode(): ServiceTypeCode | null {
		return this.workerApplicationService.getSummaryserviceTypeCode(this.licenceModelData);
	}

	get applicationTypeCode(): ApplicationTypeCode | null {
		return this.workerApplicationService.getSummaryapplicationTypeCode(this.licenceModelData);
	}

	get soleProprietorBizTypeCode(): string {
		return this.workerApplicationService.getSummarysoleProprietorBizTypeCode(this.licenceModelData);
	}

	get licenceTermCode(): LicenceTermCode | null {
		return this.workerApplicationService.getSummarylicenceTermCode(this.licenceModelData);
	}

	get proofOfFingerprintAttachments(): File[] {
		return this.workerApplicationService.getSummaryproofOfFingerprintAttachments(this.licenceModelData);
	}

	get showAdditionalGovIdData(): boolean {
		return this.workerApplicationService.getSummaryshowAdditionalGovIdData(this.licenceModelData);
	}

	get categoryList(): Array<WorkerCategoryTypeCode> {
		return this.workerApplicationService.getSummarycategoryList(this.licenceModelData);
	}
}
