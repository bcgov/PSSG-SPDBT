import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { HotToastService } from '@ngneat/hot-toast';
import { DelegateResponse } from 'src/app/api/models';
import { ApplicationService } from 'src/app/api/services';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import { ScreeningStatusResponse } from 'src/app/shared/components/screening-statuses-common.component';
import { DelegateAddModalComponent } from './delegate-add-modal.component';

export interface DelegateManageDialogData {
	application: ScreeningStatusResponse;
}
@Component({
	selector: 'app-delegate-manage-modal',
	template: `
		<div mat-dialog-title>Manage Delegates for {{ data.application.applicationNumber }}</div>
		<mat-dialog-content>
			<div class="row">
				<div class="col-12">
					<mat-table [dataSource]="dataSource" matSort matSortActive="createdOn" matSortDirection="desc">
						<ng-container matColumnDef="applicantName">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Applicant Name</mat-header-cell>
							<mat-cell *matCellDef="let delegate">
								<span class="mobile-label">Applicant Name:</span>
								{{ delegate | fullname }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="emailAddress">
							<mat-header-cell *matHeaderCellDef>Email</mat-header-cell>
							<mat-cell class="mat-cell-email" *matCellDef="let delegate">
								<span class="mobile-label">Email:</span>
								{{ delegate.emailAddress | default }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="actions">
							<mat-header-cell *matHeaderCellDef></mat-header-cell>
							<mat-cell *matCellDef="let delegate">
								<span class="mobile-label"></span>
								<a
									mat-flat-button
									(click)="onRemoveDelegate(delegate)"
									class="m-2"
									style="color: var(--color-primary-light);"
									aria-label="Remove delegate"
									*ngIf="isAllowDelegateDelete(delegate)"
								>
									<mat-icon>delete_outline</mat-icon>Remove
								</a>
							</mat-cell>
						</ng-container>

						<mat-header-row *matHeaderRowDef="columns; sticky: true"></mat-header-row>
						<mat-row *matRowDef="let row; columns: columns"></mat-row>
					</mat-table>
				</div>
			</div>
		</mat-dialog-content>
		<mat-dialog-actions>
			<div class="row m-0 w-100">
				<div class="col-md-4 col-sm-12 mb-2">
					<button mat-stroked-button mat-dialog-close class="large" color="primary">Close</button>
				</div>
				<div class="offset-md-4 col-md-4 col-sm-12 mb-2" *ngIf="isAllowDelegateAdd">
					<button mat-flat-button color="primary" class="large" (click)="onAddDelegate()">Add Delegate</button>
				</div>
			</div>
		</mat-dialog-actions>
	`,
	styles: [],
})
export class DelegateManageModalComponent implements OnInit {
	dataSource: MatTableDataSource<DelegateResponse> = new MatTableDataSource<DelegateResponse>([]);
	columns: string[] = ['applicantName', 'emailAddress', 'actions'];

	constructor(
		private applicationService: ApplicationService,
		private dialog: MatDialog,
		private hotToast: HotToastService,
		@Inject(MAT_DIALOG_DATA) public data: DelegateManageDialogData
	) {}

	ngOnInit(): void {
		this.loadList();
	}

	onAddDelegate(): void {
		this.dialog
			.open(DelegateAddModalComponent, {
				width: '800px',
			})
			.afterClosed()
			.subscribe((resp) => {
				if (resp) {
					this.loadList();
				}
			});
	}

	isAllowDelegateDelete(delegate: DelegateResponse): boolean {
		const numberOfDelegates = this.dataSource.data.length;
		// A screening can't have 0 delegates
		if (numberOfDelegates <= 1) return false;

		// Hiring Manager can remove themselves from a screening as long as there is a delegate
		// A screening can't have no hiring manager/PSA recruiter
		// Delegates can remove themselves
		return true;
	}

	onRemoveDelegate(delegate: DelegateResponse): void {
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: 'Are you sure you want to remove this delegate?',
			actionText: 'Yes',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.applicationService
						.apiOrgsOrgIdApplicationApplicationIdDelegateDelegateIdDelete({
							delegateId: delegate.id!,
							applicationId: this.data.application.id!,
							orgId: this.data.application.orgId!,
						})
						.pipe()
						.subscribe(() => {
							this.hotToast.success('Delegate was successfully removed');
							this.loadList();
						});
				}
			});
	}

	private loadList(): void {
		this.applicationService
			.apiOrgsOrgIdApplicationApplicationIdDelegatesGet({
				applicationId: this.data.application.id!,
				orgId: this.data.application.orgId!,
			})
			.pipe()
			.subscribe((res: Array<DelegateResponse>) => {
				this.dataSource.data = res ?? [];
			});
	}

	get isAllowDelegateAdd(): boolean {
		// maximum of 4 delegates to be added to an application
		return this.dataSource.data.length < SPD_CONSTANTS.maxNumberOfDelegates;
	}
}
