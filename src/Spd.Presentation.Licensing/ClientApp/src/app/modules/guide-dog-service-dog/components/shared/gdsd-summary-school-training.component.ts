import { Component, Input } from '@angular/core';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';

@Component({
	selector: 'app-gdsd-summary-school-training',
	template: `
		<div class="row mt-0">
			<div class="text-minor-heading-small mt-2">Training Schools</div>
			<div *ngFor="let train of schoolTrainings; let i = index">
				<div class="row mt-0 mb-3">
					<div class="col-lg-4 col-md-12">
						<div class="text-label d-block text-muted">Training School Name</div>
						<div class="summary-text-data">{{ train.trainingBizName | default }}</div>
					</div>
					<div class="col-lg-4 col-md-12">
						<div class="text-label d-block text-muted">Contact Name</div>
						<div class="summary-text-data">{{ train.contactGivenName }} {{ train.contactSurname }}</div>
					</div>
					<div class="col-lg-4 col-md-12">
						<div class="text-label d-block text-muted">Contact Phone Number</div>
						<div class="summary-text-data">{{ train.contactPhoneNumber | default }}</div>
					</div>
					<div class="col-lg-4 col-md-12">
						<div class="text-label d-block text-muted">Contact Email Address</div>
						<div class="summary-text-data">{{ train.contactEmailAddress | default }}</div>
					</div>
					<div class="col-lg-4 col-md-12">
						<div class="text-label d-block text-muted">Training Dates</div>
						<div class="summary-text-data">
							{{ train.trainingDateFrom | formatDate }} - {{ train.trainingDateTo | formatDate }}
						</div>
					</div>
					<div class="col-lg-4 col-md-12">
						<div class="text-label d-block text-muted">Program Name</div>
						<div class="summary-text-data">{{ train.nameOfTrainingProgram | default }}</div>
					</div>
					<div class="col-lg-4 col-md-12">
						<div class="text-label d-block text-muted">Total Number of Training Hours</div>
						<div class="summary-text-data">{{ train.hoursOfTraining | default }}</div>
					</div>
					<div class="col-lg-8 col-md-12">
						<div class="text-label d-block text-muted">Curriculum Description</div>
						<div class="summary-text-data">{{ train.learnedDesc | default }}</div>
					</div>
				</div>

				<app-form-address-summary
					[formData]="train"
					headingLabel="Mailing Address"
					[isAddressTheSame]="false"
				></app-form-address-summary>

				<mat-divider class="mt-3 mb-2"></mat-divider>
			</div>

			<div class="row mt-0">
				<div class="col-12">
					<div class="text-minor-heading-small">Supporting Documents</div>
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
	get schoolTrainings(): Array<any> {
		return this.gdsdApplicationService.getSummaryschoolTrainings(this.gdsdModelData) ?? [];
	}
}
