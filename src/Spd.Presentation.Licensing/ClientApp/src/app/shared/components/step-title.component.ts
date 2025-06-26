import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-step-title',
	template: `
		<div class="row" *ngIf="heading">
			<div class="col-md-8 col-sm-12 mx-auto">
				<div class="title lh-base mb-4">
					<div class="fs-4" [innerHtml]="heading"></div>
					<div class="fs-6 mt-3" *ngIf="subheading" [innerHtml]="subheading"></div>
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
	standalone: false,
})
export class StepTitleComponent {
	@Input() heading = '';
	@Input() subheading = '';
	@Input() info = '';
	@Input() showDivider = false;
}
