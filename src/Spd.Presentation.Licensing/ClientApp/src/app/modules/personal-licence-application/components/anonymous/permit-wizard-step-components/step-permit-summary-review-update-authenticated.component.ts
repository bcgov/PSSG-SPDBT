import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApplicationTypeCode, LicenceFeeResponse, WorkerLicenceTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { ApplicationService } from '@app/core/services/application.service';
import { PermitApplicationService } from '@core/services/permit-application.service';

@Component({
	selector: 'app-step-permit-summary-review-update-authenticated',
	template: `
		<app-step-section title="Application Summary" subtitle="Review your information before submitting your application">
			<div class="row">
				<div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row mt-0 mb-4">
						<div class="col-lg-6 col-md-12">
							<div class="text-label d-block text-muted">
								Licence Holder Name <span *ngIf="hasBcscNameChanged">(New Name)</span>
							</div>
							<div class="summary-text-data">{{ licenceHolderName }}</div>
						</div>
						<div class="col-lg-3 col-md-12">
							<div class="text-label d-block text-muted">Licence Number</div>
							<div class="summary-text-data">{{ originalLicenceNumber }}</div>
						</div>
						<div class="col-lg-3 col-md-12">
							<div class="text-label d-block text-muted">Expiry Date</div>
							<div class="summary-text-data">
								{{ originalExpiryDate | formatDate : formalDateFormat }}
							</div>
						</div>
						<div class="col-lg-3 col-md-12">
							<div class="text-label d-block text-muted">Licence Term</div>
							<div class="summary-text-data">{{ originalLicenceTermCode | options : 'LicenceTermTypes' }}</div>
						</div>
						<div class="col-lg-3 col-md-12">
							<div class="text-label d-block text-muted">Print Permit</div>
							<div class="summary-text-data">{{ isReprint }}</div>
						</div>
						<div class="col-lg-3 col-md-12" *ngIf="licenceFee">
							<div class="text-label d-block text-muted">Reprint Fee</div>
							<div class="summary-text-data">
								{{ licenceFee | currency : 'CAD' : 'symbol-narrow' : '1.0' | default }}
							</div>
						</div>
						<div class="col-lg-6 col-md-12" *ngIf="showPhotographOfYourself">
							<div class="text-label d-block text-muted">Photograph of Yourself</div>
							<div class="summary-text-data">
								<ul class="m-0">
									<ng-container *ngFor="let doc of photoOfYourselfAttachments; let i = index">
										<li>{{ doc.name }}</li>
									</ng-container>
								</ul>
							</div>
						</div>

						<mat-divider class="mt-3 mb-2"></mat-divider>
						<div class="text-minor-heading">Purpose</div>
						<div class="row mt-0">
							<div class="col-lg-6 col-md-12">
								<div class="text-label d-block text-muted">{{ purposeLabel }}</div>
								<div class="summary-text-data">
									<ul class="m-0">
										<ng-container *ngFor="let reason of purposeReasons; let i = index">
											<li>{{ reason }}</li>
										</ng-container>
									</ul>
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

						<ng-container *ngIf="showEmployerInformation">
							<mat-divider class="mt-3 mb-2"></mat-divider>
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
						</ng-container>
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
export class StepPermitSummaryReviewUpdateAuthenticatedComponent implements OnInit {
	permitModelData: any = {};
	showEmployerInformation = false;
	formalDateFormat = SPD_CONSTANTS.date.formalDateFormat;

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

	get licenceHolderName(): string {
		return this.permitApplicationService.getSummarylicenceHolderName(this.permitModelData);
	}
	get showPhotographOfYourself(): boolean {
		return this.permitApplicationService.getSummaryshowPhotographOfYourself(this.permitModelData);
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

		const fee = this.commonApplicationService
			.getLicenceTermsAndFees(
				this.workerLicenceTypeCode,
				ApplicationTypeCode.Update,
				originalLicenceData.originalBizTypeCode,
				originalLicenceData.originalLicenceTermCode
			)
			.find((item: LicenceFeeResponse) => item.licenceTermCode == this.licenceTermCode);
		return fee ? fee.amount ?? null : null;
	}
	get isReprint(): string {
		return this.permitApplicationService.getSummaryisReprint(this.permitModelData);
	}

	get workerLicenceTypeCode(): WorkerLicenceTypeCode | null {
		return this.permitApplicationService.getSummaryworkerLicenceTypeCode(this.permitModelData);
	}
	get applicationTypeCode(): ApplicationTypeCode | null {
		return this.permitApplicationService.getSummaryapplicationTypeCode(this.permitModelData);
	}

	get licenceTermCode(): string {
		return this.permitApplicationService.getSummarylicenceTermCode(this.permitModelData);
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
