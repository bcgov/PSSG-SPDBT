import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScreeningStatusesComponent } from './components/screening-statuses.component';
import { PssoRoutingModule } from './psso-routing.module';
import { PssoComponent } from './psso.component';

@NgModule({
	declarations: [PssoComponent, ScreeningStatusesComponent],
	imports: [SharedModule, PssoRoutingModule],
})
export class PssoPortalModule {}
