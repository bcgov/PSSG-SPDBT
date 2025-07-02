import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityLicenceStatusVerificationBaseComponent } from './components/security-licence-status-verification-base.component';
import { SecurityLicenceStatusVerificationMainComponent } from './components/security-licence-status-verification-main.component';
import { SecurityLicenceStatusVerificationSblComponent } from './components/security-licence-status-verification-sbl.component';
import { SecurityLicenceStatusVerificationSwlComponent } from './components/security-licence-status-verification-swl.component';
import { SecurityLicenceStatusVerificationSwlsComponent } from './components/security-licence-status-verification-swls.component';
import { SecurityLicenceStatusVerificationRoutes } from './security-licence-status-verification-routes';

const routes: Routes = [
	{
		path: '',
		component: SecurityLicenceStatusVerificationBaseComponent,
		children: [
			{
				path: '',
				component: SecurityLicenceStatusVerificationMainComponent,
			},
			{
				path: SecurityLicenceStatusVerificationRoutes.SECURITY_LICENCE_STATUS_VERIFICATION_SWL,
				component: SecurityLicenceStatusVerificationSwlComponent,
			},
			{
				path: SecurityLicenceStatusVerificationRoutes.SECURITY_LICENCE_STATUS_VERIFICATION_SWLS,
				component: SecurityLicenceStatusVerificationSwlsComponent,
			},
			{
				path: SecurityLicenceStatusVerificationRoutes.SECURITY_LICENCE_STATUS_VERIFICATION_SBL,
				component: SecurityLicenceStatusVerificationSblComponent,
			},
		],
	},
	{
		path: '**',
		redirectTo: SecurityLicenceStatusVerificationRoutes.path(),
		pathMatch: 'full',
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SecurityLicenceStatusVerificationRoutingModule {}
