import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrcApplicationComponent } from './crc-application.component';

export class CrcApplicationRoutes {
	public static CRC_APPLICATION = 'crc-application';
	public static MODULE_PATH = CrcApplicationRoutes.CRC_APPLICATION;
}

const routes: Routes = [
	{
		path: '',
		component: CrcApplicationComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)], //, { scrollPositionRestoration: 'top' })],
	exports: [RouterModule],
})
export class CrcApplicationRoutingModule {}
