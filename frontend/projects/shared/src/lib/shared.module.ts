import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { FooterComponent } from './components/app-footer.component';
import { HeaderComponent } from './components/app-header.component';
import { MaterialModule } from './material.module';

const SHARED_COMPONENTS = [HeaderComponent, FooterComponent];

@NgModule({
  declarations: [...SHARED_COMPONENTS],
  imports: [CommonModule, MaterialModule, NgxMaskDirective, NgxMaskPipe],
  providers: [provideNgxMask()],
  exports: [CommonModule, NgxMaskDirective, NgxMaskPipe, ...SHARED_COMPONENTS],
})
export class SharedModule {}
