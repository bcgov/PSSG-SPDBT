import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HotToastService } from '@ngneat/hot-toast';
import { ApplicationListResponse, ApplicationResponse, OrgUserResponse } from 'src/app/api/models';
import { ApplicationService } from 'src/app/api/services';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { UtilService } from 'src/app/core/services/util.service';
import { NewScreeningDialogData, NewScreeningModalComponent } from './new-screening-modal.component';

@Component({
	selector: 'app-new-screening',
	template: `
		<app-dashboard-header subtitle="Security Screening Portal"></app-dashboard-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-xxl-9 col-xl-8 col-lg-7 col-md-6 col-sm-12">
					<h2 class="mb-2 fw-normal">
						Screening Requests
						<div class="mt-2 fs-5 fw-light">View active screening requests</div>
					</h2>
				</div>
				<div class="col-xxl-3 col-xl-4 col-lg-5 col-md-6 col-sm-12 my-auto">
					<button mat-raised-button class="large w-100 mat-green-button mb-2" (click)="onAddScreeningRequest()">
						Add Screening Request
					</button>
				</div>
			</div>

			<div class="row mt-3" [formGroup]="formFilter">
				<div class="col-xl-8 col-lg-6 col-md-12 col-sm-12">
					<mat-form-field>
						<input matInput type="search" formControlName="search" placeholder="Search applicant's name or email" />
						<button
							mat-button
							matSuffix
							mat-raised-button
							color="primary"
							aria-label="search"
							style="padding: 2.1em 0; border-radius: unset;"
						>
							<mat-icon style="top: 8px;font-size: 2.2em;width: 40px;height: 40px;left: 8px;">search</mat-icon>
						</button>
					</mat-form-field>
				</div>
			</div>

			<div class="row">
				<div class="col-12">
					<mat-table
						matSort
						[dataSource]="dataSource"
						matSortActive="createdOn"
						matSortDirection="desc"
						class="isMobile"
					>
						<ng-container matColumnDef="applicantName">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Applicant Name</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Applicant Name:</span>
								{{ utilService.getFullName(application.givenName, application.surname) }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="emailAddress">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Email</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Email:</span>
								{{ application.emailAddress }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="jobTitle">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Job Title</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Job Title:</span>
								??
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="paidBy">
							<mat-header-cell *matHeaderCellDef mat-sort-header>To Be Paid By</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">To Be Paid By:</span>
								??
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="createdOn">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Date Sent</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Date Sent:</span>
								{{ application.createdOn | date : constants.date.dateFormat }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="action">
							<mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<button
									mat-flat-button
									class="m-2"
									style="color: var(--color-red); white-space: nowrap;"
									aria-label="Cancel Request"
								>
									<mat-icon>clear</mat-icon>Cancel Request
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
		`,
	],
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
		private hotToast: HotToastService
	) {}

	ngOnInit() {
		this.columns = ['applicantName', 'emailAddress', 'jobTitle', 'paidBy', 'createdOn', 'action'];
		this.loadList();
	}

	private loadList(): void {
		//TODO replace with proper org id
		this.applicationService
			.apiOrgsOrgIdApplicationsGet({ orgId: '4165bdfe-7cb4-ed11-b83e-00505683fbf4' })
			.pipe()
			.subscribe((res: ApplicationListResponse) => {
				this.dataSource = new MatTableDataSource<ApplicationResponse>([]);
				this.dataSource.data = res.applications as Array<ApplicationResponse>;
				this.dataSource.sort = this.sort;
				this.dataSource.paginator = this.paginator;
			});
	}

	onAddScreeningRequest(): void {
		const newUser: OrgUserResponse = {};
		const dialogOptions: NewScreeningDialogData = {
			user: newUser,
			isAllowedPrimary: false,
		};

		this.dialog
			.open(NewScreeningModalComponent, {
				width: '1300px',
				data: dialogOptions,
			})
			.afterClosed()
			.subscribe((resp) => {
				if (resp.success) {
					this.hotToast.success(resp.message);
				}
			});
	}
}
