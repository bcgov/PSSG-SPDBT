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

export interface ExpiredChecksResponse extends ApplicationResponse {
	daysRemainingText: string;
	daysRemainingClass: string;
}

@Component({
	selector: 'app-expiring-checks',
	template: `
		<app-dashboard-header subtitle="Criminal Record Checks"></app-dashboard-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12">
					<h2 class="mb-2 fw-normal">Expiring Criminal Record Checks</h2>
					<div class="alert alert-warning d-flex align-items-center" role="alert" *ngIf="followUpBusinessDays">
						<mat-icon class="d-none d-lg-block alert-icon me-2">schedule</mat-icon>
						<div>
							We are currently processing applications that do NOT require follow-up within:
							<span class="fw-semibold">{{ followUpBusinessDays }} business days</span>
						</div>
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
							<mat-header-cell *matHeaderCellDef>Expiring On</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Expiring On:</span>
								{{ application.createdOn | date : constants.date.dateFormat }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="daysRemaining">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Days Remaining</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Days Remaining:</span>
								<span [ngClass]="application.daysRemainingClass">
									{{ application.daysRemainingText }}
								</span>
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="contractedCompanyName">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Company / Facility Name</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Company / Facility Name:</span>
								{{ application.contractedCompanyName }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action1">
							<mat-header-cell *matHeaderCellDef>Download Clearance Letter</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<button
									mat-flat-button
									class="table-button m-2"
									style="color: var(--color-primary-light);"
									aria-label="Download Clearance Letter"
								>
									<mat-icon>file_download</mat-icon>Download
								</button>
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action2">
							<mat-header-cell *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let application">
								<button
									mat-flat-button
									class="table-button m-2"
									style="color: var(--color-green);"
									aria-label="Send Request"
									(click)="onSendRequest(application)"
								>
									<mat-icon>send</mat-icon>Request
								</button>
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action3">
							<mat-header-cell *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let application">
								<button
									mat-flat-button
									class="table-button m-2"
									style="color: var(--color-red);"
									aria-label="Remove"
									(click)="onRemove(application)"
								>
									<mat-icon>delete_outline</mat-icon>Remove
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
			.days-remaining-red {
				color: var(--color-red);
			}
			.days-remaining-orange {
				color: var(--color-orange);
			}
			.days-remaining-green {
				color: var(--color-green);
			}

			.mat-column-action1 {
				min-width: 190px;
			}

			.mat-column-action2 {
				min-width: 160px;
			}

			.mat-column-action3 {
				min-width: 160px;
			}
		`,
	],
})
export class ExpiringChecksComponent implements OnInit {
	constants = SPD_CONSTANTS;

	dataSource: MatTableDataSource<ExpiredChecksResponse> = new MatTableDataSource<ExpiredChecksResponse>([]);
	tablePaginator = this.utilService.getDefaultTablePaginatorConfig();
	columns!: string[];
	followUpBusinessDays = '';

	formFilter: FormGroup = this.formBuilder.group({
		search: new FormControl(''),
	});

	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild('paginator') paginator!: MatPaginator;

	constructor(
		private router: Router,
		protected utilService: UtilService,
		private formBuilder: FormBuilder,
		private applicationService: ApplicationService,
		private authenticationService: AuthenticationService,
		private dialog: MatDialog
	) {}

	ngOnInit() {
		this.columns = [
			'applicantName',
			'emailAddress',
			'createdOn',
			'daysRemaining',
			'contractedCompanyName',
			'action1',
			'action2',
			'action3',
		];
		this.loadList();
	}

	onPayNow(): void {}

	onPageChanged(page: PageEvent): void {
		this.loadList(page.pageIndex);
	}

	onSendRequest(application: ExpiredChecksResponse) {
		const data: DialogOptions = {
			icon: 'info',
			title: 'Confirmation',
			message: 'Would you like to send a new criminal record check request for this individual from your organization?',
			actionText: 'Yes, send new request',
			cancelText: 'Cancel',
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

	onRemove(application: ExpiredChecksResponse) {
		const data: DialogOptions = {
			icon: 'info',
			title: 'Confirmation',
			message: 'Would you like to remove this individual from your organization?',
			actionText: 'Yes, remove',
			cancelText: 'Cancel',
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

	private loadList(pageIndex: number = 0): void {
		this.applicationService
			.apiOrgsOrgIdApplicationsGet({
				orgId: this.authenticationService.loggedInOrgId!,
				page: pageIndex,
				pageSize: this.tablePaginator.pageSize,
			})
			.pipe()
			.subscribe((res: ApplicationListResponse) => {
				this.followUpBusinessDays = res.followUpBusinessDays ? String(res.followUpBusinessDays) : '';

				const applications = res.applications as Array<ExpiredChecksResponse>;
				applications.forEach((app: ExpiredChecksResponse) => {
					const [itemText, itemClass] = this.getDaysRemaining(app.createdOn);
					app.daysRemainingText = itemText;
					app.daysRemainingClass = itemClass;
				});

				this.dataSource = new MatTableDataSource(applications);
				this.dataSource.sort = this.sort;
				this.tablePaginator = { ...res.pagination };
			});
	}

	private getDaysRemaining(expiringOn: string | null | undefined): [string, string] {
		if (!expiringOn) {
			return ['', ''];
		}

		const expiringOnDate = new Date(expiringOn);
		const todayDate = new Date();
		var diff = Math.abs(todayDate.getTime() - expiringOnDate.getTime());
		var diffDays = Math.ceil(diff / (1000 * 3600 * 24));

		if (diffDays <= 0) {
			return ['Expired', 'days-remaining-red'];
		} else if (diffDays == 1) {
			return [`${diffDays} day`, 'days-remaining-red'];
		} else if (diffDays <= 30) {
			return [`${diffDays} days`, 'days-remaining-red'];
		} else if (diffDays <= 41) {
			return [`${diffDays} days`, 'days-remaining-orange'];
		} else {
			return [`${diffDays} days`, 'days-remaining-green'];
		}
	}
}
