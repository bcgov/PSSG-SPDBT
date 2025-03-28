import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuideDogServiceDogBaseAnonymousComponent } from './components/anonymous/guide-dog-service-dog-base-anonymous.component';
import { StepGdsdLicenceAccessCodeComponent } from './components/anonymous/step-gdsd-licence-access-code.component';
import { GdsdLicenceMainComponent } from './components/authenticated/gdsd-licence-main.component';
import { GuideDogServiceDogBaseAuthenticatedComponent } from './components/authenticated/guide-dog-service-dog-base-authenticated.component';
import { GdsdWizardNewComponent } from './components/gdsd-wizard-new.component';
import { GdsdWizardRenewalComponent } from './components/gdsd-wizard-renewal.component';
import { GdsdWizardReplacementComponent } from './components/gdsd-wizard-replacement.component';
import { GuideDogServiceDogLandingComponent } from './components/guide-dog-service-dog-landing.component';
import { GdsdApplicationReceivedSuccessComponent } from './components/shared/common-form-components/gdsd-application-received-success.component';
import { GdsdApplicationTypeAnonymousComponent } from './components/shared/common-form-components/gdsd-application-type-anonymous.component';
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
				path: GuideDogServiceDogRoutes.GDSD_ACCESS_CODE_ANONYMOUS,
				component: StepGdsdLicenceAccessCodeComponent,
			},
			{
				path: GuideDogServiceDogRoutes.GDSD_APPLICATION_NEW_ANONYMOUS,
				component: GdsdWizardNewComponent,
			},
			{
				path: GuideDogServiceDogRoutes.GDSD_APPLICATION_RENEWAL_ANONYMOUS,
				component: GdsdWizardRenewalComponent,
			},
			{
				path: GuideDogServiceDogRoutes.GDSD_APPLICATION_REPLACEMENT_ANONYMOUS,
				component: GdsdWizardReplacementComponent,
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
				component: GdsdLicenceMainComponent,
			},
			{
				path: GuideDogServiceDogRoutes.GDSD_APPLICATION_NEW_AUTHENTICATED,
				component: GdsdWizardNewComponent,
			},
			{
				path: GuideDogServiceDogRoutes.GDSD_APPLICATION_RENEWAL_AUTHENTICATED,
				component: GdsdWizardRenewalComponent,
			},
			{
				path: GuideDogServiceDogRoutes.GDSD_APPLICATION_REPLACEMENT_AUTHENTICATED,
				component: GdsdWizardReplacementComponent,
			},
			{
				path: GuideDogServiceDogRoutes.GDSD_APPLICATION_RECEIVED,
				component: GdsdApplicationReceivedSuccessComponent,
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
