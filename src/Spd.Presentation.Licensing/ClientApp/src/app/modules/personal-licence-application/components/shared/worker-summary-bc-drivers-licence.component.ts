import { Component, Input } from '@angular/core';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';

@Component({
	selector: 'app-worker-summary-bc-drivers-licence',
	template: `
		<div class="row mt-0">
			<div class="col-lg-6 col-md-12">
				<div class="text-label d-block text-muted">BC Driver's Licence</div>
				<div class="summary-text-data">{{ bcDriversLicenceNumber | default }}</div>
			</div>
		</div>
	`,
	styles: [],
	standalone: false,
})
export class WorkerSummaryBcDriversLicenceComponent {
	constructor(private workerApplicationService: WorkerApplicationService) {}

	@Input() workerModelData: any;

	get bcDriversLicenceNumber(): string {
		return this.workerApplicationService.getSummarybcDriversLicenceNumber(this.workerModelData);
	}
}
