import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApplicationListResponse, ApplicationResponse } from 'src/app/api/models';
import { ApplicationService } from 'src/app/api/services';
import { ApplicationPortalStatisticsTypeCode } from 'src/app/core/code-types/application-portal-statistics-type.model';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthUserService } from 'src/app/core/services/auth-user.service';
import { UtilService } from 'src/app/core/services/util.service';
import { CrrpRoutes } from '../crrp-routing.module';
import {
	ApplicationStatusesFilterComponent,
	ApplicationStatusFilter,
	ApplicationStatusFilterMap,
} from './application-statuses-filter.component';

export interface ApplicationStatusResponse extends ApplicationResponse {
	applicationPortalStatusClass: string;
	applicationPortalStatusText: string;
}

@Component({
	selector: 'app-application-statuses',
	template: `
		<app-crrp-header></app-crrp-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12">
					<h2 class="mb-2 fw-normal">Application Statuses</h2>
					<app-banner></app-banner>
				</div>
			</div>

			<app-status-statistics></app-status-statistics>

			<div [formGroup]="formFilter">
				<div class="row">
					<div class="col-xl-8 col-lg-6 col-md-12 col-sm-12">
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
					<div class="col-xl-1 col-lg-2 col-md-2 col-sm-3">
						<app-dropdown-overlay
							[showDropdownOverlay]="showDropdownOverlay"
							(showDropdownOverlayChange)="onShowDropdownOverlayChange($event)"
							[matBadgeShow]="filterCriteriaExists"
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
					<div class="col-xl-8 col-lg-6 col-md-12 col-sm-12">
						<mat-chip
							*ngFor="let status of currentStatuses"
							[removable]="true"
							(removed)="onItemRemoved(status)"
							class="me-2 mb-2"
							selected
						>
							{{ getStatusDesc(status) }}
							<mat-icon matChipRemove>cancel</mat-icon>
						</mat-chip>
					</div>
				</div>
			</div>

			<div class="row">
				<div class="col-12">
					<mat-table
						[dataSource]="dataSource"
						matSort
						(matSortChange)="onSortChange($event)"
						matSortActive="createdOn"
						matSortDirection="desc"
					>
						<ng-container matColumnDef="applicantName">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Applicant Name</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Applicant Name:</span>
								{{ application | fullname }}
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
								{{ application.createdOn | date : constants.date.dateFormat : 'UTC' }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="whoPaid">
							<mat-header-cell *matHeaderCellDef>Paid By</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Paid By:</span>
								{{ application.payeeType }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="applicationNumber">
							<mat-header-cell *matHeaderCellDef>Case ID</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Case ID:</span>
								{{ application.applicationNumber }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="contractedCompanyName">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Company / Facility Name</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Company / Facility Name:</span>
								{{ application.contractedCompanyName | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="status">
							<mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Status:</span>
								<ng-container *ngIf="application.status; else noStatus">
									<mat-chip-listbox aria-label="Status" *ngIf="application.status">
										<mat-chip-option [selectable]="false" [ngClass]="application.applicationPortalStatusClass">
											{{ application.applicationPortalStatusText }}
										</mat-chip-option>
									</mat-chip-listbox>
								</ng-container>
								<ng-template #noStatus>
									<mat-icon>schedule</mat-icon>
								</ng-template>
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="actions">
							<mat-header-cell *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label"></span>
								<a
									mat-flat-button
									(click)="onPayNow(application)"
									class="m-2"
									style="color: var(--color-green);"
									aria-label="Pay now"
									*ngIf="application.status == statisticsCode.AwaitingPayment"
								>
									<mat-icon>send</mat-icon>Pay Now
								</a>

								<a
									mat-flat-button
									(click)="onVerifyApplicant(application)"
									class="m-2"
									style="color: var(--color-primary-light);"
									aria-label="Verify Applicant"
									*ngIf="application.status == statisticsCode.VerifyIdentity"
								>
									<mat-icon>send</mat-icon>Verify Applicant
								</a>
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
			.mat-column-status {
				min-width: 190px;
				padding-right: 4px !important;
				padding-left: 4px !important;
			}

			.mat-column-actions {
				min-width: 240px;
				padding-right: 4px !important;
				padding-left: 4px !important;
			}
		`,
	],
})
export class ApplicationStatusesComponent implements OnInit {
	currentStatuses: any[] = [];
	private currentFilters = '';
	private currentSearch = '';
	private queryParams: any = this.utilService.getDefaultQueryParams();

	constants = SPD_CONSTANTS;
	statisticsCode = ApplicationPortalStatisticsTypeCode;
	filterCriteriaExists = false;

	dataSource: MatTableDataSource<ApplicationStatusResponse> = new MatTableDataSource<ApplicationStatusResponse>([]);
	tablePaginator = this.utilService.getDefaultTablePaginatorConfig();
	columns: string[] = [
		'applicantName',
		'emailAddress',
		'createdOn',
		'whoPaid',
		'applicationNumber',
		'contractedCompanyName',
		'status',
		'actions',
	];

	showDropdownOverlay = false;
	formFilter: FormGroup = this.formBuilder.group(new ApplicationStatusFilter());

	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild('paginator') paginator!: MatPaginator;
	@ViewChild(ApplicationStatusesFilterComponent)
	applicationStatusesFilterComponent!: ApplicationStatusesFilterComponent;

	constructor(
		private router: Router,
		private utilService: UtilService,
		private formBuilder: FormBuilder,
		private applicationService: ApplicationService,
		private authUserService: AuthUserService
	) {}

	ngOnInit() {
		this.loadList();
	}

	onPayNow(application: ApplicationStatusResponse): void {
		this.router.navigateByUrl(CrrpRoutes.path(CrrpRoutes.PAYMENTS), {
			state: { caseId: application.applicationNumber },
		});
	}

	onVerifyApplicant(application: ApplicationStatusResponse): void {
		this.router.navigateByUrl(CrrpRoutes.path(CrrpRoutes.IDENTITY_VERIFICATION), {
			state: { caseId: application.applicationNumber },
		});
	}

	onShowDropdownOverlayChange(show: boolean): void {
		this.showDropdownOverlay = show;
	}

	onSearchKeyDown(searchEvent: any): void {
		const searchString = searchEvent.target.value;
		this.performSearch(searchString);
	}

	onSearch(): void {
		this.performSearch(this.formFilter.value.search);
	}

	onFilterChange(filters: any) {
		this.currentStatuses = this.statuses.value?.length > 0 ? [...this.statuses.value] : [];
		this.currentFilters = filters;
		this.queryParams.page = 0;
		this.filterCriteriaExists = filters ? true : false;
		this.onFilterClose();

		this.loadList();
	}

	onFilterClear() {
		this.currentStatuses = [];
		this.currentFilters = '';
		this.currentSearch = '';
		this.queryParams = this.utilService.getDefaultQueryParams();
		this.filterCriteriaExists = false;
		this.onFilterClose();

		this.loadList();
	}

	onFilterClose() {
		this.showDropdownOverlay = false;
	}

	onPageChanged(page: PageEvent): void {
		this.queryParams.page = page.pageIndex;
		this.loadList();
	}

	onSortChange(sortParameters: Sort) {
		const currentSort = `${sortParameters.direction === 'desc' ? '-' : ''}${
			ApplicationStatusFilterMap[sortParameters.active as keyof ApplicationStatusFilter]
		}`;
		this.queryParams.page = 0;
		this.queryParams.sorts = currentSort;

		this.loadList();
	}

	onItemRemoved(item: string) {
		const items = [...this.statuses.value] as string[];
		this.utilService.removeFirstFromArray(items, item);
		this.statuses.setValue(items); // To trigger change detection

		this.applicationStatusesFilterComponent.emitFilterChange();
	}

	getStatusDesc(code: string): string {
		return this.applicationStatusesFilterComponent.getFilterStatusDesc(code);
	}

	private performSearch(searchString: string): void {
		this.currentSearch = searchString ? `${ApplicationStatusFilterMap['search']}@=${searchString}` : '';
		this.queryParams.page = 0;

		this.loadList();
	}

	private buildQueryParamsFilterString(): string {
		return this.currentFilters + (this.currentFilters ? ',' : '') + this.currentSearch;
	}

	private loadList(): void {
		this.queryParams.filters = this.buildQueryParamsFilterString();

		this.applicationService
			.apiOrgsOrgIdApplicationsGet({
				orgId: this.authUserService.userInfo?.orgId!,
				...this.queryParams,
			})
			.pipe()
			.subscribe((res: ApplicationListResponse) => {
				const applications = res.applications as Array<ApplicationStatusResponse>;
				applications.forEach((app: ApplicationStatusResponse) => {
					const [itemText, itemClass] = this.utilService.getApplicationPortalStatus(app.status);
					app.applicationPortalStatusText = itemText;
					app.applicationPortalStatusClass = itemClass;
				});

				this.dataSource.data = applications;
				this.dataSource.sort = this.sort;
				this.tablePaginator = { ...res.pagination };
			});
	}

	get statuses(): FormControl {
		return this.formFilter.get('statuses') as FormControl;
	}
}
