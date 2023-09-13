import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { LicencePaymentErrorComponent } from './components/licence-payment-error.component';
import { LicencePaymentFailComponent } from './components/licence-payment-fail.component';
import { LicencePaymentManualComponent } from './components/licence-payment-manual.component';
import { LicencePaymentSuccessComponent } from './components/licence-payment-success.component';
import { LicenceApplicationRoutingModule } from './licence-application-routing.module';
import { LicenceApplicationComponent } from './licence-application.component';
import { AddressComponent } from './step-components/address.component';
import { AliasesComponent } from './step-components/aliases.component';
import { BcDriverLicenceComponent } from './step-components/bc-driver-licence.component';
import { ChecklistComponent } from './step-components/checklist.component';
import { CitizenshipComponent } from './step-components/citizenship.component';
import { ConsentAndDeclarationComponent } from './step-components/consent-and-declaration.component';
import { ContactInformationComponent } from './step-components/contact-information.component';
import { CriminalHistoryComponent } from './step-components/criminal-history.component';
import { DogsOrRestraintsComponent } from './step-components/dogs-or-restraints.component';
import { FingerprintsComponent } from './step-components/fingerprints.component';
import { HeightAndWeightComponent } from './step-components/height-and-weight.component';
import { LicenceExpiredComponent } from './step-components/licence-expired.component';
import { LicenceSelectionComponent } from './step-components/licence-selection.component';
import { LicenceTermComponent } from './step-components/licence-term.component';
import { LicenceTypeComponent } from './step-components/licence-type.component';
import { StepBackgroundComponent } from './step-components/main-steps/step-background.component';
import { StepIdentificationComponent } from './step-components/main-steps/step-identification.component';
import { StepLicenseSelectionComponent } from './step-components/main-steps/step-license-selection.component';
import { StepReviewComponent } from './step-components/main-steps/step-review.component';
import { MentalHealthConditionsComponent } from './step-components/mental-health-conditions.component';
import { PersonalInformationComponent } from './step-components/personal-information.component';
import { PhotoComponent } from './step-components/photo.component';
import { PoliceBackgroundComponent } from './step-components/police-background.component';
import { SoleProprietorComponent } from './step-components/sole-proprietor.component';
import { SummaryReviewComponent } from './step-components/summary-review.component';
import { SecurityWorkerLicenceCategoryComponent } from './step-components/security-worker-licence-category.component';

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
		LicenceTermComponent,
		SummaryReviewComponent,
		ConsentAndDeclarationComponent,
		LicencePaymentSuccessComponent,
		LicencePaymentFailComponent,
		LicencePaymentManualComponent,
		LicencePaymentErrorComponent,
		AddressComponent,
		StepLicenseSelectionComponent,
		StepBackgroundComponent,
		StepIdentificationComponent,
		StepReviewComponent,
  SecurityWorkerLicenceCategoryComponent,
	],
	imports: [SharedModule, LicenceApplicationRoutingModule],
})
export class LicenceApplicationModule {}
