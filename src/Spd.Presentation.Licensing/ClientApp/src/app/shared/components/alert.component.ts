import { Component, ContentChild, ElementRef, Input } from '@angular/core';

export type AlertType = 'success' | 'warning' | 'danger' | 'info';

@Component({
	selector: 'app-alert',
	template: `
		<div class="alert d-flex d-inline-flex align-items-center w-100" role="alert" [ngClass]="getType()">
			@if (icon) {
				<mat-icon class="d-none d-lg-block alert-icon me-3">{{ icon }}</mat-icon>
			}
			<div style="width: inherit;" class="my-2" [ngClass]="getText()">
				<ng-content #alertContent> </ng-content>
			</div>
		</div>
	`,
	styles: [
		`
			.alert-info {
				border: 1px solid #b6d4fe;
				background-color: #d9eaf7;
				border-radius: 5px;
				font-weight: 500;
				font-style: normal;
				font-size: 1.1rem !important;
				color: #1a5a96;
				line-height: 1.5 !important;
			}

			.alert-success {
				border: 1px solid #badbcc;
				background-color: #e8f5eb;
				border-radius: 5px;
				font-weight: 500;
				font-style: normal;
				font-size: 1.1rem !important;
				color: #155724;
				line-height: 1.5 !important;
			}

			.alert-warning {
				border: 1px solid #ffecb5;
				background-color: #f9f1c6;
				border-radius: 5px;
				font-weight: 500;
				font-style: normal;
				font-size: 1.1rem !important;
				color: #6c4a00;
				line-height: 1.5 !important;
			}

			.alert-danger {
				border: 1px solid #f5c2c7;
				background-color: #f2dede;
				border-radius: 5px;
				font-weight: 500;
				font-style: normal;
				font-size: 1.1rem !important;
				color: #a12622;
				line-height: 1.5 !important;
			}

			.alert-noborder {
				border: none !important;
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

	public getType(): string {
		if (this.showBorder) {
			return `alert-${this.type}`;
		}
		return `alert-${this.type} alert-noborder`;
	}

	public getText(): string {
		return this.boldText ? 'fs-7 fw-bold' : '';
	}
}
