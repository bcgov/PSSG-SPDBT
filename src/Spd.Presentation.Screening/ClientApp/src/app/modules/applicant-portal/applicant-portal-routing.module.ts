import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicantPortalComponent } from './applicant-portal.component';
import { CrcDetailComponent } from './components/crc-detail.component';
import { CrcListComponent } from './components/crc-list.component';

export class ApplicantPortalRoutes {
	public static APPLICANT_PORTAL = 'applicant';
	public static CRC_LIST = 'crc-list';
	public static CRC_DETAIL = 'crc-detail';

	public static MODULE_PATH = ApplicantPortalRoutes.APPLICANT_PORTAL;

	public static path(route: string | null = null): string {
		return route ? `/${ApplicantPortalRoutes.MODULE_PATH}/${route}` : `/${ApplicantPortalRoutes.MODULE_PATH}`;
	}
}

const routes: Routes = [
	{
		path: '',
		component: ApplicantPortalComponent,
		children: [
			{ path: ApplicantPortalRoutes.CRC_LIST, component: CrcListComponent },
			{ path: ApplicantPortalRoutes.CRC_DETAIL, component: CrcDetailComponent },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ApplicantPortalRoutingModule {}
