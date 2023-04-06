import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApplicationListResponse, ApplicationResponse } from 'src/app/api/models';
import { ApplicationService } from 'src/app/api/services';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';

@Component({
	selector: 'app-payments',
	template: `
		<app-dashboard-header title="Organization Name" subtitle="Security Screening Portal"></app-dashboard-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12">
					<h2 class="mb-2 fw-normal">Screening Payments</h2>
					<div class="alert alert-warning d-flex align-items-center" role="alert">
						<mat-icon class="d-none d-md-block alert-icon me-2">warning</mat-icon>
						<div>There are 5 outstanding screenings which require payment</div>
					</div>
				</div>
			</div>

			<div class="row">
				<div class="col-xl-8 col-lg-6 col-md-12 col-sm-12">
					<mat-form-field>
						<input matInput type="search" placeholder="Search" />
						<button
							mat-button
							matSuffix
							mat-raised-button
							color="primary"
							aria-label="search"
							style="padding: 2.1em 0; border-radius: unset;"
						>
							<mat-icon style="top: 8px;font-size: 2.2em;width: 40px;height: 40px;left: 8px;">search</mat-icon>
						</button>
					</mat-form-field>
				</div>
				<div class="col-xl-1 col-lg-2 col-md-2 col-sm-3">
					<app-dropdown-overlay
						[showDropdownOverlay]="showDropdownOverlay"
						(showDropdownOverlayChange)="onShowDropdownOverlayChange($event)"
					>
						<app-screening-filter
							[formGroup]="formFilter"
							(filterChange)="onFilterChange($event)"
							(filterClear)="onFilterClear()"
							(filterClose)="onFilterClose()"
						></app-screening-filter>
					</app-dropdown-overlay>
				</div>
				<div class="col-xl-3 col-lg-4 col-md-10 col-sm-9">
					<button mat-raised-button color="primary" class="xlarge w-100 mb-2">
						<mat-icon>download</mat-icon>Download Monthly Report
					</button>
				</div>
			</div>

			<!-- TODO 
		 matSortActive="status" matSortDirection="asc"
		-->
			<div class="row">
				<div class="col-12">
					<mat-table matSort [dataSource]="dataSource" class="isMobile">
						<ng-container matColumnDef="applicantName">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Applicant Name</mat-header-cell>
							<mat-cell *matCellDef="let screening">
								<span class="mobile-label">Applicant Name:</span>
								{{ screening.givenName }} {{ screening.surname }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="createdOn">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Date/Time Submitted</mat-header-cell>
							<mat-cell *matCellDef="let screening">
								<span class="mobile-label">Date/Time Submitted:</span>
								{{ screening.createdOn | date : constants.date.dateTimeFormat }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="dateTimePaid">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Date/Time Paid</mat-header-cell>
							<mat-cell *matCellDef="let screening">
								<span class="mobile-label">Date/Time Paid:</span>
								??<!-- {{ screening.dateTimePaid | date : constants.date.dateTimeFormat }} -->
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="status">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Status</mat-header-cell>
							<mat-cell *matCellDef="let screening">
								<span class="mobile-label">Status:</span>
								??<!-- <span *ngIf="screening.status != 'NotPaid'" class="fw-semi-bold" style="color: var(--color-green);">
									Paid
								</span>
								<span *ngIf="screening.status == 'NotPaid'" class="fw-semi-bold" style="color: var(--color-red);">
									Not Paid
								</span> -->
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="actions">
							<mat-header-cell *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let screening">
								<button
									mat-raised-button
									class="table-button m-2"
									color="primary"
									*ngIf="screening.status != 'NotPaid'"
									aria-label="Download receipt"
								>
									<mat-icon>file_download</mat-icon>Download Receipt
								</button>
								<button
									mat-raised-button
									class="table-button pay-button m-2"
									*ngIf="screening.status == 'NotPaid'"
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
						#paginator
						[length]="100"
						[pageSize]="10"
						[pageSizeOptions]="[5, 10, 25, 100]"
						aria-label="Select page"
					>
					</mat-paginator>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.table-button {
				max-width: 190px;
				white-space: nowrap;
			}

			.pay-button {
				background-color: var(--color-green) !important;
				color: var(--color-white) !important;
			}
		`,
	],
})
export class PaymentsComponent implements OnInit {
	constants = SPD_CONSTANTS;
	dataSource!: MatTableDataSource<ApplicationResponse>;
	columns!: string[];

	pageSizes = [3, 5, 7];

	showDropdownOverlay = false;
	formFilter: FormGroup = this.formBuilder.group({
		startDate: new FormControl(''),
		endDate: new FormControl(''),
		paid: new FormControl(''),
		notPaid: new FormControl(''),
	});

	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild('paginator') paginator!: MatPaginator;

	constructor(private formBuilder: FormBuilder, private applicationService: ApplicationService) {}

	ngOnInit() {
		this.columns = ['applicantName', 'createdOn', 'dateTimePaid', 'status', 'actions'];
		this.loadList();
	}

	ngAfterViewInit() {
		// this.dataSource.sort = this.sort;
		// this.dataSource.paginator = this.paginator;
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

	private loadList(): void {
		//TODO replace with proper org id
		this.applicationService
			.apiOrgsOrgIdApplicationsGet({ orgId: '4165bdfe-7cb4-ed11-b83e-00505683fbf4' })
			.pipe()
			.subscribe((res: ApplicationListResponse) => {
				this.dataSource = new MatTableDataSource<ApplicationResponse>([]);
				this.dataSource.data = res.applications as Array<ApplicationResponse>;
			});
	}
}
