import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserInfo } from 'src/app/api/models';

export interface ApplyNameChangeDialogData {}
@Component({
	selector: 'app-apply-name-change-modal',
	template: `
		<div mat-dialog-title>Apply Name Change</div>
		<mat-divider></mat-divider>
		<mat-dialog-content>
			<div class="mb-2">Your licence will be updated with your new name:</div>
			<div><b>New name:</b> Joanna Lee</div>
			<div><b>Previous name:</b> Joanna Lee Smith</div>
		</mat-dialog-content>
		<mat-dialog-actions>
			<div class="row m-0 w-100">
				<div class="col-lg-3 col-md-4 col-sm-12 mb-2">
					<button mat-stroked-button mat-dialog-close class="large" color="primary">Cancel</button>
				</div>
				<div class="offset-lg-6 col-lg-3 offset-md-4 col-md-4 col-sm-12 mb-2">
					<button mat-flat-button color="primary" class="large" (click)="onSave()">Save</button>
				</div>
			</div>
		</mat-dialog-actions>
	`,
	styles: [],
})
export class ApplyNameChangeModalComponent implements OnInit {
	selectedOrg: any = null;
	userInfos: Array<UserInfo> = [];
	title: string = 'Organization selection';

	constructor(
		private dialogRef: MatDialogRef<ApplyNameChangeModalComponent>,
		@Inject(MAT_DIALOG_DATA) public dialogData: ApplyNameChangeDialogData
	) {}

	ngOnInit(): void {
		// const infos = this.dialogData.userInfos;
		// this.userInfos = infos;
	}

	onSave() {
		this.dialogRef.close();
	}
}
