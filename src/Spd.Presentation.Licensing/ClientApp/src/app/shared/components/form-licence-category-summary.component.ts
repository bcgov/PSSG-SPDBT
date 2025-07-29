import { Component, Input } from '@angular/core';
import { WorkerCategoryTypeCode } from '@app/api/models';

@Component({
	selector: 'app-form-licence-category-summary',
	template: `
		@if (categoryList) {
			@if (showDivider) {
				<mat-divider class="mt-3 mb-2"></mat-divider>
			}
			<div class="text-minor-heading-small">Licence Categories</div>
			<div class="row mt-0">
				<div class="col-12">
					<div class="text-label d-block text-muted">Licence Categories</div>
					<div class="summary-text-data">
						<ul class="m-0">
							@for (category of categoryList; track category; let i = $index) {
								<li>{{ category | options: 'WorkerCategoryTypes' }}</li>
							}
						</ul>
					</div>
				</div>
			</div>
		}
	`,
	styles: [],
	standalone: false,
})
export class FormLicenceCategorySummaryComponent {
	@Input() categoryList!: Array<WorkerCategoryTypeCode>;
	@Input() showDivider = true;
}
