import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApplicantRoutingModule } from './applicant-routing.module';
import { ApplicantComponent } from './applicant.component';
import { CrcDetailComponent } from './components/crc-detail.component';
import { CrcListComponent } from './components/crc-list.component';

@NgModule({
	declarations: [ApplicantComponent, CrcListComponent, CrcDetailComponent],
	imports: [SharedModule, ApplicantRoutingModule],
})
export class ApplicantPortalModule {}
