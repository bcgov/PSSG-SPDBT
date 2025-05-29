import { Pipe, PipeTransform } from '@angular/core';
import { NgxMaskPipe } from 'ngx-mask';
import { SPD_LIBRARY_CONSTANTS } from './spd-library-constants';

@Pipe({
  name: 'formatPhoneNumber',
  standalone: false,
})
export class SpdLibraryFormatPhoneNumberPipe implements PipeTransform {
  constructor(private ngxMaskPipe: NgxMaskPipe) {}

  public transform(phoneNumber: any): string | null {
    if (!phoneNumber) {
      return null;
    }

    // if the phone number has 10 digits, then format it.
    // otherwise, return it as is.

    const strippedPhoneNumber = phoneNumber.replace(/\D/g, '');
    if (strippedPhoneNumber.length === 10) {
      return this.ngxMaskPipe.transform(
        phoneNumber,
        SPD_LIBRARY_CONSTANTS.phone.displayMask
      );
    }

    return phoneNumber;
  }
}
