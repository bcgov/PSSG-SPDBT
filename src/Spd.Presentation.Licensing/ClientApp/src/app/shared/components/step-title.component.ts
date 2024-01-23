import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-step-title',
	template: `
		<div class="row">
			<div class="col-md-8 col-sm-12 mx-auto">
				<div class="title lh-base mb-4">
					<div class="fs-4" [innerHtml]="title"></div>
					<div class="fs-6 mt-3" *ngIf="subtitle" [innerHtml]="subtitle"></div>
					<div class="fs-6 mt-3 text-start" *ngIf="info" [innerHtml]="info"></div>
					<mat-divider *ngIf="showDivider" class="mat-divider-main my-3"></mat-divider>
				</div>
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
