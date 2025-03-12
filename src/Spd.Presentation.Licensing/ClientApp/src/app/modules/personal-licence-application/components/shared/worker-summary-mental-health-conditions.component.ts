import { Component, Input } from '@angular/core';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';

@Component({
	selector: 'app-worker-summary-mental-health-conditions',
	template: `
		<div class="text-minor-heading-small">Mental Health Conditions</div>
		<div class="row mt-0">
			<div class="col-lg-6 col-md-12">
				<div class="text-label d-block text-muted">Mental Health Conditions</div>
				<div class="summary-text-data">{{ isTreatedForMHC }}</div>
			</div>
			<ng-container *ngIf="isTreatedForMHC === booleanTypeCodes.Yes">
				<div class="col-lg-6 col-md-12" *ngIf="mentalHealthConditionAttachments.length > 0">
					<div class="text-label d-block text-muted">Mental Health Condition Form</div>
					<div class="summary-text-data">
						<ul class="m-0">
							<ng-container *ngFor="let doc of mentalHealthConditionAttachments; let i = index">
								<li>{{ doc.name }}</li>
							</ng-container>
						</ul>
					</div>
				</div>
			</ng-container>
		</div>
	`,
	styles: [],
	standalone: false,
})
export class WorkerSummaryMentalHealthConditionsComponent {
	booleanTypeCodes = BooleanTypeCode;

	@Input() workerModelData: any;

	constructor(private workerApplicationService: WorkerApplicationService) {}

	get isTreatedForMHC(): string {
		return this.workerApplicationService.getSummaryisTreatedForMHC(this.workerModelData);
	}
	get mentalHealthConditionAttachments(): File[] {
		return this.workerApplicationService.getSummarymentalHealthConditionAttachments(this.workerModelData);
	}
}
