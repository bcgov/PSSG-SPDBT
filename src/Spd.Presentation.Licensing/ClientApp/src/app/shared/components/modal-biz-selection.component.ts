import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BizListResponse } from '@app/api/models';

export interface BizSelectionDialogData {
	bizsList: Array<BizListResponse>;
}
@Component({
	selector: 'app-modal-biz-selection',
	template: `
		<div mat-dialog-title class="mat-dialog-title">{{ title }}</div>
		<mat-divider></mat-divider>
		<mat-dialog-content class="mat-dialog-content">
		  @for (bizItem of bizsList; track bizItem; let i = $index) {
		    <button
		      mat-stroked-button
		      color="primary"
		      class="large my-2"
		      aria-label="Click on a business to select it and close the popup"
		      (click)="onSelectBiz(bizItem)"
		      >
		      {{ bizItem.bizName ?? bizItem.bizLegalName }}
		    </button>
		  }
		</mat-dialog-content>
		`,
	styles: [],
	standalone: false,
})
export class ModalBizSelectionComponent implements OnInit {
	bizsList: Array<BizListResponse> = [];
	title = 'Business Selection';

	constructor(
		private dialogRef: MatDialogRef<ModalBizSelectionComponent>,
		@Inject(MAT_DIALOG_DATA) public dialogData: BizSelectionDialogData
	) {}

	ngOnInit(): void {
		const businessList = this.dialogData.bizsList;
		businessList.sort((a: BizListResponse, b: BizListResponse) => {
			const a1 = (a.bizName ?? a.bizLegalName)?.toUpperCase() ?? '';
			const b1 = (b.bizName ?? b.bizLegalName)?.toUpperCase() ?? '';
			return a1.localeCompare(b1);
		});
		this.bizsList = businessList;
	}

	onSelectBiz(bizItem: BizListResponse) {
		this.dialogRef.close(bizItem);
	}
}
