import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing.component';

const routes: Routes = [
	{
		path: '',
		component: LandingComponent,
	},
	// {
	// 	path: 'register',
	// 	component: RegistrationComponent,
	// },
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
	exports: [RouterModule],
})
export class AppRoutingModule {}
