import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
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
];

export const APP_DATE_FORMAT = 'dd-MMM-yyyy';
export const APP_DATE_FORMATS = {
	parse: {
		// Reformat entered date values to this format
		dateInput: APP_DATE_FORMAT,
	},
	display: {
		dateInput: APP_DATE_FORMAT,
		monthYearLabel: 'MMM yyyy',
		dateA11yLabel: APP_DATE_FORMAT,
		monthYearA11yLabel: 'MMM yyyy',
	},
};

const matFormFieldCustomOptions: MatFormFieldDefaultOptions = {
	hideRequiredMarker: false,
	floatLabel: 'always',
	appearance: 'fill',
};

@NgModule({
	declarations: [],
	imports: [...AngularMaterialModules],
	exports: [...AngularMaterialModules],
	// providers: [
	//   {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}
	// ]
	providers: [
		// {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}

		{ provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
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
		// {
		// 	provide: STEPPER_GLOBAL_OPTIONS,
		// 	useValue: { displayDefaultIndicatorType: false },
		// },
		// {
		// 	provide: MAT_LUXON_DATE_ADAPTER_OPTIONS,
		// 	useValue: {
		// 		useUtc: false,
		// 		firstDayOfWeek: 0,
		// 	},
		// },
		// 	{
		// 		provide: DateAdapter,
		// 		useClass: RSVPCMSDateAdapter,
		// 		deps: [MAT_DATE_LOCALE, MAT_LUXON_DATE_ADAPTER_OPTIONS],
		// 	},
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MaterialModule {}
