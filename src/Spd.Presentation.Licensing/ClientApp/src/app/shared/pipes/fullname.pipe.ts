import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'fullname',
})
export class FullnamePipe implements PipeTransform {
	public transform(model: any): string | null {
		if (!model) {
			return null;
		}

		const { firstName, lastName } = model;
		if (firstName || lastName) {
			return `${firstName ?? ''} ${lastName ?? ''}`.trim();
		}

		const { givenName, surname } = model;
		if (givenName || surname) {
			return `${givenName ?? ''} ${surname ?? ''}`.trim();
		}

		return null;
	}
}
