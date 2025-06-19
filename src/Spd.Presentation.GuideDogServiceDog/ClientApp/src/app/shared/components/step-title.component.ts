import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-step-title',
	template: `
		<header class="row" *ngIf="heading">
			<div class="col-md-8 col-sm-12 mx-auto">
				<div class="heading lh-base mb-4">
					<h1 tabindex="-1" class="fs-4" [innerHtml]="heading"></h1>
					<h2 tabindex="-1" class="fs-6 mt-3" *ngIf="subheading" [innerHtml]="subheading"></h2>
					<h3 tabindex="-1" class="fs-6 mt-3 text-start" *ngIf="info" [innerHtml]="info"></h3>
					<mat-divider *ngIf="showDivider" class="mat-divider-main my-3"></mat-divider>
				</div>
			</div>
		</header>
	`,
	styles: [
		`
			.heading {
				text-align: center;
				color: var(--color-primary);
			}
		`,
	],
	standalone: false,
})
export class StepTitleComponent {
	@Input() heading = '';
	@Input() subheading = '';
	@Input() info = '';
	@Input() showDivider = false;
}
