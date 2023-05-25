import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ValidationErr } from 'src/app/api/models';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { UtilService } from 'src/app/core/services/util.service';
import { ApplicantRoutes } from '../applicant-routing.module';

@Component({
	selector: 'app-crc-list',
	template: `
		<h3 class="pb-2 fw-light" style="height: 52px;">Applicant Information for John Doe</h3>

		<app-alert type="danger">
			<div class="fw-semibold">Fingerprint information required on 2 applications</div>
		</app-alert>

		<app-alert type="danger">
			<div class="fw-semibold">1 application requires additional information</div>
		</app-alert>

		<div class="d-flex flex-row justify-content-between pt-4">
			<h3 class="fw-normal">Criminal Record Check History</h3>
			<mat-button-toggle-group
				[(ngModel)]="screeningFilter"
				(change)="onFilterChange($event)"
				aria-label="Screening Filter"
			>
				<mat-button-toggle class="button-toggle" value="ACTIVE"> Active Screenings </mat-button-toggle>
				<mat-button-toggle class="button-toggle" value="ALL"> All Screenings </mat-button-toggle>
			</mat-button-toggle-group>
		</div>

		<div class="row mt-4">
			<div class="col-12">
				<mat-table [dataSource]="dataSource">
					<ng-container matColumnDef="organizationName">
						<mat-header-cell *matHeaderCellDef>Organization Name</mat-header-cell>
						<mat-cell *matCellDef="let application">
							<span class="mobile-label">Organization Name:</span>
							{{ application.organizationName }}
						</mat-cell>
					</ng-container>

					<ng-container matColumnDef="uploadedDateTime">
						<mat-header-cell *matHeaderCellDef>Submitted On</mat-header-cell>
						<mat-cell *matCellDef="let application">
							<span class="mobile-label">Submitted On:</span>
							{{ application.uploadedDateTime | date : constants.date.dateFormat }}
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
							<div class="fw-semibold" style="color: red;">Documents required</div>
						</mat-cell>
					</ng-container>

					<ng-container matColumnDef="action2">
						<mat-header-cell *matHeaderCellDef></mat-header-cell>
						<mat-cell *matCellDef="let application">
							<span class="mobile-label"></span>
							<a mat-flat-button (click)="onViewDetail(application)" class="m-2" aria-label="View Detail">
								<mat-icon>send</mat-icon>View detail
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
	private queryParams: any = this.utilService.getDefaultQueryParams();

	constants = SPD_CONSTANTS;
	dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
	tablePaginator = this.utilService.getDefaultTablePaginatorConfig();
	columns: string[] = ['organizationName', 'uploadedDateTime', 'type', 'paidBy', 'status', 'action1', 'action2'];
	showResult = false;
	validationErrs: Array<ValidationErr> = [];

	@ViewChild('paginator') paginator!: MatPaginator;

	constructor(private router: Router, private utilService: UtilService) {}

	ngOnInit() {
		this.loadList();
	}

	onPageChanged(page: PageEvent): void {
		this.queryParams.page = page.pageIndex;
		this.loadList();
	}

	onFilterChange(event: MatButtonToggleChange) {
		console.log('onFilterChange', event.value);
	}

	onViewDetail(application: any): void {
		this.router.navigateByUrl(ApplicantRoutes.path(ApplicantRoutes.CRC_DETAIL), {
			state: { id: 234 },
		});
	}

	private loadList(): void {
		this.dataSource = new MatTableDataSource<any>([]);
		this.dataSource.data = [
			{
				organizationName: 'MacDonalds',
				uploadedDateTime: '2023-01-14T00:13:05.865Z',
				paidBy: 'Applicant',
				type: 'PSSO',
				status: 'Awaiting Applicant',
			},
			{
				organizationName: 'Starbucks',
				uploadedDateTime: '2023-02-04T00:10:05.865Z',
				paidBy: 'Organization',
				type: 'CRRP',
				status: 'Complete - No Risk',
			},
		];
	}
}
