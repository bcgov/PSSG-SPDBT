import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogOptions {
	icon?: string | null;
	title?: string;
	message?: string;
	type?: 'primary' | 'accent' | 'warn' | string;
	cancelText?: string;
	altOptionText?: string;
	actionText?: string;
	data?: { [key: string]: any };
}

@Component({
	selector: 'app-spd-dialog',
	template: `
		<h2 mat-dialog-title>
			<mat-icon class="title-icon" *ngIf="data.icon">{{ data.icon }}</mat-icon> {{ data.title }}
		</h2>
		<mat-dialog-content class="mt-3">
			<div [ngStyle]="{ 'word-break': 'break-word' }" [innerHTML]="data.message"></div>
		</mat-dialog-content>
		<mat-dialog-actions align="end">
			<button mat-button mat-dialog-close>{{ data.actionText }}</button>
		</mat-dialog-actions>
	`,
	styles: [
		`
			button.mdc-button {
				width: unset;
			}

			.title-icon {
				vertical-align: middle;
				font-size: 30px;
				height: 30px;
				width: 30px;
			}

			.mdc-dialog__title {
				background-color: lightgray;
			}
		`,
	],
})
export class DialogComponent {
	constructor(public dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogOptions) {}
}
