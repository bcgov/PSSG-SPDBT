import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-crrp-org-first-time-terms-and-conds',
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
export class CrrpOrgFirstTimeTermsAndCondsComponent {
	constructor(private dialogRef: MatDialogRef<CrrpOrgFirstTimeTermsAndCondsComponent>) {}

	onIsSuccess(): void {
		this.dialogRef.close();
	}
}
