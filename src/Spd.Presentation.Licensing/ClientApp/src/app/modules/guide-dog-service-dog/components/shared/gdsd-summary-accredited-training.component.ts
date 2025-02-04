import { Component, Input } from '@angular/core';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';

@Component({
	selector: 'app-gdsd-summary-accredited-training',
	template: `
		<div class="text-minor-heading-small mt-4">Accredited Graduation Information</div>
		<div class="row mt-0">
			<div class="col-lg-4 col-md-12">
				<div class="text-label d-block text-muted">
					Name of Assistance Dogs International or International Guide Dog Federation accredited school
				</div>
				<div class="summary-text-data">{{ accreditedSchoolName | default }}</div>
			</div>
			<div class="col-lg-4 col-md-12">
				<div class="text-label d-block text-muted">Contact Name</div>
				<div class="summary-text-data">{{ accreditedContactName | default }}</div>
			</div>
			<div class="col-lg-4 col-md-12">
				<div class="text-label d-block text-muted">Contact Phone Number</div>
				<div class="summary-text-data">{{ accreditedPhoneNumber | formatPhoneNumber | default }}</div>
			</div>
			<div class="col-lg-4 col-md-12">
				<div class="text-label d-block text-muted">Contact Email Address</div>
				<div class="summary-text-data">{{ accreditedEmailAddress | default }}</div>
			</div>
			<div class="col-lg-8 col-md-12">
				<div class="text-label d-block text-muted">Accredited Training School Documents</div>
				<div class="summary-text-data">
					<ul class="m-0">
						<ng-container *ngFor="let doc of accreditedAttachments; let i = index">
							<li>{{ doc.name }}</li>
						</ng-container>
					</ul>
				</div>
			</div>
		</div>
	`,
	styles: [],
	standalone: false,
})
export class GdsdSummaryAccreditedTrainingComponent {
	constructor(private gdsdApplicationService: GdsdApplicationService) {}

	@Input() gdsdModelData: any;

	get accreditedSchoolName(): string {
		return this.gdsdApplicationService.getSummaryaccreditedSchoolName(this.gdsdModelData);
	}
	get accreditedContactName(): string {
		return this.gdsdApplicationService.getSummaryaccreditedContactName(this.gdsdModelData);
	}
	get accreditedPhoneNumber(): string {
		return this.gdsdApplicationService.getSummaryaccreditedPhoneNumber(this.gdsdModelData);
	}
	get accreditedEmailAddress(): string {
		return this.gdsdApplicationService.getSummaryaccreditedEmailAddress(this.gdsdModelData);
	}
	get accreditedAttachments(): File[] | null {
		return this.gdsdApplicationService.getSummaryaccreditedAttachments(this.gdsdModelData);
	}
}
