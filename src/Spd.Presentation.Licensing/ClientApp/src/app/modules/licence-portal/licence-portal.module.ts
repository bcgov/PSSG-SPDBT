import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActiveLicencesComponent } from './components/active-licences.component';
import { ExpiredLicencesComponent } from './components/expired-licences.component';
import { InProgressApplicationsComponent } from './components/in-progress-applications.component';
import { NewLicenceComponent } from './components/new-licence.component';
import { SubmittedApplicationsComponent } from './components/submitted-applications.component';
import { LicenceRoutingModule } from './licence-routing.module';
import { LicenceComponent } from './licence.component';

@NgModule({
	declarations: [
		LicenceComponent,
		InProgressApplicationsComponent,
		SubmittedApplicationsComponent,
		NewLicenceComponent,
		ActiveLicencesComponent,
		ExpiredLicencesComponent,
	],
	imports: [SharedModule, LicenceRoutingModule],
})
export class LicencePortalModule {}
