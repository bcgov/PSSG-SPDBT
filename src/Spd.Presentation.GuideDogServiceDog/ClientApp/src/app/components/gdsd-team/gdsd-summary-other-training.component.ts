import { Component, Input } from '@angular/core';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';

@Component({
	selector: 'app-gdsd-summary-other-training',
	template: `
		<div *ngFor="let train of otherTrainings; let i = index">
			<div class="text-minor-heading-small mt-2">Other Training</div>
			<div class="row mt-0">
				<div class="col-lg-8 col-md-12">
					<div class="text-label d-block text-muted">Training Details</div>
					<div class="summary-text-data">{{ train.trainingDetail | default }}</div>
				</div>
				<div class="col-lg-4 col-md-12">
					<div class="text-label d-block text-muted">Used a Personal Dog Trainer</div>
					<div class="summary-text-data">{{ train.usePersonalDogTrainer | default }}</div>
				</div>
				<ng-container *ngIf="train.usePersonalDogTrainer === booleanTypeYes">
					<div class="col-lg-4 col-md-12">
						<div class="text-label d-block text-muted">Trainer Credentials</div>
						<div class="summary-text-data">{{ train.dogTrainerCredential | default }}</div>
					</div>
					<div class="col-lg-4 col-md-12">
						<div class="text-label d-block text-muted">Time Spent Training</div>
						<div class="summary-text-data">{{ train.trainingTime | default }}</div>
					</div>
					<div class="col-lg-4 col-md-12">
						<div class="text-label d-block text-muted">Trainer Name</div>
						<div class="summary-text-data">{{ train.trainerGivenName }} {{ train.trainerSurname }}</div>
					</div>
					<div class="col-lg-4 col-md-12">
						<div class="text-label d-block text-muted">Trainer Phone Number</div>
						<div class="summary-text-data">{{ train.trainerPhoneNumber | formatPhoneNumber | default }}</div>
					</div>
					<div class="col-lg-4 col-md-12">
						<div class="text-label d-block text-muted">Trainer Email Address</div>
						<div class="summary-text-data">{{ train.trainerEmailAddress | default }}</div>
					</div>
					<div class="col-lg-4 col-md-12">
						<div class="text-label d-block text-muted">Hours Practicing Skills</div>
						<div class="summary-text-data">{{ train.hoursPracticingSkill | default }}</div>
					</div>
				</ng-container>
			</div>
		</div>

		<div class="row mt-0" *ngIf="issupportingDocumentOtherTrainingAttachments">
			<mat-divider class="mt-3 mb-2"></mat-divider>

			<div class="col-12">
				<div class="text-minor-heading-small">Supporting Documents</div>
				<div class="summary-text-data">
					<ul class="m-0">
						<ng-container *ngFor="let doc of supportingDocumentOtherTrainingAttachments; let i = index">
							<li>{{ doc.name }}</li>
						</ng-container>
					</ul>
				</div>
			</div>
		</div>

		<div class="row mt-0" *ngIf="ispracticeLogsOtherTrainingAttachments">
			<mat-divider class="mt-3 mb-2"></mat-divider>

			<div class="col-12">
				<div class="text-minor-heading-small">Practice Logs</div>
				<div class="summary-text-data">
					<ul class="m-0">
						<ng-container *ngFor="let doc of practiceLogsOtherTrainingAttachments; let i = index">
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
export class GdsdSummaryOtherTrainingComponent {
	booleanTypeYes = BooleanTypeCode.Yes;

	constructor(private gdsdTeamApplicationService: GdsdTeamApplicationService) {}

	@Input() gdsdModelData: any;

	get trainingDetails(): string {
		return this.gdsdTeamApplicationService.getSummarydogName(this.gdsdModelData);
	}
	get otherTrainings(): Array<any> {
		return this.gdsdTeamApplicationService.getSummaryotherTrainings(this.gdsdModelData) ?? [];
	}
	get issupportingDocumentOtherTrainingAttachments(): boolean {
		return this.gdsdTeamApplicationService.getSummaryissupportingDocumentOtherTrainingAttachments(this.gdsdModelData);
	}
	get supportingDocumentOtherTrainingAttachments(): File[] | null {
		return this.gdsdTeamApplicationService.getSummarysupportingDocumentOtherTrainingAttachments(this.gdsdModelData);
	}
	get ispracticeLogsOtherTrainingAttachments(): boolean {
		return this.gdsdTeamApplicationService.getSummaryispracticeLogsOtherTrainingAttachments(this.gdsdModelData);
	}
	get practiceLogsOtherTrainingAttachments(): File[] | null {
		return this.gdsdTeamApplicationService.getSummarypracticeLogsOtherTrainingAttachments(this.gdsdModelData);
	}
}
