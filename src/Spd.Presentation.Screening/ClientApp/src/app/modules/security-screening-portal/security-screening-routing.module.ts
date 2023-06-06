import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrcDetailComponent } from './components/crc-detail.component';
import { CrcListComponent } from './components/crc-list.component';
import { SecurityScreeningComponent } from './security-screening.component';

export class SecurityScreeningRoutes {
	public static SECURITY_SCREENING_APPLICATION = 'scr-application';
	public static CRC_LIST = 'crc-list';
	public static CRC_DETAIL = 'crc-detail';

	public static MODULE_PATH = SecurityScreeningRoutes.SECURITY_SCREENING_APPLICATION;

	public static path(route: string | null = null): string {
		return route ? `/${SecurityScreeningRoutes.MODULE_PATH}/${route}` : `/${SecurityScreeningRoutes.MODULE_PATH}`;
	}
}

const routes: Routes = [
	{
		path: '',
		component: SecurityScreeningComponent,
		children: [
			{ path: SecurityScreeningRoutes.CRC_LIST, component: CrcListComponent },
			{ path: SecurityScreeningRoutes.CRC_DETAIL, component: CrcDetailComponent },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SecurityScreeningRoutingModule {}
