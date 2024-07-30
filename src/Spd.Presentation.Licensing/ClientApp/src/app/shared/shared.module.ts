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
import { CollectionNoticeComponent } from './components/collection-notice.component';
import { AddressAndIsSameFlagComponent } from './components/address-and-is-same-flag.component';
import { AddressComponent } from './components/address.component';
import { ExpiredLicenceComponent } from './components/expired-licence.component';
import { PaymentCancelComponent } from './components/payment-cancel.component';
import { PaymentErrorComponent } from './components/payment-error.component';
import { PaymentFailComponent } from './components/payment-fail.component';
import { PaymentSuccessComponent } from './components/payment-success.component';
import { LicenceReprintComponent } from './components/licence-reprint.component';
import { AlertUpdateOrRenewalComponent } from './components/alert-update-or-renewal.component';
import { DialogOopsComponent } from './components/dialog-oops.component';
import { DialogComponent } from './components/dialog.component';
import { DropdownOverlayComponent } from './components/dropdown-overlay.component';
import { FileUploadComponent } from './components/file-upload.component';
import { ApplicationsListCurrentComponent } from './components/applications-list-current.component';
import { LicenceListExpiredComponent } from './components/licence-list-expired.component';
import { ModalAddressComponent } from './components/modal-address.component';
import { ModalFingerprintTearOffComponent } from './components/modal-fingerprint-tear-off.component';
import { ModalLookupByLicenceNumberComponent } from './components/modal-lookup-by-licence-number.component';
import { SpdFooterComponent } from './components/spd-footer.component';
import { SpdHeaderComponent } from './components/spd-header.component';
import { StepTitleComponent } from './components/step-title.component';
import { WizardFooterComponent } from './components/wizard-footer.component';
import { WizardOutsideFooterComponent } from './components/wizard-outside-footer.component';
import { PhoneNumberTransformDirective } from './directives/phone-number-transform.directive';
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
	FormatPhoneNumberPipe,
	OptionsPipe,
	CaptchaV2Component,
	FileUploadComponent,
	AccessDeniedComponent,
	AlertComponent,
	AddressComponent,
	PaymentCancelComponent,
	PaymentSuccessComponent,
	PaymentErrorComponent,
	PaymentFailComponent,
	BaseFilterComponent,
	ModalFingerprintTearOffComponent,
	WizardFooterComponent,
	WizardOutsideFooterComponent,
	PhoneNumberTransformDirective,
	CollectionNoticeComponent,
	ModalLookupByLicenceNumberComponent,
	LicenceListExpiredComponent,
	ApplicationsListCurrentComponent,
	AlertUpdateOrRenewalComponent,
	LicenceReprintComponent,
	ExpiredLicenceComponent,
	AddressAndIsSameFlagComponent,
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
		NgxDropzoneModule,
		...SHARED_COMPONENTS,
	],
})
export class SharedModule {}
