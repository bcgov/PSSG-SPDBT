import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GdsdWizardAnonymousNewComponent } from './components/anonymous/gdsd-wizard-anonymous-new.component';
import { GdsdApplicationTypeAnonymousComponent } from './components/gdsd-application-type-anonymous.component';
import { GuideDogServiceDogBaseAuthenticatedComponent } from './components/guide-dog-service-dog-base-authenticated.component';
import { GuideDogServiceDogBaseAnonymousComponent } from './components/guide-dog-service-dog-base-anonymous.component';
import { GuideDogServiceDogLandingComponent } from './components/guide-dog-service-dog-landing.component';
import { GuideDogServiceDogMainComponent } from './components/guide-dog-service-dog-main.component';
import { GdsdApplicationReceivedSuccessComponent } from './components/shared/gdsd-application-received-success.component';
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
		component: GuideDogServiceDogBaseAnonymousComponent,
		children: [
			{
				path: GuideDogServiceDogRoutes.GDSD_APPLICATION_TYPE_ANONYMOUS,
				component: GdsdApplicationTypeAnonymousComponent,
			},
			{
				path: GuideDogServiceDogRoutes.GDSD_APPLICATION_NEW_ANONYMOUS,
				component: GdsdWizardAnonymousNewComponent,
			},
			{
				path: GuideDogServiceDogRoutes.GDSD_APPLICATION_RECEIVED,
				component: GdsdApplicationReceivedSuccessComponent,
			},
		],
	},
	{
		/**************************************************** */
		// AUTHENTICATED
		/**************************************************** */
		path: GuideDogServiceDogRoutes.GDSD_AUTHENTICATED_BASE,
		component: GuideDogServiceDogBaseAuthenticatedComponent,
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
