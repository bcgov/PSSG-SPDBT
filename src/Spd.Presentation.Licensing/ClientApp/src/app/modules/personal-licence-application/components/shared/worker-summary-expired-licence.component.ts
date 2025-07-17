import { Component, Input } from '@angular/core';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';

@Component({
	selector: 'app-worker-summary-expired-licence',
	template: `
		@if (hasExpiredLicence === booleanTypeYes) {
			<mat-divider class="mt-3 mb-2"></mat-divider>
			<div class="text-minor-heading-small">Expired Licence</div>
			<div class="row mt-0">
				<div class="col-lg-4 col-md-12">
					<div class="text-label d-block text-muted">Expired Licence Number</div>
					<div class="summary-text-data">{{ expiredLicenceNumber | default }}</div>
				</div>
				<div class="col-lg-4 col-md-12">
					<div class="text-label d-block text-muted">Expiry Date</div>
					<div class="summary-text-data">
						{{ expiredLicenceExpiryDate | formatDate | default }}
					</div>
				</div>
			</div>
		}
	`,
	styles: [],
	standalone: false,
})
export class WorkerSummaryExpiredLicenceComponent {
	booleanTypeYes = BooleanTypeCode.Yes;

	constructor(private workerApplicationService: WorkerApplicationService) {}

	@Input() workerModelData: any;

	get hasExpiredLicence(): string {
		return this.workerApplicationService.getSummaryhasExpiredLicence(this.workerModelData);
	}
	get expiredLicenceNumber(): string {
		return this.workerApplicationService.getSummaryexpiredLicenceNumber(this.workerModelData);
	}
	get expiredLicenceExpiryDate(): string {
		return this.workerApplicationService.getSummaryexpiredLicenceExpiryDate(this.workerModelData);
	}
}
