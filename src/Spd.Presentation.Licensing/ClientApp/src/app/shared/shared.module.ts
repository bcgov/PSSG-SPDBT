import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha-2';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { MaterialModule } from '../material.module';
import { AccessDeniedComponent } from './components/access-denied.component';
import { AlertComponent } from './components/alert.component';
import { BaseFilterComponent } from './components/base-filter.component';
import { CaptchaV2Component } from './components/captcha-v2.component';
import { CollectionNoticeComponent } from './components/collection-notice.component';
import { ContainerComponent } from './components/container.component';
import { DialogOopsComponent } from './components/dialog-oops.component';
import { DialogComponent } from './components/dialog.component';
import { DropdownOverlayComponent } from './components/dropdown-overlay.component';
import { FileUploadComponent } from './components/file-upload.component';
import { FormAccessCodeAnonymousComponent } from './components/form-access-code-anonymous.component';
import { FormAddressAndIsSameFlagComponent } from './components/form-address-and-is-same-flag.component';
import { FormAddressAutocompleteComponent } from './components/form-address-autocomplete.component';
import { FormAddressSummaryComponent } from './components/form-address-summary.component';
import { FormAddressComponent } from './components/form-address.component';
import { FormAlertUpdateOrRenewalComponent } from './components/form-alert-update-or-renewal.component';
import { FormAliasesComponent } from './components/form-aliases.component';
import { FormBcDriverLicenceComponent } from './components/form-bc-driver-licence.component';
import { FormBusinessTermsComponent } from './components/form-business-terms.component';
import { FormContactInformationComponent } from './components/form-contact-information.component';
import { FormExpiredLicenceComponent } from './components/form-expired-licence.component';
import { FormFingerprintsComponent } from './components/form-fingerprints.component';
import { FormLicenceCategoryPanelSimpleComponent } from './components/form-licence-category-panel-simple.component';
import { FormLicenceCategorySummaryComponent } from './components/form-licence-category-summary.component';
import { FormLicenceListExpiredComponent } from './components/form-licence-list-expired.component';
import { FormLicenceReprintComponent } from './components/form-licence-reprint.component';
import { FormMentalHealthConditionsComponent } from './components/form-mental-health-conditions.component';
import { FormPersonalInformationNewAnonymousComponent } from './components/form-personal-information-new-anonymous.component';
import { FormPersonalInformationRenewUpdateAnonymousComponent } from './components/form-personal-information-renew-update-anonymous.component';
import { FormPersonalInformationComponent } from './components/form-personal-information.component';
import { FormPhotographOfYourselfUpdateComponent } from './components/form-photograph-of-yourself-update.component';
import { FormPhotographOfYourselfComponent } from './components/form-photograph-of-yourself.component';
import { FormPhysicalCharacteristicsComponent } from './components/form-physical-characteristics.component';
import { FormPoliceBackgroundComponent } from './components/form-police-background.component';
import { FormSwlCitizenshipComponent } from './components/form-swl-citizenship.component';
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
	PaymentCancelComponent,
	PaymentSuccessComponent,
	PaymentErrorComponent,
	PaymentFailComponent,
	BaseFilterComponent,
	ModalAddressComponent,
	ModalFingerprintTearOffComponent,
	WizardFooterComponent,
	WizardOutsideFooterComponent,
	PhoneNumberTransformDirective,
	CollectionNoticeComponent,
	ModalLookupByLicenceNumberComponent,
	FormLicenceListExpiredComponent,
	FormAlertUpdateOrRenewalComponent,
	FormLicenceReprintComponent,
	FormExpiredLicenceComponent,
	FormAddressAndIsSameFlagComponent,
	ContainerComponent,
	FileDragNDropDirective,
	FormAddressAutocompleteComponent,
	FormAddressComponent,
	FormAddressSummaryComponent,
	FormLicenceCategorySummaryComponent,
	FormAliasesComponent,
	FormBusinessTermsComponent,
	FormFingerprintsComponent,
	FormBcDriverLicenceComponent,
	FormPoliceBackgroundComponent,
	FormMentalHealthConditionsComponent,
	FormSwlCitizenshipComponent,
	FormContactInformationComponent,
	FormPersonalInformationComponent,
	FormPersonalInformationNewAnonymousComponent,
	FormPersonalInformationRenewUpdateAnonymousComponent,
	FormPhotographOfYourselfComponent,
	FormPhotographOfYourselfUpdateComponent,
	FormPhysicalCharacteristicsComponent,
	FormLicenceCategoryPanelSimpleComponent,
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
