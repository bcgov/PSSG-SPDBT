import { Component, Input } from '@angular/core';
import { PermitApplicationService } from '@app/core/services/permit-application.service';

@Component({
	selector: 'app-permit-summary-criminal-history',
	template: `
		<div class="text-minor-heading-small">Criminal History</div>
		<div class="row mt-0">
		  <div class="col-12">
		    <div class="text-label d-block text-muted">{{ criminalHistoryLabel }}</div>
		    <div class="summary-text-data">{{ hasCriminalHistory }}</div>
		  </div>
		  @if (criminalChargeDescription) {
		    <div class="col-12">
		      <div class="text-label d-block text-muted">Description of New Charges or Convictions</div>
		      <div class="summary-text-data">{{ criminalChargeDescription }}</div>
		    </div>
		  }
		</div>
		`,
	styles: [],
	standalone: false,
})
export class PermitSummaryCriminalHistoryComponent {
	constructor(private permitApplicationService: PermitApplicationService) {}

	@Input() workerModelData: any;

	get criminalHistoryLabel(): string {
		return this.permitApplicationService.getSummarycriminalHistoryLabel(this.workerModelData);
	}
	get hasCriminalHistory(): string {
		return this.permitApplicationService.getSummaryhasCriminalHistory(this.workerModelData);
	}
	get criminalChargeDescription(): string {
		return this.permitApplicationService.getSummarycriminalChargeDescription(this.workerModelData);
	}
}
