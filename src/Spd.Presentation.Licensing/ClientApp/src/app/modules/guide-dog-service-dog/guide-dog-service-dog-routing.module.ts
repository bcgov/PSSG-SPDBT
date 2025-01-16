import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GdsdWizardAnonymousNewComponent } from './components/anonymous/gdsd-wizard-anonymous-new.component';
import { GdsdApplicationTypeAnonymousComponent } from './components/gdsd-application-type-anonymous.component';
import { GuideDogServiceDogAuthenticatedBaseComponent } from './components/guide-dog-service-dog-authenticated-base.component';
import { GuideDogServiceDogBaseComponent } from './components/guide-dog-service-dog-base.component';
import { GuideDogServiceDogLandingComponent } from './components/guide-dog-service-dog-landing.component';
import { GuideDogServiceDogMainComponent } from './components/guide-dog-service-dog-main.component';
import { GuideDogServiceDogRoutes } from './guide-dog-service-dog-routes';

const routes: Routes = [
	{
		path: '',
		component: GuideDogServiceDogLandingComponent,
	},
	{
		/**************************************************** */
		// ANONYMOUS
		/**************************************************** */
		path: GuideDogServiceDogRoutes.GDSD_APPLICATION_ANONYMOUS,
		component: GuideDogServiceDogBaseComponent,
		children: [
			{
				path: GuideDogServiceDogRoutes.GDSD_APPLICATION_TYPE_ANONYMOUS,
				component: GdsdApplicationTypeAnonymousComponent,
			},
			{
				path: GuideDogServiceDogRoutes.GDSD_APPLICATION_NEW_ANONYMOUS,
				component: GdsdWizardAnonymousNewComponent,
			},
		],
	},
	{
		/**************************************************** */
		// AUTHENTICATED
		/**************************************************** */
		path: GuideDogServiceDogRoutes.GDSD_AUTHENTICATED_BASE,
		component: GuideDogServiceDogAuthenticatedBaseComponent,
		children: [
			{
				path: '',
				component: GuideDogServiceDogMainComponent,
			},
			{
				path: '**',
				redirectTo: GuideDogServiceDogRoutes.pathGdsdUserApplications(),
				pathMatch: 'full',
			},
		],
	},
	{
		path: '**',
		redirectTo: GuideDogServiceDogRoutes.path(),
		pathMatch: 'full',
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class GuideDogServiceDogRoutingModule {}
