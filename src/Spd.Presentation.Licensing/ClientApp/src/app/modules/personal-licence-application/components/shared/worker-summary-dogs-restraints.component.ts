import { Component, Input } from '@angular/core';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';

@Component({
	selector: 'app-worker-summary-dogs-restraints',
	template: `
		<ng-container *ngIf="showDogsAndRestraints">
			<mat-divider class="mt-3 mb-2"></mat-divider>
			<div class="text-minor-heading-small">Restraints Authorization</div>
			<div class="row mt-0">
				<div class="col-lg-4 col-md-12">
					<div class="text-label d-block text-muted">Request to Use Restraints?</div>
					<div class="summary-text-data">
						{{ carryAndUseRestraints | options: 'BooleanTypes' }}
					</div>
				</div>
				<ng-container *ngIf="carryAndUseRestraints === booleanTypeYes">
					<div class="col-xl-4 col-lg-6 col-md-12">
						<div class="text-label d-block text-muted">Proof of Qualification</div>
						<div class="summary-text-data">
							{{ carryAndUseRestraintsDocument | options: 'RestraintDocumentTypes' }}
						</div>
					</div>
					<div class="col-xl-4 col-lg-6 col-md-12">
						<div class="text-label d-block text-muted">Proof of Qualification Documents</div>
						<div class="summary-text-data">
							<ul class="m-0">
								<ng-container *ngFor="let doc of carryAndUseRestraintsAttachments; let i = index">
									<li>{{ doc.name }}</li>
								</ng-container>
							</ul>
						</div>
					</div>
				</ng-container>
			</div>

			<mat-divider class="mt-3 mb-2"></mat-divider>
			<div class="text-minor-heading-small">Dogs Authorization</div>
			<div class="row mt-0">
				<div class="col-lg-4 col-md-12">
					<div class="text-label d-block text-muted">Request to Use Dogs?</div>
					<div class="summary-text-data">{{ useDogs }}</div>
				</div>
				<ng-container *ngIf="useDogs === booleanTypeYes">
					<div class="col-lg-4 col-md-12">
						<div class="text-label d-block text-muted">Reason</div>
						<div class="summary-text-data">
							<div *ngIf="isDogsPurposeProtection">Protection</div>
							<div *ngIf="isDogsPurposeDetectionDrugs">Detection - Drugs</div>
							<div *ngIf="isDogsPurposeDetectionExplosives">Detection - Explosives</div>
						</div>
					</div>
					<div class="col-lg-4 col-md-12">
						<div class="text-label d-block text-muted">Dog Validation Certificate</div>
						<div class="summary-text-data">
							<ul class="m-0">
								<ng-container *ngFor="let doc of dogsPurposeAttachments; let i = index">
									<li>{{ doc.name }}</li>
								</ng-container>
							</ul>
						</div>
					</div>
				</ng-container>
			</div>
		</ng-container>
	`,
	styles: [],
})
export class WorkerSummaryDogsRestraintsComponent {
	booleanTypeYes = BooleanTypeCode.Yes;

	constructor(private workerApplicationService: WorkerApplicationService) {}

	@Input() workerModelData: any;

	get carryAndUseRestraints(): string {
		return this.workerApplicationService.getSummarycarryAndUseRestraints(this.workerModelData);
	}
	get carryAndUseRestraintsDocument(): string {
		return this.workerApplicationService.getSummarycarryAndUseRestraintsDocument(this.workerModelData);
	}
	get carryAndUseRestraintsAttachments(): File[] {
		return this.workerApplicationService.getSummarycarryAndUseRestraintsAttachments(this.workerModelData);
	}
	get showDogsAndRestraints(): boolean {
		return this.workerApplicationService.getSummaryshowDogsAndRestraints(this.workerModelData);
	}
	get useDogs(): string {
		return this.workerApplicationService.getSummaryuseDogs(this.workerModelData);
	}
	get isDogsPurposeProtection(): string {
		return this.workerApplicationService.getSummaryisDogsPurposeProtection(this.workerModelData);
	}
	get isDogsPurposeDetectionDrugs(): string {
		return this.workerApplicationService.getSummaryisDogsPurposeDetectionDrugs(this.workerModelData);
	}
	get isDogsPurposeDetectionExplosives(): string {
		return this.workerApplicationService.getSummaryisDogsPurposeDetectionExplosives(this.workerModelData);
	}
	get dogsPurposeAttachments(): File[] {
		return this.workerApplicationService.getSummarydogsPurposeAttachments(this.workerModelData);
	}
}
