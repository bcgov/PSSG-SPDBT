import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { LicenceApplicationRoutingModule } from './licence-application-routing.module';
import { LicenceApplicationComponent } from './licence-application.component';
import { LicenceSelectionComponent } from './step-components/licence-selection.component';
import { LicenceTypeComponent } from './step-components/licence-type.component';
import { SoleProprietorComponent } from './step-components/sole-proprietor.component';
import { ChecklistComponent } from './step-components/checklist.component';
import { PersonalInformationComponent } from './step-components/personal-information.component';
import { LicenceExpiredComponent } from './step-components/licence-expired.component';

@NgModule({
	declarations: [
    LicenceApplicationComponent,
    LicenceSelectionComponent,
    LicenceTypeComponent,
    SoleProprietorComponent,
    ChecklistComponent,
    PersonalInformationComponent,
    LicenceExpiredComponent
  ],
	imports: [SharedModule, LicenceApplicationRoutingModule],
})
export class LicenceApplicationModule {}
