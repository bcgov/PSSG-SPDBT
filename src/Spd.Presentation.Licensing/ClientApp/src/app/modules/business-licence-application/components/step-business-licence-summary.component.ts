import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonBusinessLicenceSummaryComponent } from './common-business-licence-summary.component';

@Component({
	selector: 'app-step-business-licence-summary',
	template: `
		<app-step-section title="Application Summary" subtitle="Review your information before submitting your application">
			<app-common-business-licence-summary (editStep)="onEditStep($event)"></app-common-business-licence-summary>
		</app-step-section>
	`,
	styles: [],
})
export class StepBusinessLicenceSummaryComponent {
	@ViewChild(CommonBusinessLicenceSummaryComponent) summaryComponent!: CommonBusinessLicenceSummaryComponent;

	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	onEditStep(stepNumber: number) {
		this.editStep.emit(stepNumber);
	}

	onUpdateData(): void {
		this.summaryComponent.onUpdateData();
	}
}
