import { Pipe, PipeTransform } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { NgxMaskPipe } from 'ngx-mask';

@Pipe({
	name: 'formatPhoneNumber',
})
export class FormatPhoneNumberPipe implements PipeTransform {
	constructor(private ngxMaskPipe: NgxMaskPipe) {}

	public transform(phoneNumber: any): string | null {
		if (!phoneNumber) {
			return null;
		}

		const strippedPhoneNumber = phoneNumber.replace(/\D/g, '');
		if (strippedPhoneNumber.length === 10) {
			return this.ngxMaskPipe.transform(phoneNumber, SPD_CONSTANTS.phone.displayMask);
		}

		return phoneNumber;
	}
}