import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
	selector: 'app-step-worker-licence-summary-anonymous',
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
								</div>

								<app-form-licence-category-summary [categoryList]="categoryList"></app-form-licence-category-summary>

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
										<div class="panel-header">Background</div>
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

								<ng-container *ngIf="applicationTypeCode !== applicationTypeCodes.Update">
									<mat-divider class="mt-3 mb-2"></mat-divider>

									<div class="text-minor-heading-small">Fingerprints</div>
									<div class="row mt-0">
										<div class="col-12">
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

								<ng-container *ngIf="hasLegalNameChanged">
									<mat-divider class="mt-3 mb-2"></mat-divider>

									<div class="text-minor-heading-small">Legal Name Change</div>
									<div class="row mt-0">
										<div class="col-12">
											<div class="text-label d-block text-muted">Legal Name Change Form</div>
											<div class="summary-text-data">
												<ul class="m-0">
													<ng-container *ngFor="let doc of hasLegalNameChangedAttachments; let i = index">
														<li>{{ doc.name }}</li>
													</ng-container>
												</ul>
											</div>
										</div>
									</div>
								</ng-container>

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

									<ng-container *ngIf="showCitizenshipStep">
										<mat-divider class="mt-3 mb-2"></mat-divider>
										<app-worker-summary-citizenship
											[workerModelData]="licenceModelData"
										></app-worker-summary-citizenship>
									</ng-container>

									<mat-divider class="mt-3 mb-2"></mat-divider>
									<app-worker-summary-bc-drivers-licence
										[workerModelData]="licenceModelData"
									></app-worker-summary-bc-drivers-licence>
								</ng-container>

								<ng-container *ngIf="photoOfYourselfAttachments">
									<mat-divider class="mt-3 mb-2"></mat-divider>
									<app-worker-summary-photo-of-yourself
										[workerModelData]="licenceModelData"
									></app-worker-summary-photo-of-yourself>
								</ng-container>

								<mat-divider class="mt-3 mb-2"></mat-divider>
								<app-worker-summary-characteristics
									[workerModelData]="licenceModelData"
								></app-worker-summary-characteristics>

								<mat-divider class="mt-3 mb-2"></mat-divider>
								<app-form-address-summary
									[formData]="licenceModelData.residentialAddressData"
									headingLabel="Residential Address"
									[isAddressTheSame]="false"
								></app-form-address-summary>

								<mat-divider class="mt-3 mb-2"></mat-divider>
								<app-form-address-summary
									[formData]="licenceModelData.mailingAddressData"
									headingLabel="Mailing Address"
									[isAddressTheSame]="isAddressTheSame"
									isAddressTheSameLabel="Mailing address is the same as the residential address"
								></app-form-address-summary>

								<mat-divider class="mt-3 mb-2"></mat-divider>
								<div class="text-minor-heading-small">Contact</div>
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
						line-height: normal;
						font-size: 1em;
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
export class StepWorkerLicenceSummaryAnonymousComponent implements OnInit {
	licenceModelData: any = {};

	booleanTypeCodes = BooleanTypeCode;
	applicationTypeCodes = ApplicationTypeCode;

	@Input() showCitizenshipStep = true;

	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	constructor(
		private workerApplicationService: WorkerApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		this.licenceModelData = this.workerApplicationService.workerModelFormGroup.getRawValue();
	}

	onEditStep(stepNumber: number) {
		this.editStep.emit(stepNumber);
	}

	onUpdateData(): void {
		this.licenceModelData = {
			...this.workerApplicationService.workerModelFormGroup.getRawValue(),
		};
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

	get photoOfYourselfAttachments(): File[] | null {
		return this.workerApplicationService.getSummaryphotoOfYourselfAttachments(this.licenceModelData);
	}

	get licenceTermCode(): LicenceTermCode | null {
		return this.workerApplicationService.getSummarylicenceTermCode(this.licenceModelData);
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

		const fee = this.commonApplicationService.getLicenceFee(
			this.serviceTypeCode,
			this.applicationTypeCode,
			bizTypeCode,
			this.licenceTermCode,
			originalLicenceData.originalLicenceTermCode
		);
		return fee ? (fee.amount ?? null) : null;
	}

	get applicantName(): string {
		return this.workerApplicationService.getSummaryapplicantName(this.licenceModelData);
	}
	get genderCode(): string {
		return this.workerApplicationService.getSummarygenderCode(this.licenceModelData);
	}
	get dateOfBirth(): string {
		return this.workerApplicationService.getSummarydateOfBirth(this.licenceModelData);
	}
	get hasLegalNameChanged(): boolean {
		return this.workerApplicationService.getSummaryhasLegalNameChanged(this.licenceModelData);
	}
	get hasLegalNameChangedAttachments(): File[] {
		return this.workerApplicationService.getSummaryhasLegalNameChangedAttachments(this.licenceModelData);
	}

	get previousNameFlag(): string {
		return this.workerApplicationService.getSummarypreviousNameFlag(this.licenceModelData);
	}
	get aliases(): Array<any> {
		return this.workerApplicationService.getSummaryaliases(this.licenceModelData);
	}

	get proofOfFingerprintAttachments(): File[] {
		return this.workerApplicationService.getSummaryproofOfFingerprintAttachments(this.licenceModelData);
	}

	get emailAddress(): string {
		return this.workerApplicationService.getSummaryemailAddress(this.licenceModelData);
	}
	get phoneNumber(): string {
		return this.workerApplicationService.getSummaryphoneNumber(this.licenceModelData);
	}

	get isAddressTheSame(): boolean {
		return this.workerApplicationService.getSummaryisAddressTheSame(this.licenceModelData);
	}

	get categoryList(): Array<WorkerCategoryTypeCode> {
		return this.workerApplicationService.getSummarycategoryList(this.licenceModelData);
	}
}
