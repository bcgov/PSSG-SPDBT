import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApplicationListResponse, ApplicationResponse } from 'src/app/api/models';
import { ApplicationService } from 'src/app/api/services';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { UtilService } from 'src/app/core/services/util.service';
import { DashboardRoutes } from '../dashboard-routing.module';

@Component({
	selector: 'app-application-statuses',
	template: `
		<app-dashboard-header subtitle="Criminal Record Check Portal"></app-dashboard-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12">
					<h2 class="mb-2 fw-normal">Application Statuses</h2>
					<div class="alert alert-warning d-flex align-items-center" role="alert">
						<mat-icon class="d-none d-lg-block alert-icon me-2">schedule</mat-icon>
						<div>
							We are currently processing applications that do NOT require follow-up within:
							<span class="fw-semibold">{{ followUpBusinessDays }} business days</span>
						</div>
					</div>
				</div>
			</div>
			<!-- 
			<div class="mb-4">
				Active applications: (Last updated April 10, 11:59pm)
				<div class="d-flex flex-wrap justify-content-start">
					<div class="d-flex flex-row statistic-card area-yellow align-items-center m-2">
						<div class="fw-bold fs-4 m-2">??</div>
						<div class="fw-semibold fs-6 m-2">Verify Identity</div>
					</div>
					<div class="d-flex flex-row statistic-card area-yellow align-items-center m-2">
						<div class="fw-bold fs-4 m-2">??</div>
						<div class="fw-semibold fs-6 m-2">Awaiting Payment</div>
					</div>
					<div class="d-flex flex-row statistic-card area-green align-items-center m-2">
						<div class="fw-bold fs-4 m-2">??</div>
						<div class="fw-semibold fs-6 m-2">In Progress</div>
					</div>
					<div class="d-flex flex-row statistic-card area-yellow align-items-center m-2">
						<div class="fw-bold fs-4 m-2">??</div>
						<div class="fw-semibold fs-6 m-2">Awaiting 3rd Party</div>
					</div>
					<div class="d-flex flex-row statistic-card area-yellow align-items-center m-2">
						<div class="fw-bold fs-4 m-2">??</div>
						<div class="fw-semibold fs-6 m-2">Awaiting Applicant</div>
					</div>
					<div class="d-flex flex-row statistic-card area-blue align-items-center m-2">
						<div class="fw-bold fs-4 m-2">??</div>
						<div class="fw-semibold fs-6 m-2">Under Assessment</div>
					</div>
					<div class="d-flex flex-row statistic-card area-blue align-items-center m-2">
						<div class="fw-bold fs-4 m-2">??</div>
						<div class="fw-semibold fs-6 m-2">Incomplete</div>
					</div>
				</div>
			</div>

			<div class="mb-4">
				Completed applications (completed, closed, or cancelled since April 14, 2022)
				<div class="d-flex flex-wrap justify-content-start">
					<div class="d-flex flex-row statistic-card area-red align-items-center m-2">
						<div class="fw-bold fs-4 m-2">??</div>
						<div class="fw-semibold fs-6 m-2">Risk Found</div>
					</div>
					<div class="d-flex flex-row statistic-card area-grey align-items-center m-2">
						<div class="fw-bold fs-4 m-2">??</div>
						<div class="fw-semibold fs-6 m-2">Risk Found</div>
					</div>
					<div class="d-flex flex-row statistic-card area-grey align-items-center m-2">
						<div class="fw-bold fs-4 m-2">??</div>
						<div class="fw-semibold fs-6 m-2">
							Closed:<br />
							Judicial Review
						</div>
					</div>
					<div class="d-flex flex-row statistic-card area-grey align-items-center m-2">
						<div class="fw-bold fs-4 m-2">??</div>
						<div class="fw-semibold fs-6 m-2">
							Closed:<br />
							No Response
						</div>
					</div>
					<div class="d-flex flex-row statistic-card area-grey align-items-center m-2">
						<div class="fw-bold fs-4 m-2">??</div>
						<div class="fw-semibold fs-6 m-2">
							Closed:<br />
							No Consent
						</div>
					</div>
					<div class="d-flex flex-row statistic-card area-grey align-items-center m-2">
						<div class="fw-bold fs-4 m-2">??</div>
						<div class="fw-semibold fs-6 m-2">
							Cancelled:<br />
							By Applicant
						</div>
					</div>
				</div>
			</div> -->

			<div class="row" [formGroup]="formFilter">
				<div class="col-xl-8 col-lg-6 col-md-12 col-sm-12">
					<mat-form-field>
						<input
							matInput
							type="search"
							formControlName="search"
							placeholder="Search applicant's name or email or case ID"
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
						<app-application-statuses-filter
							[formGroup]="formFilter"
							(filterChange)="onFilterChange($event)"
							(filterClear)="onFilterClear()"
							(filterClose)="onFilterClose()"
						></app-application-statuses-filter>
					</app-dropdown-overlay>
				</div>
			</div>

			<div class="row">
				<div class="col-12">
					<mat-table matSort [dataSource]="dataSource" matSortActive="createdOn" matSortDirection="desc">
						<ng-container matColumnDef="applicantName">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Applicant Name</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Applicant Name:</span>
								{{ utilService.getFullName(application.givenName, application.surname) }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="emailAddress">
							<mat-header-cell *matHeaderCellDef>Email</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Email:</span>
								{{ application.emailAddress }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="createdOn">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Submitted On</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Submitted On:</span>
								{{ application.createdOn | date : constants.date.dateFormat }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="whoPaid">
							<mat-header-cell *matHeaderCellDef>Paid By</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Paid By:</span>
								{{ application.paidBy }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="caseNumber">
							<mat-header-cell *matHeaderCellDef>Case ID</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Case ID:</span>
								{{ application.caseNumber }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="contractedCompanyName">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Company / Facility Name</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Company / Facility Name:</span>
								{{ application.contractedCompanyName }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="status">
							<mat-header-cell *matHeaderCellDef>Status / Action</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Status:</span>

								<!-- <mat-chip-listbox aria-label="Status">
									<mat-chip-option class="mat-chip-green" *ngIf="application.status == '1'">In Progress</mat-chip-option>
									<mat-chip-option class="mat-chip-green" *ngIf="application.status == '2'">
										Complete - No Risk
									</mat-chip-option>
									<mat-chip-option class="mat-chip-yellow" *ngIf="application.status == '3'">
										Awaiting Applicant
									</mat-chip-option>
									<mat-chip-option class="mat-chip-blue" *ngIf="application.status == '4'">
										Under Assessment
									</mat-chip-option>
									<mat-chip-option class="mat-chip-grey" *ngIf="application.status == '5'">
										Missing Information
									</mat-chip-option>
									<mat-chip-option class="mat-chip-grey" *ngIf="application.status == '6'">
										Cancelled By Organization
									</mat-chip-option>
									<mat-chip-option class="mat-chip-red" *ngIf="application.status == '7'">Closed</mat-chip-option>
									<mat-chip-option class="mat-chip-red" *ngIf="application.status == '8'">Risk Found</mat-chip-option>
								</mat-chip-listbox>
							 -->
								<mat-chip-listbox aria-label="Status" class="ms-3">
									<mat-chip-option class="mat-chip-green">In Progress</mat-chip-option>
									<!-- <mat-chip-option class="mat-chip-yellow"> Awaiting Applicant </mat-chip-option> -->
								</mat-chip-listbox>
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="actions">
							<mat-header-cell *matHeaderCellDef>Action</mat-header-cell>
							<mat-cell *matCellDef="let application; let i = index">
								<span class="mobile-label">Action:</span>
								<a
									mat-flat-button
									(click)="onPayNow(application)"
									class="m-2"
									style="color: var(--color-primary-light);"
									aria-label="Pay now"
									*ngIf="i % 4 == 1"
								>
									Pay Now <mat-icon iconPositionEnd>chevron_right</mat-icon>
								</a>

								<a
									mat-flat-button
									(click)="onVerifyApplicant(application)"
									class="m-2"
									style="color: var(--color-green);"
									aria-label="Verify Applicant"
									*ngIf="i % 4 == 2"
								>
									Verify Applicant <mat-icon iconPositionEnd>chevron_right</mat-icon>
								</a>
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
				min-width: 240px;
			}

			.statistic-card {
				cursor: default;
				height: 4em;
				width: 10.5em;
				box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14),
					0px 1px 3px 0px rgba(0, 0, 0, 0.12);
			}
		`,
	],
})
export class ApplicationStatusesComponent implements OnInit {
	constants = SPD_CONSTANTS;

	dataSource: MatTableDataSource<ApplicationResponse> = new MatTableDataSource<ApplicationResponse>([]);
	tableConfig = this.utilService.getDefaultTableConfig();
	columns!: string[];
	followUpBusinessDays = '';

	showDropdownOverlay = false;
	formFilter: FormGroup = this.formBuilder.group({
		search: new FormControl(''),
		verifyIdentity: new FormControl(''),
		inProgress: new FormControl(''),
		// payNow: new FormControl(''),
		// awaitingThirdParty: new FormControl(''),
		// awaitingApplicant: new FormControl(''),
		// underAssessment: new FormControl(''),
		// incomplete: new FormControl(''),
		// cleared: new FormControl(''),
		// riskFound: new FormControl(''),
		// judicialReview: new FormControl(''),
		// noResponse: new FormControl(''),
		// noApplicantConsent: new FormControl(''),
		// cancelledByOrg: new FormControl(''),
		// cancelledByAppl: new FormControl(''),
	});

	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild('paginator') paginator!: MatPaginator;

	constructor(
		private router: Router,
		protected utilService: UtilService,
		private formBuilder: FormBuilder,
		private applicationService: ApplicationService,
		private authenticationService: AuthenticationService
	) {}

	ngOnInit() {
		this.columns = [
			'applicantName',
			'emailAddress',
			'createdOn',
			'whoPaid',
			'caseNumber',
			'contractedCompanyName',
			'status',
			'actions',
		];
		this.loadList();
	}

	onPayNow(application: ApplicationResponse): void {
		this.router.navigateByUrl(DashboardRoutes.dashboardPath(DashboardRoutes.PAYMENTS), {
			state: { caseId: application.caseNumber },
		});
	}

	onVerifyApplicant(application: ApplicationResponse): void {
		this.router.navigateByUrl(DashboardRoutes.dashboardPath(DashboardRoutes.IDENTITY_VERIFICATION), {
			state: { caseId: application.caseNumber },
		});
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
				this.followUpBusinessDays = res.followUpBusinessDays ? String(res.followUpBusinessDays) : '';
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
