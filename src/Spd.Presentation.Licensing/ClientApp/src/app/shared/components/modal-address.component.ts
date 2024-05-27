import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AddressFindResponse } from '@app/api/models';

export interface AddressDialogData {
	addressAutocompleteFields: AddressFindResponse[];
}

@Component({
	selector: 'app-modal-address',
	template: `
		<div mat-dialog-title class="mat-dialog-title">{{ title }}</div>
		<mat-dialog-content class="mat-dialog-content">
			<div class="row">
				<div class="col-12">
					<mat-table
						matSort
						[dataSource]="dataSource"
						matSortActive="status"
						matSortDirection="asc"
						style="max-height: 70vh;"
					>
						<ng-container matColumnDef="addrDescription">
							<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef mat-sort-header>Address</mat-header-cell>
							<mat-cell *matCellDef="let addr">
								<span class="mobile-label">Address: </span>
								{{ addr.text }} {{ addr.description }}
							</mat-cell>
						</ng-container>

						<mat-header-row *matHeaderRowDef="columns; sticky: true"></mat-header-row>
						<mat-row class="mat-data-row" *matRowDef="let row; columns: columns" (click)="onRowClick(row)"></mat-row>
					</mat-table>
				</div>
			</div>
		</mat-dialog-content>
		<mat-dialog-actions>
			<div class="row m-0 mt-4 w-100">
				<div class="col-md-4 col-sm-12 mb-2">
					<button mat-stroked-button mat-dialog-close color="primary">Cancel</button>
				</div>
			</div>
		</mat-dialog-actions>
	`,
	styles: [],
})
export class ModalAddressComponent implements OnInit {
	dataSource!: MatTableDataSource<any>;
	columns!: string[];
	title = 'Address selection';

	constructor(
		private dialogRef: MatDialogRef<ModalAddressComponent>,
		@Inject(MAT_DIALOG_DATA) public dialogData: AddressDialogData
	) {}

	ngOnInit() {
		this.columns = ['addrDescription'];
		this.dataSource = new MatTableDataSource<any>([]);
		this.dataSource.data = this.dialogData.addressAutocompleteFields;
	}

	onRowClick(row: any) {
		this.dialogRef.close({
			data: row,
		});
	}
}
