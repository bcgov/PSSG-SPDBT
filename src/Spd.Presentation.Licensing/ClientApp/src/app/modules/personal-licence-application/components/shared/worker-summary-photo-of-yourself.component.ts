import { Component, Input } from '@angular/core';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';

@Component({
	selector: 'app-worker-summary-photo-of-yourself',
	template: `
		<div class="text-minor-heading-small">Photograph of Yourself</div>
		<div class="row mt-0">
		  <div class="col-lg-6 col-md-12">
		    <div class="text-label d-block text-muted">Photograph of Yourself</div>
		    <div class="summary-text-data">
		      <ul class="m-0">
		        @for (doc of photoOfYourselfAttachments; track doc; let i = $index) {
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
export class WorkerSummaryPhotoOfYourselfComponent {
	constructor(private workerApplicationService: WorkerApplicationService) {}

	@Input() workerModelData: any;

	get photoOfYourselfAttachments(): File[] | null {
		return this.workerApplicationService.getSummaryphotoOfYourselfAttachments(this.workerModelData);
	}
}
