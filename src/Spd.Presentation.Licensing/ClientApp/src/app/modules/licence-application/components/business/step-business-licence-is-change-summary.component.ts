import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonBusinessLicenceSummaryComponent } from './common-business-licence-summary.component';

@Component({
	selector: 'app-step-business-licence-is-change-summary',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Do you need to update any of the following information?"
					subtitle="Review the information from your business's previous application below. If you don't need to update it, select 'No updates needed' to proceed. If you do need to change something, select 'Yes, I need to update.'"
				></app-step-title>

				<app-common-business-licence-summary [isChangeFlow]="true"></app-common-business-licence-summary>
			</div>
		</section>
	`,
	styles: [],
})
export class StepBusinessLicenceIsChangeSummaryComponent {
	@ViewChild(CommonBusinessLicenceSummaryComponent) summaryComponent!: CommonBusinessLicenceSummaryComponent;

	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	onUpdateData(): void {
		this.summaryComponent.onUpdateData();
	}
}
