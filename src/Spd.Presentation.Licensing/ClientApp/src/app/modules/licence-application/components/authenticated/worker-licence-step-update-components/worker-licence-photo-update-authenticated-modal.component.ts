import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

// export interface UpdatePhotoDialogData {}

@Component({
	selector: 'app-worker-licence-photo-update-authenticated-modal',
	template: `
		<div mat-dialog-title>
			Update your Photo
			<mat-divider class="mat-divider-main mt-2 mb-3"></mat-divider>
		</div>
		<div mat-dialog-content>
			<div class="row mb-3" *ngIf="photographOfYourself">
				<div class="col-12 text-center">
					<div class="fs-5 mb-2">Current photo:</div>
					<img [src]="photographOfYourself" alt="Photograph of yourself" style="max-height: 200px;max-width: 200px;" />
				</div>
			</div>

			<app-step-worker-licence-photograph-of-yourself
				[isCalledFromModal]="true"
			></app-step-worker-licence-photograph-of-yourself>
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
export class WorkerLicencePhotoUpdateAuthenticatedModalComponent {
	photographOfYourself = ''; // TODO show photo for update/authenticated

	constructor(
		private dialogRef: MatDialogRef<WorkerLicencePhotoUpdateAuthenticatedModalComponent> // @Inject(MAT_DIALOG_DATA) public dialogData: UpdatePhotoDialogData
	) {}

	onSave(): void {
		this.dialogRef.close({ success: true });
	}
}
