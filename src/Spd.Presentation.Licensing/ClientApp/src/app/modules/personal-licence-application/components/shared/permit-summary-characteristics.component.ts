import { Component, Input } from '@angular/core';
import { PermitApplicationService } from '@app/core/services/permit-application.service';

@Component({
	selector: 'app-permit-summary-characteristics',
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
export class PermitSummaryCharacteristicsComponent {
	constructor(private permitApplicationService: PermitApplicationService) {}

	@Input() permitModelData: any;

	get hairColourCode(): string {
		return this.permitApplicationService.getSummaryhairColourCode(this.permitModelData);
	}
	get eyeColourCode(): string {
		return this.permitApplicationService.getSummaryeyeColourCode(this.permitModelData);
	}
	get height(): string {
		return this.permitApplicationService.getSummaryheight(this.permitModelData);
	}
	get heightInches(): string {
		return this.permitApplicationService.getSummaryheightInches(this.permitModelData);
	}
	get heightUnitCode(): string {
		return this.permitApplicationService.getSummaryheightUnitCode(this.permitModelData);
	}
	get weight(): string {
		return this.permitApplicationService.getSummaryweight(this.permitModelData);
	}
	get weightUnitCode(): string {
		return this.permitApplicationService.getSummaryweightUnitCode(this.permitModelData);
	}
}
