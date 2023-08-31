import { OverlayModule } from '@angular/cdk/overlay';
import { formatDate } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Injectable, NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
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
import { SPD_CONSTANTS } from './core/constants/constants';

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
	MatBadgeModule,
	OverlayModule,
];

export const APP_DATE_FORMATS = {
	parse: {
		dateInput: SPD_CONSTANTS.date.dateFormat,
	},
	display: {
		dateInput: 'input',
		monthYearLabel: SPD_CONSTANTS.date.monthYearFormat,
		dateA11yLabel: SPD_CONSTANTS.date.dateFormat,
		monthYearA11yLabel: SPD_CONSTANTS.date.monthYearFormat,
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
			return formatDate(date, SPD_CONSTANTS.date.dateFormat, this.locale);
		} else {
			return date.toDateString();
		}
	}
}

@Injectable()
export class SpdDateYearMonthAdapter extends NativeDateAdapter {
	override format(date: Date, displayFormat: Object): string {
		if (displayFormat === 'input') {
			return formatDate(date, SPD_CONSTANTS.date.monthYearFormat, this.locale);
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
				width: '600px',
				hasBackdrop: true,
				disableClose: true,
				autoFocus: 'dialog',
				role: 'dialog',
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
