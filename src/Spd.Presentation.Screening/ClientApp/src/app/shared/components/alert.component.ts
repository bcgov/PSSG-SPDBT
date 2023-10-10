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
	styles: [],
})
export class AlertComponent {
	@Input() public type: AlertType = 'warning';
	@Input() public icon: string = 'warning';

	@ContentChild('alertContent') alertContent!: ElementRef;

	public getType(): string {
		return `alert-${this.type}`;
	}
}
