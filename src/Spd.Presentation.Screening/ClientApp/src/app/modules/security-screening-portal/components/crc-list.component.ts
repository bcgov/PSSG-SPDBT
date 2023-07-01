import { Component, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
	ApplicantApplicationListResponse,
	ApplicantApplicationResponse,
	ApplicationPortalStatusCode,
	CaseSubStatusCode,
} from 'src/app/api/models';
import { ApplicantService } from 'src/app/api/services';
import { AppRoutes } from 'src/app/app-routing.module';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthUserService } from 'src/app/core/services/auth-user.service';
import { UtilService } from 'src/app/core/services/util.service';
import { SecurityScreeningRoutes } from '../security-screening-routing.module';

export interface ApplicantApplicationStatusResponse extends ApplicantApplicationResponse {
	applicationPortalStatusClass: string;
	actionAlert: string | null;
}
@Component({
	selector: 'app-crc-list',
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

		<mat-divider class="mb-2 mb-lg-4"></mat-divider>

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
				<app-alert type="danger" *ngIf="statutoryDeclarationAlert">
					<div class="fw-semibold">{{ statutoryDeclarationAlert }}</div>
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
							{{ application.createdOn | date : constants.date.dateFormat }}
						</mat-cell>
					</ng-container>

					<ng-container matColumnDef="serviceType">
						<mat-header-cell *matHeaderCellDef>Type</mat-header-cell>
						<mat-cell *matCellDef="let application">
							<span class="mobile-label">Type:</span>
							{{ application.serviceType | options : 'ServiceTypes' }}
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
							<mat-chip-listbox aria-label="Status">
								<mat-chip-option [selectable]="false" [ngClass]="application.applicationPortalStatusClass">
									{{ application.status | options : 'ApplicationPortalStatusTypes' }}
								</mat-chip-option>
							</mat-chip-listbox>
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
						</mat-cell>
					</ng-container>

					<ng-container matColumnDef="action2">
						<mat-header-cell *matHeaderCellDef></mat-header-cell>
						<mat-cell *matCellDef="let application">
							<span class="mobile-label"></span>
							<a mat-flat-button (click)="onViewDetail(application)" class="m-2" aria-label="View Detail">
								<mat-icon>send</mat-icon>View detail
							</a>

							<!-- <button
								mat-flat-button
								class="table-button m-2"
								style="color: var(--color-primary-light);"
								aria-label="Download Clearance Letter"
								(click)="onDownloadClearanceLetter(application)"
							>
								<mat-icon>file_download</mat-icon>Clearance Letter
							</button> -->
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
				min-width: 190px;
				padding-right: 4px !important;
				padding-left: 4px !important;
			}

			.mat-column-action2 {
				min-width: 170px;
				padding-right: 4px !important;
				padding-left: 4px !important;
			}

			@media (max-width: 991px) {
				.mdc-button {
					border: 1px solid black;
				}
			}
		`,
	],
})
export class CrcListComponent implements OnInit {
	applicantName = '';
	applicationFilter: string = 'ACTIVE';
	allApplications: Array<ApplicantApplicationStatusResponse> = [];

	constants = SPD_CONSTANTS;
	dataSource: MatTableDataSource<ApplicantApplicationStatusResponse> =
		new MatTableDataSource<ApplicantApplicationStatusResponse>([]);
	columns: string[] = ['orgName', 'createdOn', 'serviceType', 'payeeType', 'status', 'action1', 'action2'];

	opportunityToRespondAlert: string | null = null;
	requestForAdditionalInfoAlert: string | null = null;
	fingerprintsAlert: string | null = null;
	statutoryDeclarationAlert: string | null = null;

	constructor(
		private router: Router,
		private applicantService: ApplicantService,
		private authUserService: AuthUserService,
		private utilService: UtilService
	) {}

	ngOnInit() {
		if (!this.authUserService.applicantProfile?.applicantId) {
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
			return;
		}

		this.loadList();
	}

	onFilterChange(event: MatButtonToggleChange) {
		this.setFilterApplications();
	}

	onViewDetail(application: ApplicantApplicationStatusResponse): void {
		this.router.navigateByUrl(`/${SecurityScreeningRoutes.path(SecurityScreeningRoutes.CRC_DETAIL)}`, {
			state: { applicationData: application },
		});

		// this.router.navigate([SecurityScreeningRoutes.path(SecurityScreeningRoutes.CRC_DETAIL)], {
		// 	queryParams: { applicationId: application.id },
		// });
	}

	onDownloadClearanceLetter(clearance: any) {
		// this.applicationService
		// 	.apiOrgsOrgIdClearancesClearanceIdFileGet$Response({
		// 		clearanceId: clearance.clearanceId!,
		// 		orgId: this.authUserService.userInfo?.orgId!,
		// 	})
		// 	.pipe()
		// 	.subscribe((resp: StrictHttpResponse<Blob>) => {
		// 		this.utilService.downloadFile(resp.headers, resp.body);
		// 	});
	}

	private loadList(): void {
		this.applicantName = this.utilService.getFullName(
			this.authUserService.applicantProfile?.firstName,
			this.authUserService.applicantProfile?.lastName
		);

		this.opportunityToRespondAlert = null;
		this.requestForAdditionalInfoAlert = null;
		this.fingerprintsAlert = null;
		this.statutoryDeclarationAlert = null;

		let opportunityToRespondCount = 0;
		let requestForAdditionalInfoCount = 0;
		let fingerprintsCount = 0;
		let statutoryDeclarationCount = 0;

		this.applicantService
			.apiApplicantsApplicantIdApplicationsGet({
				applicantId: this.authUserService.applicantProfile?.applicantId!,
			})
			.pipe()
			.subscribe((res: ApplicantApplicationListResponse) => {
				this.allApplications = res.applications as Array<ApplicantApplicationStatusResponse>;

				this.allApplications.forEach((app: ApplicantApplicationStatusResponse) => {
					app.applicationPortalStatusClass = this.utilService.getApplicationPortalStatusClass(app.status);

					let documentsRequiredCount = 0;
					if (app.status == ApplicationPortalStatusCode.AwaitingApplicant) {
						switch (app.caseSubStatus) {
							case CaseSubStatusCode.ConfirmationOfFingerprints:
								documentsRequiredCount++;
								fingerprintsCount++;
								break;
							case CaseSubStatusCode.ApplicantInformation:
								documentsRequiredCount++;
								opportunityToRespondCount++;
								break;
							case CaseSubStatusCode.OpportunityToRespond:
								documentsRequiredCount++;
								requestForAdditionalInfoCount++;
								break;
							case CaseSubStatusCode.StatutoryDeclaration:
								documentsRequiredCount++;
								statutoryDeclarationCount++;
								break;
						}
					}

					if (documentsRequiredCount > 0) {
						app.actionAlert = this.getDocumentRequiredText(documentsRequiredCount);
					}
				});

				this.opportunityToRespondAlert = this.getOpportunityToRespondText(opportunityToRespondCount);
				this.requestForAdditionalInfoAlert = this.getRequestForAdditionalInfoText(requestForAdditionalInfoCount);
				this.fingerprintsAlert = this.getFingerprintsText(fingerprintsCount);
				this.statutoryDeclarationAlert = this.getStatutoryDeclarationText(statutoryDeclarationCount);

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
							'ClosedJudicialReview',
							'CompletedCleared',
						].includes(app.status ?? '');
				  })
				: [...this.allApplications];
		this.dataSource.data = selectedApplications;
	}

	private getDocumentRequiredText(count: number): string | null {
		if ((count = 0)) return null;
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

	private getStatutoryDeclarationText(count: number): string | null {
		if (count == 0) return null;
		return count > 1
			? `You have the opportunity to provide a statutory declaration on ${count} applications`
			: 'You have the opportunity to provide a statutory declaration on 1 application';
	}
}
