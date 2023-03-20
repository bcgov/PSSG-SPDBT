import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';

@Component({
	selector: 'app-payments',
	template: `
		<app-dashboard-header title="Organization Name" subtitle="Security Screening Portal"></app-dashboard-header>
		<section class="step-section my-4 p-md-4 p-sm-0">
			<div class="row">
				<div class="col-12">
					<h2 class="mb-2 fw-normal">Screening Payments</h2>
					<div class="alert alert-warning d-flex align-items-center" role="alert">
						<mat-icon class="d-none d-md-block alert-icon me-2">warning</mat-icon>
						<div>5 outstanding screenings which require payment</div>
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
							mat-flat-button
							color="primary"
							aria-label="search"
							style="padding: 2.1em 0; border-radius: unset;"
						>
							<mat-icon style="top: 8px;font-size: 2.2em;width: 40px;height: 40px;left: 8px;">search</mat-icon>
						</button>
					</mat-form-field>
				</div>
				<div class="col-xl-3 col-lg-4 col-md-9 col-sm-9">
					<button mat-flat-button color="primary" class="xlarge w-100 mb-2">
						<mat-icon>download</mat-icon>Download Monthly Report
					</button>
				</div>
				<div class="col-xl-1 col-lg-2 col-md-3 col-sm-3" style="text-align: right;">
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
			</div>

			<div class="row">
				<div class="col-12">
					<mat-table matSort [dataSource]="dataSource" matSortActive="status" matSortDirection="asc" class="isMobile">
						<ng-container matColumnDef="applicantName">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Applicant Name</mat-header-cell>
							<mat-cell *matCellDef="let payment">
								<span class="mobile-label">Applicant Name:</span>
								{{ payment.applicantName }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="dateTimeSubmitted">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Date/Time Submitted</mat-header-cell>
							<mat-cell *matCellDef="let payment">
								<span class="mobile-label">Date/Time Submitted:</span>
								{{ payment.dateTimeSubmitted | date : constants.date.dateTimeFormat }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="dateTimePaid">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Date/Time Paid</mat-header-cell>
							<mat-cell *matCellDef="let payment">
								<span class="mobile-label">Date/Time Paid:</span>
								{{ payment.dateTimePaid | date : constants.date.dateTimeFormat }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="status">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Status</mat-header-cell>
							<mat-cell *matCellDef="let payment">
								<span class="mobile-label">Status:</span>
								<span *ngIf="payment.status != 'NotPaid'" class="fw-bold" style="color: green;"> Paid </span>
								<span *ngIf="payment.status == 'NotPaid'" class="fw-bold" style="color: red;"> Not Paid </span>
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="actions">
							<mat-header-cell *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let payment">
								<span *ngIf="payment.status != 'NotPaid'" class="w-100 m-md-2 m-sm-0">
									<button mat-flat-button color="primary" class="medium">
										<mat-icon class="d-none d-lg-block">download</mat-icon>Download Receipt
									</button>
								</span>
								<span *ngIf="payment.status == 'NotPaid'" class="w-100 m-md-2 m-sm-0">
									<button mat-flat-button class="payNow medium">
										<mat-icon class="d-none d-lg-block">attach_money</mat-icon> Pay Now
									</button>
								</span>
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
			.payNow {
				background-color: var(--color-green) !important;
				color: var(--color-white) !important;
			}
		`,
	],
})
export class PaymentsComponent {
	constants = SPD_CONSTANTS;
	dataSource!: MatTableDataSource<any>;
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

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit() {
		this.columns = ['applicantName', 'dateTimeSubmitted', 'dateTimePaid', 'status', 'actions'];
		this.dataSource = new MatTableDataSource<any>([]);
		this.dataSource.data = [
			{
				dateTimeSubmitted: '2023-02-04T00:10:05.865Z',
				applicantName: 'Joe Smith',
				status: 'NotPaid',
				dateTimePaid: '2023-02-04T00:10:05.865Z',
			},
			{
				dateTimeSubmitted: '2023-02-04T00:10:05.865Z',
				applicantName: 'Anne Parker',
				status: 'Paid',
				dateTimePaid: '2023-02-04T00:10:05.865Z',
			},
			{
				dateTimeSubmitted: '2023-03-24T00:15:05.865Z',
				applicantName: 'Peter Parker',
				status: 'Paid',
				dateTimePaid: '2023-02-02T00:10:05.865Z',
			},
			{
				dateTimeSubmitted: '2023-01-14T00:13:05.865Z',
				applicantName: 'Mark Smith',
				status: 'NotPaid',
				dateTimePaid: '2023-02-04T00:10:05.865Z',
			},
			{
				dateTimeSubmitted: '2023-02-04T00:10:05.865Z',
				applicantName: 'Tim Parker',
				status: 'Paid',
				dateTimePaid: '2023-02-04T00:10:05.865Z',
			},
			{
				dateTimeSubmitted: '2023-03-24T00:15:05.865Z',
				applicantName: 'Alex Parker',
				status: 'Paid',
				dateTimePaid: '2023-02-02T00:10:05.865Z',
			},
			{
				dateTimeSubmitted: '2023-01-14T00:13:05.865Z',
				applicantName: 'Jim Smith',
				status: 'NotPaid',
				dateTimePaid: '2023-02-04T00:10:05.865Z',
			},
			{
				dateTimeSubmitted: '2023-02-04T00:10:05.865Z',
				applicantName: 'Ben Parker',
				status: 'Paid',
				dateTimePaid: '2023-02-04T00:10:05.865Z',
			},
			{
				dateTimeSubmitted: '2023-03-24T00:15:05.865Z',
				applicantName: 'Cam Parker',
				status: 'Paid',
				dateTimePaid: '2023-02-02T00:10:05.865Z',
			},
			{
				dateTimeSubmitted: '2022-01-14T00:13:05.865Z',
				applicantName: 'Paul Smith',
				status: 'NotPaid',
				dateTimePaid: '2023-02-04T00:10:05.865Z',
			},
			{
				dateTimeSubmitted: '2022-02-04T00:10:05.865Z',
				applicantName: 'Cindy Parker',
				status: 'Paid',
				dateTimePaid: '2023-02-04T00:10:05.865Z',
			},
			{
				dateTimeSubmitted: '2022-03-24T00:15:05.865Z',
				applicantName: 'Dave Parker',
				status: 'Paid',
				dateTimePaid: '2023-02-02T00:10:05.865Z',
			},
		];
	}

	ngAfterViewInit() {
		this.dataSource.sort = this.sort;
		this.dataSource.paginator = this.paginator;
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
}
