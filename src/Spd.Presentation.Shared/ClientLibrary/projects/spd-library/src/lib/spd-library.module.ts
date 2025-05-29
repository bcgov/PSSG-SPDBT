import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { NgxMaskPipe } from 'ngx-mask';
import { SpdLibraryDefaultPipe } from './spd-library-default.pipe';
import { SpdLibraryFileDragNDropDirective } from './spd-library-file-drag-n-drop.directive';
import { SpdLibraryFormErrorStateMatcher } from './spd-library-form-error-state-matcher.directive';
import { SpdLibraryFormatDatePipe } from './spd-library-format-date.pipe';
import { SpdLibraryFormatPhoneNumberPipe } from './spd-library-format-phone-number.pipe';
import { SpdLibraryFullnamePipe } from './spd-library-fullname.pipe';
import { SpdLibraryPhoneNumberTransformDirective } from './spd-library-phone-number-transform.directive';
import { SpdLibraryUtilService } from './spd-library-util.service';
import { SpdLibraryYesNoPipe } from './spd-library-yes-no.pipe';

const COMPONENTS = [
  SpdLibraryDefaultPipe,
  SpdLibraryFileDragNDropDirective,
  SpdLibraryFormatDatePipe,
  SpdLibraryFullnamePipe,
  SpdLibraryPhoneNumberTransformDirective,
  SpdLibraryFormatPhoneNumberPipe,
  SpdLibraryYesNoPipe,
];

@NgModule({
  imports: [CommonModule, NgxMaskPipe],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  providers: [
    SpdLibraryUtilService,
    { provide: ErrorStateMatcher, useClass: SpdLibraryFormErrorStateMatcher },
  ],
})
export class SpdLibraryModule {}
