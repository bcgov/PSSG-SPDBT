import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-crrp-first-time-terms-and-conds-modal',
	template: `
		<div mat-dialog-title>Terms and Conditions</div>
		<mat-divider></mat-divider>
		<mat-dialog-content>
			<p>Read, download, and accept the Terms of Use to continue.</p>

			<app-common-terms-and-conds (isSuccess)="onIsSuccess()"></app-common-terms-and-conds>
		</mat-dialog-content>
	`,
	styles: [],
})
export class CrrpFirstTimeTermsAndCondsModalComponent {
	constructor(private dialogRef: MatDialogRef<CrrpFirstTimeTermsAndCondsModalComponent>) {}

	onIsSuccess(): void {
		this.dialogRef.close();
	}
}
