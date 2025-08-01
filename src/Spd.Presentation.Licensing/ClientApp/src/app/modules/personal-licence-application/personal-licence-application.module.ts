import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PermitApplicationBaseAnonymousComponent } from './components/anonymous/permit-application-base-anonymous.component';
import { PermitWizardAnonymousNewComponent } from './components/anonymous/permit-wizard-anonymous-new.component';
import { PermitWizardAnonymousRenewalComponent } from './components/anonymous/permit-wizard-anonymous-renewal.component';
import { PermitWizardAnonymousUpdateComponent } from './components/anonymous/permit-wizard-anonymous-update.component';
import { StepPermitAccessCodeComponent } from './components/anonymous/permit-wizard-step-components/step-permit-access-code.component';
import { StepPermitAliasesComponent } from './components/anonymous/permit-wizard-step-components/step-permit-aliases.component';
import { StepPermitBcDriverLicenceComponent } from './components/anonymous/permit-wizard-step-components/step-permit-bc-driver-licence.component';
import { StepPermitChecklistNewComponent } from './components/anonymous/permit-wizard-step-components/step-permit-checklist-new.component';
import { StepPermitChecklistRenewalComponent } from './components/anonymous/permit-wizard-step-components/step-permit-checklist-renewal.component';
import { StepPermitChecklistUpdateComponent } from './components/anonymous/permit-wizard-step-components/step-permit-checklist-update.component';
import { StepPermitCitizenshipComponent } from './components/anonymous/permit-wizard-step-components/step-permit-citizenship.component';
import { StepPermitConfirmationComponent } from './components/anonymous/permit-wizard-step-components/step-permit-confirmation.component';
import { StepPermitConsentAndDeclarationComponent } from './components/anonymous/permit-wizard-step-components/step-permit-consent-and-declaration.component';
import { StepPermitContactInformationComponent } from './components/anonymous/permit-wizard-step-components/step-permit-contact-information.component';
import { StepPermitCriminalHistoryComponent } from './components/anonymous/permit-wizard-step-components/step-permit-criminal-history.component';
import { StepPermitEmployerInformationComponent } from './components/anonymous/permit-wizard-step-components/step-permit-employer-information.component';
import { StepPermitExpiredComponent } from './components/anonymous/permit-wizard-step-components/step-permit-expired.component';
import { StepPermitMailingAddressComponent } from './components/anonymous/permit-wizard-step-components/step-permit-mailing-address.component';
import { StepPermitPersonalInformationComponent } from './components/anonymous/permit-wizard-step-components/step-permit-personal-information.component';
import { StepPermitPhotographOfYourselfAnonymousComponent } from './components/anonymous/permit-wizard-step-components/step-permit-photograph-of-yourself-anonymous.component';
import { StepPermitRationaleComponent } from './components/anonymous/permit-wizard-step-components/step-permit-rationale.component';
import { StepPermitReasonComponent } from './components/anonymous/permit-wizard-step-components/step-permit-reason.component';
import { StepPermitResidentialAddressComponent } from './components/anonymous/permit-wizard-step-components/step-permit-residential-address.component';
import { StepPermitSummaryAnonymousComponent } from './components/anonymous/permit-wizard-step-components/step-permit-summary-anonymous.component';
import { StepPermitTermsOfUseComponent } from './components/anonymous/permit-wizard-step-components/step-permit-terms-of-use.component';
import { StepPermitTypeAnonymousComponent } from './components/anonymous/permit-wizard-step-components/step-permit-type-anonymous.component';
import { StepsPermitContactComponent } from './components/anonymous/permit-wizard-step-components/steps-permit-contact.component';
import { StepsPermitDetailsNewComponent } from './components/anonymous/permit-wizard-step-components/steps-permit-details-new.component';
import { StepsPermitDetailsRenewalComponent } from './components/anonymous/permit-wizard-step-components/steps-permit-details-renewal.component';
import { StepsPermitDetailsUpdateComponent } from './components/anonymous/permit-wizard-step-components/steps-permit-details-update.component';
import { StepsPermitIdentificationAnonymousComponent } from './components/anonymous/permit-wizard-step-components/steps-permit-identification-anonymous.component';
import { StepsPermitPurposeAnonymousComponent } from './components/anonymous/permit-wizard-step-components/steps-permit-purpose.component-anonymous';
import { StepsPermitReviewAnonymousComponent } from './components/anonymous/permit-wizard-step-components/steps-permit-review-anonymous.component';
import { WorkerLicenceApplicationBaseAnonymousComponent } from './components/anonymous/worker-licence-application-base-anonymous.component';
import { WorkerLicenceWizardAnonymousNewComponent } from './components/anonymous/worker-licence-wizard-anonymous-new.component';
import { WorkerLicenceWizardAnonymousRenewalComponent } from './components/anonymous/worker-licence-wizard-anonymous-renewal.component';
import { WorkerLicenceWizardAnonymousReplacementComponent } from './components/anonymous/worker-licence-wizard-anonymous-replacement.component';
import { WorkerLicenceWizardAnonymousUpdateComponent } from './components/anonymous/worker-licence-wizard-anonymous-update.component';
import { StepWorkerLicenceAccessCodeComponent } from './components/anonymous/worker-licence-wizard-step-components/step-worker-licence-access-code.component';
import { StepWorkerLicenceApplicationTypeAnonymousComponent } from './components/anonymous/worker-licence-wizard-step-components/step-worker-licence-application-type-anonymous.component';
import { StepWorkerLicencePersonalInformationAnonymousComponent } from './components/anonymous/worker-licence-wizard-step-components/step-worker-licence-personal-information-anonymous.component';
import { StepWorkerLicenceSummaryAnonymousComponent } from './components/anonymous/worker-licence-wizard-step-components/step-worker-licence-summary-anonymous.component';
import { StepsWorkerLicenceIdentificationAnonymousComponent } from './components/anonymous/worker-licence-wizard-step-components/steps-worker-licence-identification-anonymous.component';
import { StepsWorkerLicenceReviewAnonymousComponent } from './components/anonymous/worker-licence-wizard-step-components/steps-worker-licence-review-anonymous.component';
import { PermitWizardAuthenticatedNewComponent } from './components/authenticated/permit-wizard-authenticated-new.component';
import { PermitWizardAuthenticatedRenewalComponent } from './components/authenticated/permit-wizard-authenticated-renewal.component';
import { PermitWizardAuthenticatedUpdateComponent } from './components/authenticated/permit-wizard-authenticated-update.component';
import { StepPermitPhotographOfYourselfNewComponent } from './components/authenticated/permit-wizard-step-components/step-permit-photograph-of-yourself-new.component';
import { StepPermitPhotographOfYourselfRenewAndUpdateComponent } from './components/authenticated/permit-wizard-step-components/step-permit-photograph-of-yourself-renew-and-update.component';
import { StepPermitPhotographOfYourselfComponent } from './components/authenticated/permit-wizard-step-components/step-permit-photograph-of-yourself.component';
import { StepPermitReviewNameChangeComponent } from './components/authenticated/permit-wizard-step-components/step-permit-review-name-change.component';
import { StepPermitSummaryAuthenticatedComponent } from './components/authenticated/permit-wizard-step-components/step-permit-summary-authenticated.component';
import { StepPermitSummaryUpdateAuthenticatedComponent } from './components/authenticated/permit-wizard-step-components/step-permit-summary-update-authenticated.component';
import { StepPermitUpdateTermsAuthenticatedComponent } from './components/authenticated/permit-wizard-step-components/step-permit-update-terms-authenticated.component';
import { StepPermitUserProfileComponent } from './components/authenticated/permit-wizard-step-components/step-permit-user-profile.component';
import { StepsPermitIdentificationAuthenticatedComponent } from './components/authenticated/permit-wizard-step-components/steps-permit-identification-authenticated.component';
import { StepsPermitPurposeAuthenticatedComponent } from './components/authenticated/permit-wizard-step-components/steps-permit-purpose-authenticated.component';
import { StepsPermitReviewAuthenticatedComponent } from './components/authenticated/permit-wizard-step-components/steps-permit-review-authenticated.component';
import { StepsPermitUpdatesAuthenticatedComponent } from './components/authenticated/permit-wizard-step-components/steps-permit-updates-authenticated.component';
import { CommonUserProfileComponent } from './components/authenticated/user-profile-components/common-user-profile.component';
import { UserProfileComponent } from './components/authenticated/user-profile.component';
import { WorkerLicenceReturnFromBlSoleProprietorComponent } from './components/authenticated/worker-licence-return-from-bl-sole-proprietor.component';
import { WorkerLicenceWizardAuthenticatedNewComponent } from './components/authenticated/worker-licence-wizard-authenticated-new.component';
import { WorkerLicenceWizardAuthenticatedRenewalComponent } from './components/authenticated/worker-licence-wizard-authenticated-renewal.component';
import { WorkerLicenceWizardAuthenticatedReplacementComponent } from './components/authenticated/worker-licence-wizard-authenticated-replacement.component';
import { WorkerLicenceWizardAuthenticatedUpdateComponent } from './components/authenticated/worker-licence-wizard-authenticated-update.component';
import { StepWorkerLicenceSummaryAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-step-components/step-worker-licence-summary-authenticated.component';
import { StepWorkerLicenceSummaryUpdateAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-step-components/step-worker-licence-summary-update-authenticated.component';
import { StepWorkerLicenceUpdateTermsAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-step-components/step-worker-licence-update-terms-authenticated.component';
import { StepsWorkerLicenceIdentificationAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-step-components/steps-worker-licence-identification-authenticated.component';
import { StepsWorkerLicenceReviewAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-step-components/steps-worker-licence-review-authenticated.component';
import { StepsWorkerLicenceUpdatesAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-step-components/steps-worker-licence-updates-authenticated.component';
import { CommonAliasListComponent } from './components/shared/common-step-components/common-alias-list.component';
import { CommonCriminalHistoryComponent } from './components/shared/common-step-components/common-criminal-history.component';
import { CommonSwlPermitTermsUpdateReplaceComponent } from './components/shared/common-step-components/common-swl-permit-terms-update-replace.component';
import { CommonSwlPermitTermsComponent } from './components/shared/common-step-components/common-swl-permit-terms.component';
import { StepWorkerLicenceConfirmationComponent } from './components/shared/common-step-components/step-worker-licence-confirmation.component';
import { LicenceApplicationBaseAuthenticatedComponent } from './components/shared/licence-application-base-authenticated.component';
import { LicenceFirstTimeUserSelectionComponent } from './components/shared/licence-first-time-user-selection.component';
import { LicenceFirstTimeUserTermsOfUseComponent } from './components/shared/licence-first-time-user-terms-of-use.component';
import { LicencePaymentCancelAnonymousComponent } from './components/shared/licence-payment-cancel-anonymous.component';
import { LicencePaymentCancelComponent } from './components/shared/licence-payment-cancel.component';
import { LicencePaymentErrorAnonymousComponent } from './components/shared/licence-payment-error-anonymous.component';
import { LicencePaymentErrorComponent } from './components/shared/licence-payment-error.component';
import { LicencePaymentFailAnonymousComponent } from './components/shared/licence-payment-fail-anonymous.component';
import { LicencePaymentFailComponent } from './components/shared/licence-payment-fail.component';
import { LicencePaymentSuccessAnonymousComponent } from './components/shared/licence-payment-success-anonymous.component';
import { LicencePaymentSuccessComponent } from './components/shared/licence-payment-success.component';
import { LicenceUpdateReceivedSuccessComponent } from './components/shared/licence-update-received-success.component';
import { PermitSummaryCharacteristicsComponent } from './components/shared/permit-summary-characteristics.component';
import { PermitSummaryCriminalHistoryComponent } from './components/shared/permit-summary-criminal-history.component';
import { PermitSummaryEmployerInformationComponent } from './components/shared/permit-summary-employer-information.component';
import { PermitSummaryPurposeComponent } from './components/shared/permit-summary-purpose.component';
import { PermitSummaryRationaleComponent } from './components/shared/permit-summary-rationale.component';
import { PermitUpdateReceivedSuccessComponent } from './components/shared/permit-update-received-success.component';
import { StepPermitPhysicalCharacteristicsComponent } from './components/shared/permit-wizard-step-components/step-permit-physical-characteristics.component';
import { StepPermitReprintComponent } from './components/shared/permit-wizard-step-components/step-permit-reprint.component';
import { PersonalLicenceMainApplicationsListComponent } from './components/shared/personal-licence-main-applications-list.component';
import { PersonalLicenceMainLicenceListComponent } from './components/shared/personal-licence-main-licence-list.component';
import { PersonalLicenceMainComponent } from './components/shared/personal-licence-main.component';
import { LicenceCategoryArmouredCarGuardComponent } from './components/shared/worker-licence-wizard-step-components/licence-category-armoured-car-guard.component';
import { LicenceCategoryFireInvestigatorComponent } from './components/shared/worker-licence-wizard-step-components/licence-category-fire-investigator.component';
import { LicenceCategoryLocksmithComponent } from './components/shared/worker-licence-wizard-step-components/licence-category-locksmith.component';
import { LicenceCategoryPrivateInvestigatorSupComponent } from './components/shared/worker-licence-wizard-step-components/licence-category-private-investigator-sup.component';
import { LicenceCategoryPrivateInvestigatorComponent } from './components/shared/worker-licence-wizard-step-components/licence-category-private-investigator.component';
import { LicenceCategorySecurityAlarmInstallerComponent } from './components/shared/worker-licence-wizard-step-components/licence-category-security-alarm-installer.component';
import { LicenceCategorySecurityConsultantComponent } from './components/shared/worker-licence-wizard-step-components/licence-category-security-consultant.component';
import { LicenceCategorySecurityGuardSupComponent } from './components/shared/worker-licence-wizard-step-components/licence-category-security-guard-sup.component';
import { LicenceCategorySecurityGuardComponent } from './components/shared/worker-licence-wizard-step-components/licence-category-security-guard.component';
import { StepWorkerLicenceAliasesComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-aliases.component';
import { StepWorkerLicenceBcDriverLicenceComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-bc-driver-licence.component';
import { StepWorkerLicenceCategoryComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-category.component';
import { StepWorkerLicenceChecklistNewComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-checklist-new.component';
import { StepWorkerLicenceChecklistRenewalComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-checklist-renewal.component';
import { StepWorkerLicenceChecklistUpdateComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-checklist-update.component';
import { StepWorkerLicenceCitizenshipComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-citizenship.component';
import { StepWorkerLicenceConsentAndDeclarationComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-consent-and-declaration.component';
import { StepWorkerLicenceContactInformationComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-contact-information.component';
import { StepWorkerLicenceCriminalHistoryComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-criminal-history.component';
import { StepWorkerLicenceDogsAuthorizationComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-dogs-authorization.component';
import { StepWorkerLicenceExpiredComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-expired.component';
import { StepWorkerLicenceFingerprintsComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-fingerprints.component';
import { StepWorkerLicenceMailingAddressAnonymousComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-mailing-address-anonymous.component';
import { StepWorkerLicenceMailingAddressReplacementAnonymousComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-mailing-address-replacement-anonymous.component';
import { StepWorkerLicenceMentalHealthConditionsComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-mental-health-conditions.component';
import { StepWorkerLicencePhotographOfYourselfAnonymousComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-photograph-of-yourself-anonymous.component';
import { StepWorkerLicencePhotographOfYourselfNewComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-photograph-of-yourself-new.component';
import { StepWorkerLicencePhotographOfYourselfRenewAndUpdateComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-photograph-of-yourself-renew-and-update.component';
import { StepWorkerLicencePhotographOfYourselfComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-photograph-of-yourself.component';
import { StepWorkerLicencePhysicalCharacteristicsComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-physical-characteristics.component';
import { StepWorkerLicencePoliceBackgroundComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-police-background.component';
import { StepWorkerLicenceResidentialAddressComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-residential-address.component';
import { StepWorkerLicenceRestraintsComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-restraints.component';
import { StepWorkerLicenceReviewNameChangeComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-review-name-change.component';
import { StepWorkerLicenceSoleProprietorComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-sole-proprietor.component';
import { StepWorkerLicenceTermComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-term.component';
import { StepWorkerLicenceTermsOfUseComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-terms-of-use.component';
import { StepWorkerLicenceUpdateFeeComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-update-fee.component';
import { StepWorkerLicenceUserProfileComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-user-profile.component';
import { StepsWorkerLicenceBackgroundComponent } from './components/shared/worker-licence-wizard-step-components/steps-worker-licence-background.component';
import { StepsWorkerLicenceSelectionComponent } from './components/shared/worker-licence-wizard-step-components/steps-worker-licence-selection.component';
import { WorkerSummaryBcDriversLicenceComponent } from './components/shared/worker-summary-bc-drivers-licence.component';
import { WorkerSummaryCharacteristicsComponent } from './components/shared/worker-summary-characteristics.component';
import { WorkerSummaryCitizenshipComponent } from './components/shared/worker-summary-citizenship.component';
import { WorkerSummaryCriminalHistoryComponent } from './components/shared/worker-summary-criminal-history.component';
import { WorkerSummaryDocumentsUploadedComponent } from './components/shared/worker-summary-documents-uploaded.component';
import { WorkerSummaryDogsRestraintsComponent } from './components/shared/worker-summary-dogs-restraints.component';
import { WorkerSummaryExpiredLicenceComponent } from './components/shared/worker-summary-expired-licence.component';
import { WorkerSummaryMentalHealthConditionsComponent } from './components/shared/worker-summary-mental-health-conditions.component';
import { WorkerSummaryPhotoOfYourselfComponent } from './components/shared/worker-summary-photo-of-yourself.component';
import { WorkerSummaryPoliceBackgroundComponent } from './components/shared/worker-summary-police-background.component';
import { PersonalLicenceApplicationBaseComponent } from './personal-licence-application-base.component';
import { LicenceApplicationRoutingModule } from './personal-licence-application-routing.module';

@NgModule({
	declarations: [
		WorkerLicenceReturnFromBlSoleProprietorComponent,
		PermitSummaryCharacteristicsComponent,
		PermitSummaryPurposeComponent,
		PermitSummaryRationaleComponent,
		PermitSummaryCriminalHistoryComponent,
		PermitSummaryEmployerInformationComponent,
		WorkerSummaryCharacteristicsComponent,
		WorkerSummaryExpiredLicenceComponent,
		WorkerSummaryDogsRestraintsComponent,
		WorkerSummaryDocumentsUploadedComponent,
		WorkerSummaryCitizenshipComponent,
		WorkerSummaryBcDriversLicenceComponent,
		WorkerSummaryPhotoOfYourselfComponent,
		WorkerSummaryPoliceBackgroundComponent,
		WorkerSummaryMentalHealthConditionsComponent,
		WorkerSummaryCriminalHistoryComponent,
		StepPermitUserProfileComponent,
		CommonAliasListComponent,
		CommonCriminalHistoryComponent,
		CommonSwlPermitTermsComponent,
		CommonSwlPermitTermsUpdateReplaceComponent,
		CommonUserProfileComponent,
		PersonalLicenceApplicationBaseComponent,
		LicenceCategoryArmouredCarGuardComponent,
		LicenceCategoryFireInvestigatorComponent,
		LicenceCategoryLocksmithComponent,
		LicenceCategoryPrivateInvestigatorComponent,
		LicenceCategoryPrivateInvestigatorSupComponent,
		LicenceCategorySecurityAlarmInstallerComponent,
		LicenceCategorySecurityConsultantComponent,
		LicenceCategorySecurityGuardComponent,
		LicenceCategorySecurityGuardSupComponent,
		LicencePaymentCancelComponent,
		LicencePaymentErrorComponent,
		LicencePaymentFailComponent,
		LicencePaymentSuccessComponent,
		LicencePaymentCancelAnonymousComponent,
		LicencePaymentErrorAnonymousComponent,
		LicencePaymentFailAnonymousComponent,
		LicencePaymentSuccessAnonymousComponent,
		LicenceUpdateReceivedSuccessComponent,
		PersonalLicenceMainLicenceListComponent,
		PermitApplicationBaseAnonymousComponent,
		PermitUpdateReceivedSuccessComponent,
		PermitWizardAnonymousNewComponent,
		PermitWizardAnonymousRenewalComponent,
		PermitWizardAnonymousUpdateComponent,
		PermitWizardAuthenticatedNewComponent,
		PermitWizardAuthenticatedRenewalComponent,
		PermitWizardAuthenticatedUpdateComponent,
		StepPermitAccessCodeComponent,
		StepPermitAliasesComponent,
		StepPermitBcDriverLicenceComponent,
		StepPermitChecklistNewComponent,
		StepPermitChecklistRenewalComponent,
		StepPermitChecklistUpdateComponent,
		StepPermitCitizenshipComponent,
		StepPermitConfirmationComponent,
		StepPermitConsentAndDeclarationComponent,
		StepPermitContactInformationComponent,
		StepPermitCriminalHistoryComponent,
		StepPermitEmployerInformationComponent,
		StepPermitExpiredComponent,
		StepPermitMailingAddressComponent,
		StepPermitPersonalInformationComponent,
		StepPermitPhotographOfYourselfAnonymousComponent,
		StepPermitPhotographOfYourselfComponent,
		StepPermitPhotographOfYourselfNewComponent,
		StepPermitPhotographOfYourselfRenewAndUpdateComponent,
		StepPermitPhysicalCharacteristicsComponent,
		StepPermitRationaleComponent,
		StepPermitReasonComponent,
		StepPermitReprintComponent,
		StepPermitResidentialAddressComponent,
		StepPermitReviewNameChangeComponent,
		StepPermitSummaryAuthenticatedComponent,
		StepPermitSummaryAnonymousComponent,
		StepPermitSummaryUpdateAuthenticatedComponent,
		StepPermitTermsOfUseComponent,
		StepPermitUpdateTermsAuthenticatedComponent,
		StepPermitTypeAnonymousComponent,
		StepWorkerLicenceAccessCodeComponent,
		StepWorkerLicenceAliasesComponent,
		StepWorkerLicenceApplicationTypeAnonymousComponent,
		StepWorkerLicenceBcDriverLicenceComponent,
		StepWorkerLicenceCategoryComponent,
		StepWorkerLicenceChecklistNewComponent,
		StepWorkerLicenceChecklistRenewalComponent,
		StepWorkerLicenceChecklistUpdateComponent,
		StepWorkerLicenceCitizenshipComponent,
		StepWorkerLicenceConfirmationComponent,
		StepWorkerLicenceConsentAndDeclarationComponent,
		StepWorkerLicenceContactInformationComponent,
		StepWorkerLicenceCriminalHistoryComponent,
		StepWorkerLicenceDogsAuthorizationComponent,
		StepWorkerLicenceExpiredComponent,
		StepWorkerLicenceFingerprintsComponent,
		StepWorkerLicenceMailingAddressAnonymousComponent,
		StepWorkerLicenceMailingAddressReplacementAnonymousComponent,
		StepWorkerLicenceMentalHealthConditionsComponent,
		StepWorkerLicencePersonalInformationAnonymousComponent,
		StepWorkerLicencePhotographOfYourselfAnonymousComponent,
		StepWorkerLicencePhotographOfYourselfComponent,
		StepWorkerLicencePhotographOfYourselfNewComponent,
		StepWorkerLicencePhotographOfYourselfRenewAndUpdateComponent,
		StepWorkerLicencePhysicalCharacteristicsComponent,
		StepWorkerLicencePoliceBackgroundComponent,
		StepWorkerLicenceResidentialAddressComponent,
		StepWorkerLicenceRestraintsComponent,
		StepWorkerLicenceReviewNameChangeComponent,
		StepWorkerLicenceSoleProprietorComponent,
		StepWorkerLicenceSummaryAnonymousComponent,
		StepWorkerLicenceSummaryAuthenticatedComponent,
		StepWorkerLicenceSummaryUpdateAuthenticatedComponent,
		StepWorkerLicenceTermComponent,
		StepWorkerLicenceTermsOfUseComponent,
		StepWorkerLicenceUpdateFeeComponent,
		StepWorkerLicenceUpdateTermsAuthenticatedComponent,
		StepWorkerLicenceUserProfileComponent,
		StepsPermitContactComponent,
		StepsPermitDetailsNewComponent,
		StepsPermitDetailsRenewalComponent,
		StepsPermitDetailsUpdateComponent,
		StepsPermitIdentificationAnonymousComponent,
		StepsPermitIdentificationAuthenticatedComponent,
		StepsPermitPurposeAuthenticatedComponent,
		StepsPermitPurposeAnonymousComponent,
		StepsPermitReviewAnonymousComponent,
		StepsPermitReviewAuthenticatedComponent,
		StepsPermitUpdatesAuthenticatedComponent,
		StepsWorkerLicenceBackgroundComponent,
		StepsWorkerLicenceIdentificationAnonymousComponent,
		StepsWorkerLicenceIdentificationAuthenticatedComponent,
		StepsWorkerLicenceReviewAnonymousComponent,
		StepsWorkerLicenceReviewAuthenticatedComponent,
		StepsWorkerLicenceUpdatesAuthenticatedComponent,
		StepsWorkerLicenceSelectionComponent,
		PersonalLicenceMainComponent,
		UserProfileComponent,
		WorkerLicenceApplicationBaseAnonymousComponent,
		LicenceApplicationBaseAuthenticatedComponent,
		LicenceFirstTimeUserSelectionComponent,
		LicenceFirstTimeUserTermsOfUseComponent,
		WorkerLicenceWizardAnonymousNewComponent,
		WorkerLicenceWizardAnonymousRenewalComponent,
		WorkerLicenceWizardAnonymousReplacementComponent,
		WorkerLicenceWizardAnonymousUpdateComponent,
		WorkerLicenceWizardAuthenticatedNewComponent,
		WorkerLicenceWizardAuthenticatedRenewalComponent,
		WorkerLicenceWizardAuthenticatedReplacementComponent,
		WorkerLicenceWizardAuthenticatedUpdateComponent,
		PersonalLicenceMainApplicationsListComponent,
	],
	imports: [SharedModule, LicenceApplicationRoutingModule],
	providers: [],
})
export class PersonalLicenceApplicationModule {}
