import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-step-section',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					[title]="title"
					[subtitle]="subtitle"
					[info]="info"
					[showDivider]="showDivider"
				></app-step-title>

				<ng-content></ng-content>
			</div>
		</section>
	`,
	styles: [
		`
			.title {
				text-align: center;
				color: var(--color-primary);
			}
		`,
	],
	standalone: false,
})
export class StepSectionComponent {
	@Input() title = '';
	@Input() subtitle = '';
	@Input() info = '';
	@Input() showDivider = false;
}
