import { Component, Input } from '@angular/core';
import { ApplicationTypeCode, ServiceTypeCode } from '@app/api/models';

@Component({
	selector: 'app-step-section',
	template: `
		<section class="step-section">
			<div class="step">
				<ng-container *ngIf="isRenewalOrUpdate">
					<app-alert-update-or-renewal
						[serviceTypeCode]="serviceTypeCode"
						[applicationTypeCode]="applicationTypeCode"
					></app-alert-update-or-renewal>
				</ng-container>

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
})
export class StepSectionComponent {
	@Input() title = '';
	@Input() subtitle = '';
	@Input() info = '';
	@Input() showDivider = false;
	@Input() isRenewalOrUpdate = false;
	@Input() serviceTypeCode: ServiceTypeCode | null = null;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;
}
