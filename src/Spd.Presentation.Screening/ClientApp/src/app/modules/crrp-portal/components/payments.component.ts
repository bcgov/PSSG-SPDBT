import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import {
	ApplicationListResponse,
	ApplicationPortalStatusCode,
	ApplicationResponse,
	ApplicationStatisticsResponse,
} from 'src/app/api/models';
import { ApplicationService } from 'src/app/api/services';
import { AppRoutes } from 'src/app/app-routing.module';
import { ApplicationPortalStatisticsTypeCode } from 'src/app/core/code-types/application-portal-statistics-type.model';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthUserService } from 'src/app/core/services/auth-user.service';
import { UtilService } from 'src/app/core/services/util.service';
import { ScreeningStatusFilterMap } from 'src/app/shared/components/screening-status-filter-common.component';
import { PaymentFilter } from './payment-filter.component';

export interface PaymentResponse extends ApplicationResponse {
	applicationPortalStatusClass: string;
	applicationPortalStatusText: string;
}
@Component({
	selector: 'app-payments',
	template: `
		<app-crrp-header></app-crrp-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12">
					<h2 class="mb-2 fw-normal">Payments</h2>
					<ng-container *ngIf="applicationStatistics$ | async">
						<app-alert type="warning">
							<ng-container *ngIf="count > 0">
								<ng-container *ngIf="count == 1; else notOne">
									<div>There is 1 application which requires payment</div>
								</ng-container>
								<ng-template #notOne>
									<div>There are {{ count }} applications which require payment</div>
								</ng-template>
							</ng-container>
						</app-alert>
					</ng-container>
				</div>
			</div>

			<div class="row" [formGroup]="formFilter">
				<div class="col-xl-8 col-lg-6 col-md-12 col-sm-12">
					<mat-form-field>
						<input
							matInput
							type="search"
							formControlName="search"
							placeholder="Search applicant's name or case ID"
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
					<mat-table [dataSource]="dataSource">
						<ng-container matColumnDef="applicantName">
							<mat-header-cell *matHeaderCellDef>Applicant Name</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Applicant Name:</span>
								{{ application | fullname }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="createdOn">
							<mat-header-cell *matHeaderCellDef>Submitted On</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Submitted On:</span>
								{{ application.createdOn | date : constants.date.dateFormat : 'UTC' }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="paidOn">
							<mat-header-cell *matHeaderCellDef>Paid On</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Paid On:</span>
								??<!-- {{ application.paidOn | date : constants.date.dateTimeFormat  : 'UTC-7' }} -->
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="applicationNumber">
							<mat-header-cell *matHeaderCellDef>Case ID</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Case ID:</span>
								{{ application.applicationNumber }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="status">
							<mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Status:</span>
								<mat-chip-listbox aria-label="Status" *ngIf="application.status">
									<ng-container
										*ngIf="application.status != applicationPortalStatusCodes.AwaitingPayment; else notpaid"
									>
										<mat-chip-option [selectable]="false" class="mat-chip-green"> Paid </mat-chip-option>
									</ng-container>
									<ng-template #notpaid>
										<mat-chip-option [selectable]="false" class="mat-chip-yellow"> Not Paid </mat-chip-option>
									</ng-template>
								</mat-chip-listbox>
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="actions">
							<mat-header-cell *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let application">
								<button
									mat-flat-button
									class="table-button m-2"
									style="color: var(--color-primary-light);"
									*ngIf="application.status != applicationPortalStatusCodes.AwaitingPayment"
									aria-label="Download Receipt"
									matTooltip="Download Receipt"
								>
									<mat-icon>file_download</mat-icon>Receipt
								</button>

								<button
									mat-flat-button
									class="table-button m-2"
									style="color: var(--color-green);"
									*ngIf="application.status == applicationPortalStatusCodes.AwaitingPayment"
									aria-label="Pay now"
								>
									<mat-icon>send</mat-icon>Pay Now
								</button>
							</mat-cell>
						</ng-container>

						<mat-header-row *matHeaderRowDef="columns; sticky: true"></mat-header-row>
						<mat-row *matRowDef="let row; columns: columns"></mat-row>
					</mat-table>
					<mat-paginator
						[showFirstLastButtons]="true"
						[hidePageSize]="true"
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
				min-width: 150px;
				padding-right: 4px !important;
				padding-left: 4px !important;
			}
		`,
	],
})
export class PaymentsComponent implements OnInit {
	private queryParams: any = this.utilService.getDefaultQueryParams();

	count = 0;
	constants = SPD_CONSTANTS;
	applicationPortalStatusCodes = ApplicationPortalStatusCode;
	currentFilters = '';
	currentSearch = '';

	dataSource: MatTableDataSource<PaymentResponse> = new MatTableDataSource<PaymentResponse>([]);
	tablePaginator = this.utilService.getDefaultTablePaginatorConfig();
	columns: string[] = ['applicantName', 'createdOn', 'paidOn', 'applicationNumber', 'status', 'actions'];

	showDropdownOverlay = false;
	formFilter: FormGroup = this.formBuilder.group(new PaymentFilter());

	applicationStatistics$!: Observable<ApplicationStatisticsResponse>;

	@ViewChild('paginator') paginator!: MatPaginator;

	constructor(
		private router: Router,
		private utilService: UtilService,
		private formBuilder: FormBuilder,
		private applicationService: ApplicationService,
		private authUserService: AuthUserService,
		private location: Location
	) {
		this.refreshStats();
	}

	ngOnInit(): void {
		const orgId = this.authUserService.userInfo?.orgId;
		if (!orgId) {
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
			return;
		}

		const caseId = (this.location.getState() as any)?.caseId;
		this.formFilter.patchValue({ search: caseId });

		this.performSearch(caseId);
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
		this.currentFilters = filters;
		this.queryParams.page = 0;
		this.onFilterClose();

		this.loadList();
	}

	onFilterClear() {
		this.currentFilters = '';
		this.currentSearch = '';
		this.queryParams = this.utilService.getDefaultQueryParams();
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

	private performSearch(searchString: string): void {
		this.currentSearch = searchString ? `${ScreeningStatusFilterMap['search']}@=${searchString}` : '';
		this.queryParams.page = 0;

		this.loadList();
	}

	private buildQueryParamsFilterString(): string {
		return (
			// `status==${ApplicationPortalStatusCode.AwaitingPayment},` +
			this.currentFilters + (this.currentFilters ? ',' : '') + this.currentSearch
		);
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
				const applications = res.applications as Array<PaymentResponse>;
				applications.forEach((app: PaymentResponse) => {
					const itemClass = this.utilService.getApplicationPortalStatusClass(app.status);
					app.applicationPortalStatusClass = itemClass;
				});

				this.dataSource = new MatTableDataSource(applications);
				this.tablePaginator = { ...res.pagination };
			});
	}

	private refreshStats(): void {
		this.applicationStatistics$ = this.applicationService
			.apiOrgsOrgIdApplicationStatisticsGet({
				orgId: this.authUserService.userInfo?.orgId!,
			})
			.pipe(
				tap((res: ApplicationStatisticsResponse) => {
					const applicationStatistics = res.statistics ?? {};
					this.count = applicationStatistics[ApplicationPortalStatisticsTypeCode.AwaitingPayment];
				})
			);
	}
}
