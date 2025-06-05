import { Component, ContentChild, ElementRef, Input } from '@angular/core';

export type AlertType = 'success' | 'warning' | 'danger' | 'info';

@Component({
	selector: 'app-alert',
	template: `
		<div class="alert d-flex d-inline-flex align-items-center w-100" role="alert" [ngClass]="getTypeClass()">
			<mat-icon class="d-none d-lg-block alert-icon me-3" *ngIf="icon" [ngClass]="geIconClass()">{{ icon }}</mat-icon>
			<div style="width: inherit;" class="my-2" [ngClass]="getText()">
				<ng-content #alertContent> </ng-content>
			</div>
		</div>
	`,
	styles: [
		`
			.alert-info {
				border: 3px solid #84ced9;
				background-color: #f9fcfd;
				border-radius: 5px;
				font-weight: 500;
				font-style: normal;
				font-size: 1.1rem !important;
				color: var(--color-primary);
				line-height: 1.5 !important;
			}

			.alert-success {
				border: 3px solid #8dd09c;
				background-color: #e7f5ea;
				border-radius: 5px;
				font-weight: 500;
				font-style: normal;
				font-size: 1.1rem !important;
				color: var(--color-primary);
				line-height: 1.5 !important;
			}

			.alert-warning {
				border: 3px solid #ffdb6e;
				background-color: #fffbed;
				border-radius: 5px;
				font-weight: 500;
				font-style: normal;
				font-size: 1.1rem !important;
				color: var(--color-primary);
				line-height: 1.5 !important;
			}

			.alert-danger {
				border: 3px solid #ea8590;
				background-color: #fdf1f3;
				border-radius: 5px;
				font-weight: 500;
				font-style: normal;
				font-size: 1.1rem !important;
				color: var(--color-primary);
				line-height: 1.5 !important;
			}

			.alert-icon-info {
				color: #84ced9;
			}

			.alert-icon-success {
				color: #8dd09c;
			}

			.alert-icon-warning {
				color: #ffdb6e;
			}

			.alert-icon-danger {
				color: #ea8590;
			}
		`,
	],
	standalone: false,
})
export class AlertComponent {
	@Input() public type: AlertType = 'warning';
	@Input() public icon: string | null = 'warning';
	@Input() public showBorder: boolean | null = true;
	@Input() public boldText: boolean | null = false;

	@ContentChild('alertContent') alertContent!: ElementRef;

	public getTypeClass(): string {
		if (this.showBorder) {
			return `alert-${this.type}`;
		}
		return `alert-${this.type} alert-noborder`;
	}

	public geIconClass(): string {
		return `alert-icon-${this.type}`;
	}

	public getText(): string {
		return this.boldText ? 'fs-7 fw-bold' : '';
	}
}
