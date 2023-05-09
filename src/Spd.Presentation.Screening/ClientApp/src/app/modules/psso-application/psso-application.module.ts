import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PssoRoutingModule } from './psso-routing.module';
import { PssoComponent } from './psso.component';

@NgModule({
	declarations: [PssoComponent],
	imports: [SharedModule, PssoRoutingModule],
})
export class PssoApplicationModule {}
