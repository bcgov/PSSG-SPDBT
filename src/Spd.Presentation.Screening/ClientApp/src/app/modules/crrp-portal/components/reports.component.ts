import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { OrgReportListResponse, OrgReportResponse } from 'src/app/api/models';
import { OrgReportService } from 'src/app/api/services';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthUserService } from 'src/app/core/services/auth-user.service';
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
				<div class="col-xxl-4 col-xl-5 col-lg-6 col-md-12">
					<app-month-picker
						label="From Month/Year"
						[monthAndYear]="reportMonthYearFrom"
						[minDate]="minDate"
						[maxDate]="maxDate"
						(monthAndYearChange)="onMonthAndYearChangeFrom($event)"
					></app-month-picker>
				</div>
				<div class="col-xxl-4 col-xl-5 col-lg-6 col-md-12">
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
				<div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12">
					<mat-table [dataSource]="dataSource">
						<ng-container matColumnDef="reportDate">
							<mat-cell *matCellDef="let application">
								<span class="mobile-label"></span>
								Monthly Report - {{ application.reportDate | date : constants.date.monthYearFormat }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action">
							<mat-cell *matCellDef="let application">
								<span class="mobile-label"></span>
								<button
									mat-flat-button
									class="table-button w-auto m-2"
									style="color: var(--color-primary-light);"
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
			.mat-column-action {
				text-align: right;
				justify-content: flex-end;
				min-width: 140px;
				padding-right: 4px !important;
				padding-left: 4px !important;
			}
		`,
	],
})
export class ReportsComponent {
	private queryParams: any = this.utilService.getDefaultQueryParams();
	private allReports: Array<OrgReportResponse> = [];

	constants = SPD_CONSTANTS;
	reportMonthYearFrom: Date | null = new Date(new Date().getFullYear(), 0, 1);
	reportMonthYearTo: Date | null = null;
	maxDate = new Date();
	minDate = new Date(2023, 0, 1);

	dataSource: MatTableDataSource<OrgReportResponse> = new MatTableDataSource<OrgReportResponse>([]);
	tablePaginator = this.utilService.getDefaultTablePaginatorConfig();
	columns: string[] = ['reportDate', 'action'];

	constructor(
		private utilService: UtilService,
		private authUserService: AuthUserService,
		private orgReportService: OrgReportService
	) {}

	ngOnInit() {
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

	onPageChanged(page: PageEvent): void {
		this.queryParams.page = page.pageIndex;
		this.filterList();
	}

	private loadList(): void {
		this.orgReportService
			.apiOrgsOrgIdReportsGet({
				orgId: this.authUserService.userInfo?.orgId!,
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
			reports = this.allReports.filter((rpt) => new Date(rpt.reportDate!) >= this.reportMonthYearFrom!);
		} else if (!this.reportMonthYearFrom && this.reportMonthYearTo) {
			reports = this.allReports.filter((rpt) => new Date(rpt.reportDate!) <= this.reportMonthYearTo!);
		} else {
			reports = this.allReports.filter(
				(rpt) =>
					new Date(rpt.reportDate!) >= this.reportMonthYearFrom! && new Date(rpt.reportDate!) <= this.reportMonthYearTo!
			);
		}

		const pageIndex = this.queryParams.page;
		const start = pageIndex * this.tablePaginator.pageSize!;
		const subset = reports.slice(start, start + this.tablePaginator.pageSize!);

		this.tablePaginator = { ...this.tablePaginator, length: reports.length, pageIndex: pageIndex };
		this.dataSource.data = subset;
	}
}
