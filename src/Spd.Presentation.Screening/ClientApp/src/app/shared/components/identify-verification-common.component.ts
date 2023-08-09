import { Location } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Observable, tap } from 'rxjs';
import {
	ApplicationInviteCreateRequest,
	ApplicationListResponse,
	ApplicationPortalStatusCode,
	ApplicationResponse,
	ApplicationStatisticsResponse,
	IdentityStatusCode,
} from 'src/app/api/models';
import { ApplicationService } from 'src/app/api/services';
import { AppRoutes } from 'src/app/app-routing.module';
import { ApplicationPortalStatisticsTypeCode } from 'src/app/core/code-types/application-portal-statistics-type.model';
import { PortalTypeCode } from 'src/app/core/code-types/portal-type.model';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { UtilService } from 'src/app/core/services/util.service';
import { CrrpRoutes } from 'src/app/modules/crrp-portal/crrp-routing.module';
import { PssoRoutes } from 'src/app/modules/psso-portal/psso-routing.module';
import { DialogCloseCode, DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import {
	ScreeningRequestAddCommonModalComponent,
	ScreeningRequestAddDialogData,
} from 'src/app/shared/components/screening-request-add-common-modal.component';
import { ScreeningStatusFilterMap } from 'src/app/shared/components/screening-status-filter-common.component';

export interface IdentityVerificationResponse extends ApplicationResponse {
	hideActions: boolean;
}

@Component({
	selector: 'app-identify-verification-common',
	template: `
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12">
					<h2 class="mb-2 fw-normal">Identity Verification</h2>
					<ng-container *ngIf="applicationStatistics$ | async">
						<app-alert type="warning" icon="warning" *ngIf="count > 0">
							<ng-container *ngIf="count == 1; else notOne">
								<div>There is 1 applicant which requires confirmation</div>
							</ng-container>
							<ng-template #notOne>
								<div>There are {{ count }} applicants which require confirmation</div>
							</ng-template>
						</app-alert>
					</ng-container>
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
							<mat-cell class="mat-cell-email" *matCellDef="let application">
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
									class="table-button"
									style="color: var(--color-green);"
									aria-label="Confirm"
									*ngIf="!application.hideActions"
									(click)="onConfirm(application)"
								>
									<mat-icon>check_circle</mat-icon>Confirm
								</button>
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action2">
							<mat-header-cell *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let application">
								<button
									mat-flat-button
									class="table-button"
									style="color: var(--color-red);"
									aria-label="Reject"
									*ngIf="!application.hideActions"
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
			.mat-column-action1 {
				min-width: 170px;
				.table-button {
					min-width: 150px;
				}
			}

			.mat-column-action2 {
				min-width: 170px;
				.table-button {
					min-width: 150px;
				}
			}
		`,
	],
})
export class IdentifyVerificationCommonComponent implements OnInit {
	private currentSearch = '';
	private queryParams: any = this.utilService.getDefaultQueryParams();

	count = 0;
	constants = SPD_CONSTANTS;
	dataSource: MatTableDataSource<IdentityVerificationResponse> = new MatTableDataSource<IdentityVerificationResponse>(
		[]
	);
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

	applicationStatistics$!: Observable<ApplicationStatisticsResponse>;

	@Input() portal: PortalTypeCode | null = null;
	@Input() orgId: string | null = null;

	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild('paginator') paginator!: MatPaginator;

	constructor(
		private router: Router,
		private utilService: UtilService,
		private formBuilder: FormBuilder,
		private location: Location,
		private applicationService: ApplicationService,
		private hotToast: HotToastService,
		private dialog: MatDialog
	) {}

	ngOnInit() {
		if (!this.orgId) {
			console.debug('IdentifyVerificationCommonComponent - missing orgId');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
			return;
		}

		const caseId = (this.location.getState() as any)?.caseId;
		this.formFilter.patchValue({ search: caseId });

		this.refreshStats();
		this.performSearch(caseId);
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

	onConfirm(application: IdentityVerificationResponse) {
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
					this.verifyIdentity(application);
				}
			});
	}

	onReject(application: IdentityVerificationResponse) {
		const data: DialogOptions = {
			icon: 'info',
			title: 'Confirmation',
			message: 'Are you sure you would like to remove this individual from your organization?',
			actionText: 'Yes, remove',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: DialogCloseCode) => {
				if (response) {
					this.rejectIdentity(application);
				}
			});
	}

	private sendRequest(application: IdentityVerificationResponse) {
		const inviteDefault: ApplicationInviteCreateRequest = {
			firstName: application.givenName,
			lastName: application.surname,
			email: application.emailAddress,
			jobTitle: application.jobTitle,
			payeeType: application.payeeType,
		};

		const dialogOptions: ScreeningRequestAddDialogData = {
			portal: this.portal!,
			orgId: this.orgId!,
		};

		this.dialog
			.open(ScreeningRequestAddCommonModalComponent, {
				width: '1400px',
				data: dialogOptions,
			})
			.afterClosed()
			.subscribe((resp) => {
				if (resp.success) {
					this.hotToast.success(resp.message);
					if (this.portal == 'CRRP') {
						this.router.navigateByUrl(CrrpRoutes.path(CrrpRoutes.CRIMINAL_RECORD_CHECKS));
					} else if (this.portal == 'PSSO') {
						this.router.navigateByUrl(PssoRoutes.path(PssoRoutes.SCREENING_CHECKS));
					}
				}
			});
	}

	private performSearch(searchString: string): void {
		this.currentSearch = searchString ? `${ScreeningStatusFilterMap['search']}@=${searchString}` : '';
		this.queryParams.page = 0;

		this.loadList();
	}

	private buildQueryParamsFilterString(): string {
		return `status==${ApplicationPortalStatusCode.VerifyIdentity},` + this.currentSearch;
	}

	private loadList(): void {
		this.queryParams.filters = this.buildQueryParamsFilterString();

		this.applicationService
			.apiOrgsOrgIdApplicationsGet({
				orgId: this.orgId!,
				...this.queryParams,
			})
			.pipe()
			.subscribe((res: ApplicationListResponse) => {
				const applications = res.applications ?? [];
				this.dataSource.data = applications as Array<IdentityVerificationResponse>;
				this.dataSource.sort = this.sort;
				this.tablePaginator = { ...res.pagination };
			});
	}

	private verifyIdentity(application: IdentityVerificationResponse) {
		this.applicationService
			.apiOrgsOrgIdIdentityApplicationIdPut({
				orgId: this.orgId!,
				applicationId: application.id!,
				status: IdentityStatusCode.Verified,
			})
			.pipe()
			.subscribe(() => {
				this.hotToast.success('Identity was successfully confirmed');
				this.removeActionsFromView(application);
			});
	}

	private rejectIdentity(application: IdentityVerificationResponse) {
		this.applicationService
			.apiOrgsOrgIdIdentityApplicationIdPut({
				orgId: this.orgId!,
				applicationId: application.id!,
				status: IdentityStatusCode.Rejected,
			})
			.pipe()
			.subscribe(() => {
				this.hotToast.success('Identity was successfully rejected');
				this.removeActionsFromView(application);
				this.postReject(application);
			});
	}

	private postReject(application: IdentityVerificationResponse) {
		const data: DialogOptions = {
			icon: 'info',
			title: 'Confirmation',
			message: 'Would you like to send a new criminal record check request for this individual from your organization?',
			actionText: 'Yes, create request',
			cancelText: 'Close',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: DialogCloseCode) => {
				if (response) {
					this.sendRequest(application);
				}
			});
	}

	private removeActionsFromView(application: IdentityVerificationResponse) {
		application.hideActions = true;
		this.refreshStats();
	}

	private refreshStats(): void {
		this.applicationStatistics$ = this.applicationService
			.apiOrgsOrgIdApplicationStatisticsGet({
				orgId: this.orgId!,
			})
			.pipe(
				tap((res: ApplicationStatisticsResponse) => {
					const applicationStatistics = res.statistics ?? {};
					this.count = applicationStatistics[ApplicationPortalStatisticsTypeCode.VerifyIdentity];
				})
			);
	}
}
