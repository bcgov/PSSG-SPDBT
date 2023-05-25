import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { ApplicationInviteCreateRequest, ClearanceListResponse, ClearanceResponse } from 'src/app/api/models';
import { ApplicationService } from 'src/app/api/services';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { UtilService } from 'src/app/core/services/util.service';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import { CrrpRoutes } from '../crrp-routing.module';
import { CrcAddModalComponent, CrcDialogData } from './crc-add-modal.component';

export interface ExpiredClearanceResponse extends ClearanceResponse {
	daysRemainingText: string;
	daysRemainingClass: string;
}

export class ExpiringChecksFilter {
	search: string = '';
	applicantName: string = '';
	expiresOn: string = '';
	contractedCompanyName: string = '';
}

export const ExpiringChecksFilterMap: Record<keyof ExpiringChecksFilter, string> = {
	search: 'searchText',
	applicantName: 'name',
	expiresOn: 'expiresOn',
	contractedCompanyName: 'companyname',
};

@Component({
	selector: 'app-expiring-checks',
	template: `
		<app-crrp-header></app-crrp-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12">
					<h2 class="mb-2 fw-normal">Expiring Criminal Record Checks</h2>
					<app-banner></app-banner>
				</div>
			</div>

			<div class="row mt-2" [formGroup]="formFilter">
				<div class="col-xl-8 col-lg-6 col-md-12 col-sm-12">
					<mat-form-field>
						<input
							matInput
							type="search"
							formControlName="search"
							placeholder="Search applicant's name or email"
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
					<mat-table
						matSort
						[dataSource]="dataSource"
						(matSortChange)="onSortChange($event)"
						matSortActive="expiresOn"
						matSortDirection="asc"
					>
						<ng-container matColumnDef="applicantName">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Applicant Name</mat-header-cell>
							<mat-cell *matCellDef="let clearance">
								<span class="mobile-label">Applicant Name:</span>
								{{ clearance | fullname }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="email">
							<mat-header-cell *matHeaderCellDef>Email</mat-header-cell>
							<mat-cell *matCellDef="let clearance">
								<span class="mobile-label">Email:</span>
								{{ clearance.email }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="expiresOn">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Expiring On</mat-header-cell>
							<mat-cell *matCellDef="let clearance">
								<span class="mobile-label">Expiring On:</span>
								{{ clearance.expiresOn | date : constants.date.dateFormat : 'UTC' }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="daysRemaining">
							<mat-header-cell *matHeaderCellDef>Days Remaining</mat-header-cell>
							<mat-cell *matCellDef="let clearance">
								<span class="mobile-label">Days Remaining:</span>
								<span [ngClass]="clearance.daysRemainingClass">
									{{ clearance.daysRemainingText }}
								</span>
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="facility">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Company / Facility Name</mat-header-cell>
							<mat-cell *matCellDef="let clearance">
								<span class="mobile-label">Company / Facility Name:</span>
								{{ clearance.facility | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action1">
							<mat-header-cell *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let clearance">
								<button
									mat-flat-button
									class="table-button m-2"
									style="color: var(--color-primary-light);"
									aria-label="Download Clearance Letter"
									(click)="onDownloadClearanceLetter(clearance)"
								>
									<mat-icon>file_download</mat-icon>Clearance Letter
								</button>
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action2">
							<mat-header-cell *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let clearance">
								<button
									mat-flat-button
									class="table-button m-2"
									style="color: var(--color-green);"
									aria-label="Send Request"
									(click)="onSendRequest(clearance)"
								>
									<mat-icon>send</mat-icon>Request
								</button>
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action3">
							<mat-header-cell *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let clearance">
								<button
									mat-flat-button
									class="table-button m-2"
									style="color: var(--color-red);"
									aria-label="Cancel"
									(click)="onCancel(clearance)"
								>
									<mat-icon>cancel</mat-icon>Cancel
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
				min-width: 220px;
				padding-right: 4px !important;
				padding-left: 4px !important;
			}

			.mat-column-action2 {
				min-width: 160px;
				padding-right: 4px !important;
				padding-left: 4px !important;
			}

			.mat-column-action3 {
				min-width: 160px;
				padding-right: 4px !important;
				padding-left: 4px !important;
			}
		`,
	],
})
export class ExpiringChecksComponent implements OnInit {
	constants = SPD_CONSTANTS;
	private currentFilters = '';
	private currentSearch = '';
	private queryParams: any = this.utilService.getDefaultQueryParams();

	dataSource: MatTableDataSource<ExpiredClearanceResponse> = new MatTableDataSource<ExpiredClearanceResponse>([]);
	tablePaginator = this.utilService.getDefaultTablePaginatorConfig();
	columns!: string[];

	formFilter: FormGroup = this.formBuilder.group({
		search: new FormControl(''),
	});

	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild('paginator') paginator!: MatPaginator;

	constructor(
		private router: Router,
		private utilService: UtilService,
		private formBuilder: FormBuilder,
		private applicationService: ApplicationService,
		private authenticationService: AuthenticationService,
		private hotToast: HotToastService,
		private dialog: MatDialog
	) {}

	ngOnInit() {
		this.columns = [
			'applicantName',
			'email',
			'expiresOn',
			'daysRemaining',
			'facility',
			'action1',
			'action2',
			'action3',
		];
		this.loadList();
	}

	onPayNow(): void {}

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

	onSortChange(sortParameters: Sort) {
		const currentSort = `${sortParameters.direction === 'desc' ? '-' : ''}${
			ExpiringChecksFilterMap[sortParameters.active as keyof ExpiringChecksFilter]
		}`;
		this.queryParams.page = 0;
		this.queryParams.sorts = currentSort;

		this.loadList();
	}

	onDownloadClearanceLetter(clearance: ExpiredClearanceResponse) {
		this.applicationService
			.apiOrgsOrgIdClearancesClearanceIdFileGet({
				clearanceId: clearance.clearanceId!,
				orgId: this.authenticationService.loggedInUserInfo?.orgId!,
			})
			.pipe()
			.subscribe((res: Blob) => {
				if (res && res.size > 0) {
					const url = window.URL.createObjectURL(res);
					const anchor = document.createElement('a');
					anchor.href = url;
					anchor.download = `clearance-letter-${clearance.firstName}-${clearance.lastName}`;
					document.body.appendChild(anchor);
					anchor.click();
					document.body.removeChild(anchor);
				} else {
					this.hotToast.warning('There is no clearance letter associated with this criminal record check');
				}
			});
	}

	onSendRequest(clearance: ExpiredClearanceResponse) {
		const data: DialogOptions = {
			icon: 'info',
			title: 'Confirmation',
			message: 'Would you like to send a new criminal record check request for this individual from your organization?',
			actionText: 'Yes, create request',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					const inviteDefault: ApplicationInviteCreateRequest = {
						firstName: clearance.firstName,
						lastName: clearance.lastName,
						email: clearance.email,
						jobTitle: '',
						payeeType: undefined,
					};

					const dialogOptions: CrcDialogData = {
						inviteDefault,
					};

					this.dialog
						.open(CrcAddModalComponent, {
							width: '1400px',
							data: dialogOptions,
						})
						.afterClosed()
						.subscribe((resp) => {
							if (resp.success) {
								this.hotToast.success('Expired check was successfully removed');
								this.hotToast.success(resp.message);

								this.router.navigateByUrl(CrrpRoutes.crrpPath(CrrpRoutes.CRIMINAL_RECORD_CHECKS));
							}
						});
				}
			});
	}

	onCancel(clearance: ExpiredClearanceResponse) {
		const data: DialogOptions = {
			icon: 'info',
			title: 'Confirmation',
			message: `Are you sure you want to cancel the request for ${clearance.firstName} ${clearance.lastName}?`,
			actionText: 'Yes, cancel',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.applicationService
						.apiOrgsOrgIdClearancesExpiredClearanceAccessIdDelete({
							clearanceAccessId: clearance.id!,
							orgId: this.authenticationService.loggedInUserInfo?.orgId!,
						})
						.pipe()
						.subscribe((_res) => {
							this.hotToast.success('The request was successfully cancelled');
							this.loadList();
						});
				}
			});
	}

	private performSearch(searchString: string): void {
		this.currentSearch = searchString ? `${ExpiringChecksFilterMap['search']}@=${searchString}` : '';
		this.queryParams.page = 0;

		this.loadList();
	}

	private buildQueryParamsFilterString(): string {
		return this.currentFilters + (this.currentFilters ? ',' : '') + this.currentSearch;
	}

	private loadList(): void {
		this.queryParams.filters = this.buildQueryParamsFilterString();

		this.applicationService
			.apiOrgsOrgIdClearancesExpiredGet({
				orgId: this.authenticationService.loggedInUserInfo?.orgId!,
				...this.queryParams,
			})
			.pipe()
			.subscribe((res: ClearanceListResponse) => {
				const applications = res.clearances as Array<ExpiredClearanceResponse>;
				applications.forEach((app: ExpiredClearanceResponse) => {
					const [itemText, itemClass] = this.getDaysRemaining(app.expiresOn);
					app.daysRemainingText = itemText;
					app.daysRemainingClass = itemClass;
				});

				this.dataSource.data = applications;
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
		const diff = expiringOnDate.getTime() - todayDate.getTime();
		const diffDays = Math.ceil(diff / (1000 * 3600 * 24));

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
