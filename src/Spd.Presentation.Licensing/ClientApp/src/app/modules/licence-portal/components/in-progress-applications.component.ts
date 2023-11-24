import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
	selector: 'app-in-progress-applications',
	template: `
		<section class="step-section px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<h3 class="mb-4 fw-normal">In-Progress Applications</h3>
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

						<ng-container matColumnDef="startedOn">
							<mat-header-cell *matHeaderCellDef>Started On</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Started On:</span>
								{{ application.startedOn }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="caseId">
							<mat-header-cell *matHeaderCellDef>Case ID</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Case ID:</span>
								{{ application.caseId }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action1">
							<mat-header-cell *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label"></span>
								<button
									mat-flat-button
									class="table-button w-auto"
									style="color: var(--color-primary-light);"
									aria-label="Resume"
								>
									<mat-icon>send</mat-icon>Resume
								</button>
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
						aria-label="Select page"
					>
					</mat-paginator>
					<!-- 	(page)="onPageChanged($event)" -->
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class InProgressApplicationsComponent implements OnInit {
	dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
	tablePaginator = this.utilService.getDefaultTablePaginatorConfig();
	columns: string[] = ['applicationType', 'startedOn', 'caseId', 'action1'];

	constructor(private utilService: UtilService) {}

	ngOnInit(): void {
		this.dataSource.data = [
			{ applicationType: 'Body Amour', startedOn: '', caseId: '111222' },
			{ applicationType: 'Security Worker', startedOn: '', caseId: '333444' },
		];
	}

}
