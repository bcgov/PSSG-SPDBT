import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PssoaRoutingModule } from './pssoa-routing.module';
import { PssoaComponent } from './pssoa.component';

@NgModule({
	declarations: [
    PssoaComponent
  ],
	imports: [SharedModule, PssoaRoutingModule],
})
export class PssoaPortalModule {}
