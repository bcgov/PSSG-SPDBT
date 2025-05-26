import { Component, Input } from '@angular/core';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';

@Component({
	selector: 'app-gdsd-summary-school-training',
	template: `
		<div class="row mt-0">
			<div *ngFor="let train of schoolTrainings; let i = index">
				<div class="text-minor-heading-small mt-2">Training Schools</div>
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
						<div class="summary-text-data">{{ train.contactPhoneNumber | formatPhoneNumber | default }}</div>
					</div>
					<div class="col-lg-4 col-md-12">
						<div class="text-label d-block text-muted">Contact Email Address</div>
						<div class="summary-text-data">{{ train.contactEmailAddress | default }}</div>
					</div>
					<div class="col-lg-4 col-md-12">
						<div class="text-label d-block text-muted">Training Dates</div>
						<div class="summary-text-data">
							{{ train.trainingStartDate | formatDate }} - {{ train.trainingEndDate | formatDate }}
						</div>
					</div>
					<div class="col-lg-4 col-md-12">
						<div class="text-label d-block text-muted">Program Name</div>
						<div class="summary-text-data">{{ train.trainingName | default }}</div>
					</div>
					<div class="col-lg-4 col-md-12">
						<div class="text-label d-block text-muted">Total Number of Training Hours</div>
						<div class="summary-text-data">{{ train.totalTrainingHours | default }}</div>
					</div>
					<div class="col-lg-8 col-md-12">
						<div class="text-label d-block text-muted">Curriculum Description</div>
						<div class="summary-text-data">{{ train.whatLearned | default }}</div>
					</div>
				</div>

				<app-form-address-summary
					[formData]="train"
					headingLabel="Mailing Address"
					[isAddressTheSame]="false"
				></app-form-address-summary>
			</div>

			<div class="row mt-0" *ngIf="issupportingDocumentTrainingSchoolsAttachments">
				<mat-divider class="mt-3 mb-2"></mat-divider>

				<div class="col-12">
					<div class="text-minor-heading-small">Supporting Documents</div>
					<div class="summary-text-data">
						<ul class="m-0">
							<ng-container *ngFor="let doc of supportingDocumentTrainingSchoolsAttachments; let i = index">
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
	constructor(private gdsdTeamApplicationService: GdsdTeamApplicationService) {}

	@Input() gdsdModelData: any;

	get issupportingDocumentTrainingSchoolsAttachments(): boolean {
		return this.gdsdTeamApplicationService.getSummaryissupportingDocumentTrainingSchoolsAttachments(this.gdsdModelData);
	}
	get supportingDocumentTrainingSchoolsAttachments(): File[] | null {
		return this.gdsdTeamApplicationService.getSummarysupportingDocumentTrainingSchoolsAttachments(this.gdsdModelData);
	}
	get schoolTrainings(): Array<any> {
		return this.gdsdTeamApplicationService.getSummaryschoolTrainings(this.gdsdModelData) ?? [];
	}
}
