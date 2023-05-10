import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HotToastService } from '@ngneat/hot-toast';
import {
	ApplicationInviteListResponse,
	ApplicationInviteResponse,
	ApplicationInviteStatusCode,
} from 'src/app/api/models';
import { ApplicationService } from 'src/app/api/services';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { UtilService } from 'src/app/core/services/util.service';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import { CrcAddModalComponent } from './crc-add-modal.component';

export class CriminalRecordCheckFilter {
	search: string = '';
}

export const CriminalRecordCheckFilterMap: Record<keyof CriminalRecordCheckFilter, string> = {
	search: 'searchText',
};

@Component({
	selector: 'app-criminal-record-checks',
	template: `
		<app-crrp-header></app-crrp-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-xxl-9 col-xl-8 col-lg-7 col-md-6 col-sm-12">
					<h2 class="mb-2 fw-normal">
						Criminal Record Check Requests
						<div class="mt-2 fs-5 fw-light">
							Criminal record check request links will expire 14 days after being sent
						</div>
					</h2>
				</div>
				<div class="col-xxl-3 col-xl-4 col-lg-5 col-md-6 col-sm-12 my-auto">
					<button mat-flat-button class="large w-100 mat-green-button mb-2" (click)="onAddCRCs()">Add Request</button>
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
					<mat-table matSort [dataSource]="dataSource">
						<ng-container matColumnDef="applicantName">
							<mat-header-cell *matHeaderCellDef>Applicant Name</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Applicant Name:</span>
								<mat-icon
									class="error-icon"
									[matTooltip]="application.errorMsg"
									matTooltipClass="error-tooltip"
									*ngIf="application.status == applicationInviteStatusCodes.Failed"
								>
									error
								</mat-icon>
								{{ application | fullname }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="emailAddress">
							<mat-header-cell *matHeaderCellDef>Email</mat-header-cell>
							<mat-cell *matCellDef="let application">
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

						<ng-container matColumnDef="paidBy">
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
								{{ application.createdOn | date : constants.date.dateFormat : 'UTC' }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="viewed">
							<mat-header-cell *matHeaderCellDef>Viewed</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Viewed:</span>
								{{ application.viewed | yesNo }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="actions">
							<mat-header-cell *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let application">
								<button
									mat-flat-button
									class="table-button m-2"
									style="white-space: nowrap;"
									aria-label="Cancel Request"
									(click)="OnCancelRequest(application)"
								>
									<mat-icon>cancel</mat-icon>Cancel Request
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
			.mat-column-actions {
				min-width: 300px;
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
	encapsulation: ViewEncapsulation.None,
})
export class CriminalRecordChecksComponent implements OnInit {
	constants = SPD_CONSTANTS;
	applicationInviteStatusCodes = ApplicationInviteStatusCode;

	dataSource: MatTableDataSource<ApplicationInviteResponse> = new MatTableDataSource<ApplicationInviteResponse>([]);
	tablePaginator = this.utilService.getDefaultTablePaginatorConfig();
	columns: string[] = ['applicantName', 'emailAddress', 'jobTitle', 'paidBy', 'createdOn', 'viewed', 'actions'];
	formFilter: FormGroup = this.formBuilder.group({
		search: new FormControl(''),
	});

	private queryParams: any = this.utilService.getDefaultQueryParams();
	private currentSearch = '';

	@ViewChild('paginator') paginator!: MatPaginator;

	constructor(
		private utilService: UtilService,
		private formBuilder: FormBuilder,
		private dialog: MatDialog,
		private applicationService: ApplicationService,
		private authenticationService: AuthenticationService,
		private hotToast: HotToastService
	) {}

	ngOnInit() {
		this.loadList();
	}

	onAddCRCs(): void {
		this.dialog
			.open(CrcAddModalComponent, {
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
			message: `Are you sure you want to cancel the request for ${application.firstName} ${application.lastName}?`,
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
							orgId: this.authenticationService.loggedInOrgId!,
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
		this.currentSearch = searchString ? `${CriminalRecordCheckFilterMap['search']}@=${searchString}` : '';
		this.queryParams.page = 0;
		this.queryParams.filters = this.currentSearch;

		this.loadList();
	}

	private loadList(): void {
		this.applicationService
			.apiOrgsOrgIdApplicationInvitesGet({
				orgId: this.authenticationService.loggedInOrgId!,
				...this.queryParams,
			})
			.pipe()
			.subscribe((res: ApplicationInviteListResponse) => {
				this.dataSource = new MatTableDataSource(res.applicationInvites ?? []);
				this.tablePaginator = { ...res.pagination };
			});
	}
}
