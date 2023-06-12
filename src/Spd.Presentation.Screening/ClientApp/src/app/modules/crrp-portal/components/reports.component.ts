import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
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
				<div class="col-xxl-4 col-xl-6 col-lg-6 col-md-12">
					<app-month-picker
						label="Filter"
						hint="Select the year and month to filter the report list"
						[monthAndYear]="reportMonthYear"
						(monthAndYearChange)="onMonthAndYearChange($event)"
					></app-month-picker>
				</div>
			</div>

			<div class="row mb-4">
				<div class="col-xxl-7 col-xl-8 col-lg-12 col-md-12 col-sm-12">
					<mat-table [dataSource]="dataSource">
						<ng-container matColumnDef="filename">
							<mat-header-cell *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label"></span>
								{{ application.filename }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action">
							<mat-header-cell *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label"></span>
								<button
									mat-flat-button
									class="table-button w-auto m-2"
									style="color: var(--color-primary-light);"
									aria-label="Download"
									matTooltip="Download"
								>
									<mat-icon>file_download</mat-icon>Download
								</button>
							</mat-cell>
						</ng-container>

						<mat-header-row *matHeaderRowDef="columns; sticky: true"></mat-header-row>
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
	reportMonthYear: any;

	dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
	tablePaginator = this.utilService.getDefaultTablePaginatorConfig();
	columns: string[] = ['filename', 'action'];

	@ViewChild('paginator') paginator!: MatPaginator;

	constructor(private utilService: UtilService) {}

	ngOnInit() {
		this.loadList();
	}

	onMonthAndYearChange(val: any) {
		console.log('onMonthAndYearChange', val);
		this.loadList();
	}

	onPageChanged(page: PageEvent): void {
		this.queryParams.page = page.pageIndex;
		this.loadList();
	}

	private loadList(): void {
		const dataList = [
			{
				filename: 'Monthly Screening Report May 2023',
			},
			{
				filename: 'Monthly Screening Report Apr 2023',
			},
			{
				filename: 'Monthly Screening Report Mar 2023',
			},
			{
				filename: 'Monthly Screening Report Feb 2023',
			},
		];
		this.dataSource = new MatTableDataSource(dataList);
	}
}
