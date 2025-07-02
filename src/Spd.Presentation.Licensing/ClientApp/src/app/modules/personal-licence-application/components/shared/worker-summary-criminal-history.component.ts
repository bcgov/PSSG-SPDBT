import { Component, Input } from '@angular/core';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';

@Component({
	selector: 'app-worker-summary-criminal-history',
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
export class WorkerSummaryCriminalHistoryComponent {
	constructor(private workerApplicationService: WorkerApplicationService) {}

	@Input() workerModelData: any;

	get criminalHistoryLabel(): string {
		return this.workerApplicationService.getSummarycriminalHistoryLabel(this.workerModelData);
	}
	get hasCriminalHistory(): string {
		return this.workerApplicationService.getSummaryhasCriminalHistory(this.workerModelData);
	}
	get criminalChargeDescription(): string {
		return this.workerApplicationService.getSummarycriminalChargeDescription(this.workerModelData);
	}
}
