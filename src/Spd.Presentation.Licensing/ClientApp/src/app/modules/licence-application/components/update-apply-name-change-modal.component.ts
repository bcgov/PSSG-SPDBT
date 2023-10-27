import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ApplyNameChangeDialogData {}
@Component({
	selector: 'app-update-apply-name-change-modal',
	template: `
		<div mat-dialog-title>Apply Name Change <mat-divider></mat-divider></div>
		<mat-dialog-content>
			<div class="mb-2">Your licence will be updated with your new name:</div>
			<div class="row">
				<div class="col-md-6 col-sm-12">
					<div class="text-label d-block text-muted mt-2 mt-lg-0">New Name</div>
					<div class="text-data">Joanna Lee</div>
				</div>
				<div class="col-md-6 col-sm-12">
					<div class="text-label d-block text-muted mt-2 mt-lg-0">Previous Name</div>
					<div class="text-data">Joanna Lee Smith</div>
				</div>

				<!-- <div class="col-md-6 col-sm-12">Joanna Lee</div>
				<div class="col-md-6 col-sm-12"><b>Previous name:</b></div>
				<div class="col-md-6 col-sm-12">Joanna Lee Smith</div> -->
			</div>
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
	styles: [
		`
			.text-data {
				font-size: 1.05rem;
				font-weight: 400;
				line-height: 1.3em;
			}

			.text-label {
				font-size: 0.8rem !important;
			}
		`,
	],
})
export class UpdateApplyNameChangeModalComponent implements OnInit {
	selectedOrg: any = null;
	userInfos: Array<any> = [];
	title: string = 'Organization selection';

	constructor(
		private dialogRef: MatDialogRef<UpdateApplyNameChangeModalComponent>,
		@Inject(MAT_DIALOG_DATA) public dialogData: ApplyNameChangeDialogData
	) {}

	ngOnInit(): void {
		// const infos = this.dialogData.userInfos;
		// this.userInfos = infos;
	}

	onSave() {
		this.dialogRef.close({ success: true });
	}
}
