import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { GuideDogServiceDogBaseComponent } from './components/guide-dog-service-dog-base.component';
import { GuideDogServiceDogMainComponent } from './components/guide-dog-service-dog-main.component';
import { GuideDogServiceDogRoutingModule } from './guide-dog-service-dog-routing.module';

@NgModule({
	declarations: [GuideDogServiceDogBaseComponent, GuideDogServiceDogMainComponent],
	imports: [SharedModule, GuideDogServiceDogRoutingModule],
})
export class GuideDogServiceDogModule {}
