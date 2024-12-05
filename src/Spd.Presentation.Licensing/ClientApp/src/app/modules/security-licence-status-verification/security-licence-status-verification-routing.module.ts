import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityLicenceStatusVerificationBaseComponent } from './components/security-licence-status-verification-base.component';
import { SecurityLicenceStatusVerificationMainComponent } from './components/security-licence-status-verification-main.component';
import { SecurityLicenceStatusVerificationSwlComponent } from './components/security-licence-status-verification-swl.component';
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
				path: 'swl',
				component: SecurityLicenceStatusVerificationSwlComponent,
			},
		],
	},
	{
		path: '',
		redirectTo: SecurityLicenceStatusVerificationRoutes.path(),
		pathMatch: 'full',
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SecurityLicenceStatusVerificationRoutingModule {}
