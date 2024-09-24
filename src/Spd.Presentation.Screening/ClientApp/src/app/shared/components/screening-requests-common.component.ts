import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';
import {
	ApplicationInviteListResponse,
	ApplicationInviteResponse,
	ApplicationInviteStatusCode,
} from 'src/app/api/models';
import { ApplicationService } from 'src/app/api/services';
import { AppRoutes } from 'src/app/app-routing.module';
import { PortalTypeCode } from 'src/app/core/code-types/portal-type.model';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { UtilService } from 'src/app/core/services/util.service';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import {
	ScreeningRequestAddCommonModalComponent,
	ScreeningRequestAddDialogData,
} from './screening-request-add-common-modal.component';

export class ScreeningCheckFilter {
	search = '';
}

export const ScreeningCheckFilterMap: Record<keyof ScreeningCheckFilter, string> = {
	search: 'searchText',
};

@Component({
	selector: 'app-screening-requests-common',
	template: `
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-xxl-10 col-xl-9 col-lg-6 col-md-6 col-sm-12">
					<h2 class="mb-2">
						{{ heading }}
						<div class="mt-2 fs-5 fw-light">{{ subtitle }}</div>
					</h2>
				</div>
				<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 text-end">
					<button mat-flat-button type="button" class="large w-auto mat-green-button mb-2" (click)="onAddRequest()">
						Add Request
					</button>
				</div>
			</div>

			<div class="row mt-2" [formGroup]="formFilter">
				<mat-divider class="mat-divider-main mb-4"></mat-divider>
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
					<mat-table [dataSource]="dataSource">
						<ng-container matColumnDef="applicantName">
							<mat-header-cell *matHeaderCellDef>Applicant Name</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Applicant Name:</span>
								<mat-icon
									class="error-icon"
									[matTooltip]="application.errorMsg"
									matTooltipClass="error-tooltip"
									*ngIf="application.status === applicationInviteStatusCodes.Failed"
								>
									error
								</mat-icon>
								{{ application | fullname }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="emailAddress">
							<mat-header-cell *matHeaderCellDef>Email</mat-header-cell>
							<mat-cell class="mat-cell-email" *matCellDef="let application">
								<span class="mobile-label">Email:</span>
								{{ application.email | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="jobTitle">
							<mat-header-cell *matHeaderCellDef>Job Title</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Job Title:</span>
								{{ application.jobTitle | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="payeeType">
							<mat-header-cell *matHeaderCellDef>To Be Paid By</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">To Be Paid By:</span>
								{{ application.payeeType | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="createdOn">
							<mat-header-cell *matHeaderCellDef>Request Sent</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Request Sent:</span>
								{{ application.createdOn | formatDate }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="orgId">
							<mat-header-cell *matHeaderCellDef>Ministry</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Ministry:</span>
								{{ application.orgId | ministryoptions | async | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="viewed">
							<mat-header-cell *matHeaderCellDef>Viewed</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Viewed:</span>
								{{ application.viewed | yesNo }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action1">
							<mat-header-cell *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let application">
								<button
									mat-flat-button
									class="table-button"
									style="color: var(--color-red);"
									aria-label="Cancel Request"
									(click)="OnCancelRequest(application)"
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
			@media (min-width: 1200px) {
				/* only force max width on large screens */
				.mat-column-createdOn {
					max-width: 160px;
				}

				.mat-column-viewed {
					max-width: 100px;
				}
			}

			.mat-column-action1 {
				min-width: 185px;
			}

			.error-icon {
				cursor: pointer;
				color: var(--color-red);
				margin-right: 0.5rem;
			}

			.error-tooltip {
				border: 2px solid red;
				border-radius: 6px;

				.mdc-tooltip {
					&__surface {
						color: red !important;
						background-color: white !important;
						font-size: 0.9em !important;
					}
				}
			}
		`,
	],
})
export class ScreeningRequestsCommonComponent implements OnInit {
	constants = SPD_CONSTANTS;
	applicationInviteStatusCodes = ApplicationInviteStatusCode;

	dataSource: MatTableDataSource<ApplicationInviteResponse> = new MatTableDataSource<ApplicationInviteResponse>([]);
	tablePaginator = this.utilService.getDefaultTablePaginatorConfig();
	columns: string[] = [];
	formFilter: FormGroup = this.formBuilder.group({
		search: new FormControl(''),
	});

	private queryParams: any = this.utilService.getDefaultQueryParams();
	private currentSearch = '';

	@Input() orgId: string | null = null;
	@Input() portal: PortalTypeCode | null = null;
	@Input() isPsaUser: boolean | undefined = undefined;
	@Input() heading = '';
	@Input() subtitle = '';

	@ViewChild('paginator') paginator!: MatPaginator;

	constructor(
		private router: Router,
		private utilService: UtilService,
		private formBuilder: FormBuilder,
		private dialog: MatDialog,
		private applicationService: ApplicationService,
		private hotToast: HotToastService
	) {}

	ngOnInit() {
		if (!this.orgId) {
			console.debug('ScreeningRequestsCommonComponent - missing orgId');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
			return;
		}

		if (this.portal == PortalTypeCode.Crrp) {
			this.columns = ['applicantName', 'emailAddress', 'jobTitle', 'payeeType', 'createdOn', 'viewed', 'action1'];
		} else if (this.portal == PortalTypeCode.Psso) {
			if (this.isPsaUser) {
				this.columns = ['applicantName', 'emailAddress', 'jobTitle', 'createdOn', 'orgId', 'viewed', 'action1'];
			} else {
				this.columns = ['applicantName', 'emailAddress', 'jobTitle', 'createdOn', 'viewed', 'action1'];
			}
		}

		this.loadList();
	}

	onAddRequest(): void {
		const dialogOptions: ScreeningRequestAddDialogData = {
			portal: this.portal!,
			orgId: this.orgId!,
			isPsaUser: this.isPsaUser,
		};

		this.dialog
			.open(ScreeningRequestAddCommonModalComponent, {
				data: dialogOptions,
				width: '1400px',
			})
			.afterClosed()
			.subscribe((resp) => {
				if (resp.success) {
					this.hotToast.success(resp.message);
					this.loadList();
				}
			});
	}

	OnCancelRequest(application: ApplicationInviteResponse) {
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: `Are you sure you want to cancel the request for '${application.firstName} ${application.lastName}'?`,
			actionText: 'Yes, cancel request',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.applicationService
						.apiOrgsOrgIdApplicationInvitesApplicationInviteIdDelete({
							applicationInviteId: application.id!,
							orgId: application.orgId!,
						})
						.pipe()
						.subscribe((_res) => {
							this.hotToast.success('The request was successfully cancelled');
							this.loadList();
						});
				}
			});
	}

	onPageChanged(page: PageEvent): void {
		this.queryParams.page = page.pageIndex;
		this.loadList();
	}

	onSearchKeyDown(searchEvent: any): void {
		const searchString = searchEvent.target.value;
		this.performSearch(searchString);
	}

	onSearch(): void {
		this.performSearch(this.formFilter.value.search);
	}

	private performSearch(searchString: string): void {
		this.currentSearch = searchString ? `${ScreeningCheckFilterMap['search']}@=${searchString}` : '';
		this.queryParams.page = 0;
		this.queryParams.filters = this.currentSearch;

		this.loadList();
	}

	private loadList(): void {
		this.applicationService
			.apiOrgsOrgIdApplicationInvitesGet({
				orgId: this.orgId!,
				...this.queryParams,
			})
			.pipe()
			.subscribe((res: ApplicationInviteListResponse) => {
				this.dataSource = new MatTableDataSource(res.applicationInvites ?? []);
				this.tablePaginator = { ...res.pagination };
			});
	}
}
