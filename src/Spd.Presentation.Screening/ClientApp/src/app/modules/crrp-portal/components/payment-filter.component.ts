import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { UtilService } from 'src/app/core/services/util.service';
import { BaseFilterComponent, FilterQueryList } from 'src/app/shared/components/base-filter.component';

export class PaymentFilter {
	search = '';
	fromDate = '';
	toDate = '';
	paid = '';
	notPaid = '';
}

export const PaymentFilterMap: Record<keyof PaymentFilter, string> = {
	search: 'searchText',
	fromDate: 'fromDate',
	toDate: 'toDate',
	paid: 'paid',
	notPaid: 'notpaid',
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
									<mat-date-range-input [rangePicker]="picker" [max]="maxDate" [min]="minDate">
										<input matStartDate formControlName="fromDate" placeholder="Start date" />
										<input matEndDate formControlName="toDate" placeholder="End date" />
									</mat-date-range-input>
									<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
									<mat-date-range-picker #picker></mat-date-range-picker>
									<mat-error *ngIf="formGroup.get('fromDate')?.hasError('matDatepickerMin')">
										This must be on or after {{ minDate | formatDate }}
									</mat-error>
									<mat-error *ngIf="formGroup.get('toDate')?.hasError('matDatepickerMax')">
										This must be on or before {{ maxDate | formatDate }}
									</mat-error>
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
				background-color: var(--color-primary-light);
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
	minDate = moment().subtract(1, 'year');
	maxDate = moment();

	@Input() formGroup: FormGroup = this.formBuilder.group({
		search: new FormControl(''),
		fromDate: new FormControl(''),
		toDate: new FormControl(''),
		paid: new FormControl(''),
		notPaid: new FormControl(''),
	});

	constructor(private formBuilder: FormBuilder, private utilService: UtilService) {
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
		const filterList: FilterQueryList[] = [];

		if (formGroupValue.fromDate) {
			const date = new Date(formGroupValue.fromDate);
			filterList.push({
				key: PaymentFilterMap['fromDate'],
				operator: 'equals',
				value: this.utilService.getDateString(date),
			});
		}

		if (formGroupValue.toDate) {
			const date = new Date(formGroupValue.toDate);
			filterList.push({
				key: PaymentFilterMap['toDate'],
				operator: 'equals',
				value: this.utilService.getDateString(date),
			});
		}

		if (formGroupValue.paid && formGroupValue.notPaid) {
			// do nothing
		} else if (formGroupValue.paid) {
			filterList.push({
				key: PaymentFilterMap['paid'],
				operator: 'equals',
				value: true,
			});
		} else if (formGroupValue.notPaid) {
			filterList.push({
				key: PaymentFilterMap['paid'],
				operator: 'equals',
				value: false,
			});
		}

		return filterList;
	}
}
