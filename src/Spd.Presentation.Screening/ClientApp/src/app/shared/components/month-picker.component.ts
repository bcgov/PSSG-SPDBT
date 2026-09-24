import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DateFnsAdapter } from '@angular/material-date-fns-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

export const MONTH_PICKER_FORMATS = {
	parse: {
		dateInput: 'MMMM yyyy',
	},
	display: {
		dateInput: 'MMMM yyyy', // this is the format showing on the input element
		monthYearLabel: 'MMMM yyyy', // this is showing on the calendar
	},
};

@Component({
    selector: 'app-month-picker',
    template: `
		<form [formGroup]="form" novalidate>
			<mat-form-field>
				<mat-label>{{ label }}</mat-label>
				<input
					matInput
					readonly
					formControlName="monthAndYear"
					[matDatepicker]="picker"
					[max]="maxDate"
					[min]="minDate"
				/>
				<mat-hint>{{ hint }}</mat-hint>
				<mat-datepicker-toggle matSuffix (click)="onClearDate()">
					<mat-icon matDatepickerToggleIcon>clear</mat-icon>
				</mat-datepicker-toggle>
				<mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
				<mat-datepicker #picker [startView]="'year'" (monthSelected)="onMonthChanged($event, picker)"> </mat-datepicker>
			</mat-form-field>
		</form>
	`,
    styles: [],
    providers: [
        {
            provide: DateAdapter,
			useClass: DateFnsAdapter,
			deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MONTH_PICKER_FORMATS },
    ],
    standalone: false
})
export class MonthPickerComponent {
	@Input() label = '';
	@Input() hint = '';
	@Input() minDate: Date | null = null;
	@Input() maxDate: Date | null = null;
	@Input() form!: FormGroup;

	@Output() monthAndYearChange = new EventEmitter<Date | null>();

	onMonthChanged(value: any, widget: any): void {
		const selectedDate = value as Date;
		this.form.patchValue({ monthAndYear: selectedDate });

		this.monthAndYearChange.emit(selectedDate);

		widget.close();
	}

	onClearDate(): void {
		this.form.reset();

		this.monthAndYearChange.emit(null);
	}
}
