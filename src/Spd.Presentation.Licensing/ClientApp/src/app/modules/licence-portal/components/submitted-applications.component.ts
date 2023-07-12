import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
	selector: 'app-submitted-applications',
	template: `
		<section class="step-section px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<h3 class="mb-4 fw-normal">Submitted Applications</h3>
			</div>

			<div class="row mb-4">
				<div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12">
					<mat-table [dataSource]="dataSource" class="report-table">
						<ng-container matColumnDef="applicationType">
							<mat-header-cell *matHeaderCellDef>Application Type</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Application Type:</span>
								{{ application.applicationType }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="submittedOn">
							<mat-header-cell *matHeaderCellDef>Submitted On</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Submitted On:</span>
								{{ application.submittedOn }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="caseId">
							<mat-header-cell *matHeaderCellDef>Case ID</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Case ID:</span>
								{{ application.caseId }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="status">
							<mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Status:</span>
								{{ application.status }}
							</mat-cell>
						</ng-container>

						<mat-header-row *matHeaderRowDef="columns; sticky: true"></mat-header-row>
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
	styles: [],
})
export class SubmittedApplicationsComponent {
	dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
	tablePaginator = this.utilService.getDefaultTablePaginatorConfig();
	columns: string[] = ['applicationType', 'submittedOn', 'caseId', 'status'];

	constructor(private utilService: UtilService) {}

	ngOnInit(): void {
		this.dataSource.data = [
			{ applicationType: 'Security Worker', submittedOn: '', caseId: '111444', status: 'In Review' },
			{ applicationType: 'Security Worker', submittedOn: '', caseId: '333555', status: 'Failed' },
		];
	}

	onPageChanged(page: PageEvent): void {}
}
