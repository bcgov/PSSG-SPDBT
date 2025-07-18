import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-step-section',
	template: `
		<section class="step-section">
			<main id="mainContent" tabindex="-1" role="main">
				<div class="step">
					<app-step-title
						[heading]="heading"
						[subheading]="subheading"
						[info]="info"
						[showDivider]="showDivider"
					></app-step-title>

					<ng-content></ng-content>
				</div>
			</main>
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
