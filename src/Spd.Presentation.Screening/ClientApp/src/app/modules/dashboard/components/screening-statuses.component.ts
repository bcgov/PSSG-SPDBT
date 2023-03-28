import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';

@Component({
	selector: 'app-screening-statuses',
	template: `
		<app-dashboard-header title="Organization Name" subtitle="Security Screening Portal"></app-dashboard-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12">
					<h2 class="mb-2 fw-normal">Screening Statuses</h2>
					<div class="alert alert-warning d-flex align-items-center" role="alert">
						<mat-icon class="d-none d-md-block alert-icon me-2">warning</mat-icon>
						<div>We are currently processing applications that do not require follow-up in up to 10 business days</div>
					</div>
				</div>
			</div>

			<div class="mb-4">
				Screening statistics for January 2023:
				<div class="d-flex flex-wrap justify-content-start">
					<mat-card class="statistic-card mat-card-green m-2">
						<mat-card-header>
							<mat-card-title>67</mat-card-title>
						</mat-card-header>
						<mat-card-content>
							<p>Completed No Risk</p>
						</mat-card-content>
					</mat-card>
					<mat-card class="statistic-card mat-card-green m-2">
						<mat-card-header>
							<mat-card-title>13</mat-card-title>
						</mat-card-header>
						<mat-card-content>
							<p>In Progress</p>
						</mat-card-content>
					</mat-card>
					<mat-card class="statistic-card mat-card-yellow m-2">
						<mat-card-header>
							<mat-card-title>5</mat-card-title>
						</mat-card-header>
						<mat-card-content>
							<p>Awaiting Payment</p>
						</mat-card-content>
					</mat-card>
					<mat-card class="statistic-card mat-card-yellow m-2">
						<mat-card-header>
							<mat-card-title>12</mat-card-title>
						</mat-card-header>
						<mat-card-content>
							<p>Awaiting 3rd Party</p>
						</mat-card-content>
					</mat-card>
					<mat-card class="statistic-card mat-card-yellow m-2">
						<mat-card-header>
							<mat-card-title>7</mat-card-title>
						</mat-card-header>
						<mat-card-content>
							<p>Awaiting Applicant</p>
						</mat-card-content>
					</mat-card>
					<mat-card class="statistic-card mat-card-blue m-2">
						<mat-card-header>
							<mat-card-title>9</mat-card-title>
						</mat-card-header>
						<mat-card-content>
							<p>Under Assessment</p>
						</mat-card-content>
					</mat-card>
					<mat-card class="statistic-card mat-card-grey m-2">
						<mat-card-header>
							<mat-card-title>11</mat-card-title>
						</mat-card-header>
						<mat-card-content>
							<p>Cancelled by Organization</p>
						</mat-card-content>
					</mat-card>
					<mat-card class="statistic-card mat-card-grey m-2">
						<mat-card-header>
							<mat-card-title>45</mat-card-title>
						</mat-card-header>
						<mat-card-content>
							<p>Missing Information</p>
						</mat-card-content>
					</mat-card>
					<mat-card class="statistic-card mat-card-red m-2">
						<mat-card-header>
							<mat-card-title>3</mat-card-title>
						</mat-card-header>
						<mat-card-content>
							<p>Closed</p>
						</mat-card-content>
					</mat-card>
					<mat-card class="statistic-card mat-card-red m-2">
						<mat-card-header>
							<mat-card-title>4</mat-card-title>
						</mat-card-header>
						<mat-card-content>
							<p>Risk Found</p>
						</mat-card-content>
					</mat-card>
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
				<div class="col-xl-3 col-lg-4 col-md-10 col-sm-9">
					<button mat-flat-button color="primary" class="xlarge w-100 mb-2">
						<mat-icon>download</mat-icon>Download Report
					</button>
				</div>
				<div class="col-xl-1 col-lg-2 col-md-2 col-sm-3" style="text-align: center;">
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
					<mat-table
						matSort
						[dataSource]="dataSource"
						matSortActive="dateSentOn"
						matSortDirection="desc"
						class="isMobile"
					>
						<ng-container matColumnDef="applicantName">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Applicant Name</mat-header-cell>
							<mat-cell *matCellDef="let screening">
								<span class="mobile-label">Applicant Name:</span>
								{{ screening.applicantName }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="email">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Email</mat-header-cell>
							<mat-cell *matCellDef="let screening">
								<span class="mobile-label">Email:</span>
								{{ screening.email }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="dateSentOn">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Sent On</mat-header-cell>
							<mat-cell *matCellDef="let screening">
								<span class="mobile-label">Sent On:</span>
								{{ screening.dateSentOn | date : constants.date.dateFormat }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="whoPaid">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Who Paid</mat-header-cell>
							<mat-cell *matCellDef="let screening">
								<span class="mobile-label">Who Paid:</span>
								{{ screening.whoPaid }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="screeningNumber">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Screening Number</mat-header-cell>
							<mat-cell *matCellDef="let screening">
								<span class="mobile-label">Screening Number:</span>
								{{ screening.screeningNumber }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="companyName">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Company / Facility Name</mat-header-cell>
							<mat-cell *matCellDef="let screening">
								<span class="mobile-label">Company / Facility Name:</span>
								{{ screening.companyName }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="status">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Status</mat-header-cell>
							<mat-cell *matCellDef="let screening">
								<span class="mobile-label">Status:</span>
								<mat-chip-listbox aria-label="Status">
									<mat-chip-option class="mat-chip-green" *ngIf="screening.status == '1'">In Progress</mat-chip-option>
									<mat-chip-option class="mat-chip-green" *ngIf="screening.status == '2'">
										Complete - No Risk
									</mat-chip-option>
									<mat-chip-option class="mat-chip-yellow" *ngIf="screening.status == '3'">
										Awaiting Applicant
									</mat-chip-option>
									<mat-chip-option class="mat-chip-blue" *ngIf="screening.status == '4'">
										Under Assessment
									</mat-chip-option>
									<mat-chip-option class="mat-chip-grey" *ngIf="screening.status == '5'">
										Missing Information
									</mat-chip-option>
									<mat-chip-option class="mat-chip-grey" *ngIf="screening.status == '6'">
										Cancelled By Organization
									</mat-chip-option>
									<mat-chip-option class="mat-chip-red" *ngIf="screening.status == '7'">Closed</mat-chip-option>
									<mat-chip-option class="mat-chip-red" *ngIf="screening.status == '8'">Risk Found</mat-chip-option>
								</mat-chip-listbox>
								<a (click)="onPayNow()" *ngIf="screening.status == '9'">
									Pay Now <mat-icon style="vertical-align: middle;">chevron_right</mat-icon>
								</a>
								<a (click)="onPayNow()" *ngIf="screening.status == '10'">
									Verify Applicant <mat-icon style="vertical-align: middle;">chevron_right</mat-icon>
								</a>
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
				max-width: 170px;
			}

			.pay-button {
				background-color: var(--color-green) !important;
				color: var(--color-white) !important;
			}

			.statistic-card {
				width: 8.5em;
				cursor: default;
				.mat-mdc-card-title {
					font-weight: 600;
				}
			}
		`,
	],
})
export class ScreeningStatusesComponent {
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
		this.columns = ['applicantName', 'email', 'dateSentOn', 'whoPaid', 'screeningNumber', 'companyName', 'status'];
		this.dataSource = new MatTableDataSource<any>([]);
		this.dataSource.data = [
			{
				dateSentOn: '2023-02-04T00:10:05.865Z',
				applicantName: 'Joe Smith',
				status: '1',
				email: '',
				whoPaid: '',
				screeningNumber: '',
				companyName: '',
			},
			{
				dateSentOn: '2023-02-04T00:10:05.865Z',
				applicantName: 'Anne Parker',
				status: '9',
				email: '',
				whoPaid: '',
				screeningNumber: '',
				companyName: '',
			},
			{
				dateSentOn: '2023-03-24T00:15:05.865Z',
				applicantName: 'Peter Parker',
				status: '10',
				email: '',
				whoPaid: '',
				screeningNumber: '',
				companyName: '',
			},
			{
				dateSentOn: '2023-01-14T00:13:05.865Z',
				applicantName: 'Mark Smith',
				status: '2',
				email: '',
				whoPaid: '',
				screeningNumber: '',
				companyName: '',
			},
			{
				dateSentOn: '2023-02-04T00:10:05.865Z',
				applicantName: 'Tim Parker',
				status: '3',
				email: '',
				whoPaid: '',
				screeningNumber: '',
				companyName: '',
			},
			{
				dateSentOn: '2023-03-24T00:15:05.865Z',
				applicantName: 'Alex Parker',
				status: '4',
				email: '',
				whoPaid: '',
				screeningNumber: '',
				companyName: '',
			},
			{
				dateSentOn: '2023-01-14T00:13:05.865Z',
				applicantName: 'Jim Smith',
				status: '5',
				email: '',
				whoPaid: '',
				screeningNumber: '',
				companyName: '',
			},
			{
				dateSentOn: '2023-02-04T00:10:05.865Z',
				applicantName: 'Ben Parker',
				status: '6',
				email: '',
				whoPaid: '',
				screeningNumber: '',
				companyName: '',
			},
			{
				dateSentOn: '2023-03-24T00:15:05.865Z',
				applicantName: 'Cam Parker',
				status: '7',
				email: '',
				whoPaid: '',
				screeningNumber: '',
				companyName: '',
			},
			{
				dateSentOn: '2022-01-14T00:13:05.865Z',
				applicantName: 'Paul Smith',
				status: '8',
				email: '',
				whoPaid: '',
				screeningNumber: '',
				companyName: '',
			},
			{
				dateSentOn: '2022-02-04T00:10:05.865Z',
				applicantName: 'Cindy Parker',
				status: '1',
				email: '',
				whoPaid: '',
				screeningNumber: '',
				companyName: '',
			},
			{
				dateSentOn: '2022-03-24T00:15:05.865Z',
				applicantName: 'Dave Parker',
				status: '2',
				email: '',
				whoPaid: '',
				screeningNumber: '',
				companyName: '',
			},
		];
	}

	ngAfterViewInit() {
		this.dataSource.sort = this.sort;
		this.dataSource.paginator = this.paginator;
	}

	onPayNow(): void {}

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
