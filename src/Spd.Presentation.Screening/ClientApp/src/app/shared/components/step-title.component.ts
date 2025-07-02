import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-step-title',
    template: `
		<div class="row">
		  <div class="col-md-8 col-sm-12 mx-auto">
		    <div class="title mb-4">
		      <div [innerHtml]="title"></div>
		      @if (subtitle) {
		        <div class="fs-6 mt-2">
		          {{ subtitle }}
		        </div>
		      }
		      @if (subheading) {
		        <div class="fs-4 mt-2">
		          {{ subheading }}
		        </div>
		      }
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
    standalone: false
})
export class StepTitleComponent {
	@Input() title = '';
	@Input() subtitle = '';
	@Input() subheading = '';
}
