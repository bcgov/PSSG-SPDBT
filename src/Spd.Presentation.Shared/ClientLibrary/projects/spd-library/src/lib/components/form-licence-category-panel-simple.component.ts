import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WorkerCategoryTypeCode } from '@app/api/models';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';

@Component({
	selector: 'app-form-licence-category-panel-simple',
	template: `
		<div class="row">
			<div class="col-12">
				<mat-expansion-panel class="my-3 w-100" [expanded]="expandCategory">
					<mat-expansion-panel-header>
						<mat-panel-title>
							{{ title }}
						</mat-panel-title>
					</mat-expansion-panel-header>
					<div class="row my-3">
						<div class="col-12 mx-auto">
							<button
								mat-stroked-button
								class="xlarge w-auto float-end"
								aria-label="Remove category"
								(click)="onRemove()"
							>
								<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove this Category
							</button>
						</div>
					</div>

					<div class="row my-4">
						<div class="col-12 text-center">
							<mat-icon style="vertical-align: sub;" class="me-2">check_box</mat-icon>{{ title }}
						</div>
					</div>
				</mat-expansion-panel>
			</div>
		</div>
	`,
	styles: [],
	standalone: false,
})
export class FormLicenceCategoryPanelSimpleComponent implements OnInit {
	form = this.workerApplicationService.categoryClosedCircuitTelevisionInstallerFormGroup;
	title = '';

	@Input() categoryTypeCode!: WorkerCategoryTypeCode;
	@Input() expandCategory!: boolean;

	@Output() removeCategory: EventEmitter<WorkerCategoryTypeCode> = new EventEmitter();

	constructor(
		private optionsPipe: OptionsPipe,
		private workerApplicationService: WorkerApplicationService
	) {}

	ngOnInit(): void {
		this.title = this.optionsPipe.transform(this.categoryTypeCode, 'WorkerCategoryTypes');
	}

	onRemove(): void {
		this.removeCategory.emit(this.categoryTypeCode);
	}
}
