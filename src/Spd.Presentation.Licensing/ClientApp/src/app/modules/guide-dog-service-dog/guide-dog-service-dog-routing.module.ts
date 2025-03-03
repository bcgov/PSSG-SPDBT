import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GdsdLicenceMainComponent } from './components/authenticated/gdsd-licence-main.component';
import { DogTrainerWizardNewRenewalComponent } from './components/dog-trainer/dog-trainer-wizard-new-renewal.component';
import { DogTrainerWizardReplacementComponent } from './components/dog-trainer/dog-trainer-wizard-replacement.component';
import { StepDtApplicationTypeComponent } from './components/dog-trainer/step-dt-application-type.component';
import { StepDtLicenceAccessCodeComponent } from './components/dog-trainer/step-dt-licence-access-code.component';
import { GdsdBaseAnonymousComponent } from './components/gdsd-base-anonymous.component';
import { GdsdBaseAuthenticatedComponent } from './components/gdsd-base-authenticated.component';
import { GdsdLandingComponent } from './components/gdsd-landing.component';
import { GdsdApplicationReceivedSuccessComponent } from './components/gdsd-team/gdsd-application-received-success.component';
import { GdsdTeamWizardNewComponent } from './components/gdsd-team/gdsd-team-wizard-new.component';
import { GdsdTeamWizardRenewalComponent } from './components/gdsd-team/gdsd-team-wizard-renewal.component';
import { GdsdTeamWizardReplacementComponent } from './components/gdsd-team/gdsd-team-wizard-replacement.component';
import { StepTeamApplicationTypeComponent } from './components/gdsd-team/step-team-application-type.component';
import { StepTeamLicenceAccessCodeComponent } from './components/gdsd-team/step-team-licence-access-code.component';
import { RetiredDogWizardNewRenewalComponent } from './components/retired-dog/retired-dog-wizard-new-renewal.component';
import { StepRdApplicationTypeComponent } from './components/retired-dog/step-rd-application-type.component';
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
				component: StepTeamApplicationTypeComponent,
			},
			{
				path: GuideDogServiceDogRoutes.GDSD_TEAM_ACCESS_CODE_ANONYMOUS,
				component: StepTeamLicenceAccessCodeComponent,
			},
			{
				path: GuideDogServiceDogRoutes.GDSD_TEAM_NEW_ANONYMOUS,
				component: GdsdTeamWizardNewComponent,
			},
			{
				path: GuideDogServiceDogRoutes.GDSD_TEAM_RENEWAL_ANONYMOUS,
				component: GdsdTeamWizardRenewalComponent,
			},
			{
				path: GuideDogServiceDogRoutes.GDSD_TEAM_REPLACEMENT_ANONYMOUS,
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
				path: GuideDogServiceDogRoutes.DOG_TRAINER_NEW_ANONYMOUS,
				component: DogTrainerWizardNewRenewalComponent,
			},
			{
				path: GuideDogServiceDogRoutes.DOG_TRAINER_RENEWAL_ANONYMOUS,
				component: DogTrainerWizardNewRenewalComponent,
			},
			{
				path: GuideDogServiceDogRoutes.DOG_TRAINER_REPLACEMENT_ANONYMOUS,
				component: DogTrainerWizardReplacementComponent,
			},
			{
				path: GuideDogServiceDogRoutes.RETIRED_DOG_APPLICATION_TYPE_ANONYMOUS,
				component: StepRdApplicationTypeComponent,
			},
			// {
			// 	path: GuideDogServiceDogRoutes.RETIRED_DOG_ACCESS_CODE_ANONYMOUS,
			// 	component: StepDtLicenceAccessCodeComponent,
			// },
			{
				path: GuideDogServiceDogRoutes.RETIRED_DOG_NEW_ANONYMOUS,
				component: RetiredDogWizardNewRenewalComponent,
			},
			// {
			// 	path: GuideDogServiceDogRoutes.RETIRED_DOG_RENEWAL_ANONYMOUS,
			// 	component: RetiredDogWizardNewRenewalComponent,
			// },
			// {
			// 	path: GuideDogServiceDogRoutes.RETIRED_DOG_REPLACEMENT_ANONYMOUS,
			// 	component: RetiredDogWizardNewRenewalComponent, // TODO retired dog replacement
			// },
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
				path: GuideDogServiceDogRoutes.GDSD_TEAM_NEW_AUTHENTICATED,
				component: GdsdTeamWizardNewComponent,
			},
			{
				path: GuideDogServiceDogRoutes.GDSD_TEAM_RENEWAL_AUTHENTICATED,
				component: GdsdTeamWizardRenewalComponent,
			},
			{
				path: GuideDogServiceDogRoutes.GDSD_TEAM_REPLACEMENT_AUTHENTICATED,
				component: GdsdTeamWizardReplacementComponent,
			},
			{
				path: GuideDogServiceDogRoutes.RETIRED_DOG_NEW_AUTHENTICATED,
				component: RetiredDogWizardNewRenewalComponent,
			},
			{
				path: GuideDogServiceDogRoutes.RETIRED_DOG_RENEWAL_AUTHENTICATED,
				component: GdsdTeamWizardRenewalComponent,
			},
			{
				path: GuideDogServiceDogRoutes.RETIRED_DOG_REPLACEMENT_AUTHENTICATED,
				component: GdsdTeamWizardReplacementComponent,
			},
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
