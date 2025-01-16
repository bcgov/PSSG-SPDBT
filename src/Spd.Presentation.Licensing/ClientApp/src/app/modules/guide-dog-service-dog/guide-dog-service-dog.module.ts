import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { GdsdWizardAnonymousNewComponent } from './components/anonymous/gdsd-wizard-anonymous-new.component';
import { GdsdActiveCertificationsComponent } from './components/gdsd-active-certifications.component';
import { GdsdApplicationTypeAnonymousComponent } from './components/gdsd-application-type-anonymous.component';
import { GuideDogServiceDogAuthenticatedBaseComponent } from './components/guide-dog-service-dog-authenticated-base.component';
import { GuideDogServiceDogBaseComponent } from './components/guide-dog-service-dog-base.component';
import { GuideDogServiceDogLandingComponent } from './components/guide-dog-service-dog-landing.component';
import { GuideDogServiceDogMainComponent } from './components/guide-dog-service-dog-main.component';
import { GuideDogServiceDogRoutingModule } from './guide-dog-service-dog-routing.module';

@NgModule({
	declarations: [
		GuideDogServiceDogBaseComponent,
		GuideDogServiceDogAuthenticatedBaseComponent,
		GuideDogServiceDogLandingComponent,
		GuideDogServiceDogMainComponent,
		GdsdActiveCertificationsComponent,
		GdsdApplicationTypeAnonymousComponent,
		GdsdWizardAnonymousNewComponent,
	],
	imports: [SharedModule, GuideDogServiceDogRoutingModule],
})
export class GuideDogServiceDogModule {}
