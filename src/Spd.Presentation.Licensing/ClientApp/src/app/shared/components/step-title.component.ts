import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-step-title',
	template: `
		@if (heading) {
		  <div class="row">
		    <div class="col-md-8 col-sm-12 mx-auto">
		      <div class="title lh-base mb-4">
		        <div class="fs-4" [innerHtml]="heading"></div>
		        @if (subheading) {
		          <div class="fs-6 mt-3" [innerHtml]="subheading"></div>
		        }
		        @if (info) {
		          <div class="fs-6 mt-3 text-start" [innerHtml]="info"></div>
		        }
		        @if (showDivider) {
		          <mat-divider class="mat-divider-main my-3"></mat-divider>
		        }
		      </div>
		    </div>
		  </div>
		}
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
