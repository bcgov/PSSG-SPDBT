import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

// export interface RestraintAuthorizationDialogData {}

@Component({
	selector: 'app-update-add-restraints-modal',
	template: `
		<div mat-dialog-title>
			Add Request Authorization to use Restraints
			<mat-divider></mat-divider>
		</div>
		<div mat-dialog-content>
			<app-step-restraints-authorization [isCalledFromModal]="true"></app-step-restraints-authorization>
		</div>
		<div mat-dialog-actions>
			<div class="row m-0 w-100">
				<div class="col-lg-3 col-md-4 col-sm-12 mb-2">
					<button mat-stroked-button mat-dialog-close class="large" color="primary">Cancel</button>
				</div>
				<div class="offset-lg-6 col-lg-3 offset-md-4 col-md-4 col-sm-12 mb-2">
					<button mat-flat-button color="primary" class="large" (click)="onSave()">Save</button>
				</div>
			</div>
		</div>
	`,
	styles: [],
})
export class UpdateAddRestraintsModalComponent {
	constructor(
		private dialogRef: MatDialogRef<UpdateAddRestraintsModalComponent>,
		// private licenceApplicationService: LicenceApplicationService,
		// @Inject(MAT_DIALOG_DATA) public dialogData: RestraintAuthorizationDialogData
	) {}

	onSave(): void {
		this.dialogRef.close({ success: true });
	}
}
