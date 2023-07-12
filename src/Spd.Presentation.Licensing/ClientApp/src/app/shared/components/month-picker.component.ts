import { Platform } from '@angular/cdk/platform';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { SpdDateYearMonthAdapter } from 'src/app/material.module';

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
			useClass: SpdDateYearMonthAdapter,
			deps: [MAT_DATE_LOCALE, Platform],
		},
	],
})
export class MonthPickerComponent {
	@Input() label = '';
	@Input() hint = '';
	@Input() monthAndYear: Date | null = null;
	@Input() minDate: Date | null = null;
	@Input() maxDate: Date | null = null;

	@Output() monthAndYearChange = new EventEmitter<Date | null>();

	onMonthChanged(value: any, widget: any): void {
		const selectedDate = new Date(value);

		this.monthAndYear = selectedDate;
		this.monthAndYearChange.emit(selectedDate);

		widget.close();
	}

	onClearDate(): void {
		this.monthAndYear = null;

		this.monthAndYearChange.emit(null);
	}
}
