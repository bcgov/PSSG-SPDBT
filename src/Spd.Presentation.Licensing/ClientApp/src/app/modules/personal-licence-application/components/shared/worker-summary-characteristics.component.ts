import { Component, Input } from '@angular/core';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';

@Component({
	selector: 'app-worker-summary-characteristics',
	template: `
		<div class="text-minor-heading-small">Characteristics</div>
		<div class="row mt-0">
			<div class="col-lg-3 col-md-12">
				<div class="text-label d-block text-muted">Hair Colour</div>
				<div class="summary-text-data">
					{{ hairColourCode | options: 'HairColourTypes' }}
				</div>
			</div>
			<div class="col-lg-3 col-md-12">
				<div class="text-label d-block text-muted">Eye Colour</div>
				<div class="summary-text-data">
					{{ eyeColourCode | options: 'EyeColourTypes' }}
				</div>
			</div>
			<div class="col-lg-3 col-md-12">
				<div class="text-label d-block text-muted">Height</div>
				<div class="summary-text-data">
					{{ height }}
					{{ heightUnitCode | options: 'HeightUnitTypes' }}
					{{ heightInches }}
				</div>
			</div>
			<div class="col-lg-3 col-md-12">
				<div class="text-label d-block text-muted">Weight</div>
				<div class="summary-text-data">
					{{ weight }}
					{{ weightUnitCode | options: 'WeightUnitTypes' }}
				</div>
			</div>
		</div>
	`,
	styles: [],
	standalone: false,
})
export class WorkerSummaryCharacteristicsComponent {
	constructor(private workerApplicationService: WorkerApplicationService) {}

	@Input() workerModelData: any;

	get hairColourCode(): string {
		return this.workerApplicationService.getSummaryhairColourCode(this.workerModelData);
	}
	get eyeColourCode(): string {
		return this.workerApplicationService.getSummaryeyeColourCode(this.workerModelData);
	}
	get height(): string {
		return this.workerApplicationService.getSummaryheight(this.workerModelData);
	}
	get heightInches(): string {
		return this.workerApplicationService.getSummaryheightInches(this.workerModelData);
	}
	get heightUnitCode(): string {
		return this.workerApplicationService.getSummaryheightUnitCode(this.workerModelData);
	}
	get weight(): string {
		return this.workerApplicationService.getSummaryweight(this.workerModelData);
	}
	get weightUnitCode(): string {
		return this.workerApplicationService.getSummaryweightUnitCode(this.workerModelData);
	}
}
