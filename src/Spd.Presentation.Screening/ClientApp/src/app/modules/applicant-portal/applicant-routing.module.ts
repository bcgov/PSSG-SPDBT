import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicantComponent } from './applicant.component';
import { CrcDetailComponent } from './components/crc-detail.component';
import { CrcListComponent } from './components/crc-list.component';

export class ApplicantRoutes {
	public static APPLICANT_PORTAL = 'applicant';
	public static CRC_LIST = 'crc-list';
	public static CRC_DETAIL = 'crc-detail';

	public static MODULE_PATH = ApplicantRoutes.APPLICANT_PORTAL;

	public static path(route: string | null = null): string {
		return route ? `/${ApplicantRoutes.MODULE_PATH}/${route}` : `/${ApplicantRoutes.MODULE_PATH}`;
	}
}

const routes: Routes = [
	{
		path: '',
		component: ApplicantComponent,
		children: [
			{ path: ApplicantRoutes.CRC_LIST, component: CrcListComponent },
			{ path: ApplicantRoutes.CRC_DETAIL, component: CrcDetailComponent },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ApplicantRoutingModule {}
