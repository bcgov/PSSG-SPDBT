import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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

export enum DialogCloseCode {
	Action = 'Action',
	AltAction = 'AltAction',
	Cancel = 'Cancel',
}

@Component({
	selector: 'app-spd-dialog',
	template: `
		<h2 mat-dialog-title class="mat-dialog-title" class="mt-4" *ngIf="data.icon || data.title">
			<mat-icon *ngIf="data.icon" [color]="data.type">{{ data.icon }}</mat-icon>
			<strong *ngIf="data.title" style="position: relative; top: -7px;">
				{{ data.title }}
			</strong>
		</h2>

		<mat-dialog-content class="mat-dialog-content">
			<p [ngStyle]="{ 'word-break': 'break-word' }" [innerHTML]="data.message"></p>
			<ng-template appDialogContent></ng-template>
		</mat-dialog-content>

		<mat-dialog-actions>
			<div class="row m-0 p-0 w-100 mt-2">
				<div class="col-md-4 col-sm-12 mb-2">
					<button *ngIf="data.cancelText" mat-stroked-button color="primary" class="large" [mat-dialog-close]="false">
						{{ data.cancelText }}
					</button>
				</div>
				<div class="offset-md-1 col-md-3 col-sm-12 mb-2">
					<button *ngIf="data.altOptionText" mat-flat-button color="primary" class="large" (click)="onAltConfirm()">
						{{ data.altOptionText }}
					</button>
				</div>
				<div class="col-md-4 col-sm-12 mb-2">
					<button *ngIf="data.actionText" mat-flat-button color="primary" class="large" (click)="onConfirm()">
						{{ data.actionText }}
					</button>
				</div>
			</div>
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
		`,
	],
})
export class DialogComponent {
	constructor(public dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogOptions) {}

	public onConfirm(): void {
		this.dialogRef.close(this.data.altOptionText ? DialogCloseCode.Action : true);
	}
	public onAltConfirm(): void {
		this.dialogRef.close(DialogCloseCode.AltAction);
	}
}
