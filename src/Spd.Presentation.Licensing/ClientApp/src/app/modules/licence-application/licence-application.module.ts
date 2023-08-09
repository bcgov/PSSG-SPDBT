import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { LicenceApplicationRoutingModule } from './licence-application-routing.module';
import { LicenceApplicationComponent } from './licence-application.component';
import { AliasesComponent } from './step-components/aliases.component';
import { BcDriverLicenceComponent } from './step-components/bc-driver-licence.component';
import { ChecklistComponent } from './step-components/checklist.component';
import { CitizenshipComponent } from './step-components/citizenship.component';
import { ContactInformationComponent } from './step-components/contact-information.component';
import { CriminalHistoryComponent } from './step-components/criminal-history.component';
import { DogsOrRestraintsComponent } from './step-components/dogs-or-restraints.component';
import { FingerprintsComponent } from './step-components/fingerprints.component';
import { HeightAndWeightComponent } from './step-components/height-and-weight.component';
import { LicenceExpiredComponent } from './step-components/licence-expired.component';
import { LicenceSelectionComponent } from './step-components/licence-selection.component';
import { LicenceTypeComponent } from './step-components/licence-type.component';
import { MentalHealthConditionsComponent } from './step-components/mental-health-conditions.component';
import { PersonalInformationComponent } from './step-components/personal-information.component';
import { PhotoComponent } from './step-components/photo.component';
import { PoliceBackgroundComponent } from './step-components/police-background.component';
import { SoleProprietorComponent } from './step-components/sole-proprietor.component';

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
	],
	imports: [SharedModule, LicenceApplicationRoutingModule],
})
export class LicenceApplicationModule {}
