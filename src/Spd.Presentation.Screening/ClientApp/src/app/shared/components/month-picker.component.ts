import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import moment, { Moment } from 'moment';

export const MONTH_PICKER_FORMATS = {
	parse: {
		dateInput: 'LL',
	},
	display: {
		dateInput: 'MMMM YYYY', // this is the format showing on the input element
		monthYearLabel: 'MMMM YYYY', // this is showing on the calendar
	},
};

@Component({
	selector: 'app-month-picker',
	template: `
		<mat-form-field>
			<mat-label>{{ label }}</mat-label>
			<input matInput readonly [(ngModel)]="monthAndYear" [matDatepicker]="picker" [max]="maxDate" [min]="minDate" />
			<mat-hint>{{ hint }}</mat-hint>
			<mat-datepicker-toggle matSuffix (click)="onClearDate()">
				<mat-icon matDatepickerToggleIcon>clear</mat-icon>
			</mat-datepicker-toggle>
			<mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
			<mat-datepicker #picker [startView]="'year'" (monthSelected)="onMonthChanged($event, picker)"> </mat-datepicker>
		</mat-form-field>
	`,
	styles: [],
	providers: [
		{
			provide: DateAdapter,
			useClass: MomentDateAdapter,
			deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
		},

		{ provide: MAT_DATE_FORMATS, useValue: MONTH_PICKER_FORMATS },
	],
})
export class MonthPickerComponent {
	@Input() label = '';
	@Input() hint = '';
	@Input() monthAndYear: Moment | null = null;
	@Input() minDate: Moment | null = null;
	@Input() maxDate: Moment | null = null;

	@Output() monthAndYearChange = new EventEmitter<Moment | null>();

	onMonthChanged(value: any, widget: any): void {
		const selectedDate = moment(value);

		this.monthAndYear = selectedDate;
		this.monthAndYearChange.emit(selectedDate);

		widget.close();
	}

	onClearDate(): void {
		this.monthAndYear = null;

		this.monthAndYearChange.emit(null);
	}
}
