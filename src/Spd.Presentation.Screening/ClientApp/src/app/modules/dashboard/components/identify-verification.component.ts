import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
	selector: 'app-identify-verification',
	template: `
		<app-dashboard-header subtitle="Criminal Record Check Portal"></app-dashboard-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12">
					<h2 class="mb-2 fw-normal">
						Identity Verification
						<div class="mt-2 fs-5 fw-light">Confirm the applicant's identity</div>
					</h2>
					<div class="alert alert-warning d-flex align-items-center" role="alert">
						<mat-icon class="d-none d-md-block alert-icon me-2">warning</mat-icon>
						<div>There are 8 applicants which require confirmation</div>
					</div>
				</div>
			</div>

			<div class="row" [formGroup]="formFilter">
				<div class="col-xl-11 col-lg-10 col-md-10 col-sm-9">
					<mat-form-field>
						<input
							matInput
							type="search"
							formControlName="search"
							placeholder="Search applicant's name or email or case id"
						/>
						<button mat-button matSuffix mat-raised-button aria-label="search" class="search-icon-button">
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
			</div>

			<div class="row">
				<div class="col-12">
					<mat-table matSort [dataSource]="dataSource" matSortActive="dateTimeSubmitted" matSortDirection="asc">
						<ng-container matColumnDef="applicantName">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Applicant Name</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Applicant Name:</span>
								{{ utilService.getFullName(application.givenName, application.surname) }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="dateOfBirth">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Date of Birth</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Date of Birth:</span>
								{{ application.dateTimeSubmitted | date : constants.date.dateFormat }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="jobTitle">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Job Title</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Job Title:</span>
								{{ application.jobTitle }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="email">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Email</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Email:</span>
								{{ application.applicantName }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="dateTimeSubmitted">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Submitted</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Submitted:</span>
								{{ application.dateTimeSubmitted | date : constants.date.dateFormat }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="status">
							<mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Status:</span>
								<span *ngIf="application.status == 'Rejected'" class="fw-semi-bold" style="color: var(--color-red);">
									Rejected
								</span>
								<span *ngIf="application.status == 'Confirmed'" class="fw-semi-bold" style="color: var(--color-green);">
									Confirmed
								</span>
								<span
									*ngIf="application.status == 'Outstanding'"
									class="fw-semi-bold"
									style="color: var(--color-primary-light);"
								>
									Outstanding
								</span>
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="actions">
							<mat-header-cell *matHeaderCellDef>Action</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Action:</span>
								<button
									*ngIf="application.status == 'Outstanding'"
									mat-flat-button
									class="m-2"
									style="color: var(--color-green);"
									aria-label="Confirm"
								>
									<mat-icon>check</mat-icon>Confirm
								</button>

								<button
									*ngIf="application.status == 'Outstanding'"
									mat-flat-button
									class="m-2"
									style="color: var(--color-red);"
									aria-label="Reject"
								>
									<mat-icon>cancel</mat-icon>Reject
								</button>
							</mat-cell>
						</ng-container>

						<mat-header-row *matHeaderRowDef="columns; sticky: true"></mat-header-row>
						<mat-row *matRowDef="let row; columns: columns"></mat-row>
					</mat-table>
					<mat-paginator #paginator [length]="100" [pageSize]="10" aria-label="Select page"> </mat-paginator>
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
export class IdentifyVerificationComponent implements OnInit {
	constants = SPD_CONSTANTS;
	dataSource!: MatTableDataSource<any>;
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

	constructor(protected utilService: UtilService, private formBuilder: FormBuilder, private location: Location) {}

	ngOnInit() {
		const caseId = (this.location.getState() as any).caseId;
		this.formFilter.patchValue({ search: caseId });

		this.columns = ['applicantName', 'dateOfBirth', 'jobTitle', 'email', 'dateTimeSubmitted', 'status', 'actions'];
		this.dataSource = new MatTableDataSource<any>([]);
		this.dataSource.data = [
			{
				dateTimeSubmitted: '2023-02-04T00:10:05.865Z',
				givenName: 'Joe',
				surname: 'Smith',
				status: 'Confirmed',
				email: 'joe@smith.com',
				jobTitle: 'contractor',
				dateOfBirth: '2023-02-04T00:10:05.865Z',
			},
			{
				dateTimeSubmitted: '2023-02-04T00:10:05.865Z',
				givenName: 'Anne',
				surname: 'Parker',
				status: 'Outstanding',
				email: '',
				jobTitle: '',
				dateOfBirth: '2023-02-04T00:10:05.865Z',
			},
			{
				dateTimeSubmitted: '2023-03-24T00:15:05.865Z',
				givenName: 'Peter',
				surname: 'Parker',
				status: 'Rejected',
				email: '',
				jobTitle: '',
				dateOfBirth: '2023-02-02T00:10:05.865Z',
			},
			{
				dateTimeSubmitted: '2023-01-14T00:13:05.865Z',
				givenName: 'Mark',
				surname: 'Smith',
				status: 'Confirmed',
				email: '',
				jobTitle: '',
				dateOfBirth: '2023-02-04T00:10:05.865Z',
			},
			{
				dateTimeSubmitted: '2023-02-04T00:10:05.865Z',
				givenName: 'Tim',
				surname: 'Parker',
				status: 'Outstanding',
				email: '',
				jobTitle: '',
				dateOfBirth: '2023-02-04T00:10:05.865Z',
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
