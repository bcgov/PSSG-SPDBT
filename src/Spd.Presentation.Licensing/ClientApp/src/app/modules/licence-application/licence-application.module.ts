import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApplicationsInProgressComponent } from './components/applications-in-progress.component';
import { LicencePaymentErrorComponent } from './components/licence-payment-error.component';
import { LicencePaymentFailComponent } from './components/licence-payment-fail.component';
import { LicencePaymentManualComponent } from './components/licence-payment-manual.component';
import { LicencePaymentSuccessComponent } from './components/licence-payment-success.component';
import { LicenceSelectionComponent } from './components/licence-selection.component';
import { LicenceTypeComponent } from './components/licence-type.component';
import { LicenceWizardComponent } from './components/licence-wizard.component';
import { LoginSelectionComponent } from './components/login-selection.component';
import { LicenceApplicationRoutingModule } from './licence-application-routing.module';
import { LicenceApplicationComponent } from './licence-application.component';
import { AdditionalGovIdComponent } from './step-components/additional-gov-id.component';
import { AliasesComponent } from './step-components/aliases.component';
import { BackgroundInfoComponent } from './step-components/background-info.component';
import { BcDriverLicenceComponent } from './step-components/bc-driver-licence.component';
import { BusinessAddressComponent } from './step-components/business-contact-information.component';
import { ChecklistComponent } from './step-components/checklist.component';
import { CitizenshipComponent } from './step-components/citizenship.component';
import { ConsentAndDeclarationComponent } from './step-components/consent-and-declaration.component';
import { ContactInformationComponent } from './step-components/contact-information.component';
import { CriminalHistoryComponent } from './step-components/criminal-history.component';
import { DogsOrRestraintsComponent } from './step-components/dogs-or-restraints.component';
import { FingerprintsComponent } from './step-components/fingerprints.component';
import { HeightAndWeightComponent } from './step-components/height-and-weight.component';
import { LicenceAccessCodeComponent } from './step-components/licence-access-code.component';
import { LicenceCategoryArmouredCarGuardComponent } from './step-components/licence-category-armoured-car-guard.component';
import { LicenceCategoryBodyArmourSalesComponent } from './step-components/licence-category-body-armour-sales.component';
import { LicenceCategoryClosedCircuitTelevisionInstallerComponent } from './step-components/licence-category-closed-circuit-television-installer.component';
import { LicenceCategoryElectronicLockingDeviceInstallerComponent } from './step-components/licence-category-electronic-locking-device-installer.component';
import { LicenceCategoryFireInvestigatorComponent } from './step-components/licence-category-fire-investigator.component';
import { LicenceCategoryLocksmithSupComponent } from './step-components/licence-category-locksmith-sup.component';
import { LicenceCategoryLocksmithComponent } from './step-components/licence-category-locksmith.component';
import { LicenceCategoryPrivateInvestigatorSupComponent } from './step-components/licence-category-private-investigator-sup.component';
import { LicenceCategoryPrivateInvestigatorComponent } from './step-components/licence-category-private-investigator.component';
import { LicenceCategorySecurityAlarmInstallerSupComponent } from './step-components/licence-category-security-alarm-installer-sup.component';
import { LicenceCategorySecurityAlarmInstallerComponent } from './step-components/licence-category-security-alarm-installer.component';
import { LicenceCategorySecurityAlarmMonitorComponent } from './step-components/licence-category-security-alarm-monitor.component';
import { LicenceCategorySecurityAlarmResponseComponent } from './step-components/licence-category-security-alarm-response.component';
import { LicenceCategorySecurityAlarmSalesComponent } from './step-components/licence-category-security-alarm-sales.component';
import { LicenceCategorySecurityConsultantComponent } from './step-components/licence-category-security-consultant.component';
import { LicenceCategorySecurityGuardSupComponent } from './step-components/licence-category-security-guard-sup.component';
import { LicenceCategorySecurityGuardComponent } from './step-components/licence-category-security-guard.component';
import { LicenceCategoryComponent } from './step-components/licence-category.component';
import { LicenceExpiredComponent } from './step-components/licence-expired.component';
import { LicenceTermComponent } from './step-components/licence-term.component';
import { StepBackgroundComponent } from './step-components/main-steps/step-background.component';
import { StepIdentificationComponent } from './step-components/main-steps/step-identification.component';
import { StepLicenceSelectionComponent } from './step-components/main-steps/step-licence-selection.component';
import { StepReviewComponent } from './step-components/main-steps/step-review.component';
import { MentalHealthConditionsComponent } from './step-components/mental-health-conditions.component';
import { PersonalInformationComponent } from './step-components/personal-information.component';
import { PhotoComponent } from './step-components/photo.component';
import { PoliceBackgroundComponent } from './step-components/police-background.component';
import { ResidentialAddressComponent } from './step-components/residential-address.component';
import { SoleProprietorComponent } from './step-components/sole-proprietor.component';
import { SummaryReviewComponent } from './step-components/summary-review.component';

@NgModule({
	declarations: [
		LicenceApplicationComponent,
		LicenceSelectionComponent,
		LicenceTypeComponent,
		SoleProprietorComponent,
		ChecklistComponent,
		PersonalInformationComponent,
		LicenceExpiredComponent,
		PoliceBackgroundComponent,
		DogsOrRestraintsComponent,
		MentalHealthConditionsComponent,
		CriminalHistoryComponent,
		FingerprintsComponent,
		AliasesComponent,
		CitizenshipComponent,
		BcDriverLicenceComponent,
		HeightAndWeightComponent,
		PhotoComponent,
		ContactInformationComponent,
		ResidentialAddressComponent,
		BusinessAddressComponent,
		LicenceTermComponent,
		SummaryReviewComponent,
		ConsentAndDeclarationComponent,
		LicencePaymentSuccessComponent,
		LicencePaymentFailComponent,
		LicencePaymentManualComponent,
		LicencePaymentErrorComponent,
		ContactInformationComponent,
		StepLicenceSelectionComponent,
		StepBackgroundComponent,
		StepIdentificationComponent,
		StepReviewComponent,
		LicenceCategoryComponent,
		AdditionalGovIdComponent,
		LicenceAccessCodeComponent,
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
		ApplicationsInProgressComponent,
		LoginSelectionComponent,
		LicenceWizardComponent,
		BackgroundInfoComponent,
	],
	imports: [SharedModule, LicenceApplicationRoutingModule],
})
export class LicenceApplicationModule {}
