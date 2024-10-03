import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WorkerCategoryTypeCode } from '@app/api/models';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';

@Component({
	selector: 'app-licence-category-panel-simple',
	template: `
		<div class="row">
			<div class="col-md-12 col-sm-12" [ngClass]="blockCategory ? 'col-xl-10 col-lg-9' : 'col-xl-12 col-lg-12'">
				<mat-expansion-panel
					class="my-3 w-100"
					[hideToggle]="blockCategory"
					[ngClass]="{ 'disabled-pointer': blockCategory }"
					[disabled]="blockCategory"
					[expanded]="expandCategory"
				>
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

			<div class="col-xl-2 col-lg-3 col-md-12 col-sm-12" *ngIf="blockCategory">
				<button
					mat-stroked-button
					class="large delete-button my-lg-3"
					aria-label="Remove category"
					(click)="onDeselect()"
				>
					<mat-icon class="d-none d-md-block">delete_outline</mat-icon>Remove
				</button>
			</div>
		</div>
	`,
	styles: [],
})
export class LicenceCategoryPanelSimpleComponent implements OnInit {
	form = this.workerApplicationService.categoryClosedCircuitTelevisionInstallerFormGroup;
	title = '';

	@Input() categoryTypeCode!: WorkerCategoryTypeCode;
	@Input() blockCategory!: boolean;
	@Input() expandCategory!: boolean;

	@Output() removeCategory: EventEmitter<WorkerCategoryTypeCode> = new EventEmitter();
	@Output() deselectCategory: EventEmitter<WorkerCategoryTypeCode> = new EventEmitter();

	constructor(private optionsPipe: OptionsPipe, private workerApplicationService: WorkerApplicationService) {}

	ngOnInit(): void {
		this.title = this.optionsPipe.transform(this.categoryTypeCode, 'WorkerCategoryTypes');
	}

	onRemove(): void {
		this.removeCategory.emit(this.categoryTypeCode);
	}

	onDeselect(): void {
		this.deselectCategory.emit(this.categoryTypeCode);
	}
}
