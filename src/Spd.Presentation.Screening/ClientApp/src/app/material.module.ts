import { formatDate } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Injectable, NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

const AngularMaterialModules = [
	MatToolbarModule,
	MatButtonModule,
	MatButtonToggleModule,
	MatSidenavModule,
	MatIconModule,
	MatListModule,
	MatInputModule,
	MatDatepickerModule,
	MatCheckboxModule,
	MatSelectModule,
	MatExpansionModule,
	MatTabsModule,
	MatTableModule,
	MatPaginatorModule,
	MatSortModule,
	MatCardModule,
	MatDialogModule,
	MatMenuModule,
	MatRadioModule,
	MatTooltipModule,
	MatSlideToggleModule,
	MatStepperModule,
	MatChipsModule,
	MatNativeDateModule,
	MatAutocompleteModule,
];

export const APP_CONSTANTS = {
	date: {
		dateFormat: 'yyyy-MMM-dd',
		monthYearFormat: 'MMM yyyy',
	},
};

export const APP_DATE_FORMATS = {
	parse: {
		dateInput: APP_CONSTANTS.date.dateFormat,
	},
	display: {
		dateInput: 'input',
		monthYearLabel: APP_CONSTANTS.date.monthYearFormat,
		dateA11yLabel: APP_CONSTANTS.date.dateFormat,
		monthYearA11yLabel: APP_CONSTANTS.date.monthYearFormat,
	},
};

const matFormFieldCustomOptions: MatFormFieldDefaultOptions = {
	hideRequiredMarker: false,
	floatLabel: 'always',
	appearance: 'fill',
};

@Injectable()
export class SpdDateAdapter extends NativeDateAdapter {
	override format(date: Date, displayFormat: Object): string {
		if (displayFormat === 'input') {
			// Return the format as per your requirement
			return formatDate(date, APP_CONSTANTS.date.dateFormat, this.locale);
		} else {
			return date.toDateString();
		}
	}
}

@NgModule({
	declarations: [],
	imports: [...AngularMaterialModules],
	exports: [...AngularMaterialModules],
	providers: [
		{
			provide: MAT_DATE_FORMATS,
			useValue: APP_DATE_FORMATS,
		},
		{
			provide: DateAdapter,
			useClass: SpdDateAdapter,
		},
		{
			provide: MAT_RADIO_DEFAULT_OPTIONS,
			useValue: { color: 'primary' },
		},
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				width: '500px',
				hasBackdrop: true,
			},
		},
		{
			provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
			useValue: matFormFieldCustomOptions,
		},
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MaterialModule {}
