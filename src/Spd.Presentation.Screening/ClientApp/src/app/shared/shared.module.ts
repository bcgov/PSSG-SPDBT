import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { MaterialModule } from '../material.module';
import { AccessDeniedComponent } from './components/access-denied.component';
import { AddressAutocompleteComponent } from './components/address-autocomplete.component';
import { AddressModalComponent } from './components/address-modal.component';
import { AlertComponent } from './components/alert.component';
import { FooterComponent } from './components/app-footer.component';
import { HeaderComponent } from './components/app-header.component';
import { BaseFilterComponent } from './components/base-filter.component';
import { CaptchaV2Component } from './components/captcha-v2.component';
import { DialogComponent } from './components/dialog.component';
import { DropdownOverlayComponent } from './components/dropdown-overlay.component';
import { FileUploadComponent } from './components/file-upload.component';
import { OrgSelectionModalComponent } from './components/org-selection-modal.component';
import { StatusStatisticsComponent } from './components/status-statistics.component';
import { StepTitleComponent } from './components/step-title.component';
import { DefaultPipe } from './pipes/default.pipe';
import { FullnamePipe } from './pipes/fullname.pipe';
import { OptionsPipe } from './pipes/options.pipe';
import { YesNoPipe } from './pipes/yes-no.pipe';

const SHARED_COMPONENTS = [
	HeaderComponent,
	FooterComponent,
	DialogComponent,
	AddressAutocompleteComponent,
	AddressModalComponent,
	OrgSelectionModalComponent,
	DropdownOverlayComponent,
	BaseFilterComponent,
	StepTitleComponent,
	DefaultPipe,
	FullnamePipe,
	YesNoPipe,
	OptionsPipe,
	CaptchaV2Component,
	FileUploadComponent,
	AccessDeniedComponent,
	AlertComponent,
	StatusStatisticsComponent,
];

@NgModule({
	declarations: [...SHARED_COMPONENTS, BaseFilterComponent],
	imports: [
		CommonModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		NgxMaskDirective,
		NgxMaskPipe,
		NgxDropzoneModule,
		RecaptchaFormsModule,
		RecaptchaModule,
	],
	providers: [provideNgxMask(), NgxMaskPipe, OptionsPipe],
	exports: [
		CommonModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		NgxMaskDirective,
		NgxMaskPipe,
		NgxDropzoneModule,
		...SHARED_COMPONENTS,
	],
})
export class SharedModule {}
