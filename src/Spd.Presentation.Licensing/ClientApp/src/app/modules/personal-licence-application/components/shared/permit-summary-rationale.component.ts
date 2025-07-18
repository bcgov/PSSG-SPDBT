import { Component, Input } from '@angular/core';
import { PermitApplicationService } from '@app/core/services/permit-application.service';

@Component({
    selector: 'app-permit-summary-rationale',
    template: `
		<div class="text-minor-heading-small">Rationale</div>
		<div class="row mt-0">
		  <div class="col-12">
		    <div class="text-label d-block text-muted">{{ rationaleLabel }}</div>
		    <div class="summary-text-data">
		      {{ rationale }}
		    </div>
		  </div>
		  @if (isRationaleAttachments) {
		    <div class="col-12">
		      <div class="text-label d-block text-muted">Rationale Supporting Documents</div>
		      <div class="summary-text-data">
		        <ul class="m-0">
		          @for (doc of rationaleAttachments; track doc; let i = $index) {
		            <li>{{ doc.name }}</li>
		          }
		        </ul>
		      </div>
		    </div>
		  }
		</div>
		`,
    styles: [],
    standalone: false
})
export class PermitSummaryRationaleComponent {
	constructor(private permitApplicationService: PermitApplicationService) {}

	@Input() permitModelData: any;

	get rationaleLabel(): string {
		return this.permitApplicationService.getSummaryrationaleLabel(this.permitModelData);
	}
	get rationale(): string {
		return this.permitApplicationService.getSummaryrationale(this.permitModelData);
	}
	get isRationaleAttachments(): boolean {
		return this.permitApplicationService.getSummaryisRationaleAttachments(this.permitModelData);
	}
	get rationaleAttachments(): File[] {
		return this.permitApplicationService.getSummaryrationaleAttachments(this.permitModelData);
	}
}
