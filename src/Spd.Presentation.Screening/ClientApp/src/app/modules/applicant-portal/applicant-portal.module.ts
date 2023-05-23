import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApplicantPortalRoutingModule } from './applicant-portal-routing.module';
import { ApplicantPortalComponent } from './applicant-portal.component';
import { CrcListComponent } from './components/crc-list.component';
import { CrcDetailComponent } from './components/crc-detail.component';

@NgModule({
	declarations: [ApplicantPortalComponent, CrcListComponent, CrcDetailComponent],
	imports: [SharedModule, ApplicantPortalRoutingModule],
})
export class ApplicantPortalModule {}
