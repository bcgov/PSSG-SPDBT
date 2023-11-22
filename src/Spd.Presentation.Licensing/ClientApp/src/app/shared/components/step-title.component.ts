import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-step-title',
	template: `
		<div class="row">
			<div class="col-md-8 col-sm-12 mx-auto">
				<div class="title lh-base mb-4">
					<div class="fs-3" [innerHtml]="title"></div>
					<div class="fs-6 mt-4" *ngIf="subtitle" [innerHtml]="subtitle"></div>
					<div class="fs-6 mt-4 text-start" *ngIf="info" [innerHtml]="info"></div>
				</div>
				<mat-divider *ngIf="showDivider" class="mat-divider-main mb-4"></mat-divider>
			</div>
		</div>
	`,
	styles: [
		`
			.title {
				text-align: center;
				color: var(--color-primary);
			}
		`,
	],
})
export class StepTitleComponent {
	@Input() title = '';
	@Input() subtitle = '';
	@Input() info = '';
	@Input() showDivider = false;
}
