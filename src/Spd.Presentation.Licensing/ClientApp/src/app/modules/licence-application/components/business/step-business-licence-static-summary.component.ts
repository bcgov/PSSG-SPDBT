import { Component } from '@angular/core';

@Component({
	selector: 'app-step-business-licence-static-summary',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Do you need to update any of the following information?"
					subtitle="Review the information from your business's previous application below. If you don't need to update it, select 'No updates needed' to proceed. If you do need to change something, select 'Yes, I need to update.'"
				></app-step-title>

				<app-common-business-licence-summary [isStaticDataView]="true"></app-common-business-licence-summary>
			</div>
		</section>
	`,
	styles: [],
})
export class StepBusinessLicenceStaticSummaryComponent {}
