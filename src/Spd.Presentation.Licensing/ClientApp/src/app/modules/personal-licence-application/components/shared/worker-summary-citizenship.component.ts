import { Component, Input } from '@angular/core';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';

@Component({
	selector: 'app-worker-summary-citizenship',
	template: `
		<div class="text-minor-heading-small">Citizenship</div>
		<div class="row mt-0">
			<div class="col-lg-6 col-md-12">
				<div class="text-label d-block text-muted">Are you a Canadian citizen?</div>
				<div class="summary-text-data">{{ isCanadianCitizen }}</div>
			</div>
			<div class="col-lg-6 col-md-12">
				<div class="text-label d-block text-muted">
					@if (canadianCitizenProofTypeCode) {
						<span>
							{{ canadianCitizenProofTypeCode | options: 'ProofOfCanadianCitizenshipTypes' }}
						</span>
					}
					@if (notCanadianCitizenProofTypeCode) {
						<span>
							{{ notCanadianCitizenProofTypeCode | options: 'ProofOfAbilityToWorkInCanadaTypes' }}
						</span>
					}
				</div>
				<div class="summary-text-data">
					<ul class="m-0">
						@for (doc of citizenshipAttachments; track doc; let i = $index) {
							<li>{{ doc.name }}</li>
						}
					</ul>
				</div>
			</div>
			@if (governmentIssuedPhotoTypeCode) {
				<div class="col-lg-6 col-md-12">
					<div class="text-label d-block text-muted">
						{{ governmentIssuedPhotoTypeCode | options: 'GovernmentIssuedPhotoIdTypes' }}
					</div>
					<div class="summary-text-data">
						<ul class="m-0">
							@for (doc of governmentIssuedPhotoAttachments; track doc; let i = $index) {
								<li>{{ doc.name }}</li>
							}
						</ul>
					</div>
				</div>
			}
		</div>
	`,
	styles: [],
	standalone: false,
})
export class WorkerSummaryCitizenshipComponent {
	constructor(private workerApplicationService: WorkerApplicationService) {}

	@Input() workerModelData: any;

	get isCanadianCitizen(): string {
		return this.workerApplicationService.getSummaryisCanadianCitizen(this.workerModelData);
	}
	get canadianCitizenProofTypeCode(): string {
		return this.workerApplicationService.getSummarycanadianCitizenProofTypeCode(this.workerModelData);
	}
	get notCanadianCitizenProofTypeCode(): string {
		return this.workerApplicationService.getSummarynotCanadianCitizenProofTypeCode(this.workerModelData);
	}
	get proofOfAbility(): string {
		return this.workerApplicationService.getSummaryproofOfAbility(this.workerModelData);
	}
	get citizenshipExpiryDate(): string {
		return this.workerApplicationService.getSummarycitizenshipExpiryDate(this.workerModelData);
	}
	get citizenshipAttachments(): File[] {
		return this.workerApplicationService.getSummarycitizenshipAttachments(this.workerModelData);
	}
	get governmentIssuedPhotoTypeCode(): string {
		return this.workerApplicationService.getSummarygovernmentIssuedPhotoTypeCode(this.workerModelData);
	}
	get governmentIssuedPhotoExpiryDate(): string {
		return this.workerApplicationService.getSummarygovernmentIssuedPhotoExpiryDate(this.workerModelData);
	}
	get governmentIssuedPhotoAttachments(): File[] {
		return this.workerApplicationService.getSummarygovernmentIssuedPhotoAttachments(this.workerModelData);
	}
}
