import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LicenceApplicationService } from '../licence-application.service';

export interface DogAuthorizationDialogData {}

@Component({
	selector: 'app-update-add-dogs-modal',
	template: `
		<div mat-dialog-title>
			Add Request Authorization to use Dogs
			<mat-divider></mat-divider>
		</div>
		<div mat-dialog-content>
			<app-dogs-authorization [isCalledFromModal]="true"></app-dogs-authorization>
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
export class UpdateAddDogsModalComponent {
	constructor(
		private dialogRef: MatDialogRef<UpdateAddDogsModalComponent>,
		private licenceApplicationService: LicenceApplicationService,
		@Inject(MAT_DIALOG_DATA) public dialogData: DogAuthorizationDialogData
	) {}

	onSave(): void {
		this.dialogRef.close({ success: true });
	}
}
