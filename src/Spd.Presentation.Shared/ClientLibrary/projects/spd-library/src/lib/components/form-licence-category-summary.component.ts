import { Component, Input } from '@angular/core';
import { WorkerCategoryTypeCode } from '@app/api/models';

@Component({
	selector: 'app-form-licence-category-summary',
	template: `
		<ng-container *ngIf="categoryList">
			<mat-divider class="mt-3 mb-2" *ngIf="showDivider"></mat-divider>
			<div class="text-minor-heading-small">Licence Categories</div>
			<div class="row mt-0">
				<div class="col-12">
					<div class="text-label d-block text-muted">Licence Categories</div>
					<div class="summary-text-data">
						<ul class="m-0">
							<ng-container *ngFor="let category of categoryList; let i = index">
								<li>{{ category | options: 'WorkerCategoryTypes' }}</li>
							</ng-container>
						</ul>
					</div>
				</div>
			</div>
		</ng-container>
	`,
	styles: [],
	standalone: false,
})
export class FormLicenceCategorySummaryComponent {
	@Input() categoryList!: Array<WorkerCategoryTypeCode>;
	@Input() showDivider = true;
}
