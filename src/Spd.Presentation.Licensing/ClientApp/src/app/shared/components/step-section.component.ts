import { Component, Input } from '@angular/core';
import { ApplicationTypeCode, ServiceTypeCode } from '@app/api/models';

@Component({
	selector: 'app-step-section',
	template: `
		<section class="step-section">
			<div class="step">
				@if (isRenewalOrUpdate) {
					<app-form-alert-update-or-renewal [serviceTypeCode]="serviceTypeCode"></app-form-alert-update-or-renewal>
				}

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
	@Input() isRenewalOrUpdate = false;
	@Input() serviceTypeCode: ServiceTypeCode | null = null;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;
}
