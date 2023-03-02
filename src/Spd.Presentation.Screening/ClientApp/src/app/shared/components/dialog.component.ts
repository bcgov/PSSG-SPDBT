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
		<h2 mat-dialog-title class="mt-4">
			<mat-icon *ngIf="data.icon" [color]="data.type">{{ data.icon }}</mat-icon>
			<strong *ngIf="data.title" style="position: relative; top: -10px;">
				{{ data.title }}
			</strong>
		</h2>

		<mat-dialog-content>
			<p [ngStyle]="{ 'word-break': 'break-word' }" [innerHTML]="data.message"></p>
			<ng-template appDialogContent></ng-template>
		</mat-dialog-content>

		<mat-dialog-actions>
			<button
				*ngIf="data.cancelText"
				mat-stroked-button
				color="primary"
				[mat-dialog-close]="false"
				cdkFocusInitial
				class="my-2 me-2"
			>
				{{ data.cancelText }}
			</button>
			<span class="flex-grow-1"></span>
			<button *ngIf="data.actionText" mat-flat-button color="primary" (click)="onConfirm()" class="my-2 me-1">
				{{ data.actionText }}
			</button>
		</mat-dialog-actions>
	`,
	styles: [
		`
			h2 {
				color: var(--color-primary) !important;
				font-weight: 600 !important;
				line-height: 2em !important;
			}

			.mat-icon {
				font-size: 30px;
				margin-right: 10px;
				width: 30px;
				height: 30px;
			}

			p {
				color: var(--color-grey-dark);
			}

			a {
				color: var(--color-primary-light);
				text-decoration: underline;
			}

			button.mdc-button {
				width: unset;
			}
		`,
	],
})
export class DialogComponent {
	constructor(public dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogOptions) {}

	public onConfirm(): void {
		this.dialogRef.close(true);
	}
}
