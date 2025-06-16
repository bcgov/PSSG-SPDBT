import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-step-section',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					[heading]="heading"
					[subheading]="subheading"
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
	@Input() heading = '';
	@Input() subheading = '';
	@Input() info = '';
	@Input() showDivider = false;
}
