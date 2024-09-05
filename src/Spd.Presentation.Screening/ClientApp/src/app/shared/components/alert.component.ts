import { Component, ContentChild, ElementRef, Input } from '@angular/core';

export type AlertType = 'success' | 'warning' | 'danger';

@Component({
	selector: 'app-alert',
	template: `
		<div
			class="alert fw-semibold d-flex d-inline-flex align-items-center mb-3 py-3 w-100"
			role="alert"
			[ngClass]="getType()"
		>
			<mat-icon class="d-none d-xl-block alert-icon me-2">{{ icon }}</mat-icon>
			<ng-content #alertContent></ng-content>
		</div>
	`,
	styles: [
		`
			.alert-icon {
				overflow: visible;
			}

			.alert-info {
				border: 1px solid rgba(217, 234, 247, 1);
				background-color: rgba(217, 234, 247, 1);
				border-radius: 5px;
				font-weight: 500 !important;
				font-style: normal;
				font-size: 1.1rem !important;
				color: #1a5a96;
				line-height: 1.5 !important;
			}

			.alert-success {
				border: 1px solid #e8f5eb;
				background-color: #e8f5eb;
				border-radius: 5px;
				font-weight: 500 !important;
				font-style: normal;
				font-size: 1.1rem !important;
				color: #155724;
				line-height: 1.5 !important;
			}

			.alert-warning {
				border: 1px solid rgba(250, 235, 204, 1);
				background-color: rgba(249, 241, 198, 1);
				border-radius: 5px;
				font-weight: 500 !important;
				font-style: normal;
				font-size: 1.1rem !important;
				color: #6c4a00;
				line-height: 1.5 !important;
			}

			.alert-danger {
				border: 1px solid rgba(235, 204, 209, 1);
				background-color: rgba(242, 222, 222, 1);
				border-radius: 5px;
				font-weight: 500 !important;
				font-style: normal;
				font-size: 1.1rem !important;
				color: #a12622;
				line-height: 1.5 !important;
			}
		`,
	],
})
export class AlertComponent {
	@Input() public type: AlertType = 'warning';
	@Input() public icon = 'warning';

	@ContentChild('alertContent') alertContent!: ElementRef;

	public getType(): string {
		return `alert-${this.type}`;
	}
}
