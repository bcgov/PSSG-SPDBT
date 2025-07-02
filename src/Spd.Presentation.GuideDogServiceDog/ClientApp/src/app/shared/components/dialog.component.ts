import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogOptions {
	icon?: string | null;
	title?: string;
	message?: string;
	type?: 'primary' | 'accent' | 'warn' | string;
	cancelText?: string;
	actionText?: string;
	wideButtons?: boolean;
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
		@if (data.icon || data.title) {
		  <h2 mat-dialog-title class="mat-dialog-title" class="mt-4">
		    @if (data.icon) {
		      <mat-icon [color]="data.type">{{ data.icon }}</mat-icon>
		    }
		    @if (data.title) {
		      <strong style="position: relative; top: -7px;">
		        {{ data.title }}
		      </strong>
		    }
		  </h2>
		}
		
		<mat-dialog-content class="mat-dialog-content">
		  <p [ngStyle]="{ 'word-break': 'break-word' }" [innerHTML]="data.message"></p>
		  <ng-template appDialogContent></ng-template>
		</mat-dialog-content>
		
		<mat-dialog-actions>
		  <div class="row m-0 p-0 w-100 mt-2">
		    <div class="col-sm-12 mb-2" [ngClass]="data.wideButtons ? 'col-md-6' : 'col-md-4'">
		      @if (data.cancelText) {
		        <button mat-stroked-button color="primary" class="large" [mat-dialog-close]="false">
		          {{ data.cancelText }}
		        </button>
		      }
		    </div>
		    <div class="col-sm-12 mb-2" [ngClass]="data.wideButtons ? 'col-md-6' : 'offset-md-4 col-md-4'">
		      @if (data.actionText) {
		        <button mat-flat-button color="primary" class="large" (click)="onConfirm()">
		          {{ data.actionText }}
		        </button>
		      }
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
    standalone: false
})
export class DialogComponent {
	constructor(public dialogRef: MatDialogRef<DialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogOptions) {}

	public onConfirm(): void {
		this.dialogRef.close(true);
	}
}
