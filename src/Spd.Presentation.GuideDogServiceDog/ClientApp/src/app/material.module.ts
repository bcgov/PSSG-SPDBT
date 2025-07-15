import { OverlayModule } from '@angular/cdk/overlay';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MAT_RADIO_DEFAULT_OPTIONS, MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SPD_CONSTANTS } from '@app/core/constants/constants';

const AngularMaterialModules = [
	MatToolbarModule,
	MatButtonModule,
	MatButtonToggleModule,
	MatSidenavModule,
	MatIconModule,
	MatListModule,
	MatInputModule,
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
		dateInput: SPD_CONSTANTS.date.dateFormat,
		monthYearLabel: SPD_CONSTANTS.date.monthYearFormat,
		dateA11yLabel: 'DDD',
		monthYearA11yLabel: SPD_CONSTANTS.date.monthYearFormat,
	},
};

const matFormFieldCustomOptions: MatFormFieldDefaultOptions = {
	hideRequiredMarker: false,
	// floatLabel: 'always',
	appearance: 'fill',
};

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
			useClass: MomentDateAdapter,
			deps: [MAT_DATE_LOCALE],
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
