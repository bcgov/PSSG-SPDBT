import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
	selector: 'app-expired-licences',
	template: `
		<section class="step-section px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<h3 class="mb-4 fw-normal">Expired Licences</h3>
			</div>

			<div class="row mb-4">
				<div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12">
					<mat-table [dataSource]="dataSource" class="report-table">
						<ng-container matColumnDef="licenceType">
							<mat-header-cell *matHeaderCellDef>Licence Type</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Licence Type:</span>
								{{ application.licenceType }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="expiredOn">
							<mat-header-cell *matHeaderCellDef>Expired On</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Expired On:</span>
								{{ application.expiredOn }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="licenceNumber">
							<mat-header-cell *matHeaderCellDef>Licence Number</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Licence Number:</span>
								{{ application.licenceNumber }}
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
									aria-label="Apply for a new Licence"
								>
									Apply for a new Licence
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
export class ExpiredLicencesComponent {
	dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
	tablePaginator = this.utilService.getDefaultTablePaginatorConfig();
	columns: string[] = ['licenceType', 'expiredOn', 'licenceNumber', 'action1'];

	constructor(private utilService: UtilService) {}

	ngOnInit(): void {
		this.dataSource.data = [
			{ licenceType: 'Security Worker', licenceNumber: '111222', expiredOn: '2022-02-02' },
			{ licenceType: 'Security Worker', licenceNumber: '333444', expiredOn: '2022-02-02' },
		];
	}

	onPageChanged(page: PageEvent): void {}
}
