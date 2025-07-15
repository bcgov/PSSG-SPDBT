import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha-2';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { MaterialModule } from '../material.module';
import { AccessDeniedComponent } from './components/access-denied.component';
import { AlertComponent } from './components/alert.component';
import { CaptchaV2Component } from './components/captcha-v2.component';
import { ContainerComponent } from './components/container.component';
import { DialogOopsComponent } from './components/dialog-oops.component';
import { DialogComponent } from './components/dialog.component';
import { FileUploadComponent } from './components/file-upload.component';
import { FormAccessCodeAnonymousComponent } from './components/form-access-code-anonymous.component';
import { FormAddressSummaryComponent } from './components/form-address-summary.component';
import { FormAddressComponent } from './components/form-address.component';
import { FormLicenceListExpiredComponent } from './components/form-licence-list-expired.component';
import { FormPhotographOfYourselfUpdateComponent } from './components/form-photograph-of-yourself-update.component';
import { FormPhotographOfYourselfComponent } from './components/form-photograph-of-yourself.component';
import { SpdFooterComponent } from './components/spd-footer.component';
import { SpdHeaderComponent } from './components/spd-header.component';
import { StepSectionComponent } from './components/step-section.component';
import { StepTitleComponent } from './components/step-title.component';
import { WizardFooterComponent } from './components/wizard-footer.component';
import { FileDragNDropDirective } from './directives/file-drag-n-drop.directive';
import { DefaultPipe } from './pipes/default.pipe';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { FullnamePipe } from './pipes/fullname.pipe';
import { OptionsPipe } from './pipes/options.pipe';
import { FormatPhoneNumberPipe } from './pipes/phone-number.pipe';
import { YesNoPipe } from './pipes/yes-no.pipe';

const SHARED_COMPONENTS = [
	SpdHeaderComponent,
	SpdFooterComponent,
	DialogComponent,
	DialogOopsComponent,
	StepTitleComponent,
	StepSectionComponent,
	DefaultPipe,
	FullnamePipe,
	YesNoPipe,
	FormatDatePipe,
	FormatPhoneNumberPipe,
	OptionsPipe,
	CaptchaV2Component,
	FileUploadComponent,
	AccessDeniedComponent,
	AlertComponent,
	WizardFooterComponent,
	FormLicenceListExpiredComponent,
	ContainerComponent,
	FileDragNDropDirective,
	FormAddressComponent,
	FormAddressSummaryComponent,
	FormPhotographOfYourselfComponent,
	FormPhotographOfYourselfUpdateComponent,
	FormAccessCodeAnonymousComponent,
];

@NgModule({
	declarations: [...SHARED_COMPONENTS],
	imports: [
		CommonModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		NgxMaskDirective,
		NgxMaskPipe,
		RecaptchaFormsModule,
		RecaptchaModule,
	],
	providers: [
		provideNgxMask(),
		NgxMaskPipe,
		DatePipe,
		CurrencyPipe,
		FormatDatePipe,
		OptionsPipe,
		FormatPhoneNumberPipe,
	],
	exports: [
		CommonModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		NgxMaskDirective,
		NgxMaskPipe,
		...SHARED_COMPONENTS,
	],
})
export class SharedModule {}
