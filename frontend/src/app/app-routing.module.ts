import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing.component';

const routes: Routes = [
	{
		path: '',
		component: LandingComponent,
	},
	{
		path: 'register',
		loadChildren: () => import('./modules/registration/registration.module').then((m) => m.RegistrationModule),
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
