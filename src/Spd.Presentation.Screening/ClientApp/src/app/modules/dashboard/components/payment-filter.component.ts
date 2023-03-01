import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseFilterComponent } from 'src/app/shared/components/base-filter.component';

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
						<button mat-stroked-button class="action-button" (click)="emitFilterClear()">Clear</button>
						<button mat-raised-button class="action-button" color="accent" (click)="emitFilterChange()">Search</button>
					</mat-card-actions>
				</mat-card>
			</form>
		</div>
	`,
	styles: [
		`
			.filter-panel {
				border: 3px solid var(--color-yellow);
			}

			.mat-toolbar-single-row {
				justify-content: space-between;
				background-color: var(--color-grey-lightest);
				color: var(--color-primary);
			}

			.mat-mdc-card {
				border-radius: 0;
				background-color: var(--color-grey-lightest);
			}

			.mat-mdc-card-actions {
				padding: 0 16px 16px 16px;
				display: flex;
				justify-content: space-between;
			}

			.action-button {
				width: unset;
			}
		`,
	],
})
export class PaymentFilterComponent extends BaseFilterComponent {
	@Input() formGroup!: FormGroup;

	constructor(private formBuilder: FormBuilder) {
		super();
	}

	emitFilterChange() {
		this.filterChange.emit();
	}

	override emitFilterClear() {
		this.formGroup.reset();
		this.filterClear.emit();
	}
}
