import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UtilService } from 'src/app/core/services/util.service';
import { CaptchaResponse } from 'src/app/shared/components/captcha-v2.component';

export interface OrgRegDuplicateDialogData {
	title: string;
	message: string;
	actionText: string;
	cancelText: string;
	displayCaptcha: boolean;
}
export interface OrgRegDuplicateDialogResponse {
	success: boolean;
	captchaResponse: CaptchaResponse | null;
}

@Component({
	selector: 'app-org-registration-duplicate-modal',
	template: `
		<div mat-dialog-title>{{ dialogData.title }}</div>
		<mat-dialog-content>
			<p>{{ dialogData.message }}</p>

			<div *ngIf="dialogData.displayCaptcha">
				<app-captcha-v2 (captchaResponse)="onTokenResponse($event)"></app-captcha-v2>
				<mat-error class="mat-option-error" *ngIf="displayValidationErrors && !captchaPassed">
					This is required
				</mat-error>
			</div>
		</mat-dialog-content>
		<mat-dialog-actions>
			<div class="row m-0 p-0 w-100">
				<div class="col-md-5 col-sm-12 mb-2">
					<button mat-stroked-button color="primary" [mat-dialog-close]="false">
						{{ dialogData.cancelText }}
					</button>
				</div>
				<div class="offset-md-2 col-md-5 col-sm-12 mb-2">
					<button mat-flat-button color="primary" (click)="onConfirm()">
						{{ dialogData.actionText }}
					</button>
				</div>
			</div>
		</mat-dialog-actions>
	`,
	styles: [],
})
export class OrgRegDuplicateModalComponent {
	displayValidationErrors = false;
	captchaPassed = false;
	captchaResponse: CaptchaResponse | null = null;

	constructor(
		private utilService: UtilService,
		private dialogRef: MatDialogRef<OrgRegDuplicateModalComponent>,
		@Inject(MAT_DIALOG_DATA) public dialogData: OrgRegDuplicateDialogData
	) {}

	onTokenResponse($event: CaptchaResponse) {
		this.captchaResponse = $event;
		this.captchaPassed = this.utilService.captchaTokenResponse($event);
	}

	onConfirm(): void {
		this.displayValidationErrors = false;
		if (this.dialogData.displayCaptcha && !this.captchaPassed) {
			this.displayValidationErrors = true;
			return;
		}

		this.dialogRef.close({
			success: true,
			captchaResponse: this.captchaResponse,
		} as OrgRegDuplicateDialogResponse);
	}
}
