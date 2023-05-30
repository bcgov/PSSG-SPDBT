import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrcComponent } from './crc.component';

export class CrcRoutes {
	public static CRC_APPLICATION = 'crca';
	public static MODULE_PATH = CrcRoutes.CRC_APPLICATION;

	public static path(route: string): string {
		return `/${route}`;
	}
}

const routes: Routes = [
	{
		path: '',
		component: CrcComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)], //, { scrollPositionRestoration: 'top' })],
	exports: [RouterModule],
})
export class CrcApplicationRoutingModule {}
