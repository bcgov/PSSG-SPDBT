import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigService } from 'src/app/core/services/config.service';

export interface DialogOopsOptions {
	message?: string;
	is400Error: boolean;
}

@Component({
	selector: 'app-spd-dialog-oops',
	template: `
		<mat-dialog-content>
			<ng-container *ngIf="!is400Error">
				<div class="d-flex justify-content-center">
					<img
						class="error-image"
						src="./assets/something-went-wrong.png"
						(error)="onHandleMissingImage($event)"
						alt="Something went wrong"
					/>
				</div>
				<h2 class="mt-2">Oops! Something went wrong</h2>
				<p>Looks like something went wrong on our end. Please try again or contact SPD at 1-855-587-0185 (option 2).</p>
			</ng-container>

			<p
				*ngIf="errorMessage"
				class="px-4 py-2 "
				[ngClass]="is400Error ? '' : 'error-message'"
				[ngStyle]="{ 'word-break': 'break-word' }"
				[innerHTML]="errorMessage"
			></p>

			<ng-template appDialogContent></ng-template>
		</mat-dialog-content>

		<mat-dialog-actions>
			<div class="row m-0 p-0 w-100 mt-2">
				<div class="col-md-3 col-sm-12 mb-2">
					<button mat-stroked-button color="primary" class="large" [mat-dialog-close]="false">Close</button>
				</div>
			</div>
		</mat-dialog-actions>
	`,
	styles: [
		`
			h2 {
				color: var(--color-primary) !important;
				font-weight: 600 !important;
				line-height: 1.3em !important;
			}

			.error-image {
				max-width: 12.5em;
			}

			.error-message {
				background-color: var(--color-grey-lighter);
			}

			p {
				color: var(--color-grey-dark);
			}
		`,
	],
})
export class DialogOopsComponent implements OnInit {
	errorMessage: string | null | undefined = null;
	is400Error!: boolean;

	constructor(private configService: ConfigService, @Inject(MAT_DIALOG_DATA) public data: DialogOopsOptions) {}

	ngOnInit(): void {
		this.is400Error = this.data.is400Error ?? false;
		this.errorMessage = this.configService.isProduction() && !this.is400Error ? null : this.data.message;
	}

	public onHandleMissingImage(event: Event) {
		(event.target as HTMLImageElement).style.display = 'none';
	}
}
