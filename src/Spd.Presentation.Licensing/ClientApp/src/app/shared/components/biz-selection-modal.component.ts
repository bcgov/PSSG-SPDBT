import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BizListResponse } from 'src/app/api/models';

export interface BizSelectionDialogData {
	bizsList: Array<BizListResponse>;
}
@Component({
	selector: 'app-biz-selection-modal',
	template: `
		<div mat-dialog-title class="mat-dialog-title">{{ title }}</div>
		<mat-divider></mat-divider>
		<mat-dialog-content class="mat-dialog-content">
			<ng-container *ngFor="let bizItem of bizsList; let i = index">
				<button mat-stroked-button color="primary" class="large my-2" (click)="onSelectBiz(bizItem)">
					{{ bizItem.bizLegalName ?? bizItem.bizName }}
				</button>
			</ng-container>
		</mat-dialog-content>
	`,
	styles: [],
})
export class BizSelectionModalComponent implements OnInit {
	bizsList: Array<BizListResponse> = [];
	title = 'Business selection';

	constructor(
		private dialogRef: MatDialogRef<BizSelectionModalComponent>,
		@Inject(MAT_DIALOG_DATA) public dialogData: BizSelectionDialogData
	) {}

	ngOnInit(): void {
		const businessList = this.dialogData.bizsList;
		businessList.sort((a: BizListResponse, b: BizListResponse) => {
			const a1 = (a.bizLegalName ?? a.bizName)?.toUpperCase() ?? '';
			const b1 = (b.bizLegalName ?? b.bizName)?.toUpperCase() ?? '';
			return a1.localeCompare(b1);
		});
		this.bizsList = businessList;
	}

	onSelectBiz(bizItem: BizListResponse) {
		this.dialogRef.close({ ...bizItem });
	}
}
