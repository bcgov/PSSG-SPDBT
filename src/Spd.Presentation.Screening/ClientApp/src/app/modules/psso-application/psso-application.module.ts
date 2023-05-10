import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PssoRoutingModule } from './psso-routing.module';
import { PssoComponent } from './psso.component';
import { ScreeningStatusesComponent } from './components/screening-statuses.component';

@NgModule({
	declarations: [PssoComponent, ScreeningStatusesComponent],
	imports: [SharedModule, PssoRoutingModule],
})
export class PssoApplicationModule {}
