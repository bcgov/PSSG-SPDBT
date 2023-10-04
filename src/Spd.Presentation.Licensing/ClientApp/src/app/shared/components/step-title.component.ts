import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-step-title',
	template: `
		<div class="row">
			<div class="col-md-8 col-sm-12 mx-auto">
				<div class="title mb-4">
					<div [innerHtml]="title"></div>
					<div class="fs-6 mt-2" *ngIf="subtitle" [innerHtml]="subtitle"></div>
					<div class="fs-6 mt-2 text-start" *ngIf="info" [innerHtml]="info"></div>
				</div>
			</div>
		</div>
	`,
	styles: [
		`
			.title {
				font-size: 1.7em;
				font-weight: 400;
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
}
