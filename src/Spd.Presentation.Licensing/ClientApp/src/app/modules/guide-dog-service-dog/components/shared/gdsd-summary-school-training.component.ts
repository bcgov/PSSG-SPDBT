import { Component, Input } from '@angular/core';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';

@Component({
	selector: 'app-gdsd-summary-school-training',
	template: `
		<div class="row mt-0">
			<div class="text-minor-heading-small mt-4">Training Schools</div>
			<div class="row mt-0">
				<!-- <div class="col-lg-4 col-md-12">
												<div class="text-label d-block text-muted">Training School Name</div>
												<div class="summary-text-data">{{ accreditedSchoolName | default }}</div>
											</div> -->
				<div class="col-lg-8 col-md-12">
					<div class="text-label d-block text-muted">Supporting Documents</div>
					<div class="summary-text-data">
						<ul class="m-0">
							<ng-container *ngFor="let doc of supportingDocumenTrainingSchoolsAttachments; let i = index">
								<li>{{ doc.name }}</li>
							</ng-container>
						</ul>
					</div>
				</div>
			</div>
		</div>
	`,
	styles: [],
	standalone: false,
})
export class GdsdSummarySchoolTrainingComponent {
	constructor(private gdsdApplicationService: GdsdApplicationService) {}

	@Input() gdsdModelData: any;

	get supportingDocumenTrainingSchoolsAttachments(): File[] | null {
		return this.gdsdApplicationService.getSummarysupportingDocumenTrainingSchoolsAttachments(this.gdsdModelData);
	}
}
