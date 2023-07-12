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
		if (lastName) {
			return !firstName ? lastName : `${firstName} ${lastName}`;
		}

		const { givenName, surname } = model;
		if (surname) {
			return !givenName ? surname : `${givenName} ${surname}`;
		}

		return '';
	}
}
