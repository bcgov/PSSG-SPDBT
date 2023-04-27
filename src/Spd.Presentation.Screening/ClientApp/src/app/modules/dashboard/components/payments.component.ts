import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApplicationListResponse, ApplicationResponse } from 'src/app/api/models';
import { ApplicationService } from 'src/app/api/services';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
	selector: 'app-payments',
	template: `
		<app-dashboard-header subtitle="Criminal Record Check Portal"></app-dashboard-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12">
					<h2 class="mb-2 fw-normal">Outstanding Payments</h2>
					<div class="alert alert-warning d-flex align-items-center" role="alert">
						<mat-icon class="d-none d-md-block alert-icon me-2">warning</mat-icon>
						<div>There are 5 outstanding applications which require payment</div>
					</div>
				</div>
			</div>

			<div class="row" [formGroup]="formFilter">
				<div class="col-xl-8 col-lg-6 col-md-12 col-sm-12">
					<mat-form-field>
						<input
							matInput
							type="search"
							formControlName="search"
							placeholder="Search applicant's name or email or case id"
						/>
						<button mat-button matSuffix mat-flat-button aria-label="search" class="search-icon-button">
							<mat-icon>search</mat-icon>
						</button>
					</mat-form-field>
				</div>
				<div class="col-xl-1 col-lg-2 col-md-2 col-sm-3">
					<app-dropdown-overlay
						[showDropdownOverlay]="showDropdownOverlay"
						(showDropdownOverlayChange)="onShowDropdownOverlayChange($event)"
					>
						<app-payment-filter
							[formGroup]="formFilter"
							(filterChange)="onFilterChange($event)"
							(filterClear)="onFilterClear()"
							(filterClose)="onFilterClose()"
						></app-payment-filter>
					</app-dropdown-overlay>
				</div>
				<!-- <div class="col-xl-3 col-lg-4 col-md-10 col-sm-9">
					<button mat-flat-button color="primary" class="xlarge w-100 mb-2">
						<mat-icon>download</mat-icon>Download Monthly Report
					</button>
				</div> -->
			</div>

			<div class="row">
				<div class="col-12">
					<mat-table matSort [dataSource]="dataSource" matSortActive="createdOn" matSortDirection="asc">
						<ng-container matColumnDef="applicantName">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Applicant Name</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Applicant Name:</span>
								{{ utilService.getFullName(application.givenName, application.surname) }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="createdOn">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Date/Time Submitted</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Date/Time Submitted:</span>
								{{ application.createdOn | date : constants.date.dateTimeFormat }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="dateTimePaid">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Date/Time Paid</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Date/Time Paid:</span>
								??<!-- {{ application.dateTimePaid | date : constants.date.dateTimeFormat }} -->
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="status">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Status</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Status:</span>
								??<!-- <span *ngIf="application.status != 'NotPaid'" class="fw-semi-bold" style="color: var(--color-green);">
									Paid
								</span>
								<span *ngIf="application.status == 'NotPaid'" class="fw-semi-bold" style="color: var(--color-red);">
									Not Paid
								</span> -->
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="actions">
							<mat-header-cell *matHeaderCellDef>Action</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<button
									mat-flat-button
									class="m-2"
									style="color: var(--color-primary-light);"
									*ngIf="application.status != 'NotPaid'"
									aria-label="Download Clearance Letter"
								>
									<mat-icon>file_download</mat-icon>Download Receipt
								</button>

								<button
									mat-flat-button
									class="m-2"
									style="color: var(--color-green);"
									*ngIf="application.status == 'NotPaid'"
									aria-label="Pay now"
								>
									<mat-icon>attach_money</mat-icon>Pay Now
								</button>
							</mat-cell>
						</ng-container>

						<mat-header-row *matHeaderRowDef="columns; sticky: true"></mat-header-row>
						<mat-row *matRowDef="let row; columns: columns"></mat-row>
					</mat-table>
					<mat-paginator
						[showFirstLastButtons]="true"
						[pageIndex]="(tableConfig.paginator.pageIndex || 1) - 1"
						[pageSize]="tableConfig.paginator.pageSize"
						[length]="tableConfig.paginator.length"
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
			.mat-column-actions {
				min-width: 300px;
				justify-content: center !important;
			}
		`,
	],
})
export class PaymentsComponent implements OnInit {
	constants = SPD_CONSTANTS;

	dataSource: MatTableDataSource<ApplicationResponse> = new MatTableDataSource<ApplicationResponse>([]);
	tableConfig = this.utilService.getDefaultTableConfig();
	columns!: string[];

	showDropdownOverlay = false;
	formFilter: FormGroup = this.formBuilder.group({
		search: new FormControl(''),
		startDate: new FormControl(''),
		endDate: new FormControl(''),
		paid: new FormControl(''),
		notPaid: new FormControl(''),
	});

	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild('paginator') paginator!: MatPaginator;

	constructor(
		protected utilService: UtilService,
		private formBuilder: FormBuilder,
		private applicationService: ApplicationService,
		private authenticationService: AuthenticationService,
		private location: Location
	) {}

	ngOnInit(): void {
		const caseId = (this.location.getState() as any)?.caseId;
		this.formFilter.patchValue({ search: caseId });

		this.columns = ['applicantName', 'createdOn', 'dateTimePaid', 'status', 'actions'];
		this.loadList();
	}

	onShowDropdownOverlayChange(show: boolean): void {
		this.showDropdownOverlay = show;
	}

	onFilterChange(filters: any) {
		this.onFilterClose();
	}

	onFilterClear() {
		this.onFilterClose();
	}

	onFilterClose() {
		this.showDropdownOverlay = false;
	}

	onPageChanged(page: PageEvent): void {
		this.loadList(page.pageIndex);
	}

	private loadList(pageIndex: number = 0): void {
		this.applicationService
			.apiOrgsOrgIdApplicationsGet({
				orgId: this.authenticationService.loggedInOrgId!,
				page: pageIndex,
				pageSize: this.tableConfig.paginator.pageSize,
			})
			.pipe()
			.subscribe((res: ApplicationListResponse) => {
				this.dataSource.data = res.applications as Array<ApplicationResponse>;
				this.dataSource.sort = this.sort;
				this.tableConfig = {
					...this.tableConfig,
					paginator: {
						pageIndex: res.pagination?.pageIndex ?? 0,
						pageSize: res.pagination?.pageSize ?? 0,
						length: res.pagination?.length ?? 0,
					},
				};
			});
	}
}
