import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApplicantApplicationListResponse, ApplicantApplicationResponse } from 'src/app/api/models';
import { ApplicantService } from 'src/app/api/services';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthUserService } from 'src/app/core/services/auth-user.service';
import { SecurityScreeningRoutes } from '../security-screening-routing.module';

@Component({
	selector: 'app-crc-list',
	template: `
		<h3 class="pb-2 fw-normal">Applicant Information for John Doe</h3>

		<div class="row mb-4">
			<div class="col-lg-8 col-md-12">
				<!-- <app-alert type="danger">
					<div class="fw-semibold">Fingerprint information required on 2 applications</div>
				</app-alert>

				<app-alert type="danger">
					<div class="fw-semibold">1 application requires additional information</div>
				</app-alert> -->

				<app-alert type="danger">
					<ul class="m-0">
						<li>Fingerprint information required on 2 applications</li>
						<li>1 application requires additional information</li>
						<li>You have the opportunity to respond on 2 applications</li>
						<li>You have the opportunity to provide a statutory declaration on 3 applications</li>
					</ul>
				</app-alert>
			</div>
		</div>

		<div class="row">
			<div class="col-lg-6 col-md-12">
				<h3 class="fw-light">Criminal Record Check History</h3>
			</div>
			<div class="col-lg-6 col-md-12">
				<div class="d-flex justify-content-end">
					<mat-button-toggle-group
						[(ngModel)]="screeningFilter"
						(change)="onFilterChange($event)"
						aria-label="Screening Filter"
					>
						<mat-button-toggle class="button-toggle" value="ACTIVE"> Active Screenings </mat-button-toggle>
						<mat-button-toggle class="button-toggle" value="ALL"> All Screenings </mat-button-toggle>
					</mat-button-toggle-group>
				</div>
			</div>
		</div>

		<!-- <div class="d-flex flex-row justify-content-between pt-4">
				<h3 class="fw-normal">Criminal Record Check History</h3>
				<mat-button-toggle-group
					[(ngModel)]="screeningFilter"
					(change)="onFilterChange($event)"
					aria-label="Screening Filter"
				>
					<mat-button-toggle class="button-toggle" value="ACTIVE"> Active Screenings </mat-button-toggle>
					<mat-button-toggle class="button-toggle" value="ALL"> All Screenings </mat-button-toggle>
				</mat-button-toggle-group>
			</div> -->

		<div class="row mt-4">
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
							{{ application.createdOn | date : constants.date.dateFormat : 'UTC' }}
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
								<mat-chip-option [selectable]="false">
									{{ application.status }}
								</mat-chip-option>
							</mat-chip-listbox>
						</mat-cell>
					</ng-container>

					<ng-container matColumnDef="action1">
						<mat-header-cell *matHeaderCellDef>Your Action Required</mat-header-cell>
						<mat-cell *matCellDef="let application">
							<span class="mobile-label">Your Action Required:</span>
							<div style="color: red;">Documents required</div>
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
		`,
	],
})
export class CrcListComponent implements OnInit {
	screeningFilter: string = 'ACTIVE';
	constants = SPD_CONSTANTS;
	dataSource: MatTableDataSource<ApplicantApplicationResponse> = new MatTableDataSource<ApplicantApplicationResponse>(
		[]
	);
	columns: string[] = ['orgName', 'createdOn', 'serviceType', 'payeeType', 'status', 'action1', 'action2'];

	@ViewChild('paginator') paginator!: MatPaginator;

	constructor(
		private router: Router,
		private applicantService: ApplicantService,
		private authUserService: AuthUserService
	) {}

	ngOnInit() {
		this.loadList();
	}

	onFilterChange(event: MatButtonToggleChange) {
		console.log('onFilterChange', event.value);
	}

	onViewDetail(application: any): void {
		this.router.navigateByUrl(SecurityScreeningRoutes.path(SecurityScreeningRoutes.CRC_DETAIL), {
			state: { id: 234 },
		});
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
		console.log('applicantId', this.authUserService.applicantProfile?.applicantId);
		this.applicantService
			.apiApplicantsApplicantIdApplicationsGet({
				applicantId: this.authUserService.applicantProfile?.applicantId!,
			})
			.pipe()
			.subscribe((res: ApplicantApplicationListResponse) => {
				this.dataSource.data = res.applications as Array<ApplicantApplicationResponse>;
			});
	}
}
