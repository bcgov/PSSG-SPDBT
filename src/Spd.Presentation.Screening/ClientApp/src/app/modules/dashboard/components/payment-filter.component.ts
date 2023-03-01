import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseFilterComponent } from 'src/app/shared/components/base-filter.component';

@Component({
	selector: 'app-payment-filter',
	template: `
		<form [formGroup]="formGroup" novalidate>
			<mat-toolbar color="accent" style="justify-content: space-between;">
				<span>Filters</span>
				<button mat-icon-button aria-label="close" (click)="emitFilterClose()">
					<mat-icon>close</mat-icon>
				</button>
			</mat-toolbar>
			<mat-card style="background-color: whitesmoke; border-radius: 0;">
				<mat-card-content class="mb-2" style="text-align: left;">
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
							<mat-checkbox formControlName="paid" style="text-align: start;"> Paid </mat-checkbox>
							<mat-checkbox formControlName="notPaid" style="text-align: start;"> Not Paid </mat-checkbox>
						</div>
					</div>
				</mat-card-content>
				<mat-divider class="my-3"></mat-divider>
				<mat-card-actions>
					<div class="w-100">
						<div style="display: flex; justify-content: space-between;">
							<button mat-stroked-button class="action-button" (click)="emitFilterClear()">Clear</button>
							<button mat-raised-button class="action-button" color="accent" (click)="emitFilterChange()">Apply</button>
						</div>
					</div>
				</mat-card-actions>
			</mat-card>
		</form>
	`,
	styles: [
		`
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
		this.filterClear.emit();
	}
}
