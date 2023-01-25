import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material.module';
import { FooterComponent } from './components/app-footer.component';
import { HeaderComponent } from './components/app-header.component';

const SHARED_COMPONENTS = [HeaderComponent, FooterComponent];

@NgModule({
	declarations: [...SHARED_COMPONENTS],
	imports: [CommonModule, MaterialModule],
	exports: [CommonModule, ...SHARED_COMPONENTS],
})
export class SharedModule {}
