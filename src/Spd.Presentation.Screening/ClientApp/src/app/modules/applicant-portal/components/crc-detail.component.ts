import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
	selector: 'app-crc-detail',
	template: `
		<div class="d-flex flex-row justify-content-between mb-2">
			<h3 class="pb-2 fw-light">Screening Information</h3>
			<div>
				<button mat-flat-button color="primary" class="w-auto m-2" aria-label="Download Clearance Letter">
					<mat-icon>file_download</mat-icon>Clearance Letter
				</button>
				<button mat-stroked-button color="primary" class="w-auto m-2" aria-label="Back">
					<mat-icon>arrow_back</mat-icon>Back
				</button>
			</div>
		</div>

		<app-alert type="danger">
			<div class="fw-semibold">Fingerprint information required. Download the fingerprint package</div>
		</app-alert>

		<app-alert type="danger">
			<div class="fw-semibold">
				Statutory declaration requested. Download statutory declaration form and upload the filled form.
			</div>
		</app-alert>

		<h3 class="fw-normal">Organization Name</h3>
		<p>CRRP screening YYYY - MM - DD Organization paid</p>

		<h3 class="fw-normal">Document Upload History</h3>

		<div class="row mt-4">
			<div class="col-12">
				<mat-table [dataSource]="dataSource">
					<ng-container matColumnDef="documentName">
						<mat-header-cell *matHeaderCellDef>Document Name</mat-header-cell>
						<mat-cell *matCellDef="let application">
							<span class="mobile-label">Document Name:</span>
							{{ application.documentName }}
						</mat-cell>
					</ng-container>

					<ng-container matColumnDef="uploadedOn">
						<mat-header-cell *matHeaderCellDef>Uploaded On</mat-header-cell>
						<mat-cell *matCellDef="let application">
							<span class="mobile-label">Uploaded On:</span>
							{{ application.uploadedOn | date : constants.date.dateFormat }}
						</mat-cell>
					</ng-container>

					<ng-container matColumnDef="action">
						<mat-header-cell *matHeaderCellDef></mat-header-cell>
						<mat-cell *matCellDef="let application">
							<span class="mobile-label"></span>
							<a mat-flat-button class="m-2" aria-label="Remove Document">
								<mat-icon>delete_outline</mat-icon>Remove Document
							</a>
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
	`,
	styles: [],
})
export class CrcDetailComponent {
	private queryParams: any = this.utilService.getDefaultQueryParams();

	constants = SPD_CONSTANTS;
	dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
	tablePaginator = this.utilService.getDefaultTablePaginatorConfig();
	columns: string[] = ['documentName', 'uploadedOn', 'action'];

	@ViewChild('paginator') paginator!: MatPaginator;

	constructor(private router: Router, private utilService: UtilService) {}

	ngOnInit() {
		this.loadList();
	}

	onPageChanged(page: PageEvent): void {
		this.queryParams.page = page.pageIndex;
		this.loadList();
	}

	private loadList(): void {
		this.dataSource = new MatTableDataSource<any>([]);
		this.dataSource.data = [
			{
				documentName: 'file.pdf',
				uploadedOn: '2023-01-14T00:13:05.865Z',
			},
			{
				documentName: 'example.doc',
				uploadedOn: '2023-02-04T00:10:05.865Z',
			},
		];
	}
}
