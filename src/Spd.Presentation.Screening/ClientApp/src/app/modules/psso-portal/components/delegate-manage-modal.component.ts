import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { HotToastService } from '@ngxpert/hot-toast';
import { DelegateListResponse, DelegateResponse, PssoUserRoleEnum } from 'src/app/api/models';
import { DelegateService } from 'src/app/api/services';
import { AuthUserIdirService } from 'src/app/core/services/auth-user-idir.service';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import { ScreeningStatusResponse } from 'src/app/shared/components/screening-statuses-common.component';
import { DelegateAddModalComponent, DelegateDialogData } from './delegate-add-modal.component';

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
					<mat-table [dataSource]="dataSource">
						<ng-container matColumnDef="name">
							<mat-header-cell *matHeaderCellDef>Name</mat-header-cell>
							<mat-cell *matCellDef="let delegate">
								<span class="mobile-label">Name:</span>
								{{ delegate | fullname }}
								<mat-icon
									class="initiator-icon"
									matTooltip="Initiator"
									*ngIf="delegate.pssoUserRoleCode === initiatorCode"
								>
									emergency
								</mat-icon>
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
								<button
									mat-flat-button
									(click)="onRemoveDelegate(delegate)"
									class="m-2"
									style="color: var(--color-primary-light);"
									aria-label="Remove delegate"
									*ngIf="isAllowDelegateDelete(delegate)"
								>
									<mat-icon>delete_outline</mat-icon>Remove
								</button>
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
				<div class="offset-md-4 col-md-4 col-sm-12 mb-2">
					<button mat-flat-button color="primary" class="large" (click)="onAddDelegate()" *ngIf="isAllowDelegateAdd()">
						Add Delegate
					</button>
				</div>
			</div>
		</mat-dialog-actions>
	`,
	styles: [
		`
			.initiator-icon {
				cursor: pointer;
				font-size: small;
				color: var(--color-primary-light);
				margin-left: 0.2rem;
			}
		`,
	],
})
export class DelegateManageModalComponent implements OnInit {
	dataSource: MatTableDataSource<DelegateResponse> = new MatTableDataSource<DelegateResponse>([]);
	columns: string[] = ['name', 'emailAddress', 'actions'];

	isInitiator = false;
	initiatorCode = PssoUserRoleEnum.Initiator;

	constructor(
		private delegateService: DelegateService,
		private dialog: MatDialog,
		private hotToast: HotToastService,
		private authUserService: AuthUserIdirService,
		@Inject(MAT_DIALOG_DATA) public data: DelegateManageDialogData
	) {}

	ngOnInit(): void {
		this.loadList();
	}

	onAddDelegate(): void {
		const dialogOptions: DelegateDialogData = {
			applicationId: this.data.application.id!,
			orgId: this.data.application.orgId!,
		};

		this.dialog
			.open(DelegateAddModalComponent, {
				data: dialogOptions,
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

		// Initiator or PSA can remove anyone
		if (this.isInitiator || this.authUserService.idirUserWhoamiProfile?.isPSA) return true;

		// User can only remove themselves
		const currentUserId = this.authUserService.idirUserWhoamiProfile?.userId;
		return !!currentUserId && delegate.portalUserId == currentUserId;
	}

	isAllowDelegateAdd(): boolean {
		const delegates = this.dataSource.data;

		// A screening can only have 4 delegates plus the Initiator
		const numberOfDelegates = delegates.filter((item) => item.pssoUserRoleCode == PssoUserRoleEnum.Delegate).length;
		return numberOfDelegates < 4;
	}

	onRemoveDelegate(delegate: DelegateResponse): void {
		let message = `Are you sure you want to remove '${delegate.firstName} ${delegate.lastName}' from this screening?`;

		// User can only remove themselves
		const userId = this.authUserService.idirUserWhoamiProfile?.userId;
		if (!!userId && delegate.portalUserId == userId) {
			message = 'Are you sure you want to remove this screening from your list?';
		}

		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message,
			actionText: 'Yes',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.delegateService
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
		this.delegateService
			.apiOrgsOrgIdApplicationApplicationIdDelegatesGet({
				applicationId: this.data.application.id!,
				orgId: this.data.application.orgId!,
			})
			.pipe()
			.subscribe((res: DelegateListResponse) => {
				const delegates = res.delegates ?? [];
				this.dataSource.data = delegates;

				const currentUserId = this.authUserService.idirUserWhoamiProfile?.userId;
				this.isInitiator = !!delegates.find(
					(item) => item.portalUserId == currentUserId && item.pssoUserRoleCode == PssoUserRoleEnum.Initiator
				);
			});
	}
}
