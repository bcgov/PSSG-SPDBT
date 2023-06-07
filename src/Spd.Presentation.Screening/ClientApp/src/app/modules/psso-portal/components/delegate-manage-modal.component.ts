import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { HotToastService } from '@ngneat/hot-toast';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import { DelegateAddModalComponent } from './delegate-add-modal.component';

@Component({
	selector: 'app-delegate-manage-modal',
	template: `
		<div mat-dialog-title>Manage Delegates</div>
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
							<mat-cell *matCellDef="let delegate">
								<span class="mobile-label">Email:</span>
								{{ delegate.emailAddress }}
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
					<button mat-stroked-button mat-dialog-close class="large" color="primary">Cancel</button>
				</div>
				<div class="offset-md-4 col-md-4 col-sm-12 mb-2">
					<button mat-flat-button color="primary" class="large" (click)="onAddDelegate()">Add Delegate</button>
				</div>
			</div>
		</mat-dialog-actions>
	`,
	styles: [],
})
export class DelegateManageModalComponent {
	dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
	columns: string[] = ['applicantName', 'emailAddress', 'actions'];

	constructor(private dialog: MatDialog, private hotToast: HotToastService) {}

	onAddDelegate(): void {
		this.dialog
			.open(DelegateAddModalComponent, {
				width: '800px',
			})
			.afterClosed()
			.subscribe((resp) => {
				if (resp) {
					this.hotToast.success('Delegate was successfully added');
				}
			});
	}

	onRemoveDelegate(delegate: any): void {
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
				}
			});
	}
}
