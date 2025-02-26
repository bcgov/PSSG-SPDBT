import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GdsdBaseAnonymousComponent } from './components/anonymous/gdsd-base-anonymous.component';
import { StepDtApplicationTypeComponent } from './components/anonymous/step-dt-application-type.component';
import { StepDtLicenceAccessCodeComponent } from './components/anonymous/step-dt-licence-access-code.component';
import { StepGdsdApplicationTypeComponent } from './components/anonymous/step-gdsd-application-type.component';
import { StepGdsdLicenceAccessCodeComponent } from './components/anonymous/step-gdsd-licence-access-code.component';
import { GdsdBaseAuthenticatedComponent } from './components/authenticated/gdsd-base-authenticated.component';
import { GdsdLicenceMainComponent } from './components/authenticated/gdsd-licence-main.component';
import { DogTrainerWizardNewComponent } from './components/dog-trainer-wizard-new.component';
import { GdsdLandingComponent } from './components/gdsd-landing.component';
import { GdsdTeamWizardNewComponent } from './components/gdsd-team-wizard-new.component';
import { GdsdTeamWizardRenewalComponent } from './components/gdsd-team-wizard-renewal.component';
import { GdsdTeamWizardReplacementComponent } from './components/gdsd-team-wizard-replacement.component';
import { GdsdApplicationReceivedSuccessComponent } from './components/shared/common-form-components/gdsd-application-received-success.component';
import { GuideDogServiceDogRoutes } from './guide-dog-service-dog-routes';

const routes: Routes = [
	{
		path: '',
		component: GdsdLandingComponent,
	},
	{
		/**************************************************** */
		// ANONYMOUS
		/**************************************************** */
		path: GuideDogServiceDogRoutes.GDSD_ANONYMOUS_BASE,
		component: GdsdBaseAnonymousComponent,
		children: [
			{
				path: GuideDogServiceDogRoutes.GDSD_TEAM_APPLICATION_TYPE_ANONYMOUS,
				component: StepGdsdApplicationTypeComponent,
			},
			{
				path: GuideDogServiceDogRoutes.GDSD_TEAM_ACCESS_CODE_ANONYMOUS,
				component: StepGdsdLicenceAccessCodeComponent,
			},
			{
				path: GuideDogServiceDogRoutes.GDSD_TEAM_APPLICATION_NEW_ANONYMOUS,
				component: GdsdTeamWizardNewComponent,
			},
			{
				path: GuideDogServiceDogRoutes.GDSD_TEAM_APPLICATION_RENEWAL_ANONYMOUS,
				component: GdsdTeamWizardRenewalComponent,
			},
			{
				path: GuideDogServiceDogRoutes.GDSD_TEAM_APPLICATION_REPLACEMENT_ANONYMOUS,
				component: GdsdTeamWizardReplacementComponent,
			},
			{
				path: GuideDogServiceDogRoutes.DOG_TRAINER_APPLICATION_TYPE_ANONYMOUS,
				component: StepDtApplicationTypeComponent,
			},
			{
				path: GuideDogServiceDogRoutes.DOG_TRAINER_ACCESS_CODE_ANONYMOUS,
				component: StepDtLicenceAccessCodeComponent,
			},
			{
				path: GuideDogServiceDogRoutes.DOG_TRAINER_APPLICATION_NEW_ANONYMOUS,
				component: DogTrainerWizardNewComponent,
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
		component: GdsdBaseAuthenticatedComponent,
		children: [
			{
				path: '',
				component: GdsdLicenceMainComponent,
			},
			{
				path: GuideDogServiceDogRoutes.GDSD_APPLICATION_NEW_AUTHENTICATED,
				component: GdsdTeamWizardNewComponent,
			},
			{
				path: GuideDogServiceDogRoutes.GDSD_APPLICATION_RENEWAL_AUTHENTICATED,
				component: GdsdTeamWizardRenewalComponent,
			},
			{
				path: GuideDogServiceDogRoutes.GDSD_APPLICATION_REPLACEMENT_AUTHENTICATED,
				component: GdsdTeamWizardReplacementComponent,
			},
			// {
			// 	path: GuideDogServiceDogRoutes.GDSD_APPLICATION_RECEIVED,
			// 	component: GdsdApplicationReceivedSuccessComponent,
			// },
			{
				path: '**',
				redirectTo: GuideDogServiceDogRoutes.pathGdsdMainApplications(),
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
