import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-dashboard-header',
	template: `
		<div class="row">
			<div class="col-12">
				<div class="d-flex justify-content-between">
					<h2 class="mx-2 fw-light" [title]="title" [attr.aria-label]="title">
						{{ title }}
					</h2>
				</div>
				<div *ngIf="subtitle" class="lead mx-2">{{ subtitle }}</div>
				<div>
					<ng-content></ng-content>
				</div>
			</div>
		</div>
	`,
	styles: [
		`
			.mat-icon {
				color: var(--color-primary-light);
				font-size: 40px;
				height: 40px;
				width: 40px;
			}
		`,
	],
})
export class DashboardHeaderComponent {
	@Input() title = '';
	@Input() subtitle = '';
}
