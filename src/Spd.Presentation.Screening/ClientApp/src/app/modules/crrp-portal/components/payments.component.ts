import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import moment from 'moment';
import { Observable, tap } from 'rxjs';
import {
	ApplicationPaymentListResponse,
	ApplicationPaymentResponse,
	ApplicationPortalStatusCode,
	ApplicationStatisticsResponse,
	ConfigurationResponse,
	PaymentLinkCreateRequest,
	PaymentLinkResponse,
	PaymentMethodCode,
} from 'src/app/api/models';
import { ApplicationService, PaymentService } from 'src/app/api/services';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import { AppRoutes } from 'src/app/app-routing.module';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthUserBceidService } from 'src/app/core/services/auth-user-bceid.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { UtilService } from 'src/app/core/services/util.service';
import { ScreeningStatusFilterMap } from 'src/app/shared/components/screening-status-filter-common.component';
import { CrrpRoutes } from '../crrp-routing.module';
import { PaymentFilter } from './payment-filter.component';

export interface PaymentResponse extends ApplicationPaymentResponse {
	isPayNow: boolean;
	isPayManual: boolean;
	isDownloadReceipt: boolean;
}

@Component({
	selector: 'app-payments',
	template: `
		<app-crrp-header></app-crrp-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12">
					<h2 class="mb-2">Payments</h2>

					<ng-container *ngIf="applicationStatistics$ | async">
						<app-alert type="warning" *ngIf="count > 0">
							<ng-container>
								<ng-container *ngIf="count === 1; else notOne">
									<div>There is 1 application which requires payment</div>
								</ng-container>
								<ng-template #notOne>
									<div>There are {{ count }} applications which require payment</div>
								</ng-template>
							</ng-container>
						</app-alert>
					</ng-container>

					<app-alert type="success" icon="info" *ngIf="payBcSearchInvoiceUrl">
						<div>
							Click <a [href]="payBcSearchInvoiceUrl" target="_blank">here</a> to access {{ loggedInOrgDisplay }}'s
							monthly invoices and submit payment
						</div>
					</app-alert>
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
						[matBadgeShow]="filterCriteriaExists"
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
								{{ application.createdOn | formatDate }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="paidOn">
							<mat-header-cell *matHeaderCellDef>Paid On</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Paid On:</span>
								{{ application.paidOn | formatDate | default }}
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
								<mat-chip-row
									aria-label="Status"
									class="mat-chip-green"
									*ngIf="application.status && application.isDownloadReceipt; else notpaid"
								>
									Paid
								</mat-chip-row>
								<ng-template #notpaid>
									<mat-chip-row aria-label="Status" class="mat-chip-yellow"> Not Paid </mat-chip-row>
								</ng-template>
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action1">
							<mat-header-cell *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let application">
								<button
									mat-flat-button
									class="table-button"
									style="color: var(--color-primary-light);"
									*ngIf="application.isDownloadReceipt"
									aria-label="Download Receipt"
									matTooltip="Download Receipt"
									(click)="onDownloadReceipt(application)"
								>
									<mat-icon>file_download</mat-icon>Receipt
								</button>

								<button
									mat-flat-button
									class="table-button"
									style="color: var(--color-green);"
									*ngIf="application.isPayNow"
									aria-label="Pay now"
									(click)="onPayNow(application)"
								>
									<mat-icon>payment</mat-icon>Pay Now
								</button>

								<button
									mat-flat-button
									class="table-button"
									style="color: var(--color-red);"
									*ngIf="application.isPayManual"
									aria-label="Pay manually"
									(click)="onPayManual(application)"
								>
									<mat-icon>payment</mat-icon>Pay Manually
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
				min-width: 110px;
			}

			.mat-column-action1 {
				min-width: 170px;
				.table-button {
					min-width: 150px;
				}
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
	filterCriteriaExists = false;
	loggedInOrgDisplay: string | null | undefined = this.authUserService.bceidUserInfoProfile?.orgName;
	payBcSearchInvoiceUrl: string | null | undefined = null;

	dataSource: MatTableDataSource<PaymentResponse> = new MatTableDataSource<PaymentResponse>([]);
	tablePaginator = this.utilService.getDefaultTablePaginatorConfig();
	columns: string[] = ['applicantName', 'createdOn', 'paidOn', 'applicationNumber', 'status', 'action1'];

	showDropdownOverlay = false;
	formFilter: FormGroup = this.formBuilder.group(new PaymentFilter());

	applicationStatistics$!: Observable<ApplicationStatisticsResponse>;

	@ViewChild('paginator') paginator!: MatPaginator;

	constructor(
		private router: Router,
		private utilService: UtilService,
		private formBuilder: FormBuilder,
		private applicationService: ApplicationService,
		private paymentService: PaymentService,
		private authUserService: AuthUserBceidService,
		private configService: ConfigService,
		private location: Location
	) {
		this.refreshStats();
	}

	ngOnInit(): void {
		const orgId = this.authUserService.bceidUserInfoProfile?.orgId;
		if (!orgId) {
			console.debug('PaymentsComponent - missing orgId');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
			return;
		}

		const hasInvoiceSupport = this.authUserService.bceidUserOrgProfile?.hasInvoiceSupport;
		if (hasInvoiceSupport) {
			this.configService
				.getConfigs()
				.pipe()
				.subscribe((resp: ConfigurationResponse) => {
					this.payBcSearchInvoiceUrl = resp.payBcSearchInvoiceUrl;
				});
		}

		const caseId = (this.location.getState() as any)?.caseId;
		this.formFilter.patchValue({ search: caseId });

		this.performSearch(caseId);
	}

	onPayNow(application: PaymentResponse): void {
		const orgId = this.authUserService.bceidUserInfoProfile?.orgId;
		const body: PaymentLinkCreateRequest = {
			applicationId: application.id!,
			paymentMethod: PaymentMethodCode.CreditCard,
			description: `Payment for Case ID: ${application.applicationNumber}`,
		};
		this.paymentService
			.apiOrgsOrgIdApplicationsApplicationIdPaymentLinkPost({
				orgId: orgId!,
				applicationId: application.id!,
				body,
			})
			.pipe()
			.subscribe((res: PaymentLinkResponse) => {
				if (res.paymentLinkUrl) {
					window.location.assign(res.paymentLinkUrl);
				}
			});
	}

	onPayManual(application: PaymentResponse): void {
		this.router.navigateByUrl(`/${CrrpRoutes.path(CrrpRoutes.PAYMENT_MANUAL)}`, {
			state: { applicationData: application },
		});
	}

	onDownloadReceipt(application: PaymentResponse): void {
		this.paymentService
			.apiOrgsOrgIdApplicationsApplicationIdPaymentReceiptGet$Response({
				orgId: this.authUserService.bceidUserInfoProfile?.orgId!,
				applicationId: application.id!,
			})
			.pipe()
			.subscribe((resp: StrictHttpResponse<Blob>) => {
				this.utilService.downloadFile(resp.headers, resp.body);
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
		this.currentFilters = filters;
		this.filterCriteriaExists = !!filters;
		this.queryParams.page = 0;
		this.onFilterClose();

		this.loadList();
	}

	onFilterClear() {
		this.currentFilters = '';
		this.currentSearch = '';
		this.filterCriteriaExists = false;
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
		const defaultStatuses = [
			ApplicationPortalStatusCode.AwaitingApplicant,
			ApplicationPortalStatusCode.AwaitingPayment,
			ApplicationPortalStatusCode.AwaitingThirdParty,
			ApplicationPortalStatusCode.CancelledByApplicant,
			ApplicationPortalStatusCode.CancelledByOrganization,
			ApplicationPortalStatusCode.ClosedNoConsent,
			ApplicationPortalStatusCode.ClosedNoResponse,
			ApplicationPortalStatusCode.CompletedCleared,
			ApplicationPortalStatusCode.InProgress,
			ApplicationPortalStatusCode.Incomplete,
			ApplicationPortalStatusCode.RiskFound,
			ApplicationPortalStatusCode.UnderAssessment,
		];

		let defaultSearch = `status==${defaultStatuses.join('|')},`;

		if (!this.currentFilters) {
			const fromDate = moment().subtract(1, 'year').format(SPD_CONSTANTS.date.dateFormat);
			const toDate = moment().format(SPD_CONSTANTS.date.dateFormat);
			defaultSearch += `fromDate==${fromDate},toDate==${toDate},`;
		}

		return defaultSearch + this.currentFilters + (this.currentFilters ? ',' : '') + this.currentSearch;
	}

	private loadList(): void {
		this.queryParams.filters = this.buildQueryParamsFilterString();

		this.applicationService
			.apiOrgsOrgIdApplicationsPaymentsGet({
				orgId: this.authUserService.bceidUserInfoProfile?.orgId!,
				...this.queryParams,
			})
			.pipe()
			.subscribe((res: ApplicationPaymentListResponse) => {
				const applications = res.applications as Array<PaymentResponse>;
				applications.forEach((app: PaymentResponse) => {
					app.isDownloadReceipt = false;
					app.isPayManual = false;
					app.isPayNow = false;

					if (app.status != ApplicationPortalStatusCode.AwaitingPayment) {
						if (app.paidOn) {
							app.isDownloadReceipt = true;
						}
					} else {
						const numberOfAttempts = app.numberOfAttempts ?? 0;
						app.isPayManual = numberOfAttempts >= SPD_CONSTANTS.payment.maxNumberOfAttempts;
						app.isPayNow = numberOfAttempts < SPD_CONSTANTS.payment.maxNumberOfAttempts;
					}
				});

				this.dataSource = new MatTableDataSource(applications);
				this.tablePaginator = { ...res.pagination };
			});
	}

	private refreshStats(): void {
		this.applicationStatistics$ = this.applicationService
			.apiOrgsOrgIdApplicationStatisticsGet({
				orgId: this.authUserService.bceidUserInfoProfile?.orgId!,
			})
			.pipe(
				tap((res: ApplicationStatisticsResponse) => {
					const applicationStatistics = res.statistics ?? {};
					this.count = applicationStatistics.AwaitingPayment ?? 0;
				})
			);
	}
}
