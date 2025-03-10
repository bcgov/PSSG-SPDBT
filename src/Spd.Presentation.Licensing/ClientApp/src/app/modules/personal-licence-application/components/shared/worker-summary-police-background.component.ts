import { Component, Input } from '@angular/core';
import { PoliceOfficerRoleCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';

@Component({
	selector: 'app-worker-summary-police-background',
	template: `
		<div class="text-minor-heading-small mt-4">Police Background</div>
		<div class="row mt-0">
			<div class="col-lg-4 col-md-12">
				<div class="text-label d-block text-muted">Police Officer or Peace Officer Roles</div>
				<div class="summary-text-data">{{ isPoliceOrPeaceOfficer }}</div>
			</div>
			<ng-container *ngIf="isPoliceOrPeaceOfficer === booleanTypeCodes.Yes">
				<div class="col-lg-4 col-md-12">
					<div class="text-label d-block text-muted">Role</div>
					<div class="summary-text-data">
						<span *ngIf="policeOfficerRoleCode !== policeOfficerRoleCodes.Other; else otherPoliceOfficerRole">{{
							policeOfficerRoleCode | options: 'PoliceOfficerRoleTypes' | default
						}}</span>
						<ng-template #otherPoliceOfficerRole> Other: {{ otherOfficerRole }} </ng-template>
					</div>
				</div>
				<div class="col-lg-4 col-md-12" *ngIf="letterOfNoConflictAttachments">
					<div class="text-label d-block text-muted">Letter of No Conflict</div>
					<div class="summary-text-data">
						<ul class="m-0">
							<ng-container *ngFor="let doc of letterOfNoConflictAttachments; let i = index">
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
export class WorkerSummaryPoliceBackgroundComponent {
	booleanTypeCodes = BooleanTypeCode;
	policeOfficerRoleCodes = PoliceOfficerRoleCode;

	@Input() workerModelData: any;

	constructor(private workerApplicationService: WorkerApplicationService) {}

	get isPoliceOrPeaceOfficer(): string {
		return this.workerApplicationService.getSummaryisPoliceOrPeaceOfficer(this.workerModelData);
	}
	get policeOfficerRoleCode(): string {
		return this.workerApplicationService.getSummarypoliceOfficerRoleCode(this.workerModelData);
	}
	get otherOfficerRole(): string {
		return this.workerApplicationService.getSummaryotherOfficerRole(this.workerModelData);
	}
	get letterOfNoConflictAttachments(): File[] {
		return this.workerApplicationService.getSummaryletterOfNoConflictAttachments(this.workerModelData);
	}
}
