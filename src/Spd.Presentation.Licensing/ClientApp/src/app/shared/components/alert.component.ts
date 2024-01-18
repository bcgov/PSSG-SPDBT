import { Component, ContentChild, ElementRef, Input } from '@angular/core';

export type AlertType = 'success' | 'warning' | 'danger' | 'info';

@Component({
	selector: 'app-alert',
	template: `
		<div class="alert d-flex d-inline-flex align-items-center w-100" role="alert" [ngClass]="getType()">
			<mat-icon class="d-none d-lg-block alert-icon me-3" *ngIf="icon">{{ icon }}</mat-icon>
			<div style="width: fit-content;" class="my-2" [ngClass]="getText()">
				<ng-content #alertContent> </ng-content>
			</div>
		</div>
	`,
	styles: [
		`
			.alert-info {
				color: #0c5460;
				background-color: #eef8fa;
				border-color: #eef8fa;
				border-radius: 0;
			}

			.alert-info-border {
				border-left: 3px solid #0c5460;
			}

			.alert-success {
				color: #155724;
				background-color: #e8f5eb;
				border-color: #e8f5eb;
				border-radius: 0;
			}

			.alert-success-border {
				border-left: 3px solid #155724;
			}

			.alert-warning {
				color: #856404;
				background-color: #fff9e5;
				border-color: #fff9e5;
				border-radius: 0;
			}

			.alert-warning-border {
				border-left: 3px solid #856404;
			}

			.alert-danger {
				color: #721c24;
				background-color: #fceded;
				border-color: #fceded;
				border-radius: 0;
			}

			.alert-danger-border {
				border-left: 3px solid #721c24;
			}
		`,
	],
})
export class AlertComponent {
	@Input() public type: AlertType = 'warning';
	@Input() public icon: string | null = 'warning';
	@Input() public showBorder: boolean | null = true;
	@Input() public boldText: boolean | null = false;

	@ContentChild('alertContent') alertContent!: ElementRef;

	public getType(): string {
		if (this.showBorder) {
			return `alert-${this.type} alert-${this.type}-border`;
		}
		return `alert-${this.type}`;
	}

	public getText(): string {
		return this.boldText ? 'fs-7 fw-bold' : '';
	}
}
