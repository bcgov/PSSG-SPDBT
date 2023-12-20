import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserApplicationsAnonymousComponent } from './components/anonymous/user-applications-anonymous.component';
import { StepApplicationTypeAnonymousComponent } from './components/anonymous/wizard-steps/step-application-type-anonymous.component';
import { StepLicenceAccessCodeAnonymousComponent } from './components/anonymous/wizard-steps/step-licence-access-code-anonymous.component';
import { StepLicenceConfirmationComponent } from './components/anonymous/wizard-steps/step-licence-confirmation.component';
import { StepLicenceTypeAnonymousComponent } from './components/anonymous/wizard-steps/step-licence-type-anonymous.component';
import { StepPersonalInformationAnonymousComponent } from './components/anonymous/wizard-steps/step-personal-information-anonymous.component';
import { StepSummaryReviewLicenceAnonymousComponent } from './components/anonymous/wizard-steps/step-summary-review-licence-anonymous.component';
import { StepsIdentificationAnonymousComponent } from './components/anonymous/wizard-steps/steps-identification-anonymous.component';
import { StepsReviewLicenceAnonymousComponent } from './components/anonymous/wizard-steps/steps-review-licence-anonymous.component';
import { WorkerLicenceNewWizardAnonymousComponent } from './components/anonymous/worker-licence-new-wizard-anonymous.component';
import { WorkerLicenceRenewalWizardAnonymousComponent } from './components/anonymous/worker-licence-renewal-wizard-anonymous.component';
import { WorkerLicenceReplacementWizardAnonymousComponent } from './components/anonymous/worker-licence-replacement-wizard-anonymous.component';
import { WorkerLicenceUpdateWizardAnonymousComponent } from './components/anonymous/worker-licence-update-wizard-anonymous.component';
import { LoginUserProfileComponent } from './components/authenticated/login-user-profile.component';
import { SecurityWorkerLicenceWizardNewAuthenticatedComponent } from './components/authenticated/security-worker-licence-wizard-new-authenticated.component';
import { SecurityWorkerLicenceWizardUpdateAuthenticatedComponent } from './components/authenticated/security-worker-licence-wizard-update-authenticated.component';
import { UpdateAddDogsModalComponent } from './components/authenticated/step-update-components/update-add-dogs-modal.component';
import { UpdateAddRestraintsModalComponent } from './components/authenticated/step-update-components/update-add-restraints-modal.component';
import { UpdateApplyNameChangeModalComponent } from './components/authenticated/step-update-components/update-apply-name-change-modal.component';
import { UpdateLicenceCategoryModalComponent } from './components/authenticated/step-update-components/update-licence-category-modal.component';
import { UpdatePhotoModalComponent } from './components/authenticated/step-update-components/update-photo-modal.component';
import { StepConfirmMailingAddressComponent } from './components/authenticated/step-update-components/wizard-update-steps/step-confirm-mailing-address.component';
import { StepConfirmUpdatesComponent } from './components/authenticated/step-update-components/wizard-update-steps/step-confirm-updates.component';
import { StepLicenceUpdatesComponent } from './components/authenticated/step-update-components/wizard-update-steps/step-licence-updates.component';
import { UserApplicationsAuthenticatedComponent } from './components/authenticated/user-applications-authenticated.component';
import { StepAccessCodeAuthorizedComponent } from './components/authenticated/wizard-steps/step-access-code-authorized.component';
import { StepApplicationTypeAuthenticatedComponent } from './components/authenticated/wizard-steps/step-application-type-authenticated.component';
import { StepLicenceTypeAuthenticatedComponent } from './components/authenticated/wizard-steps/step-licence-type-authenticated.component';
import { StepSummaryReviewLicenceAuthenticatedComponent } from './components/authenticated/wizard-steps/step-summary-review-licence-authenticated.component';
import { StepsIdentificationAuthenticatedComponent } from './components/authenticated/wizard-steps/steps-identification-authenticated.component';
import { StepsReviewLicenceAuthenticatedComponent } from './components/authenticated/wizard-steps/steps-review-licence-authenticated.component';
import { LoginSelectionComponent } from './components/login-selection.component';
import { SecurityWorkerLicenceApplicationComponent } from './components/security-worker-licence-application.component';
import { LicencePaymentErrorComponent } from './components/shared/licence-payment-error.component';
import { LicencePaymentFailComponent } from './components/shared/licence-payment-fail.component';
import { LicencePaymentManualComponent } from './components/shared/licence-payment-manual.component';
import { LicencePaymentSuccessComponent } from './components/shared/licence-payment-success.component';
import { AliasListComponent } from './components/shared/step-components/alias-list.component';
import { AliasesComponent } from './components/shared/step-components/aliases.component';
import { ContactInformationComponent } from './components/shared/step-components/contact-information.component';
import { FingerprintTearOffModalComponent } from './components/shared/step-components/fingerprint-tear-off-modal.component';
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
import { MailingAddressComponent } from './components/shared/step-components/mailing-address.component';
import { PersonalInformationComponent } from './components/shared/step-components/personal-information.component';
import { RenewalAlertComponent } from './components/shared/step-components/renewal-alert.component';
import { ResidentialAddressComponent } from './components/shared/step-components/residential-address.component';
import { UserProfileComponent } from './components/shared/step-components/user-profile.component';
import { StepAdditionalGovIdComponent } from './components/shared/wizard-child-steps/step-additional-gov-id.component';
import { StepAliasesComponent } from './components/shared/wizard-child-steps/step-aliases.component';
import { StepBcDriverLicenceComponent } from './components/shared/wizard-child-steps/step-bc-driver-licence.component';
import { StepChecklistNewWorkerComponent } from './components/shared/wizard-child-steps/step-checklist-new-worker.component';
import { StepChecklistRenewalWorkerComponent } from './components/shared/wizard-child-steps/step-checklist-renewal-worker.component';
import { StepChecklistUpdateWorkerComponent } from './components/shared/wizard-child-steps/step-checklist-update-worker.component';
import { StepCitizenshipComponent } from './components/shared/wizard-child-steps/step-citizenship.component';
import { StepConsentAndDeclarationComponent } from './components/shared/wizard-child-steps/step-consent-and-declaration.component';
import { StepContactInformationComponent } from './components/shared/wizard-child-steps/step-contact-information.component';
import { StepCriminalHistoryComponent } from './components/shared/wizard-child-steps/step-criminal-history.component';
import { StepDogsAuthorizationComponent } from './components/shared/wizard-child-steps/step-dogs-authorization.component';
import { StepFingerprintsComponent } from './components/shared/wizard-child-steps/step-fingerprints.component';
import { StepLicenceCategoryComponent } from './components/shared/wizard-child-steps/step-licence-category.component';
import { StepLicenceExpiredComponent } from './components/shared/wizard-child-steps/step-licence-expired.component';
import { StepLicenceTermComponent } from './components/shared/wizard-child-steps/step-licence-term.component';
import { StepLicenceUserProfileComponent } from './components/shared/wizard-child-steps/step-licence-user-profile.component';
import { StepMailingAddressComponent } from './components/shared/wizard-child-steps/step-mailing-address.component';
import { StepMentalHealthConditionsComponent } from './components/shared/wizard-child-steps/step-mental-health-conditions.component';
import { StepPhotographOfYourselfComponent } from './components/shared/wizard-child-steps/step-photograph-of-yourself.component';
import { StepPhysicalCharacteristicsComponent } from './components/shared/wizard-child-steps/step-physical-characteristics.component';
import { StepPoliceBackgroundComponent } from './components/shared/wizard-child-steps/step-police-background.component';
import { StepResidentialAddressComponent } from './components/shared/wizard-child-steps/step-residential-address.component';
import { StepRestraintsAuthorizationComponent } from './components/shared/wizard-child-steps/step-restraints-authorization.component';
import { StepSoleProprietorComponent } from './components/shared/wizard-child-steps/step-sole-proprietor.component';
import { StepsBackgroundComponent } from './components/shared/wizard-steps/steps-background.component';
import { StepsLicenceSelectionComponent } from './components/shared/wizard-steps/steps-licence-selection.component';
import { LicenceApplicationRoutingModule } from './licence-application-routing.module';
import { LicenceApplicationComponent } from './licence-application.component';
import { LicenceApplicationService } from './services/licence-application.service';

@NgModule({
	declarations: [
		LicenceApplicationComponent,
		StepLicenceTypeAuthenticatedComponent,
		StepApplicationTypeAuthenticatedComponent,
		LoginUserProfileComponent,
		StepSoleProprietorComponent,
		StepChecklistNewWorkerComponent,
		StepChecklistRenewalWorkerComponent,
		StepChecklistUpdateWorkerComponent,
		PersonalInformationComponent,
		StepLicenceExpiredComponent,
		StepPoliceBackgroundComponent,
		StepRestraintsAuthorizationComponent,
		StepDogsAuthorizationComponent,
		StepMentalHealthConditionsComponent,
		StepCriminalHistoryComponent,
		StepFingerprintsComponent,
		AliasesComponent,
		AliasListComponent,
		StepCitizenshipComponent,
		StepBcDriverLicenceComponent,
		StepPhysicalCharacteristicsComponent,
		StepPhotographOfYourselfComponent,
		ContactInformationComponent,
		ResidentialAddressComponent,
		MailingAddressComponent,
		StepLicenceTermComponent,
		StepSummaryReviewLicenceAnonymousComponent,
		StepSummaryReviewLicenceAuthenticatedComponent,
		StepConsentAndDeclarationComponent,
		LicencePaymentSuccessComponent,
		LicencePaymentFailComponent,
		LicencePaymentManualComponent,
		LicencePaymentErrorComponent,
		StepAliasesComponent,
		StepContactInformationComponent,
		StepResidentialAddressComponent,
		StepMailingAddressComponent,
		StepsLicenceSelectionComponent,
		StepsBackgroundComponent,
		StepsIdentificationAuthenticatedComponent,
		StepsIdentificationAnonymousComponent,
		StepPersonalInformationAnonymousComponent,
		StepsReviewLicenceAnonymousComponent,
		StepsReviewLicenceAuthenticatedComponent,
		StepLicenceCategoryComponent,
		StepAdditionalGovIdComponent,
		StepAccessCodeAuthorizedComponent,
		StepLicenceAccessCodeAnonymousComponent,
		LicenceCategoryLocksmithComponent,
		LicenceCategoryArmouredCarGuardComponent,
		LicenceCategoryBodyArmourSalesComponent,
		LicenceCategoryClosedCircuitTelevisionInstallerComponent,
		LicenceCategoryElectronicLockingDeviceInstallerComponent,
		LicenceCategoryFireInvestigatorComponent,
		LicenceCategoryLocksmithSupComponent,
		LicenceCategoryPrivateInvestigatorComponent,
		LicenceCategoryPrivateInvestigatorSupComponent,
		LicenceCategorySecurityGuardComponent,
		LicenceCategorySecurityGuardSupComponent,
		LicenceCategorySecurityAlarmInstallerSupComponent,
		LicenceCategorySecurityAlarmInstallerComponent,
		LicenceCategorySecurityAlarmMonitorComponent,
		LicenceCategorySecurityAlarmResponseComponent,
		LicenceCategorySecurityAlarmSalesComponent,
		LicenceCategorySecurityConsultantComponent,
		LoginSelectionComponent,
		WorkerLicenceNewWizardAnonymousComponent,
		WorkerLicenceRenewalWizardAnonymousComponent,
		WorkerLicenceReplacementWizardAnonymousComponent,
		WorkerLicenceUpdateWizardAnonymousComponent,
		SecurityWorkerLicenceWizardNewAuthenticatedComponent,
		SecurityWorkerLicenceWizardUpdateAuthenticatedComponent,
		StepLicenceUpdatesComponent,
		StepConfirmMailingAddressComponent,
		StepConfirmUpdatesComponent,
		UpdateApplyNameChangeModalComponent,
		UpdateLicenceCategoryModalComponent,
		UserProfileComponent,
		UpdateAddRestraintsModalComponent,
		UpdateAddDogsModalComponent,
		UpdatePhotoModalComponent,
		SecurityWorkerLicenceApplicationComponent,
		FingerprintTearOffModalComponent,
		StepLicenceUserProfileComponent,
		UserApplicationsAnonymousComponent,
		UserApplicationsAuthenticatedComponent,
		StepLicenceTypeAnonymousComponent,
		StepApplicationTypeAnonymousComponent,
		RenewalAlertComponent,
		StepLicenceConfirmationComponent,
	],
	imports: [SharedModule, LicenceApplicationRoutingModule],
	providers: [LicenceApplicationService],
})
export class LicenceApplicationModule {}
