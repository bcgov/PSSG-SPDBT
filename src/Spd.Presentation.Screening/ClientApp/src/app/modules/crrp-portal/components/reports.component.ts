import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { OrgReportListResponse, OrgReportResponse } from 'src/app/api/models';
import { OrgReportService } from 'src/app/api/services';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import { AppRoutes } from 'src/app/app-routing.module';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthUserBceidService } from 'src/app/core/services/auth-user-bceid.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
	selector: 'app-reports',
	template: `
		<app-crrp-header></app-crrp-header>

		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-12">
					<h2 class="mb-2 fw-normal">Monthly Reports</h2>
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-xxl-3 col-xl-4 col-lg-6 col-md-12">
					<app-month-picker
						label="From Month/Year"
						[monthAndYear]="reportMonthYearFrom"
						[minDate]="minDate"
						[maxDate]="maxDate"
						(monthAndYearChange)="onMonthAndYearChangeFrom($event)"
					></app-month-picker>
				</div>
				<div class="col-xxl-3 col-xl-4 col-lg-6 col-md-12">
					<app-month-picker
						label="To Month/Year"
						[monthAndYear]="reportMonthYearTo"
						[minDate]="minDate"
						[maxDate]="maxDate"
						(monthAndYearChange)="onMonthAndYearChangeTo($event)"
					></app-month-picker>
				</div>
			</div>

			<div class="row mb-4">
				<div class="col-xxl-6 col-xl-8 col-lg-12 col-md-12 col-sm-12">
					<mat-table [dataSource]="dataSource" class="report-table">
						<ng-container matColumnDef="reportDate">
							<mat-cell *matCellDef="let report">
								<span class="mobile-label"></span>
								Monthly Report - {{ report.reportDate | date : constants.date.monthYearFormat }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action1">
							<mat-cell *matCellDef="let report">
								<span class="mobile-label"></span>
								<button
									mat-flat-button
									class="table-button w-auto"
									style="color: var(--color-primary-light);"
									(click)="onDownloadReport(report)"
									aria-label="Download"
								>
									<mat-icon>file_download</mat-icon>Report
								</button>
							</mat-cell>
						</ng-container>

						<mat-row *matRowDef="let row; columns: columns"></mat-row>
					</mat-table>
					<mat-paginator
						[showFirstLastButtons]="true"
						[hidePageSize]="true"
						[pageIndex]="tablePaginator.pageIndex"
						[pageSize]="tablePaginator.pageSize"
						[length]="tablePaginator.length"
						(page)="onPageChanged($event)"
						aria-label="Select page"
					>
					</mat-paginator>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.report-table {
				background-color: var(--color-primary-lightest);
			}

			.mat-column-action1 {
				text-align: right;
				justify-content: flex-end;
				min-width: 160px;
				.table-button {
					min-width: 140px;
				}
			}
		`,
	],
})
export class ReportsComponent implements OnInit {
	private queryParams: any = this.utilService.getDefaultQueryParams();
	private allReports: Array<OrgReportResponse> = [];

	constants = SPD_CONSTANTS;
	reportMonthYearFrom: Date | null = new Date(new Date().getFullYear(), 0, 1);
	reportMonthYearTo: Date | null = null;
	maxDate = new Date();
	minDate = new Date(2023, 0, 1);

	dataSource: MatTableDataSource<OrgReportResponse> = new MatTableDataSource<OrgReportResponse>([]);
	tablePaginator = this.utilService.getDefaultTablePaginatorConfig();
	columns: string[] = ['reportDate', 'action1'];

	constructor(
		private router: Router,
		private utilService: UtilService,
		private authUserService: AuthUserBceidService,
		private orgReportService: OrgReportService
	) {}

	ngOnInit() {
		const orgId = this.authUserService.bceidUserInfoProfile?.orgId;
		if (!orgId) {
			console.debug('ReportsComponent - missing orgId');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
			return;
		}

		this.loadList();
	}

	onMonthAndYearChangeFrom(val: Date | null) {
		this.reportMonthYearFrom = val;
		this.filterList();
	}

	onMonthAndYearChangeTo(val: Date | null) {
		this.reportMonthYearTo = val;
		if (val) {
			// change to last day of month and time at end of day
			const lastDayOfMonth = new Date(val.getFullYear(), val.getMonth() + 1, 0);
			lastDayOfMonth.setHours(23, 59, 59, 999);
			this.reportMonthYearTo = lastDayOfMonth;
		}
		this.filterList();
	}

	onDownloadReport(report: OrgReportResponse): void {
		this.orgReportService
			.apiOrgsOrgIdReportsReportIdFileGet$Response({
				reportId: report.id!,
				orgId: this.authUserService.bceidUserInfoProfile?.orgId!,
			})
			.pipe()
			.subscribe((resp: StrictHttpResponse<Blob>) => {
				this.utilService.downloadFile(resp.headers, resp.body);
			});
	}

	onPageChanged(page: PageEvent): void {
		this.queryParams.page = page.pageIndex;
		this.filterList();
	}

	private loadList(): void {
		this.orgReportService
			.apiOrgsOrgIdReportsGet({
				orgId: this.authUserService.bceidUserInfoProfile?.orgId!,
			})
			.pipe()
			.subscribe((res: OrgReportListResponse) => {
				this.allReports = res.reports as Array<OrgReportResponse>;
				this.filterList();
			});
	}

	private filterList(): void {
		let reports: Array<OrgReportResponse> = [];

		if (!this.reportMonthYearFrom && !this.reportMonthYearTo) {
			reports = this.allReports;
		} else if (this.reportMonthYearFrom && !this.reportMonthYearTo) {
			reports = this.allReports.filter((rpt) => {
				const reportDate = new Date(rpt.reportDate!);
				return reportDate >= this.reportMonthYearFrom!;
			});
		} else if (!this.reportMonthYearFrom && this.reportMonthYearTo) {
			reports = this.allReports.filter((rpt) => {
				const reportDate = new Date(rpt.reportDate!);
				return reportDate <= this.reportMonthYearTo!;
			});
		} else {
			reports = this.allReports.filter((rpt) => {
				const reportDate = new Date(rpt.reportDate!);
				return reportDate >= this.reportMonthYearFrom! && reportDate <= this.reportMonthYearTo!;
			});
		}

		const pageIndex = this.queryParams.page;
		const start = pageIndex * this.tablePaginator.pageSize!;
		const subset = reports.slice(start, start + this.tablePaginator.pageSize!);

		this.tablePaginator = { ...this.tablePaginator, length: reports.length, pageIndex: pageIndex };
		this.dataSource.data = subset;
	}
}
