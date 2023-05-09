import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BaseFilterComponent, FilterQueryList } from 'src/app/shared/components/base-filter.component';

export class PaymentFilter {
	search: string = '';
	startDate: string = '';
	endDate: string = '';
	paid: string = '';
	notPaid: string = '';
	applicantName: string = '';
	createdOn: string = '';
	contractedCompanyName: string = '';
}

export const PaymentFilterMap: Record<keyof PaymentFilter, string> = {
	search: 'searchText',
	startDate: 'startDate',
	endDate: 'endDate',
	paid: 'paid',
	notPaid: 'notpaid',
	applicantName: 'name',
	createdOn: 'submittedon',
	contractedCompanyName: 'companyname',
};

@Component({
	selector: 'app-payment-filter',
	template: `
		<div class="filter-panel">
			<form [formGroup]="formGroup" novalidate>
				<mat-toolbar>
					<span class="fw-bold">Filters</span>
					<button mat-icon-button aria-label="close" (click)="emitFilterClose()">
						<mat-icon>close</mat-icon>
					</button>
				</mat-toolbar>
				<mat-card>
					<mat-card-content class="mb-2 text-start">
						<div class="row">
							<div class="col-sm-12">
								<strong>Date Range</strong>
								<mat-form-field>
									<mat-date-range-input [rangePicker]="picker">
										<input matStartDate formControlName="startDate" placeholder="Start date" />
										<input matEndDate formControlName="endDate" placeholder="End date" />
									</mat-date-range-input>
									<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
									<mat-date-range-picker #picker></mat-date-range-picker>
								</mat-form-field>
							</div>
							<div class="col-sm-12">
								<strong>Statuses</strong>
								<mat-checkbox formControlName="paid" class="text-start"> Paid </mat-checkbox>
								<mat-checkbox formControlName="notPaid" class="text-start"> Not Paid </mat-checkbox>
							</div>
						</div>
					</mat-card-content>
					<mat-divider class="my-3"></mat-divider>
					<mat-card-actions>
						<button mat-stroked-button class="w-auto" (click)="emitFilterClear()">Clear</button>
						<button mat-flat-button class="w-auto" color="primary" (click)="emitFilterChange()">Search</button>
					</mat-card-actions>
				</mat-card>
			</form>
		</div>
	`,
	styles: [
		`
			.filter-panel {
				border: 2px solid var(--color-sidebar);
			}

			.mat-toolbar-single-row {
				justify-content: space-between;
				background-color: var(--color-sidebar);
				color: var(--color-white);
			}

			.mat-mdc-card {
				border-radius: 0;
			}

			.mat-mdc-card-actions {
				padding: 0 16px 16px 16px;
				display: flex;
				justify-content: space-between;
			}
		`,
	],
})
export class PaymentFilterComponent extends BaseFilterComponent {
	@Input() formGroup: FormGroup = this.formBuilder.group({
		search: new FormControl(''),
		startDate: new FormControl(''),
		endDate: new FormControl(''),
		paid: new FormControl(''),
		notPaid: new FormControl(''),
	});

	constructor(private formBuilder: FormBuilder) {
		super();
	}

	emitFilterChange() {
		this.filterChange.emit(this.constructFilterString(this.constructFilterList(this.formGroup.value)));
	}

	override emitFilterClear() {
		this.formGroup.reset();
		this.filterClear.emit();
	}

	private constructFilterList(formGroupValue: PaymentFilter): FilterQueryList[] {
		let filterList: FilterQueryList[] = [];

		if (formGroupValue.startDate) {
			// set time portion to midnight
			const date = new Date(formGroupValue.startDate);
			date.setHours(0, 0, 0);

			filterList.push({
				key: PaymentFilterMap['startDate'],
				operator: 'greaterThanOrEqualTo',
				value: date,
			});
		}

		if (formGroupValue.endDate) {
			// set time portion just before midnight
			const date = new Date(formGroupValue.endDate);
			date.setHours(23, 59, 59);

			filterList.push({
				key: PaymentFilterMap['endDate'],
				operator: 'lessThanOrEqualTo',
				value: date,
			});
		}

		if (formGroupValue.paid) {
			filterList.push({
				key: PaymentFilterMap['paid'],
				operator: 'equals',
				value: formGroupValue.paid,
			});
		}

		if (formGroupValue.notPaid) {
			filterList.push({
				key: PaymentFilterMap['notPaid'],
				operator: 'equals',
				value: formGroupValue.notPaid,
			});
		}

		return filterList;
	}
}
