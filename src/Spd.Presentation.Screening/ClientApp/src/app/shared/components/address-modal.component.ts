import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AddressFindResponse } from 'src/app/api/models';

export interface AddressDialogData {
	addressAutocompleteFields: AddressFindResponse[];
}

@Component({
	selector: 'app-address-modal',
	template: `
		<div mat-dialog-title>{{ title }}</div>
		<mat-dialog-content>
			<div class="row">
				<div class="col-12">
					<mat-table
						matSort
						[dataSource]="dataSource"
						matSortActive="status"
						matSortDirection="asc"
						class="isMobile"
						style="max-height: 70vh;"
					>
						<ng-container matColumnDef="addrDescription">
							<mat-header-cell *matHeaderCellDef mat-sort-header>Address</mat-header-cell>
							<mat-cell *matCellDef="let addr">
								<span class="mobile-label">Address: </span>
								{{ addr.text }} {{ addr.description }}
							</mat-cell>
						</ng-container>

						<mat-header-row *matHeaderRowDef="columns; sticky: true"></mat-header-row>
						<mat-row *matRowDef="let row; columns: columns" (click)="onRowClick(row)"></mat-row>
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
export class AddressModalComponent {
	dataSource!: MatTableDataSource<any>;
	columns!: string[];
	title: string = 'Address Selection';

	constructor(
		private dialogRef: MatDialogRef<AddressModalComponent>,
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
