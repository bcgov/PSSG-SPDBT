import { Component, Input } from '@angular/core';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';

@Component({
	selector: 'app-form-team-summary-accredited-training',
	template: `
		<div class="text-minor-heading-small mt-2">Accredited Graduation Information</div>
		<div class="row mt-0">
		  <div class="col-lg-4 col-md-12">
		    <div class="text-label d-block text-muted">Name of Accredited School</div>
		    <div class="summary-text-data">{{ accreditedSchoolName | default }}</div>
		  </div>
		  <div class="col-lg-8 col-md-12">
		    <div class="text-label d-block text-muted">Accredited Training School Documents</div>
		    <div class="summary-text-data">
		      <ul class="m-0">
		        @for (doc of accreditedAttachments; track doc; let i = $index) {
		          <li>{{ doc.name }}</li>
		        }
		      </ul>
		    </div>
		  </div>
		</div>
		`,
	styles: [],
	standalone: false,
})
export class FormTeamSummaryAccreditedTrainingComponent {
	constructor(private gdsdTeamApplicationService: GdsdTeamApplicationService) {}

	@Input() gdsdModelData: any;

	get accreditedSchoolName(): string {
		return this.gdsdTeamApplicationService.getSummaryaccreditedSchoolName(this.gdsdModelData);
	}
	get accreditedAttachments(): File[] | null {
		return this.gdsdTeamApplicationService.getSummaryaccreditedAttachments(this.gdsdModelData);
	}
}
