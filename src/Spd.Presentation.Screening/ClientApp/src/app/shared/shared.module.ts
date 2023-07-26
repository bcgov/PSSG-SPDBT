import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { MaterialModule } from '../material.module';
import { AccessDeniedComponent } from './components/access-denied.component';
import { AddressAutocompleteComponent } from './components/address-autocomplete.component';
import { AddressModalComponent } from './components/address-modal.component';
import { AlertComponent } from './components/alert.component';
import { FooterComponent } from './components/app-footer.component';
import { HeaderComponent } from './components/app-header.component';
import { ApplicationsBannerComponent } from './components/applications-banner.component';
import { BaseFilterComponent } from './components/base-filter.component';
import { CaptchaV2Component } from './components/captcha-v2.component';
import { DialogComponent } from './components/dialog.component';
import { DropdownOverlayComponent } from './components/dropdown-overlay.component';
import { FileUploadComponent } from './components/file-upload.component';
import { IdentifyVerificationCommonComponent } from './components/identify-verification-common.component';
import { ManualSubmissionCommonComponent } from './components/manual-submission-common.component';
import { MonthPickerComponent } from './components/month-picker.component';
import { OrgSelectionModalComponent } from './components/org-selection-modal.component';
import { PaymentErrorComponent } from './components/payment-error.component';
import { PaymentFailComponent } from './components/payment-fail.component';
import { PaymentManualComponent } from './components/payment-manual.component';
import { PaymentSuccessComponent } from './components/payment-success.component';
import { SaStepApplSubmittedComponent } from './components/screening-application-steps/sa-step-appl-submitted.component';
import { SaStepEligibilityComponent } from './components/screening-application-steps/sa-step-eligibility.component';
import { SaStepLoginOptionsComponent } from './components/screening-application-steps/sa-step-login-options.component';
import { SaStepOrganizationInfoComponent } from './components/screening-application-steps/sa-step-organization-info.component';
import { SaStepPayForApplicationComponent } from './components/screening-application-steps/sa-step-pay-for-application.component';
import { SaStepPersonalInfoComponent } from './components/screening-application-steps/sa-step-personal-info.component';
import { SaStepTermsAndCondComponent } from './components/screening-application-steps/sa-step-terms-and-cond.component';
import { SaAgreementOfTermsComponent } from './components/screening-application-steps/step-components/sa-agreement-of-terms.component';
import { SaApplicationSubmittedComponent } from './components/screening-application-steps/step-components/sa-application-submitted.component';
import { SaChecklistComponent } from './components/screening-application-steps/step-components/sa-checklist.component';
import { SaConsentToCrcComponent } from './components/screening-application-steps/step-components/sa-consentToCrc.component';
import { SaContactInformationComponent } from './components/screening-application-steps/step-components/sa-contact-information.component';
import { SaDeclarationComponent } from './components/screening-application-steps/step-components/sa-declaration.component';
import { SaLogInOptionsComponent } from './components/screening-application-steps/step-components/sa-log-in-options.component';
import { SaMailingAddressComponent } from './components/screening-application-steps/step-components/sa-mailing-address.component';
import { SaPersonalInformationComponent } from './components/screening-application-steps/step-components/sa-personal-information.component';
import { SaPreviousNameComponent } from './components/screening-application-steps/step-components/sa-previous-name.component';
import { SaSecurityInformationComponent } from './components/screening-application-steps/step-components/sa-security-information.component';
import { SaSummaryComponent } from './components/screening-application-steps/step-components/summary.component';
import { ScreeningRequestAddCommonModalComponent } from './components/screening-request-add-common-modal.component';
import { ScreeningRequestsCommonComponent } from './components/screening-requests-common.component';
import { ScreeningStatusFilterCommonComponent } from './components/screening-status-filter-common.component';
import { ScreeningStatusesCommonComponent } from './components/screening-statuses-common.component';
import { StatusStatisticsComponent } from './components/status-statistics.component';
import { StepTitleComponent } from './components/step-title.component';
import { DefaultPipe } from './pipes/default.pipe';
import { FullnamePipe } from './pipes/fullname.pipe';
import { OptionsPipe } from './pipes/options.pipe';
import { YesNoPipe } from './pipes/yes-no.pipe';

const SHARED_COMPONENTS = [
	HeaderComponent,
	FooterComponent,
	DialogComponent,
	AddressAutocompleteComponent,
	AddressModalComponent,
	OrgSelectionModalComponent,
	DropdownOverlayComponent,
	BaseFilterComponent,
	StepTitleComponent,
	DefaultPipe,
	FullnamePipe,
	YesNoPipe,
	OptionsPipe,
	CaptchaV2Component,
	FileUploadComponent,
	AccessDeniedComponent,
	AlertComponent,
	StatusStatisticsComponent,
	ApplicationsBannerComponent,
	ScreeningStatusFilterCommonComponent,
	ScreeningStatusesCommonComponent,
	ScreeningRequestsCommonComponent,
	ScreeningRequestAddCommonModalComponent,
	IdentifyVerificationCommonComponent,
	ManualSubmissionCommonComponent,
	MonthPickerComponent,
	PaymentSuccessComponent,
	PaymentFailComponent,
	PaymentManualComponent,
	PaymentErrorComponent,
	SaStepEligibilityComponent,
	SaStepOrganizationInfoComponent,
	SaStepLoginOptionsComponent,
	SaStepPersonalInfoComponent,
	SaStepTermsAndCondComponent,
	SaStepPayForApplicationComponent,
	SaStepApplSubmittedComponent,
	SaContactInformationComponent,
	SaMailingAddressComponent,
	SaChecklistComponent,
	SaLogInOptionsComponent,
	SaAgreementOfTermsComponent,
	SaPersonalInformationComponent,
	SaPreviousNameComponent,
	SaSummaryComponent,
	SaSecurityInformationComponent,
	SaDeclarationComponent,
	SaApplicationSubmittedComponent,
	SaConsentToCrcComponent,
];

@NgModule({
	declarations: [...SHARED_COMPONENTS, BaseFilterComponent],
	imports: [
		CommonModule,
		MaterialModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		NgxMaskDirective,
		NgxMaskPipe,
		NgxDropzoneModule,
		RecaptchaFormsModule,
		RecaptchaModule,
	],
	providers: [provideNgxMask(), NgxMaskPipe, DatePipe, OptionsPipe],
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
