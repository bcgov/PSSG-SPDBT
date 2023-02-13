import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { AddressAutocompleteComponent } from './components/address-autocomplete.component';
import { FooterComponent } from './components/app-footer.component';
import { HeaderComponent } from './components/app-header.component';
import { DialogComponent } from './components/dialog.component';
import { MaterialModule } from './material.module';

const SHARED_COMPONENTS = [HeaderComponent, FooterComponent, DialogComponent, AddressAutocompleteComponent];

@NgModule({
	declarations: [...SHARED_COMPONENTS],
	imports: [
		CommonModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		NgxMaskDirective,
		NgxMaskPipe,
		NgxDropzoneModule,
	],
	providers: [provideNgxMask()],
	exports: [CommonModule, NgxMaskDirective, NgxMaskPipe, NgxDropzoneModule, ...SHARED_COMPONENTS],
})
export class SharedModule {}
