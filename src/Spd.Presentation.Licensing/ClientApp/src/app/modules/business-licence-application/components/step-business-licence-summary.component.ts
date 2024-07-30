import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonBusinessLicenceSummaryComponent } from './common-business-licence-summary.component';

@Component({
	selector: 'app-step-business-licence-summary',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Application Summary"
					subtitle="Review your information before submitting your application"
				></app-step-title>

				<app-common-business-licence-summary
					(editStep)="onEditStep($event)"
					[isUpdateFlowWithHideReprintStep]="isUpdateFlowWithHideReprintStep"
				></app-common-business-licence-summary>
			</div>
		</section>
	`,
	styles: [],
})
export class StepBusinessLicenceSummaryComponent {
	@ViewChild(CommonBusinessLicenceSummaryComponent) summaryComponent!: CommonBusinessLicenceSummaryComponent;

	@Input() isUpdateFlowWithHideReprintStep!: boolean;

	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	onEditStep(stepNumber: number) {
		this.editStep.emit(stepNumber);
	}

	onUpdateData(): void {
		this.summaryComponent.onUpdateData();
	}
}
