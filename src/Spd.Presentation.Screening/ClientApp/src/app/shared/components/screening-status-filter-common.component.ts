import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SelectOptions } from 'src/app/core/code-types/model-desc.models';
import { PortalTypeCode } from 'src/app/core/code-types/portal-type.model';
import { UtilService } from 'src/app/core/services/util.service';
import { BaseFilterComponent, FilterQueryList } from 'src/app/shared/components/base-filter.component';

export class ScreeningStatusFilter {
	search = '';
	applications = 'MY'; // MY vs ALL Applications
	statuses: string[] = [];
	applicantName = '';
	createdOn = '';
	contractedCompanyName = '';
}

export const ScreeningStatusFilterMap: Record<keyof ScreeningStatusFilter, string> = {
	search: 'searchText',
	applications: 'applications',
	statuses: 'status',
	applicantName: 'name',
	createdOn: 'submittedon',
	contractedCompanyName: 'companyname',
};

@Component({
	selector: 'app-screening-status-filter-common',
	template: `
		<div class="filter-container mat-elevation-z8">
			<form [formGroup]="formGroup" novalidate>
				<mat-toolbar>
					<span class="fw-bold">Filters</span>
					<button mat-icon-button aria-label="close" (click)="emitFilterClose()">
						<mat-icon>close</mat-icon>
					</button>
				</mat-toolbar>
				<mat-card>
					<mat-card-content class="mb-2 text-start">
						<mat-form-field class="multi-select-filter" style="min-width: 600px; min-height: 300px">
							<mat-label>Filter by status</mat-label>
							<mat-select formControlName="statuses" placeholder="All statuses" multiple>
								<mat-select-trigger>
									<mat-chip-listbox>
										<mat-chip
											class="filter-chip"
											*ngFor="let status of statuses.value"
											[removable]="true"
											(removed)="onItemRemoved(status)"
											selected
										>
											{{ getFilterStatusDesc(status) }}
											<mat-icon matChipRemove class="filter-chip__icon">cancel</mat-icon>
										</mat-chip>
									</mat-chip-listbox>
								</mat-select-trigger>

								<mat-option *ngFor="let status of applicationPortalStatusCodes" [value]="status.code">
									{{ status.desc }}
								</mat-option>
							</mat-select>
						</mat-form-field>
					</mat-card-content>
					<mat-divider class="my-3"></mat-divider>
					<mat-card-actions>
						<div>
							<button mat-stroked-button class="large w-auto me-2" (click)="emitFilterClear()">Clear</button>
							<button mat-flat-button class="large mat-green-button w-auto" (click)="emitFilterReset()">Reset</button>
						</div>
						<button mat-flat-button class="large w-auto" color="primary" (click)="emitFilterChange()">Search</button>
					</mat-card-actions>
				</mat-card>
			</form>
		</div>
	`,
	styles: [
		`
			.mat-toolbar-single-row {
				justify-content: space-between;
				background-color: var(--color-primary-light);
				color: var(--color-white);
			}

			.mat-mdc-card {
				border-radius: 0;
				/* background-color: var(--color-grey-lightest); */
			}

			.mat-mdc-card-actions {
				padding: 0 16px 16px 16px;
				display: flex;
				justify-content: space-between;
			}
		`,
	],
})
export class ScreeningStatusFilterCommonComponent extends BaseFilterComponent implements OnInit {
	applicationPortalStatusCodes!: SelectOptions[];

	@Input() portal: PortalTypeCode | null = null;
	@Input() formGroup: FormGroup = this.formBuilder.group(new ScreeningStatusFilter());

	@Output() filterReset = new EventEmitter();

	constructor(private formBuilder: FormBuilder, private utilService: UtilService) {
		super();
	}

	ngOnInit(): void {
		this.applicationPortalStatusCodes = this.utilService.getCodeDescSorted('ApplicationPortalStatusTypes');
	}

	onItemRemoved(item: string) {
		const items = [...this.statuses.value] as string[];
		this.utilService.removeFirstFromArray(items, item);
		this.statuses.setValue(items); // To trigger change detection
	}

	emitFilterChange() {
		this.filterChange.emit(this.constructFilterString(this.constructFilterList(this.formGroup.value)));
	}

	emitFilterReset() {
		this.formGroup.reset();
		this.formGroup.patchValue({ applications: 'MY' });

		this.filterReset.emit();
	}

	override emitFilterClear() {
		this.formGroup.reset();
		this.formGroup.patchValue({ applications: 'MY' });

		this.filterClear.emit();
	}

	getFilterStatusDesc(code: string): string {
		return this.utilService.getApplicationPortalStatusDesc(code);
	}

	private constructFilterList(formGroupValue: ScreeningStatusFilter): FilterQueryList[] {
		const filterList: FilterQueryList[] = [];

		if (formGroupValue.statuses?.length > 0) {
			filterList.push({
				key: ScreeningStatusFilterMap['statuses'],
				operator: 'equals',
				value: formGroupValue.statuses.join('|'),
			});
		}

		return filterList;
	}

	get statuses(): FormControl {
		return this.formGroup.get('statuses') as FormControl;
	}
}
