import { Component, Input } from '@angular/core';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';

@Component({
	selector: 'app-gdsd-summary-other-training',
	template: `
		<div class="text-minor-heading-small mt-4">Other Training</div>

		<div *ngFor="let train of otherTrainings; let i = index">
			<div class="row mt-0">
				<div class="col-lg-4 col-md-12">
					<div class="text-label d-block text-muted">Training Details</div>
					<div class="summary-text-data">{{ train.trainingDetail | default }}</div>
				</div>
				<div class="col-lg-4 col-md-12">
					<div class="text-label d-block text-muted">Did you use a personal dog trainer?</div>
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
						<div class="summary-text-data">{{ train.trainerPhoneNumber | default }}</div>
					</div>
					<div class="col-lg-4 col-md-12">
						<div class="text-label d-block text-muted">Trainer Email Address</div>
						<div class="summary-text-data">{{ train.trainerEmailAddress | default }}</div>
					</div>
					<div class="col-lg-4 col-md-12">
						<div class="text-label d-block text-muted">Hours spent practicing the skills learned</div>
						<div class="summary-text-data">{{ train.hoursPracticingSkill | default }}</div>
					</div>
				</ng-container>
			</div>
			<mat-divider class="mt-3 mb-2"></mat-divider>
		</div>

		<div class="row mt-0">
			<div class="col-12">
				<div class="text-label d-block text-muted">Supporting Documents</div>
				<div class="summary-text-data">
					<ul class="m-0">
						<ng-container *ngFor="let doc of supportingDocumentOtherTrainingAttachments; let i = index">
							<li>{{ doc.name }}</li>
						</ng-container>
					</ul>
				</div>
				<div class="col-12" *ngIf="isPracticeLogsOtherTrainingAttachments">
					<div class="text-label d-block text-muted">Practice Logs</div>
					<div class="summary-text-data">
						<ul class="m-0">
							<ng-container *ngFor="let doc of practiceLogsOtherTrainingAttachments; let i = index">
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
export class GdsdSummaryOtherTrainingComponent {
	booleanTypeYes = BooleanTypeCode.Yes;

	constructor(private gdsdApplicationService: GdsdApplicationService) {}

	@Input() gdsdModelData: any;

	get trainingDetails(): string {
		return this.gdsdApplicationService.getSummarydogName(this.gdsdModelData);
	}
	get otherTrainings(): Array<any> {
		return this.gdsdApplicationService.getSummaryotherTrainings(this.gdsdModelData) ?? [];
	}
	get supportingDocumentOtherTrainingAttachments(): File[] | null {
		return this.gdsdApplicationService.getSummarysupportingDocumentOtherTrainingAttachments(this.gdsdModelData);
	}
	get isPracticeLogsOtherTrainingAttachments(): boolean {
		return this.gdsdApplicationService.getSummaryisPracticeLogsOtherTrainingAttachments(this.gdsdModelData);
	}
	get practiceLogsOtherTrainingAttachments(): File[] | null {
		return this.gdsdApplicationService.getSummarypracticeLogsOtherTrainingAttachments(this.gdsdModelData);
	}
}
