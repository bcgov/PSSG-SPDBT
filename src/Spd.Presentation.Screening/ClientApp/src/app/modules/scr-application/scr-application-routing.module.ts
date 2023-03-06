import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScrApplicationComponent } from './scr-application.component';

export class ScrApplicationRoutes {
	public static SCR_APPLICATION = 'scr-application';
	public static MODULE_PATH = ScrApplicationRoutes.SCR_APPLICATION;
}

const routes: Routes = [
	{
		path: '',
		component: ScrApplicationComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)], //, { scrollPositionRestoration: 'top' })],
	exports: [RouterModule],
})
export class ScrApplicationRoutingModule {}
