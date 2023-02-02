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
		<h2 mat-dialog-title class="d-flex align-items-stretch mt-2 mb-3">
			<mat-icon *ngIf="data.icon" [color]="data.type">{{ data.icon }}</mat-icon>

			<span class="flex-grow-1">
				{{ data.title }}
			</span>
		</h2>
		<mat-dialog-content>
			<div [ngStyle]="{ 'word-break': 'break-word' }" [innerHTML]="data.message"></div>
			<ng-template appDialogContent></ng-template>
		</mat-dialog-content>
		<mat-dialog-actions>
			<button mat-stroked-button [mat-dialog-close]="false" cdkFocusInitial class="my-2">
				{{ data.cancelText }}
			</button>
			<button *ngIf="data.actionText" mat-flat-button [color]="data.type" class="my-2">
				{{ data.actionText }}
			</button>
		</mat-dialog-actions>
	`,
	styles: [
		`
			h2 {
				color: var(--color-primary) !important;
				.mat-icon {
					font-size: 3rem;
				}

				.mat-icon {
					margin-right: 15px;
					width: 50px;
					height: 50px;
				}

				span {
					border-bottom: 1px solid var(--color-grey-light);
					font-size: 1.75rem;
					line-height: 3rem;
				}
			}

			p {
				color: var(--color-primary);
			}
			.mdc-dialog__actions {
				padding: 10px 24px 10px 24px;
			}
			.mat-mdc-dialog-container .mdc-dialog__content {
				color: var(--color-primary) !important;
			}

			button.mdc-button {
				width: unset;
			}
		`,
	],
})
export class DialogComponent {
	constructor(public dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogOptions) {}
}
