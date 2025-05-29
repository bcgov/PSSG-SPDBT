import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from './app.routes';
import { GdsdLicenceMainComponent } from './components/authenticated/gdsd-licence-main.component';
import { DogTrainerWizardNewRenewalComponent } from './components/dog-trainer/dog-trainer-wizard-new-renewal.component';
import { DogTrainerWizardReplacementComponent } from './components/dog-trainer/dog-trainer-wizard-replacement.component';
import { StepDtApplicationTypeComponent } from './components/dog-trainer/step-dt-application-type.component';
import { StepDtLicenceAccessCodeComponent } from './components/dog-trainer/step-dt-licence-access-code.component';
import { GdsdBaseAnonymousComponent } from './components/gdsd-base-anonymous.component';
import { GdsdBaseAuthenticatedComponent } from './components/gdsd-base-authenticated.component';
import { GdsdLandingComponent } from './components/gdsd-landing.component';
import { GdsdTeamWizardNewRenewalComponent } from './components/gdsd-team/gdsd-team-wizard-new-renewal.component';
import { GdsdTeamWizardReplacementComponent } from './components/gdsd-team/gdsd-team-wizard-replacement.component';
import { StepTeamApplicationTypeComponent } from './components/gdsd-team/step-team-application-type.component';
import { StepTeamLicenceAccessCodeComponent } from './components/gdsd-team/step-team-licence-access-code.component';
import { RetiredDogWizardNewRenewalComponent } from './components/retired-dog/retired-dog-wizard-new-renewal.component';
import { RetiredDogWizardReplacementComponent } from './components/retired-dog/retired-dog-wizard-replacement.component';
import { StepRdApplicationTypeComponent } from './components/retired-dog/step-rd-application-type.component';
import { StepRdLicenceAccessCodeComponent } from './components/retired-dog/step-rd-licence-access-code.component';
import { GdsdApplicationReceivedComponent } from './components/shared/gdsd-application-received.component';
import { AccessDeniedComponent } from './shared/components/access-denied.component';

const routes: Routes = [
	{
		path: '',
		component: GdsdLandingComponent,
	},
	{
		/**************************************************** */
		// ANONYMOUS
		/**************************************************** */
		path: AppRoutes.GDSD_ANONYMOUS_BASE,
		component: GdsdBaseAnonymousComponent,
		children: [
			{
				path: AppRoutes.GDSD_TEAM_APPLICATION_TYPE_ANONYMOUS,
				component: StepTeamApplicationTypeComponent,
			},
			{
				path: AppRoutes.GDSD_TEAM_ACCESS_CODE_ANONYMOUS,
				component: StepTeamLicenceAccessCodeComponent,
			},
			{
				path: AppRoutes.GDSD_TEAM_NEW_ANONYMOUS,
				component: GdsdTeamWizardNewRenewalComponent,
			},
			{
				path: AppRoutes.GDSD_TEAM_RENEWAL_ANONYMOUS,
				component: GdsdTeamWizardNewRenewalComponent,
			},
			{
				path: AppRoutes.GDSD_TEAM_REPLACEMENT_ANONYMOUS,
				component: GdsdTeamWizardReplacementComponent,
			},
			{
				path: AppRoutes.DOG_TRAINER_APPLICATION_TYPE_ANONYMOUS,
				component: StepDtApplicationTypeComponent,
			},
			{
				path: AppRoutes.DOG_TRAINER_ACCESS_CODE_ANONYMOUS,
				component: StepDtLicenceAccessCodeComponent,
			},
			{
				path: AppRoutes.DOG_TRAINER_NEW_ANONYMOUS,
				component: DogTrainerWizardNewRenewalComponent,
			},
			{
				path: AppRoutes.DOG_TRAINER_RENEWAL_ANONYMOUS,
				component: DogTrainerWizardNewRenewalComponent,
			},
			{
				path: AppRoutes.DOG_TRAINER_REPLACEMENT_ANONYMOUS,
				component: DogTrainerWizardReplacementComponent,
			},
			{
				path: AppRoutes.RETIRED_DOG_APPLICATION_TYPE_ANONYMOUS,
				component: StepRdApplicationTypeComponent,
			},
			{
				path: AppRoutes.RETIRED_DOG_ACCESS_CODE_ANONYMOUS,
				component: StepRdLicenceAccessCodeComponent,
			},
			{
				path: AppRoutes.RETIRED_DOG_NEW_ANONYMOUS,
				component: RetiredDogWizardNewRenewalComponent,
			},
			{
				path: AppRoutes.RETIRED_DOG_RENEWAL_ANONYMOUS,
				component: RetiredDogWizardNewRenewalComponent,
			},
			{
				path: AppRoutes.RETIRED_DOG_REPLACEMENT_ANONYMOUS,
				component: RetiredDogWizardReplacementComponent,
			},
		],
	},
	{
		/**************************************************** */
		// AUTHENTICATED
		/**************************************************** */
		path: AppRoutes.GDSD_AUTHENTICATED_BASE,
		component: GdsdBaseAuthenticatedComponent,
		children: [
			{
				path: '',
				component: GdsdLicenceMainComponent,
			},
			{
				path: AppRoutes.GDSD_TEAM_NEW_AUTHENTICATED,
				component: GdsdTeamWizardNewRenewalComponent,
			},
			{
				path: AppRoutes.GDSD_TEAM_RENEWAL_AUTHENTICATED,
				component: GdsdTeamWizardNewRenewalComponent,
			},
			{
				path: AppRoutes.GDSD_TEAM_REPLACEMENT_AUTHENTICATED,
				component: GdsdTeamWizardReplacementComponent,
			},
			{
				path: AppRoutes.RETIRED_DOG_NEW_AUTHENTICATED,
				component: RetiredDogWizardNewRenewalComponent,
			},
			{
				path: AppRoutes.RETIRED_DOG_RENEWAL_AUTHENTICATED,
				component: RetiredDogWizardNewRenewalComponent,
			},
			{
				path: AppRoutes.RETIRED_DOG_REPLACEMENT_AUTHENTICATED,
				component: RetiredDogWizardReplacementComponent,
			},
			{
				path: '**',
				redirectTo: AppRoutes.pathGdsdMainApplications(),
				pathMatch: 'full',
			},
		],
	},
	{
		path: AppRoutes.GDSD_APPLICATION_RECEIVED,
		component: GdsdApplicationReceivedComponent,
	},
	{
		path: AppRoutes.ACCESS_DENIED,
		component: AccessDeniedComponent,
	},
	{
		path: '**',
		redirectTo: AppRoutes.path(AppRoutes.LANDING),
		pathMatch: 'full',
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
	exports: [RouterModule],
})
export class AppRoutingModule {}
