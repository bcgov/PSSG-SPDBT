import { Component, Input } from '@angular/core';
import { PermitApplicationService } from '@app/core/services/permit-application.service';

@Component({
	selector: 'app-permit-summary-purpose',
	template: `
		<div class="text-minor-heading-small">Purpose</div>
		<div class="row mt-0">
			<div class="col-lg-6 col-md-12">
				<div class="text-label d-block text-muted">{{ purposeLabel }}</div>
				<div class="summary-text-data">
					@for (reason of purposeReasons; track reason; let i = $index) {
						<li>{{ reason }}</li>
					}
				</div>
			</div>
			@if (isOtherReason) {
				<div class="col-12">
					<div class="text-label d-block text-muted">Other Reason</div>
					<div class="summary-text-data">
						{{ otherReason }}
					</div>
				</div>
			}
		</div>
	`,
	styles: [],
	standalone: false,
})
export class PermitSummaryPurposeComponent {
	constructor(private permitApplicationService: PermitApplicationService) {}

	@Input() permitModelData: any;

	get purposeLabel(): string {
		return this.permitApplicationService.getSummarypurposeLabel(this.permitModelData);
	}
	get purposeReasons(): Array<string> {
		return this.permitApplicationService.getSummarypurposeReasons(this.permitModelData);
	}
	get isOtherReason(): boolean {
		return this.permitApplicationService.getSummaryisOtherReason(this.permitModelData);
	}
	get otherReason(): boolean {
		return this.permitApplicationService.getSummaryotherReason(this.permitModelData);
	}
}
