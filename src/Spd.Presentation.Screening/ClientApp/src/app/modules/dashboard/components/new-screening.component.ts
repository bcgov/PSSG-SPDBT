import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HotToastService } from '@ngneat/hot-toast';
import { ApplicationListResponse, ApplicationResponse } from 'src/app/api/models';
import { ApplicationService } from 'src/app/api/services';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { UtilService } from 'src/app/core/services/util.service';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import { NewScreeningModalComponent } from './new-screening-modal.component';

@Component({
	selector: 'app-new-screening',
	template: `
		<app-dashboard-header subtitle="Criminal Record Check Portal"></app-dashboard-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-xxl-9 col-xl-8 col-lg-7 col-md-6 col-sm-12">
					<h2 class="mb-2 fw-normal">
						Criminal Record Checks
						<div class="mt-2 fs-5 fw-light">View active criminal record checks</div>
					</h2>
				</div>
				<div class="col-xxl-3 col-xl-4 col-lg-5 col-md-6 col-sm-12 my-auto">
					<button mat-flat-button class="large w-100 mat-green-button mb-2" (click)="onAddScreeningRequest()">
						Add Criminal Record Check
					</button>
				</div>
			</div>

			<div class="row mt-3" [formGroup]="formFilter">
				<div class="col-xl-8 col-lg-6 col-md-12 col-sm-12">
					<mat-form-field>
						<input matInput type="search" formControlName="search" placeholder="Search applicant's name or email" />
						<button mat-button matSuffix mat-flat-button aria-label="search" class="search-icon-button">
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
								<!-- <mat-icon
									class="error-icon"
									matTooltip="The screening request was not delivered:<br/> Lorem ipsum dolor sit amet, consectetur adipiscing elit"
									matTooltipClass="error-tooltip"
									matTooltipHideDelay="300000"
								>
									error
								</mat-icon> -->
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

						<ng-container matColumnDef="jobTitle">
							<mat-header-cell *matHeaderCellDef>Job Title</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Job Title:</span>
								??
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="paidBy">
							<mat-header-cell *matHeaderCellDef>To Be Paid By</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">To Be Paid By:</span>
								??
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="createdOn">
							<mat-header-cell *matHeaderCellDef>Date Request Sent</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Date Request Sent:</span>
								{{ application.createdOn | date : constants.date.dateFormat }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action">
							<mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<button
									mat-flat-button
									class="m-2"
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
					<mat-paginator #paginator [length]="100" [pageSize]="10" aria-label="Select page"> </mat-paginator>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.mat-column-action {
				min-width: 300px;
				justify-content: center !important;
			}

			.error-icon {
				cursor: pointer;
				color: var(--color-red);
				margin-right: 0.5rem;
			}

			/* .error-tooltip {
				border: 2px solid red;
				border-radius: 6px;

				.mdc-tooltip {
					&__surface {
						color: red !important;
						background-color: white !important;
						font-size: 0.9em !important;
					}
				}
			} */
		`,
	],
	encapsulation: ViewEncapsulation.None,
})
export class NewScreeningComponent implements OnInit {
	constants = SPD_CONSTANTS;
	dataSource!: MatTableDataSource<ApplicationResponse>;
	columns!: string[];
	formFilter: FormGroup = this.formBuilder.group({
		search: new FormControl(''),
	});

	@ViewChild(MatSort) sort!: MatSort;
	@ViewChild('paginator') paginator!: MatPaginator;

	constructor(
		protected utilService: UtilService,
		private formBuilder: FormBuilder,
		private dialog: MatDialog,
		private applicationService: ApplicationService,
		private authenticationService: AuthenticationService,
		private hotToast: HotToastService
	) {}

	ngOnInit() {
		this.columns = ['applicantName', 'emailAddress', 'jobTitle', 'paidBy', 'createdOn', 'action'];
		this.loadList();
	}

	onAddScreeningRequest(): void {
		this.dialog
			.open(NewScreeningModalComponent, {
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

	OnCancelRequest(application: ApplicationResponse) {
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Cancel request',
			message: `Are you sure you want to cancel the request for ${application.givenName} ${application.surname}?`,
			actionText: 'Yes, cancel request',
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

	private loadList(): void {
		this.applicationService
			.apiOrgsOrgIdApplicationsGet({ orgId: this.authenticationService.loggedInOrgId! })
			.pipe()
			.subscribe((res: ApplicationListResponse) => {
				this.dataSource = new MatTableDataSource<ApplicationResponse>([]);
				this.dataSource.data = res.applications as Array<ApplicationResponse>;
				this.dataSource.sort = this.sort;
				this.dataSource.paginator = this.paginator;
			});
	}
}
