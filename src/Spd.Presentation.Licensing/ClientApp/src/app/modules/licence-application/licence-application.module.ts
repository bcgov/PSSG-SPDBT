import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PermitApplicationBaseAnonymousComponent } from './components/anonymous/permit-application-base-anonymous.component';
import { PermitWizardAnonymousNewComponent } from './components/anonymous/permit-wizard-anonymous-new.component';
import { PermitWizardAnonymousRenewalComponent } from './components/anonymous/permit-wizard-anonymous-renewal.component';
import { PermitWizardAnonymousUpdateComponent } from './components/anonymous/permit-wizard-anonymous-update.component';
import { StepPermitAccessCodeComponent } from './components/anonymous/permit-wizard-steps/step-permit-access-code.component';
import { StepPermitAliasesComponent } from './components/anonymous/permit-wizard-steps/step-permit-aliases.component';
import { StepPermitBcDriverLicenceComponent } from './components/anonymous/permit-wizard-steps/step-permit-bc-driver-licence.component';
import { StepPermitChecklistNewComponent } from './components/anonymous/permit-wizard-steps/step-permit-checklist-new.component';
import { StepPermitChecklistRenewalComponent } from './components/anonymous/permit-wizard-steps/step-permit-checklist-renewal.component';
import { StepPermitChecklistUpdateComponent } from './components/anonymous/permit-wizard-steps/step-permit-checklist-update.component';
import { StepPermitCitizenshipComponent } from './components/anonymous/permit-wizard-steps/step-permit-citizenship.component';
import { StepPermitConfirmationComponent } from './components/anonymous/permit-wizard-steps/step-permit-confirmation.component';
import { StepPermitConsentAndDeclarationComponent } from './components/anonymous/permit-wizard-steps/step-permit-consent-and-declaration.component';
import { StepPermitContactInformationComponent } from './components/anonymous/permit-wizard-steps/step-permit-contact-information.component';
import { StepPermitCriminalHistoryComponent } from './components/anonymous/permit-wizard-steps/step-permit-criminal-history.component';
import { StepPermitEmployerInformationComponent } from './components/anonymous/permit-wizard-steps/step-permit-employer-information.component';
import { StepPermitExpiredComponent } from './components/anonymous/permit-wizard-steps/step-permit-expired.component';
import { StepPermitFingerprintsComponent } from './components/anonymous/permit-wizard-steps/step-permit-fingerprints.component';
import { StepPermitMailingAddressComponent } from './components/anonymous/permit-wizard-steps/step-permit-mailing-address.component';
import { StepPermitPersonalInformationComponent } from './components/anonymous/permit-wizard-steps/step-permit-personal-information.component';
import { StepPermitPhotographOfYourselfComponent } from './components/anonymous/permit-wizard-steps/step-permit-photograph-of-yourself.component';
import { StepPermitPhysicalCharacteristicsComponent } from './components/anonymous/permit-wizard-steps/step-permit-physical-characteristics.component';
import { StepPermitRationaleComponent } from './components/anonymous/permit-wizard-steps/step-permit-rationale.component';
import { StepPermitReasonComponent } from './components/anonymous/permit-wizard-steps/step-permit-reason.component';
import { StepPermitResidentialAddressComponent } from './components/anonymous/permit-wizard-steps/step-permit-residential-address.component';
import { StepPermitSummaryAnonymousComponent } from './components/anonymous/permit-wizard-steps/step-permit-summary-anonymous.component';
import { StepPermitTypeAnonymousComponent } from './components/anonymous/permit-wizard-steps/step-permit-type-anonymous.component';
import { StepsPermitContactComponent } from './components/anonymous/permit-wizard-steps/steps-permit-contact.component';
import { StepsPermitDetailsComponent } from './components/anonymous/permit-wizard-steps/steps-permit-details.component';
import { StepsPermitIdentificationComponent } from './components/anonymous/permit-wizard-steps/steps-permit-identification.component';
import { StepsPermitPurposeComponent } from './components/anonymous/permit-wizard-steps/steps-permit-purpose.component';
import { StepsPermitReviewAnonymousComponent } from './components/anonymous/permit-wizard-steps/steps-permit-review-anonymous.component';
import { WorkerLicenceApplicationBaseAnonymousComponent } from './components/anonymous/worker-licence-application-base-anonymous.component';
import { WorkerLicenceWizardAnonymousNewComponent } from './components/anonymous/worker-licence-wizard-anonymous-new.component';
import { WorkerLicenceWizardAnonymousRenewalComponent } from './components/anonymous/worker-licence-wizard-anonymous-renewal.component';
import { WorkerLicenceWizardAnonymousReplacementComponent } from './components/anonymous/worker-licence-wizard-anonymous-replacement.component';
import { WorkerLicenceWizardAnonymousUpdateComponent } from './components/anonymous/worker-licence-wizard-anonymous-update.component';
import { StepApplicationTypeAnonymousComponent } from './components/anonymous/worker-licence-wizard-steps/step-application-type-anonymous.component';
import { StepLicenceAccessCodeComponent } from './components/anonymous/worker-licence-wizard-steps/step-licence-access-code.component';
import { StepLicenceConfirmationComponent } from './components/anonymous/worker-licence-wizard-steps/step-licence-confirmation.component';
import { StepLicenceTypeAnonymousComponent } from './components/anonymous/worker-licence-wizard-steps/step-licence-type-anonymous.component';
import { StepPersonalInformationAnonymousComponent } from './components/anonymous/worker-licence-wizard-steps/step-personal-information-anonymous.component';
import { StepSummaryReviewLicenceAnonymousComponent } from './components/anonymous/worker-licence-wizard-steps/step-summary-review-licence-anonymous.component';
import { StepsIdentificationAnonymousComponent } from './components/anonymous/worker-licence-wizard-steps/steps-identification-anonymous.component';
import { StepsReviewLicenceAnonymousComponent } from './components/anonymous/worker-licence-wizard-steps/steps-review-licence-anonymous.component';
import { LoginUserProfileComponent } from './components/authenticated/login-user-profile.component';
import { UserApplicationsAuthenticatedComponent } from './components/authenticated/user-applications-authenticated.component';
import { WorkerLicenceApplicationBaseAuthenticatedComponent } from './components/authenticated/worker-licence-application-base-authenticated.component';
import { FirstTimeUserModalComponent } from './components/authenticated/worker-licence-step-update-components/first-time-user-modal.component';
import { UpdateAddDogsModalComponent } from './components/authenticated/worker-licence-step-update-components/update-add-dogs-modal.component';
import { UpdateAddRestraintsModalComponent } from './components/authenticated/worker-licence-step-update-components/update-add-restraints-modal.component';
import { UpdateApplyNameChangeModalComponent } from './components/authenticated/worker-licence-step-update-components/update-apply-name-change-modal.component';
import { UpdateLicenceCategoryModalComponent } from './components/authenticated/worker-licence-step-update-components/update-licence-category-modal.component';
import { UpdatePhotoModalComponent } from './components/authenticated/worker-licence-step-update-components/update-photo-modal.component';
import { StepConfirmMailingAddressComponent } from './components/authenticated/worker-licence-step-update-components/wizard-update-steps/step-confirm-mailing-address.component';
import { StepConfirmUpdatesComponent } from './components/authenticated/worker-licence-step-update-components/wizard-update-steps/step-confirm-updates.component';
import { StepLicenceUpdatesComponent } from './components/authenticated/worker-licence-step-update-components/wizard-update-steps/step-licence-updates.component';
import { WorkerLicenceWizardAuthenticatedNewComponent } from './components/authenticated/worker-licence-wizard-authenticated-new.component';
import { WorkerLicenceWizardAuthenticatedRenewComponent } from './components/authenticated/worker-licence-wizard-authenticated-renew.component';
import { WorkerLicenceWizardAuthenticatedUpdateComponent } from './components/authenticated/worker-licence-wizard-authenticated-update.component';
import { StepAccessCodeAuthorizedComponent } from './components/authenticated/worker-licence-wizard-steps/step-access-code-authorized.component';
import { StepApplicationTypeAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-steps/step-application-type-authenticated.component';
import { StepLicenceTypeAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-steps/step-licence-type-authenticated.component';
import { StepSummaryReviewLicenceAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-steps/step-summary-review-licence-authenticated.component';
import { StepsIdentificationAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-steps/steps-identification-authenticated.component';
import { StepsReviewLicenceAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-steps/steps-review-licence-authenticated.component';
import { LicencePaymentCancelComponent } from './components/shared/licence-payment-cancel.component';
import { LicencePaymentErrorComponent } from './components/shared/licence-payment-error.component';
import { LicencePaymentFailComponent } from './components/shared/licence-payment-fail.component';
import { LicencePaymentSuccessComponent } from './components/shared/licence-payment-success.component';
import { LoginSelectionComponent } from './components/shared/login-selection.component';
import { RenewalAlertComponent } from './components/shared/renewal-alert.component';
import { RenewalValueChangedComponent } from './components/shared/renewal-value-changed.component';
import { CommonAccessCodeAnonymousComponent } from './components/shared/step-components/common-access-code-anonymous.component';
import { CommonAliasListComponent } from './components/shared/step-components/common-alias-list.component';
import { CommonAliasesComponent } from './components/shared/step-components/common-aliases.component';
import { CommonBcDriverLicenceComponent } from './components/shared/step-components/common-bc-driver-licence.component';
import { CommonCitizenshipComponent } from './components/shared/step-components/common-citizenship.component';
import { CommonContactInformationComponent } from './components/shared/step-components/common-contact-information.component';
import { CommonCriminalHistoryComponent } from './components/shared/step-components/common-criminal-history.component';
import { CommonFingerprintsComponent } from './components/shared/step-components/common-fingerprints.component';
import { CommonMailingAddressComponent } from './components/shared/step-components/common-mailing-address.component';
import { CommonPersonalInformationNewAnonymousComponent } from './components/shared/step-components/common-personal-information-new-anonymous.component';
import { CommonPersonalInformationRenewAnonymousComponent } from './components/shared/step-components/common-personal-information-renew-anonymous.component';
import { CommonPhotographOfYourselfComponent } from './components/shared/step-components/common-photograph-of-yourself.component';
import { CommonPhysicalCharacteristicsComponent } from './components/shared/step-components/common-physical-characteristics.component';
import { CommonResidentialAddressComponent } from './components/shared/step-components/common-residential-address.component';
import { LicenceCategoryArmouredCarGuardComponent } from './components/shared/step-components/licence-category-armoured-car-guard.component';
import { LicenceCategoryBodyArmourSalesComponent } from './components/shared/step-components/licence-category-body-armour-sales.component';
import { LicenceCategoryClosedCircuitTelevisionInstallerComponent } from './components/shared/step-components/licence-category-closed-circuit-television-installer.component';
import { LicenceCategoryElectronicLockingDeviceInstallerComponent } from './components/shared/step-components/licence-category-electronic-locking-device-installer.component';
import { LicenceCategoryFireInvestigatorComponent } from './components/shared/step-components/licence-category-fire-investigator.component';
import { LicenceCategoryLocksmithSupComponent } from './components/shared/step-components/licence-category-locksmith-sup.component';
import { LicenceCategoryLocksmithComponent } from './components/shared/step-components/licence-category-locksmith.component';
import { LicenceCategoryPrivateInvestigatorSupComponent } from './components/shared/step-components/licence-category-private-investigator-sup.component';
import { LicenceCategoryPrivateInvestigatorComponent } from './components/shared/step-components/licence-category-private-investigator.component';
import { LicenceCategorySecurityAlarmInstallerSupComponent } from './components/shared/step-components/licence-category-security-alarm-installer-sup.component';
import { LicenceCategorySecurityAlarmInstallerComponent } from './components/shared/step-components/licence-category-security-alarm-installer.component';
import { LicenceCategorySecurityAlarmMonitorComponent } from './components/shared/step-components/licence-category-security-alarm-monitor.component';
import { LicenceCategorySecurityAlarmResponseComponent } from './components/shared/step-components/licence-category-security-alarm-response.component';
import { LicenceCategorySecurityAlarmSalesComponent } from './components/shared/step-components/licence-category-security-alarm-sales.component';
import { LicenceCategorySecurityConsultantComponent } from './components/shared/step-components/licence-category-security-consultant.component';
import { LicenceCategorySecurityGuardSupComponent } from './components/shared/step-components/licence-category-security-guard-sup.component';
import { LicenceCategorySecurityGuardComponent } from './components/shared/step-components/licence-category-security-guard.component';
import { PersonalInformationComponent } from './components/shared/step-components/personal-information.component';
import { UserProfileComponent } from './components/shared/step-components/user-profile.component';
import { StepAdditionalGovIdComponent } from './components/shared/worker-licence-wizard-child-steps/step-additional-gov-id.component';
import { StepAliasesComponent } from './components/shared/worker-licence-wizard-child-steps/step-aliases.component';
import { StepBcDriverLicenceComponent } from './components/shared/worker-licence-wizard-child-steps/step-bc-driver-licence.component';
import { StepChecklistNewWorkerComponent } from './components/shared/worker-licence-wizard-child-steps/step-checklist-new-worker.component';
import { StepChecklistRenewalWorkerComponent } from './components/shared/worker-licence-wizard-child-steps/step-checklist-renewal-worker.component';
import { StepChecklistUpdateWorkerComponent } from './components/shared/worker-licence-wizard-child-steps/step-checklist-update-worker.component';
import { StepCitizenshipComponent } from './components/shared/worker-licence-wizard-child-steps/step-citizenship.component';
import { StepConsentAndDeclarationComponent } from './components/shared/worker-licence-wizard-child-steps/step-consent-and-declaration.component';
import { StepContactInformationComponent } from './components/shared/worker-licence-wizard-child-steps/step-contact-information.component';
import { StepCriminalHistoryComponent } from './components/shared/worker-licence-wizard-child-steps/step-criminal-history.component';
import { StepDogsAuthorizationComponent } from './components/shared/worker-licence-wizard-child-steps/step-dogs-authorization.component';
import { StepFingerprintsComponent } from './components/shared/worker-licence-wizard-child-steps/step-fingerprints.component';
import { StepLicenceCategoryComponent } from './components/shared/worker-licence-wizard-child-steps/step-licence-category.component';
import { StepLicenceExpiredComponent } from './components/shared/worker-licence-wizard-child-steps/step-licence-expired.component';
import { StepLicenceTermComponent } from './components/shared/worker-licence-wizard-child-steps/step-licence-term.component';
import { StepLicenceUserProfileComponent } from './components/shared/worker-licence-wizard-child-steps/step-licence-user-profile.component';
import { StepMailingAddressComponent } from './components/shared/worker-licence-wizard-child-steps/step-mailing-address.component';
import { StepMentalHealthConditionsComponent } from './components/shared/worker-licence-wizard-child-steps/step-mental-health-conditions.component';
import { StepPhotographOfYourselfComponent } from './components/shared/worker-licence-wizard-child-steps/step-photograph-of-yourself.component';
import { StepPhysicalCharacteristicsComponent } from './components/shared/worker-licence-wizard-child-steps/step-physical-characteristics.component';
import { StepPoliceBackgroundRenewAndUpdateComponent } from './components/shared/worker-licence-wizard-child-steps/step-police-background-renew-and-update.component';
import { StepPoliceBackgroundComponent } from './components/shared/worker-licence-wizard-child-steps/step-police-background.component';
import { StepResidentialAddressComponent } from './components/shared/worker-licence-wizard-child-steps/step-residential-address.component';
import { StepRestraintsAuthorizationComponent } from './components/shared/worker-licence-wizard-child-steps/step-restraints-authorization.component';
import { StepSoleProprietorComponent } from './components/shared/worker-licence-wizard-child-steps/step-sole-proprietor.component';
import { StepsBackgroundRenewAndUpdateComponent } from './components/shared/worker-licence-wizard-steps/steps-background-renew-and-update.component';
import { StepsBackgroundComponent } from './components/shared/worker-licence-wizard-steps/steps-background.component';
import { StepsLicenceSelectionComponent } from './components/shared/worker-licence-wizard-steps/steps-licence-selection.component';
import { LicenceApplicationRoutingModule } from './licence-application-routing.module';
import { LicenceApplicationComponent } from './licence-application.component';
import { LicenceApplicationService } from './services/licence-application.service';

@NgModule({
	declarations: [
		CommonAliasListComponent,
		CommonAliasesComponent,
		CommonBcDriverLicenceComponent,
		CommonCitizenshipComponent,
		CommonCriminalHistoryComponent,
		CommonFingerprintsComponent,
		CommonPersonalInformationNewAnonymousComponent,
		CommonPersonalInformationRenewAnonymousComponent,
		CommonPhysicalCharacteristicsComponent,
		CommonPhotographOfYourselfComponent,
		CommonContactInformationComponent,
		FirstTimeUserModalComponent,
		LicenceApplicationComponent,
		LicenceCategoryArmouredCarGuardComponent,
		LicenceCategoryBodyArmourSalesComponent,
		LicenceCategoryClosedCircuitTelevisionInstallerComponent,
		LicenceCategoryElectronicLockingDeviceInstallerComponent,
		LicenceCategoryFireInvestigatorComponent,
		LicenceCategoryLocksmithComponent,
		LicenceCategoryLocksmithSupComponent,
		LicenceCategoryPrivateInvestigatorComponent,
		LicenceCategoryPrivateInvestigatorSupComponent,
		LicenceCategorySecurityAlarmInstallerComponent,
		LicenceCategorySecurityAlarmInstallerSupComponent,
		LicenceCategorySecurityAlarmMonitorComponent,
		LicenceCategorySecurityAlarmResponseComponent,
		LicenceCategorySecurityAlarmSalesComponent,
		LicenceCategorySecurityConsultantComponent,
		LicenceCategorySecurityGuardComponent,
		LicenceCategorySecurityGuardSupComponent,
		LicencePaymentCancelComponent,
		LicencePaymentErrorComponent,
		LicencePaymentFailComponent,
		LicencePaymentSuccessComponent,
		LoginSelectionComponent,
		LoginUserProfileComponent,
		CommonMailingAddressComponent,
		PersonalInformationComponent,
		RenewalAlertComponent,
		RenewalValueChangedComponent,
		CommonResidentialAddressComponent,
		StepAccessCodeAuthorizedComponent,
		StepAdditionalGovIdComponent,
		StepAliasesComponent,
		StepApplicationTypeAnonymousComponent,
		StepApplicationTypeAuthenticatedComponent,
		StepBcDriverLicenceComponent,
		StepChecklistNewWorkerComponent,
		StepChecklistRenewalWorkerComponent,
		StepChecklistUpdateWorkerComponent,
		StepCitizenshipComponent,
		StepConfirmMailingAddressComponent,
		StepConfirmUpdatesComponent,
		StepConsentAndDeclarationComponent,
		StepContactInformationComponent,
		StepCriminalHistoryComponent,
		StepDogsAuthorizationComponent,
		StepFingerprintsComponent,
		CommonAccessCodeAnonymousComponent,
		StepLicenceAccessCodeComponent,
		StepLicenceCategoryComponent,
		StepLicenceConfirmationComponent,
		StepLicenceExpiredComponent,
		StepLicenceTermComponent,
		StepLicenceTypeAnonymousComponent,
		StepLicenceTypeAuthenticatedComponent,
		StepLicenceUpdatesComponent,
		StepLicenceUserProfileComponent,
		StepMailingAddressComponent,
		StepMentalHealthConditionsComponent,
		StepPersonalInformationAnonymousComponent,
		StepPhotographOfYourselfComponent,
		StepPhysicalCharacteristicsComponent,
		StepPoliceBackgroundComponent,
		StepPoliceBackgroundRenewAndUpdateComponent,
		StepResidentialAddressComponent,
		StepRestraintsAuthorizationComponent,
		StepSoleProprietorComponent,
		StepSummaryReviewLicenceAnonymousComponent,
		StepSummaryReviewLicenceAuthenticatedComponent,
		StepsBackgroundComponent,
		StepsBackgroundRenewAndUpdateComponent,
		StepsIdentificationAnonymousComponent,
		StepsIdentificationAuthenticatedComponent,
		StepsLicenceSelectionComponent,
		StepsReviewLicenceAnonymousComponent,
		StepsReviewLicenceAuthenticatedComponent,
		UpdateAddDogsModalComponent,
		UpdateAddRestraintsModalComponent,
		UpdateApplyNameChangeModalComponent,
		UpdateLicenceCategoryModalComponent,
		UpdatePhotoModalComponent,
		UserApplicationsAuthenticatedComponent,
		UserProfileComponent,
		WorkerLicenceApplicationBaseAnonymousComponent,
		WorkerLicenceApplicationBaseAuthenticatedComponent,
		WorkerLicenceWizardAnonymousNewComponent,
		WorkerLicenceWizardAnonymousRenewalComponent,
		WorkerLicenceWizardAnonymousReplacementComponent,
		WorkerLicenceWizardAnonymousUpdateComponent,
		WorkerLicenceWizardAuthenticatedNewComponent,
		WorkerLicenceWizardAuthenticatedRenewComponent,
		WorkerLicenceWizardAuthenticatedUpdateComponent,
		PermitApplicationBaseAnonymousComponent,
		StepPermitChecklistNewComponent,
		StepPermitChecklistRenewalComponent,
		StepPermitChecklistUpdateComponent,
		StepPermitAliasesComponent,
		StepPermitCitizenshipComponent,
		StepPermitContactInformationComponent,
		StepPermitTypeAnonymousComponent,
		StepPermitExpiredComponent,
		StepPermitMailingAddressComponent,
		StepPermitResidentialAddressComponent,
		StepPermitReasonComponent,
		StepPermitRationaleComponent,
		StepPermitPersonalInformationComponent,
		StepPermitEmployerInformationComponent,
		StepPermitCriminalHistoryComponent,
		StepPermitFingerprintsComponent,
		StepsPermitDetailsComponent,
		StepsPermitPurposeComponent,
		StepsPermitContactComponent,
		StepPermitAccessCodeComponent,
		StepPermitConfirmationComponent,
		StepsPermitIdentificationComponent,
		StepPermitBcDriverLicenceComponent,
		StepPermitPhysicalCharacteristicsComponent,
		StepPermitPhotographOfYourselfComponent,
		PermitWizardAnonymousNewComponent,
		PermitWizardAnonymousRenewalComponent,
		PermitWizardAnonymousUpdateComponent,
		StepsPermitReviewAnonymousComponent,
		StepPermitSummaryAnonymousComponent,
		StepPermitConsentAndDeclarationComponent,
	],
	imports: [SharedModule, LicenceApplicationRoutingModule],
	providers: [LicenceApplicationService],
})
export class LicenceApplicationModule {}
