import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApplicationListResponse, ApplicationResponse } from 'src/app/api/models';
import { ApplicationService } from 'src/app/api/services';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { UtilService } from 'src/app/core/services/util.service';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import { DashboardRoutes } from '../dashboard-routing.module';
import { ApplicationStatusFilterMap } from './application-statuses-filter.component';

@Component({
	selector: 'app-identify-verification',
	template: `
		<app-dashboard-header subtitle="Criminal Record Checks"></app-dashboard-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12">
					<h2 class="mb-2 fw-normal">Identity Verification</h2>
					<app-banner></app-banner>
				</div>
			</div>

			<div class="row" [formGroup]="formFilter">
				<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12">
					<mat-form-field>
						<input
							matInput
							type="search"
							formControlName="search"
							placeholder="Search applicant's name or email or case ID"
							(keydown.enter)="onSearchKeyDown($event)"
						/>
						<button
							mat-button
							matSuffix
							mat-flat-button
							aria-label="search"
							(click)="onSearch()"
							class="search-icon-button"
						>
							<mat-icon>search</mat-icon>
						</button>
					</mat-form-field>
				</div>
			</div>

			<div class="row">
				<div class="col-12">
					<mat-table matSort [dataSource]="dataSource" matSortActive="dateTimeSubmitted" matSortDirection="asc">
						<ng-container matColumnDef="applicantName">
							<mat-header-cell *matHeaderCellDef>Applicant Name</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Applicant Name:</span>
								{{ application | fullname }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="dateOfBirth">
							<mat-header-cell *matHeaderCellDef>Date of Birth</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Date of Birth:</span>
								{{ application.dateOfBirth | date : constants.date.dateFormat : 'UTC' | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="jobTitle">
							<mat-header-cell *matHeaderCellDef>Job Title</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Job Title:</span>
								{{ application.jobTitle | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="emailAddress">
							<mat-header-cell *matHeaderCellDef>Email</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Email:</span>
								{{ application.emailAddress | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="createdOn">
							<mat-header-cell *matHeaderCellDef>Submitted On</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Submitted On:</span>
								{{ application.createdOn | date : constants.date.dateFormat : 'UTC' }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="applicationNumber">
							<mat-header-cell *matHeaderCellDef>Case ID</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Case ID:</span>
								{{ application.applicationNumber }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action1">
							<mat-header-cell *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let application">
								<button
									mat-flat-button
									class="table-button m-2"
									style="color: var(--color-green);"
									aria-label="Confirm"
									(click)="onConfirm(application)"
								>
									<mat-icon>check</mat-icon>Confirm
								</button>
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action2">
							<mat-header-cell *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let application">
								<button
									mat-flat-button
									class="table-button m-2"
									style="color: var(--color-red);"
									aria-label="Reject"
									(click)="onReject(application)"
								>
									<mat-icon>cancel</mat-icon>Reject
								</button>
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
		</section>
	`,
	styles: [
		`
			.mat-column-action1 {
				min-width: 150px;
				padding-right: 4px !important;
				padding-left: 4px !important;
			}

			.mat-column-action2 {
				min-width: 150px;
				padding-right: 4px !important;
				padding-left: 4px !important;
			}
		`,
	],
})
export class IdentifyVerificationComponent implements OnInit {
	private currentSearch = '';
	private queryParams: any = this.utilService.getDefaultQueryParams();

	constants = SPD_CONSTANTS;
	count = 0;
	dataSource: MatTableDataSource<ApplicationResponse> = new MatTableDataSource<ApplicationResponse>([]);
	tablePaginator = this.utilService.getDefaultTablePaginatorConfig();
	columns: string[] = [
		'applicantName',
		'dateOfBirth',
		'jobTitle',
		'emailAddress',
		'createdOn',
		'applicationNumber',
		'action1',
		'action2',
	];

	formFilter: FormGroup = this.formBuilder.group({
		search: new FormControl(''),
	});

	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild('paginator') paginator!: MatPaginator;

	constructor(
		private router: Router,
		private utilService: UtilService,
		private formBuilder: FormBuilder,
		private location: Location,
		private authenticationService: AuthenticationService,
		private applicationService: ApplicationService,
		private dialog: MatDialog
	) {}

	ngOnInit() {
		const caseId = (this.location.getState() as any)?.caseId;
		this.formFilter.patchValue({ search: caseId });

		this.loadList();
	}

	ngAfterViewInit() {
		this.dataSource.sort = this.sort;
		this.dataSource.paginator = this.paginator;
	}

	onSearchKeyDown(searchEvent: any): void {
		const searchString = searchEvent.target.value;
		this.performSearch(searchString);
	}

	onSearch(): void {
		this.performSearch(this.formFilter.value.search);
	}

	onPageChanged(page: PageEvent): void {
		this.queryParams.page = page.pageIndex;
		this.loadList();
	}

	onConfirm(application: ApplicationResponse) {
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: 'Are you sure you have verified the identity of the applicant for this criminal record check request?',
			actionText: 'Yes, submit',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.loadList();
				}
			});
	}

	onReject(application: ApplicationResponse) {
		const data: DialogOptions = {
			icon: 'info',
			title: 'Confirmation',
			message: 'Would you like to send a new criminal record check request for this individual from your organization?',
			actionText: 'Yes, send new request',
			cancelText: 'No, reject',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.router.navigateByUrl(DashboardRoutes.dashboardPath(DashboardRoutes.CRIMINAL_RECORD_CHECKS));
				} else {
					// todo REJECT
				}
			});
	}

	private performSearch(searchString: string): void {
		this.currentSearch = searchString ? `${ApplicationStatusFilterMap['search']}@=${searchString}` : '';
		this.queryParams.page = 0;

		this.loadList();
	}

	private buildQueryParamsFilterString(): string {
		return 'status==VerifyIdentity,' + this.currentSearch;
	}

	private loadList(): void {
		this.queryParams.filters = this.buildQueryParamsFilterString();

		this.applicationService
			.apiOrgsOrgIdApplicationsGet({
				orgId: this.authenticationService.loggedInOrgId!,
				...this.queryParams,
			})
			.pipe()
			.subscribe((res: ApplicationListResponse) => {
				const applications = res.applications ?? [];
				this.dataSource.data = applications;
				this.dataSource.sort = this.sort;
				this.tablePaginator = { ...res.pagination };

				this.count = applications.length;
			});
	}
}
