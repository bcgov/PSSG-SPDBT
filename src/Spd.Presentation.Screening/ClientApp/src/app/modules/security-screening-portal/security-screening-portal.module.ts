import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CrcDetailComponent } from './components/crc-detail.component';
import { CrcListComponent } from './components/crc-list.component';
import { CrcUploadModalComponent } from './components/crc-upload-modal.component';
import { SecurityScreeningRoutingModule } from './security-screening-routing.module';
import { SecurityScreeningComponent } from './security-screening.component';

@NgModule({
	declarations: [SecurityScreeningComponent, CrcListComponent, CrcDetailComponent, CrcUploadModalComponent],
	imports: [SharedModule, SecurityScreeningRoutingModule],
})
export class SecurityScreeningPortalModule {}
