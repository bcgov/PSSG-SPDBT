import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ApplyNameChangeDialogData {
	cardHolderName: string;
	licenceHolderName: string;
}

@Component({
	selector: 'app-worker-licence-name-change-update-authenticated-modal',
	template: `
		<div mat-dialog-title>Review Name Change <mat-divider class="mat-divider-main mt-2 mb-3"></mat-divider></div>
		<mat-dialog-content>
			<div class="mb-2">Your licence will be updated with your new name:</div>
			<div class="row">
				<div class="col-md-6 col-sm-12">
					<div class="text-label d-block text-muted">New Name</div>
					<div class="summary-text-data">{{ dialogData.licenceHolderName }}</div>
				</div>
				<div class="col-md-6 col-sm-12">
					<div class="text-label d-block text-muted">Previous Name</div>
					<div class="summary-text-data">{{ dialogData.cardHolderName }}</div>
				</div>
			</div>
		</mat-dialog-content>
		<mat-dialog-actions>
			<div class="row m-0 w-100">
				<div class="offset-lg-9 col-lg-3 offset-md-8 col-md-4 col-sm-12 mb-2">
					<button mat-flat-button mat-dialog-close class="large" color="primary">Close</button>
				</div>
			</div>
		</mat-dialog-actions>
	`,
	styles: [
		`
			.summary-text-data {
				line-height: 1.3em;
			}
		`,
	],
})
export class WorkerLicenceNameChangeUpdateAuthenticatedModalComponent {
	selectedOrg: any = null;
	userInfos: Array<any> = [];
	title = 'Organization selection';

	constructor(
		private dialogRef: MatDialogRef<WorkerLicenceNameChangeUpdateAuthenticatedModalComponent>,
		@Inject(MAT_DIALOG_DATA) public dialogData: ApplyNameChangeDialogData
	) {}

	onSave() {
		this.dialogRef.close({ success: true });
	}
}
