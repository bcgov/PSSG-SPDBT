import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';

@Component({
	selector: 'app-expiring-screenings',
	template: `
		<app-dashboard-header title="Organization Name" subtitle="Security Screening Portal"></app-dashboard-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12">
					<h2 class="mb-2 fw-normal">Expiring Screenings</h2>
					<div class="alert alert-warning d-flex align-items-center" role="alert">
						<mat-icon class="d-none d-lg-block alert-icon me-2">schedule</mat-icon>
						<div>
							<div>We are currently processing applications that do NOT require follow-up within:</div>
							<div class="fw-semibold">10 business days</div>
						</div>
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
						<app-payment-filter
							[formGroup]="formFilter"
							(filterChange)="onFilterChange($event)"
							(filterClear)="onFilterClear()"
							(filterClose)="onFilterClose()"
						></app-payment-filter>
					</app-dropdown-overlay>
				</div>
				<div class="col-xl-3 col-lg-4 col-md-10 col-sm-9">
					<button mat-raised-button color="primary" class="xlarge w-100 mb-2">
						<mat-icon>download</mat-icon>Download Report
					</button>
				</div>
			</div>

			<div class="row">
				<div class="col-12">
					<mat-table
						matSort
						[dataSource]="dataSource"
						matSortActive="dateExpiringOn"
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

						<ng-container matColumnDef="dateExpiringOn">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Expiring On</mat-header-cell>
							<mat-cell *matCellDef="let screening">
								<span class="mobile-label">Sent On:</span>
								{{ screening.dateExpiringOn | date : constants.date.dateFormat }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="daysRemaining">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Days Remaining</mat-header-cell>
							<mat-cell *matCellDef="let screening">
								<span class="mobile-label">Days Remaining:</span>
								<span [ngClass]="getDaysRemainingColorClass(screening.daysRemaining)" class="fw-semibold">{{
									getDaysRemainingValue(screening.daysRemaining)
								}}</span>
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="companyName">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Company / Facility Name</mat-header-cell>
							<mat-cell *matCellDef="let screening">
								<span class="mobile-label">Company / Facility Name:</span>
								{{ screening.companyName }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="status1">
							<mat-header-cell *matHeaderCellDef>Download Clearance Letter</mat-header-cell>
							<mat-cell *matCellDef="let screening">
								<button
									mat-raised-button
									class="table-button m-2"
									color="primary"
									aria-label="Download Clearance Letter"
								>
									<mat-icon>file_download</mat-icon>Download
								</button>
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="status2">
							<mat-header-cell *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let screening">
								<button mat-raised-button class="table-button request-button m-2" aria-label="Send Request">
									<mat-icon>send</mat-icon>Send Request
								</button>
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="status3">
							<mat-header-cell *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let screening">
								<button mat-icon-button class="table-button m-2" aria-label="Remove" matTooltip="Remove">
									<mat-icon>delete_outline</mat-icon>
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
			.days-remaining-red {
				color: var(--color-red);
			}
			.days-remaining-orange {
				color: var(--color-orange);
			}
			.days-remaining-green {
				color: var(--color-green);
			}

			.table-button {
				max-width: 170px;
				white-space: nowrap;
			}

			.request-button {
				background-color: var(--color-green) !important;
				color: var(--color-white) !important;
			}
		`,
	],
})
export class ExpiringScreeningsComponent {
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
		this.columns = [
			'applicantName',
			'email',
			'dateExpiringOn',
			'daysRemaining',
			'companyName',
			'status1',
			'status2',
			'status3',
		];
		this.dataSource = new MatTableDataSource<any>([]);
		this.dataSource.data = [
			{
				dateExpiringOn: '2023-02-04T00:10:05.865Z',
				applicantName: 'Joe Smith',
				status: '1',
				email: '',
				daysRemaining: '0',
				companyName: 'Organization',
			},
			{
				dateExpiringOn: '2023-02-04T00:10:05.865Z',
				applicantName: 'Anne Parker',
				status: '9',
				email: '',
				daysRemaining: '7',
				companyName: 'Organization',
			},
			{
				dateExpiringOn: '2023-03-24T00:15:05.865Z',
				applicantName: 'Peter Parker',
				status: '10',
				email: '',
				daysRemaining: '8',
				companyName: 'Organization',
			},
			{
				dateExpiringOn: '2023-01-14T00:13:05.865Z',
				applicantName: 'Mark Smith',
				status: '2',
				email: '',
				daysRemaining: '17',
				companyName: 'Organization',
			},
			{
				dateExpiringOn: '2023-02-04T00:10:05.865Z',
				applicantName: 'Tim Parker',
				status: '3',
				email: '',
				daysRemaining: '31',
				companyName: 'Organization',
			},
			{
				dateExpiringOn: '2023-03-24T00:15:05.865Z',
				applicantName: 'Alex Parker',
				status: '4',
				email: '',
				daysRemaining: '72',
				companyName: 'Organization',
			},
			{
				dateExpiringOn: '2023-01-14T00:13:05.865Z',
				applicantName: 'Jim Smith',
				status: '5',
				email: '',
				daysRemaining: '89',
				companyName: 'Organization',
			},
			{
				dateExpiringOn: '2023-02-04T00:10:05.865Z',
				applicantName: 'Ben Parker',
				status: '6',
				email: '',
				daysRemaining: '89',
				companyName: 'Organization',
			},
			{
				dateExpiringOn: '2023-03-24T00:15:05.865Z',
				applicantName: 'Cam Parker',
				status: '7',
				email: '',
				daysRemaining: '89',
				companyName: 'Organization',
			},
			{
				dateExpiringOn: '2022-01-14T00:13:05.865Z',
				applicantName: 'Paul Smith',
				status: '8',
				email: '',
				daysRemaining: '89',
				companyName: 'Organization',
			},
			{
				dateExpiringOn: '2022-02-04T00:10:05.865Z',
				applicantName: 'Cindy Parker',
				status: '1',
				email: '',
				daysRemaining: '89',
				companyName: 'Organization',
			},
			{
				dateExpiringOn: '2022-03-24T00:15:05.865Z',
				applicantName: 'Dave Parker',
				status: '2',
				email: '',
				daysRemaining: '89',
				companyName: 'Organization',
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

	getDaysRemainingValue(daysRemaining: number): string {
		const [value, _color] = this.formatDaysRemaining(daysRemaining);
		return value;
	}

	getDaysRemainingColorClass(daysRemaining: number): string {
		const [_value, color] = this.formatDaysRemaining(daysRemaining);
		return color;
	}

	private formatDaysRemaining(daysRemaining: number): [string, string] {
		if (daysRemaining <= 0) {
			return ['Expired', 'days-remaining-red'];
		} else if (daysRemaining == 1) {
			return [`${daysRemaining} Day`, 'days-remaining-red'];
		} else if (daysRemaining <= 30) {
			return [`${daysRemaining} Days`, 'days-remaining-red'];
		} else if (daysRemaining <= 41) {
			return [`${daysRemaining} Days`, 'days-remaining-orange'];
		} else {
			return [`${daysRemaining} Days`, 'days-remaining-green'];
		}
	}
}
