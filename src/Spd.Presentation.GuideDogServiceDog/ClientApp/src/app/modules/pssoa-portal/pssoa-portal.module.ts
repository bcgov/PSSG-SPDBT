import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { InvitationPssoaComponent } from './invitation-pssoa.component';
import { PssoaRoutingModule } from './pssoa-routing.module';
import { PssoaComponent } from './pssoa.component';

@NgModule({
	declarations: [PssoaComponent, InvitationPssoaComponent],
	imports: [SharedModule, PssoaRoutingModule],
})
export class PssoaPortalModule {}
