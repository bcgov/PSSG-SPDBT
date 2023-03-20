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
		return firstName && lastName ? `${firstName} ${lastName}` : '';
	}
}
