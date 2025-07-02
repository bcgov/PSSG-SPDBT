import { Component, Input } from '@angular/core';
import { PoliceOfficerRoleCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';

@Component({
	selector: 'app-worker-summary-police-background',
	template: `
		<div class="text-minor-heading-small">Police Background</div>
		<div class="row mt-0">
		  <div class="col-lg-4 col-md-12">
		    <div class="text-label d-block text-muted">Police Officer or Peace Officer Roles</div>
		    <div class="summary-text-data">{{ isPoliceOrPeaceOfficer }}</div>
		  </div>
		  @if (isPoliceOrPeaceOfficer === booleanTypeCodes.Yes) {
		    <div class="col-lg-4 col-md-12">
		      <div class="text-label d-block text-muted">Role</div>
		      <div class="summary-text-data">
		        @if (policeOfficerRoleCode !== policeOfficerRoleCodes.Other) {
		          <span>{{
		            policeOfficerRoleCode | options: 'PoliceOfficerRoleTypes' | default
		          }}</span>
		        } @else {
		          Other: {{ otherOfficerRole }}
		        }
		      </div>
		    </div>
		    @if (letterOfNoConflictAttachments) {
		      <div class="col-lg-4 col-md-12">
		        <div class="text-label d-block text-muted">Letter of No Conflict</div>
		        <div class="summary-text-data">
		          <ul class="m-0">
		            @for (doc of letterOfNoConflictAttachments; track doc; let i = $index) {
		              <li>{{ doc.name }}</li>
		            }
		          </ul>
		        </div>
		      </div>
		    }
		  }
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
