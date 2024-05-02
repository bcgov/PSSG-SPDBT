import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { MaterialModule } from '../material.module';
import { AccessDeniedComponent } from './components/access-denied.component';
import { AddressAutocompleteComponent } from './components/address-autocomplete.component';
import { AlertComponent } from './components/alert.component';
import { BaseFilterComponent } from './components/base-filter.component';
import { BizSelectionModalComponent } from './components/biz-selection-modal.component';
import { CaptchaV2Component } from './components/captcha-v2.component';
import { CommonPaymentCancelComponent } from './components/common-payment-cancel.component';
import { CommonPaymentErrorComponent } from './components/common-payment-error.component';
import { CommonPaymentFailComponent } from './components/common-payment-fail.component';
import { CommonPaymentSuccessComponent } from './components/common-payment-success.component';
import { DialogOopsComponent } from './components/dialog-oops.component';
import { DialogComponent } from './components/dialog.component';
import { DropdownOverlayComponent } from './components/dropdown-overlay.component';
import { FileUploadComponent } from './components/file-upload.component';
import { ModalAddressComponent } from './components/modal-address.component';
import { ModalFingerprintTearOffComponent } from './components/modal-fingerprint-tear-off.component';
import { SpdFooterComponent } from './components/spd-footer.component';
import { SpdHeaderComponent } from './components/spd-header.component';
import { StepTitleComponent } from './components/step-title.component';
import { WizardFooterComponent } from './components/wizard-footer.component';
import { DefaultPipe } from './pipes/default.pipe';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { FullnamePipe } from './pipes/fullname.pipe';
import { OptionsPipe } from './pipes/options.pipe';
import { YesNoPipe } from './pipes/yes-no.pipe';

const SHARED_COMPONENTS = [
	SpdHeaderComponent,
	SpdFooterComponent,
	DialogComponent,
	DialogOopsComponent,
	BizSelectionModalComponent,
	AddressAutocompleteComponent,
	ModalAddressComponent,
	DropdownOverlayComponent,
	BaseFilterComponent,
	StepTitleComponent,
	DefaultPipe,
	FullnamePipe,
	YesNoPipe,
	FormatDatePipe,
	OptionsPipe,
	FormatDatePipe,
	CaptchaV2Component,
	FileUploadComponent,
	AccessDeniedComponent,
	AlertComponent,
	CommonPaymentCancelComponent,
	CommonPaymentSuccessComponent,
	CommonPaymentErrorComponent,
	CommonPaymentFailComponent,
	BaseFilterComponent,
	ModalFingerprintTearOffComponent,
	WizardFooterComponent,
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
		NgxDropzoneModule,
		RecaptchaFormsModule,
		RecaptchaModule,
	],
	providers: [provideNgxMask(), NgxMaskPipe, DatePipe, CurrencyPipe, FormatDatePipe, OptionsPipe],
	exports: [
		CommonModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		NgxMaskDirective,
		NgxMaskPipe,
		NgxDropzoneModule,
		...SHARED_COMPONENTS,
	],
})
export class SharedModule {}
