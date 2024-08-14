import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { MaterialModule } from '../material.module';
import { AccessDeniedComponent } from './components/access-denied.component';
import { AddressAndIsSameFlagComponent } from './components/address-and-is-same-flag.component';
import { AddressAutocompleteComponent } from './components/address-autocomplete.component';
import { AddressComponent } from './components/address.component';
import { AlertUpdateOrRenewalComponent } from './components/alert-update-or-renewal.component';
import { AlertComponent } from './components/alert.component';
import { ApplicationsListCurrentComponent } from './components/applications-list-current.component';
import { BaseFilterComponent } from './components/base-filter.component';
import { CaptchaV2Component } from './components/captcha-v2.component';
import { CollectionNoticeComponent } from './components/collection-notice.component';
import { ContainerComponent } from './components/container.component';
import { DialogOopsComponent } from './components/dialog-oops.component';
import { DialogComponent } from './components/dialog.component';
import { DropdownOverlayComponent } from './components/dropdown-overlay.component';
import { ExpiredLicenceComponent } from './components/expired-licence.component';
import { FileUploadComponent } from './components/file-upload.component';
import { LicenceListExpiredComponent } from './components/licence-list-expired.component';
import { LicenceReprintComponent } from './components/licence-reprint.component';
import { ModalAddressComponent } from './components/modal-address.component';
import { ModalBizSelectionComponent } from './components/modal-biz-selection.component';
import { ModalFingerprintTearOffComponent } from './components/modal-fingerprint-tear-off.component';
import { ModalLookupByLicenceNumberComponent } from './components/modal-lookup-by-licence-number.component';
import { PaymentCancelComponent } from './components/payment-cancel.component';
import { PaymentErrorComponent } from './components/payment-error.component';
import { PaymentFailComponent } from './components/payment-fail.component';
import { PaymentSuccessComponent } from './components/payment-success.component';
import { SpdFooterComponent } from './components/spd-footer.component';
import { SpdHeaderComponent } from './components/spd-header.component';
import { StepSectionComponent } from './components/step-section.component';
import { StepTitleComponent } from './components/step-title.component';
import { WizardFooterComponent } from './components/wizard-footer.component';
import { WizardOutsideFooterComponent } from './components/wizard-outside-footer.component';
import { FileDragNDropDirective } from './directives/file-drag-n-drop.directive';
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
	ModalBizSelectionComponent,
	AddressAutocompleteComponent,
	ModalAddressComponent,
	DropdownOverlayComponent,
	BaseFilterComponent,
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
	ContainerComponent,
	FileDragNDropDirective,
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
