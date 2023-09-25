import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ApplicationPortalStatusCode } from 'src/app/api/models';
import { SelectOptions } from 'src/app/core/code-types/model-desc.models';
import { PortalTypeCode } from 'src/app/core/code-types/portal-type.model';
import { UtilService } from 'src/app/core/services/util.service';
import { BaseFilterComponent, FilterQueryList } from 'src/app/shared/components/base-filter.component';

export class ScreeningStatusFilter {
	search: string = '';
	applications: string = 'MY'; // MY vs ALL Applications
	statuses: string[] = [];
	applicantName: string = '';
	createdOn: string = '';
	contractedCompanyName: string = '';
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
						<mat-form-field class="multi-select-filter" style="min-width: 600px; min-height: 200px">
							<mat-label>Filter by status</mat-label>
							<mat-select formControlName="statuses" placeholder="All statuses" multiple>
								<mat-select-trigger>
									<mat-chip-listbox>
										<mat-chip
											*ngFor="let status of statuses.value"
											[removable]="true"
											(removed)="onItemRemoved(status)"
											selected
										>
											{{ getFilterStatusDesc(status) }}
											<mat-icon matChipRemove>cancel</mat-icon>
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
						<button mat-stroked-button class="large w-auto" (click)="emitFilterClear()">Clear</button>
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
				background-color: var(--color-sidebar);
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
	@Input() formGroup: FormGroup = this.formBuilder.group({
		statuses: new FormControl(),
	});

	constructor(private formBuilder: FormBuilder, private utilService: UtilService) {
		super();
	}

	ngOnInit(): void {
		if (this.portal == PortalTypeCode.Psso) {
			this.applicationPortalStatusCodes = this.utilService
				.getCodeDescSorted('ApplicationPortalStatusTypes')
				.filter(
					(item) =>
						item.code == ApplicationPortalStatusCode.VerifyIdentity ||
						item.code == ApplicationPortalStatusCode.InProgress ||
						item.code == ApplicationPortalStatusCode.AwaitingThirdParty ||
						item.code == ApplicationPortalStatusCode.AwaitingApplicant ||
						item.code == ApplicationPortalStatusCode.UnderAssessment ||
						item.code == ApplicationPortalStatusCode.CompletedCleared ||
						item.code == ApplicationPortalStatusCode.RiskFound ||
						item.code == ApplicationPortalStatusCode.ClosedNoResponse ||
						item.code == ApplicationPortalStatusCode.ClosedNoConsent ||
						item.code == ApplicationPortalStatusCode.CancelledByOrganization
				);
		} else {
			this.applicationPortalStatusCodes = this.utilService.getCodeDescSorted('ApplicationPortalStatusTypes');
		}
	}

	onItemRemoved(item: string) {
		const items = [...this.statuses.value] as string[];
		this.utilService.removeFirstFromArray(items, item);
		this.statuses.setValue(items); // To trigger change detection
	}

	emitFilterChange() {
		this.filterChange.emit(this.constructFilterString(this.constructFilterList(this.formGroup.value)));
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
		let filterList: FilterQueryList[] = [];

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
