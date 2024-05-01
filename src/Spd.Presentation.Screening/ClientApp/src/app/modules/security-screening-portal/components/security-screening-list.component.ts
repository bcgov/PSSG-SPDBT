import { Component, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
	ApplicantApplicationListResponse,
	ApplicantApplicationResponse,
	ApplicationPortalStatusCode,
	CaseSubStatusCode,
	PayerPreferenceTypeCode,
	PaymentLinkCreateRequest,
	PaymentLinkResponse,
	PaymentMethodCode,
	ServiceTypeCode,
} from 'src/app/api/models';
import { ApplicantService, PaymentService } from 'src/app/api/services';
import { AppRoutes } from 'src/app/app-routing.module';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthUserBcscService } from 'src/app/core/services/auth-user-bcsc.service';
import { UtilService } from 'src/app/core/services/util.service';
import { SecurityScreeningRoutes } from '../security-screening-routing.module';

export interface ApplicantApplicationStatusResponse extends ApplicantApplicationResponse {
	applicationPortalStatusClass: string;
	actionAlert: string | null;
	isPayManual: boolean;
	isPayNow: boolean;
}
@Component({
	selector: 'app-security-screening-list',
	template: `
		<div class="row">
			<div class="col-xl-8 col-lg-6 col-md-12">
				<h3 class="fw-normal">Criminal Record Check History</h3>
				<h4 class="fw-light">{{ applicantName }}</h4>
			</div>
			<div class="col-xl-4 col-lg-6 col-md-12">
				<div class="d-flex justify-content-end my-2">
					<mat-button-toggle-group
						[(ngModel)]="applicationFilter"
						(change)="onFilterChange($event)"
						class="w-100"
						aria-label="Applications Filter"
					>
						<mat-button-toggle class="button-toggle w-100" value="ACTIVE"> Active Applications </mat-button-toggle>
						<mat-button-toggle class="button-toggle w-100" value="ALL"> All Applications </mat-button-toggle>
					</mat-button-toggle-group>
				</div>
			</div>
		</div>

		<mat-divider class="mat-divider-main my-2 mb-lg-4"></mat-divider>

		<div class="row">
			<div class="col-12">
				<app-alert type="danger" *ngIf="opportunityToRespondAlert">
					<div class="fw-semibold">{{ opportunityToRespondAlert }}</div>
				</app-alert>
				<app-alert type="danger" *ngIf="requestForAdditionalInfoAlert">
					<div class="fw-semibold">{{ requestForAdditionalInfoAlert }}</div>
				</app-alert>
				<app-alert type="danger" *ngIf="fingerprintsAlert">
					<div class="fw-semibold">{{ fingerprintsAlert }}</div>
				</app-alert>
				<app-alert type="danger" *ngIf="selfDisclosureAlert">
					<div class="fw-semibold">{{ selfDisclosureAlert }}</div>
				</app-alert>
			</div>
		</div>

		<div class="row mb-2">
			<div class="col-12">
				<mat-table [dataSource]="dataSource">
					<ng-container matColumnDef="orgName">
						<mat-header-cell *matHeaderCellDef>Organization Name</mat-header-cell>
						<mat-cell *matCellDef="let application">
							<span class="mobile-label">Organization Name:</span>
							{{ application.orgName }}
						</mat-cell>
					</ng-container>

					<ng-container matColumnDef="createdOn">
						<mat-header-cell *matHeaderCellDef>Submitted On</mat-header-cell>
						<mat-cell *matCellDef="let application">
							<span class="mobile-label">Submitted On:</span>
							{{ application.createdOn | formatDate }}
						</mat-cell>
					</ng-container>

					<ng-container matColumnDef="applicationNumber">
						<mat-header-cell *matHeaderCellDef>Case ID</mat-header-cell>
						<mat-cell *matCellDef="let application">
							<span class="mobile-label">Case ID:</span>
							{{ application.applicationNumber }}
						</mat-cell>
					</ng-container>

					<ng-container matColumnDef="payeeType">
						<mat-header-cell *matHeaderCellDef>Paid By</mat-header-cell>
						<mat-cell *matCellDef="let application">
							<span class="mobile-label">Paid By:</span>
							{{ application.payeeType }}
						</mat-cell>
					</ng-container>

					<ng-container matColumnDef="status">
						<mat-header-cell *matHeaderCellDef>Application Status</mat-header-cell>
						<mat-cell *matCellDef="let application">
							<span class="mobile-label">Application Status:</span>
							<mat-chip-row aria-label="Status" [ngClass]="application.applicationPortalStatusClass" class="w-100">
								{{ application.status | options : 'ApplicationPortalStatusTypes' : application.status }}
							</mat-chip-row>
						</mat-cell>
					</ng-container>

					<ng-container matColumnDef="action1">
						<mat-header-cell *matHeaderCellDef>Your Action Required</mat-header-cell>
						<mat-cell *matCellDef="let application">
							<span class="mobile-label">Your Action Required:</span>
							<ng-container *ngIf="application.actionAlert">
								<div style="color: red;">
									{{ application.actionAlert }}
								</div>
							</ng-container>
							<button
								mat-flat-button
								(click)="onPayNow(application)"
								class="table-button"
								style="color: var(--color-green);"
								aria-label="Pay now"
								*ngIf="application.isPayNow"
							>
								<mat-icon>payment</mat-icon>Pay Now
							</button>

							<button
								mat-flat-button
								(click)="onPayManual(application)"
								class="table-button"
								style="color: var(--color-red);"
								aria-label="Pay manually"
								*ngIf="application.isPayManual"
							>
								<mat-icon>payment</mat-icon>Pay Manually
							</button>
						</mat-cell>
					</ng-container>

					<ng-container matColumnDef="action2">
						<mat-header-cell *matHeaderCellDef></mat-header-cell>
						<mat-cell *matCellDef="let application">
							<button mat-flat-button (click)="onViewDetail(application)" class="table-button" aria-label="View Detail">
								Detail
							</button>
						</mat-cell>
					</ng-container>

					<mat-header-row *matHeaderRowDef="columns; sticky: true"></mat-header-row>
					<mat-row *matRowDef="let row; columns: columns"></mat-row>
				</mat-table>
			</div>
		</div>
	`,
	styles: [
		`
			.mat-column-status {
				min-width: 250px;
			}

			.mat-column-action1 {
				min-width: 190px;
				.table-button {
					min-width: 160px;
				}
			}

			.mat-column-action2 {
				min-width: 100px;
				.table-button {
					min-width: 100px;
				}
			}

			@media (max-width: 991px) {
				.mdc-button {
					border: 1px solid black;
				}
			}
		`,
	],
})
export class SecurityScreeningListComponent implements OnInit {
	applicantName = '';
	applicationFilter = 'ACTIVE';
	allApplications: Array<ApplicantApplicationStatusResponse> = [];
	applicationPortalStatusCodes = ApplicationPortalStatusCode;

	constants = SPD_CONSTANTS;
	dataSource: MatTableDataSource<ApplicantApplicationStatusResponse> =
		new MatTableDataSource<ApplicantApplicationStatusResponse>([]);
	columns: string[] = ['orgName', 'createdOn', 'applicationNumber', 'payeeType', 'status', 'action1', 'action2'];

	opportunityToRespondAlert: string | null = null;
	requestForAdditionalInfoAlert: string | null = null;
	fingerprintsAlert: string | null = null;
	selfDisclosureAlert: string | null = null;

	constructor(
		private router: Router,
		private applicantService: ApplicantService,
		private paymentService: PaymentService,
		private authUserService: AuthUserBcscService,
		private utilService: UtilService
	) {}

	ngOnInit() {
		if (!this.authUserService.bcscUserWhoamiProfile?.applicantId) {
			console.debug(
				'SecurityScreeningListComponent - bcscUserWhoamiProfile missing applicantId',
				this.authUserService.bcscUserWhoamiProfile
			);
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
			return;
		}

		this.loadList();
	}

	onFilterChange(_event: MatButtonToggleChange) {
		this.setFilterApplications();
	}

	onViewDetail(application: ApplicantApplicationStatusResponse): void {
		this.router.navigateByUrl(`/${SecurityScreeningRoutes.path(SecurityScreeningRoutes.CRC_DETAIL)}`, {
			state: { applicationData: application },
		});
	}

	onPayNow(application: ApplicantApplicationStatusResponse): void {
		const body: PaymentLinkCreateRequest = {
			applicationId: application.id!,
			paymentMethod: PaymentMethodCode.CreditCard,
			description: `Payment for Case ID: ${application.applicationNumber}`,
		};

		this.paymentService
			.apiApplicantsScreeningsApplicationIdPaymentLinkPost({
				applicationId: application.id!,
				body,
			})
			.pipe()
			.subscribe((res: PaymentLinkResponse) => {
				if (res.paymentLinkUrl) {
					window.location.assign(res.paymentLinkUrl);
				}
			});
	}

	onPayManual(application: ApplicantApplicationStatusResponse): void {
		this.router.navigateByUrl(`/${SecurityScreeningRoutes.path(SecurityScreeningRoutes.PAYMENT_MANUAL)}`, {
			state: { applicationData: application },
		});
	}

	private loadList(): void {
		this.opportunityToRespondAlert = null;
		this.requestForAdditionalInfoAlert = null;
		this.fingerprintsAlert = null;
		this.selfDisclosureAlert = null;

		let opportunityToRespondCount = 0;
		let requestForAdditionalInfoCount = 0;
		const fingerprintsCount = 0;
		let selfDisclosureCount = 0;

		this.applicantService
			.apiApplicantsApplicantIdScreeningsGet({
				applicantId: this.authUserService.bcscUserWhoamiProfile?.applicantId!,
			})
			.pipe()
			.subscribe((res: ApplicantApplicationListResponse) => {
				this.allApplications = res.applications as Array<ApplicantApplicationStatusResponse>;

				const firstRecord = this.allApplications ? this.allApplications[0] : null;

				this.applicantName = this.utilService.getFullName(firstRecord?.givenName, firstRecord?.surname) ?? '';

				this.allApplications.forEach((app: ApplicantApplicationStatusResponse) => {
					app.applicationPortalStatusClass = this.utilService.getApplicationPortalStatusClass(app.status);

					if (
						app.status != ApplicationPortalStatusCode.AwaitingPayment ||
						app.payeeType == PayerPreferenceTypeCode.Organization
					) {
						app.isPayManual = false;
						app.isPayNow = false;
					} else {
						const numberOfAttempts = app.failedPaymentAttempts ?? 0;
						app.isPayManual = numberOfAttempts >= SPD_CONSTANTS.payment.maxNumberOfAttempts;
						app.isPayNow = numberOfAttempts < SPD_CONSTANTS.payment.maxNumberOfAttempts;
					}

					let documentsRequiredCount = 0;
					if (app.status == ApplicationPortalStatusCode.AwaitingApplicant) {
						switch (app.caseSubStatus) {
							case CaseSubStatusCode.OpportunityToRespond:
								documentsRequiredCount++;
								opportunityToRespondCount++;
								break;
							case CaseSubStatusCode.ApplicantInformation:
								documentsRequiredCount++;
								requestForAdditionalInfoCount++;
								break;
						}
					} else if (app.status == ApplicationPortalStatusCode.UnderAssessment) {
						// SPDBT-2237 self disclosure only applies to PSSO/PssoVs
						if (
							app.caseSubStatus == CaseSubStatusCode.SelfDisclosure &&
							(app.serviceType === ServiceTypeCode.Psso || app.serviceType === ServiceTypeCode.PssoVs)
						) {
							documentsRequiredCount++;
							selfDisclosureCount++;
						}
					}

					if (documentsRequiredCount > 0) {
						app.actionAlert = this.getDocumentRequiredText(documentsRequiredCount);
					}
				});

				this.opportunityToRespondAlert = this.getOpportunityToRespondText(opportunityToRespondCount);
				this.requestForAdditionalInfoAlert = this.getRequestForAdditionalInfoText(requestForAdditionalInfoCount);
				this.fingerprintsAlert = this.getFingerprintsText(fingerprintsCount);
				this.selfDisclosureAlert = this.getSelfDisclosureText(selfDisclosureCount);

				this.setFilterApplications();
			});
	}

	private setFilterApplications(): void {
		const selectedApplications =
			this.applicationFilter == 'ACTIVE'
				? this.allApplications.filter((app) => {
						return ![
							'CancelledByOrganization',
							'CancelledByApplicant',
							'ClosedNoConsent',
							'ClosedNoResponse',
							'CompletedCleared',
						].includes(app.status ?? '');
				  })
				: [...this.allApplications];
		this.dataSource.data = selectedApplications;
	}

	private getDocumentRequiredText(count: number): string | null {
		if (count == 0) return null;
		return count > 1 ? 'Documents required' : 'Document required';
	}

	private getOpportunityToRespondText(count: number): string | null {
		if (count == 0) return null;
		return count > 1
			? `You have the opportunity to respond on ${count} applications`
			: 'You have the opportunity to respond on 1 application';
	}

	private getRequestForAdditionalInfoText(count: number): string | null {
		if (count == 0) return null;
		return count > 1
			? `${count} applications require additional information`
			: '1 application requires additional information';
	}

	private getFingerprintsText(count: number): string | null {
		if (count == 0) return null;
		return count > 1
			? `Fingerprint information required on ${count} applications`
			: 'Fingerprint information required on 1 application';
	}

	private getSelfDisclosureText(count: number): string | null {
		if (count == 0) return null;
		return count > 1
			? `You have the opportunity to provide a self disclosure on ${count} applications`
			: 'You have the opportunity to provide a self disclosure on 1 application';
	}
}
