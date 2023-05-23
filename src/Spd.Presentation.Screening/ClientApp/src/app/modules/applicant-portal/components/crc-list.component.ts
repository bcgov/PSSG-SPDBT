import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ValidationErr } from 'src/app/api/models';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
	selector: 'app-crc-list',
	template: `
		<div class="p-2">
			<div class="alert alert-warning d-flex align-items-center" role="alert">
				<mat-icon class="d-none d-lg-block alert-icon me-2">warning</mat-icon>
				<div>
					<div class="fw-semibold">Fingerprint information required on 2 applications</div>
				</div>
			</div>

			<div class="alert alert-warning d-flex align-items-center" role="alert">
				<mat-icon class="d-none d-lg-block alert-icon me-2">warning</mat-icon>
				<div>
					<div class="fw-semibold">1 application requires additional information</div>
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-12">
					<h3 class="fw-normal">John Doe Criminal Record Check History</h3>
					<mat-button-toggle-group formControlName="payeeType" aria-label="Paid By">
						<mat-button-toggle class="button-toggle" value="ACTIVE"> Active Screenings </mat-button-toggle>
						<mat-button-toggle class="button-toggle" value="ALL"> All Screenings </mat-button-toggle>
					</mat-button-toggle-group>
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-12">
					<mat-table [dataSource]="dataSource">
						<ng-container matColumnDef="organizationName">
							<mat-header-cell *matHeaderCellDef>Organization Name</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Organization Name:</span>
								{{ application.uploadedDateTime | date : constants.date.dateTimeFormat }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="uploadedDateTime">
							<mat-header-cell *matHeaderCellDef>Submitted On</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Submitted On:</span>
								{{ application.uploadedDateTime | date : constants.date.dateTimeFormat }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="type">
							<mat-header-cell *matHeaderCellDef>Type</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Type:</span>
								{{ application.type }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="paidBy">
							<mat-header-cell *matHeaderCellDef>Paid By</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Paid By:</span>
								{{ application.paidBy }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="applicationStatus">
							<mat-header-cell *matHeaderCellDef>Application Status</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Application Status:</span>
								<mat-chip-listbox aria-label="Status">
									<mat-chip-option [selectable]="false">
										{{ application.applicationStatus }}
									</mat-chip-option>
								</mat-chip-listbox>
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action">
							<mat-header-cell *matHeaderCellDef>Your Action Required</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Your Action Required:</span>
								<div class="fw-semibold" style="color: red;">Documents required</div>
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
		</div>
	`,
	styles: [],
})
export class CrcListComponent implements OnInit {
	private queryParams: any = this.utilService.getDefaultQueryParams();

	constants = SPD_CONSTANTS;
	dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
	tablePaginator = this.utilService.getDefaultTablePaginatorConfig();
	columns: string[] = ['organizationName', 'uploadedDateTime', 'type', 'paidBy', 'applicationStatus', 'action'];
	showResult = false;
	validationErrs: Array<ValidationErr> = [];

	@ViewChild('paginator') paginator!: MatPaginator;

	constructor(private utilService: UtilService) {}

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
				organizationName: 'MacDonalds',
				uploadedDateTime: '2023-01-14T00:13:05.865Z',
				paidBy: 'Applicant',
				type: 'PSSO',
				applicationStatus: 'Awaiting Applicant',
			},
			{
				organizationName: 'Starbucks',
				uploadedDateTime: '2023-02-04T00:10:05.865Z',
				paidBy: 'Organization',
				type: 'CRRP',
				applicationStatus: 'Complete - No Risk',
			},
		];
	}
}
